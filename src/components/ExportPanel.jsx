import { useState } from 'react';
import { generateMarkdownReport, generateHTMLReport, downloadFile } from '../lib/export';

export default function ExportPanel({ testConfig, dimensions, scores, practicalImplications }) {
  const [exported, setExported] = useState({ md: false, html: false });
  const accent = testConfig.accentColor || '#E07A5F';
  const filePrefix = testConfig.name.toLowerCase().replace(/\s+/g, '-');

  const handleHTML = () => {
    const html = generateHTMLReport(testConfig, dimensions, scores, practicalImplications?.html || '');
    const now = new Date().toISOString().split('T')[0];
    downloadFile(html, `${filePrefix}-report_${now}.html`, 'text/html;charset=utf-8');
    setExported(p => ({ ...p, html: true }));
  };

  const handleMarkdown = () => {
    const md = generateMarkdownReport(testConfig, dimensions, scores, practicalImplications?.markdown || '');
    const now = new Date().toISOString().split('T')[0];
    downloadFile(md, `${filePrefix}-vysledky_${now}.md`, 'text/markdown;charset=utf-8');
    setExported(p => ({ ...p, md: true }));
  };

  return (
    <div
      className="bg-white rounded-2xl p-7 mb-8"
      style={{ border: `2px solid ${accent}33`, boxShadow: `0 4px 24px ${accent}08` }}
    >
      <div className="flex items-center gap-3 mb-2">
        <div
          className="w-9 h-9 rounded-[10px] flex items-center justify-center text-xl"
          style={{ background: `${accent}15` }}
        >
          💾
        </div>
        <h2 className="font-serif-display text-[22px] text-[#2D2D2D] font-normal m-0">
          Exportovat výsledky
        </h2>
      </div>
      <p className="text-[13px] text-[#999] mb-6 leading-relaxed">
        Dva formáty — vizuální report pro archivaci a strukturovaný markdown pro další AI analýzu.
      </p>

      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={handleHTML}
          className="flex flex-col items-center gap-2.5 p-6 rounded-2xl cursor-pointer transition-all duration-200 border-2"
          style={{
            background: exported.html ? '#f0fdf4' : '#fdf8f6',
            borderColor: exported.html ? '#81B29A' : `${accent}44`,
          }}
          onMouseOver={e => { if (!exported.html) { e.currentTarget.style.borderColor = accent; e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = `0 8px 24px ${accent}25`; }}}
          onMouseOut={e => { if (!exported.html) { e.currentTarget.style.borderColor = `${accent}44`; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}}
        >
          <div
            className="w-[52px] h-[52px] rounded-[14px] flex items-center justify-center text-[26px]"
            style={{ background: exported.html ? '#81B29A22' : `${accent}12` }}
          >
            {exported.html ? '✓' : '📊'}
          </div>
          <div className="font-bold text-[15px]" style={{ color: exported.html ? '#81B29A' : accent }}>
            {exported.html ? 'Staženo!' : 'Vizuální report'}
          </div>
          <div className="text-xs text-[#999] text-center leading-relaxed">
            HTML s grafem a škálami<br />
            <span className="text-[11px] text-[#bbb]">Otevři → Ctrl+P → ulož PDF</span>
          </div>
        </button>

        <button
          onClick={handleMarkdown}
          className="flex flex-col items-center gap-2.5 p-6 rounded-2xl cursor-pointer transition-all duration-200 border-2"
          style={{
            background: exported.md ? '#f0fdf4' : '#f6f5fa',
            borderColor: exported.md ? '#81B29A' : '#8E7DBE44',
          }}
          onMouseOver={e => { if (!exported.md) { e.currentTarget.style.borderColor = '#8E7DBE'; e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(142,125,190,0.15)'; }}}
          onMouseOut={e => { if (!exported.md) { e.currentTarget.style.borderColor = '#8E7DBE44'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}}
        >
          <div
            className="w-[52px] h-[52px] rounded-[14px] flex items-center justify-center text-[26px]"
            style={{ background: exported.md ? '#81B29A22' : '#8E7DBE12' }}
          >
            {exported.md ? '✓' : '📝'}
          </div>
          <div className="font-bold text-[15px]" style={{ color: exported.md ? '#81B29A' : '#8E7DBE' }}>
            {exported.md ? 'Staženo!' : 'Markdown pro AI'}
          </div>
          <div className="text-xs text-[#999] text-center leading-relaxed">
            Strukturovaný .md soubor<br />
            <span className="text-[11px] text-[#bbb]">Včetně JSON dat pro AI zpracování</span>
          </div>
        </button>
      </div>

      <div className="mt-5 p-3 px-4 bg-[#f8f6f1] rounded-[10px] text-xs text-[#999] leading-relaxed">
        💡 <strong>Tip:</strong> Markdown soubor můžeš rovnou přiložit do nové konverzace s AI jako
        kontext pro další testy nebo analýzy. JSON blok na konci souboru je strojově čitelný.
      </div>
    </div>
  );
}
