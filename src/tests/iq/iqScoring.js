export const getLevel = (s) => s >= 75 ? "Výrazně nadprůměrný" : s >= 55 ? "Nadprůměrný" : s >= 45 ? "Průměrný" : s >= 25 ? "Podprůměrný" : "Výrazně podprůměrný";
export const getLevelEng = (s) => s >= 75 ? "Well Above Average" : s >= 55 ? "Above Average" : s >= 45 ? "Average" : s >= 25 ? "Below Average" : "Well Below Average";
export const getLevelColor = (s) => s >= 75 ? "#2D6A9F" : s >= 55 ? "#5BA4D9" : s >= 45 ? "#E8A838" : s >= 25 ? "#D97B5B" : "#C44E3F";
export const getBar = (s) => "\u2588".repeat(Math.round(s / 10)) + "\u2591".repeat(10 - Math.round(s / 10));

export function calculateIqScores(allAnswers, allTasks) {
  const result = {};
  ["LOGIC", "VERBAL", "NUMERICAL", "SPATIAL", "MEMORY"].forEach(dim => {
    const tasks = allTasks[dim];
    let weighted = 0, maxW = 0;
    tasks.forEach((t, i) => {
      const w = t.difficulty || 1;
      maxW += w;
      const key = `${dim}-${i}`;
      if (allAnswers[key] && allAnswers[key].answer === t.correct) weighted += w;
    });
    result[dim] = maxW > 0 ? (weighted / maxW) * 100 : 0;
  });
  const sr = allAnswers.SPEED_RESULT;
  if (sr) {
    const accuracy = sr.total > 0 ? sr.correct / sr.total : 0;
    const completion = sr.total / sr.items;
    result.SPEED = accuracy * completion * 100;
  } else {
    result.SPEED = 0;
  }
  return result;
}
