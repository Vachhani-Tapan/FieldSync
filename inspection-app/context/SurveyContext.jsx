import React, { createContext, useContext, useState, useCallback, useRef } from 'react';

const SurveyContext = createContext(null);

const INITIAL_SURVEYS = [
  { id: 'SRV-1042', siteName: 'Sector 5 Complex', clientName: 'Municipal Corp', location: 'Kolkata', description: 'Routine structural inspection', priority: 'Medium', date: '2026-07-15', status: 'Completed' },
  { id: 'SRV-1043', siteName: 'Lake View Block B', clientName: 'Urban Dev Ltd', location: 'Salt Lake', description: 'Water damage assessment', priority: 'High', date: '2026-07-16', status: 'In Progress' },
  { id: 'SRV-1044', siteName: 'Highway 12 Overpass', clientName: 'NHAI', location: 'Rajarhat', description: 'Crack pattern analysis on pillars', priority: 'Critical', date: '2026-07-17', status: 'Flagged' },
];

export function SurveyProvider({ children }) {
  const [surveys, setSurveys] = useState(INITIAL_SURVEYS);
  const nextIdRef = useRef(1045);

  const addSurvey = useCallback((survey) => {
    const id = nextIdRef.current;
    nextIdRef.current += 1;
    const newSurvey = {
      ...survey,
      id: `SRV-${id}`,
      status: 'Pending',
    };
    setSurveys((prev) => [newSurvey, ...prev]);
    return newSurvey;
  }, []);

  const updateSurvey = useCallback((id, updates) => {
    setSurveys((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updates } : s))
    );
  }, []);

  const submitSurvey = useCallback((id) => {
    setSurveys((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: 'Completed' } : s))
    );
  }, []);

  const deleteSurvey = useCallback((id) => {
    setSurveys((prev) => prev.filter((s) => s.id !== id));
  }, []);

  const stats = {
    total: surveys.length,
    completed: surveys.filter((s) => s.status === 'Completed').length,
    pending: surveys.filter((s) => s.status === 'Pending').length,
    flagged: surveys.filter((s) => s.status === 'Flagged').length,
  };

  return (
    <SurveyContext.Provider value={{ surveys, addSurvey, updateSurvey, submitSurvey, deleteSurvey, stats }}>
      {children}
    </SurveyContext.Provider>
  );
}

export function useSurveys() {
  const ctx = useContext(SurveyContext);
  if (!ctx) throw new Error('useSurveys must be used within SurveyProvider');
  return ctx;
}
