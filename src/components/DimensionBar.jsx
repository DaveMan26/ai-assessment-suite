import { useState, useEffect } from 'react';

export default function DimensionBar({ score, dimension }) {
  const [width, setWidth] = useState(0);
  const pct = Math.round(score);
  const desc = pct >= 65 ? dimension.highDesc : pct <= 35 ? dimension.lowDesc : dimension.midDesc;

  useEffect(() => {
    const raf = requestAnimationFrame(() => setWidth(pct));
    return () => cancelAnimationFrame(raf);
  }, [pct]);

  return (
    <div className="mb-6">
      <div className="flex justify-between items-baseline mb-1.5">
        <span className="text-[15px] font-bold" style={{ color: dimension.color }}>
          {dimension.icon} {dimension.full}
        </span>
        <span className="text-xl font-extrabold font-mono" style={{ color: dimension.color }}>
          {pct}%
        </span>
      </div>
      <div className="flex justify-between text-[11px] text-[#999] mb-1">
        <span>{dimension.lowLabel}</span>
        <span>{dimension.highLabel}</span>
      </div>
      <div className="w-full h-2.5 bg-[#f0ede8] rounded-[5px] overflow-hidden">
        <div
          className="h-full rounded-[5px]"
          style={{
            width: `${width}%`,
            background: `linear-gradient(90deg, ${dimension.colorLight}, ${dimension.color})`,
            transition: 'width 1.2s cubic-bezier(.4,0,.2,1)',
          }}
        />
      </div>
      <p className="text-[13px] text-[#555] mt-2 leading-relaxed">
        {desc}
      </p>
    </div>
  );
}
