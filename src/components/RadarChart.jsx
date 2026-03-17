export default function RadarChart({ scores, dimensions, size = 320, referenceValue }) {
  const dims = Object.keys(dimensions);
  const count = dims.length;
  if (!count) return null;

  const cx = size / 2;
  const cy = size / 2;
  const r = size * 0.38;
  const angleStep = (2 * Math.PI) / count;
  const levels = [0.2, 0.4, 0.6, 0.8, 1.0];
  const accentColor = dimensions[dims[0]]?.color || '#E07A5F';

  const getPoint = (i, val) => {
    const angle = i * angleStep - Math.PI / 2;
    return { x: cx + r * val * Math.cos(angle), y: cy + r * val * Math.sin(angle) };
  };

  const dataPoints = dims.map((d, i) => getPoint(i, (scores[d] || 0) / 100));
  const refLevel = typeof referenceValue === 'number' ? Math.max(0, Math.min(100, referenceValue)) / 100 : null;

  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      className="w-full mx-auto block"
      style={{ maxWidth: size }}
    >
      {levels.map((l, li) => (
        <polygon
          key={li}
          points={dims.map((_, i) => { const p = getPoint(i, l); return `${p.x},${p.y}`; }).join(' ')}
          fill="none"
          stroke={li === levels.length - 1 ? '#ccc' : '#e8e8e8'}
          strokeWidth={li === levels.length - 1 ? 1.5 : 0.8}
        />
      ))}
      {refLevel != null && (
        <polygon
          points={dims.map((_, i) => {
            const p = getPoint(i, refLevel);
            return `${p.x},${p.y}`;
          }).join(' ')}
          fill="none"
          stroke="#bfbfbf"
          strokeWidth={1.2}
          strokeDasharray="4 4"
        />
      )}
      {dims.map((_, i) => {
        const p = getPoint(i, 1);
        return <line key={i} x1={cx} y1={cy} x2={p.x} y2={p.y} stroke="#ddd" strokeWidth={0.8} />;
      })}
      <polygon
        points={dataPoints.map(p => `${p.x},${p.y}`).join(' ')}
        fill={`${accentColor}22`}
        stroke={accentColor}
        strokeWidth={2.5}
        strokeLinejoin="round"
      />
      {dataPoints.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={5} fill={dimensions[dims[i]].color} stroke="#fff" strokeWidth={2} />
      ))}
      {dims.map((d, i) => {
        const p = getPoint(i, 1.22);
        return (
          <text
            key={i} x={p.x} y={p.y}
            textAnchor="middle" dominantBaseline="central"
            style={{ fontSize: 13, fontWeight: 700, fill: dimensions[d].color, fontFamily: "'DM Sans', sans-serif" }}
          >
            {dimensions[d].name}
          </text>
        );
      })}
    </svg>
  );
}
