import { SCALE_ITEMS, SCENARIOS, FORCED_CHOICE_PAIRS, DIMENSIONS } from './careerData';

const DIM_KEYS = Object.keys(DIMENSIONS);

export function calculateScaleScores(likertAnswers, scaleItems = SCALE_ITEMS) {
  const sums = {};
  const counts = {};
  DIM_KEYS.forEach(d => {
    sums[d] = 0;
    counts[d] = 0;
  });

  for (const item of scaleItems) {
    const raw = likertAnswers[item.id];
    if (raw == null || raw < 1 || raw > 7) continue;
    const base = (raw - 1) / 6;
    const value = item.reverse ? 1 - base : base;
    sums[item.dim] += value;
    counts[item.dim] += 1;
  }

  const out = {};
  for (const d of DIM_KEYS) {
    if (counts[d] > 0) out[d] = (sums[d] / counts[d]) * 100;
  }
  return out;
}

/** scenarioAnswers: { [scenarioId]: optionIndex } */
export function calculateScenarioScores(scenarioAnswers, scenarios = SCENARIOS) {
  const scenarioMax = {};
  DIM_KEYS.forEach(d => {
    scenarioMax[d] = 0;
  });

  for (const sc of scenarios) {
    for (const d of DIM_KEYS) {
      let maxD = 0;
      for (const opt of sc.options) {
        const v = opt.scores?.[d];
        if (typeof v === 'number' && v > maxD) maxD = v;
      }
      scenarioMax[d] += maxD;
    }
  }

  const actualSum = {};
  DIM_KEYS.forEach(d => {
    actualSum[d] = 0;
  });

  for (const sc of scenarios) {
    const idx = scenarioAnswers[sc.id];
    if (idx == null || idx < 0 || idx >= sc.options.length) continue;
    const opt = sc.options[idx];
    if (!opt.scores) continue;
    for (const [d, v] of Object.entries(opt.scores)) {
      if (actualSum[d] !== undefined) actualSum[d] += v;
    }
  }

  const out = {};
  for (const d of DIM_KEYS) {
    const max = scenarioMax[d];
    out[d] = max > 0 ? (actualSum[d] / max) * 100 : 50;
  }
  return out;
}

/** fcAnswers: { [pairId]: 'A' | 'B' } */
export function calculateForcedChoiceScores(fcAnswers, pairs = FORCED_CHOICE_PAIRS) {
  const timesChosen = {};
  const totalPairs = {};
  DIM_KEYS.forEach(d => {
    timesChosen[d] = 0;
    totalPairs[d] = 0;
  });

  for (const p of pairs) {
    const dimA = p.optionA.dim;
    const dimB = p.optionB.dim;
    if (totalPairs[dimA] !== undefined) totalPairs[dimA] += 1;
    if (totalPairs[dimB] !== undefined) totalPairs[dimB] += 1;
    const choice = fcAnswers[p.id];
    if (choice === 'A') {
      if (timesChosen[dimA] !== undefined) timesChosen[dimA] += 1;
    } else if (choice === 'B') {
      if (timesChosen[dimB] !== undefined) timesChosen[dimB] += 1;
    }
  }

  const out = {};
  for (const d of DIM_KEYS) {
    const t = totalPairs[d];
    out[d] = t > 0 ? (timesChosen[d] / t) * 100 : 50;
  }
  return out;
}

export function calculateCareerScores(likertAnswers, scenarioAnswers, fcAnswers) {
  const likert = calculateScaleScores(likertAnswers);
  const scenario = calculateScenarioScores(scenarioAnswers);
  const fc = calculateForcedChoiceScores(fcAnswers);

  const merged = {};
  for (const d of DIM_KEYS) {
    const l = likert[d] ?? 50;
    const s = scenario[d] ?? 50;
    const f = fc[d] ?? 50;
    merged[d] = l * 0.6 + s * 0.2 + f * 0.2;
  }
  return merged;
}

/**
 * Top orientations: score > avg + 8, max 3. flatProfile if none qualify.
 */
export function identifyTopOrientations(scores) {
  const vals = DIM_KEYS.map(d => scores[d] ?? 0);
  const avg = vals.reduce((a, b) => a + b, 0) / DIM_KEYS.length;
  const above = DIM_KEYS.filter(d => (scores[d] ?? 0) > avg + 8)
    .sort((a, b) => (scores[b] ?? 0) - (scores[a] ?? 0))
    .slice(0, 3);
  const flatProfile = above.length === 0;
  return { topDims: above, personalAverage: avg, flatProfile };
}

/** Low attraction: score < avg - 8 */
export function identifyLowDimensions(scores, personalAverage) {
  return DIM_KEYS.filter(d => (scores[d] ?? 0) < personalAverage - 8).sort(
    (a, b) => (scores[a] ?? 0) - (scores[b] ?? 0)
  );
}
