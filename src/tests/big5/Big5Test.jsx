import { useState } from 'react';
import { Link } from 'react-router-dom';
import { TEST_CONFIG, DIMENSIONS, SCALE_ITEMS, SLIDER_LABELS, generateImplications } from './big5Data';
import { shuffleArray } from '../../lib/shuffle';
import { calculateScaleScores } from '../../lib/scoring';
import { getLevel } from '../../lib/levels';
import { saveResults } from '../../lib/storage';
import { useResults } from '../../context/ResultsContext';
import RadarChart from '../../components/RadarChart';
import DimensionBar from '../../components/DimensionBar';
import ExportPanel from '../../components/ExportPanel';

export default function Big5Test() {
  const { saveTestResult } = useResults();
  const [phase, setPhase] = useState('intro');
  const [questions, setQuestions] = useState([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [sliderVal, setSliderVal] = useState(4);
  const [sliderTouched, setSliderTouched] = useState(false);
  const [animating, setAnimating] = useState(false);
  const [dimScores, setDimScores] = useState(null);

  const startTest = () => {
    setQuestions(shuffleArray(SCALE_ITEMS));
    setCurrentQ(0);
    setAnswers([]);
    setSliderVal(4);
    setSliderTouched(false);
    setPhase('test');
  };

  const handleSliderChange = (value) => {
    setSliderVal(Number(value));
    setSliderTouched(true);
  };

  const submitAnswer = () => {
    if (animating || !sliderTouched) return;
    setAnimating(true);
    const newAnswers = [...answers];
    newAnswers[currentQ] = sliderVal;
    setAnswers(newAnswers);

    if (currentQ + 1 >= questions.length) {
      const scores = calculateScaleScores(newAnswers, questions, DIMENSIONS);
      setDimScores(scores);

      const sorted = Object.keys(DIMENSIONS).sort((a, b) => (scores[b] ?? 0) - (scores[a] ?? 0));
      const resultData = {
        test: 'BIG5',
        test_name: 'Big Five Personality Assessment',
        version: '2.0',
        date: new Date().toISOString().split('T')[0],
        questions_count: 40,
        scale: 'Likert 1-7',
        scores,
        ranking: sorted.map((d, i) => ({
          rank: i + 1,
          dimension: DIMENSIONS[d].eng,
          score: Math.round(scores[d])
        }))
      };
      saveResults('BIG5', resultData);
      saveTestResult('BIG5', resultData);

      setTimeout(() => { setPhase('results'); setAnimating(false); }, 600);
    } else {
      setTimeout(() => {
        const nextIdx = currentQ + 1;
        setCurrentQ(nextIdx);
        const prevAnswer = newAnswers[nextIdx];
        if (prevAnswer != null) {
          setSliderVal(prevAnswer);
          setSliderTouched(true);
        } else {
          setSliderVal(4);
          setSliderTouched(false);
        }
        setAnimating(false);
      }, 300);
    }
  };

  const goBack = () => {
    if (currentQ > 0) {
      const prevIdx = currentQ - 1;
      setCurrentQ(prevIdx);
      const prevAnswer = answers[prevIdx];
      if (prevAnswer != null) {
        setSliderVal(prevAnswer);
        setSliderTouched(true);
      } else {
        setSliderVal(4);
        setSliderTouched(false);
      }
    }
  };

  const progress = questions.length > 0
    ? ((currentQ + (phase === 'results' ? 1 : 0)) / questions.length) * 100
    : 0;

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
            Osobnostní assessment
          </p>

          <div className="bg-white rounded-2xl p-7 text-left mb-8 border border-[#ebe8e2] shadow-sm">
            <p className="text-[15px] text-[#555] leading-relaxed mb-4">
              {TEST_CONFIG.description}
            </p>
            <div className="grid grid-cols-2 gap-3 text-sm text-[#777]">
              <div>⏱ ~{TEST_CONFIG.estimatedMinutes} minut</div>
              <div>📊 {TEST_CONFIG.questionCount} otázek</div>
              <div>🎚 Posuvník 1–7</div>
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
  if (phase === 'test' && questions.length > 0) {
    const q = questions[currentQ];
    const dim = DIMENSIONS[q.dim];
    const dimAnswered = questions.slice(0, currentQ + 1).filter(qq => qq.dim === q.dim).length;
    const dimTotal = questions.filter(qq => qq.dim === q.dim).length;
    const fillPct = ((sliderVal - 1) / 6) * 100;

    return (
      <div className="min-h-screen bg-[#FDFBF7] flex flex-col">
        {/* Sticky header */}
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
              {currentQ + 1} / {questions.length}
            </span>
            <span
              className="text-xs font-semibold px-3 py-1 rounded-full"
              style={{ color: dim.color, background: dim.colorLight }}
            >
              {dim.icon} {dim.name} ({dimAnswered}/{dimTotal})
            </span>
          </div>
        </div>

        {/* Question area */}
        <div className="flex-1 flex items-center justify-center px-6 py-8">
          <div
            className="max-w-[560px] w-full transition-all duration-300 ease-out"
            style={{
              opacity: animating ? 0.3 : 1,
              transform: animating ? 'translateY(8px)' : 'translateY(0)',
            }}
          >
            <p className="font-serif-display text-[22px] font-medium text-[#2D2D2D] leading-relaxed text-center mb-12">
              „{q.text}"
            </p>

            {/* Slider */}
            <div className="mb-5">
              <input
                type="range"
                min={1}
                max={7}
                step={1}
                value={sliderVal}
                onChange={e => handleSliderChange(e.target.value)}
                className="assessment-slider"
                style={{
                  '--slider-color': dim.color,
                  background: `linear-gradient(90deg, #ddd ${fillPct}%, #f0ede8 ${fillPct}%)`,
                }}
              />
            </div>

            {/* Labels */}
            <div className="flex justify-between mb-3">
              {SLIDER_LABELS.map((label, i) => (
                <div
                  key={i}
                  className="text-center flex-1 text-[11px] transition-all duration-200"
                  style={{
                    color: sliderTouched && sliderVal === i + 1 ? dim.color : '#bbb',
                    fontWeight: sliderTouched && sliderVal === i + 1 ? 700 : 400,
                    transform: sliderTouched && sliderVal === i + 1 ? 'scale(1.1)' : 'scale(1)',
                  }}
                >
                  {label}
                </div>
              ))}
            </div>

            {/* Value badge */}
            <div className="text-center mt-8">
              {sliderTouched ? (
                <div
                  className="inline-block rounded-xl px-6 py-2 text-base font-bold"
                  style={{ background: dim.colorLight, border: `2px solid ${dim.color}`, color: dim.color }}
                >
                  {sliderVal} — {SLIDER_LABELS[sliderVal - 1]}
                </div>
              ) : (
                <div className="text-[#bbb] text-sm">Posuň slider pro odpověď</div>
              )}
            </div>

            {/* Navigation */}
            <div className="flex justify-between items-center mt-8 gap-3">
              {currentQ > 0 ? (
                <button
                  onClick={goBack}
                  className="bg-transparent border border-[#ddd] rounded-lg px-5 py-2.5 text-sm text-[#999] cursor-pointer transition-all duration-200 hover:border-current"
                  style={{ '--tw-text-opacity': 1 }}
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
                disabled={!sliderTouched}
                className="border-none rounded-[10px] px-10 py-3.5 text-base font-semibold text-white transition-all duration-200"
                style={{
                  background: dim.color,
                  opacity: sliderTouched ? 1 : 0.4,
                  cursor: sliderTouched ? 'pointer' : 'not-allowed',
                  boxShadow: `0 4px 12px ${dim.color}44`,
                }}
                onMouseOver={e => { if (sliderTouched) { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = `0 6px 20px ${dim.color}55`; }}}
                onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = `0 4px 12px ${dim.color}44`; }}
              >
                {currentQ + 1 >= questions.length ? 'Dokončit test ✓' : 'Další →'}
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

    const implications = generateImplications(dimScores);
    const practicalImplications = {
      markdown: [
        '### Pracovní prostředí\n',
        ...implications.work.map(t => `- ${t}`),
        '\n### Komunikace a vztahy\n',
        ...implications.relationships.map(t => `- ${t}`),
        '\n### Rozvoj\n',
        `- ${implications.growth(low)}`,
      ].join('\n'),
      html: [
        `<p style="margin-bottom:12px;"><strong>Pracovní prostředí:</strong> ${implications.work.join(' ')}</p>`,
        `<p style="margin-bottom:12px;"><strong>Komunikace a vztahy:</strong> ${implications.relationships.join(' ')}</p>`,
        `<p><strong>Rozvoj:</strong> ${implications.growth(low)}</p>`,
      ].join(''),
    };

    const exportConfig = {
      ...TEST_CONFIG,
      scaleItemCount: TEST_CONFIG.questionCount,
      scenarioCount: 0,
      testType: `Big Five / OCEAN (self-assessment, ${TEST_CONFIG.questionCount} otázek, škála 1–7)`,
      scaleDescription: 'Likertova 1–7 (Vůbec ne → Rozhodně ano)',
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
              Tvůj {TEST_CONFIG.name} profil
            </h1>
            <p className="text-[#999] text-sm">Na základě {questions.length} odpovědí</p>
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
              <p>
                <strong>Pracovní prostředí:</strong>{' '}
                {implications.work.join(' ')}
              </p>
              <p>
                <strong>Vztahy a komunikace:</strong>{' '}
                {implications.relationships.join(' ')}
              </p>
              <p>
                <strong>Rozvoj:</strong>{' '}
                {implications.growth(low)}
              </p>
            </div>
          </div>

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
              ⚠️ Orientační self-assessment na základě 40 otázek. Výsledky slouží k sebereflexi —
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
