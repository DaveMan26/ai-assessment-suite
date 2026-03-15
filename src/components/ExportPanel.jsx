import { useState } from 'react';

export default function ExportPanel({ onExportHTML, onExportMD, testName }) {
  const [htmlDone, setHtmlDone] = useState(false);
  const [mdDone, setMdDone] = useState(false);

  const handleHTML = () => {
    onExportHTML?.();
    setHtmlDone(true);
    setTimeout(() => setHtmlDone(false), 2500);
  };

  const handleMD = () => {
    onExportMD?.();
    setMdDone(true);
    setTimeout(() => setMdDone(false), 2500);
  };

  return (
    <div className="bg-white rounded-2xl border border-[#ebe8e2] p-5 sm:p-6">
      <h3 className="font-serif-display text-lg text-[#2D2D2D] mb-4">
        Exportovat výsledky
        {testName && <span className="text-[#888] font-sans text-sm ml-2">— {testName}</span>}
      </h3>

      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={handleHTML}
          className={`flex-1 px-4 py-3 rounded-xl text-sm font-medium transition-colors duration-200
                     min-h-[44px] ${
                       htmlDone
                         ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                         : 'bg-[#f8f6f1] text-[#2D2D2D] border border-[#ebe8e2] hover:bg-[#f0ede8]'
                     }`}
        >
          {htmlDone ? '✓ Staženo' : 'Stáhnout HTML report'}
        </button>

        <button
          onClick={handleMD}
          className={`flex-1 px-4 py-3 rounded-xl text-sm font-medium transition-colors duration-200
                     min-h-[44px] ${
                       mdDone
                         ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                         : 'bg-[#f8f6f1] text-[#2D2D2D] border border-[#ebe8e2] hover:bg-[#f0ede8]'
                     }`}
        >
          {mdDone ? '✓ Staženo' : 'Stáhnout Markdown (pro AI)'}
        </button>
      </div>
    </div>
  );
}
