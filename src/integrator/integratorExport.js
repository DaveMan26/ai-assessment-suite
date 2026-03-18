import { getLevel, getBar } from '../lib/levels';
import { TEST_REGISTRY, MASTER_RADAR_AXES } from './integratorData';
import {
  buildMetaDimensionScores,
  getAxisScore,
  normalizeAllScores,
  getTopDimensions,
  getBottomDimensions,
  checkConsistency,
  generateContextStatement,
} from './integratorLogic';

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function buildJsonPayload(allResults, metaDimensions, top5, bottom5, consistency, contextText) {
  const perTest = {};
  for (const id of Object.keys(TEST_REGISTRY)) {
    const r = allResults[id];
    if (!r) continue;
    const scores = r.scores != null ? r.scores : r;
    if (typeof scores !== 'object') continue;
    const o = {};
    for (const [k, v] of Object.entries(scores)) {
      if (typeof v === 'number') o[k] = Math.round(v);
    }
    if (Object.keys(o).length) perTest[id] = o;
  }

  const cognitive_style = allResults.COGNITIVE
    ? (() => {
        const s = allResults.COGNITIVE.scores || allResults.COGNITIVE;
        const out = {};
        for (const k of Object.keys(TEST_REGISTRY.COGNITIVE.dimensions)) {
          if (typeof s[k] === 'number') out[k] = Math.round(s[k]);
        }
        return out;
      })()
    : null;

  return {
    type: 'integrator',
    date: new Date().toISOString().split('T')[0],
    completed_tests: Object.keys(allResults).filter((id) => allResults[id] != null),
    meta_dimensions: metaDimensions,
    top_5: top5.map((d) => ({
      test: d.testId,
      dim: d.dimKey,
      name: d.dimName,
      score: d.score,
    })),
    bottom_5: bottom5.map((d) => ({
      test: d.testId,
      dim: d.dimKey,
      name: d.dimName,
      score: d.score,
    })),
    cognitive_style,
    consistency_findings: consistency.map((c) => ({
      label: c.label,
      scoreA: c.scoreA,
      scoreB: c.scoreB,
      detail: c.detail,
    })),
    per_test: perTest,
    context_statement: contextText,
  };
}

export function generateIntegratorMarkdown(allResults) {
  const now = new Date().toISOString().split('T')[0];
  const completed = Object.keys(allResults).filter((id) => allResults[id] != null);
  const n = completed.length;
  const normalized = normalizeAllScores(allResults);
  const top5 = getTopDimensions(normalized, 5);
  const bottom5 = getBottomDimensions(normalized, 5);
  const consistency = checkConsistency(allResults);
  const contextText = generateContextStatement(allResults, consistency);
  const metaDimensions = buildMetaDimensionScores(allResults, MASTER_RADAR_AXES);

  let md = `# Souhrnný profil — Výsledky\n\n`;
  md += `- **Datum:** ${now}\n`;
  md += `- **Dokončené testy:** ${n} z 12\n`;
  md += `- **Typ:** Integrovaný self-assessment profil\n\n---\n\n`;

  md += `## Meta-profil (Top dimenze napříč testy)\n\n`;
  md += `| # | Dimenze | Test | Skóre | Úroveň | Vizualizace |\n|---|---------|------|-------|--------|-------------|\n`;
  top5.forEach((d, i) => {
    md += `| ${i + 1} | ${d.dimName} | ${d.testShortName} | ${d.score}% | ${getLevel(d.score)} | ${getBar(d.score)} |\n`;
  });

  md += `\n## Rozvojové oblasti\n\n`;
  md += `| # | Dimenze | Test | Skóre | Úroveň | Vizualizace |\n|---|---------|------|-------|--------|-------------|\n`;
  bottom5.forEach((d, i) => {
    md += `| ${i + 1} | ${d.dimName} | ${d.testShortName} | ${d.score}% | ${getLevel(d.score)} | ${getBar(d.score)} |\n`;
  });

  if (allResults.COGNITIVE) {
    const s = allResults.COGNITIVE.scores || allResults.COGNITIVE;
    const reg = TEST_REGISTRY.COGNITIVE.dimensions;
    md += `\n## Kognitivní styl\n\n`;
    md += `| Osa | Pól A | Skóre | Pól B | Pozice |\n|-----|-------|-------|-------|--------|\n`;
    for (const [k, meta] of Object.entries(reg)) {
      const v = s[k];
      if (typeof v !== 'number') continue;
      const lean = v < 45 ? `blíž ${meta.poleA}` : v > 55 ? `blíž ${meta.poleB}` : 'vyváženo';
      md += `| ${meta.name} | ${meta.poleA} | ${Math.round(v)}% | ${meta.poleB} | ${lean} |\n`;
    }
  }

  md += `\n## Cross-test konzistence\n\n`;
  if (n < 2) {
    md += `_Pro analýzu konzistence jsou potřeba alespoň 2 dokončené testy._\n\n`;
  } else if (consistency.length === 0) {
    md += `Výsledky jsou v rámci kontrolovaných párů vzájemně konzistentní.\n\n`;
  } else {
    consistency.slice(0, 8).forEach((c) => {
      md += `- **${c.label}:** ${c.detail}\n`;
    });
    md += `\n`;
  }

  md += `## Per-test detail\n\n`;
  for (const [tid, meta] of Object.entries(TEST_REGISTRY)) {
    const r = allResults[tid];
    if (!r) continue;
    const scores = r.scores != null ? r.scores : r;
    md += `### ${meta.name} (${tid})\n\n`;
    md += `| Dimenze | Skóre | Úroveň |\n|---------|-------|--------|\n`;
    for (const [dk, dm] of Object.entries(meta.dimensions)) {
      const v = scores[dk];
      if (typeof v !== 'number') continue;
      md += `| ${dm.name} | ${Math.round(v)}% | ${getLevel(v)} |\n`;
    }
    md += `\n`;
  }

  md += `---\n\n## AI Context Statement\n\n${contextText}\n\n---\n\n## Strojově čitelná data (JSON)\n\n`;
  const payload = buildJsonPayload(allResults, metaDimensions, top5, bottom5, consistency, contextText);
  md += '```json\n';
  md += JSON.stringify(payload, null, 2);
  md += '\n```\n\n---\n\n> Výsledky mají orientační charakter a slouží jako podnět pro sebereflexi, nikoli jako klinická diagnóza.\n';

  return md;
}

function radarSvgHtml(allResults) {
  const n = MASTER_RADAR_AXES.length;
  const size = 360;
  const cx = size / 2;
  const cy = size / 2;
  const maxR = 110;
  const rings = [0.25, 0.5, 0.75, 1];
  const ACCENT = '#2D2D2D';
  const GRAY_SPOKE = '#c8c6c2';
  const GRAY_LABEL = '#9a9894';
  const RING = '#e5e2dc';

  const axisData = MASTER_RADAR_AXES.map((axis, i) => {
    const angle = -Math.PI / 2 + (2 * Math.PI * i) / n;
    const raw = getAxisScore(allResults, axis.source.test, axis.source.dim);
    const hasData = raw != null && !Number.isNaN(Number(raw));
    const score = hasData ? Math.min(100, Math.max(0, Number(raw))) : null;
    return { i, angle, label: axis.label, hasData, score, lx: cx + Math.cos(angle) * (maxR + 24), ly: cy + Math.sin(angle) * (maxR + 24) };
  });

  let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size + 24}" viewBox="0 0 ${size} ${size + 24}">`;
  svg += `<g transform="translate(0,12)">`;
  rings.forEach((t) => {
    const pts = axisData.map((a) => `${cx + Math.cos(a.angle) * maxR * t},${cy + Math.sin(a.angle) * maxR * t}`).join(' ');
    svg += `<polygon points="${pts}" fill="none" stroke="${RING}" stroke-width="1"/>`;
  });
  axisData.forEach((a) => {
    svg += `<line x1="${cx}" y1="${cy}" x2="${cx + Math.cos(a.angle) * maxR}" y2="${cy + Math.sin(a.angle) * maxR}" stroke="${a.hasData ? '#d0cdc7' : GRAY_SPOKE}" stroke-width="1"/>`;
  });
  const filled = axisData.filter((a) => a.hasData);
  if (filled.length >= 3) {
    const pts = filled.map((a) => `${cx + Math.cos(a.angle) * maxR * (a.score / 100)},${cy + Math.sin(a.angle) * maxR * (a.score / 100)}`).join(' ');
    svg += `<polygon points="${pts}" fill="${ACCENT}40" stroke="${ACCENT}" stroke-width="2"/>`;
  } else if (filled.length === 2) {
    const p0 = filled[0];
    const p1 = filled[1];
    svg += `<line x1="${cx + Math.cos(p0.angle) * maxR * (p0.score / 100)}" y1="${cy + Math.sin(p0.angle) * maxR * (p0.score / 100)}" x2="${cx + Math.cos(p1.angle) * maxR * (p1.score / 100)}" y2="${cy + Math.sin(p1.angle) * maxR * (p1.score / 100)}" stroke="${ACCENT}" stroke-width="3"/>`;
  } else if (filled.length === 1) {
    const a = filled[0];
    svg += `<circle cx="${cx + Math.cos(a.angle) * maxR * (a.score / 100)}" cy="${cy + Math.sin(a.angle) * maxR * (a.score / 100)}" r="5" fill="${ACCENT}"/>`;
  }
  axisData.forEach((a) => {
    const ta = Math.abs(Math.cos(a.angle)) < 0.2 ? 'middle' : Math.cos(a.angle) > 0 ? 'start' : 'end';
    svg += `<text x="${a.lx}" y="${a.ly}" text-anchor="${ta}" fill="${a.hasData ? ACCENT : GRAY_LABEL}" font-size="11" font-family="DM Sans,sans-serif">${escapeHtml(a.label)}</text>`;
  });
  svg += `</g></svg>`;
  return svg;
}

export function generateIntegratorHTML(allResults) {
  const now = new Date().toISOString().split('T')[0];
  const completed = Object.keys(allResults).filter((id) => allResults[id] != null);
  const n = completed.length;
  const normalized = normalizeAllScores(allResults);
  const top5 = getTopDimensions(normalized, 5);
  const bottom5 = getBottomDimensions(normalized, 5);
  const consistency = checkConsistency(allResults);
  const contextText = escapeHtml(generateContextStatement(allResults, consistency)).replace(/\n/g, '<br/>');

  const barRow = (d) =>
    `<tr><td>${escapeHtml(d.dimName)}</td><td>${d.testShortName}</td><td>${d.score}%</td><td>${getLevel(d.score)}</td><td style="font-family:monospace">${getBar(d.score)}</td></tr>`;

  let body = `<h1>Souhrnný profil</h1><p>${now} · ${n} z 12 testů</p>`;
  body += `<h2>Master radar</h2>${radarSvgHtml(allResults)}`;
  body += `<h2>Top 5</h2><table border="1" cellpadding="6"><tr><th>Dimenze</th><th>Test</th><th>Skóre</th><th>Úroveň</th><th>Bar</th></tr>${top5.map(barRow).join('')}</table>`;
  body += `<h2>Rozvojové oblasti</h2><table border="1" cellpadding="6"><tr><th>Dimenze</th><th>Test</th><th>Skóre</th><th>Úroveň</th><th>Bar</th></tr>${bottom5.map(barRow).join('')}</table>`;

  if (n >= 2) {
    body += `<h2>Cross-test konzistence</h2>`;
    if (consistency.length === 0) body += `<p>Výsledky jsou vzájemně konzistentní.</p>`;
    else {
      consistency.slice(0, 5).forEach((c) => {
        body += `<div style="margin:12px 0;padding:12px;border:1px solid #ebe8e2;border-radius:12px"><strong>${escapeHtml(c.label)}</strong><br/>${escapeHtml(c.detail)}</div>`;
      });
    }
  }

  body += `<h2>AI Context Statement</h2><pre style="white-space:pre-wrap;font-family:DM Mono,monospace;background:#f8f6f1;padding:16px;border-radius:12px">${escapeHtml(generateContextStatement(allResults, consistency))}</pre>`;
  body += `<p style="font-size:12px;color:#888">Výsledky mají orientační charakter.</p>`;

  return `<!DOCTYPE html><html lang="cs"><head><meta charset="utf-8"/><title>Integrátor — ${now}</title>
<style>body{font-family:DM Sans,Segoe UI,sans-serif;max-width:900px;margin:24px auto;padding:16px;color:#2D2D2D}h1,h2{font-family:"DM Serif Display",Georgia,serif;font-weight:400}table{border-collapse:collapse;width:100%}</style>
</head><body>${body}</body></html>`;
}
