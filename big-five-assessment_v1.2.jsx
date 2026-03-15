import { useState, useEffect } from "react";

// === SHARED UTILITIES v2.0 ===
// Verze: 2.0 | Změny propagovat do všech testů

function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function interleaveQuestionsAndScenarios(scales, scenarios, opts = {}) {
  const gap = opts.scalesBetweenScenarios || 4;
  const result = [];
  let si = 0, sci = 0;
  while (si < scales.length || sci < scenarios.length) {
    for (let i = 0; i < gap && si < scales.length; i++, si++) {
      result.push({ type: "scale", data: scales[si] });
    }
    if (sci < scenarios.length) {
      result.push({ type: "scenario", data: scenarios[sci] });
      sci++;
    }
  }
  return result;
}

function calculateScaleScores(items, answers, dimensions) {
  const dims = Object.keys(dimensions);
  const sums = {};
  const counts = {};
  dims.forEach(d => { sums[d] = 0; counts[d] = 0; });
  items.forEach(q => {
    const raw = answers[q.id];
    if (raw == null) return;
    const base = (raw - 1) / 6;
    const val = q.reverse ? (1 - base) : base;
    sums[q.dim] += val;
    counts[q.dim] += 1;
  });
  const scores = {};
  dims.forEach(d => {
    scores[d] = counts[d] > 0 ? (sums[d] / counts[d]) * 100 : 50;
  });
  return { scores, counts };
}

function calculateScenarioScores(scenarios, answers, dimensions) {
  const dims = Object.keys(dimensions);
  const sums = {};
  const counts = {};
  dims.forEach(d => { sums[d] = 0; counts[d] = 0; });
  scenarios.forEach(sc => {
    const idx = answers[sc.id];
    if (typeof idx !== "number") return;
    const selectedOption = sc.options[idx];
    const maxScores = {};
    sc.options.forEach(opt => {
      Object.entries(opt.scores || {}).forEach(([dim, val]) => {
        maxScores[dim] = Math.max(maxScores[dim] || 0, val);
      });
    });
    Object.entries(maxScores).forEach(([dim, maxVal]) => {
      if (!dims.includes(dim)) return;
      const selectedVal = selectedOption.scores?.[dim] || 0;
      const normalized = maxVal > 0 ? selectedVal / maxVal : 0;
      sums[dim] += normalized;
      counts[dim] += 1;
    });
  });
  const scores = {};
  dims.forEach(d => {
    scores[d] = counts[d] > 0 ? (sums[d] / counts[d]) * 100 : 50;
  });
  return { scores, counts };
}

function mergeScores(scaleResult, scenarioResult, dimensions, scenarioWeight = 0.3) {
  const scaleWeight = 1 - scenarioWeight;
  const dims = Object.keys(dimensions);
  const merged = {};
  dims.forEach(d => {
    const hasScale = scaleResult.scores[d] !== null;
    const hasScenario = scenarioResult.scores[d] !== null;
    if (hasScale && hasScenario) {
      merged[d] = scaleResult.scores[d] * scaleWeight + scenarioResult.scores[d] * scenarioWeight;
    } else if (hasScale) {
      merged[d] = scaleResult.scores[d];
    } else if (hasScenario) {
      merged[d] = scenarioResult.scores[d];
    } else {
      merged[d] = 50;
    }
  });
  return merged;
}

const getLevel = s => s >= 75 ? "Velmi vysoká" : s >= 55 ? "Vyšší" : s >= 45 ? "Střední" : s >= 25 ? "Nižší" : "Velmi nízká";
const getLevelEng = s => s >= 75 ? "Very High" : s >= 55 ? "High" : s >= 45 ? "Medium" : s >= 25 ? "Low" : "Very Low";
const getBar = s => { const f = Math.round(s / 10); return "\u2588".repeat(f) + "\u2591".repeat(10 - f); };

function downloadFile(content, filename, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename;
  document.body.appendChild(a); a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function generateMarkdownReport({ testConfig, dimensions, scores, practicalImplications }) {
  const now = new Date().toISOString().split("T")[0];
  const dims = Object.keys(dimensions);
  const sorted = [...dims].sort((a, b) => (scores[b] ?? 0) - (scores[a] ?? 0));
  const overall = Math.round(dims.reduce((s, d) => s + (scores[d] || 0), 0) / dims.length);

  let md = `# ${testConfig.id} \u2014 ${testConfig.fullName} \u2014 V\u00fdsledky\n\n`;
  md += `- **Datum:** ${now}\n`;
  md += `- **Verze testu:** ${testConfig.version}\n`;
  md += `- **Typ testu:** ${testConfig.testType}\n`;
  md += `- **Metoda:** AI-administrovan\u00fd interaktivn\u00ed test\n`;
  md += `- **Po\u010det polo\u017eek:** ${testConfig.scaleItemCount} \u0161k\u00e1lov\u00fdch${testConfig.scenarioCount ? ` + ${testConfig.scenarioCount} sc\u00e9n\u00e1\u0159\u016f` : ""}\n`;
  md += `- **\u0160k\u00e1la:** ${testConfig.scaleDescription}\n`;
  md += `- **Validita:** Orienta\u010dn\u00ed self-assessment (nikoliv klinicky standardizovan\u00fd)\n\n`;
  md += `---\n\n`;

  md += `## Souhrnn\u00e9 sk\u00f3re\n\n`;
  if (testConfig.overallLabel) {
    md += `- **Celkov\u00fd ${testConfig.overallLabel}:** ${overall}%\n\n`;
  }
  md += `| Dimenze | Sk\u00f3re | \u00darove\u0148 | Vizualizace |\n`;
  md += `|---------|-------|--------|-------------|\n`;
  dims.forEach(d => {
    const dim = dimensions[d];
    const pct = Math.round(scores[d]);
    md += `| ${dim.icon} ${dim.full} (${dim.eng}) | ${pct}% | ${getLevel(pct)} | ${getBar(pct)} |\n`;
  });
  md += `\n`;

  md += `## Po\u0159ad\u00ed dimenz\u00ed (od nejsiln\u011bj\u0161\u00ed)\n\n`;
  sorted.forEach((d, i) => {
    md += `${i + 1}. **${dimensions[d].full}** \u2014 ${Math.round(scores[d])}%\n`;
  });
  md += `\n---\n\n`;

  md += `## Detailn\u00ed interpretace\n\n`;
  dims.forEach(d => {
    const dim = dimensions[d];
    const pct = Math.round(scores[d]);
    const desc = pct >= 65 ? dim.highDesc : pct <= 35 ? dim.lowDesc : dim.midDesc;
    md += `### ${dim.icon} ${dim.full} (${dim.eng}) \u2014 ${pct}%\n\n`;
    md += `- **\u00darove\u0148:** ${getLevel(pct)}\n`;
    md += `- **\u0160k\u00e1la:** ${dim.lowLabel} \u2190 \u2192 ${dim.highLabel}\n`;
    md += `- **Interpretace:** ${desc}\n`;
    if (dim.subfacets && dim.subfacets.length) md += `- **Subfacety:** ${dim.subfacets.join(", ")}\n`;
    md += `\n`;
  });

  md += `---\n\n`;
  md += `## Praktick\u00e9 implikace\n\n${practicalImplications}\n\n`;
  md += `---\n\n`;

  md += `## Strojov\u011b \u010diteln\u00e1 data (JSON)\n\n`;
  md += "```json\n";
  const jsonData = {
    test: testConfig.id,
    test_name: testConfig.fullName,
    version: testConfig.version,
    date: now,
    questions_count: testConfig.scaleItemCount,
    scenarios_count: testConfig.scenarioCount || 0,
    scale: testConfig.scaleDescription,
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
  md += "\n```\n\n";
  md += `---\n\n`;
  md += `> Orienta\u010dn\u00ed self-assessment \u2014 nenahrazuje standardizovan\u00fd psychologick\u00fd test.\n`;
  md += `> Vytvo\u0159eno interaktivn\u00edm AI assessment n\u00e1strojem, verze ${testConfig.version}.\n`;
  return md;
}

function generateHTMLReport({ testConfig, dimensions, scores, practicalImplications }) {
  const dims = Object.keys(dimensions);
  const sorted = [...dims].sort((a, b) => (scores[b] ?? 0) - (scores[a] ?? 0));
  const now = new Date().toLocaleDateString("cs-CZ", { year: "numeric", month: "long", day: "numeric" });
  const accent = testConfig.accentColor;

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
    const pts = dims.map((_, i) => { const p = gp(i, l); return `${p.x},${p.y}`; }).join(" ");
    svg += `<polygon points="${pts}" fill="none" stroke="${li === 4 ? '#bbb' : '#e0e0e0'}" stroke-width="${li === 4 ? 1.2 : 0.6}"/>`;
  });
  dims.forEach((_, i) => {
    const p = gp(i, 1);
    svg += `<line x1="${cx}" y1="${cy}" x2="${p.x}" y2="${p.y}" stroke="#e0e0e0" stroke-width="0.6"/>`;
  });
  svg += `<polygon points="${dp.map(p => `${p.x},${p.y}`).join(" ")}" fill="${accent}22" stroke="${accent}" stroke-width="2.2" stroke-linejoin="round"/>`;
  dp.forEach((p, i) => {
    svg += `<circle cx="${p.x}" cy="${p.y}" r="4.5" fill="${dimensions[dims[i]].color}" stroke="#fff" stroke-width="1.5"/>`;
  });
  dims.forEach((d, i) => {
    const p = gp(i, 1.28);
    svg += `<text x="${p.x}" y="${p.y}" text-anchor="middle" dominant-baseline="central" font-size="11" font-weight="700" fill="${dimensions[d].color}" font-family="'DM Sans',sans-serif">${dimensions[d].name}</text>`;
  });
  svg += `</svg>`;

  let dimRows = "";
  dims.forEach(d => {
    const dim = dimensions[d];
    const pct = Math.round(scores[d]);
    const desc = pct >= 65 ? dim.highDesc : pct <= 35 ? dim.lowDesc : dim.midDesc;
    dimRows += `<div style="margin-bottom:28px;"><div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:4px;"><span style="font-weight:700;color:${dim.color};font-size:14px;">${dim.icon} ${dim.full}</span><span style="font-weight:800;font-size:18px;color:${dim.color};font-family:'Courier New',monospace;">${pct}%</span></div><div style="display:flex;justify-content:space-between;font-size:10px;color:#aaa;margin-bottom:3px;"><span>${dim.lowLabel}</span><span>${dim.highLabel}</span></div><div style="width:100%;height:8px;background:#f0ede8;border-radius:4px;overflow:hidden;"><div style="width:${pct}%;height:100%;background:linear-gradient(90deg,${dim.colorLight},${dim.color});border-radius:4px;"></div></div><p style="font-size:12px;color:#666;margin-top:6px;line-height:1.5;">${desc}</p></div>`;
  });

  const rankBadges = sorted.map(d => {
    const dim = dimensions[d];
    return `<span style="display:inline-flex;align-items:center;gap:4px;background:${dim.colorLight};border:1px solid ${dim.color}33;border-radius:16px;padding:4px 12px;font-size:12px;font-weight:600;color:${dim.color};margin:3px 4px;">${dim.icon} ${dim.name}: ${Math.round(scores[d])}%</span>`;
  }).join("");

  return `<!DOCTYPE html><html lang="cs"><head><meta charset="UTF-8"><title>${testConfig.fullName} \u2014 V\u00fdsledky</title>
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
<div class="no-print" style="margin-bottom:24px;"><button class="btn" onclick="window.print()">Ulo\u017eit jako PDF (Ctrl+P)</button></div>
<h1>${testConfig.fullName}</h1>
<p class="meta">Datum: ${now} \u00b7 ${testConfig.scaleItemCount} ot\u00e1zek \u00b7 \u0160k\u00e1la 1\u20137 \u00b7 AI Self-Assessment v${testConfig.version}</p>
<div class="section"><h2>Osobnostn\u00ed radar</h2><div class="radar-wrap">${svg}</div><div style="text-align:center;">${rankBadges}</div></div>
<div class="section"><h2>Detailn\u00ed profil</h2>${dimRows}</div>
<div class="section"><h2>Praktick\u00e9 implikace</h2><div style="font-size:13px;line-height:1.7;color:#555;">${practicalImplications}</div></div>
<div class="footer">Orienta\u010dn\u00ed self-assessment \u2014 nenahrazuje standardizovan\u00fd psychologick\u00fd test.<br>Vytvo\u0159eno interaktivn\u00edm AI assessment n\u00e1strojem, verze ${testConfig.version}.</div>
</body></html>`;
}

function RadarChart({ scores, dimensions, size = 320, accentColor = "#E07A5F" }) {
  const dims = Object.keys(dimensions);
  const cx = size / 2, cy = size / 2, r = size * 0.38;
  const angleStep = (2 * Math.PI) / dims.length;
  const levels = [0.2, 0.4, 0.6, 0.8, 1.0];
  const getPoint = (i, val) => {
    const angle = i * angleStep - Math.PI / 2;
    return { x: cx + r * val * Math.cos(angle), y: cy + r * val * Math.sin(angle) };
  };
  const dataPoints = dims.map((d, i) => getPoint(i, (scores[d] || 0) / 100));

  return (
    <svg viewBox={`0 0 ${size} ${size}`} style={{ width: "100%", maxWidth: size, margin: "0 auto", display: "block" }}>
      {levels.map((l, li) => (
        <polygon key={li} points={dims.map((_, i) => { const p = getPoint(i, l); return `${p.x},${p.y}`; }).join(" ")}
          fill="none" stroke={li === levels.length - 1 ? "#ccc" : "#e8e8e8"} strokeWidth={li === levels.length - 1 ? 1.5 : 0.8} />
      ))}
      {dims.map((_, i) => {
        const p = getPoint(i, 1);
        return <line key={i} x1={cx} y1={cy} x2={p.x} y2={p.y} stroke="#ddd" strokeWidth={0.8} />;
      })}
      <polygon points={dataPoints.map(p => `${p.x},${p.y}`).join(" ")}
        fill={`${accentColor}22`} stroke={accentColor} strokeWidth={2.5} strokeLinejoin="round" />
      {dataPoints.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={5} fill={dimensions[dims[i]].color} stroke="#fff" strokeWidth={2} />
      ))}
      {dims.map((d, i) => {
        const p = getPoint(i, 1.22);
        return (
          <text key={i} x={p.x} y={p.y} textAnchor="middle" dominantBaseline="central"
            style={{ fontSize: 13, fontWeight: 700, fill: dimensions[d].color, fontFamily: "'DM Sans', sans-serif" }}>
            {dimensions[d].name}
          </text>
        );
      })}
    </svg>
  );
}

function DimensionBar({ dimKey, score, dimensions }) {
  const dim = dimensions[dimKey];
  const pct = Math.round(score);
  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6 }}>
        <span style={{ fontWeight: 700, color: dim.color, fontSize: 15, fontFamily: "'DM Sans', sans-serif" }}>
          {dim.icon} {dim.full}
        </span>
        <span style={{ fontWeight: 800, fontSize: 20, color: dim.color, fontFamily: "'DM Mono', monospace" }}>{pct}%</span>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#999", marginBottom: 4, fontFamily: "'DM Sans', sans-serif" }}>
        <span>{dim.lowLabel}</span><span>{dim.highLabel}</span>
      </div>
      <div style={{ width: "100%", height: 10, background: "#f0ede8", borderRadius: 5, overflow: "hidden" }}>
        <div style={{ width: `${pct}%`, height: "100%", background: `linear-gradient(90deg, ${dim.colorLight}, ${dim.color})`,
          borderRadius: 5, transition: "width 1.2s cubic-bezier(.4,0,.2,1)" }} />
      </div>
      <p style={{ fontSize: 13, color: "#555", marginTop: 8, lineHeight: 1.55, fontFamily: "'DM Sans', sans-serif" }}>
        {pct >= 65 ? dim.highDesc : pct <= 35 ? dim.lowDesc : dim.midDesc}
      </p>
    </div>
  );
}

function ExportPanel({ testConfig, dimensions, scores, practicalImplications }) {
  const [exported, setExported] = useState({ md: false, html: false });
  const accent = testConfig.accentColor;

  const handleMarkdown = () => {
    const md = generateMarkdownReport({ testConfig, dimensions, scores, practicalImplications });
    const now = new Date().toISOString().split("T")[0];
    downloadFile(md, `${testConfig.id.toLowerCase()}-vysledky_${now}.md`, "text/markdown;charset=utf-8");
    setExported(p => ({ ...p, md: true }));
  };

  const handleHTML = () => {
    const html = generateHTMLReport({ testConfig, dimensions, scores, practicalImplications });
    const now = new Date().toISOString().split("T")[0];
    downloadFile(html, `${testConfig.id.toLowerCase()}-report_${now}.html`, "text/html;charset=utf-8");
    setExported(p => ({ ...p, html: true }));
  };

  return (
    <div style={{ background: "#fff", borderRadius: 20, padding: "28px 32px", marginBottom: 32,
      border: `2px solid ${accent}33`, boxShadow: `0 4px 24px ${accent}08` }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: `${accent}15`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>
          \ud83d\udcbe
        </div>
        <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 22, color: "#2D2D2D", fontWeight: 400, margin: 0 }}>
          Exportovat v\u00fdsledky
        </h2>
      </div>
      <p style={{ fontSize: 13, color: "#999", marginBottom: 24, lineHeight: 1.6 }}>
        Dva form\u00e1ty \u2014 vizu\u00e1ln\u00ed report pro archivaci a strukturovan\u00fd markdown pro dal\u0161\u00ed AI anal\u00fdzu.
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <button onClick={handleHTML}
          style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, padding: "24px 16px",
            background: exported.html ? "#f0fdf4" : "#fdf8f6", border: exported.html ? "2px solid #81B29A" : `2px solid ${accent}44`,
            borderRadius: 16, cursor: "pointer", transition: "all 0.25s ease", fontFamily: "'DM Sans', sans-serif" }}
          onMouseOver={e => { if (!exported.html) { e.currentTarget.style.borderColor = accent; e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = `0 8px 24px ${accent}25`; }}}
          onMouseOut={e => { if (!exported.html) { e.currentTarget.style.borderColor = `${accent}44`; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}}>
          <div style={{ width: 52, height: 52, borderRadius: 14, background: exported.html ? "#81B29A22" : `${accent}12`,
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26 }}>
            {exported.html ? "\u2713" : "\ud83d\udcca"}
          </div>
          <div style={{ fontWeight: 700, fontSize: 15, color: exported.html ? "#81B29A" : accent }}>
            {exported.html ? "Sta\u017eeno!" : "Vizu\u00e1ln\u00ed report"}
          </div>
          <div style={{ fontSize: 12, color: "#999", textAlign: "center", lineHeight: 1.5 }}>
            HTML s grafem a \u0161k\u00e1lami<br /><span style={{ fontSize: 11, color: "#bbb" }}>Otev\u0159i \u2192 Ctrl+P \u2192 ulo\u017e PDF</span>
          </div>
        </button>
        <button onClick={handleMarkdown}
          style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, padding: "24px 16px",
            background: exported.md ? "#f0fdf4" : "#f6f5fa", border: exported.md ? "2px solid #81B29A" : "2px solid #8E7DBE44",
            borderRadius: 16, cursor: "pointer", transition: "all 0.25s ease", fontFamily: "'DM Sans', sans-serif" }}
          onMouseOver={e => { if (!exported.md) { e.currentTarget.style.borderColor = "#8E7DBE"; e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(142,125,190,0.15)"; }}}
          onMouseOut={e => { if (!exported.md) { e.currentTarget.style.borderColor = "#8E7DBE44"; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}}>
          <div style={{ width: 52, height: 52, borderRadius: 14, background: exported.md ? "#81B29A22" : "#8E7DBE12",
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26 }}>
            {exported.md ? "\u2713" : "\ud83d\udcdd"}
          </div>
          <div style={{ fontWeight: 700, fontSize: 15, color: exported.md ? "#81B29A" : "#8E7DBE" }}>
            {exported.md ? "Sta\u017eeno!" : "Markdown pro AI"}
          </div>
          <div style={{ fontSize: 12, color: "#999", textAlign: "center", lineHeight: 1.5 }}>
            Strukturovan\u00fd .md soubor<br /><span style={{ fontSize: 11, color: "#bbb" }}>V\u010detn\u011b JSON dat pro AI zpracov\u00e1n\u00ed</span>
          </div>
        </button>
      </div>
      <div style={{ marginTop: 20, padding: "12px 16px", background: "#f8f6f1", borderRadius: 10, fontSize: 12, color: "#999", lineHeight: 1.6 }}>
        \ud83d\udca1 <strong>Tip:</strong> Markdown soubor m\u016f\u017ee\u0161 rovnou p\u0159ilo\u017eit do nov\u00e9 konverzace s AI jako kontext pro dal\u0161\u00ed testy nebo anal\u00fdzy. JSON blok na konci souboru je strojov\u011b \u010diteln\u00fd.
      </div>
    </div>
  );
}

// === END SHARED UTILITIES ===

// === BIG5 TEST DATA ===

const TEST_CONFIG = {
  id: "BIG5",
  name: "Big Five",
  fullName: "Big Five Personality Assessment",
  version: "2.0",
  icon: "\u25c9",
  accentColor: "#E07A5F",
  accentColorLight: "#E07A5F22",
  secondaryColor: "#F2CC8F",
  estimatedMinutes: 10,
  testType: "Big Five / OCEAN (self-assessment, 40 ot\u00e1zek, \u0161k\u00e1la 1\u20137)",
  scaleDescription: "Likertova 1\u20137 (V\u016fbec ne \u2192 Rozhodn\u011b ano)",
  scaleItemCount: 40,
  scenarioCount: 0,
  description: "Test mapuje tvou osobnost v 5 z\u00e1kladn\u00edch dimenz\u00edch \u2014 otev\u0159enost, sv\u011bdomitost, extraverze, p\u0159\u00edv\u011btivost a emo\u010dn\u00ed stabilita.",
  tip: "Odpov\u00eddej intuitivn\u011b \u2014 prvn\u00ed reakce b\u00fdv\u00e1 nejp\u0159esn\u011bj\u0161\u00ed. Na konci si st\u00e1hne\u0161 vizu\u00e1ln\u00ed report i markdown pro AI."
};

const DIMENSIONS = {
  O: {
    name: "Otev\u0159enost", full: "Otev\u0159enost v\u016f\u010di zku\u0161enosti", eng: "Openness",
    color: "#E07A5F", colorLight: "#E07A5F22", icon: "\u2726",
    subfacets: ["Fantazie", "Estetika", "Pocity", "Akce", "Ideje", "Hodnoty"],
    lowLabel: "Praktick\u00fd & konven\u010dn\u00ed", highLabel: "Zv\u00eddav\u00fd & origin\u00e1ln\u00ed",
    lowDesc: "Preferuje\u0161 osv\u011bd\u010den\u00e9 postupy, jsi prakticky zam\u011b\u0159en\u00fd a up\u0159ednost\u0148uje\u0161 konkr\u00e9tn\u00ed fakta p\u0159ed abstraktn\u00edmi teoriemi. Stabilita a p\u0159edv\u00eddatelnost ti d\u00e1vaj\u00ed jistotu.",
    highDesc: "M\u00e1\u0161 bohat\u00fd vnit\u0159n\u00ed sv\u011bt, aktivn\u011b vyhled\u00e1v\u00e1\u0161 nov\u00e9 zku\u0161enosti a my\u0161lenky. Jsi kreativn\u00ed, zv\u00eddav\u00fd a otev\u0159en\u00fd nekonven\u010dn\u00edm p\u0159\u00edstup\u016fm.",
    midDesc: "Dok\u00e1\u017ee\u0161 balancovat mezi osv\u011bd\u010den\u00fdmi postupy a nov\u00fdmi p\u0159\u00edstupy. Jsi otev\u0159en\u00fd novink\u00e1m, ale ne na \u00fakor stability."
  },
  C: {
    name: "Sv\u011bdomitost", full: "Sv\u011bdomitost", eng: "Conscientiousness",
    color: "#3D405B", colorLight: "#3D405B22", icon: "\u25c6",
    subfacets: ["Kompetence", "Po\u0159\u00e1dnost", "Povinnost", "C\u00edlev\u011bdomost", "Discipl\u00edna", "Rozvaha"],
    lowLabel: "Flexibiln\u00ed & spont\u00e1nn\u00ed", highLabel: "Organizovan\u00fd & disciplinovan\u00fd",
    lowDesc: "Jsi spont\u00e1nn\u00ed, flexibiln\u00ed a preferuje\u0161 volnost p\u0159ed strukturou. P\u0159\u00edli\u0161 rigidn\u00ed pl\u00e1ny t\u011b svazuj\u00ed \u2014 funguje ti l\u00e9pe reagovat na situaci.",
    highDesc: "Jsi systematick\u00fd, spolehliv\u00fd a c\u00edlev\u011bdom\u00fd. Dotahuje\u0161 v\u011bci do konce, pl\u00e1nuje\u0161 dop\u0159edu a m\u00e1\u0161 siln\u00fd smysl pro odpov\u011bdnost.",
    midDesc: "Um\u00ed\u0161 b\u00fdt organizovan\u00fd, kdy\u017e je pot\u0159eba, ale zachov\u00e1v\u00e1\u0161 si flexibilitu. Najde\u0161 rovnov\u00e1hu mezi strukturou a spontaneitou."
  },
  E: {
    name: "Extraverze", full: "Extraverze", eng: "Extraversion",
    color: "#F2CC8F", colorLight: "#F2CC8F22", icon: "\u25cf",
    subfacets: ["V\u0159elost", "Spole\u010denskost", "Asertivita", "Aktivita", "Vzru\u0161en\u00ed", "Pozitivn\u00ed emoce"],
    lowLabel: "Introvertn\u00ed & reflektivn\u00ed", highLabel: "Extravertn\u00ed & energick\u00fd",
    lowDesc: "\u010cerp\u00e1\u0161 energii z klidn\u00e9ho prost\u0159ed\u00ed a hlub\u0161\u00edch konverzac\u00ed 1:1. Nepot\u0159ebuje\u0161 b\u00fdt st\u0159edem pozornosti \u2014 reflexe a vnit\u0159n\u00ed sv\u011bt ti d\u00e1vaj\u00ed s\u00edlu.",
    highDesc: "Jsi energick\u00fd, spole\u010densk\u00fd a r\u00e1d se anga\u017euje\u0161. Lid\u00e9 kolem t\u011b nab\u00edj\u00ed a p\u0159irozen\u011b p\u0159itahuje\u0161 pozornost skupiny.",
    midDesc: "Jsi ambivert \u2014 um\u00ed\u0161 b\u00fdt spole\u010densk\u00fd i reflektivn\u00ed podle situace. \u010cerp\u00e1\u0161 energii jak z lid\u00ed, tak z klidu."
  },
  A: {
    name: "P\u0159\u00edv\u011btivost", full: "P\u0159\u00edv\u011btivost", eng: "Agreeableness",
    color: "#81B29A", colorLight: "#81B29A22", icon: "\u2665",
    subfacets: ["D\u016fv\u011bra", "Up\u0159\u00edmnost", "Altruismus", "\u00dastupnost", "Skromnost", "Soucit"],
    lowLabel: "Nez\u00e1visl\u00fd & p\u0159\u00edm\u00fd", highLabel: "Kooperativn\u00ed & empatick\u00fd",
    lowDesc: "Jsi p\u0159\u00edm\u00fd, nez\u00e1visl\u00fd a neboj\u00ed\u0161 se konfrontace, kdy\u017e je pot\u0159eba. Cen\u00ed\u0161 si autenticity v\u00edc ne\u017e harmonie za ka\u017edou cenu.",
    highDesc: "Jsi empatick\u00fd, kooperativn\u00ed a zam\u011b\u0159en\u00fd na druh\u00e9. P\u0159irozen\u011b vytv\u00e1\u0159\u00ed\u0161 harmonii a d\u016fv\u011bru v mezilidsk\u00fdch vztaz\u00edch.",
    midDesc: "Um\u00ed\u0161 b\u00fdt jak kooperativn\u00ed, tak asertivn\u00ed podle kontextu. M\u00e1\u0161 empatii, ale neboj\u00ed\u0161 se \u0159\u00edct, co si mysl\u00ed\u0161."
  },
  N: {
    name: "Neuroticismus", full: "Neuroticismus (emo\u010dn\u00ed stabilita)", eng: "Neuroticism",
    color: "#8E7DBE", colorLight: "#8E7DBE22", icon: "\u25ce",
    subfacets: ["\u00dazkost", "Hn\u011bvivost", "Depresivita", "Rozpa\u010ditost", "Impulzivita", "Zranitelnost"],
    lowLabel: "Klidn\u00fd & odoln\u00fd", highLabel: "Citliv\u00fd & reaktivn\u00ed",
    lowDesc: "Jsi emocion\u00e1ln\u011b stabiln\u00ed, klidn\u00fd pod tlakem a rychle se zotavuje\u0161 ze stresu. Emoce t\u011b nezahlcuj\u00ed.",
    highDesc: "Jsi emocion\u00e1ln\u011b citliv\u00fd a intenzivn\u011b pro\u017e\u00edv\u00e1\u0161. M\u016f\u017ee\u0161 b\u00fdt n\u00e1chyln\u011bj\u0161\u00ed ke stresu a p\u0159em\u00fd\u0161len\u00ed, ale to tak\u00e9 znamen\u00e1 hlub\u0161\u00ed pro\u017e\u00edv\u00e1n\u00ed.",
    midDesc: "M\u00e1\u0161 pr\u016fm\u011brnou emo\u010dn\u00ed reaktivitu \u2014 n\u011bkdy t\u011b v\u011bci zas\u00e1hnou v\u00edc, jindy jsi klidn\u00fd. Z\u00e1le\u017e\u00ed na kontextu a n\u00e1ro\u010dnosti situace."
  }
};

const SCALE_ITEMS = [
  { id: "o1", dim: "O", text: "M\u00e1m \u017eivou p\u0159edstavivost a \u010dasto se no\u0159\u00edm do fantazi\u00ed a my\u0161lenkov\u00fdch experiment\u016f.", sub: 0, reverse: false },
  { id: "o2", dim: "O", text: "Um\u011bleck\u00e1 d\u00edla, hudba nebo p\u0159\u00edroda m\u011b dok\u00e1\u017eou hluboce zas\u00e1hnout.", sub: 1, reverse: false },
  { id: "o3", dim: "O", text: "R\u00e1d/a zkou\u0161\u00edm nov\u00e9 p\u0159\u00edstupy, i kdy\u017e ten star\u00fd funguje.", sub: 3, reverse: false },
  { id: "o4", dim: "O", text: "P\u0159em\u00fd\u0161l\u00edm o abstraktn\u00edch konceptech a filozofick\u00fdch ot\u00e1zk\u00e1ch.", sub: 4, reverse: false },
  { id: "o5", dim: "O", text: "Vyhled\u00e1v\u00e1m situace, kter\u00e9 jsou pro m\u011b nov\u00e9 a nezn\u00e1m\u00e9.", sub: 3, reverse: false },
  { id: "o6", dim: "O", text: "Rad\u011bji se dr\u017e\u00edm osv\u011bd\u010den\u00fdch postup\u016f ne\u017e experimentuji.", sub: 5, reverse: true },
  { id: "o7", dim: "O", text: "Zaj\u00edm\u00e1m se o to, jak v\u011bci funguj\u00ed pod povrchem \u2014 syst\u00e9my, vzorce, souvislosti.", sub: 4, reverse: false },
  { id: "o8", dim: "O", text: "Jsem otev\u0159en\u00fd/\u00e1 p\u0159ehodnocen\u00ed sv\u00fdch n\u00e1zor\u016f, kdy\u017e naraz\u00edm na nov\u00e9 informace.", sub: 5, reverse: false },
  { id: "c1", dim: "C", text: "M\u00e1m jasn\u00fd syst\u00e9m, jak organizuji sv\u016fj \u010das a \u00fakoly.", sub: 1, reverse: false },
  { id: "c2", dim: "C", text: "Kdy\u017e si n\u011bco p\u0159edsevezmu, dot\u00e1hnu to do konce.", sub: 3, reverse: false },
  { id: "c3", dim: "C", text: "P\u0159ed rozhodnut\u00edm pe\u010dliv\u011b zva\u017euji mo\u017en\u00e9 d\u016fsledky.", sub: 5, reverse: false },
  { id: "c4", dim: "C", text: "Moje pracovn\u00ed prost\u0159ed\u00ed je v\u011bt\u0161inou uspo\u0159\u00e1dan\u00e9.", sub: 1, reverse: false },
  { id: "c5", dim: "C", text: "\u010casto odkl\u00e1d\u00e1m d\u016fle\u017eit\u00e9 \u00fakoly na posledn\u00ed chv\u00edli.", sub: 4, reverse: true },
  { id: "c6", dim: "C", text: "Stanovuji si c\u00edle a systematicky k nim sm\u011b\u0159uji.", sub: 3, reverse: false },
  { id: "c7", dim: "C", text: "Detaily a p\u0159esnost jsou pro m\u011b d\u016fle\u017eit\u00e9.", sub: 0, reverse: false },
  { id: "c8", dim: "C", text: "Dodr\u017euji sliby a z\u00e1vazky, i kdy\u017e to nen\u00ed snadn\u00e9.", sub: 2, reverse: false },
  { id: "e1", dim: "E", text: "Ve v\u011bt\u0161\u00ed skupin\u011b lid\u00ed se c\u00edt\u00edm nabit\u00fd/\u00e1 energi\u00ed.", sub: 1, reverse: false },
  { id: "e2", dim: "E", text: "R\u00e1d/a beru iniciativu a vedu konverzaci.", sub: 2, reverse: false },
  { id: "e3", dim: "E", text: "Preferuji hlubok\u00e9 rozhovory 1:1 p\u0159ed velk\u00fdmi spole\u010densk\u00fdmi akcemi.", sub: 1, reverse: true },
  { id: "e4", dim: "E", text: "M\u00e1m r\u00e1d/a rychl\u00e9 tempo a hodn\u011b aktivity b\u011bhem dne.", sub: 3, reverse: false },
  { id: "e5", dim: "E", text: "Snadno navazuji kontakty s nezn\u00e1m\u00fdmi lidmi.", sub: 0, reverse: false },
  { id: "e6", dim: "E", text: "Po dlouh\u00e9m spole\u010densk\u00e9m ve\u010deru pot\u0159ebuji \u010das s\u00e1m/sama na dobit\u00ed.", sub: 4, reverse: true },
  { id: "e7", dim: "E", text: "\u010casto pro\u017e\u00edv\u00e1m siln\u00e9 pozitivn\u00ed emoce \u2014 nad\u0161en\u00ed, radost, vzru\u0161en\u00ed.", sub: 5, reverse: false },
  { id: "e8", dim: "E", text: "V pr\u00e1ci mi vyhovuje spolupr\u00e1ce v\u00edc ne\u017e samostatn\u00e1 pr\u00e1ce.", sub: 1, reverse: false },
  { id: "a1", dim: "A", text: "V\u011bt\u0161in\u011b lid\u00ed p\u0159irozen\u011b d\u016fv\u011b\u0159uji, dokud m\u011b nep\u0159esv\u011bd\u010d\u00ed o opaku.", sub: 0, reverse: false },
  { id: "a2", dim: "A", text: "Kdy\u017e vid\u00edm n\u011bkoho v nesn\u00e1z\u00edch, automaticky chci pomoct.", sub: 2, reverse: false },
  { id: "a3", dim: "A", text: "V konfliktu hled\u00e1m kompromis sp\u00ed\u0161 ne\u017e prosazuji svou.", sub: 3, reverse: false },
  { id: "a4", dim: "A", text: "\u0158\u00edk\u00e1m lidem pravdu p\u0159\u00edmo, i kdy\u017e to necht\u011bj\u00ed sly\u0161et.", sub: 1, reverse: true },
  { id: "a5", dim: "A", text: "Sna\u017e\u00edm se vid\u011bt situaci z perspektivy druh\u00e9ho \u010dlov\u011bka.", sub: 5, reverse: false },
  { id: "a6", dim: "A", text: "M\u00e9 vlastn\u00ed pot\u0159eby d\u00e1v\u00e1m \u010dasto na druh\u00e9 m\u00edsto za pot\u0159eby ostatn\u00edch.", sub: 4, reverse: false },
  { id: "a7", dim: "A", text: "Rad\u011bji spolupracuji, ne\u017e sout\u011b\u017e\u00edm.", sub: 3, reverse: false },
  { id: "a8", dim: "A", text: "Nem\u00e1m probl\u00e9m se konfrontovat, pokud je to nutn\u00e9.", sub: 3, reverse: true },
  { id: "n1", dim: "N", text: "\u010casto se p\u0159istihnu, \u017ee p\u0159em\u00fd\u0161l\u00edm o v\u011bcech, kter\u00e9 by se mohly pokazit.", sub: 0, reverse: false },
  { id: "n2", dim: "N", text: "Mal\u00e9 nep\u0159\u00edjemnosti m\u011b dok\u00e1\u017eou vyv\u00e9st z rovnov\u00e1hy na del\u0161\u00ed dobu.", sub: 1, reverse: false },
  { id: "n3", dim: "N", text: "N\u011bkdy m\u011b zaplav\u00ed pocity smutku nebo pr\u00e1zdnoty bez jasn\u00e9 p\u0159\u00ed\u010diny.", sub: 2, reverse: false },
  { id: "n4", dim: "N", text: "V soci\u00e1ln\u00edch situac\u00edch se ob\u010das c\u00edt\u00edm nejist\u011b.", sub: 3, reverse: false },
  { id: "n5", dim: "N", text: "Pod stresem z\u016fst\u00e1v\u00e1m klidn\u00fd/\u00e1 a soust\u0159ed\u011bn\u00fd/\u00e1.", sub: 5, reverse: true },
  { id: "n6", dim: "N", text: "M\u00e1m tendenci reagovat impulzivn\u011b, kdy\u017e jsem ve stresu.", sub: 4, reverse: false },
  { id: "n7", dim: "N", text: "Rychle se zotavuji z n\u00e1ro\u010dn\u00fdch situac\u00ed.", sub: 5, reverse: true },
  { id: "n8", dim: "N", text: "Stres a tlak negativn\u011b ovliv\u0148uj\u00ed kvalitu m\u00e9ho rozhodov\u00e1n\u00ed.", sub: 5, reverse: false },
];

function getPracticalImplications(scores) {
  let text = "### Pracovn\u00ed prost\u0159ed\u00ed\n\n";
  text += scores.O > 60 ? "- Vyhovuje prost\u0159ed\u00ed podporuj\u00edc\u00ed inovaci a experimentov\u00e1n\u00ed\n" : "- Preferuje jasnou strukturu a osv\u011bd\u010den\u00e9 postupy\n";
  text += scores.C > 60 ? "- Pot\u0159ebuje jasn\u00e9 c\u00edle a syst\u00e9m\n" : "- L\u00e9pe funguje ve flexibiln\u00edm prost\u0159ed\u00ed bez p\u0159\u00edli\u0161n\u00e9 rigidity\n";
  text += scores.E > 55 ? "- T\u00fdmov\u00e1 spolupr\u00e1ce energizuje\n" : "- Oce\u0148uje prostor pro soust\u0159ed\u011bnou samostatnou pr\u00e1ci\n";
  text += "\n### Komunikace a vztahy\n\n";
  text += scores.A > 60 ? "- P\u0159irozen\u011b empatick\u00fd a kooperativn\u00ed\n" : "- P\u0159\u00edm\u00fd, neboj\u00ed se konstruktivn\u00ed konfrontace\n";
  text += scores.N < 40 ? "- Pod tlakem klidn\u00fd \u2014 v\u00fdhoda ve stresov\u00fdch situac\u00edch\n" : scores.N > 60 ? "- Hlubok\u00e9 pro\u017e\u00edv\u00e1n\u00ed = emo\u010dn\u00ed inteligence, vy\u017eaduje aktivn\u00ed pr\u00e1ci se stresem\n" : "- Emocion\u00e1ln\u011b vyv\u00e1\u017een\u00fd s p\u0159im\u011b\u0159enou citlivost\u00ed\n";
  return text;
}

function getPracticalImplicationsHTML(scores) {
  let html = `<p style="margin-bottom:12px;"><strong>Pracovn\u00ed prost\u0159ed\u00ed:</strong> `;
  html += scores.O > 60 ? "Vyhovuje prost\u0159ed\u00ed podporuj\u00edc\u00ed inovaci a experimentov\u00e1n\u00ed. " : "Preferuje jasnou strukturu a osv\u011bd\u010den\u00e9 postupy. ";
  html += scores.C > 60 ? "Pot\u0159ebuje jasn\u00e9 c\u00edle a syst\u00e9m. " : "L\u00e9pe funguje ve flexibiln\u00edm prost\u0159ed\u00ed. ";
  html += scores.E > 55 ? "T\u00fdmov\u00e1 spolupr\u00e1ce energizuje." : "Oce\u0148uje prostor pro soust\u0159ed\u011bnou samostatnou pr\u00e1ci.";
  html += `</p><p><strong>Komunikace a vztahy:</strong> `;
  html += scores.A > 60 ? "P\u0159irozen\u011b empatick\u00fd a kooperativn\u00ed. " : "P\u0159\u00edm\u00fd, neboj\u00ed se konstruktivn\u00ed konfrontace. ";
  html += scores.N < 40 ? "Pod tlakem klidn\u00fd \u2014 v\u00fdhoda ve stresov\u00fdch situac\u00edch." : scores.N > 60 ? "Hlubok\u00e9 pro\u017e\u00edv\u00e1n\u00ed = emo\u010dn\u00ed inteligence, vy\u017eaduje aktivn\u00ed pr\u00e1ci se stresem." : "Emocion\u00e1ln\u011b vyv\u00e1\u017een\u00fd s p\u0159im\u011b\u0159enou citlivost\u00ed.";
  html += `</p>`;
  return html;
}

export default function BigFiveAssessment() {
  const [phase, setPhase] = useState("intro");
  const [questions, setQuestions] = useState([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState({});
  const [sliderVal, setSliderVal] = useState(null);
  const [sliderTouched, setSliderTouched] = useState(false);
  const [animating, setAnimating] = useState(false);
  const [scores, setScores] = useState(null);

  useEffect(() => {
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,300;0,400;0,500;0,700;0,800;1,400&family=DM+Mono:wght@400;500&family=DM+Serif+Display&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
  }, []);

  const bg = "#FDFBF7";
  const labels = ["V\u016fbec ne", "Sp\u00ed\u0161e ne", "Trochu ne", "Neutr\u00e1ln\u00ed", "Trochu ano", "Sp\u00ed\u0161e ano", "Rozhodn\u011b ano"];

  const startTest = () => {
    setQuestions(shuffleArray(SCALE_ITEMS));
    setPhase("test");
    setCurrentQ(0);
    setAnswers({});
    setSliderVal(null);
    setSliderTouched(false);
  };

  const handleSliderChange = (value) => {
    setSliderVal(Number(value));
    setSliderTouched(true);
  };

  const submitAnswer = () => {
    if (animating || !sliderTouched) return;
    setAnimating(true);
    const q = questions[currentQ];
    const newAnswers = { ...answers, [q.id]: sliderVal };
    setAnswers(newAnswers);

    if (currentQ + 1 >= questions.length) {
      const result = calculateScaleScores(SCALE_ITEMS, newAnswers, DIMENSIONS);
      setScores(result.scores);
      setTimeout(() => { setPhase("results"); setAnimating(false); }, 600);
    } else {
      setTimeout(() => {
        setCurrentQ(currentQ + 1);
        const nextQ = questions[currentQ + 1];
        const prevAnswer = newAnswers[nextQ.id];
        setSliderVal(prevAnswer ?? null);
        setSliderTouched(prevAnswer != null);
        setAnimating(false);
      }, 300);
    }
  };

  const goBack = () => {
    if (currentQ > 0) {
      const prevQ = questions[currentQ - 1];
      setCurrentQ(currentQ - 1);
      const prevAnswer = answers[prevQ.id];
      setSliderVal(prevAnswer ?? null);
      setSliderTouched(prevAnswer != null);
    }
  };

  const progress = questions.length > 0 ? ((currentQ + (phase === "results" ? 1 : 0)) / questions.length) * 100 : 0;

  if (phase === "intro") {
    return (
      <div style={{ minHeight: "100vh", background: bg, display: "flex", alignItems: "center", justifyContent: "center", padding: 24, fontFamily: "'DM Sans', sans-serif" }}>
        <div style={{ maxWidth: 520, textAlign: "center" }}>
          <div style={{ fontSize: 56, marginBottom: 16 }}>{TEST_CONFIG.icon}</div>
          <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 36, color: "#2D2D2D", marginBottom: 12, fontWeight: 400, lineHeight: 1.2 }}>
            {TEST_CONFIG.name}
          </h1>
          <p style={{ fontFamily: "'DM Serif Display', serif", fontSize: 20, color: "#888", marginBottom: 32, fontWeight: 400 }}>
            Osobnostn\u00ed assessment
          </p>
          <div style={{ background: "#fff", borderRadius: 16, padding: "28px 32px", textAlign: "left", marginBottom: 32,
            border: "1px solid #ebe8e2", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
            <p style={{ fontSize: 15, color: "#555", lineHeight: 1.7, marginBottom: 16 }}>
              {TEST_CONFIG.description}
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px 24px", fontSize: 14, color: "#777" }}>
              <div>\u23f1 ~{TEST_CONFIG.estimatedMinutes} minut</div>
              <div>\ud83d\udcca {TEST_CONFIG.scaleItemCount} ot\u00e1zek</div>
              <div>\ud83c\udf9a Posuvn\u00edk 1\u20137</div>
              <div>\ud83d\udce5 Export v\u00fdsledk\u016f</div>
            </div>
            <div style={{ marginTop: 20, padding: "14px 16px", background: "#f8f6f1", borderRadius: 10, fontSize: 13, color: "#888", lineHeight: 1.6 }}>
              {TEST_CONFIG.tip}
            </div>
          </div>
          <button onClick={startTest}
            style={{ background: TEST_CONFIG.accentColor, color: "#fff", border: "none", borderRadius: 12, padding: "16px 48px",
              fontSize: 17, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
              boxShadow: `0 4px 16px ${TEST_CONFIG.accentColor}35`, transition: "all 0.2s" }}
            onMouseOver={e => e.currentTarget.style.transform = "translateY(-2px)"}
            onMouseOut={e => e.currentTarget.style.transform = "translateY(0)"}>
            Za\u010d\u00edt test \u2192
          </button>
        </div>
      </div>
    );
  }

  if (phase === "test" && questions.length > 0) {
    const q = questions[currentQ];
    const dim = DIMENSIONS[q.dim];
    const dimAnswered = questions.slice(0, currentQ + 1).filter(qq => qq.dim === q.dim).length;
    const dimTotal = questions.filter(qq => qq.dim === q.dim).length;

    return (
      <div style={{ minHeight: "100vh", background: bg, fontFamily: "'DM Sans', sans-serif", display: "flex", flexDirection: "column" }}>
        <div style={{ position: "sticky", top: 0, zIndex: 10, background: bg, borderBottom: "1px solid #ebe8e2" }}>
          <div style={{ height: 4, background: "#f0ede8" }}>
            <div style={{ height: "100%", width: `${progress}%`, background: `linear-gradient(90deg, ${TEST_CONFIG.accentColor}, ${TEST_CONFIG.secondaryColor})`,
              transition: "width 0.5s cubic-bezier(.4,0,.2,1)" }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 24px" }}>
            <span style={{ fontSize: 13, color: "#999", fontFamily: "'DM Mono', monospace" }}>
              {currentQ + 1} / {questions.length}
            </span>
            <span style={{ fontSize: 12, color: dim.color, fontWeight: 600, background: dim.colorLight, padding: "4px 12px", borderRadius: 20 }}>
              {dim.icon} {dim.name} ({dimAnswered}/{dimTotal})
            </span>
          </div>
        </div>

        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "32px 24px" }}>
          <div style={{ maxWidth: 560, width: "100%", opacity: animating ? 0.3 : 1, transform: animating ? "translateY(8px)" : "translateY(0)",
            transition: "all 0.3s ease" }}>
            <p style={{ fontSize: 22, fontWeight: 500, color: "#2D2D2D", lineHeight: 1.5, textAlign: "center", marginBottom: 48,
              fontFamily: "'DM Serif Display', serif" }}>
              \u201e{q.text}\u201c
            </p>

            <div style={{ marginBottom: 20 }}>
              <input type="range" min={1} max={7} step={1} value={sliderVal ?? 4}
                onChange={e => handleSliderChange(e.target.value)}
                style={{ width: "100%", height: 8, appearance: "none", background: `linear-gradient(90deg, #ddd ${(((sliderVal ?? 4) - 1) / 6) * 100}%, #f0ede8 ${(((sliderVal ?? 4) - 1) / 6) * 100}%)`,
                  borderRadius: 4, outline: "none", cursor: "pointer" }} />
              <style>{`
                input[type=range]::-webkit-slider-thumb {
                  appearance: none; width: 28px; height: 28px; border-radius: 50%;
                  background: ${dim.color}; border: 3px solid #fff;
                  box-shadow: 0 2px 8px rgba(0,0,0,0.2); cursor: pointer;
                }
                input[type=range]::-moz-range-thumb {
                  width: 28px; height: 28px; border-radius: 50%;
                  background: ${dim.color}; border: 3px solid #fff;
                  box-shadow: 0 2px 8px rgba(0,0,0,0.2); cursor: pointer;
                }
              `}</style>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
              {labels.map((l, i) => (
                <div key={i} style={{ textAlign: "center", flex: 1, fontSize: 11,
                  color: sliderTouched && sliderVal === i + 1 ? dim.color : "#bbb",
                  fontWeight: sliderTouched && sliderVal === i + 1 ? 700 : 400, transition: "all 0.2s",
                  transform: sliderTouched && sliderVal === i + 1 ? "scale(1.1)" : "scale(1)" }}>
                  {l}
                </div>
              ))}
            </div>

            <div style={{ textAlign: "center", marginTop: 32 }}>
              {sliderTouched ? (
                <div style={{ display: "inline-block", background: dim.colorLight, border: `2px solid ${dim.color}`,
                  borderRadius: 12, padding: "8px 24px", fontSize: 16, fontWeight: 700, color: dim.color }}>
                  {sliderVal} \u2014 {labels[sliderVal - 1]}
                </div>
              ) : (
                <div style={{ color: "#bbb", fontSize: 14 }}>Posu\u0148 slider pro odpov\u011b\u010f</div>
              )}
            </div>

            <div style={{ textAlign: "center", marginTop: 32, display: "flex", justifyContent: "center", gap: 12 }}>
              {currentQ > 0 && (
                <button onClick={goBack}
                  style={{ background: "transparent", color: "#999", border: "1px solid #ddd", borderRadius: 8,
                    padding: "10px 20px", fontSize: 14, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
                  \u2190 Zp\u011bt
                </button>
              )}
              <button onClick={submitAnswer}
                disabled={!sliderTouched}
                style={{ background: dim.color, color: "#fff", border: "none", borderRadius: 10, padding: "14px 40px",
                  fontSize: 16, fontWeight: 600, cursor: sliderTouched ? "pointer" : "not-allowed",
                  opacity: sliderTouched ? 1 : 0.4,
                  fontFamily: "'DM Sans', sans-serif",
                  boxShadow: `0 4px 12px ${dim.color}44`, transition: "all 0.2s" }}
                onMouseOver={e => { if (sliderTouched) { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = `0 6px 20px ${dim.color}55`; }}}
                onMouseOut={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = `0 4px 12px ${dim.color}44`; }}>
                {currentQ + 1 >= questions.length ? "Dokon\u010dit test \u2713" : "Dal\u0161\u00ed \u2192"}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (phase === "results" && scores) {
    const dims = Object.keys(DIMENSIONS);
    const sorted = [...dims].sort((a, b) => (scores[b] ?? 0) - (scores[a] ?? 0));
    const top = sorted[0];
    const low = sorted[sorted.length - 1];
    const pi = getPracticalImplications(scores);
    const piHTML = getPracticalImplicationsHTML(scores);

    return (
      <div style={{ minHeight: "100vh", background: bg, fontFamily: "'DM Sans', sans-serif", padding: "40px 24px" }}>
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <div style={{ fontSize: 14, color: "#999", letterSpacing: 3, textTransform: "uppercase", marginBottom: 8,
              fontFamily: "'DM Mono', monospace" }}>V\u00fdsledky</div>
            <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 36, color: "#2D2D2D", fontWeight: 400, marginBottom: 8 }}>
              Tv\u016fj {TEST_CONFIG.name} profil
            </h1>
            <p style={{ color: "#999", fontSize: 14 }}>Na z\u00e1klad\u011b {questions.length} odpov\u011bd\u00ed</p>
          </div>

          <div style={{ background: "#fff", borderRadius: 20, padding: 32, marginBottom: 32,
            border: "1px solid #ebe8e2", boxShadow: "0 2px 16px rgba(0,0,0,0.04)" }}>
            <RadarChart scores={scores} dimensions={DIMENSIONS} accentColor={TEST_CONFIG.accentColor} />
          </div>

          <div style={{ background: "#fff", borderRadius: 20, padding: "28px 32px", marginBottom: 32,
            border: "1px solid #ebe8e2", boxShadow: "0 2px 16px rgba(0,0,0,0.04)" }}>
            <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 22, color: "#2D2D2D", fontWeight: 400, marginBottom: 20 }}>
              Rychl\u00fd p\u0159ehled
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
              <div style={{ background: DIMENSIONS[top].colorLight, borderRadius: 12, padding: 16 }}>
                <div style={{ fontSize: 12, color: "#999", marginBottom: 4 }}>Nejsiln\u011bj\u0161\u00ed dimenze</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: DIMENSIONS[top].color }}>
                  {DIMENSIONS[top].icon} {DIMENSIONS[top].name}
                </div>
                <div style={{ fontSize: 24, fontWeight: 800, color: DIMENSIONS[top].color, fontFamily: "'DM Mono', monospace" }}>
                  {Math.round(scores[top])}%
                </div>
              </div>
              <div style={{ background: DIMENSIONS[low].colorLight, borderRadius: 12, padding: 16 }}>
                <div style={{ fontSize: 12, color: "#999", marginBottom: 4 }}>Nejni\u017e\u0161\u00ed dimenze</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: DIMENSIONS[low].color }}>
                  {DIMENSIONS[low].icon} {DIMENSIONS[low].name}
                </div>
                <div style={{ fontSize: 24, fontWeight: 800, color: DIMENSIONS[low].color, fontFamily: "'DM Mono', monospace" }}>
                  {Math.round(scores[low])}%
                </div>
              </div>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {sorted.map(d => (
                <span key={d} style={{ display: "inline-flex", alignItems: "center", gap: 6, background: DIMENSIONS[d].colorLight,
                  border: `1px solid ${DIMENSIONS[d].color}33`, borderRadius: 20, padding: "5px 14px", fontSize: 13, fontWeight: 600, color: DIMENSIONS[d].color }}>
                  {DIMENSIONS[d].icon} {DIMENSIONS[d].name}: {getLevel(scores[d])}
                </span>
              ))}
            </div>
          </div>

          <div style={{ background: "#fff", borderRadius: 20, padding: "28px 32px", marginBottom: 32,
            border: "1px solid #ebe8e2", boxShadow: "0 2px 16px rgba(0,0,0,0.04)" }}>
            <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 22, color: "#2D2D2D", fontWeight: 400, marginBottom: 24 }}>
              Detailn\u00ed profil
            </h2>
            {dims.map(d => <DimensionBar key={d} dimKey={d} score={scores[d]} dimensions={DIMENSIONS} />)}
          </div>

          <div style={{ background: "#fff", borderRadius: 20, padding: "28px 32px", marginBottom: 32,
            border: "1px solid #ebe8e2", boxShadow: "0 2px 16px rgba(0,0,0,0.04)" }}>
            <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 22, color: "#2D2D2D", fontWeight: 400, marginBottom: 20 }}>
              Co to znamen\u00e1 v praxi
            </h2>
            <div style={{ fontSize: 14, color: "#555", lineHeight: 1.75 }}>
              <p style={{ marginBottom: 16 }}>
                <strong>Pracovn\u00ed prost\u0159ed\u00ed:</strong> {scores.O > 60 ? "Vyhovuje ti prost\u0159ed\u00ed, kter\u00e9 podporuje inovaci a experimentov\u00e1n\u00ed. " : "Preferuje\u0161 jasnou strukturu a osv\u011bd\u010den\u00e9 postupy. "}
                {scores.C > 60 ? "Pot\u0159ebuje\u0161 jasn\u00e9 c\u00edle a syst\u00e9m. " : "Flexibiln\u00ed prost\u0159ed\u00ed bez p\u0159\u00edli\u0161n\u00e9 rigidity ti sed\u00ed l\u00e9pe. "}
                {scores.E > 55 ? "T\u00fdmov\u00e1 spolupr\u00e1ce t\u011b energizuje." : "Ocen\u00ed\u0161 prostor pro soust\u0159ed\u011bnou samostatnou pr\u00e1ci."}
              </p>
              <p style={{ marginBottom: 16 }}>
                <strong>Vztahy a komunikace:</strong> {scores.A > 60 ? "Jsi p\u0159irozen\u011b empatick\u00fd a kooperativn\u00ed. " : "Jsi p\u0159\u00edm\u00fd a neboj\u00ed\u0161 se konstruktivn\u00ed konfrontace. "}
                {scores.N < 40 ? "Pod tlakem z\u016fst\u00e1v\u00e1\u0161 klidn\u00fd, co\u017e je tvoje v\u00fdhoda ve stresov\u00fdch situac\u00edch." : scores.N > 60 ? "Hlubok\u00e9 pro\u017e\u00edv\u00e1n\u00ed ti d\u00e1v\u00e1 emo\u010dn\u00ed inteligenci, ale vy\u017eaduje aktivn\u00ed pr\u00e1ci se stresem." : "Emocion\u00e1ln\u011b jsi vyv\u00e1\u017een\u00fd s p\u0159im\u011b\u0159enou citlivost\u00ed."}
              </p>
              <p>
                <strong>Rozvoj:</strong> Zam\u011b\u0159 se na {scores[low] < 40 ? `pos\u00edlen\u00ed oblasti \u201e${DIMENSIONS[low].name}\u201c \u2014 ` : ""}
                vyrovn\u00e1n\u00ed profilu tam, kde je to pro tv\u00e9 c\u00edle relevantn\u00ed. N\u00edzk\u00e9 sk\u00f3re nen\u00ed slabina \u2014 m\u016f\u017ee b\u00fdt tv\u00fdm stylem.
              </p>
            </div>
          </div>

          <ExportPanel testConfig={TEST_CONFIG} dimensions={DIMENSIONS} scores={scores}
            practicalImplications={pi} />

          <div style={{ textAlign: "center", marginBottom: 32, padding: "20px 24px", background: "#f8f6f1", borderRadius: 16 }}>
            <p style={{ fontSize: 12, color: "#aaa", lineHeight: 1.6 }}>
              \u26a0\ufe0f Orienta\u010dn\u00ed self-assessment na z\u00e1klad\u011b 40 ot\u00e1zek. V\u00fdsledky slou\u017e\u00ed k sebereflexi \u2014
              nenahrazuje standardizovan\u00fd psychologick\u00fd test.
            </p>
          </div>

          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <button onClick={() => { setPhase("intro"); setScores(null); }}
              style={{ background: "transparent", color: "#999", border: "1px solid #ddd", borderRadius: 10, padding: "12px 32px",
                fontSize: 14, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", transition: "all 0.2s" }}
              onMouseOver={e => { e.currentTarget.style.borderColor = TEST_CONFIG.accentColor; e.currentTarget.style.color = TEST_CONFIG.accentColor; }}
              onMouseOut={e => { e.currentTarget.style.borderColor = "#ddd"; e.currentTarget.style.color = "#999"; }}>
              \u21ba Zopakovat test
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
