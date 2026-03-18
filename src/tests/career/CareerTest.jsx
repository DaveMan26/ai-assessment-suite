import { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  TEST_CONFIG,
  DIMENSIONS,
  SCALE_ITEMS,
  SCENARIOS,
  FORCED_CHOICE_PAIRS,
  SLIDER_LABELS,
  TOTAL_ITEMS
} from './careerData';
import {
  calculateCareerScores,
  identifyTopOrientations,
  identifyLowDimensions
} from './careerScoring';
import {
  getPracticalImplications,
  generateCareerMarkdown,
  generateCareerHTML,
  practicalMarkdownToHtml,
  DEVELOPMENT_TIPS
} from './careerExport';
import { interleaveQuestionsAndScenarios } from '../../lib/shuffle';
import { getLevel } from '../../lib/levels';
import { saveResults } from '../../lib/storage';
import { useResults } from '../../context/ResultsContext';
import TestIntro from '../../components/TestIntro';
import RadarChart from '../../components/RadarChart';
import DimensionBar from '../../components/DimensionBar';
import ExportPanel from '../../components/ExportPanel';
import SliderQuestion from '../../components/SliderQuestion';
import ScenarioQuestion from '../../components/ScenarioQuestion';
import ForcedChoiceQuestion from '../../components/ForcedChoiceQuestion';

const INTRO_CONFIG = {
  ...TEST_CONFIG,
  minutes: TEST_CONFIG.estimatedMinutes,
  questionCount: String(TOTAL_ITEMS),
  dimensionCount: TEST_CONFIG.dimensionCount,
  type: 'Smíšený'
};

function buildAllSteps() {
  const mixed = interleaveQuestionsAndScenarios(SCALE_ITEMS, SCENARIOS, 5);
  return [
    ...mixed.map(data => ({ kind: 'mixed', data })),
    ...FORCED_CHOICE_PAIRS.map(p => ({ kind: 'fc', data: p }))
  ];
}

export default function CareerTest() {
  const { saveTestResult } = useResults();
  const [phase, setPhase] = useState('intro');
  const [allSteps, setAllSteps] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [likertAnswers, setLikertAnswers] = useState({});
  const [scenarioAnswers, setScenarioAnswers] = useState({});
  const [fcAnswers, setFcAnswers] = useState({});
  const [sliderVal, setSliderVal] = useState(null);
  const [animating, setAnimating] = useState(false);
  const [scores, setScores] = useState(null);
  const [topDims, setTopDims] = useState([]);
  const [flatProfile, setFlatProfile] = useState(false);
  const [personalAverage, setPersonalAverage] = useState(0);
  const [lowDims, setLowDims] = useState([]);

  const startTest = () => {
    setAllSteps(buildAllSteps());
    setCurrentIdx(0);
    setLikertAnswers({});
    setScenarioAnswers({});
    setFcAnswers({});
    setSliderVal(null);
    setScores(null);
    setTopDims([]);
    setFlatProfile(false);
    setPersonalAverage(0);
    setLowDims([]);
    setPhase('test');
    const first = buildAllSteps()[0];
    if (first?.kind === 'mixed' && first.data.type === 'scale') {
      setSliderVal(null);
    }
  };

  const step = allSteps[currentIdx];
  const isMixed = step?.kind === 'mixed';
  const isFc = step?.kind === 'fc';
  const isScale = isMixed && step?.data?.type === 'scale';
  const isScenario = isMixed && step?.data?.type === 'scenario';

  const currentScaleId = isScale ? step.data.data.id : null;
  const currentScenarioId = isScenario ? step.data.data.id : null;
  const currentPairId = isFc ? step.data.id : null;

  let hasAnswer = false;
  if (isScale) hasAnswer = sliderVal != null;
  else if (isScenario) hasAnswer = scenarioAnswers[currentScenarioId] != null;
  else if (isFc) hasAnswer = fcAnswers[currentPairId] != null;

  const progress = allSteps.length ? ((currentIdx + 1) / TOTAL_ITEMS) * 100 : 0;
  const pairIndexInBlock = isFc
    ? FORCED_CHOICE_PAIRS.findIndex(p => p.id === currentPairId)
    : -1;

  const finishTest = useCallback(
    (finalLikert, finalScenario, finalFc) => {
      const merged = calculateCareerScores(finalLikert, finalScenario, finalFc);
      const { topDims: top, flatProfile: flat, personalAverage: avg } =
        identifyTopOrientations(merged);
      const low = identifyLowDimensions(merged, avg);
      setScores(merged);
      setTopDims(top);
      setFlatProfile(flat);
      setPersonalAverage(avg);
      setLowDims(low);

      const sorted = Object.keys(DIMENSIONS).sort(
        (a, b) => (merged[b] ?? 0) - (merged[a] ?? 0)
      );
      const topEng = top.map(d => DIMENSIONS[d].eng);
      const resultData = {
        test: TEST_CONFIG.id,
        test_name: TEST_CONFIG.fullName,
        version: TEST_CONFIG.version,
        date: new Date().toISOString().split('T')[0],
        questions_count: 52,
        scenarios_count: SCENARIOS.length,
        forced_choice_count: FORCED_CHOICE_PAIRS.length,
        scale: TEST_CONFIG.scaleDescription,
        scores: merged,
        top_orientations: topEng,
        ranking: sorted.map((d, i) => ({
          rank: i + 1,
          dimension: DIMENSIONS[d].eng,
          score: Math.round(merged[d])
        })),
        personal_average: avg,
        flat_profile: flat
      };
      saveResults(TEST_CONFIG.id, resultData);
      saveTestResult('CAREER', resultData);
      setAnimating(false);
      setPhase('results');
    },
    [saveTestResult]
  );

  const submitAnswer = () => {
    if (animating || !hasAnswer || !step) return;
    setAnimating(true);

    let nextLikert = { ...likertAnswers };
    let nextScenario = { ...scenarioAnswers };
    let nextFc = { ...fcAnswers };

    if (isScale && currentScaleId) {
      nextLikert[currentScaleId] = sliderVal;
      setLikertAnswers(nextLikert);
    }
    if (isScenario && currentScenarioId != null) {
      /* already in scenarioAnswers via onSelect */
      nextScenario = { ...scenarioAnswers };
    }
    if (isFc && currentPairId) {
      nextFc = { ...fcAnswers };
    }

    if (currentIdx + 1 >= allSteps.length) {
      finishTest(nextLikert, nextScenario, nextFc);
      return;
    }

    setTimeout(() => {
      const nextIdx = currentIdx + 1;
      setCurrentIdx(nextIdx);
      const nextStep = allSteps[nextIdx];
      if (nextStep.kind === 'mixed' && nextStep.data.type === 'scale') {
        setSliderVal(nextLikert[nextStep.data.data.id] ?? null);
      } else {
        setSliderVal(null);
      }
      setAnimating(false);
    }, 280);
  };

  const goBack = () => {
    if (currentIdx <= 0) return;
    const prevIdx = currentIdx - 1;
    setCurrentIdx(prevIdx);
    const prevStep = allSteps[prevIdx];
    if (prevStep.kind === 'mixed' && prevStep.data.type === 'scale') {
      setSliderVal(likertAnswers[prevStep.data.data.id] ?? null);
    } else {
      setSliderVal(null);
    }
  };

  const restart = () => {
    setPhase('intro');
    setAllSteps([]);
    setCurrentIdx(0);
    setLikertAnswers({});
    setScenarioAnswers({});
    setFcAnswers({});
    setSliderVal(null);
    setAnimating(false);
    setScores(null);
    setTopDims([]);
    setFlatProfile(false);
    setLowDims([]);
  };

  /* --- INTRO --- */
  if (phase === 'intro') {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center px-4">
        <div className="max-w-md w-full">
          <Link
            to="/"
            className="inline-flex gap-1 text-sm text-[#888] hover:text-[#2D2D2D] transition-colors mb-8"
          >
            ← Zpět na menu
          </Link>
          <TestIntro config={INTRO_CONFIG} onStart={startTest} />
        </div>
      </div>
    );
  }

  /* --- TEST --- */
  if (phase === 'test' && allSteps.length > 0 && step) {
    const dim = isScale ? DIMENSIONS[step.data.data.dim] : null;
    const accentColor = dim?.color || TEST_CONFIG.accentColor;

    const scenarioForQuestion =
      isScenario && step.data.data
        ? {
            ...step.data.data,
            options: step.data.data.options.map(o => ({
              ...o,
              text: o.label
            }))
          }
        : null;

    return (
      <div className="min-h-screen bg-[#FDFBF7] flex flex-col">
        <div className="sticky top-0 z-50 bg-[#FDFBF7] border-b border-[#ebe8e2]">
          <div className="h-1 bg-[#f0ede8] overflow-hidden rounded-none">
            <div
              className="h-full transition-[width] duration-500 ease-out"
              style={{
                width: `${progress}%`,
                background:
                  'linear-gradient(90deg, #E07A5F 0%, #81B29A 100%)'
              }}
            />
          </div>
          <div className="flex justify-between items-center px-6 py-3">
            <span className="font-mono text-[13px] text-[#999]">
              {currentIdx + 1} / {TOTAL_ITEMS}
            </span>
            {isScale && dim && (
              <span
                className="text-xs font-semibold px-3 py-1 rounded-full"
                style={{ color: dim.color, background: dim.colorLight }}
              >
                {dim.icon} {dim.name}
              </span>
            )}
            {isScenario && (
              <span
                className="text-xs font-semibold px-3 py-1 rounded-full"
                style={{
                  color: TEST_CONFIG.accentColor,
                  background: TEST_CONFIG.accentColorLight
                }}
              >
                Scénář
              </span>
            )}
            {isFc && (
              <span
                className="text-xs font-semibold px-3 py-1 rounded-full"
                style={{
                  color: TEST_CONFIG.secondaryColor,
                  background: `${TEST_CONFIG.secondaryColor}22`
                }}
              >
                Párová volba
              </span>
            )}
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center px-6 py-8">
          <div
            key={currentIdx}
            className="max-w-[560px] w-full transition-all duration-300 ease-out"
            style={{
              opacity: animating ? 0.35 : 1,
              transform: animating ? 'translateY(6px)' : 'translateY(0)'
            }}
          >
            {isScale && (
              <SliderQuestion
                question={`„${step.data.data.text}"`}
                value={sliderVal}
                onChange={setSliderVal}
                labels={SLIDER_LABELS}
                accentColor={accentColor}
              />
            )}

            {isScenario && scenarioForQuestion && (
              <ScenarioQuestion
                scenario={scenarioForQuestion}
                selectedIndex={scenarioAnswers[currentScenarioId] ?? null}
                onSelect={i =>
                  setScenarioAnswers(prev => ({
                    ...prev,
                    [currentScenarioId]: i
                  }))
                }
                accentColor={TEST_CONFIG.accentColor}
              />
            )}

            {isFc && (
              <ForcedChoiceQuestion
                pair={step.data}
                selected={fcAnswers[currentPairId] ?? null}
                onSelect={val =>
                  setFcAnswers(prev => ({ ...prev, [currentPairId]: val }))
                }
                accentColor={TEST_CONFIG.accentColor}
                pairIndex={pairIndexInBlock}
                totalPairs={FORCED_CHOICE_PAIRS.length}
              />
            )}

            <div className="flex justify-between items-center mt-8 gap-3">
              {currentIdx > 0 ? (
                <button
                  type="button"
                  onClick={goBack}
                  className="bg-transparent border border-[#ddd] rounded-lg px-5 py-2.5 text-sm text-[#999] cursor-pointer hover:border-[#E07A5F] hover:text-[#E07A5F] transition-colors"
                >
                  ← Zpět
                </button>
              ) : (
                <div />
              )}
              <button
                type="button"
                onClick={submitAnswer}
                disabled={!hasAnswer}
                className="border-none rounded-[10px] px-10 py-3.5 text-base font-semibold text-white transition-all"
                style={{
                  background: accentColor,
                  opacity: hasAnswer ? 1 : 0.4,
                  cursor: hasAnswer ? 'pointer' : 'not-allowed',
                  boxShadow: `0 4px 12px ${accentColor}44`
                }}
              >
                {currentIdx + 1 >= allSteps.length
                  ? 'Dokončit test ✓'
                  : 'Další →'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* --- RESULTS --- */
  if (phase === 'results' && scores) {
    const dims = Object.keys(DIMENSIONS);
    const sortedByScore = [...dims].sort(
      (a, b) => (scores[b] ?? 0) - (scores[a] ?? 0)
    );
    const implications = getPracticalImplications(
      scores,
      topDims,
      lowDims,
      flatProfile,
      personalAverage
    );
    const topEng = topDims.map(d => DIMENSIONS[d].eng);
    const fullMarkdown = generateCareerMarkdown(
      TEST_CONFIG,
      DIMENSIONS,
      scores,
      implications.markdown,
      topEng,
      personalAverage
    );
    const lowDimsHtml =
      lowDims.length > 0
        ? `<div class="section"><h2>Oblasti, které vás méně přitahují</h2>${lowDims
            .map(d => {
              const tips = DEVELOPMENT_TIPS[d];
              const dim = DIMENSIONS[d];
              if (!tips)
                return '';
              const tipList = tips.tips
                .map(
                  t =>
                    `<p style="font-size:13px;color:#555;margin:4px 0 0 12px;">→ ${t.replace(/</g, '&lt;')}</p>`
                )
                .join('');
              return `<div style="border-left:4px solid ${dim.color};padding:12px 16px;margin-bottom:12px;background:#f8f6f1;border-radius:0 8px 8px 0;"><strong style="color:${dim.color};">${dim.icon} ${dim.name}</strong><p style="font-size:12px;color:#666;margin:6px 0;">${tips.insight} ${tips.reframe}</p>${tipList}</div>`;
            })
            .join('')}</div>`
        : '';

    const practicalHtml = practicalMarkdownToHtml(implications.markdown);
    const fullHtml = generateCareerHTML(
      TEST_CONFIG,
      DIMENSIONS,
      scores,
      practicalHtml,
      personalAverage,
      topDims,
      flatProfile,
      lowDimsHtml
    );
    const profile = implications.profile;

    return (
      <div className="min-h-screen bg-[#FDFBF7] px-6 py-10">
        <div className="max-w-[760px] mx-auto">
          <Link
            to="/"
            className="inline-flex gap-1 text-sm text-[#888] hover:text-[#2D2D2D] transition-colors mb-8"
          >
            ← Zpět na menu
          </Link>

          <div className="text-center mb-10">
            <div className="font-mono text-sm text-[#999] tracking-[3px] uppercase mb-2">
              Výsledky
            </div>
            <h1 className="font-serif-display text-4xl text-[#2D2D2D] font-normal mb-2">
              Kariérní kompas
            </h1>
            <p className="text-[#999] text-sm">
              35 škálových otázek, 7 scénářů, 10 párových voleb
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 mb-8 border border-[#ebe8e2] shadow-sm">
            <RadarChart
              scores={scores}
              dimensions={DIMENSIONS}
              referenceValue={personalAverage}
            />
            <p className="text-center text-xs text-[#999] mt-2">
              Čárkovaný obrys = váš průměr napříč dimenzemi ({Math.round(personalAverage)} %)
            </p>
          </div>

          <div className="bg-white rounded-2xl p-7 mb-8 border border-[#ebe8e2] shadow-sm">
            <h2 className="font-serif-display text-[22px] text-[#2D2D2D] font-normal mb-5">
              TOP orientace
            </h2>
            {flatProfile || topDims.length === 0 ? (
              <p className="text-[14px] text-[#555] leading-relaxed">
                Máte široký záběr — vaše preference jsou relativně vyrovnané. To
                může znamenat <strong>flexibilitu v kariérních volbách</strong>.
              </p>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {topDims.map(d => {
                  const dim = DIMENSIONS[d];
                  const pct = Math.round(scores[d]);
                  return (
                    <div
                      key={d}
                      className="rounded-2xl p-5 border"
                      style={{
                        borderColor: dim.colorLight,
                        backgroundColor: '#fffcf9'
                      }}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xl" style={{ color: dim.color }}>
                          {dim.icon}
                        </span>
                        <span className="font-semibold text-[#2D2D2D]">
                          {dim.name}
                        </span>
                        <span
                          className="ml-auto font-mono font-bold"
                          style={{ color: dim.color }}
                        >
                          {pct}%
                        </span>
                      </div>
                      <p className="text-[12px] text-[#666] leading-relaxed mb-2">
                        {dim.highDesc.slice(0, 160)}…
                      </p>
                      <p className="text-[11px] text-[#888]">
                        <strong>Role:</strong> {dim.roleExamples}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl p-7 mb-8 border border-[#ebe8e2] shadow-sm">
            <h2 className="font-serif-display text-[22px] text-[#2D2D2D] font-normal mb-4">
              Kariérní profil
            </h2>
            <p className="text-[15px] font-medium text-[#2D2D2D] mb-2">
              {profile.title}
            </p>
            <p className="text-[14px] text-[#555] leading-relaxed mb-6">
              {profile.text}
            </p>
            {!flatProfile && topDims.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-[#2D2D2D]">
                  Kariérní mapa — typické role a prostředí
                </h3>
                {topDims.map(d => {
                  const dim = DIMENSIONS[d];
                  return (
                    <div
                      key={d}
                      className="rounded-xl p-4 border-l-4"
                      style={{
                        borderColor: dim.color,
                        background: '#f8f6f1'
                      }}
                    >
                      <div className="font-semibold text-sm mb-1" style={{ color: dim.color }}>
                        {dim.icon} {dim.name}
                      </div>
                      <p className="text-[13px] text-[#555] mb-1">
                        <strong>Role:</strong> {dim.roleExamples}
                      </p>
                      <p className="text-[13px] text-[#555] mb-1">
                        <strong>Prostředí:</strong> {dim.environmentExamples}
                      </p>
                      <p className="text-[12px] text-[#666]">
                        <strong>Job crafting:</strong> {dim.jobCraftingTip}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl p-7 mb-8 border border-[#ebe8e2] shadow-sm">
            <h2 className="font-serif-display text-[22px] text-[#2D2D2D] font-normal mb-6">
              Dimenze (od nejsilnější)
            </h2>
            {sortedByScore.map(d => (
              <DimensionBar
                key={d}
                score={scores[d]}
                dimension={DIMENSIONS[d]}
              />
            ))}
          </div>

          <div className="bg-white rounded-2xl p-7 mb-8 border border-[#ebe8e2] shadow-sm">
            <h2 className="font-serif-display text-[22px] text-[#2D2D2D] font-normal mb-4">
              Co to znamená v praxi
            </h2>
            <div className="text-[13px] text-[#555] leading-relaxed space-y-4">
              {implications.sections.map((sec, idx) => (
                <div key={idx}>
                  {sec.split('\n').map((line, i) => {
                    if (!line.trim()) return null;
                    if (line.startsWith('### ')) {
                      return (
                        <h3
                          key={i}
                          className="font-serif-display text-lg text-[#2D2D2D] mt-4 mb-2"
                        >
                          {line.replace('### ', '')}
                        </h3>
                      );
                    }
                    if (line.startsWith('- ')) {
                      return (
                        <p key={i} className="ml-3 mb-1">
                          • {line.replace('- ', '')}
                        </p>
                      );
                    }
                    if (line.startsWith('**')) {
                      return (
                        <p key={i} className="mb-1 font-medium">
                          {line.replace(/\*\*/g, '')}
                        </p>
                      );
                    }
                    return (
                      <p key={i} className="mb-1">
                        {line}
                      </p>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          {lowDims.length > 0 && (
            <div className="bg-white rounded-2xl p-7 mb-8 border border-[#ebe8e2] shadow-sm">
              <h2 className="font-serif-display text-[22px] text-[#2D2D2D] font-normal mb-2">
                Oblasti, které vás méně přitahují
              </h2>
              <p className="text-xs text-[#888] mb-5">
                Skóre pod průměrem o více než 8 bodů — nejsou to slabiny, jen
                nižší priorita při výběru práce.
              </p>
              {lowDims.map(d => {
                const dim = DIMENSIONS[d];
                const tips = DEVELOPMENT_TIPS[d];
                if (!tips) return null;
                return (
                  <div
                    key={d}
                    className="mb-4 rounded-r-xl p-4"
                    style={{
                      borderLeft: `4px solid ${dim.color}`,
                      background: '#f8f6f1'
                    }}
                  >
                    <div className="font-semibold text-sm mb-1" style={{ color: dim.color }}>
                      {dim.icon} {dim.name}
                    </div>
                    <p className="text-xs text-[#666] mb-2">
                      {tips.insight} {tips.reframe}
                    </p>
                    {tips.tips.map((tip, i) => (
                      <p key={i} className="text-[13px] text-[#555] mb-1">
                        → {tip}
                      </p>
                    ))}
                  </div>
                );
              })}
            </div>
          )}

          <div className="flex flex-wrap gap-2 mb-8">
            {sortedByScore.map(d => (
              <span
                key={d}
                className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-[12px] font-semibold"
                style={{
                  background: DIMENSIONS[d].colorLight,
                  border: `1px solid ${DIMENSIONS[d].color}33`,
                  color: DIMENSIONS[d].color
                }}
              >
                {DIMENSIONS[d].icon} {DIMENSIONS[d].name}: {getLevel(scores[d])}
              </span>
            ))}
          </div>

          <ExportPanel
            testConfig={TEST_CONFIG}
            dimensions={DIMENSIONS}
            scores={scores}
            practicalImplications={{
              markdown: implications.markdown,
              html: practicalHtml,
              fullMarkdown,
              fullHtml
            }}
          />

          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
            <button
              type="button"
              onClick={restart}
              className="bg-transparent border border-[#ddd] rounded-lg px-4 py-2 text-sm text-[#777] hover:border-[#E07A5F] hover:text-[#E07A5F]"
            >
              Zopakovat test
            </button>
            <p className="text-[11px] text-[#999] text-right max-w-md leading-relaxed">
              Tento test má orientační charakter a nenahrazuje kariérové poradenství
              ani psychodiagnostiku. Výsledky použijte jako mapu preferencí, ne jako
              definitivní nálepku.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
