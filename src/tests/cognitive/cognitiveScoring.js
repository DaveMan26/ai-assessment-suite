import { DIMENSIONS, SCALE_ITEMS, SCENARIOS } from './cognitiveData';

function clamp01(x) {
  if (Number.isNaN(x) || x == null) return 0;
  return Math.min(1, Math.max(0, x));
}

function clamp100(x) {
  if (Number.isNaN(x) || x == null) return 50;
  return Math.min(100, Math.max(0, x));
}

export function calculateLikertBipolarScores(likertAnswersById, scaleItems = SCALE_ITEMS) {
  const sums = {};
  const counts = {};
  scaleItems.forEach((it) => {
    const raw = likertAnswersById?.[it.id];
    if (raw == null) return;
    const base = clamp01((Number(raw) - 1) / 6);
    const v = it.reverse ? 1 - base : base;
    const dim = it.dim;
    sums[dim] = (sums[dim] || 0) + v;
    counts[dim] = (counts[dim] || 0) + 1;
  });

  const out = {};
  Object.keys(DIMENSIONS).forEach((dim) => {
    if (!counts[dim]) return;
    out[dim] = clamp100((sums[dim] / counts[dim]) * 100);
  });
  return out;
}

export function calculateGradedScenarioScores(scenarioAnswersById, scenarios = SCENARIOS) {
  const sums = {};
  const counts = {};

  scenarios.forEach((sc) => {
    const selectedIndex = scenarioAnswersById?.[sc.id];
    if (selectedIndex == null) return;
    const opt = sc.options?.[selectedIndex];
    const score = opt?.score;
    if (score == null) return;
    const v = clamp01(Number(score));
    const dim = sc.dim;
    sums[dim] = (sums[dim] || 0) + v;
    counts[dim] = (counts[dim] || 0) + 1;
  });

  const out = {};
  Object.keys(DIMENSIONS).forEach((dim) => {
    if (!counts[dim]) return;
    out[dim] = clamp100((sums[dim] / counts[dim]) * 100);
  });
  return out;
}

export function calculateCognitiveScores(likertAnswersById, scenarioAnswersById) {
  const likert = calculateLikertBipolarScores(likertAnswersById);
  const scenario = calculateGradedScenarioScores(scenarioAnswersById);
  const merged = {};

  Object.keys(DIMENSIONS).forEach((dim) => {
    const l = likert?.[dim] ?? 50;
    const s = scenario?.[dim] ?? 50;
    merged[dim] = clamp100(l * 0.7 + s * 0.3);
  });

  return merged;
}

export function interpretBipolar(score) {
  const s = clamp100(Number(score));
  if (s < 20) return { band: 'A_strong', label: 'Výrazně pól A' };
  if (s < 35) return { band: 'A_mild', label: 'Mírně pól A' };
  if (s <= 65) return { band: 'balanced', label: 'Vyvážený' };
  if (s <= 80) return { band: 'B_mild', label: 'Mírně pól B' };
  return { band: 'B_strong', label: 'Výrazně pól B' };
}

export function getInterpretationTextForDimension(dimKey, score) {
  const dim = DIMENSIONS?.[dimKey];
  const { band } = interpretBipolar(score);
  if (!dim) return '';
  if (band === 'balanced') return dim.balancedDesc || '';
  if (band === 'A_strong' || band === 'A_mild') return dim.poleA?.desc || '';
  return dim.poleB?.desc || '';
}

