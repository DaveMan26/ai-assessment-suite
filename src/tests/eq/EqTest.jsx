import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  TEST_CONFIG, DIMENSIONS, SCALE_ITEMS, SCENARIOS,
  SLIDER_LABELS, DEVELOPMENT_TIPS
} from './eqData';
import { getPracticalImplications, getPracticalImplicationsHTML } from './eqExport';
import { interleaveQuestionsAndScenarios } from '../../lib/shuffle';
import { calculateScaleScores, calculateScenarioScores, mergeScores } from '../../lib/scoring';
import { getLevel } from '../../lib/levels';
import { saveResults } from '../../lib/storage';
import { useResults } from '../../context/ResultsContext';
import RadarChart from '../../components/RadarChart';
import DimensionBar from '../../components/DimensionBar';
import ExportPanel from '../../components/ExportPanel';
import SliderQuestion from '../../components/SliderQuestion';
import ScenarioQuestion from '../../components/ScenarioQuestion';

export default function EqTest() {
  const { saveTestResult } = useResults();
  const [phase, setPhase] = useState('intro');
  const [items, setItems] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [scaleAnswers, setScaleAnswers] = useState({});
  const [scenarioAnswers, setScenarioAnswers] = useState({});
  const [sliderVal, setSliderVal] = useState(null);
  const [animating, setAnimating] = useState(false);
  const [dimScores, setDimScores] = useState(null);

  const startTest = () => {
    const interleaved = interleaveQuestionsAndScenarios(SCALE_ITEMS, SCENARIOS, 4);
    setItems(interleaved);
    setCurrentIdx(0);
    setScaleAnswers({});
    setScenarioAnswers({});
    setSliderVal(null);
    setPhase('test');
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
    const scaleQuestions = items.filter(it => it.type === 'scale').map(it => it.data);
    const scaleVals = scaleQuestions.map(q => finalScaleAnswers[q.id] || 4);
    const scaleScores = calculateScaleScores(scaleVals, scaleQuestions, DIMENSIONS);

    const scenarioSelected = SCENARIOS.map((_, i) => finalScenarioAnswers[i] ?? null);
    const scenarioScores = calculateScenarioScores(scenarioSelected, SCENARIOS);

    const scores = mergeScores(scaleScores, scenarioScores, 0.7, 0.3);
    setDimScores(scores);

    const sorted = Object.keys(DIMENSIONS).sort((a, b) => (scores[b] ?? 0) - (scores[a] ?? 0));
    const resultData = {
      test: 'EQ',
      test_name: TEST_CONFIG.fullName,
      version: TEST_CONFIG.version,
      date: new Date().toISOString().split('T')[0],
      questions_count: SCALE_ITEMS.length,
      scenarios_count: SCENARIOS.length,
      scale: TEST_CONFIG.scaleDescription,
      theoretical_framework: "Trait EI + Bar-On + Goleman mixed model",
      scores,
      ranking: sorted.map((d, i) => ({
        rank: i + 1,
        dimension: DIMENSIONS[d].eng,
        score: Math.round(scores[d])
      }))
    };
    saveResults('EQ', resultData);
    saveTestResult('EQ', resultData);

    setTimeout(() => { setPhase('results'); setAnimating(false); }, 600);
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

    if (currentIdx + 1 >= items.length) {
      finishTest(nextScaleAnswers, nextScenarioAnswers);
    } else {
      setTimeout(() => {
        const nextIdx = currentIdx + 1;
        setCurrentIdx(nextIdx);
        const nextItem = items[nextIdx];
        if (nextItem.type === 'scale') {
          const prev = nextScaleAnswers[nextItem.data.id];
          setSliderVal(prev ?? null);
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
        const prev = scaleAnswers[prevItem.data.id];
        setSliderVal(prev ?? null);
      }
    }
  };

  // === INTRO ===
  if (phase === 'intro') {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center px-6">
        <div className="max-w-[520px] w-full text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-1 text-sm text-[#888] hover:text-[#2D2D2D] transition-colors mb-10"
          >
            ← Zpět na menu
          </Link>

          <div className="text-[56px] mb-4" style={{ color: TEST_CONFIG.accentColor }}>
            {TEST_CONFIG.icon}
          </div>
          <h1 className="font-serif-display text-4xl text-[#2D2D2D] mb-3 font-normal leading-tight">
            {TEST_CONFIG.name}
          </h1>
          <p className="font-serif-display text-xl text-[#888] mb-8 font-normal">
            EQ Assessment
          </p>

          <div className="bg-white rounded-2xl p-7 text-left mb-8 border border-[#ebe8e2] shadow-sm">
            <p className="text-[15px] text-[#555] leading-relaxed mb-4">
              {TEST_CONFIG.description}
            </p>
            <div className="grid grid-cols-2 gap-3 text-sm text-[#777]">
              <div>⏱ ~{TEST_CONFIG.estimatedMinutes} minut</div>
              <div>📊 50 otázek</div>
              <div>🎚 Škála + scénáře</div>
              <div>📥 Export výsledků</div>
            </div>
            <div className="mt-5 p-3.5 px-4 bg-[#f8f6f1] rounded-[10px] text-[13px] text-[#888] leading-relaxed">
              {TEST_CONFIG.tip}
            </div>
          </div>

          <button
            onClick={startTest}
            className="text-white border-none rounded-xl px-12 py-4 text-[17px] font-bold cursor-pointer transition-all duration-200 hover:-translate-y-0.5"
            style={{
              background: TEST_CONFIG.accentColor,
              boxShadow: `0 4px 16px ${TEST_CONFIG.accentColor}35`,
            }}
          >
            Začít test →
          </button>
        </div>
      </div>
    );
  }

  // === TEST ===
  if (phase === 'test' && items.length > 0 && currentItem) {
    const dim = isScale ? DIMENSIONS[currentItem.data.dim] : null;
    const accentColor = dim?.color || TEST_CONFIG.accentColor;

    return (
      <div className="min-h-screen bg-[#FDFBF7] flex flex-col">
        {/* Sticky progress header */}
        <div className="sticky top-0 z-50 bg-[#FDFBF7] border-b border-[#ebe8e2]">
          <div className="h-1 bg-[#f0ede8]">
            <div
              className="h-full transition-[width] duration-500 ease-[cubic-bezier(.4,0,.2,1)]"
              style={{
                width: `${progress}%`,
                background: `linear-gradient(90deg, ${TEST_CONFIG.accentColor}, ${TEST_CONFIG.secondaryColor})`,
              }}
            />
          </div>
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
                style={{ color: TEST_CONFIG.accentColor, background: TEST_CONFIG.accentColorLight }}
              >
                Scénář
              </span>
            )}
          </div>
        </div>

        {/* Question area */}
        <div className="flex-1 flex items-center justify-center px-6 py-8">
          <div
            key={currentIdx}
            className="max-w-[560px] w-full transition-all duration-300 ease-out"
            style={{
              opacity: animating ? 0.3 : 1,
              transform: animating ? 'translateY(8px)' : 'translateY(0)',
            }}
          >
            {isScale && (
              <>
                <SliderQuestion
                  question={`„${currentItem.data.text}"`}
                  value={sliderVal}
                  onChange={setSliderVal}
                  labels={SLIDER_LABELS}
                  accentColor={accentColor}
                />
              </>
            )}

            {isScenario && (
              <ScenarioQuestion
                scenario={currentItem.data}
                selectedIndex={scenarioAnswers[currentScenarioIdx] ?? null}
                onSelect={(i) => {
                  setScenarioAnswers(prev => ({ ...prev, [currentScenarioIdx]: i }));
                }}
                accentColor={TEST_CONFIG.accentColor}
              />
            )}

            {/* Navigation */}
            <div className="flex justify-between items-center mt-8 gap-3">
              {currentIdx > 0 ? (
                <button
                  onClick={goBack}
                  className="bg-transparent border border-[#ddd] rounded-lg px-5 py-2.5 text-sm text-[#999] cursor-pointer transition-all duration-200 hover:border-current"
                  onMouseOver={e => { e.currentTarget.style.color = TEST_CONFIG.accentColor; e.currentTarget.style.borderColor = TEST_CONFIG.accentColor; }}
                  onMouseOut={e => { e.currentTarget.style.color = '#999'; e.currentTarget.style.borderColor = '#ddd'; }}
                >
                  ← Zpět
                </button>
              ) : (
                <div />
              )}
              <button
                onClick={submitAnswer}
                disabled={!hasAnswer}
                className="border-none rounded-[10px] px-10 py-3.5 text-base font-semibold text-white transition-all duration-200"
                style={{
                  background: accentColor,
                  opacity: hasAnswer ? 1 : 0.4,
                  cursor: hasAnswer ? 'pointer' : 'not-allowed',
                  boxShadow: `0 4px 12px ${accentColor}44`,
                }}
                onMouseOver={e => { if (hasAnswer) { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = `0 6px 20px ${accentColor}55`; }}}
                onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = `0 4px 12px ${accentColor}44`; }}
              >
                {currentIdx + 1 >= items.length ? 'Dokončit test ✓' : 'Další →'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // === RESULTS ===
  if (phase === 'results' && dimScores) {
    const dims = Object.keys(DIMENSIONS);
    const sorted = [...dims].sort((a, b) => (dimScores[b] ?? 0) - (dimScores[a] ?? 0));
    const top = sorted[0];
    const low = sorted[sorted.length - 1];

    const lowDims = dims.filter(d => dimScores[d] < 50);

    const mdImplications = getPracticalImplications(dimScores);
    const htmlImplications = getPracticalImplicationsHTML(dimScores);

    let mdTips = '';
    let htmlTips = '';
    if (lowDims.length > 0) {
      mdTips = '\n### Rozvojové tipy\n\n';
      htmlTips = '<div style="margin-top:24px;"><h3 style="font-family:\'DM Serif Display\',Georgia,serif;font-size:18px;margin-bottom:12px;">Rozvojové tipy</h3>';
      lowDims.forEach(d => {
        const dim = DIMENSIONS[d];
        const tips = DEVELOPMENT_TIPS[d];
        mdTips += `**${dim.icon} ${dim.name}:**\n`;
        tips.forEach(t => { mdTips += `- ${t}\n`; });
        mdTips += '\n';

        htmlTips += `<div style="border-left:4px solid ${dim.color};padding:12px 16px;margin-bottom:12px;background:#f8f6f1;border-radius:0 8px 8px 0;">`;
        htmlTips += `<strong style="color:${dim.color};">${dim.icon} ${dim.name}</strong>`;
        tips.forEach(t => { htmlTips += `<p style="font-size:13px;color:#555;margin:6px 0 0;">${t}</p>`; });
        htmlTips += '</div>';
      });
      htmlTips += '</div>';
    }

    const practicalImplications = {
      markdown: mdImplications + mdTips,
      html: htmlImplications + htmlTips,
    };

    const exportConfig = {
      ...TEST_CONFIG,
      theoretical_framework: "Trait EI + Bar-On + Goleman mixed model",
    };

    return (
      <div className="min-h-screen bg-[#FDFBF7] px-6 py-10">
        <div className="max-w-[640px] mx-auto">
          <Link
            to="/"
            className="inline-flex items-center gap-1 text-sm text-[#888] hover:text-[#2D2D2D] transition-colors mb-8"
          >
            ← Zpět na menu
          </Link>

          {/* Header */}
          <div className="text-center mb-10">
            <div className="font-mono text-sm text-[#999] tracking-[3px] uppercase mb-2">
              Výsledky
            </div>
            <h1 className="font-serif-display text-4xl text-[#2D2D2D] font-normal mb-2">
              Tvůj EQ profil
            </h1>
            <p className="text-[#999] text-sm">
              Na základě {SCALE_ITEMS.length} škálových otázek a {SCENARIOS.length} scénářů
            </p>
          </div>

          {/* Radar chart */}
          <div className="bg-white rounded-2xl p-8 mb-8 border border-[#ebe8e2] shadow-sm">
            <RadarChart scores={dimScores} dimensions={DIMENSIONS} />
          </div>

          {/* Quick overview */}
          <div className="bg-white rounded-2xl p-7 mb-8 border border-[#ebe8e2] shadow-sm">
            <h2 className="font-serif-display text-[22px] text-[#2D2D2D] font-normal mb-5">
              Rychlý přehled
            </h2>
            <div className="grid grid-cols-2 gap-4 mb-5">
              <div className="rounded-xl p-4" style={{ background: DIMENSIONS[top].colorLight }}>
                <div className="text-xs text-[#999] mb-1">Nejsilnější dimenze</div>
                <div className="text-lg font-bold" style={{ color: DIMENSIONS[top].color }}>
                  {DIMENSIONS[top].icon} {DIMENSIONS[top].name}
                </div>
                <div className="text-2xl font-extrabold font-mono" style={{ color: DIMENSIONS[top].color }}>
                  {Math.round(dimScores[top])}%
                </div>
              </div>
              <div className="rounded-xl p-4" style={{ background: DIMENSIONS[low].colorLight }}>
                <div className="text-xs text-[#999] mb-1">Nejnižší dimenze</div>
                <div className="text-lg font-bold" style={{ color: DIMENSIONS[low].color }}>
                  {DIMENSIONS[low].icon} {DIMENSIONS[low].name}
                </div>
                <div className="text-2xl font-extrabold font-mono" style={{ color: DIMENSIONS[low].color }}>
                  {Math.round(dimScores[low])}%
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
                    color: DIMENSIONS[d].color,
                  }}
                >
                  {DIMENSIONS[d].icon} {DIMENSIONS[d].name}: {getLevel(dimScores[d])}
                </span>
              ))}
            </div>
          </div>

          {/* Detailed profile */}
          <div className="bg-white rounded-2xl p-7 mb-8 border border-[#ebe8e2] shadow-sm">
            <h2 className="font-serif-display text-[22px] text-[#2D2D2D] font-normal mb-6">
              Detailní profil
            </h2>
            {dims.map(d => (
              <DimensionBar key={d} dimKey={d} score={dimScores[d]} dimension={DIMENSIONS[d]} />
            ))}
          </div>

          {/* Practical implications */}
          <div className="bg-white rounded-2xl p-7 mb-8 border border-[#ebe8e2] shadow-sm">
            <h2 className="font-serif-display text-[22px] text-[#2D2D2D] font-normal mb-5">
              Co to znamená v praxi
            </h2>
            <div className="text-sm text-[#555] leading-relaxed space-y-4">
              <ImplicationSection
                title="Leadership a vliv"
                scores={dimScores}
                items={[
                  { dim: 'SS', high: 'Sociální dovednosti jsou tvoje silná stránka — dokážeš lidi motivovat a vést náročné rozhovory.', low: 'Rozvoj sociálních dovedností ti otevře cestu k přirozenějšímu vedení. Zkus začít facilitací menších skupinových diskusí.' },
                  { dim: 'EM', high: 'Silná vnitřní motivace ti pomáhá udržet směr i v obtížných obdobích.', low: "Jasný osobní \u201Eproč\u201C ti dodá odolnost, když vedení přinese neočekávané překážky." },
                ]}
              />
              <ImplicationSection
                title="Týmová spolupráce"
                scores={dimScores}
                items={[
                  { dim: 'EP', high: 'Vysoká empatie ti umožňuje budovat důvěru a psychologické bezpečí v týmu.', low: 'Vědomé naslouchání a ověřování porozumění výrazně zlepší tvoje týmové vztahy.' },
                  { dim: 'SS', high: 'Tvoje schopnost řešit konflikty konstruktivně je klíčový přínos pro tým.', low: 'Trénink asertivní komunikace a mediačních technik ti pomůže v týmových konfliktech.' },
                ]}
              />
              <ImplicationSection
                title="Zvládání stresu"
                scores={dimScores}
                items={[
                  { dim: 'SR', high: 'Dobrá seberegulace ti umožňuje fungovat efektivně i pod tlakem.', low: 'Investice do regulačních strategií (dech, pauza, fyzická aktivita) se vyplatí v náročných obdobích.' },
                  { dim: 'EM', high: 'Vnitřní odolnost a optimismus fungují jako přirozený buffer proti vyhoření.', low: 'Propojení každodenní práce s osobním smyslem zvyšuje odolnost vůči stresu.' },
                ]}
              />
              <ImplicationSection
                title="Osobní vztahy"
                scores={dimScores}
                items={[
                  { dim: 'SA', high: 'Vysoké sebeuvědomění ti dává základ pro autentické a otevřené vztahy.', low: 'Pravidelnější reflexe vlastních emocí ti pomůže lépe komunikovat potřeby v blízkých vztazích.' },
                  { dim: 'EP', high: 'Empatie s respektovanými hranicemi — ideální kombinace pro zdravé vztahy.', low: "Technika \u201Enejdřív poslouchej, pak reaguj\u201C může posílit kvalitu tvých blízkých vztahů." },
                ]}
              />
            </div>
          </div>

          {/* Development tips — only for dimensions < 50% */}
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
                return (
                  <div
                    key={d}
                    className="mb-4 rounded-r-xl p-4"
                    style={{
                      borderLeft: `4px solid ${dim.color}`,
                      background: '#f8f6f1',
                    }}
                  >
                    <div className="font-semibold text-sm mb-2" style={{ color: dim.color }}>
                      {dim.icon} {dim.name} — {Math.round(dimScores[d])}%
                    </div>
                    {tips.map((tip, i) => (
                      <p key={i} className="text-[13px] text-[#555] leading-relaxed mb-1.5 last:mb-0">
                        → {tip}
                      </p>
                    ))}
                  </div>
                );
              })}
            </div>
          )}

          {/* Export */}
          <ExportPanel
            testConfig={exportConfig}
            dimensions={DIMENSIONS}
            scores={dimScores}
            practicalImplications={practicalImplications}
          />

          {/* Disclaimer */}
          <div className="text-center mb-8 p-5 bg-[#f8f6f1] rounded-2xl">
            <p className="text-xs text-[#aaa] leading-relaxed">
              ⚠️ Orientační self-assessment na základě {SCALE_ITEMS.length} škálových otázek
              a {SCENARIOS.length} scénářů. Výsledky slouží k sebereflexi —
              nenahrazuje standardizovaný psychologický test.
            </p>
          </div>

          {/* Restart */}
          <div className="text-center mb-10">
            <button
              onClick={() => { setPhase('intro'); setDimScores(null); }}
              className="bg-transparent border border-[#ddd] rounded-[10px] px-8 py-3 text-sm text-[#999] cursor-pointer transition-all duration-200"
              onMouseOver={e => { e.currentTarget.style.borderColor = TEST_CONFIG.accentColor; e.currentTarget.style.color = TEST_CONFIG.accentColor; }}
              onMouseOut={e => { e.currentTarget.style.borderColor = '#ddd'; e.currentTarget.style.color = '#999'; }}
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

function ImplicationSection({ title, scores, items }) {
  return (
    <p>
      <strong>{title}:</strong>{' '}
      {items.map((item, i) => (
        <span key={i}>
          {scores[item.dim] > 60 ? item.high : item.low}
          {i < items.length - 1 ? ' ' : ''}
        </span>
      ))}
    </p>
  );
}
