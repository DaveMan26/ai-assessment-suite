export default function ScenarioQuestion({
  scenario,
  selectedIndex,
  onSelect,
  accentColor = '#E07A5F',
}) {
  if (!scenario) return null;

  return (
    <div>
      <span
        className="inline-block text-xs font-medium px-2.5 py-1 rounded-full mb-4"
        style={{ backgroundColor: `${accentColor}18`, color: accentColor }}
      >
        Scénář
      </span>

      <h2 className="font-serif-display text-lg sm:text-xl text-[#2D2D2D] text-left leading-snug mb-6">
        {scenario.text}
      </h2>

      <div className="flex flex-col gap-3">
        {scenario.options.map((option, i) => {
          const isSelected = selectedIndex === i;
          return (
            <button
              key={i}
              onClick={() => onSelect(i)}
              className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200
                         min-h-[44px] ${
                           isSelected
                             ? 'shadow-sm'
                             : 'bg-white border-[#ebe8e2] hover:border-[#d5d2cc]'
                         }`}
              style={
                isSelected
                  ? {
                      borderColor: accentColor,
                      backgroundColor: `${accentColor}08`,
                    }
                  : undefined
              }
            >
              <span className="text-sm text-[#2D2D2D] leading-relaxed">
                {option.text}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
