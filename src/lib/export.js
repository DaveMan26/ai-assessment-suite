import { getLevel, getLevelEng, getBar } from './levels';

export function downloadFile(content, filename, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function generateMarkdownReport(testConfig, dimensions, scores, practicalImplications = '') {
  const now = new Date().toISOString().split('T')[0];
  const dims = Object.keys(dimensions);
  const sorted = [...dims].sort((a, b) => (scores[b] ?? 0) - (scores[a] ?? 0));
  const overall = Math.round(dims.reduce((s, d) => s + (scores[d] || 0), 0) / dims.length);
  const questionCount = testConfig.scaleItemCount || testConfig.questionCount || 0;
  const scaleDesc = testConfig.scaleDescription || 'Likert 1-7';

  let md = `# ${testConfig.id} — ${testConfig.fullName} — Výsledky\n\n`;
  md += `- **Datum:** ${now}\n`;
  md += `- **Verze testu:** ${testConfig.version}\n`;
  md += `- **Typ testu:** ${testConfig.testType || testConfig.fullName}\n`;
  md += `- **Metoda:** AI-administrovaný interaktivní test\n`;
  md += `- **Počet položek:** ${questionCount} škálových${testConfig.scenarioCount ? ` + ${testConfig.scenarioCount} scénářů` : ''}\n`;
  md += `- **Škála:** ${scaleDesc}\n`;
  md += `- **Validita:** Orientační self-assessment (nikoliv klinicky standardizovaný)\n\n`;
  md += `---\n\n`;

  md += `## Souhrnné skóre\n\n`;
  if (testConfig.overallLabel) {
    md += `- **Celkový ${testConfig.overallLabel}:** ${overall}%\n\n`;
  }
  md += `| Dimenze | Skóre | Úroveň | Vizualizace |\n`;
  md += `|---------|-------|--------|-------------|\n`;
  dims.forEach(d => {
    const dim = dimensions[d];
    const pct = Math.round(scores[d]);
    md += `| ${dim.icon} ${dim.full} (${dim.eng}) | ${pct}% | ${getLevel(pct)} | ${getBar(pct)} |\n`;
  });
  md += `\n`;

  md += `## Pořadí dimenzí (od nejsilnější)\n\n`;
  sorted.forEach((d, i) => {
    md += `${i + 1}. **${dimensions[d].full}** — ${Math.round(scores[d])}%\n`;
  });
  md += `\n---\n\n`;

  md += `## Detailní interpretace\n\n`;
  dims.forEach(d => {
    const dim = dimensions[d];
    const pct = Math.round(scores[d]);
    const desc = pct >= 65 ? dim.highDesc : pct <= 35 ? dim.lowDesc : dim.midDesc;
    md += `### ${dim.icon} ${dim.full} (${dim.eng}) — ${pct}%\n\n`;
    md += `- **Úroveň:** ${getLevel(pct)}\n`;
    md += `- **Škála:** ${dim.lowLabel} ← → ${dim.highLabel}\n`;
    md += `- **Interpretace:** ${desc}\n`;
    if (dim.subfacets && dim.subfacets.length) md += `- **Subfacety:** ${dim.subfacets.join(', ')}\n`;
    md += `\n`;
  });

  md += `---\n\n`;
  if (practicalImplications) {
    md += `## Praktické implikace\n\n${practicalImplications}\n\n`;
    md += `---\n\n`;
  }

  md += `## Strojově čitelná data (JSON)\n\n`;
  md += '```json\n';
  const jsonData = {
    test: testConfig.id,
    test_name: testConfig.fullName,
    version: testConfig.version,
    date: now,
    questions_count: questionCount,
    scenarios_count: testConfig.scenarioCount || 0,
    scale: scaleDesc,
    scores: {},
    ranking: sorted.map((d, i) => ({ rank: i + 1, dimension: dimensions[d].eng, score: Math.round(scores[d]) })),
    overall_percentile: overall
  };
  dims.forEach(d => {
    jsonData.scores[dimensions[d].eng] = {
      percentile: Math.round(scores[d]),
      level: getLevelEng(scores[d]),
      level_cz: getLevel(scores[d])
    };
  });
  md += JSON.stringify(jsonData, null, 2);
  md += '\n```\n\n';
  md += `---\n\n`;
  md += `> Orientační self-assessment — nenahrazuje standardizovaný psychologický test.\n`;
  md += `> Vytvořeno interaktivním AI assessment nástrojem, verze ${testConfig.version}.\n`;
  return md;
}

export function generateHTMLReport(testConfig, dimensions, scores, practicalImplications = '') {
  const dims = Object.keys(dimensions);
  const sorted = [...dims].sort((a, b) => (scores[b] ?? 0) - (scores[a] ?? 0));
  const now = new Date().toLocaleDateString('cs-CZ', { year: 'numeric', month: 'long', day: 'numeric' });
  const accent = testConfig.accentColor || '#E07A5F';
  const questionCount = testConfig.scaleItemCount || testConfig.questionCount || 0;

  const size = 280, cx = size / 2, cy = size / 2, rad = size * 0.36;
  const angleStep = (2 * Math.PI) / dims.length;
  const levels = [0.2, 0.4, 0.6, 0.8, 1.0];
  const gp = (i, v) => {
    const a = i * angleStep - Math.PI / 2;
    return { x: cx + rad * v * Math.cos(a), y: cy + rad * v * Math.sin(a) };
  };
  const dp = dims.map((d, i) => gp(i, (scores[d] ?? 0) / 100));

  let svg = `<svg viewBox="0 0 ${size} ${size}" width="${size}" xmlns="http://www.w3.org/2000/svg">`;
  levels.forEach((l, li) => {
    const pts = dims.map((_, i) => { const p = gp(i, l); return `${p.x},${p.y}`; }).join(' ');
    svg += `<polygon points="${pts}" fill="none" stroke="${li === 4 ? '#bbb' : '#e0e0e0'}" stroke-width="${li === 4 ? 1.2 : 0.6}"/>`;
  });
  dims.forEach((_, i) => {
    const p = gp(i, 1);
    svg += `<line x1="${cx}" y1="${cy}" x2="${p.x}" y2="${p.y}" stroke="#e0e0e0" stroke-width="0.6"/>`;
  });
  svg += `<polygon points="${dp.map(p => `${p.x},${p.y}`).join(' ')}" fill="${accent}22" stroke="${accent}" stroke-width="2.2" stroke-linejoin="round"/>`;
  dp.forEach((p, i) => {
    svg += `<circle cx="${p.x}" cy="${p.y}" r="4.5" fill="${dimensions[dims[i]].color}" stroke="#fff" stroke-width="1.5"/>`;
  });
  dims.forEach((d, i) => {
    const p = gp(i, 1.28);
    svg += `<text x="${p.x}" y="${p.y}" text-anchor="middle" dominant-baseline="central" font-size="11" font-weight="700" fill="${dimensions[d].color}" font-family="'DM Sans',sans-serif">${dimensions[d].name}</text>`;
  });
  svg += `</svg>`;

  let dimRows = '';
  dims.forEach(d => {
    const dim = dimensions[d];
    const pct = Math.round(scores[d]);
    const desc = pct >= 65 ? dim.highDesc : pct <= 35 ? dim.lowDesc : dim.midDesc;
    dimRows += `<div style="margin-bottom:28px;"><div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:4px;"><span style="font-weight:700;color:${dim.color};font-size:14px;">${dim.icon} ${dim.full}</span><span style="font-weight:800;font-size:18px;color:${dim.color};font-family:'Courier New',monospace;">${pct}%</span></div><div style="display:flex;justify-content:space-between;font-size:10px;color:#aaa;margin-bottom:3px;"><span>${dim.lowLabel}</span><span>${dim.highLabel}</span></div><div style="width:100%;height:8px;background:#f0ede8;border-radius:4px;overflow:hidden;"><div style="width:${pct}%;height:100%;background:linear-gradient(90deg,${dim.colorLight},${dim.color});border-radius:4px;"></div></div><p style="font-size:12px;color:#666;margin-top:6px;line-height:1.5;">${desc}</p></div>`;
  });

  const rankBadges = sorted.map(d => {
    const dim = dimensions[d];
    return `<span style="display:inline-flex;align-items:center;gap:4px;background:${dim.colorLight};border:1px solid ${dim.color}33;border-radius:16px;padding:4px 12px;font-size:12px;font-weight:600;color:${dim.color};margin:3px 4px;">${dim.icon} ${dim.name}: ${Math.round(scores[d])}%</span>`;
  }).join('');

  return `<!DOCTYPE html><html lang="cs"><head><meta charset="UTF-8"><title>${testConfig.fullName} — Výsledky</title>
<style>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;700;800&family=DM+Serif+Display&display=swap');
*{margin:0;padding:0;box-sizing:border-box;}
body{font-family:'DM Sans',Helvetica,Arial,sans-serif;background:#fff;color:#2D2D2D;padding:48px 56px;max-width:800px;margin:0 auto;}
@media print{body{padding:32px 40px;}.no-print{display:none!important;}@page{margin:1.5cm;size:A4;}}
h1{font-family:'DM Serif Display',Georgia,serif;font-size:32px;font-weight:400;margin-bottom:4px;}
h2{font-family:'DM Serif Display',Georgia,serif;font-size:20px;font-weight:400;margin-bottom:16px;color:#2D2D2D;border-bottom:2px solid #f0ede8;padding-bottom:8px;}
.meta{font-size:13px;color:#999;margin-bottom:32px;}
.section{margin-bottom:36px;}
.radar-wrap{text-align:center;margin:20px 0 24px;}
.btn{background:${accent};color:#fff;border:none;border-radius:8px;padding:12px 32px;font-size:15px;font-weight:600;cursor:pointer;font-family:'DM Sans',sans-serif;margin:20px 8px 20px 0;}
.btn:hover{opacity:0.9;}
.footer{margin-top:40px;padding-top:20px;border-top:1px solid #eee;font-size:11px;color:#bbb;text-align:center;line-height:1.6;}
</style></head><body>
<div class="no-print" style="margin-bottom:24px;"><button class="btn" onclick="window.print()">Uložit jako PDF (Ctrl+P)</button></div>
<h1>${testConfig.fullName}</h1>
<p class="meta">Datum: ${now} · ${questionCount} otázek · Škála 1–7 · AI Self-Assessment v${testConfig.version}</p>
<div class="section"><h2>Osobnostní radar</h2><div class="radar-wrap">${svg}</div><div style="text-align:center;">${rankBadges}</div></div>
<div class="section"><h2>Detailní profil</h2>${dimRows}</div>
${practicalImplications ? `<div class="section"><h2>Praktické implikace</h2><div style="font-size:13px;line-height:1.7;color:#555;">${practicalImplications}</div></div>` : ''}
<div class="footer">Orientační self-assessment — nenahrazuje standardizovaný psychologický test.<br>Vytvořeno interaktivním AI assessment nástrojem, verze ${testConfig.version}.</div>
</body></html>`;
}
