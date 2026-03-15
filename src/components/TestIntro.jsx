export default function TestIntro({ config, onStart }) {
  if (!config) return null;

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10">
      <div className="max-w-md w-full text-center">
        <span
          className="text-5xl sm:text-6xl block mb-6"
          style={{ color: config.accentColor }}
        >
          {config.icon}
        </span>

        <h1 className="font-serif-display text-3xl sm:text-4xl text-[#2D2D2D] mb-3">
          {config.name}
        </h1>

        <p className="text-[#888] text-base sm:text-lg mb-8">
          {config.description}
        </p>

        <div className="grid grid-cols-2 gap-3 mb-8">
          <InfoCell label="Čas" value={`${config.minutes} min`} />
          <InfoCell label="Otázek" value={config.questionCount || '—'} />
          <InfoCell label="Dimenzí" value={config.dimensionCount || '—'} />
          <InfoCell label="Typ" value={config.type || 'Smíšený'} />
        </div>

        {config.tip && (
          <div className="bg-[#f8f6f1] rounded-xl p-4 mb-8 text-left">
            <p className="text-sm text-[#666]">
              <span className="font-medium text-[#2D2D2D]">Tip: </span>
              {config.tip}
            </p>
          </div>
        )}

        <button
          onClick={onStart}
          className="w-full py-3.5 px-6 rounded-xl text-white font-medium text-base
                     transition-all duration-200 hover:brightness-110 active:scale-[0.98]
                     min-h-[44px]"
          style={{ backgroundColor: config.accentColor }}
        >
          Spustit test →
        </button>
      </div>
    </div>
  );
}

function InfoCell({ label, value }) {
  return (
    <div className="bg-white rounded-xl border border-[#ebe8e2] p-3 text-center">
      <p className="text-xs text-[#888] mb-0.5">{label}</p>
      <p className="font-mono text-sm font-medium text-[#2D2D2D]">{value}</p>
    </div>
  );
}
