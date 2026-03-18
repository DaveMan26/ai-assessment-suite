import { MASTER_RADAR_AXES } from './integratorData';
import { getAxisScore } from './integratorLogic';

const ACCENT = '#2D2D2D';
const GRAY_SPOKE = '#c8c6c2';
const GRAY_LABEL = '#9a9894';
const RING = '#e5e2dc';
const ACTIVE_SPOKE = '#d0cdc7';

export default function MasterRadar({ allResults, size = 380 }) {
  const cx = size / 2;
  const cy = size / 2;
  const maxR = size * 0.32;
  const n = MASTER_RADAR_AXES.length;

  const rings = [0.25, 0.5, 0.75, 1];

  const axisData = MASTER_RADAR_AXES.map((axis, i) => {
    const angle = -Math.PI / 2 + (2 * Math.PI * i) / n;
    const raw = getAxisScore(allResults, axis.source.test, axis.source.dim);
    const hasData = raw != null && !Number.isNaN(Number(raw));
    const score = hasData ? Math.min(100, Math.max(0, Number(raw))) : null;
    return {
      i,
      angle,
      label: axis.label,
      hasData,
      score,
      lx: cx + Math.cos(angle) * (maxR + 28),
      ly: cy + Math.sin(angle) * (maxR + 28),
      x1: cx + Math.cos(angle) * maxR * rings[0],
      y1: cy + Math.sin(angle) * maxR * rings[0],
    };
  });

  const ringPolygons = rings.map((t) => {
    const pts = axisData
      .map(({ angle }) => `${cx + Math.cos(angle) * maxR * t},${cy + Math.sin(angle) * maxR * t}`)
      .join(' ');
    return pts;
  });

  const filled = axisData.filter((a) => a.hasData);
  let polygonPoints = '';
  if (filled.length >= 3) {
    polygonPoints = filled.map((a) => `${cx + Math.cos(a.angle) * maxR * (a.score / 100)},${cy + Math.sin(a.angle) * maxR * (a.score / 100)}`).join(' ');
  }

  const linePairs =
    filled.length === 2
      ? filled.map((a) => ({
          x: cx + Math.cos(a.angle) * maxR * (a.score / 100),
          y: cy + Math.sin(a.angle) * maxR * (a.score / 100),
        }))
      : null;

  const single = filled.length === 1 ? filled[0] : null;

  return (
    <div className="w-full flex flex-col items-center">
      <svg width={size} height={size + 40} viewBox={`0 0 ${size} ${size + 40}`} className="max-w-full h-auto">
        <g transform={`translate(0, 20)`}>
          {ringPolygons.map((pts, ri) => (
            <polygon
              key={ri}
              points={pts}
              fill="none"
              stroke={RING}
              strokeWidth={1}
            />
          ))}

          {axisData.map((a) => (
            <line
              key={`spoke-${a.i}`}
              x1={cx}
              y1={cy}
              x2={cx + Math.cos(a.angle) * maxR}
              y2={cy + Math.sin(a.angle) * maxR}
              stroke={a.hasData ? ACTIVE_SPOKE : GRAY_SPOKE}
              strokeWidth={a.hasData ? 1 : 1.2}
            />
          ))}

          {polygonPoints && (
            <polygon
              points={polygonPoints}
              fill={`${ACCENT}26`}
              stroke={ACCENT}
              strokeWidth={2}
              strokeLinejoin="round"
            />
          )}

          {linePairs && (
            <line
              x1={linePairs[0].x}
              y1={linePairs[0].y}
              x2={linePairs[1].x}
              y2={linePairs[1].y}
              stroke={ACCENT}
              strokeWidth={3}
              strokeLinecap="round"
            />
          )}

          {single && (
            <circle
              cx={cx + Math.cos(single.angle) * maxR * (single.score / 100)}
              cy={cy + Math.sin(single.angle) * maxR * (single.score / 100)}
              r={6}
              fill={ACCENT}
              stroke="#fff"
              strokeWidth={2}
            />
          )}

          {axisData.map((a) => {
            const fs = 11;
            const anchor =
              Math.abs(Math.cos(a.angle)) < 0.2 ? 'middle' : Math.cos(a.angle) > 0 ? 'start' : 'end';
            const baseline = Math.abs(Math.sin(a.angle)) < 0.2 ? 'middle' : Math.sin(a.angle) > 0 ? 'hanging' : 'auto';
            return (
              <text
                key={`lbl-${a.i}`}
                x={a.lx}
                y={a.ly}
                textAnchor={anchor}
                dominantBaseline={baseline === 'auto' ? 'auto' : baseline}
                fill={a.hasData ? ACCENT : GRAY_LABEL}
                fontSize={fs}
                fontFamily="DM Sans, system-ui, sans-serif"
                style={{ fontWeight: a.hasData ? 600 : 400 }}
              >
                {a.label}
              </text>
            );
          })}
        </g>
      </svg>
      <p className="text-xs text-[#999] text-center mt-1 max-w-md px-2">
        Meta-profily napříč testy (Big Five, EQ, kreativita, silné stránky, kariéra). IQ a kognitivní styl nejsou v tomto grafu.
      </p>
    </div>
  );
}
