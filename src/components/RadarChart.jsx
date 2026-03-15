import { useMemo } from 'react';

const LEVELS = [20, 40, 60, 80, 100];

function polarToCartesian(cx, cy, radius, angleDeg) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return {
    x: cx + radius * Math.cos(rad),
    y: cy + radius * Math.sin(rad),
  };
}

function polygonPoints(cx, cy, radius, count) {
  const step = 360 / count;
  return Array.from({ length: count }, (_, i) => {
    const { x, y } = polarToCartesian(cx, cy, radius, i * step);
    return `${x},${y}`;
  }).join(' ');
}

export default function RadarChart({ dimensions = [], size = 300 }) {
  const cx = size / 2;
  const cy = size / 2;
  const maxR = size * 0.38;
  const count = dimensions.length;
  const step = 360 / count;
  const labelOffset = size * 0.46;

  const dataPoints = useMemo(() => {
    if (!count) return '';
    return dimensions
      .map((dim, i) => {
        const r = (dim.score / 100) * maxR;
        const { x, y } = polarToCartesian(cx, cy, r, i * step);
        return `${x},${y}`;
      })
      .join(' ');
  }, [dimensions, cx, cy, maxR, count, step]);

  const accentColor = dimensions[0]?.color || '#E07A5F';

  if (!count) return null;

  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      className="w-full max-w-xs sm:max-w-sm mx-auto"
      role="img"
      aria-label="Radar chart"
    >
      {LEVELS.map(level => (
        <polygon
          key={level}
          points={polygonPoints(cx, cy, (level / 100) * maxR, count)}
          fill="none"
          stroke="#ebe8e2"
          strokeWidth="1"
        />
      ))}

      {dimensions.map((_, i) => {
        const { x, y } = polarToCartesian(cx, cy, maxR, i * step);
        return (
          <line
            key={i}
            x1={cx} y1={cy} x2={x} y2={y}
            stroke="#ebe8e2"
            strokeWidth="1"
          />
        );
      })}

      <polygon
        points={dataPoints}
        fill={accentColor}
        fillOpacity="0.2"
        stroke={accentColor}
        strokeWidth="2"
        strokeLinejoin="round"
      />

      {dimensions.map((dim, i) => {
        const { x, y } = polarToCartesian(cx, cy, labelOffset, i * step);
        return (
          <text
            key={dim.name}
            x={x} y={y}
            textAnchor="middle"
            dominantBaseline="central"
            className="text-[10px] sm:text-xs fill-[#888]"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            {dim.name}
          </text>
        );
      })}
    </svg>
  );
}
