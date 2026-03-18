function clamp100(x) {
  if (Number.isNaN(x) || x == null) return 50;
  return Math.min(100, Math.max(0, x));
}

export default function BipolarScale({
  poleALabel,
  poleBLabel,
  value,
  color = '#3D405B',
  interpretation,
}) {
  const v = clamp100(Number(value));
  const left = `calc(${v}% - 10px)`;

  return (
    <div className="bg-white rounded-2xl border border-[#ebe8e2] p-5 sm:p-6 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="text-sm font-medium text-[#2D2D2D]">{poleALabel}</div>
        <div className="text-sm font-medium text-[#2D2D2D]">{poleBLabel}</div>
      </div>

      <div className="relative h-3 rounded-full overflow-hidden mb-3" style={{ background: '#f0ede8' }}>
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(90deg, ${color}55 0%, ${color} 100%)`,
          }}
        />

        <div
          className="absolute top-[-6px] bottom-[-6px] w-[2px]"
          style={{ left: '50%', backgroundColor: '#ffffffcc' }}
        />
        <div
          className="absolute top-[-6px] bottom-[-6px] w-[1px]"
          style={{ left: '50%', backgroundColor: `${color}55` }}
        />

        <div
          className="absolute top-1/2 w-5 h-5 rounded-full border-2 shadow-sm"
          style={{
            left,
            transform: 'translateY(-50%)',
            backgroundColor: '#fff',
            borderColor: color,
          }}
          aria-label={`Pozice na škále: ${Math.round(v)}%`}
          title={`${Math.round(v)}%`}
        />
      </div>

      <div className="flex items-center justify-between text-xs text-[#999] font-mono">
        <span>0%</span>
        <span style={{ color }}>50%</span>
        <span>100%</span>
      </div>

      {interpretation ? (
        <div className="mt-4 text-sm text-[#666] leading-relaxed">{interpretation}</div>
      ) : null}
    </div>
  );
}

