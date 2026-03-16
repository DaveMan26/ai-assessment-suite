import { DIMS, DIM_ORDER } from './iqData';
import { getLevel, getLevelEng, getBar } from './iqScoring';

export function generateMarkdown(scores) {
  const now = new Date().toISOString().split("T")[0];
  const sorted = [...DIM_ORDER].sort((a, b) => scores[b] - scores[a]);
  let md = `# Kognitivní schopnosti (IQ profil) — Výsledky\n\n`;
  md += `- **Datum:** ${now}\n`;
  md += `- **Typ testu:** Kognitivní schopnosti — 6 dimenzí (výkonový test)\n`;
  md += `- **Metoda:** AI-administrovaný interaktivní test\n`;
  md += `- **Validita:** Orientační self-assessment (nikoliv klinicky standardizovaný)\n\n---\n\n`;
  md += `## Souhrnné skóre\n\n| Dimenze | Skóre | Úroveň | Vizualizace |\n|---------|-------|--------|-------------|\n`;
  DIM_ORDER.forEach(d => {
    const dim = DIMS[d]; const pct = Math.round(scores[d]);
    md += `| ${dim.icon} ${dim.full} (${dim.eng}) | ${pct}% | ${getLevel(pct)} | ${getBar(pct)} |\n`;
  });
  md += `\n## Pořadí dimenzí (od nejsilnější)\n\n`;
  sorted.forEach((d, i) => md += `${i + 1}. **${DIMS[d].full}** — ${Math.round(scores[d])}%\n`);
  md += `\n---\n\n## Detailní interpretace\n\n`;
  DIM_ORDER.forEach(d => {
    const dim = DIMS[d]; const pct = Math.round(scores[d]);
    const desc = pct >= 65 ? dim.highDesc : pct <= 35 ? dim.lowDesc : dim.midDesc;
    md += `### ${dim.icon} ${dim.full} (${dim.eng}) — ${pct}%\n\n`;
    md += `- **Úroveň:** ${getLevel(pct)}\n- **Popis:** ${desc}\n\n`;
  });
  md += `---\n\n## Praktické implikace\n\n`;
  const top = sorted[0], low = sorted[sorted.length - 1];
  md += `### Silné stránky\n- Tvou nejsilnější kognitivní oblastí je **${DIMS[top].name}** (${Math.round(scores[top])}%).\n`;
  md += `### Oblasti pro rozvoj\n- Relativně nejslabší oblast: **${DIMS[low].name}** (${Math.round(scores[low])}%). Nízké skóre nemusí znamenat deficit — může odrážet specifický kognitivní styl.\n\n`;
  md += `---\n\n## Strojově čitelná data (JSON)\n\n\`\`\`json\n`;
  const jsonData = { test: "IQ", test_name: "Kognitivní schopnosti", date: now, questions_count: 44, scale: "výkonové úlohy (správnost + rychlost)", scores: {}, ranking: sorted.map((d, i) => ({ rank: i + 1, dimension: DIMS[d].eng, score: Math.round(scores[d]) })) };
  DIM_ORDER.forEach(d => { jsonData.scores[DIMS[d].eng] = { percentile: Math.round(scores[d]), level: getLevelEng(scores[d]), level_cz: getLevel(scores[d]) }; });
  md += JSON.stringify(jsonData, null, 2);
  md += `\n\`\`\`\n\n---\n\n> Orientační výkonový test — nenahrazuje standardizovaný IQ test. Slouží k identifikaci relativního kognitivního profilu.\n`;
  return md;
}

export function generatePDFHtml(scores) {
  const now = new Date().toLocaleDateString("cs-CZ", { year: "numeric", month: "long", day: "numeric" });
  const sorted = [...DIM_ORDER].sort((a, b) => scores[b] - scores[a]);
  const size = 280, cx = size / 2, cy = size / 2, rad = size * 0.36;
  const angleStep = (2 * Math.PI) / DIM_ORDER.length;
  const levels = [0.2, 0.4, 0.6, 0.8, 1.0];
  const gp = (i, v) => { const a = i * angleStep - Math.PI / 2; return { x: cx + rad * v * Math.cos(a), y: cy + rad * v * Math.sin(a) }; };
  const dataPoints = DIM_ORDER.map((d, i) => gp(i, scores[d] / 100));
  const DIM_COLORS = DIM_ORDER.map(d => DIMS[d].color);
  let svg = `<svg viewBox="0 0 ${size} ${size}" width="${size}" xmlns="http://www.w3.org/2000/svg">`;
  levels.forEach((l, li) => { const pts = DIM_ORDER.map((_, i) => { const p = gp(i, l); return `${p.x},${p.y}`; }).join(" "); svg += `<polygon points="${pts}" fill="none" stroke="${li === 4 ? '#bbb' : '#e0e0e0'}" stroke-width="${li === 4 ? 1.2 : 0.6}"/>`; });
  DIM_ORDER.forEach((_, i) => { const p = gp(i, 1); svg += `<line x1="${cx}" y1="${cy}" x2="${p.x}" y2="${p.y}" stroke="#e0e0e0" stroke-width="0.6"/>`; });
  svg += `<polygon points="${dataPoints.map(p => `${p.x},${p.y}`).join(" ")}" fill="rgba(45,106,159,0.18)" stroke="#2D6A9F" stroke-width="2.2" stroke-linejoin="round"/>`;
  dataPoints.forEach((p, i) => svg += `<circle cx="${p.x}" cy="${p.y}" r="4.5" fill="${DIM_COLORS[i]}" stroke="#fff" stroke-width="1.5"/>`);
  DIM_ORDER.forEach((d, i) => { const p = gp(i, 1.28); svg += `<text x="${p.x}" y="${p.y}" text-anchor="middle" dominant-baseline="central" font-size="10" font-weight="700" fill="${DIMS[d].color}" font-family="Georgia,serif">${DIMS[d].name}</text>`; });
  svg += `</svg>`;
  let dimRows = "";
  DIM_ORDER.forEach(d => { const dim = DIMS[d]; const pct = Math.round(scores[d]); const desc = pct >= 65 ? dim.highDesc : pct <= 35 ? dim.lowDesc : dim.midDesc;
    dimRows += `<div style="margin-bottom:28px;"><div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:4px;"><span style="font-weight:700;color:${dim.color};font-size:14px;">${dim.icon} ${dim.full}</span><span style="font-weight:800;font-size:18px;color:${dim.color};font-family:'Courier New',monospace;">${pct}%</span></div><div style="width:100%;height:8px;background:#f0ede8;border-radius:4px;overflow:hidden;"><div style="width:${pct}%;height:100%;background:linear-gradient(90deg,${dim.colorLight},${dim.color});border-radius:4px;"></div></div><p style="font-size:12px;color:#666;margin-top:6px;line-height:1.5;">${desc}</p></div>`; });
  let rankBadges = sorted.map(d => `<span style="display:inline-flex;align-items:center;gap:4px;background:${DIMS[d].colorLight};border:1px solid ${DIMS[d].color}33;border-radius:16px;padding:4px 12px;font-size:12px;font-weight:600;color:${DIMS[d].color};margin:3px 4px;">${DIMS[d].icon} ${DIMS[d].name}: ${Math.round(scores[d])}%</span>`).join("");
  return `<!DOCTYPE html><html lang="cs"><head><meta charset="UTF-8"><title>IQ Kognitivní profil — Výsledky</title><style>@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;700;800&family=DM+Serif+Display&display=swap');*{margin:0;padding:0;box-sizing:border-box;}body{font-family:'DM Sans',Helvetica,Arial,sans-serif;background:#fff;color:#2D2D2D;padding:48px 56px;max-width:800px;margin:0 auto;}@media print{body{padding:32px 40px;}.no-print{display:none!important;}@page{margin:1.5cm;size:A4;}}h1{font-family:'DM Serif Display',Georgia,serif;font-size:32px;font-weight:400;margin-bottom:4px;}h2{font-family:'DM Serif Display',Georgia,serif;font-size:20px;font-weight:400;margin-bottom:16px;border-bottom:2px solid #f0ede8;padding-bottom:8px;}.meta{font-size:13px;color:#999;margin-bottom:32px;}.section{margin-bottom:36px;}.radar-wrap{text-align:center;margin:20px 0 24px;}.btn{background:#2D6A9F;color:#fff;border:none;border-radius:8px;padding:12px 32px;font-size:15px;font-weight:600;cursor:pointer;font-family:'DM Sans',sans-serif;margin:20px 8px 20px 0;}.btn:hover{opacity:0.9;}.footer{margin-top:40px;padding-top:20px;border-top:1px solid #eee;font-size:11px;color:#bbb;text-align:center;line-height:1.6;}</style></head><body><div class="no-print" style="margin-bottom:24px;"><button class="btn" onclick="window.print()">Uložit jako PDF (Ctrl+P)</button></div><h1>Kognitivní profil — IQ Assessment</h1><p class="meta">Datum: ${now} · 44 úloh · Výkonový test · AI Assessment</p><div class="section"><h2>Kognitivní radar</h2><div class="radar-wrap">${svg}</div><div style="text-align:center;">${rankBadges}</div></div><div class="section"><h2>Detailní profil</h2>${dimRows}</div><div class="footer">Orientační výkonový test — nenahrazuje standardizovaný IQ test.<br>Vytvořeno interaktivním AI assessment nástrojem.</div></body></html>`;
}
