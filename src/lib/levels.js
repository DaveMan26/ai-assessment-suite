export function getLevel(score) {
  if (score >= 75) return 'Velmi vysoká';
  if (score >= 55) return 'Vyšší';
  if (score >= 45) return 'Střední';
  if (score >= 25) return 'Nižší';
  return 'Velmi nízká';
}

export function getLevelEng(score) {
  if (score >= 75) return 'Very High';
  if (score >= 55) return 'Higher';
  if (score >= 45) return 'Average';
  if (score >= 25) return 'Lower';
  return 'Very Low';
}

export function getBar(score) {
  const filled = Math.round(score / 10);
  return '█'.repeat(filled) + '░'.repeat(10 - filled);
}
