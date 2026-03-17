export default function ForcedChoiceQuestion({
  pair,
  selected,
  onSelect,
  accentColor = '#264653',
  pairIndex,
  totalPairs
}) {
  if (!pair) return null;

  const handleSelect = (value) => {
    if (onSelect) onSelect(value);
  };

  const badgeText = `Párová volba ${pairIndex + 1}/${totalPairs}`;
  const selectedA = selected === 'A';
  const selectedB = selected === 'B';

  return (
    <div className="w-full">
      <div className="flex flex-col items-center text-center mb-6">
        <div className="font-mono text-[11px] tracking-[0.24em] uppercase text-[#999] mb-2">
          {badgeText}
        </div>
        <h2 className="font-serif-display text-xl sm:text-[22px] text-[#2D2D2D] mb-1 leading-snug">
          Které tvrzení tě lépe popisuje?
        </h2>
        <p className="text-[13px] text-[#888] max-w-[460px] leading-relaxed">
          I když obě mohou být částečně pravdivá — vyber to, které ti sedí víc.
        </p>
      </div>

      <div className="mt-4 grid gap-4"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(0, 1fr))'
        }}
      >
        <ChoiceCard
          label="A"
          text={pair.optionA.text}
          accentColor={accentColor}
          selected={selectedA}
          dimSide={!!selected}
          onClick={() => handleSelect('A')}
        />
        <ChoiceCard
          label="B"
          text={pair.optionB.text}
          accentColor={accentColor}
          selected={selectedB}
          dimSide={!!selected}
          onClick={() => handleSelect('B')}
        />
      </div>
    </div>
  );
}

function ChoiceCard({ label, text, selected, dimSide, accentColor, onClick }) {
  const baseBorder = '#ebe8e2';
  const borderColor = selected ? accentColor : baseBorder;
  const background = selected ? `${accentColor}08` : '#FFFFFF';
  const opacity = !selected && dimSide ? 0.6 : 1;

  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full text-left rounded-2xl border-2 p-5 sm:p-6 transition-all duration-200 cursor-pointer bg-white"
      style={{
        borderColor,
        background,
        opacity,
        transform: selected ? 'scale(1.02) translateY(-2px)' : 'scale(1) translateY(0)',
        boxShadow: selected ? `0 10px 30px ${accentColor}1f` : '0 4px 12px rgba(0,0,0,0.02)'
      }}
      onMouseOver={e => {
        e.currentTarget.style.transform = selected
          ? 'scale(1.03) translateY(-3px)'
          : 'translateY(-2px)';
        e.currentTarget.style.boxShadow = selected
          ? `0 12px 32px ${accentColor}26`
          : '0 8px 20px rgba(0,0,0,0.04)';
      }}
      onMouseOut={e => {
        e.currentTarget.style.transform = selected
          ? 'scale(1.02) translateY(-2px)'
          : 'scale(1) translateY(0)';
        e.currentTarget.style.boxShadow = selected
          ? `0 10px 30px ${accentColor}1f`
          : '0 4px 12px rgba(0,0,0,0.02)';
      }}
    >
      <div className="flex items-center gap-2 mb-3">
        <div
          className="inline-flex items-center justify-center rounded-full px-2.5 py-1 text-[11px] font-mono font-medium"
          style={{
            backgroundColor: '#f3f0ea',
            color: '#8b8270'
          }}
        >
          {label}
        </div>
      </div>
      <p className="text-[14px] sm:text-[15px] text-[#2D2D2D] leading-relaxed">
        {text}
      </p>
    </button>
  );
}

