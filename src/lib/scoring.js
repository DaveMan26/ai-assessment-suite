/**
 * Spočítá skóre škálových položek per dimenze.
 * @param {Object} answers - { questionId: value (1-7) }
 * @param {Array} items - SCALE_ITEMS array
 * @returns {Object} - { DIM_KEY: percentile (0-100) }
 */
export function calculateScaleScores(answers, items) {
  const sums = {};
  const counts = {};
  items.forEach(item => {
    const raw = answers[item.id];
    if (raw == null) return;
    const base = (raw - 1) / 6;
    const val = item.reverse ? (1 - base) : base;
    sums[item.dim] = (sums[item.dim] || 0) + val;
    counts[item.dim] = (counts[item.dim] || 0) + 1;
  });
  const scores = {};
  Object.keys(sums).forEach(dim => {
    scores[dim] = (sums[dim] / counts[dim]) * 100;
  });
  return scores;
}

/**
 * Spočítá skóre scénářů per dimenze.
 * Normalizuje vůči maximu dosažitelnému.
 */
export function calculateScenarioScores(selectedOptions, scenarios) {
  const sums = {};
  const maxes = {};
  scenarios.forEach((sc, i) => {
    const selected = selectedOptions[i];
    if (selected == null) return;
    const option = sc.options[selected];
    Object.entries(option.scores).forEach(([dim, val]) => {
      sums[dim] = (sums[dim] || 0) + val;
    });
    const dimMaxes = {};
    sc.options.forEach(opt => {
      Object.entries(opt.scores).forEach(([dim, val]) => {
        dimMaxes[dim] = Math.max(dimMaxes[dim] || 0, val);
      });
    });
    Object.entries(dimMaxes).forEach(([dim, max]) => {
      maxes[dim] = (maxes[dim] || 0) + max;
    });
  });
  const scores = {};
  Object.keys(sums).forEach(dim => {
    scores[dim] = maxes[dim] > 0 ? (sums[dim] / maxes[dim]) * 100 : 0;
  });
  return scores;
}

/**
 * Sloučí škálové a scénářové skóre.
 * @param {number} scaleWeight - default 0.7
 * @param {number} scenarioWeight - default 0.3
 */
export function mergeScores(scaleScores, scenarioScores, scaleWeight = 0.7, scenarioWeight = 0.3) {
  const merged = {};
  const allDims = new Set([...Object.keys(scaleScores), ...Object.keys(scenarioScores)]);
  allDims.forEach(dim => {
    const s = scaleScores[dim];
    const sc = scenarioScores[dim];
    if (s != null && sc != null) {
      merged[dim] = s * scaleWeight + sc * scenarioWeight;
    } else if (s != null) {
      merged[dim] = s;
    } else if (sc != null) {
      merged[dim] = sc;
    }
  });
  return merged;
}
