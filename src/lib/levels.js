export const getLevel = (s) =>
  s >= 75 ? "Velmi vysoká" : s >= 55 ? "Vyšší" : s >= 45 ? "Střední" : s >= 25 ? "Nižší" : "Velmi nízká";

export const getLevelEng = (s) =>
  s >= 75 ? "Very High" : s >= 55 ? "High" : s >= 45 ? "Medium" : s >= 25 ? "Low" : "Very Low";

export const getBar = (s) => {
  const filled = Math.round(s / 10);
  return "█".repeat(filled) + "░".repeat(10 - filled);
};
