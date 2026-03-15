import { createContext, useContext, useState, useEffect } from 'react';

const ResultsContext = createContext(null);

const STORAGE_KEY = 'ai-assessment-results';

export function ResultsProvider({ children }) {
  const [results, setResults] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(results));
  }, [results]);

  const saveTestResult = (testId, data) => {
    setResults(prev => ({
      ...prev,
      [testId]: { ...data, savedAt: new Date().toISOString() }
    }));
  };

  const getTestResult = (testId) => results[testId] || null;

  const clearTestResult = (testId) => {
    setResults(prev => {
      const next = { ...prev };
      delete next[testId];
      return next;
    });
  };

  const clearAll = () => setResults({});

  const completedTests = Object.keys(results);

  return (
    <ResultsContext.Provider value={{
      results, saveTestResult, getTestResult, clearTestResult, clearAll, completedTests
    }}>
      {children}
    </ResultsContext.Provider>
  );
}

export function useResults() {
  const ctx = useContext(ResultsContext);
  if (!ctx) throw new Error('useResults must be used within ResultsProvider');
  return ctx;
}
