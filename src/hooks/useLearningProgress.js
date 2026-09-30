'use client';
import { useEffect, useRef, useState } from 'react';
const STORAGE_KEY = 'future-ai-city:learning-progress:v1';
const ids = ['health', 'transport', 'industry', 'education'];
const empty = () => ({ exploredZones: [], quizAnswers: {}, ethics: { biasFree: false, attributed: false, aiLabeled: false }, zoneClicks: {}, lastVisitedAt: null });
function normalize(value) {
  const clean = empty();
  if (!value || typeof value !== 'object') return clean;
  clean.exploredZones = ids.filter(id => value.exploredZones?.includes?.(id));
  for (const id of ids) {
    // JSON serializes unanswered array slots as null: restore them to undefined.
    clean.quizAnswers[id] = Array.isArray(value.quizAnswers?.[id]) ? Array.from(value.quizAnswers[id].slice(0, 7), v => Number.isInteger(v) && v >= 0 && v <= 2 ? v : undefined) : [];
    clean.zoneClicks[id] = Number.isSafeInteger(value.zoneClicks?.[id]) && value.zoneClicks[id] >= 0 ? value.zoneClicks[id] : 0;
  }
  for (const key of Object.keys(clean.ethics)) clean.ethics[key] = value.ethics?.[key] === true;
  clean.lastVisitedAt = typeof value.lastVisitedAt === 'string' ? value.lastVisitedAt : null;
  return clean;
}
export default function useLearningProgress() {
  const [progress, setProgress] = useState(empty);
  const [hydrated, setHydrated] = useState(false);
  const [storageAvailable, setStorageAvailable] = useState(true);
  const current = useRef(empty());
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      try { current.current = normalize(JSON.parse(localStorage.getItem(STORAGE_KEY))); }
      catch { setStorageAvailable(false); }
      setProgress(current.current); setHydrated(true);
    });
    const sync = event => {
      if (event.key !== STORAGE_KEY && event.key !== null) return;
      try { current.current = normalize(JSON.parse(event.newValue)); setProgress(current.current); } catch { /* Retain valid state. */ }
    };
    window.addEventListener('storage', sync);
    return () => { cancelAnimationFrame(frame); window.removeEventListener('storage', sync); };
  }, []);
  const update = transform => {
    if (!hydrated) return;
    let latest = current.current;
    try { const stored = localStorage.getItem(STORAGE_KEY); if (stored) latest = normalize(JSON.parse(stored)); } catch { /* Session state remains usable. */ }
    const next = transform(latest);
    current.current = next; setProgress(next);
    // Save at the interaction, so a quick refresh does not lose the last answer.
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); setStorageAvailable(true); } catch { setStorageAvailable(false); }
  };
  return { progress, hydrated, storageAvailable,
    markZoneExplored: id => update(p => ({ ...p, exploredZones: [...new Set([...p.exploredZones, id])], zoneClicks: { ...p.zoneClicks, [id]: (p.zoneClicks[id] || 0) + 1 }, lastVisitedAt: new Date().toISOString() })),
    answerQuiz: (id, index, choice) => update(p => {
      const answers = [...(p.quizAnswers[id] || [])];
      if (answers[index] !== undefined) return p;
      answers[index] = choice; return { ...p, quizAnswers: { ...p.quizAnswers, [id]: answers } };
    }),
    resetQuiz: id => update(p => ({ ...p, quizAnswers: { ...p.quizAnswers, [id]: [] } })),
    toggleEthics: key => update(p => ({ ...p, ethics: { ...p.ethics, [key]: !p.ethics[key] } })),
  };
}
