/**
 * Spočítá skóre škálových položek per dimenze.
 * @param {Array} answers - index-based array of values (1-7)
 * @param {Array} questions - ordered questions array (may be shuffled)
 * @param {Object} dimensions - DIMENSIONS object { DIM_KEY: { ... } }
 * @returns {Object} - { DIM_KEY: percentile (0-100) }
 */
export function calculateScaleScores(answers, questions, dimensions) {
  const scores = {};
  Object.keys(dimensions).forEach(dim => {
    const dimQuestions = questions
      .map((q, i) => ({ ...q, idx: i }))
      .filter(q => q.dim === dim);
    const vals = dimQuestions.map(q => {
      const raw = answers[q.idx] || 4;
      return q.reverse ? (8 - raw) : raw;
    });
    if (vals.length === 0) { scores[dim] = 0; return; }
    const avg = vals.reduce((a, b) => a + b, 0) / vals.length;
    scores[dim] = ((avg - 1) / 6) * 100;
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
