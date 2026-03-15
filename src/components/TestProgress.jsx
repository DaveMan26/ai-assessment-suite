export default function TestProgress({ current, total, accentColor = '#E07A5F', dimensionName }) {
  const pct = total > 0 ? (current / total) * 100 : 0;

  return (
    <div className="sticky top-0 z-50 bg-[#FDFBF7]/95 backdrop-blur-sm border-b border-[#ebe8e2]">
      <div
        className="h-1"
        style={{
          background: `linear-gradient(90deg, ${accentColor} ${pct}%, #f0ede8 ${pct}%)`,
          transition: 'background 0.4s ease',
        }}
      />
      <div className="max-w-[560px] mx-auto px-4 py-2.5 flex items-center justify-between">
        <span className="font-mono text-xs sm:text-[13px] text-[#2D2D2D]">
          Otázka {current} / {total}
        </span>
        {dimensionName && (
          <span
            className="text-xs px-2 py-0.5 rounded-full font-medium"
            style={{ backgroundColor: `${accentColor}18`, color: accentColor }}
          >
            {dimensionName}
          </span>
        )}
      </div>
    </div>
  );
}
