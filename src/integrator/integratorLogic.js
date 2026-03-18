import { loadResults } from '../lib/storage';
import { TEST_REGISTRY, CONSISTENCY_RULES } from './integratorData';

const INCONSISTENCY_THRESHOLD = 30;

/** \u0160t\u00E1\u0159\u0161\u00ED ulo\u017Een\u00ED v localStorage p\u0159ed sjednocen\u00EDm ID s TEST_CONFIG */
export const LEGACY_TEST_KEYS = {
  CREATIVE: 'creative',
  STRENGTHS: 'strengths',
  CAREER: 'career',
  COGNITIVE: 'cognitive',
};

export function loadResultForTest(testId) {
  const direct = loadResults(testId);
  if (direct) return direct;
  const leg = LEGACY_TEST_KEYS[testId];
  return leg ? loadResults(leg) : null;
}

export function loadAllResults() {
  const results = {};
  for (const testId of Object.keys(TEST_REGISTRY)) {
    results[testId] = loadResultForTest(testId);
  }
  return results;
}

export function countCompletedIntegratorTests() {
  return Object.keys(TEST_REGISTRY).filter((id) => loadResultForTest(id) != null).length;
}

export function getCompletedTests(allResults) {
  return Object.keys(allResults).filter((id) => allResults[id] != null);
}

export function getAxisScore(allResults, testId, dimKey) {
  const result = allResults[testId];
  if (!result) return null;
  const scores = result.scores != null ? result.scores : result;
  if (typeof scores !== 'object' || scores === null) return null;

  if (dimKey === '_AVG') {
    const vals = Object.values(scores).filter((v) => typeof v === 'number' && !Number.isNaN(v));
    if (!vals.length) return null;
    return vals.reduce((a, b) => a + b, 0) / vals.length;
  }
  const v = scores[dimKey];
  if (v === undefined || v === null || typeof v !== 'number') return null;
  return v;
}

export function normalizeAllScores(allResults) {
  const normalized = [];

  for (const [testId, result] of Object.entries(allResults)) {
    if (!result) continue;
    const testMeta = TEST_REGISTRY[testId];
    if (!testMeta) continue;

    const scores = result.scores != null ? result.scores : result;
    if (typeof scores !== 'object' || scores === null) continue;

    for (const [dimKey, dimMeta] of Object.entries(testMeta.dimensions)) {
      const score = scores[dimKey];
      if (score === undefined || score === null || typeof score !== 'number') continue;

      normalized.push({
        testId,
        dimKey,
        dimName: dimMeta.name,
        dimEng: dimMeta.eng,
        score: Math.round(score),
        type: testMeta.type,
        color: dimMeta.color,
        testShortName: testMeta.shortName,
      });
    }
  }

  return normalized;
}

export function getTopDimensions(normalized, n = 5) {
  return [...normalized]
    .filter((d) => d.type !== 'bipolar')
    .sort((a, b) => b.score - a.score)
    .slice(0, n);
}

export function getBottomDimensions(normalized, n = 5) {
  return [...normalized]
    .filter((d) => d.type !== 'bipolar')
    .sort((a, b) => a.score - b.score)
    .slice(0, n);
}

export function getBipolarInterpretation(score) {
  const s = Number(score);
  if (s <= 20) return '\u0076\u00FDrazn\u011B';
  if (s <= 35) return 'm\u00EDrn\u011B';
  if (s <= 65) return 'vyv\u00E1\u017Een\u00FD';
  if (s <= 80) return 'm\u00EDrn\u011B';
  return '\u0076\u00FDrazn\u011B';
}

function resolveRuleScores(allResults, rule) {
  const resultA = allResults[rule.testA];
  const resultB = allResults[rule.testB];
  if (!resultA || !resultB) return null;

  const scoresA = resultA.scores != null ? resultA.scores : resultA;
  const scoresB = resultB.scores != null ? resultB.scores : resultB;

  let scoreA;
  if (rule.dimA === '_AVG') {
    const vals = Object.values(scoresA).filter((v) => typeof v === 'number');
    if (!vals.length) return null;
    scoreA = vals.reduce((a, b) => a + b, 0) / vals.length;
  } else {
    scoreA = scoresA[rule.dimA];
  }

  let scoreB;
  if (rule.dimB === '_AVG') {
    const vals = Object.values(scoresB).filter((v) => typeof v === 'number');
    if (!vals.length) return null;
    scoreB = vals.reduce((a, b) => a + b, 0) / vals.length;
  } else {
    scoreB = scoresB[rule.dimB];
  }

  if (scoreA === undefined || scoreB === undefined || typeof scoreA !== 'number' || typeof scoreB !== 'number') {
    return null;
  }
  return { scoreA, scoreB };
}

export function checkConsistency(allResults) {
  const findings = [];

  for (const rule of CONSISTENCY_RULES) {
    const resolved = resolveRuleScores(allResults, rule);
    if (!resolved) continue;
    const { scoreA, scoreB } = resolved;

    let isInconsistent = false;
    let detail = '';

    if (rule.relationship === 'positive') {
      const diff = Math.abs(scoreA - scoreB);
      if (diff > INCONSISTENCY_THRESHOLD) {
        isInconsistent = true;
        detail = `Rozd\u00EDl ${Math.round(diff)} bod\u016F (${Math.round(scoreA)} vs. ${Math.round(scoreB)})`;
      }
    } else if (rule.relationship === 'inverse') {
      const sum = scoreA + scoreB;
      if (sum > 130 || sum < 70) {
        isInconsistent = true;
        detail =
          sum > 130
            ? `Ob\u011B hodnoty relativn\u011B vysok\u00E9 (${Math.round(scoreA)} + ${Math.round(scoreB)} = ${Math.round(sum)})`
            : `Ob\u011B hodnoty relativn\u011B n\u00EDzk\u00E9 (${Math.round(scoreA)} + ${Math.round(scoreB)} = ${Math.round(sum)})`;
      }
    } else if (rule.relationship === 'positive_bipolar_high') {
      if (scoreA >= 60 && scoreB <= 35) {
        isInconsistent = true;
        const parts = rule.label.split(' vs. ');
        detail = `Vysok\u00E1 ${parts[0] || 'hodnota'} (${Math.round(scoreA)}), ale n\u00EDzk\u00E1 ${parts[1] || 'flexibilita'} (${Math.round(scoreB)})`;
      }
    }

    if (isInconsistent) {
      findings.push({
        ...rule,
        scoreA: Math.round(scoreA),
        scoreB: Math.round(scoreB),
        detail,
        severity: 'info',
      });
    }
  }

  return findings;
}

function big5Summary(allResults) {
  if (!allResults.BIG5) return null;
  const s = allResults.BIG5.scores || allResults.BIG5;
  const reg = TEST_REGISTRY.BIG5.dimensions;
  const entries = Object.entries(s).filter(([, v]) => typeof v === 'number');
  if (!entries.length) return null;
  const sorted = [...entries].sort((a, b) => b[1] - a[1]);
  const top = sorted[0];
  const low = sorted[sorted.length - 1];
  return (
    `Dominantn\u00ED rys je ${reg[top[0]]?.name || top[0]} (${Math.round(top[1])} %). ` +
    `Nejni\u017E\u0161\u00ED sk\u00F3re m\u00E1\u0161 u ${reg[low[0]]?.name || low[0]} (${Math.round(low[1])} %).`
  );
}

function iqSummary(allResults) {
  if (!allResults.IQ) return null;
  const s = allResults.IQ.scores || allResults.IQ;
  const reg = TEST_REGISTRY.IQ.dimensions;
  const entries = Object.entries(s).filter(([, v]) => typeof v === 'number');
  if (!entries.length) return null;
  const sorted = [...entries].sort((a, b) => b[1] - a[1]);
  const top2 = sorted.slice(0, 2);
  const bot2 = sorted.slice(-2);
  const highStr = top2.map(([k, v]) => `${reg[k]?.name || k} (${Math.round(v)} %)`).join(', ');
  const lowStr = bot2.map(([k, v]) => `${reg[k]?.name || k} (${Math.round(v)} %)`).join(', ');
  return (
    `Nejsiln\u011Bj\u0161\u00ED oblasti: ${highStr}. Oblasti s v\u011Bt\u0161\u00EDm prostorem pro posun: ${lowStr}.`
  );
}

function eqSummary(allResults) {
  if (!allResults.EQ) return null;
  const scores = allResults.EQ.scores || allResults.EQ;
  const reg = TEST_REGISTRY.EQ.dimensions;
  const entries = Object.entries(scores).filter(([, v]) => typeof v === 'number');
  if (!entries.length) return null;
  const sorted = [...entries].sort((a, b) => b[1] - a[1]);
  const top = sorted.slice(0, 2);
  const low = sorted.slice(-2);
  return (
    `Siln\u00E9 str\u00E1nky EQ: ${top.map(([k, v]) => `${reg[k]?.name} (${Math.round(v)} %)`).join(', ')}. ` +
    `Prostor pro rozvoj: ${low.map(([k, v]) => `${reg[k]?.name} (${Math.round(v)} %)`).join(', ')}.`
  );
}

function creativeSummary(allResults) {
  if (!allResults.CREATIVE) return null;
  const scores = allResults.CREATIVE.scores || allResults.CREATIVE;
  const reg = TEST_REGISTRY.CREATIVE.dimensions;
  const entries = Object.entries(scores).filter(([, v]) => typeof v === 'number');
  if (!entries.length) return null;
  const sorted = [...entries].sort((a, b) => b[1] - a[1]);
  const top3 = sorted.slice(0, 3);
  return (
    `Kreativn\u00ED profil: nejv\u00FDrazn\u011Bji se projevuje ${top3.map(([k, v]) => `${reg[k]?.name} (${Math.round(v)} %)`).join(', ')}.`
  );
}

function strengthsSummary(allResults) {
  if (!allResults.STRENGTHS) return null;
  const scores = allResults.STRENGTHS.scores || allResults.STRENGTHS;
  const reg = TEST_REGISTRY.STRENGTHS.dimensions;
  const entries = Object.entries(scores).filter(([, v]) => typeof v === 'number');
  if (!entries.length) return null;
  const sorted = [...entries].sort((a, b) => b[1] - a[1]);
  const top3 = sorted.slice(0, 3);
  return (
    `Signaturn\u00ED siln\u00E9 str\u00E1nky (talentov\u00E9 oblasti): ` +
    `${top3.map(([k, v]) => `${reg[k]?.name} (${Math.round(v)} %)`).join(', ')}.`
  );
}

function careerSummary(allResults) {
  if (!allResults.CAREER) return null;
  const scores = allResults.CAREER.scores || allResults.CAREER;
  const reg = TEST_REGISTRY.CAREER.dimensions;
  const entries = Object.entries(scores).filter(([, v]) => typeof v === 'number');
  if (!entries.length) return null;
  const sorted = [...entries].sort((a, b) => b[1] - a[1]);
  const top3 = sorted.slice(0, 3);
  return (
    `Kari\u00E9rn\u00ED orientace \u2014 nejsiln\u011Bj\u0161\u00ED preference: ` +
    `${top3.map(([k, v]) => `${reg[k]?.name} (${Math.round(v)} %)`).join(', ')}.`
  );
}

function cognitiveSummary(allResults) {
  if (!allResults.COGNITIVE) return null;
  const scores = allResults.COGNITIVE.scores || allResults.COGNITIVE;
  const reg = TEST_REGISTRY.COGNITIVE.dimensions;
  const parts = [];
  for (const [k, meta] of Object.entries(reg)) {
    const v = scores[k];
    if (typeof v !== 'number') continue;
    const lean =
      v < 45
        ? `sp\u00ED\u0161 ${meta.poleA}`
        : v > 55
          ? `sp\u00ED\u0161 ${meta.poleB}`
          : 'vyv\u00E1\u017Een\u011B mezi ob\u011Bma p\u00F3ly';
    parts.push(`${meta.name}: ${lean} (${Math.round(v)} %).`);
  }
  return parts.length ? `Kognitivn\u00ED styl: ${parts.join(' ')}` : null;
}

export function generateContextStatement(allResults, consistencyFindings) {
  const completed = Object.entries(allResults).filter(([, v]) => v != null);
  const n = completed.length;
  const lines = [];

  lines.push('Osobnostn\u00ED a kompeten\u010Dn\u00ED profil');
  lines.push('================================');
  lines.push('');
  lines.push(
    `Tento text shrnuje v\u00FDsledky ${n} dokon\u010Den\u00E9ho/dokon\u010Den\u00FDch self-assessment test\u016F z AI Assessment Suite. ` +
      `Slou\u017E\u00ED jako kontext pro AI n\u00E1stroje \u2014 nejedn\u00E1 se o klinickou diagn\u00F3zu.`,
  );
  lines.push('');

  const b5 = big5Summary(allResults);
  if (b5) {
    lines.push('**Osobnost a temperament (Big Five):**');
    lines.push(b5);
    lines.push('');
  }

  const iq = iqSummary(allResults);
  if (iq) {
    lines.push('**Kognitivn\u00ED schopnosti (IQ dimenze):**');
    lines.push(iq);
    lines.push('');
  }

  const eq = eqSummary(allResults);
  if (eq) {
    lines.push('**Emo\u010Dn\u00ED inteligence:**');
    lines.push(eq);
    lines.push('');
  }

  const cr = creativeSummary(allResults);
  if (cr) {
    lines.push('**Kreativn\u00ED profil:**');
    lines.push(cr);
    lines.push('');
  }

  const st = strengthsSummary(allResults);
  if (st) {
    lines.push('**Signaturn\u00ED siln\u00E9 str\u00E1nky:**');
    lines.push(st);
    lines.push('');
  }

  const ca = careerSummary(allResults);
  if (ca) {
    lines.push('**Kari\u00E9rn\u00ED orientace:**');
    lines.push(ca);
    lines.push('');
  }

  const cg = cognitiveSummary(allResults);
  if (cg) {
    lines.push('**Kognitivn\u00ED styl:**');
    lines.push(cg);
    lines.push('');
  }

  if (n >= 2) {
    lines.push('**Cross-test vzorce:**');
    if (consistencyFindings.length > 0) {
      lines.push(
        `Objevily se zaj\u00EDmav\u00E9 kontrasty mezi testy (nejsou chybou, ale podn\u011Btem k reflexi): ` +
          `${consistencyFindings.map((c) => c.label).join('; ')}.`,
      );
    } else {
      lines.push(
        'V\u00FDsledky jednotliv\u00FDch test\u016F na sebe v kontrolovan\u00FDch p\u00E1rech relativn\u011B navazuj\u00ED \u2014 ' +
          'profil p\u016Fsob\u00ED konzistentn\u011B.',
      );
    }
    lines.push('');
  }

  lines.push('**Celkov\u00E9 shrnut\u00ED:**');
  if (n === 0) {
    lines.push('Zat\u00EDm nejsou k dispozici \u017E\u00E1dn\u00E1 data.');
  } else if (n < 3) {
    lines.push(
      `M\u00E1\u0161 hotovo ${n} test(y) \u2014 pro bohat\u0161\u00ED obraz doporu\u010Dujeme doplnit dal\u0161\u00ED oblasti. ` +
        `Profil u\u017E te\u010F ale d\u00E1v\u00E1 sm\u011Br, kde jsi siln\u00FD/\u00E1 a kde m\u016F\u017Ee\u0161 r\u016Fst.`,
    );
  } else {
    lines.push(
      'Kombinace dokon\u010Den\u00FDch test\u016F vytv\u00E1\u0159\u00ED v\u00EDcevrstv\u00FD obraz: osobnost, p\u0159\u00EDpadn\u011B schopnosti, EQ, kreativita, talenty a kari\u00E9rn\u00ED motivace. ' +
        'Pou\u017Eij tento text jako vstup pro coaching, pl\u00E1nov\u00E1n\u00ED rozvoje nebo konverzaci s AI.',
    );
  }

  return lines.join('\n');
}

export function buildMetaDimensionScores(allResults, axes) {
  const meta = {};
  for (const axis of axes) {
    const sc = getAxisScore(allResults, axis.source.test, axis.source.dim);
    meta[axis.key] =
      sc == null
        ? null
        : { score: Math.round(sc), source_test: axis.source.test, source_dim: axis.source.dim };
  }
  return meta;
}
