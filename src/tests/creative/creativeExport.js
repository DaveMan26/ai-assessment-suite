import { getLevel, getLevelEng, getBar } from '../../lib/levels';
import { TEST_CONFIG, DIMENSIONS, ALT_USES_ITEMS } from './creativeData';

export function getPracticalImplications(scores) {
  const fluency = scores.FLUENCY ?? 0;
  const flexibility = scores.FLEXIBILITY ?? 0;
  const application = scores.APPLICATION ?? 0;
  const initiative = scores.INITIATIVE ?? 0;

  let styleText = "";
  if (fluency > 65 && flexibility > 65) {
    styleText = "Silný divergentní motor — snadno generuješ hodně nápadů z mnoha úhlů.";
  } else if (fluency > 65 && flexibility <= 65) {
    styleText = "Hodně nápadů, ale často v jednom směru. Zkus vědomě hledat jiné úhly.";
  } else if (flexibility > 65 && fluency <= 65) {
    styleText = "Umíš přepínat perspektivy, i když celkový počet nápadů není nejvyšší.";
  } else if (fluency <= 45 && flexibility <= 45) {
    styleText = "Selektivní kreativní styl — méně nápadů, ale praktičtějších.";
  } else {
    styleText = "Generuješ přiměřené množství nápadů a střídáš různé úhly podle situace.";
  }

  let applicationText = "";
  if (application > 65) {
    applicationText = "Kreativitu dokážeš přenést do reálných situací. To je vzácná schopnost.";
  } else if (application >= 45 && application <= 65) {
    applicationText = "Kreativní přístup nasazuješ selektivně. Buduj si návyk hledat alternativy.";
  } else {
    applicationText = "Preferuješ osvědčené postupy. Zkus začít s malými experimenty.";
  }

  let initiativeText = "";
  if (initiative > 65) {
    initiativeText = "Aktivně hledáš nové podněty a realizuješ vlastní projekty.";
  } else if (initiative >= 45 && initiative <= 65) {
    initiativeText = "Občas experimentuješ, ale není to tvůj primární motor.";
  } else {
    initiativeText = "Spíš se držíš rutin. Pokud chceš rozvíjet kreativitu, začni s drobnými změnami.";
  }

  return {
    style: styleText,
    application: applicationText,
    initiative: initiativeText
  };
}

export const DEVELOPMENT_TIPS = {
  FLUENCY: {
    title: "Jak zlepšit ideovou plynulost",
    tips: [
      'Zařaď denní mikro-brainstorming: 3-5 minut, „vymysli 10 způsobů, jak…", bez hodnocení kvality.',
      'Při řešení problémů si stanovi cíl: „Než vyberu řešení, chci mít aspoň 5 variant."',
      'Zkus techniku „špatné nápady" — záměrně generuj hloupé a nerealistické nápady. Často z nich vyplyne něco užitečného.'
    ]
  },
  FLEXIBILITY: {
    title: "Jak zlepšit kategoriální flexibilitu",
    tips: [
      'Při problému se ptej: „Jak by to řešil kuchař? Architekt? Dítě? Mimozemšťan?"',
      "Vezmi náhodnou knihu a přemýšlej, jak by se principy v ní daly aplikovat na tvůj problém.",
      "Použij metodu SCAMPER: Substituovat, Kombinovat, Adaptovat, Modifikovat, Použít jinak, Eliminovat, Reversovat."
    ]
  },
  ORIGINALITY: {
    title: "Jak zlepšit originalitu",
    tips: [
      "Trénuj kombinování vzdálených oblastí — vezmi dvě nesouvisející věci a hledej spojení.",
      'Při navrhování si vyhraď jedno „šílené kolo", kde jsou povoleny i divoké nápady.',
      'Vědomě si klaď otázky „co kdyby…" a „jak bych to udělal/a úplně jinak?" u běžných situací.'
    ]
  },
  APPLICATION: {
    title: "Jak zlepšit aplikační kreativitu",
    tips: [
      "Po obtížné situaci zapiš 3-5 alternativních reakcí, které by ji mohly posunout kreativněji.",
      "Před rozhodnutím se zastav na 2 minuty a vypiš 2-3 nekonvenční, ale realistické alternativy.",
      "Praktikuj reframing: přepiš problém do 3 různých formulací a sleduj, jak se mění možná řešení."
    ]
  },
  INITIATIVE: {
    title: "Jak zlepšit kreativní iniciativu",
    tips: [
      "Naplánuj si měsíčně jeden nový podnět: výstava, kurz, přednáška mimo obor, neznámé místo.",
      "Přihlaš se k malému experimentu v práci — pilotní projekt, nová technologie, neformální zlepšovák.",
      "Zkus drobné změny rutin (cesta, postup, nástroj) a sleduj, jak to ovlivňuje tvoje nápady."
    ]
  }
};

function altUsesMetaToItemLabels(meta) {
  if (!meta || !meta.items) return meta;
  const itemLabels = { brick: "Cihla", bottle: "Plastová láhev" };
  return {
    ...meta,
    items: meta.items.map(it => ({
      ...it,
      label: itemLabels[it.itemId] || it.itemId
    }))
  };
}

export function generateMarkdown(scores, dimensions, altUsesMeta, practicalImplications, developmentTipsMarkdown = '') {
  const now = new Date().toISOString().split('T')[0];
  const dims = Object.keys(dimensions);
  const sorted = [...dims].sort((a, b) => (scores[b] ?? 0) - (scores[a] ?? 0));

  let md = `# ${TEST_CONFIG.id} — ${TEST_CONFIG.fullName} — Výsledky\n\n`;
  md += `- **Datum:** ${now}\n`;
  md += `- **Verze testu:** ${TEST_CONFIG.version}\n`;
  md += `- **Typ testu:** ${TEST_CONFIG.fullName}\n`;
  md += `- **Metoda:** AI-administrovaný interaktivní test\n`;
  md += `- **Počet položek:** 2 Alternate Uses + 20 škálových + 5 scénářů\n`;
  md += `- **Škála:** Mix: Alternate Uses (timed), situační scénáře, Likert 1-7\n`;
  md += `- **Validita:** Orientační self-assessment (nikoliv klinicky standardizovaný)\n\n`;
  md += `---\n\n`;

  md += `## Souhrnné skóre\n\n`;
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
    md += `- **Interpretace:** ${desc}\n\n`;
  });

  if (altUsesMeta) {
    md += `---\n\n`;
    md += `## Alternate Uses — statistiky\n`;
    md += `- Celkový počet nápadů: ${altUsesMeta.totalIdeas ?? 0}\n`;
    md += `- Celkový počet kategorií: ${altUsesMeta.totalBuckets ?? 0}\n`;
    const withLabels = altUsesMetaToItemLabels(altUsesMeta);
    (withLabels.items || []).forEach(it => {
      md += `- ${it.label || it.itemId}: ${it.ideas ?? 0} nápadů, ${it.buckets ?? 0} kategorií\n`;
    });
    md += `\n`;
  }

  md += `---\n\n`;
  md += `## Praktické implikace\n\n`;
  if (practicalImplications) {
    md += `### Tvůj kreativní styl\n\n${practicalImplications.style}\n\n`;
    md += `### Uplatnění v praxi\n\n${practicalImplications.application}\n\n`;
    md += `### Kreativní iniciativa\n\n${practicalImplications.initiative}\n\n`;
  }
  if (developmentTipsMarkdown) {
    md += developmentTipsMarkdown;
  }
  md += `---\n\n`;

  md += `## Strojově čitelná data (JSON)\n\n`;
  md += '```json\n';
  const jsonData = {
    test: TEST_CONFIG.id,
    test_name: TEST_CONFIG.fullName,
    version: TEST_CONFIG.version,
    date: now,
    questions_count: 27,
    scenarios_count: 5,
    scale: "Mix: Alternate Uses (timed), situační scénáře, Likert 1-7",
    scores: {},
    ranking: sorted.map((d, i) => ({
      rank: i + 1,
      dimension: dimensions[d].eng,
      score: Math.round(scores[d])
    })),
    alt_uses_meta: altUsesMeta || null
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
  md += `> Tento výstup byl vytvořen interaktivním AI self-assessment nástrojem. Slouží k sebereflexi a jako kontextový vstup pro další AI analýzy. Nenahrazuje standardizovaný kreativní test.\n`;
  return md;
}

export function generateHTMLReport(scores, dimensions, altUsesMeta, practicalImplications, developmentTipsHtml = '') {
  const now = new Date().toLocaleDateString('cs-CZ', { year: 'numeric', month: 'long', day: 'numeric' });
  const dims = Object.keys(dimensions);
  const sorted = [...dims].sort((a, b) => (scores[b] ?? 0) - (scores[a] ?? 0));
  const accent = TEST_CONFIG.accentColor;

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
    const pct = Math.round(scores[d]);
    return `<span style="display:inline-flex;align-items:center;gap:4px;background:${dim.colorLight};border:1px solid ${dim.color}33;border-radius:16px;padding:4px 12px;font-size:12px;font-weight:600;color:${dim.color};margin:3px 4px;">${dim.icon} ${dim.name}: ${pct}%</span>`;
  }).join('');

  let autSection = '';
  if (altUsesMeta) {
    const withLabels = altUsesMetaToItemLabels(altUsesMeta);
    autSection = `<div class="section"><h2>Alternate Uses — statistiky</h2><div style="font-size:13px;line-height:1.7;color:#555;"><p>Celkem vygenerováno <strong>${altUsesMeta.totalIdeas ?? 0}</strong> nápadů v <strong>${altUsesMeta.totalBuckets ?? 0}</strong> kategoriích.</p><ul style="margin-top:8px;">${(withLabels.items || []).map(it => `<li>${it.label || it.itemId}: ${it.ideas ?? 0} nápadů, ${it.buckets ?? 0} kategorií</li>`).join('')}</ul></div></div>`;
  }

  let implicationsHtml = '';
  if (practicalImplications) {
    implicationsHtml = `<div class="section"><h2>Praktické implikace</h2><div style="font-size:13px;line-height:1.7;color:#555;"><p><strong>Tvůj kreativní styl:</strong> ${practicalImplications.style}</p><p><strong>Uplatnění v praxi:</strong> ${practicalImplications.application}</p><p><strong>Kreativní iniciativa:</strong> ${practicalImplications.initiative}</p></div></div>`;
  }

  return `<!DOCTYPE html><html lang="cs"><head><meta charset="UTF-8"><title>${TEST_CONFIG.fullName} — Výsledky</title>
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
<h1>${TEST_CONFIG.fullName}</h1>
<p class="meta">Datum: ${now} · Kreativní test · Alternate Uses + scénáře + Likert 1–7 · AI Self-Assessment v${TEST_CONFIG.version}</p>
<div class="section"><h2>Kreativní radar</h2><div class="radar-wrap">${svg}</div><div style="text-align:center;">${rankBadges}</div></div>
<div class="section"><h2>Detailní profil</h2>${dimRows}</div>
${autSection}
${implicationsHtml}
${developmentTipsHtml}
<div class="footer">Orientační self-assessment — nenahrazuje standardizovaný kreativní test.<br>Vytvořeno interaktivním AI assessment nástrojem, verze ${TEST_CONFIG.version}.</div>
</body></html>`;
}
