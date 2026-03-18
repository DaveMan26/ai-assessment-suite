import { useCallback, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  TEST_CONFIG,
  DIMENSIONS,
  SCALE_ITEMS,
  SCENARIOS,
  SLIDER_LABELS,
  TOTAL_ITEMS,
} from './cognitiveData';
import { interleaveQuestionsAndScenarios } from '../../lib/shuffle';
import { saveResults } from '../../lib/storage';
import { useResults } from '../../context/ResultsContext';
import TestIntro from '../../components/TestIntro';
import SliderQuestion from '../../components/SliderQuestion';
import ScenarioQuestion from '../../components/ScenarioQuestion';
import ExportPanel from '../../components/ExportPanel';
import BipolarScale from './BipolarScale';
import {
  calculateCognitiveScores,
  getInterpretationTextForDimension,
  interpretBipolar,
} from './cognitiveScoring';
import { getCognitivePracticalImplications } from './cognitiveExport';

const INTRO_CONFIG = {
  ...TEST_CONFIG,
  minutes: TEST_CONFIG.estimatedMinutes,
  questionCount: String(TOTAL_ITEMS),
  dimensionCount: TEST_CONFIG.dimensionCount,
  type: 'Smíšený',
};

function buildAllSteps() {
  const mixed = interleaveQuestionsAndScenarios(SCALE_ITEMS, SCENARIOS, 4);
  return mixed.map((data) => ({ kind: 'mixed', data }));
}

export default function CognitiveTest() {
  const { saveTestResult } = useResults();

  const [phase, setPhase] = useState('intro');
  const [allSteps, setAllSteps] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [likertAnswers, setLikertAnswers] = useState({});
  const [scenarioAnswers, setScenarioAnswers] = useState({});
  const [sliderVal, setSliderVal] = useState(null);
  const [animating, setAnimating] = useState(false);

  const [scores, setScores] = useState(null);
  const [practical, setPractical] = useState(null);

  const step = allSteps[currentIdx];
  const isMixed = step?.kind === 'mixed';
  const isScale = isMixed && step?.data?.type === 'scale';
  const isScenario = isMixed && step?.data?.type === 'scenario';

  const currentScaleId = isScale ? step.data.data.id : null;
  const currentScenarioId = isScenario ? step.data.data.id : null;

  const progress = allSteps.length ? ((currentIdx + 1) / allSteps.length) * 100 : 0;

  const startTest = () => {
    const steps = buildAllSteps();
    setAllSteps(steps);
    setCurrentIdx(0);
    setLikertAnswers({});
    setScenarioAnswers({});
    setSliderVal(null);
    setAnimating(false);
    setScores(null);
    setPractical(null);
    setPhase('test');
  };

  const finishTest = useCallback(
    (finalLikert, finalScenario) => {
      const merged = calculateCognitiveScores(finalLikert, finalScenario);
      const implications = getCognitivePracticalImplications(merged);
      setScores(merged);
      setPractical(implications);

      const now = new Date().toISOString().split('T')[0];
      const dims = Object.keys(DIMENSIONS);
      const sorted = [...dims].sort((a, b) => (merged[b] ?? 0) - (merged[a] ?? 0));

      const interpretations = {};
      dims.forEach((d) => {
        interpretations[d] = interpretBipolar(merged[d]).label;
      });

      const resultData = {
        test: TEST_CONFIG.id,
        test_name: TEST_CONFIG.fullName,
        version: TEST_CONFIG.version,
        date: now,
        questions_count: TOTAL_ITEMS,
        scenarios_count: SCENARIOS.length,
        scale: TEST_CONFIG.scaleDescription,
        scoring_weights: '70% Likert + 30% scénáře',
        type: 'bipolar',
        scores: merged,
        interpretations,
        ranking: sorted.map((d, i) => ({
          rank: i + 1,
          dimension: DIMENSIONS[d].eng,
          score: Math.round(merged[d]),
        })),
        cognitive_profile: implications?.profile?.text || '',
      };

      saveResults(TEST_CONFIG.id, resultData);
      saveTestResult('COGNITIVE', resultData);
      setAnimating(false);
      setPhase('results');
    },
    [saveTestResult]
  );

  let hasAnswer = false;
  if (isScale) hasAnswer = sliderVal != null;
  else if (isScenario) hasAnswer = scenarioAnswers[currentScenarioId] != null;

  const submitAnswer = () => {
    if (animating || !hasAnswer || !step) return;
    setAnimating(true);

    let nextLikert = { ...likertAnswers };
    let nextScenario = { ...scenarioAnswers };

    if (isScale && currentScaleId) {
      nextLikert[currentScaleId] = sliderVal;
      setLikertAnswers(nextLikert);
    }

    if (currentIdx + 1 >= allSteps.length) {
      finishTest(nextLikert, nextScenario);
      return;
    }

    setTimeout(() => {
      const nextIdx = currentIdx + 1;
      setCurrentIdx(nextIdx);
      const nextStep = allSteps[nextIdx];
      if (nextStep?.kind === 'mixed' && nextStep.data.type === 'scale') {
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
    if (prevStep?.kind === 'mixed' && prevStep.data.type === 'scale') {
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
    setSliderVal(null);
    setAnimating(false);
    setScores(null);
    setPractical(null);
  };

  const resultsOrder = useMemo(() => Object.keys(DIMENSIONS), []);

  if (phase === 'intro') {
    return (
      <div className="min-h-screen bg-[#FDFBF7]">
        <div className="pt-8 text-center">
          <Link to="/" className="inline-flex items-center gap-1 text-sm text-[#888] hover:text-[#2D2D2D] transition-colors">
            ← Zpět na menu
          </Link>
        </div>
        <TestIntro config={INTRO_CONFIG} onStart={startTest} />
        <div className="-mt-16 pb-10 px-4">
          <div className="max-w-md mx-auto bg-white border border-[#ebe8e2] rounded-2xl p-5 shadow-sm">
            <div className="font-medium text-[#2D2D2D] mb-1">Tento test neměří inteligenci</div>
            <div className="text-sm text-[#666] leading-relaxed">
              Měří váš preferovaný styl myšlení a rozhodování. Střed (50%) neznamená „nevím", ale že dokážete flexibilně používat oba póly.
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (phase === 'test' && allSteps.length > 0) {
    const dimKey = isScale ? step.data.data.dim : isScenario ? step.data.data.dim : null;
    const dim = dimKey ? DIMENSIONS[dimKey] : null;
    const accent = dim?.color || TEST_CONFIG.accentColor;

    return (
      <div className="min-h-screen bg-[#FDFBF7] flex flex-col">
        <div className="sticky top-0 z-50 bg-[#FDFBF7]/95 backdrop-blur-sm border-b border-[#ebe8e2]">
          <div className="h-1 bg-[#f0ede8]">
            <div
              className="h-full transition-[width] duration-500 ease-[cubic-bezier(.4,0,.2,1)]"
              style={{
                width: `${progress}%`,
                background: `linear-gradient(90deg, #3D405B, #81B29A)`,
              }}
            />
          </div>
          <div className="max-w-[720px] mx-auto px-4 py-3 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Link to="/" className="text-sm text-[#888] hover:text-[#2D2D2D] transition-colors">
                ← Menu
              </Link>
              <span className="font-mono text-xs sm:text-[13px] text-[#2D2D2D]">
                {currentIdx + 1} / {allSteps.length}
              </span>
            </div>

            {dim ? (
              <span
                className="text-xs px-2.5 py-1 rounded-full font-medium"
                style={{ backgroundColor: `${accent}18`, color: accent }}
              >
                {dim.icon} {dim.name}
              </span>
            ) : null}
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center px-4 py-8">
          <div
            className="max-w-[720px] w-full bg-white rounded-2xl border border-[#ebe8e2] shadow-sm p-6 sm:p-8"
            style={{
              opacity: animating ? 0.35 : 1,
              transform: animating ? 'translateY(6px)' : 'translateY(0)',
              transition: 'all 220ms ease-out',
            }}
          >
            {isScale ? (
              <SliderQuestion
                question={`„${step.data.data.text}”`}
                value={sliderVal}
                onChange={setSliderVal}
                labels={SLIDER_LABELS}
                accentColor={accent}
              />
            ) : isScenario ? (
              <ScenarioQuestion
                scenario={step.data.data}
                selectedIndex={scenarioAnswers[currentScenarioId] ?? null}
                onSelect={(idx) => setScenarioAnswers((p) => ({ ...p, [currentScenarioId]: idx }))}
                accentColor={accent}
              />
            ) : null}

            <div className="flex justify-between items-center mt-8 gap-3">
              {currentIdx > 0 ? (
                <button
                  onClick={goBack}
                  className="bg-transparent border border-[#ddd] rounded-lg px-5 py-2.5 text-sm text-[#999] cursor-pointer transition-all duration-200 hover:border-current"
                  onMouseOver={(e) => {
                    e.currentTarget.style.color = TEST_CONFIG.accentColor;
                    e.currentTarget.style.borderColor = TEST_CONFIG.accentColor;
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.color = '#999';
                    e.currentTarget.style.borderColor = '#ddd';
                  }}
                >
                  ← Zpět
                </button>
              ) : (
                <span />
              )}

              <button
                onClick={submitAnswer}
                disabled={!hasAnswer}
                className="text-white border-none rounded-lg px-7 py-3 text-sm sm:text-base font-bold cursor-pointer transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
                style={{
                  background: accent,
                  boxShadow: hasAnswer ? `0 6px 18px ${accent}35` : 'none',
                }}
              >
                {currentIdx + 1 >= allSteps.length ? 'Dokončit →' : 'Další →'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (phase === 'results' && scores) {
    const profile = practical?.profile;
    const strongSides = practical?.strongSides || [];
    const teamText = practical?.teamText || '';

    return (
      <div className="min-h-screen bg-[#FDFBF7] px-4 py-10">
        <div className="max-w-[920px] mx-auto">
          <div className="flex items-center justify-between mb-8">
            <Link to="/" className="text-sm text-[#888] hover:text-[#2D2D2D] transition-colors">
              ← Zpět na menu
            </Link>
            <button
              onClick={restart}
              className="bg-white border border-[#ebe8e2] rounded-xl px-4 py-2 text-sm text-[#2D2D2D] hover:shadow-sm transition-all"
            >
              Zopakovat test
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-[#ebe8e2] shadow-sm p-7 mb-8">
            <div className="text-4xl mb-3" style={{ color: TEST_CONFIG.accentColor }}>
              {TEST_CONFIG.icon}
            </div>
            <h1 className="font-serif-display text-3xl sm:text-4xl text-[#2D2D2D] mb-2 font-normal">
              {TEST_CONFIG.fullName}
            </h1>
            <p className="text-[#666] leading-relaxed">
              0% = pól A, 50% = vyvážený, 100% = pól B. Žádný pól není „lepší" — jde o preferenci.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10">
            {resultsOrder.map((d) => {
              const dim = DIMENSIONS[d];
              const pct = Math.round(scores[d] ?? 50);
              const interpretation = getInterpretationTextForDimension(d, pct);
              return (
                <div key={d}>
                  <div className="mb-2 flex items-center justify-between">
                    <div className="font-serif-display text-xl text-[#2D2D2D]">
                      {dim.icon} {dim.name}
                    </div>
                    <div className="font-mono text-sm font-bold" style={{ color: dim.color }}>
                      {pct}%
                    </div>
                  </div>
                  <BipolarScale
                    poleALabel={dim.poleA.label}
                    poleBLabel={dim.poleB.label}
                    value={pct}
                    color={dim.color}
                    interpretation={interpretation}
                  />
                </div>
              );
            })}
          </div>

          <div className="bg-white rounded-2xl border border-[#ebe8e2] shadow-sm p-7 mb-8">
            <h2 className="font-serif-display text-2xl text-[#2D2D2D] mb-3 font-normal">
              Kognitivní profil
            </h2>
            {profile ? (
              <>
                <div className="text-lg font-bold mb-2" style={{ color: TEST_CONFIG.accentColor }}>
                  {profile.title}
                </div>
                <div className="text-sm sm:text-[15px] text-[#666] leading-relaxed">{profile.text}</div>
              </>
            ) : null}
          </div>

          <div className="bg-white rounded-2xl border border-[#ebe8e2] shadow-sm p-7 mb-8">
            <h2 className="font-serif-display text-2xl text-[#2D2D2D] mb-3 font-normal">
              Silné stránky a rizika
            </h2>
            {strongSides.length ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {strongSides.map((x) => (
                  <div
                    key={x.dimKey}
                    className="rounded-2xl border border-[#ebe8e2] bg-[#fcfbf8] p-5"
                  >
                    <div className="font-bold text-[#2D2D2D] mb-2">
                      {DIMENSIONS[x.dimKey].icon} {x.dimName} — {x.poleName}
                    </div>
                    <div className="text-sm text-[#666] leading-relaxed">
                      <div className="mb-2">
                        <span className="font-medium text-[#2D2D2D]">Silné stránky: </span>
                        {x.strengths}
                      </div>
                      <div>
                        <span className="font-medium text-[#2D2D2D]">Rizika extrému: </span>
                        {x.risks}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-sm text-[#666] leading-relaxed">
                Nemáte výrazné extrémy (pod 25% nebo nad 75%). To často znamená dobrou schopnost přepínat styl podle kontextu.
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl border border-[#ebe8e2] shadow-sm p-7 mb-8">
            <h2 className="font-serif-display text-2xl text-[#2D2D2D] mb-3 font-normal">
              Týmová komplementarita
            </h2>
            <div className="text-sm sm:text-[15px] text-[#666] leading-relaxed">
              {teamText}
            </div>
          </div>

          <ExportPanel testConfig={TEST_CONFIG} dimensions={DIMENSIONS} scores={scores} practicalImplications={practical} />
        </div>
      </div>
    );
  }

  return null;
}

