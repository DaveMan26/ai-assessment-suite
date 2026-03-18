import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  TEST_CONFIG,
  DIMENSIONS,
  SCALE_ITEMS,
  SCENARIOS,
  ALT_USES_ITEMS,
  SLIDER_LABELS
} from './creativeData';
import { analyzeAltUses, calculateCreativeScores } from './creativeScoring';
import {
  getPracticalImplications,
  DEVELOPMENT_TIPS,
  generateMarkdown,
  generateHTMLReport
} from './creativeExport';
import { interleaveQuestionsAndScenarios } from '../../lib/shuffle';
import { getLevel } from '../../lib/levels';
import { saveResults } from '../../lib/storage';
import { useResults } from '../../context/ResultsContext';
import TestIntro from '../../components/TestIntro';
import AltUsesTask from './AltUsesTask';
import RadarChart from '../../components/RadarChart';
import DimensionBar from '../../components/DimensionBar';
import ExportPanel from '../../components/ExportPanel';
import SliderQuestion from '../../components/SliderQuestion';
import ScenarioQuestion from '../../components/ScenarioQuestion';

const INTRO_CONFIG = {
  ...TEST_CONFIG,
  minutes: TEST_CONFIG.estimatedMinutes,
  questionCount: '27',
  dimensionCount: 5,
  type: 'Smíšený'
};

export default function CreativeTest() {
  const { saveTestResult } = useResults();
  const [phase, setPhase] = useState('intro');
  const [altUsesAnswers, setAltUsesAnswers] = useState({});
  const [items, setItems] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [scaleAnswers, setScaleAnswers] = useState({});
  const [scenarioAnswers, setScenarioAnswers] = useState({});
  const [sliderVal, setSliderVal] = useState(null);
  const [animating, setAnimating] = useState(false);
  const [scores, setScores] = useState(null);
  const [altUsesResult, setAltUsesResult] = useState(null);

  const startTest = () => {
    setPhase('alt_uses');
    setAltUsesAnswers({});
    setItems([]);
    setCurrentIdx(0);
    setScaleAnswers({});
    setScenarioAnswers({});
    setSliderVal(null);
    setScores(null);
    setAltUsesResult(null);
  };

  const handleAltUsesComplete = (answers) => {
    setAltUsesAnswers(answers);
    const interleaved = interleaveQuestionsAndScenarios(SCALE_ITEMS, SCENARIOS, 4);
    setItems(interleaved);
    setCurrentIdx(0);
    setSliderVal(null);
    setPhase('mixed');
  };

  const currentItem = items[currentIdx];
  const isScale = currentItem?.type === 'scale';
  const isScenario = currentItem?.type === 'scenario';

  const currentScaleKey = isScale ? currentItem.data.id : null;
  const currentScenarioIdx = isScenario
    ? SCENARIOS.findIndex(s => s.id === currentItem.data.id)
    : -1;

  const hasAnswer = isScale
    ? sliderVal != null
    : isScenario
      ? scenarioAnswers[currentScenarioIdx] != null
      : false;

  const progress = items.length > 0
    ? ((currentIdx + (phase === 'results' ? 1 : 0)) / items.length) * 100
    : 0;

  const finishTest = (finalScaleAnswers, finalScenarioAnswers) => {
    const responses = Object.entries(altUsesAnswers).map(([itemId, text]) => ({ itemId, text }));
    const autResult = analyzeAltUses(responses, ALT_USES_ITEMS);
    setAltUsesResult(autResult);

    const orderedScaleItems = items.filter(it => it.type === 'scale').map(it => it.data);
    const scenarioSelected = SCENARIOS.map((_, i) => finalScenarioAnswers[i] ?? null);
    const finalScores = calculateCreativeScores(
      autResult,
      finalScaleAnswers,
      scenarioSelected,
      orderedScaleItems,
      SCENARIOS
    );
    setScores(finalScores);

    const sorted = Object.keys(DIMENSIONS).sort((a, b) => (finalScores[b] ?? 0) - (finalScores[a] ?? 0));
    const resultData = {
      test: TEST_CONFIG.id,
      test_name: TEST_CONFIG.fullName,
      version: TEST_CONFIG.version,
      date: new Date().toISOString().split('T')[0],
      questions_count: 27,
      scenarios_count: SCENARIOS.length,
      scale: 'Mix: Alternate Uses (timed), situační scénáře, Likert 1-7',
      scores: finalScores,
      ranking: sorted.map((d, i) => ({
        rank: i + 1,
        dimension: DIMENSIONS[d].eng,
        score: Math.round(finalScores[d])
      })),
      alt_uses_meta: autResult.meta
    };
    saveResults('CREATIVE', resultData);
    saveTestResult('CREATIVE', resultData);

    setTimeout(() => setAnimating(false), 600);
    setPhase('results');
  };

  const submitAnswer = () => {
    if (animating || !hasAnswer) return;
    setAnimating(true);

    let nextScaleAnswers = scaleAnswers;
    let nextScenarioAnswers = scenarioAnswers;

    if (isScale) {
      nextScaleAnswers = { ...scaleAnswers, [currentScaleKey]: sliderVal };
      setScaleAnswers(nextScaleAnswers);
    }

    if (isScenario) {
      nextScenarioAnswers = { ...scenarioAnswers, [currentScenarioIdx]: scenarioAnswers[currentScenarioIdx] };
    }

    if (currentIdx + 1 >= items.length) {
      finishTest(nextScaleAnswers, nextScenarioAnswers);
    } else {
      setTimeout(() => {
        const nextIdx = currentIdx + 1;
        setCurrentIdx(nextIdx);
        const nextItem = items[nextIdx];
        if (nextItem.type === 'scale') {
          setSliderVal(nextScaleAnswers[nextItem.data.id] ?? null);
        }
        setAnimating(false);
      }, 300);
    }
  };

  const goBack = () => {
    if (currentIdx > 0) {
      const prevIdx = currentIdx - 1;
      setCurrentIdx(prevIdx);
      const prevItem = items[prevIdx];
      if (prevItem.type === 'scale') {
        setSliderVal(scaleAnswers[prevItem.data.id] ?? null);
      }
    }
  };

  // --- INTRO ---
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

  // --- ALT_USES ---
  if (phase === 'alt_uses') {
    return (
      <div className="min-h-screen bg-[#FDFBF7]">
        <div className="max-w-[720px] mx-auto px-4 pt-6">
          <Link
            to="/"
            className="inline-flex gap-1 text-sm text-[#888] hover:text-[#2D2D2D] transition-colors mb-4"
          >
            ← Zpět na menu
          </Link>
        </div>
        <AltUsesTask
          items={ALT_USES_ITEMS}
          onComplete={handleAltUsesComplete}
          accentColor={TEST_CONFIG.accentColor}
          secondaryColor={TEST_CONFIG.secondaryColor}
        />
      </div>
    );
  }

  // --- MIXED ---
  if (phase === 'mixed' && items.length > 0 && currentItem) {
    const dim = isScale ? DIMENSIONS[currentItem.data.dim] : null;
    const accentColor = dim?.color || TEST_CONFIG.accentColor;
    const scenarioForQuestion = isScenario
      ? { ...currentItem.data, options: currentItem.data.options.map(o => ({ ...o, text: o.label })) }
      : null;

    return (
      <div className="min-h-screen bg-[#FDFBF7] flex flex-col">
        <div className="sticky top-0 z-50 bg-[#FDFBF7] border-b border-[#ebe8e2]">
          <div
            className="h-1 w-full transition-[width] duration-500 ease-[cubic-bezier(.4,0,.2,1)]"
            style={{
              width: `${progress}%`,
              background: 'linear-gradient(90deg, #FF6B6B, #4ECDC4)'
            }}
          />
          <div className="flex justify-between items-center px-6 py-3">
            <span className="font-mono text-[13px] text-[#999]">
              {currentIdx + 1} / {items.length}
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
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center px-6 py-8">
          <div
            key={currentIdx}
            className="max-w-[560px] w-full transition-all duration-300 ease-out"
            style={{
              opacity: animating ? 0.3 : 1,
              transform: animating ? 'translateY(8px)' : 'translateY(0)'
            }}
          >
            {isScale && (
              <SliderQuestion
                question={`„${currentItem.data.text}"`}
                value={sliderVal}
                onChange={setSliderVal}
                labels={SLIDER_LABELS}
                accentColor={accentColor}
              />
            )}

            {isScenario && scenarioForQuestion && (
              <ScenarioQuestion
                scenario={scenarioForQuestion}
                selectedIndex={scenarioAnswers[currentScenarioIdx] ?? null}
                onSelect={i => setScenarioAnswers(prev => ({ ...prev, [currentScenarioIdx]: i }))}
                accentColor={TEST_CONFIG.accentColor}
              />
            )}

            <div className="flex justify-between items-center mt-8 gap-3">
              {currentIdx > 0 ? (
                <button
                  type="button"
                  onClick={goBack}
                  className="bg-transparent border border-[#ddd] rounded-lg px-5 py-2.5 text-sm text-[#999] cursor-pointer transition-colors hover:border-[#FF6B6B] hover:text-[#FF6B6B]"
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
                className="border-none rounded-[10px] px-10 py-3.5 text-base font-semibold text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                style={{
                  background: accentColor,
                  opacity: hasAnswer ? 1 : 0.4,
                  cursor: hasAnswer ? 'pointer' : 'not-allowed',
                  boxShadow: `0 4px 12px ${accentColor}44`
                }}
              >
                {currentIdx + 1 >= items.length ? 'Dokončit test ✓' : 'Další →'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- RESULTS ---
  if (phase === 'results' && scores && altUsesResult) {
    const dims = Object.keys(DIMENSIONS);
    const sorted = [...dims].sort((a, b) => (scores[b] ?? 0) - (scores[a] ?? 0));
    const top = sorted[0];
    const low = sorted[sorted.length - 1];
    const lowDims = dims.filter(d => scores[d] < 50);
    const implications = getPracticalImplications(scores);

    let developmentTipsMarkdown = '';
    let developmentTipsHtml = '';
    if (lowDims.length > 0) {
      developmentTipsMarkdown = '\n### Rozvojové tipy\n\n';
      developmentTipsHtml = '<div class="section"><h2>Rozvojové tipy</h2>';
      lowDims.forEach(d => {
        const dim = DIMENSIONS[d];
        const tips = DEVELOPMENT_TIPS[d];
        if (!tips) return;
        developmentTipsMarkdown += `**${dim.icon} ${dim.name}:**\n`;
        tips.tips.forEach(t => { developmentTipsMarkdown += `- ${t}\n`; });
        developmentTipsMarkdown += '\n';
        developmentTipsHtml += `<div style="border-left:4px solid ${dim.color};padding:12px 16px;margin-bottom:12px;background:#f8f6f1;border-radius:0 8px 8px 0;"><strong style="color:${dim.color};">${dim.icon} ${dim.name}</strong>`;
        tips.tips.forEach(t => { developmentTipsHtml += `<p style="font-size:13px;color:#555;margin:6px 0 0;">${t}</p>`; });
        developmentTipsHtml += '</div>';
      });
      developmentTipsHtml += '</div>';
    }

    const fullMarkdown = generateMarkdown(
      scores,
      DIMENSIONS,
      altUsesResult.meta,
      implications,
      developmentTipsMarkdown
    );
    const fullHtml = generateHTMLReport(
      scores,
      DIMENSIONS,
      altUsesResult.meta,
      implications,
      developmentTipsHtml
    );

    const exportConfig = { ...TEST_CONFIG };
    const practicalImplications = {
      markdown: implications ? [
        `**Tvůj kreativní styl:** ${implications.style}`,
        `**Uplatnění v praxi:** ${implications.application}`,
        `**Kreativní iniciativa:** ${implications.initiative}`
      ].join('\n\n') : '',
      html: implications ? [
        `<p><strong>Tvůj kreativní styl:</strong> ${implications.style}</p>`,
        `<p><strong>Uplatnění v praxi:</strong> ${implications.application}</p>`,
        `<p><strong>Kreativní iniciativa:</strong> ${implications.initiative}</p>`
      ].join('') : '',
      fullMarkdown,
      fullHtml
    };

    const itemLabels = { brick: 'Cihla', bottle: 'Plastová láhev' };

    return (
      <div className="min-h-screen bg-[#FDFBF7] px-6 py-10">
        <div className="max-w-[640px] mx-auto">
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
              Tvůj kreativní profil
            </h1>
            <p className="text-[#999] text-sm">
              Na základě Alternate Uses úloh, {SCALE_ITEMS.length} škálových otázek a {SCENARIOS.length} scénářů
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 mb-8 border border-[#ebe8e2] shadow-sm">
            <RadarChart scores={scores} dimensions={DIMENSIONS} />
          </div>

          <div className="bg-white rounded-2xl p-7 mb-8 border border-[#ebe8e2] shadow-sm">
            <h2 className="font-serif-display text-[22px] text-[#2D2D2D] font-normal mb-4">
              Alternate Uses — statistiky
            </h2>
            <p className="text-sm text-[#555] mb-2">
              Celkem vygenerováno <strong>{altUsesResult.meta.totalIdeas}</strong> nápadů v{' '}
              <strong>{altUsesResult.meta.totalBuckets}</strong> kategoriích.
            </p>
            <ul className="text-sm text-[#555] list-disc list-inside space-y-1">
              {altUsesResult.meta.items.map(it => (
                <li key={it.itemId}>
                  {itemLabels[it.itemId] || it.itemId}: {it.ideas} nápadů, {it.buckets} kategorií
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white rounded-2xl p-7 mb-8 border border-[#ebe8e2] shadow-sm">
            <h2 className="font-serif-display text-[22px] text-[#2D2D2D] font-normal mb-5">
              Rychlý přehled
            </h2>
            <div className="grid grid-cols-2 gap-4 mb-5">
              <div
                className="rounded-xl p-4"
                style={{ background: DIMENSIONS[top].colorLight }}
              >
                <div className="text-xs text-[#999] mb-1">Nejsilnější dimenze</div>
                <div className="text-lg font-bold" style={{ color: DIMENSIONS[top].color }}>
                  {DIMENSIONS[top].icon} {DIMENSIONS[top].name}
                </div>
                <div className="text-2xl font-extrabold font-mono" style={{ color: DIMENSIONS[top].color }}>
                  {Math.round(scores[top])}%
                </div>
              </div>
              <div
                className="rounded-xl p-4"
                style={{ background: DIMENSIONS[low].colorLight }}
              >
                <div className="text-xs text-[#999] mb-1">Nejnižší dimenze</div>
                <div className="text-lg font-bold" style={{ color: DIMENSIONS[low].color }}>
                  {DIMENSIONS[low].icon} {DIMENSIONS[low].name}
                </div>
                <div className="text-2xl font-extrabold font-mono" style={{ color: DIMENSIONS[low].color }}>
                  {Math.round(scores[low])}%
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {sorted.map(d => (
                <span
                  key={d}
                  className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-1 text-[13px] font-semibold"
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
          </div>

          <div className="bg-white rounded-2xl p-7 mb-8 border border-[#ebe8e2] shadow-sm">
            <h2 className="font-serif-display text-[22px] text-[#2D2D2D] font-normal mb-6">
              Detailní profil
            </h2>
            {dims.map(d => (
              <DimensionBar
                key={d}
                score={scores[d]}
                dimension={DIMENSIONS[d]}
              />
            ))}
          </div>

          <div className="bg-white rounded-2xl p-7 mb-8 border border-[#ebe8e2] shadow-sm">
            <h2 className="font-serif-display text-[22px] text-[#2D2D2D] font-normal mb-5">
              Co to znamená v praxi
            </h2>
            <div className="text-sm text-[#555] leading-relaxed space-y-4">
              <p><strong>Tvůj kreativní styl:</strong> {implications.style}</p>
              <p><strong>Uplatnění v praxi:</strong> {implications.application}</p>
              <p><strong>Kreativní iniciativa:</strong> {implications.initiative}</p>
            </div>
          </div>

          {lowDims.length > 0 && (
            <div className="bg-white rounded-2xl p-7 mb-8 border border-[#ebe8e2] shadow-sm">
              <h2 className="font-serif-display text-[22px] text-[#2D2D2D] font-normal mb-5">
                Rozvojové tipy
              </h2>
              <p className="text-sm text-[#888] mb-5">
                Konkrétní kroky pro oblasti, kde máš největší prostor pro růst.
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
                    <div className="font-semibold text-sm mb-2" style={{ color: dim.color }}>
                      {dim.icon} {dim.name} — {Math.round(scores[d])}%
                    </div>
                    <p className="text-xs text-[#666] mb-2">{tips.title}</p>
                    {tips.tips.map((tip, i) => (
                      <p key={i} className="text-[13px] text-[#555] leading-relaxed mb-1.5 last:mb-0">
                        → {tip}
                      </p>
                    ))}
                  </div>
                );
              })}
            </div>
          )}

          <ExportPanel
            testConfig={exportConfig}
            dimensions={DIMENSIONS}
            scores={scores}
            practicalImplications={practicalImplications}
          />

          <div className="text-center mb-8 p-5 bg-[#f8f6f1] rounded-2xl">
            <p className="text-xs text-[#aaa] leading-relaxed">
              ⚠️ Orientační self-assessment — nenahrazuje standardizovaný kreativní test. Výsledky ber jako
              inspiraci a mapu potenciálu.
            </p>
          </div>

          <div className="text-center mb-10">
            <button
              type="button"
              onClick={() => {
                setPhase('intro');
                setScores(null);
                setAltUsesResult(null);
              }}
              className="bg-transparent border border-[#ddd] rounded-[10px] px-8 py-3 text-sm text-[#999] cursor-pointer transition-colors hover:border-[#FF6B6B] hover:text-[#FF6B6B]"
            >
              ↺ Zopakovat test
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
