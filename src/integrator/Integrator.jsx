import { useMemo, useState, useCallback } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import ExportPanel from '../components/ExportPanel';
import { clearResults } from '../lib/storage';
import { useResults } from '../context/ResultsContext';
import { getLevel, getBar } from '../lib/levels';
import BipolarScale from '../tests/cognitive/BipolarScale';
import { TEST_REGISTRY, PENDING_TESTS, TOTAL_TEST_SLOTS } from './integratorData';
import MasterRadar from './MasterRadar';
import {
  loadAllResults,
  normalizeAllScores,
  getTopDimensions,
  getBottomDimensions,
  checkConsistency,
  generateContextStatement,
} from './integratorLogic';
import { generateIntegratorMarkdown, generateIntegratorHTML } from './integratorExport';

const CARD = 'bg-white rounded-[20px] border border-[#ebe8e2] shadow-[0_2px_16px_rgba(0,0,0,0.04)] p-8';

const INTEGRATOR_EXPORT_CONFIG = {
  id: 'INTEGRATOR',
  name: 'Souhrnný profil',
  fullName: 'Souhrnný profil — Integrátor',
  accentColor: '#2D2D2D',
  reportFilePrefix: 'integrator',
  version: '1.0',
};

export default function Integrator() {
  const navigate = useNavigate();
  const location = useLocation();
  const { clearAll } = useResults();
  const allResults = useMemo(() => loadAllResults(), [location.key]);
  const completedIds = useMemo(
    () => Object.keys(allResults).filter((id) => allResults[id] != null),
    [allResults],
  );
  const n = completedIds.length;

  const normalized = useMemo(() => normalizeAllScores(allResults), [allResults]);
  const top5 = useMemo(() => getTopDimensions(normalized, 5), [normalized]);
  const bottom5 = useMemo(() => getBottomDimensions(normalized, 5), [normalized]);
  const consistency = useMemo(() => checkConsistency(allResults), [allResults]);
  const contextText = useMemo(() => generateContextStatement(allResults, consistency), [allResults, consistency]);

  const [copied, setCopied] = useState(false);
  const copyContext = useCallback(() => {
    navigator.clipboard.writeText(contextText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  }, [contextText]);

  const handleClearAll = () => {
    if (!window.confirm('Opravdu chceš smazat výsledky všech testů? Tato akce je nevratná.')) return;
    clearResults();
    clearAll();
    navigate('/');
  };

  const cognitiveScores = allResults.COGNITIVE?.scores || allResults.COGNITIVE;

  const allTestsForGrid = [
    ...Object.values(TEST_REGISTRY).map((t) => ({ ...t, pending: false })),
    ...PENDING_TESTS.map((p) => ({
      id: p.id,
      name: p.name,
      shortName: p.shortName,
      icon: p.icon,
      color: p.color,
      route: null,
      pending: true,
    })),
  ];

  return (
    <div className="min-h-screen bg-[#faf9f7] pb-16">
      <div className="max-w-[900px] mx-auto px-4 sm:px-6 py-8 sm:py-10">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-[#888] hover:text-[#2D2D2D] mb-8 no-underline font-sans"
        >
          ← Zpět na menu
        </Link>

        <header className="mb-8">
          <p className="font-mono text-sm uppercase tracking-[0.2em] text-[#999] mb-2">SOUHRNNÝ PROFIL</p>
          <h1 className="font-serif-display text-[28px] sm:text-[32px] text-[#2D2D2D] font-normal leading-tight m-0">
            Integrace výsledků z {n} testů
          </h1>
          <p className="text-sm text-[#888] mt-2 font-sans">Založeno na {n} z {TOTAL_TEST_SLOTS} testů</p>
        </header>

        {n === 0 ? (
          <div className={`${CARD} text-center py-14`}>
            <p className="text-[#2D2D2D] text-lg mb-2">Zatím nemáš žádné výsledky.</p>
            <p className="text-[#888] text-sm mb-8 max-w-md mx-auto">
              Začni vyplněním alespoň 3 testů — integrátor ti pak ukáže souhrnný profil.
            </p>
            <Link
              to="/"
              className="inline-block px-6 py-3 rounded-full bg-[#2D2D2D] text-white text-sm font-medium no-underline hover:opacity-90"
            >
              Přejít na testy →
            </Link>
          </div>
        ) : (
          <>
            {n > 0 && n < 3 && (
              <div
                className="mb-6 p-4 rounded-[16px] border border-amber-200 bg-amber-50/80 text-sm text-[#856404] font-sans"
                role="status"
              >
                Máš dokončené {n} z {TOTAL_TEST_SLOTS} testů. Pro smysluplnější souhrnný profil doporučujeme
                dokončit alespoň 3 testy.
              </div>
            )}

            <div className={`${CARD} mb-6`}>
              <h2 className="font-serif-display text-xl text-[#2D2D2D] mt-0 mb-4">Dokončení testů</h2>
              <div
                className="grid gap-3"
                style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))' }}
              >
                {allTestsForGrid.map((t) => {
                  const done = !t.pending && allResults[t.id] != null;
                  const content = (
                    <div
                      className={`rounded-2xl border p-3 text-center transition-opacity ${
                        t.pending || done ? '' : 'cursor-pointer hover:shadow-md'
                      } ${!done && !t.pending ? 'opacity-50 border-[#ebe8e2]' : 'border-[#ebe8e2]'}`}
                      style={{
                        opacity: t.pending || done ? 1 : 0.5,
                        borderColor: done ? `${t.color}55` : undefined,
                      }}
                    >
                      <div className="text-xl mb-1" style={{ color: t.color }}>
                        {t.icon}
                      </div>
                      <div className="text-xs font-medium text-[#2D2D2D] leading-tight">{t.shortName || t.name}</div>
                      <div className="text-[10px] mt-1 font-mono">
                        {done ? (
                          <span className="text-emerald-600">✓</span>
                        ) : t.pending ? (
                          <span className="text-[#bbb]">⏳</span>
                        ) : (
                          <span className="text-[#bbb]">⏳</span>
                        )}
                      </div>
                    </div>
                  );
                  if (!t.pending && !done && t.route) {
                    return (
                      <Link key={t.id} to={t.route} className="no-underline text-inherit">
                        {content}
                      </Link>
                    );
                  }
                  return (
                    <div key={t.id} className={t.pending ? 'opacity-50' : ''}>
                      {content}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className={`${CARD} mb-6`}>
              <h2 className="font-serif-display text-xl text-[#2D2D2D] mt-0 mb-2">Master radar</h2>
              <MasterRadar allResults={allResults} />
            </div>

            <div className={`${CARD} mb-6`}>
              <h2 className="font-serif-display text-xl text-[#2D2D2D] mt-0 mb-4">Top 5 silných stránek</h2>
              <ul className="space-y-4 list-none p-0 m-0">
                {top5.map((d) => (
                  <li key={`${d.testId}-${d.dimKey}`} className="font-sans">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span
                        className="text-[10px] font-mono px-2 py-0.5 rounded-full text-white"
                        style={{ backgroundColor: d.color }}
                      >
                        {d.testShortName}
                      </span>
                      <span className="font-medium text-[#2D2D2D]">
                        {d.dimName} — {d.score}% {getLevel(d.score)}
                      </span>
                    </div>
                    <div className="font-mono text-sm text-[#666] tracking-wide">{getBar(d.score)}</div>
                  </li>
                ))}
              </ul>
            </div>

            <div className={`${CARD} mb-6`}>
              <h2 className="font-serif-display text-xl text-[#2D2D2D] mt-0 mb-1">Rozvojové oblasti</h2>
              <p className="text-sm text-[#888] mb-4">Prostor pro růst — oblasti s největším potenciálem rozvoje.</p>
              <ul className="space-y-4 list-none p-0 m-0">
                {bottom5.map((d) => (
                  <li key={`${d.testId}-${d.dimKey}`} className="font-sans">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span
                        className="text-[10px] font-mono px-2 py-0.5 rounded-full text-white"
                        style={{ backgroundColor: d.color }}
                      >
                        {d.testShortName}
                      </span>
                      <span className="font-medium text-[#2D2D2D]">
                        {d.dimName} — {d.score}% {getLevel(d.score)}
                      </span>
                    </div>
                    <div className="font-mono text-sm text-[#666] tracking-wide">{getBar(d.score)}</div>
                  </li>
                ))}
              </ul>
            </div>

            {allResults.COGNITIVE && cognitiveScores && (
              <div className={`${CARD} mb-6`}>
                <h2 className="font-serif-display text-xl text-[#2D2D2D] mt-0 mb-1">Kognitivní styl</h2>
                <p className="text-sm text-[#888] mb-6">Tvůj preferovaný styl zpracování a rozhodování.</p>
                <div className="space-y-4">
                  {Object.entries(TEST_REGISTRY.COGNITIVE.dimensions).map(([k, meta]) => {
                    const v = cognitiveScores[k];
                    if (typeof v !== 'number') return null;
                    return (
                      <div key={k}>
                        <p className="text-sm font-medium text-[#2D2D2D] mb-2">{meta.name}</p>
                        <BipolarScale
                          poleALabel={meta.poleA}
                          poleBLabel={meta.poleB}
                          value={v}
                          color={meta.color}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {n >= 2 && (
              <div className={`${CARD} mb-6`}>
                <h2 className="font-serif-display text-xl text-[#2D2D2D] mt-0 mb-4">Cross-test konzistence</h2>
                {consistency.length === 0 ? (
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 text-emerald-700 text-sm border border-emerald-200 font-sans">
                    Konzistentní profil — výsledky testů si v kontrolovaných párech odpovídají
                  </div>
                ) : (
                  <ul className="space-y-4 list-none p-0 m-0">
                    {consistency.slice(0, 5).map((c, idx) => (
                      <li
                        key={idx}
                        className="p-4 rounded-2xl border border-[#ebe8e2] bg-[#fafaf9] font-sans text-sm"
                      >
                        <div className="font-medium text-[#2D2D2D] mb-2">🔍 {c.label}</div>
                        <div className="font-mono text-xs text-[#666] mb-2">
                          {TEST_REGISTRY[c.testA]?.shortName || c.testA}: {c.scoreA}% ·{' '}
                          {TEST_REGISTRY[c.testB]?.shortName || c.testB}: {c.scoreB}%
                        </div>
                        <p className="text-[#666] leading-relaxed m-0">
                          Zajímavý kontrast — výsledky se v tomto páru liší víc, než bývá typické. Může to znamenat
                          odlišný kontext sebehodnocení, vývoj v čase, nebo nuanci tvého profilu. {c.desc}
                        </p>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            <div className={`${CARD} mb-6`}>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                <h2 className="font-serif-display text-xl text-[#2D2D2D] m-0">AI Context Statement</h2>
                <button
                  type="button"
                  onClick={copyContext}
                  className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors font-sans ${
                    copied
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                      : 'bg-[#2D2D2D] border-[#2D2D2D] text-white hover:opacity-90'
                  }`}
                >
                  {copied ? 'Zkopírováno ✓' : 'Kopírovat do schránky'}
                </button>
              </div>
              <pre className="font-mono text-[13px] leading-relaxed text-[#333] whitespace-pre-wrap bg-[#f8f6f1] p-5 rounded-2xl border border-[#ebe8e2] m-0 overflow-x-auto">
                {contextText}
              </pre>
              <p className="text-xs text-[#999] mt-3 mb-0">
                Tento text můžeš vložit jako kontext do AI nástroje pro personalizované odpovědi.
              </p>
            </div>

            <ExportPanel
              testConfig={INTEGRATOR_EXPORT_CONFIG}
              dimensions={{}}
              scores={{}}
              practicalImplications={{
                fullMarkdown: generateIntegratorMarkdown(allResults),
                fullHtml: generateIntegratorHTML(allResults),
              }}
            />

            <footer className="mt-10 pt-8 border-t border-[#ebe8e2] text-center">
              <p className="text-xs text-[#999] max-w-lg mx-auto mb-6 font-sans leading-relaxed">
                Výsledky mají orientační charakter a slouží jako podnět pro sebereflexi, nikoli jako klinická
                diagnóza.
              </p>
              <button
                type="button"
                onClick={handleClearAll}
                className="text-sm text-red-600 hover:text-red-800 underline font-sans bg-transparent border-0 cursor-pointer"
              >
                Smazat všechny výsledky
              </button>
            </footer>
          </>
        )}
      </div>
    </div>
  );
}
