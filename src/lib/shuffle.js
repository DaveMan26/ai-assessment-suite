export function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function interleaveQuestionsAndScenarios(scaleItems, scenarios, scalesBetween = 6) {
  const shuffled = shuffleArray(scaleItems);
  if (!scenarios || scenarios.length === 0) return shuffled.map(q => ({ type: 'scale', data: q }));

  const result = [];
  let scaleIdx = 0;
  let scenarioIdx = 0;

  while (scaleIdx < shuffled.length || scenarioIdx < scenarios.length) {
    const batch = Math.min(scalesBetween, shuffled.length - scaleIdx);
    for (let i = 0; i < batch; i++) {
      result.push({ type: 'scale', data: shuffled[scaleIdx++] });
    }
    if (scenarioIdx < scenarios.length) {
      result.push({ type: 'scenario', data: scenarios[scenarioIdx++] });
    }
  }
  return result;
}
