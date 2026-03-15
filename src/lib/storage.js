const STORAGE_KEY = 'ai-assessment-results';

export function saveResults(testId, data) {
  const existing = loadAllResults();
  existing[testId] = { ...data, savedAt: new Date().toISOString() };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
}

export function loadResults(testId) {
  const all = loadAllResults();
  return all[testId] || null;
}

export function loadAllResults() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function clearResults(testId) {
  if (testId) {
    const all = loadAllResults();
    delete all[testId];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  } else {
    localStorage.removeItem(STORAGE_KEY);
  }
}
