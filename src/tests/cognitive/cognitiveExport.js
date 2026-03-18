import { TEST_CONFIG, DIMENSIONS } from './cognitiveData';
import { interpretBipolar } from './cognitiveScoring';

function dimBand(dimKey, score) {
  const dim = DIMENSIONS[dimKey];
  const s = Number(score);
  const { band } = interpretBipolar(s);
  if (band === 'balanced') return { key: 'balanced', label: 'Vyvážený', side: null };
  if (band === 'A_strong' || band === 'A_mild') {
    return { key: band, label: dim.poleA?.name || 'Pól A', side: 'A' };
  }
  return { key: band, label: dim.poleB?.name || 'Pól B', side: 'B' };
}

export function generateCognitiveProfile(scores) {
  const dims = Object.keys(DIMENSIONS);
  const extremes = dims
    .map((d) => ({ d, s: Number(scores?.[d] ?? 50) }))
    .filter((x) => x.s < 25 || x.s > 75)
    .sort((a, b) => Math.abs(b.s - 50) - Math.abs(a.s - 50));

  if (!extremes.length) {
    return {
      title: 'Flexibilní kombinátor',
      text: 'Váš profil je relativně vyvážený napříč osami. To často znamená schopnost přepínat styl podle situace — jednou jít do detailu a struktury, jindy rychle improvizovat a rozhodovat se v nejistotě.',
    };
  }

  const top = extremes[0];
  const dim = DIMENSIONS[top.d];
  const side = top.s < 50 ? 'A' : 'B';
  const pole = side === 'A' ? dim.poleA : dim.poleB;
  const title = `${pole?.name || dim.name} styl`;

  const other = extremes.slice(1, 3).map((x) => {
    const dd = DIMENSIONS[x.d];
    const ss = x.s < 50 ? dd.poleA : dd.poleB;
    return ss?.name || dd.name;
  });

  const extra = other.length ? ` Doplňující rysy: ${other.join(' + ')}.` : '';
  return {
    title,
    text:
      `Nejvýrazněji se u vás projevuje osa **${dim.name}** směrem k pólu **${pole?.name}**.` +
      extra +
      ' Berte to jako preferenci, ne jako pevné omezení — v jiném kontextu můžete použít i opačný přístup.',
  };
}

export function getTeamComplementarity(scores) {
  const dims = Object.keys(DIMENSIONS);
  const extremes = dims
    .map((d) => ({ d, s: Number(scores?.[d] ?? 50) }))
    .filter((x) => x.s < 25 || x.s > 75);

  if (!extremes.length) {
    return 'Vyvážený profil se dobře integruje do různých týmů. Dává smysl hlídat, aby tým měl jak detailisty, tak vizionáře, a aby se kombinovala struktura s flexibilitou.';
  }

  const parts = extremes.map(({ d, s }) => {
    const dim = DIMENSIONS[d];
    const yourSide = s < 50 ? 'A' : 'B';
    const yourPole = yourSide === 'A' ? dim.poleA : dim.poleB;
    const otherPole = yourSide === 'A' ? dim.poleB : dim.poleA;
    return `Na ose **${dim.name}** vás typicky dobře doplní kolega více na pólu **${otherPole?.name}**, který vyváží váš styl (**${yourPole?.name}**).`;
  });

  return parts.join(' ');
}

export function getStrongSidesAndRisks(scores) {
  const dims = Object.keys(DIMENSIONS);
  return dims
    .map((d) => {
      const s = Number(scores?.[d] ?? 50);
      if (!(s < 25 || s > 75)) return null;
      const dim = DIMENSIONS[d];
      const pole = s < 50 ? dim.poleA : dim.poleB;
      return {
        dimKey: d,
        dimName: dim.name,
        poleName: pole?.name,
        strengths: pole?.strengths,
        risks: pole?.risks,
      };
    })
    .filter(Boolean);
}

function buildJsonBlock(scores, profileText) {
  const now = new Date().toISOString().split('T')[0];
  const dims = Object.keys(DIMENSIONS);
  const sorted = [...dims].sort((a, b) => (scores?.[b] ?? 0) - (scores?.[a] ?? 0));

  const jsonData = {
    test: TEST_CONFIG.id,
    test_name: TEST_CONFIG.fullName,
    version: TEST_CONFIG.version,
    date: now,
    questions_count: 40,
    scenarios_count: 8,
    scale: TEST_CONFIG.scaleDescription,
    scoring_weights: '70% Likert + 30% scénáře',
    type: 'bipolar',
    scores: {},
    ranking: sorted.map((d, i) => ({
      rank: i + 1,
      dimension: DIMENSIONS[d].eng,
      score: Math.round(scores?.[d] ?? 0),
    })),
    cognitive_profile: profileText,
  };

  dims.forEach((d) => {
    const dim = DIMENSIONS[d];
    const pct = Math.round(scores?.[d] ?? 50);
    const band = dimBand(d, pct);
    jsonData.scores[dim.eng] = {
      percentile: pct,
      poleA: dim.poleA?.name,
      poleB: dim.poleB?.name,
      interpretation: band.key === 'balanced' ? 'Vyvážený' : band.label,
    };
  });

  return jsonData;
}

export function generateCognitiveMarkdown(scores, practicalMarkdown, profile) {
  const now = new Date().toISOString().split('T')[0];
  const dims = Object.keys(DIMENSIONS);
  const sorted = [...dims].sort((a, b) => (scores?.[b] ?? 0) - (scores?.[a] ?? 0));

  let md = `# ${TEST_CONFIG.id} — ${TEST_CONFIG.fullName} — Výsledky\n\n`;
  md += `- **Datum:** ${now}\n`;
  md += `- **Verze testu:** ${TEST_CONFIG.version}\n`;
  md += `- **Typ testu:** ${TEST_CONFIG.testType}\n`;
  md += `- **Metoda:** AI-administrovaný interaktivní test\n`;
  md += `- **Počet položek:** ${TEST_CONFIG.scaleItemCount} škálových + ${TEST_CONFIG.scenarioCount} scénářů\n`;
  md += `- **Škála:** ${TEST_CONFIG.scaleDescription}\n`;
  md += `- **Scoring:** 70% Likert + 30% scénáře\n`;
  md += `- **Bipolární osy:** 0% = pól A, 50% = vyvážený, 100% = pól B\n\n`;
  md += `---\n\n`;

  md += `## Souhrnné skóre (bipolární)\n\n`;
  md += `| Osa | Skóre | Interpretace | Pól A ↔ Pól B |\n`;
  md += `|-----|------:|--------------|---------------|\n`;
  dims.forEach((d) => {
    const dim = DIMENSIONS[d];
    const pct = Math.round(scores?.[d] ?? 50);
    const it = interpretBipolar(pct).label;
    md += `| ${dim.icon} ${dim.name} | ${pct}% | ${it} | ${dim.poleA?.name} ↔ ${dim.poleB?.name} |\n`;
  });
  md += `\n`;

  md += `## Pořadí os (od nejvíc směrem k pólu B)\n\n`;
  sorted.forEach((d, i) => {
    const dim = DIMENSIONS[d];
    md += `${i + 1}. **${dim.name}** — ${Math.round(scores?.[d] ?? 50)}%\n`;
  });
  md += `\n---\n\n`;

  md += `## Kognitivní profil\n\n`;
  if (profile) {
    md += `**${profile.title}**\n\n${profile.text}\n\n`;
  }
  md += `---\n\n`;

  if (practicalMarkdown) {
    md += `## Praktické implikace\n\n${practicalMarkdown}\n\n`;
    md += `---\n\n`;
  }

  md += `## Strojově čitelná data (JSON)\n\n`;
  md += '```json\n';
  const jsonData = buildJsonBlock(scores, profile?.text || '');
  md += JSON.stringify(jsonData, null, 2);
  md += '\n```\n\n';
  md += `---\n\n`;
  md += `> Orientační self-assessment — nenahrazuje standardizovaný psychologický test.\n`;
  md += `> Vytvořeno interaktivním AI assessment nástrojem, verze ${TEST_CONFIG.version}.\n`;
  return md;
}

export function generateCognitiveHTML(scores, practicalHtml, profile) {
  const jsonData = buildJsonBlock(scores, profile?.text || '');
  const now = new Date().toLocaleDateString('cs-CZ', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const dims = Object.keys(DIMENSIONS);

  const bars = dims
    .map((d) => {
      const dim = DIMENSIONS[d];
      const pct = Math.round(scores?.[d] ?? 50);
      const it = interpretBipolar(pct).label;
      const markerLeft = `calc(${pct}% - 9px)`;

      return `
<div style="margin-bottom:22px;">
  <div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:6px;">
    <div style="font-weight:800;color:${dim.color};font-size:14px;">${dim.icon} ${escapeHtml(dim.full)}</div>
    <div style="font-weight:900;font-size:16px;color:${dim.color};font-family:'Courier New',monospace;">${pct}%</div>
  </div>
  <div style="display:flex;justify-content:space-between;font-size:10px;color:#999;margin-bottom:6px;">
    <span>${escapeHtml(dim.poleA?.name || 'Pól A')}</span>
    <span>${escapeHtml(dim.poleB?.name || 'Pól B')}</span>
  </div>
  <div style="position:relative;height:10px;border-radius:999px;overflow:hidden;background:#f0ede8;border:1px solid #ebe8e2;">
    <div style="position:absolute;inset:0;background:linear-gradient(90deg,${dim.color}55,${dim.color});"></div>
    <div style="position:absolute;top:-6px;bottom:-6px;left:50%;width:2px;background:#ffffffcc;"></div>
    <div style="position:absolute;top:-6px;bottom:-6px;left:50%;width:1px;background:${dim.color}55;"></div>
    <div style="position:absolute;top:50%;left:${markerLeft};transform:translateY(-50%);width:18px;height:18px;border-radius:999px;background:#fff;border:2px solid ${dim.color};box-shadow:0 2px 10px rgba(0,0,0,0.08);"></div>
  </div>
  <div style="margin-top:6px;font-size:12px;color:#666;line-height:1.6;">
    <strong style="color:${dim.color};">${escapeHtml(it)}.</strong>
    ${escapeHtml(
      getInterpretationSentence(d, pct)
    )}
  </div>
</div>`;
    })
    .join('');

  const jsonHtml = `<h2 style="font-family:'DM Serif Display',Georgia,serif;font-size:20px;font-weight:400;margin:28px 0 12px;border-bottom:2px solid #f0ede8;padding-bottom:8px;">Strojově čitelná data (JSON)</h2>
<pre style="white-space:pre-wrap;background:#f8f6f1;padding:14px;border-radius:12px;border:1px solid #ebe8e2;font-size:12px;line-height:1.5;">${escapeHtml(
    JSON.stringify(jsonData, null, 2)
  )}</pre>`;

  return `<!DOCTYPE html><html lang="cs"><head><meta charset="UTF-8"><title>${escapeHtml(
    TEST_CONFIG.fullName
  )} — Výsledky</title>
<style>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;700;800&family=DM+Serif+Display&display=swap');
*{margin:0;padding:0;box-sizing:border-box;}
body{font-family:'DM Sans',Helvetica,Arial,sans-serif;background:#fff;color:#2D2D2D;padding:48px 56px;max-width:820px;margin:0 auto;}
@media print{body{padding:32px 40px;}.no-print{display:none!important;}@page{margin:1.5cm;size:A4;}}
h1{font-family:'DM Serif Display',Georgia,serif;font-size:32px;font-weight:400;margin-bottom:4px;}
h2{font-family:'DM Serif Display',Georgia,serif;font-size:20px;font-weight:400;margin-bottom:16px;color:#2D2D2D;border-bottom:2px solid #f0ede8;padding-bottom:8px;}
.meta{font-size:13px;color:#999;margin-bottom:26px;}
.section{margin-bottom:34px;}
.btn{background:${TEST_CONFIG.accentColor};color:#fff;border:none;border-radius:8px;padding:12px 32px;font-size:15px;font-weight:600;cursor:pointer;font-family:'DM Sans',sans-serif;margin:20px 8px 20px 0;}
.btn:hover{opacity:0.92;}
.card{background:#fff;border:1px solid #ebe8e2;border-radius:16px;padding:18px 20px;box-shadow:0 4px 24px rgba(0,0,0,0.04);}
.footer{margin-top:40px;padding-top:18px;border-top:1px solid #eee;font-size:11px;color:#bbb;text-align:center;line-height:1.6;}
</style></head><body>
<div class="no-print" style="margin-bottom:24px;"><button class="btn" onclick="window.print()">Uložit jako PDF (Ctrl+P)</button></div>
<h1>${escapeHtml(TEST_CONFIG.fullName)}</h1>
<p class="meta">Datum: ${escapeHtml(now)} · ${TEST_CONFIG.questionCount} položek · 4 bipolární osy · v${escapeHtml(
    TEST_CONFIG.version
  )}</p>

<div class="section card">
  <div style="font-weight:700;color:${TEST_CONFIG.accentColor};margin-bottom:6px;">Tento test neměří inteligenci</div>
  <div style="font-size:13px;line-height:1.7;color:#555;">
    Měří preferovaný styl myšlení — žádný pól není „lepší". 0% = pól A, 50% = vyvážený, 100% = pól B.
  </div>
</div>

<div class="section">
  <h2>Bipolární škály</h2>
  ${bars}
</div>

${
  profile
    ? `<div class="section"><h2>Kognitivní profil</h2><div class="card"><div style="font-weight:800;color:${TEST_CONFIG.accentColor};margin-bottom:8px;">${escapeHtml(
        profile.title
      )}</div><div style="font-size:13px;line-height:1.75;color:#555;">${escapeHtml(
        profile.text
      )}</div></div></div>`
    : ''
}

${
  practicalHtml
    ? `<div class="section"><h2>Praktické implikace</h2><div class="card"><div style="font-size:13px;line-height:1.75;color:#555;">${practicalHtml}</div></div></div>`
    : ''
}

<div class="section">
  ${jsonHtml}
</div>

<div class="footer">Orientační self-assessment — nenahrazuje standardizovaný psychologický test.<br>Vytvořeno interaktivním AI assessment nástrojem, verze ${escapeHtml(
    TEST_CONFIG.version
  )}.</div>
</body></html>`;
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function getInterpretationSentence(dimKey, score) {
  const dim = DIMENSIONS[dimKey];
  const s = Number(score);
  const { band } = interpretBipolar(s);
  if (band === 'balanced') return dim.balancedDesc || '';
  if (band === 'A_strong' || band === 'A_mild') return dim.poleA?.desc || '';
  return dim.poleB?.desc || '';
}

export function getCognitivePracticalImplications(scores) {
  const dims = Object.keys(DIMENSIONS);

  const profile = generateCognitiveProfile(scores);
  const strongSides = getStrongSidesAndRisks(scores);
  const teamText = getTeamComplementarity(scores);

  let md = `### Tento test neměří inteligenci\n\n`;
  md += `Měří váš preferovaný styl myšlení — žádný pól není „lepší". Skóre ukazuje, **kam se typicky přikláníte** (0% = pól A, 50% = vyvážený, 100% = pól B).\n\n`;

  md += `### Kognitivní profil\n\n`;
  md += `**${profile.title}**\n\n${profile.text}\n\n`;

  md += `### Interpretace os\n\n`;
  dims.forEach((d) => {
    const dim = DIMENSIONS[d];
    const pct = Math.round(scores?.[d] ?? 50);
    const { label } = interpretBipolar(pct);
    const side = pct < 35 ? `→ ${dim.poleA?.name}` : pct > 65 ? `→ ${dim.poleB?.name}` : '→ Vyvážený';
    md += `- **${dim.icon} ${dim.name}:** ${pct}% (${label}) ${side}\n`;
  });
  md += `\n`;

  md += `### Silné stránky a rizika (jen výrazné póly)\n\n`;
  if (!strongSides.length) {
    md += 'Nemáte výrazné extrémy (< 25% nebo > 75%). To často znamená vysokou schopnost přepínat styl podle kontextu.\n\n';
  } else {
    strongSides.forEach((x) => {
      md += `**${DIMENSIONS[x.dimKey].icon} ${x.dimName} — ${x.poleName}**\n\n`;
      md += `- ✅ **Silné stránky:** ${x.strengths}\n`;
      md += `- ⚠️ **Rizika extrému:** ${x.risks}\n\n`;
    });
  }

  md += `### Týmová komplementarita\n\n${teamText}\n\n`;

  const html =
    `<p style="margin-bottom:12px;"><strong>Tento test neměří inteligenci.</strong> Měří preferovaný styl myšlení — žádný pól není „lepší". 0% = pól A, 50% = vyvážený, 100% = pól B.</p>` +
    `<p style="margin-bottom:12px;"><strong>Kognitivní profil:</strong> <span style="color:${TEST_CONFIG.accentColor};font-weight:700;">${escapeHtml(
      profile.title
    )}</span><br>${escapeHtml(profile.text)}</p>` +
    `<p style="margin-bottom:10px;"><strong>Týmová komplementarita:</strong> ${escapeHtml(teamText)}</p>`;

  const fullMarkdown = generateCognitiveMarkdown(scores, md, profile);
  const fullHtml = generateCognitiveHTML(scores, html, profile);
  const json = buildJsonBlock(scores, profile.text);

  return { markdown: md, html, fullMarkdown, fullHtml, json, profile, strongSides, teamText };
}

