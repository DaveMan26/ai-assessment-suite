import { useState, useEffect } from 'react';

export default function DimensionBar({
  name,
  score,
  level,
  color = '#E07A5F',
  icon,
  description,
  interpretation,
}) {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setWidth(score));
    return () => cancelAnimationFrame(raf);
  }, [score]);

  return (
    <div className="mb-5">
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-2">
          {icon && <span className="text-lg">{icon}</span>}
          <span className="text-sm font-medium text-[#2D2D2D]">{name}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-mono text-sm text-[#2D2D2D]">
            {Math.round(score)}
          </span>
          {level && (
            <span
              className="text-xs px-2 py-0.5 rounded-full font-medium"
              style={{ backgroundColor: `${color}18`, color }}
            >
              {level}
            </span>
          )}
        </div>
      </div>

      <div className="w-full h-2.5 rounded-full bg-[#f0ede8] overflow-hidden">
        <div
          className="h-full rounded-full"
          style={{
            width: `${width}%`,
            backgroundColor: color,
            transition: 'width 1.2s cubic-bezier(0.22, 1, 0.36, 1)',
          }}
        />
      </div>

      {description && (
        <p className="text-xs text-[#888] mt-1">{description}</p>
      )}
      {interpretation && (
        <p className="text-xs text-[#666] mt-1 italic">{interpretation}</p>
      )}
    </div>
  );
}
