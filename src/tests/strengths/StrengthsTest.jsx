import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  TEST_CONFIG,
  DIMENSIONS,
  SCALE_ITEMS,
  FORCED_CHOICE_PAIRS,
  SLIDER_LABELS
} from './strengthsData';
import {
  calculateStrengthsScores,
  identifySignatureStrengths
} from './strengthsScoring';
import {
  getPracticalImplications,
  generateStrengthsStatement,
  generateStrengthsMarkdown,
  generateStrengthsHTML
} from './strengthsExport';
import { shuffleArray } from '../../lib/shuffle';
import { saveResults } from '../../lib/storage';
import { useResults } from '../../context/ResultsContext';
import RadarChart from '../../components/RadarChart';
import DimensionBar from '../../components/DimensionBar';
import ExportPanel from '../../components/ExportPanel';
import SliderQuestion from '../../components/SliderQuestion';
import ForcedChoiceQuestion from '../../components/ForcedChoiceQuestion';

function interleaveWithForcedChoice(likertItems, fcPairs) {
  const shuffled = shuffleArray(likertItems);
  const mixed = [];
  const interval = Math.max(1, Math.floor(shuffled.length / fcPairs.length));
  let fcIndex = 0;

  shuffled.forEach((item, i) => {
    mixed.push({ type: 'likert', data: item });
    if ((i + 1) % interval === 0 && fcIndex < fcPairs.length) {
      mixed.push({ type: 'forced_choice', data: fcPairs[fcIndex] });
      fcIndex += 1;
    }
  });

  while (fcIndex < fcPairs.length) {
    mixed.push({ type: 'forced_choice', data: fcPairs[fcIndex] });
    fcIndex += 1;
  }

  return mixed;
}

export default function StrengthsTest() {
  const { saveTestResult } = useResults();
  const [phase, setPhase] = useState('intro');
  const [items, setItems] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [likertAnswers, setLikertAnswers] = useState({});
  const [fcAnswers, setFcAnswers] = useState({});
  const [sliderVal, setSliderVal] = useState(null);
  const [animating, setAnimating] = useState(false);
  const [scores, setScores] = useState(null);
  const [ranked, setRanked] = useState([]);

  const startTest = () => {
    const mixed = interleaveWithForcedChoice(SCALE_ITEMS, FORCED_CHOICE_PAIRS);
    setItems(mixed);
    setCurrentIdx(0);
    setLikertAnswers({});
    setFcAnswers({});
    setSliderVal(null);
    setScores(null);
    setRanked([]);
    setPhase('test');
  };

  const currentItem = items[currentIdx];
  const isLikert = currentItem?.type === 'likert';
  const isForced = currentItem?.type === 'forced_choice';

  const currentScaleKey = isLikert ? currentItem.data.id : null;
  const currentPairId = isForced ? currentItem.data.id : null;

  const hasAnswer = isLikert
    ? sliderVal != null
    : isForced
    ? fcAnswers[currentPairId] != null
    : false;

  const progress = items.length > 0 ? ((currentIdx + 1) / items.length) * 100 : 0;

  const finishTest = (finalLikertAnswers, finalFcAnswers) => {
    const dimScores = calculateStrengthsScores(finalLikertAnswers, finalFcAnswers);
    const rankedStrengths = identifySignatureStrengths(dimScores);
    setScores(dimScores);
    setRanked(rankedStrengths);

    const sorted = rankedStrengths.map(r => r.dim);
    const resultData = {
      test: TEST_CONFIG.id,
      test_name: TEST_CONFIG.fullName,
      version: TEST_CONFIG.version,
      date: new Date().toISOString().split('T')[0],
      questions_count: SCALE_ITEMS.length,
      scenarios_count: FORCED_CHOICE_PAIRS.length,
      scale: TEST_CONFIG.scaleDescription,
      scores: dimScores,
      ranking: rankedStrengths.map(item => ({
        rank: item.rank,
        dimension: DIMENSIONS[item.dim].eng,
        score: Math.round(item.score),
        category: item.category
      })),
      personal_average:
        Object.values(dimScores).reduce((a, b) => a + b, 0) /
        Object.keys(dimScores).length
    };

    saveResults(TEST_CONFIG.id, resultData);
    saveTestResult('strengths', resultData);

    setTimeout(() => {
      setAnimating(false);
      setPhase('results');
    }, 500);
  };

  const submitAnswer = () => {
    if (animating || !hasAnswer) return;
    setAnimating(true);

    let nextLikert = likertAnswers;
    let nextFc = fcAnswers;

    if (isLikert && currentScaleKey) {
      nextLikert = { ...likertAnswers, [currentScaleKey]: sliderVal };
      setLikertAnswers(nextLikert);
    }
    if (isForced && currentPairId) {
      nextFc = { ...fcAnswers };
      setFcAnswers(nextFc);
    }

    if (currentIdx + 1 >= items.length) {
      finishTest(nextLikert, nextFc);
      return;
    }

    setTimeout(() => {
      const nextIdx = currentIdx + 1;
      setCurrentIdx(nextIdx);
      const nextItem = items[nextIdx];
      if (nextItem.type === 'likert') {
        const prev = nextLikert[nextItem.data.id];
        setSliderVal(prev ?? null);
      }
      setAnimating(false);
    }, 300);
  };

  const goBack = () => {
    if (currentIdx === 0) return;
    const prevIdx = currentIdx - 1;
    setCurrentIdx(prevIdx);
    const prevItem = items[prevIdx];
    if (prevItem.type === 'likert') {
      const prev = likertAnswers[prevItem.data.id];
      setSliderVal(prev ?? null);
    }
  };

  const restart = () => {
    setPhase('intro');
    setItems([]);
    setCurrentIdx(0);
    setLikertAnswers({});
    setFcAnswers({});
    setSliderVal(null);
    setAnimating(false);
    setScores(null);
    setRanked([]);
  };

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
          <div className="text-[56px] mb-4" style={{ color: TEST_CONFIG.accentColor }}>
            {TEST_CONFIG.icon}
          </div>
          <h1 className="font-serif-display text-4xl text-[#2D2D2D] mb-3 font-normal leading-tight">
            {TEST_CONFIG.name}
          </h1>
          <p className="font-serif-display text-xl text-[#888] mb-8 font-normal">
            Silné stránky a talenty
          </p>

          <div className="bg-white rounded-2xl p-7 text-left mb-8 border border-[#ebe8e2] shadow-sm">
            <p className="text-[15px] text-[#555] leading-relaxed mb-4">
              {TEST_CONFIG.description}
            </p>
            <div className="grid grid-cols-2 gap-3 text-sm text-[#777]">
              <div>⏱ ~{TEST_CONFIG.estimatedMinutes} minut</div>
              <div>📊 30 otázek + 9 párových voleb</div>
              <div>🎚 Likert 1-7 + párové volby</div>
              <div>📥 Export výsledků</div>
            </div>
            <div className="mt-5 p-3.5 px-4 bg-[#f8f6f1] rounded-[10px] text-[13px] text-[#888] leading-relaxed">
              {TEST_CONFIG.tip}
            </div>
          </div>

          <button
            type="button"
            onClick={startTest}
            className="text-white border-none rounded-xl px-12 py-4 text-[17px] font-bold cursor-pointer transition-all duration-200 hover:-translate-y-0.5"
            style={{
              background: TEST_CONFIG.accentColor,
              boxShadow: `0 4px 16px ${TEST_CONFIG.accentColor}35`
            }}
          >
            Začít test →
          </button>
        </div>
      </div>
    );
  }

  if (phase === 'test' && items.length > 0 && currentItem) {
    const dim = isLikert ? DIMENSIONS[currentItem.data.dim] : null;
    const accentColor = dim?.color || TEST_CONFIG.accentColor;

    const selectedFC = isForced ? fcAnswers[currentPairId] ?? null : null;
    const totalPairs = FORCED_CHOICE_PAIRS.length;
    const pairIndex = isForced
      ? FORCED_CHOICE_PAIRS.findIndex(p => p.id === currentPairId)
      : -1;

    return (
      <div className="min-h-screen bg-[#FDFBF7] flex flex-col">
        <div className="sticky top-0 z-50 bg-[#FDFBF7] border-b border-[#ebe8e2]">
          <div className="h-1 bg-[#f0ede8]">
            <div
              className="h-full transition-[width] duration-500 ease-[cubic-bezier(.4,0,.2,1)]"
              style={{
                width: `${progress}%`,
                background:
                  'linear-gradient(90deg, #264653 0%, #2A9D8F 100%)'
              }}
            />
          </div>
          <div className="flex justify-between items-center px-6 py-3">
            <span className="font-mono text-[13px] text-[#999]">
              {currentIdx + 1} / {items.length}
            </span>
            {isLikert && dim && (
              <span
                className="text-xs font-semibold px-3 py-1 rounded-full"
                style={{ color: dim.color, background: dim.colorLight }}
              >
                {dim.icon} {dim.name}
              </span>
            )}
            {isForced && (
              <span
                className="text-xs font-semibold px-3 py-1 rounded-full"
                style={{
                  color: TEST_CONFIG.accentColor,
                  background: TEST_CONFIG.accentColorLight
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
              opacity: animating ? 0.3 : 1,
              transform: animating ? 'translateY(8px)' : 'translateY(0)'
            }}
          >
            {isLikert && (
              <SliderQuestion
                question={`„${currentItem.data.text}"`}
                value={sliderVal}
                onChange={setSliderVal}
                labels={SLIDER_LABELS}
                accentColor={accentColor}
              />
            )}

            {isForced && (
              <ForcedChoiceQuestion
                pair={currentItem.data}
                selected={selectedFC}
                onSelect={val =>
                  setFcAnswers(prev => ({ ...prev, [currentPairId]: val }))
                }
                accentColor={TEST_CONFIG.accentColor}
                pairIndex={pairIndex}
                totalPairs={totalPairs}
              />
            )}

            <div className="flex justify-between items-center mt-8 gap-3">
              {currentIdx > 0 ? (
                <button
                  type="button"
                  onClick={goBack}
                  className="bg-transparent border border-[#ddd] rounded-lg px-5 py-2.5 text-sm text-[#999] cursor-pointer transition-all duration-200 hover:border-current"
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
                className="border-none rounded-[10px] px-10 py-3.5 text-base font-semibold text-white transition-all duration-200"
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

  if (phase === 'results' && scores && ranked.length > 0) {
    const dims = Object.keys(DIMENSIONS);
    const personalAverage =
      Object.values(scores).reduce((a, b) => a + b, 0) / dims.length;

    const signature = ranked.filter(r => r.category === 'signature');
    const supporting = ranked.filter(r => r.category === 'supporting');

    const categoryLabel = (cat) => {
      if (cat === 'signature') return 'Signaturní silná stránka';
      if (cat === 'supporting') return 'Opěrná silná stránka';
      if (cat === 'neutral') return 'Neutrální oblast';
      return 'Spící potenciál';
    };

    const sortedDims = [...ranked].sort((a, b) => b.score - a.score);

    const statement = generateStrengthsStatement(ranked);
    const implicationsSections = getPracticalImplications(ranked);
    const implicationsMarkdown = implicationsSections.join('\n\n');
    const implicationsHtml = implicationsSections
      .map(sec =>
        sec
          .split('\n')
          .map(line => {
            if (line.startsWith('### ')) {
              return `<h2>${line.replace('### ', '')}</h2>`;
            }
            if (line.startsWith('- ')) {
              return `<li>${line.replace('- ', '')}</li>`;
            }
            return `<p>${line}</p>`;
          })
          .join('')
      )
      .join('');

    const fullMarkdown = generateStrengthsMarkdown(scores, ranked);
    const fullHtml = generateStrengthsHTML(scores, ranked);

    return (
      <div className="min-h-screen bg-[#FDFBF7] px-6 py-10">
        <div className="max-w-[760px] mx-auto">
          <Link
            to="/"
            className="inline-flex items-center gap-1 text-sm text-[#888] hover:text-[#2D2D2D] transition-colors mb-8"
          >
            ← Zpět na menu
          </Link>

          <div className="text-center mb-10">
            <div className="font-mono text-sm text-[#999] tracking-[3px] uppercase mb-2">
              Výsledky
            </div>
            <h1 className="font-serif-display text-4xl text-[#2D2D2D] font-normal mb-2">
              Tvoje silné stránky
            </h1>
            <p className="text-[#999] text-sm">
              Na základě 30 Likert otázek a 9 párových voleb
            </p>
          </div>

          {signature.length > 0 && (
            <div className="bg-white rounded-2xl p-7 mb-8 border border-[#ebe8e2] shadow-sm">
              <h2 className="font-serif-display text-[22px] text-[#2D2D2D] font-normal mb-5">
                Signaturní silné stránky
              </h2>
              <div className="grid gap-4 md:grid-cols-2">
                {signature.slice(0, 3).map(item => {
                  const dim = DIMENSIONS[item.dim];
                  const pct = Math.round(item.score);
                  return (
                    <div
                      key={item.dim}
                      className="rounded-2xl p-5 border"
                      style={{
                        borderColor: dim.colorLight,
                        backgroundColor: '#fffcf7'
                      }}
                    >
                      <div className="flex items-baseline justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xl" style={{ color: dim.color }}>
                            {dim.icon}
                          </span>
                          <div>
                            <div
                              className="text-sm font-semibold tracking-[0.16em] uppercase text-[#999]"
                            >
                              Signaturní
                            </div>
                            <div className="text-[17px] font-semibold text-[#2D2D2D]">
                              {dim.name}
                            </div>
                          </div>
                        </div>
                        <span
                          className="text-2xl font-extrabold font-mono"
                          style={{ color: dim.color }}
                        >
                          {pct}%
                        </span>
                      </div>
                      <p className="text-[13px] text-[#555] leading-relaxed mb-3">
                        {dim.highDesc}
                      </p>
                      <div className="mt-3 space-y-2 text-[12px] text-[#555]">
                        <div className="p-2.5 rounded-[10px] bg-[#fff7f1] text-[#a8643b]">
                          <span className="font-semibold">⚠ Riziko přestřelení: </span>
                          {dim.shadowSide}
                        </div>
                        <div className="p-2.5 rounded-[10px] bg-[#f1f7ff] text-[#345377]">
                          <span className="font-semibold">💡 Nejlépe s: </span>
                          {dim.bestWith}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              {supporting.length > 0 && (
                <div className="mt-4 text-[13px] text-[#666]">
                  <span className="font-semibold mr-1">Opěrné silné stránky:</span>
                  {supporting
                    .map(s => DIMENSIONS[s.dim].name)
                    .join(', ')}
                </div>
              )}
            </div>
          )}

          <div className="bg-white rounded-2xl p-7 mb-8 border border-[#ebe8e2] shadow-sm">
            <h2 className="font-serif-display text-[22px] text-[#2D2D2D] font-normal mb-3">
              Strengths Statement
            </h2>
            <p className="text-[14px] text-[#444] leading-relaxed mb-4">
              {statement}
            </p>
            {implicationsSections.length > 0 && (
              <div className="mt-2 space-y-4 text-[13px] text-[#555]">
                {implicationsSections.map((sec, idx) => (
                  <div key={idx}>
                    {sec.split('\n').map((line, i) => {
                      if (!line) return null;
                      if (line.startsWith('### ')) {
                        return (
                          <h3
                            key={i}
                            className="font-serif-display text-[18px] text-[#2D2D2D] mb-1"
                          >
                            {line.replace('### ', '')}
                          </h3>
                        );
                      }
                      if (line.startsWith('- ')) {
                        return (
                          <p key={i} className="ml-3">
                            • {line.replace('- ', '')}
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
            )}
          </div>

          <ExportPanel
            testConfig={TEST_CONFIG}
            dimensions={DIMENSIONS}
            scores={scores}
            practicalImplications={{
              markdown: implicationsMarkdown,
              html: implicationsHtml,
              fullMarkdown,
              fullHtml
            }}
          />

          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[12px] text-[#999]">
            <button
              type="button"
              onClick={restart}
              className="bg-transparent border border-[#ddd] rounded-lg px-4 py-2 text-sm text-[#777] cursor-pointer transition-colors hover:border-[#264653] hover:text-[#264653]"
            >
              Zopakovat test
            </button>
            <p className="text-[11px] text-right leading-relaxed">
              Tento test má orientační charakter a nenahrazuje klinickou diagnostiku. Ber výsledky jako podnět k sebereflexi a rozhovoru, ne jako definitivní nálepku.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

