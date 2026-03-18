import { Link } from 'react-router-dom';
import { useResults } from '../context/ResultsContext';
import { TEST_REGISTRY, TOTAL_TEST_SLOTS } from '../integrator/integratorData';
import { countCompletedIntegratorTests, loadResultForTest } from '../integrator/integratorLogic';

const TESTS = [
  { id: 'BIG5', name: 'Big Five', icon: '◉', description: 'Osobnostní profil v 5 dimenzích', minutes: 10, accentColor: '#E07A5F', path: '/test/big5' },
  { id: 'IQ', name: 'IQ Test', icon: '◈', description: 'Kognitivní schopnosti — 6 dimenzí', minutes: 20, accentColor: '#2D6A9F', path: '/test/iq' },
  { id: 'EQ', name: 'Emoční inteligence', icon: '♡', description: 'Vnímání a řízení emocí — 5 dimenzí EQ', minutes: 15, accentColor: '#D4726A', path: '/test/eq' },
  { id: 'CREATIVE', name: 'Kreativita', icon: '✦', description: 'Kreativní myšlení a inovace', minutes: 15, accentColor: '#FF6B6B', path: '/test/creative' },
  { id: 'STRENGTHS', name: 'Silné stránky', icon: '◆', description: 'Přirozené talenty a síly', minutes: 11, accentColor: '#264653', path: '/test/strengths' },
  { id: 'CAREER', name: 'Kariérní kompas', icon: '▲', description: 'Kariérní preference a motivace', minutes: 12, accentColor: '#E07A5F', path: '/test/career' },
  { id: 'COGNITIVE', name: 'Kognitivní styl', icon: '◇', description: 'Jak myslíš a rozhoduješ se', minutes: 10, accentColor: '#3D405B', path: '/test/cognitive' },
  { id: 'COMM', name: 'Komunikační styl', icon: '◎', description: 'Jak komunikuješ s okolím', minutes: 12, accentColor: '#E07A5F' },
  { id: 'LEADER', name: 'Leadership', icon: '⬢', description: 'Tvůj styl vedení lidí', minutes: 12, accentColor: '#3D405B' },
  { id: 'RESILIENCE', name: 'Odolnost', icon: '◐', description: 'Psychická odolnost a zvládání stresu', minutes: 10, accentColor: '#81B29A' },
  { id: 'VALUES', name: 'Hodnoty', icon: '✧', description: 'Hodnotový kompas a motivátory', minutes: 12, accentColor: '#F2CC8F' },
  { id: 'META', name: 'Metakognice', icon: '◑', description: 'Sebepoznání a učení se', minutes: 8, accentColor: '#8E7DBE' },
];

const INTEGRATOR = { id: 'integrator', name: 'Integrátor', icon: '⬣', description: 'Souhrnný profil ze všech testů', accentColor: '#2D2D2D' };

function TestCard({ test, completed, result }) {
  const hasPath = !!test.path;
  const avgScore = result?.scores
    ? Math.round(Object.values(result.scores).reduce((a, b) => a + b, 0) / Object.values(result.scores).length)
    : null;

  const card = (
    <div
      className={`bg-white rounded-2xl border border-[#ebe8e2] shadow-sm
                 p-5 flex flex-col gap-3 transition-all duration-200
                 hover:-translate-y-0.5 hover:shadow-md
                 ${hasPath ? 'cursor-pointer' : 'opacity-80 cursor-default'}`}
    >
      <div className="flex items-start justify-between">
        <span className="text-3xl leading-none" style={{ color: test.accentColor }}>
          {test.icon}
        </span>
        {completed && (
          <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200">
            Dokončeno ✓{avgScore != null && ` · Ø ${avgScore}%`}
          </span>
        )}
      </div>

      <h3 className="font-serif-display text-lg sm:text-xl leading-snug text-[#2D2D2D]">
        {test.name}
      </h3>

      <p className="text-[13px] sm:text-sm text-[#888] leading-relaxed">
        {test.description}
      </p>

      <div className="mt-auto pt-2 flex items-center justify-between border-t border-[#f0ede8]">
        <span className="font-mono text-xs text-[#888]">
          {test.minutes} min
        </span>
        {hasPath ? (
          <span className="text-xs font-medium" style={{ color: test.accentColor }}>
            {completed ? 'Znovu →' : 'Spustit →'}
          </span>
        ) : (
          <span className="text-xs text-[#bbb] italic">
            Připravuje se
          </span>
        )}
      </div>
    </div>
  );

  if (hasPath) {
    return <Link to={test.path} className="no-underline">{card}</Link>;
  }
  return card;
}

function IntegratorCard({ completedFromStorage }) {
  return (
    <Link
      to="/integrator"
      className="col-span-full no-underline block bg-[#2D2D2D] rounded-2xl border border-[#444] shadow-sm
                 p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center
                 gap-4 hover:opacity-[0.97] transition-opacity cursor-pointer"
    >
      <span className="text-4xl leading-none text-white/80">
        {INTEGRATOR.icon}
      </span>

      <div className="flex-1">
        <h3 className="font-serif-display text-xl sm:text-2xl text-white leading-snug">
          {INTEGRATOR.name}
        </h3>
        <p className="text-sm text-white/50 mt-1">
          {INTEGRATOR.description}
        </p>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <span className="text-xs font-medium px-3 py-1 rounded-full bg-white/10 text-white border border-white/20 font-mono">
          {completedFromStorage}/{TOTAL_TEST_SLOTS} testů dokončeno
        </span>
        <span className="text-xs font-medium text-emerald-400/90">Otevřít →</span>
      </div>
    </Link>
  );
}

export default function Home() {
  const { completedTests, getTestResult } = useResults();
  const registryIds = Object.keys(TEST_REGISTRY);
  const completedCount = countCompletedIntegratorTests();

  return (
    <div className="max-w-[960px] mx-auto px-4 sm:px-6 py-10 sm:py-16">
      <header className="mb-10 sm:mb-14">
        <h1 className="font-serif-display text-3xl sm:text-4xl text-[#2D2D2D] mb-3">
          AI Self-Assessment Suite
        </h1>
        <p className="text-base sm:text-lg text-[#888] mb-4">
          Komplexní sebehodnocení osobnosti, schopností a preferencí
        </p>
        <p className="font-mono text-sm text-[#2D2D2D]">
          Dokončeno {completedCount} z {TOTAL_TEST_SLOTS} (dostupné testy)
        </p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5"
           style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))' }}>
        {TESTS.map((test) => {
          const inReg = registryIds.includes(test.id);
          const done =
            inReg && loadResultForTest(test.id) != null
              ? true
              : completedTests.includes(test.id);
          const result =
            inReg && loadResultForTest(test.id)
              ? loadResultForTest(test.id)
              : getTestResult(test.id);
          return (
            <TestCard
              key={test.id}
              test={test}
              completed={done}
              result={result}
            />
          );
        })}

        <IntegratorCard completedFromStorage={completedCount} />
      </div>
    </div>
  );
}
