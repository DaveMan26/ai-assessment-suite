import { useState, useEffect } from 'react';

export default function SliderQuestion({
  question,
  value,
  onChange,
  labels = [],
  accentColor = '#E07A5F',
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(false);
    const t = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(t);
  }, [question]);

  const displayValue = value ?? 4;
  const isSelected = value != null;

  return (
    <div
      className="transition-opacity duration-300 ease-out"
      style={{ opacity: visible ? 1 : 0 }}
    >
      <h2 className="font-serif-display text-xl sm:text-[22px] text-[#2D2D2D] text-center mb-8 leading-snug">
        {question}
      </h2>

      <div className="relative mb-4">
        <input
          type="range"
          min={1}
          max={7}
          step={1}
          value={displayValue}
          onChange={(e) => onChange(Number(e.target.value))}
          className="assessment-slider"
          style={{
            '--slider-color': accentColor,
            background: isSelected
              ? `linear-gradient(90deg, ${accentColor} 0%, ${accentColor}44 100%)`
              : '#f0ede8',
          }}
        />
      </div>

      {labels.length > 0 && (
        <div className="flex justify-between px-0.5">
          {labels.map((label, i) => (
            <span
              key={i}
              className={`text-[11px] sm:text-xs text-center max-w-[60px] leading-tight
                         ${displayValue === i + 1 && isSelected ? 'text-[#2D2D2D] font-medium' : 'text-[#bbb]'}`}
            >
              {label}
            </span>
          ))}
        </div>
      )}

      {isSelected && (
        <div className="flex justify-center mt-4">
          <span
            className="font-mono text-sm px-3 py-1 rounded-full font-medium"
            style={{ backgroundColor: `${accentColor}18`, color: accentColor }}
          >
            {value}
          </span>
        </div>
      )}
    </div>
  );
}
