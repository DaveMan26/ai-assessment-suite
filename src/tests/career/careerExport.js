import { generateMarkdownReport } from '../../lib/export';
import { getLevel, getLevelEng } from '../../lib/levels';
import { TEST_CONFIG, DIMENSIONS } from './careerData';

export const DEVELOPMENT_TIPS = {
  PEOPLE: {
    insight: 'Práce s lidmi není vaše hlavní preference.',
    reframe:
      'To je cenná informace, ne slabina. Mnoho vynikajících kariér nevyžaduje intenzivní mezilidský kontakt.',
    tips: [
      'Hledejte role, kde je komunikace s lidmi spíše doplňkem (např. 20 % času) než jádrem.',
      'Pokud musíte komunikovat hodně, vyjednávejte si bloky nerušeného času pro soustředěnou práci.',
      'Zvažte asynchronní formy spolupráce (dokumentace, code review, písemný feedback) místo porad.'
    ]
  },
  DATA: {
    insight: 'Analytická práce s daty vás příliš nepřitahuje.',
    reframe:
      'Rozhodování nemusí být vždy datové — zkušenost, intuice a vztahová inteligence jsou rovnocenné zdroje.',
    tips: [
      'Spolupracujte s analytiky, kteří vám data připraví v srozumitelné formě.',
      'Zaměřte se na role, kde je analytika podpůrná, ne hlavní náplň.',
      'Pokud potřebujete data, zvažte vizuální nástroje (dashboardy) místo tabulek.'
    ]
  },
  IDEAS: {
    insight: 'Inovování a vymýšlení nového není vaše hlavní motivace.',
    reframe:
      'Exekuce osvědčeného je stejně hodnotná jako invence nového — svět potřebuje lidi, kteří dotahují věci do konce.',
    tips: [
      'Hledejte role, kde implementujete a vylepšujete existující — ne kde vymýšlíte od nuly.',
      'Spolupracujte s kreativci, kteří dodají nápady, vy je dotáhnete do praxe.',
      'Pokud potřebujete inovovat, zvolte inkrementální vylepšování (kaizen) místo radikální inovace.'
    ]
  },
  THINGS: {
    insight: 'Fyzická a technická práce vás příliš netáhne.',
    reframe:
      'Mnoho hodnotných kariér je čistě konceptuálních — nemusíte vidět fyzický výsledek, abyste měli dopad.',
    tips: [
      'Zaměřte se na abstraktnější role — strategie, poradenství, leadership, kreativa.',
      'Pokud pracujete v technickém prostředí, hledejte roli na pomezí (project management, business development).',
      'Hmatatelnost výsledku můžete najít i v digitální podobě (produkt, web, systém).'
    ]
  },
  MEANING: {
    insight: 'Hluboký osobní smysl v práci aktivně nevyhledáváte.',
    reframe:
      'Smysl lze čerpat z mnoha oblastí života — rodina, komunita, koníčky. Práce nemusí být zdrojem veškerého smyslu.',
    tips: [
      'Zaměřte se na jiné motivátory — růst, autonomii, zajímavost obsahu, finanční odměnu.',
      'Pokud chcete přidat smysl, hledejte konkrétní projekty nebo dobrovolnické aktivity mimo hlavní práci.',
      'Smysl se může objevit i dodatečně — někdy ho najdete až po delší době v roli.'
    ]
  },
  GROWTH: {
    insight: 'Neustálý kariérní růst a výzvy nejsou vaší hlavní motivací.',
    reframe:
      'Stabilita a zvládnutí role mají svou hodnotu — mistrovství v jedné oblasti může být stejně naplňující jako neustálý posun.',
    tips: [
      'Hledejte role, kde můžete prohlubovat expertizu místo neustálého rozšiřování.',
      'Vyjednávejte si stabilní zázemí — ne každý potřebuje „strmou křivku růstu".',
      'Růst může mít i jinou formu než kariérní postup — hloubka, kvalita, mentoring.'
    ]
  },
  AUTONOMY: {
    insight: 'Vysoká míra svobody rozhodování není vaše hlavní preference.',
    reframe:
      'Jasná struktura a vedení umožňují soustředit se na to, v čem jste dobří, bez přetížení rozhodováním.',
    tips: [
      'Hledejte firmy a manažery s jasnou vizí a dobrou strukturou — ne chaos „dělej si co chceš".',
      'Postupně si vyjednávejte autonomii v oblastech, kde se cítíte kompetentní.',
      'Spolupracujte s nadřízenými, kteří dávají jasné zadání a férovou zpětnou vazbu.'
    ]
  }
};

export const CAREER_PROFILES = {
  'PEOPLE+MEANING':
    'Lidé & Smysl — Přitahují vás role, kde pomáháte druhým a vidíte pozitivní dopad své práce. Ideální prostředí: vzdělávání, HR, sociální služby, koučink, neziskový sektor.',
  'DATA+GROWTH':
    'Data & Růst — Hledáte analyticky náročné role s prostorem k učení. Ideální prostředí: consulting, business analytics, výzkum, fintech.',
  'IDEAS+AUTONOMY':
    'Nápady & Svoboda — Potřebujete kreativní volnost a prostor pro vlastní vizi. Ideální prostředí: startup, podnikání, produktový management, design, nezávislé poradenství.',
  'THINGS+DATA':
    'Věci & Data — Přitahuje vás technická práce podložená daty. Ideální prostředí: inženýring, výroba, průmyslová automatizace, technický controlling.',
  'PEOPLE+GROWTH':
    'Lidé & Růst — Rozvoj druhých i vlastní posun vás naplňuje. Ideální prostředí: L&D, people management, sales leadership, consulting s týmem.',
  'MEANING+AUTONOMY':
    'Smysl & Autonomie — Chcete dělat důležité věci po svém. Ideální prostředí: nezisk v roli experta, vlastní projekty, impact-driven startup.',
  'IDEAS+GROWTH':
    'Nápady & Růst — Neustále objevujete nové a posouváte hranice. Ideální prostředí: inovace, R&D, produkt v rychlé firmě.',
  'DATA+IDEAS':
    'Data & Nápady — Spojujete analýzu s nápady. Ideální prostředí: product analytics, growth, strategie podložená daty.'
};

const DIM_ONE_LINER = {
  PEOPLE: 'silná orientace na lidi a spolupráci',
  DATA: 'silná analytická a datová orientace',
  IDEAS: 'silná tvůrčí a inovační orientace',
  THINGS: 'silná orientace na hmatatelné výsledky a techniku',
  MEANING: 'silná potřeba smyslu a dopadu',
  GROWTH: 'silná potřeba růstu a výzev',
  AUTONOMY: 'silná potřeba svobody a vlastního směru'
};

export function generateCareerProfile(topDims, flatProfile) {
  if (flatProfile || !topDims.length) {
    return {
      title: 'Vyrovnaný profil',
      text:
        'Máte široký záběr — vaše preference jsou relativně vyrovnané. To může znamenat flexibilitu v kariérních volbách a schopnost přizpůsobit se různým rolím.'
    };
  }
  if (topDims.length === 1) {
    const d = topDims[0];
    const dim = DIMENSIONS[d];
    return {
      title: `${dim.name}`,
      text: `${dim.full}: ${dim.highDesc.split('.')[0]}. Typické prostředí: ${dim.environmentExamples}`
    };
  }
  const key2 = `${topDims[0]}+${topDims[1]}`;
  const key3 =
    topDims.length >= 3 ? `${topDims[0]}+${topDims[1]}+${topDims[2]}` : null;
  let text = CAREER_PROFILES[key3] || CAREER_PROFILES[key2];
  if (!text) {
    const parts = topDims.map(d => DIM_ONE_LINER[d] || DIMENSIONS[d].name);
    text = `Kombinace ${topDims.map(d => DIMENSIONS[d].name).join(' + ')} — ${parts.join('; ')}. Hledejte role, kde se tyto oblasti protínají, nebo si je doplňujte v týmu.`;
  }
  return {
    title: topDims.map(d => DIMENSIONS[d].name).join(' + '),
    text
  };
}

function complementDims(topDims) {
  const all = Object.keys(DIMENSIONS);
  return all.filter(d => !topDims.includes(d));
}

export function getPracticalImplications(scores, topDims, lowDims, flatProfile, personalAverage) {
  const profile = generateCareerProfile(topDims, flatProfile);
  const sections = [];

  let career = '### Váš kariérní profil\n\n';
  career += `**${profile.title}**\n\n${profile.text}\n\n`;
  if (!flatProfile && topDims.length) {
    career += '**TOP orientace — typické role a prostředí:**\n';
    topDims.forEach(d => {
      const dim = DIMENSIONS[d];
      career += `- **${dim.icon} ${dim.name}:** ${dim.roleExamples}\n`;
    });
  }
  sections.push(career);

  let crafting = '### Job crafting\n\n';
  if (!flatProfile && topDims.length) {
    crafting += 'Jak si přidat silné oblasti i ve stávající roli:\n';
    topDims.forEach(d => {
      crafting += `- **${DIMENSIONS[d].name}:** ${DIMENSIONS[d].jobCraftingTip}\n`;
    });
  } else {
    crafting +=
      'Vyzkoušejte malé experimenty v různých směrech — krátké projekty, stínování kolegů — abyste zjistili, co vás nejvíc nabíjí.\n';
  }
  sections.push(crafting);

  const weakComplements = complementDims(topDims).sort(
    (a, b) => (scores[a] ?? 0) - (scores[b] ?? 0)
  );
  let team = '### Týmové doplnění\n\n';
  if (!flatProfile && topDims.length >= 1) {
    const lowOnTeam = weakComplements.slice(0, 2);
    team += `Vaše silné stránky (${topDims.map(d => DIMENSIONS[d].name).join(', ')}) se dobře doplňují s kolegy silnými v: `;
    team += `${lowOnTeam.map(d => DIMENSIONS[d].name).join(' a ')} — mohou vyvážit váš profil v týmu.\n`;
  } else {
    team +=
      'Vyrovnaný profil znamená, že umíte spolupracovat s různými typy lidí; hlídejte si, aby tým nepřehlížel dimenze, které pro vás nejsou priorita.\n';
  }
  sections.push(team);

  let explore = '### Další kroky\n\n';
  explore += '- Krátké rozhovory s lidmi v rolích, které vás lákají (informační interview).\n';
  explore += '- Jeden měsíční „pilot" — např. dobrovolný projekt v oblasti TOP dimenze.\n';
  explore += '- Reflexe: co vás v posledních týdnech nejvíc nabíjelo vs. vyčerpalo?\n';
  sections.push(explore);

  if (lowDims.length) {
    let lowSec = '### Oblasti, které vás méně přitahují\n\n';
    lowSec += `*(Skóre pod vaším průměrem o více než 8 bodů — průměr cca ${Math.round(personalAverage)} %)*\n\n`;
    lowDims.forEach(d => {
      const tips = DEVELOPMENT_TIPS[d];
      if (!tips) return;
      lowSec += `**${DIMENSIONS[d].icon} ${DIMENSIONS[d].name}**\n`;
      lowSec += `${tips.insight} ${tips.reframe}\n`;
      tips.tips.forEach(t => {
        lowSec += `- ${t}\n`;
      });
      lowSec += '\n';
    });
    sections.push(lowSec);
  }

  return { sections, profile, markdown: sections.join('\n') };
}

function patchMarkdownJson(md, extra) {
  return md.replace(/```json\n([\s\S]*?)\n```/, () => {
    return '```json\n' + JSON.stringify(extra, null, 2) + '\n```';
  });
}

export function generateCareerMarkdown(
  testConfig,
  dimensions,
  scores,
  practicalMarkdown,
  topOrientationEngNames,
  personalAverage
) {
  const base = generateMarkdownReport(testConfig, dimensions, scores, practicalMarkdown);

  const dims = Object.keys(dimensions);
  const sorted = [...dims].sort((a, b) => (scores[b] ?? 0) - (scores[a] ?? 0));
  const now = new Date().toISOString().split('T')[0];
  const overall = Math.round(
    dims.reduce((s, d) => s + (scores[d] || 0), 0) / dims.length
  );

  const jsonData = {
    test: testConfig.id,
    test_name: testConfig.fullName,
    version: testConfig.version,
    date: now,
    questions_count: 52,
    scenarios_count: 7,
    forced_choice_count: 10,
    scale: 'Likert 1-7 + situační scénáře + forced-choice',
    scoring_weights: '60% Likert + 20% scénáře + 20% forced-choice',
    scores: {},
    ranking: sorted.map((d, i) => ({
      rank: i + 1,
      dimension: dimensions[d].eng,
      score: Math.round(scores[d])
    })),
    top_orientations: topOrientationEngNames,
    overall_percentile: overall
  };
  dims.forEach(d => {
    const pct = Math.round(scores[d]);
    jsonData.scores[dimensions[d].eng] = {
      percentile: pct,
      level: getLevelEng(pct),
      level_cz: getLevel(pct)
    };
  });

  const topBlock =
    `## TOP kariérní orientace\n\n` +
    (topOrientationEngNames.length
      ? topOrientationEngNames.map(e => `- **${e}**`).join('\n') + '\n\n'
      : '_Žádná dimenze výrazně nevyčnívá — široký, flexibilní profil._\n\n');

  const md =
    base.replace(
      /\n---\n\n## Detailní interpretace/,
      `\n---\n\n${topBlock}## Detailní interpretace`
    );

  return patchMarkdownJson(md, jsonData);
}

function escapeHtml(s) {
  if (!s) return '';
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function generateCareerHTML(
  testConfig,
  dimensions,
  scores,
  practicalHtml,
  referenceValue,
  topDims,
  flatProfile,
  lowDimsHtml
) {
  const dims = Object.keys(dimensions);
  const sorted = [...dims].sort((a, b) => (scores[b] ?? 0) - (scores[a] ?? 0));
  const accent = testConfig.accentColor || '#E07A5F';
  const secondary = testConfig.secondaryColor || '#81B29A';
  const now = new Date().toLocaleDateString('cs-CZ', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  const size = 300;
  const cx = size / 2;
  const cy = size / 2;
  const rad = size * 0.36;
  const angleStep = (2 * Math.PI) / dims.length;
  const gp = (i, v) => {
    const a = i * angleStep - Math.PI / 2;
    return { x: cx + rad * v * Math.cos(a), y: cy + rad * v * Math.sin(a) };
  };
  const refLevel =
    typeof referenceValue === 'number'
      ? Math.max(0, Math.min(100, referenceValue)) / 100
      : null;
  const dp = dims.map((d, i) => gp(i, (scores[d] ?? 0) / 100));

  let svg = `<svg viewBox="0 0 ${size} ${size}" width="${size}" xmlns="http://www.w3.org/2000/svg">`;
  ;[0.2, 0.4, 0.6, 0.8, 1.0].forEach((l, li) => {
    const pts = dims.map((_, i) => {
      const p = gp(i, l);
      return `${p.x},${p.y}`;
    }).join(' ');
    svg += `<polygon points="${pts}" fill="none" stroke="${li === 4 ? '#bbb' : '#e0e0e0'}" stroke-width="${li === 4 ? 1.2 : 0.6}"/>`;
  });
  if (refLevel != null) {
    const refPts = dims
      .map((_, i) => {
        const p = gp(i, refLevel);
        return `${p.x},${p.y}`;
      })
      .join(' ');
    svg += `<polygon points="${refPts}" fill="none" stroke="#bfbfbf" stroke-width="1.2" stroke-dasharray="4 4"/>`;
  }
  dims.forEach((_, i) => {
    const p = gp(i, 1);
    svg += `<line x1="${cx}" y1="${cy}" x2="${p.x}" y2="${p.y}" stroke="#e0e0e0" stroke-width="0.6"/>`;
  });
  svg += `<polygon points="${dp.map(p => `${p.x},${p.y}`).join(' ')}" fill="${accent}22" stroke="${accent}" stroke-width="2.2" stroke-linejoin="round"/>`;
  dp.forEach((p, i) => {
    svg += `<circle cx="${p.x}" cy="${p.y}" r="4.5" fill="${dimensions[dims[i]].color}" stroke="#fff" stroke-width="1.5"/>`;
  });
  dims.forEach((d, i) => {
    const p = gp(i, 1.25);
    svg += `<text x="${p.x}" y="${p.y}" text-anchor="middle" dominant-baseline="central" font-size="10" font-weight="700" fill="${dimensions[d].color}" font-family="'DM Sans',sans-serif">${escapeHtml(dimensions[d].name)}</text>`;
  });
  svg += `</svg>`;

  let dimRows = '';
  sorted.forEach(d => {
    const dim = dimensions[d];
    const pct = Math.round(scores[d]);
    const desc = pct >= 65 ? dim.highDesc : pct <= 35 ? dim.lowDesc : dim.midDesc;
    dimRows += `<div style="margin-bottom:24px;"><div style="display:flex;justify-content:space-between;align-items:baseline;"><span style="font-weight:700;color:${dim.color};">${escapeHtml(dim.icon)} ${escapeHtml(dim.full)}</span><span style="font-weight:800;font-family:monospace;color:${dim.color};">${pct}%</span></div><div style="width:100%;height:8px;background:#f0ede8;border-radius:4px;margin:6px 0;overflow:hidden;"><div style="width:${pct}%;height:100%;background:linear-gradient(90deg,${dim.colorLight},${dim.color});"></div></div><p style="font-size:12px;color:#666;line-height:1.5;">${escapeHtml(desc)}</p></div>`;
  });

  const profile = generateCareerProfile(topDims, flatProfile);
  let topHtml = '<h2>TOP orientace a kariérní profil</h2>';
  if (flatProfile || !topDims.length) {
    topHtml += `<p style="font-size:14px;line-height:1.7;color:#555;">${escapeHtml(profile.text)}</p>`;
  } else {
    topHtml += `<p style="font-size:15px;font-weight:600;color:#2D2D2D;margin-bottom:12px;">${escapeHtml(profile.title)}</p>`;
    topHtml += `<p style="font-size:14px;line-height:1.7;color:#555;margin-bottom:16px;">${escapeHtml(profile.text)}</p>`;
    topDims.forEach(d => {
      const dim = dimensions[d];
      topHtml += `<div style="border-left:4px solid ${dim.color};padding:12px 16px;margin-bottom:10px;background:#f8f6f1;border-radius:0 8px 8px 0;"><strong style="color:${dim.color};">${escapeHtml(dim.icon)} ${escapeHtml(dim.name)}</strong><p style="font-size:12px;color:#666;margin:6px 0 0;">${escapeHtml(dim.roleExamples)}</p></div>`;
    });
  }

  return `<!DOCTYPE html><html lang="cs"><head><meta charset="UTF-8"><title>${escapeHtml(testConfig.fullName)} — Výsledky</title>
<style>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;600;700&family=DM+Serif+Display&display=swap');
*{margin:0;padding:0;box-sizing:border-box;}
body{font-family:'DM Sans',sans-serif;background:#fff;color:#2D2D2D;padding:40px 48px;max-width:800px;margin:0 auto;}
h1{font-family:'DM Serif Display',Georgia,serif;font-size:28px;font-weight:400;margin-bottom:8px;}
h2{font-family:'DM Serif Display',Georgia,serif;font-size:18px;margin:28px 0 14px;padding-bottom:8px;border-bottom:2px solid #f0ede8;}
.meta{font-size:13px;color:#999;margin-bottom:28px;}
.section{margin-bottom:28px;}
.radar-wrap{text-align:center;margin:16px 0;}
.footer{margin-top:36px;padding-top:16px;border-top:1px solid #eee;font-size:11px;color:#bbb;text-align:center;line-height:1.6;}
</style></head><body>
<h1>${escapeHtml(testConfig.fullName)}</h1>
<p class="meta">Datum: ${escapeHtml(now)} · 52 položek · Průměr (čárkovaně v radaru): ${referenceValue != null ? Math.round(referenceValue) : '—'}% · v${escapeHtml(testConfig.version)}</p>
<div class="section"><div class="radar-wrap">${svg}</div><p style="text-align:center;font-size:11px;color:#999;">Čárkovaný obrys = váš průměr napříč dimenzemi</p></div>
<div class="section">${topHtml}</div>
<div class="section"><h2>Dimenze (od nejsilnější)</h2>${dimRows}</div>
${practicalHtml ? `<div class="section"><h2>Praktické implikace</h2><div style="font-size:13px;line-height:1.75;color:#555;">${practicalHtml}</div></div>` : ''}
${lowDimsHtml || ''}
<div class="footer">Orientační self-assessment — nenahrazuje standardizovaný psychologický test.<br>Vytvořeno AI Self-Assessment Suite.</div>
</body></html>`;
}

export function practicalMarkdownToHtml(markdown) {
  return markdown
    .split('\n\n')
    .map(block => {
      const lines = block.split('\n');
      if (lines[0]?.startsWith('### ')) {
        return `<h2>${escapeHtml(lines[0].replace('### ', ''))}</h2>` + lines.slice(1).map(l => {
          if (l.startsWith('- ')) return `<p style="margin:4px 0 4px 16px;">• ${escapeHtml(l.slice(2))}</p>`;
          if (l.startsWith('**') && l.includes(':**')) {
            return `<p style="margin:8px 0;"><strong>${escapeHtml(l.replace(/\*\*/g, '').split(':**')[0])}:</strong> ${escapeHtml(l.split(':**')[1] || '')}</p>`;
          }
          return l ? `<p>${escapeHtml(l)}</p>` : '';
        }).join('');
      }
      return block ? `<p>${escapeHtml(block)}</p>` : '';
    })
    .join('');
}
