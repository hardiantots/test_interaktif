import { useEffect, useRef, useState } from 'react';
import Icon from './InterfaceIcon';

function Citation({ learning, index }) {
  const source = learning.sources[index];
  return <a className="inline-citation" href={source.url} target="_blank" rel="noopener noreferrer" aria-label={`Baca sumber ${index + 1}: ${source.title}`}>[{index + 1}]</a>;
}

export default function ZoneModal({ zone, onClose }) {
  const dialog = useRef();
  const [answer, setAnswer] = useState(null);
  const learning = zone.learning;
  useEffect(() => {
    const previous = document.activeElement;
    dialog.current.showModal();
    return () => { previous?.focus?.(); };
  }, []);
  return <dialog ref={dialog} className="zone-modal" aria-labelledby="zone-title" onCancel={onClose} onClick={(event) => { if (event.target === event.currentTarget) { const rect = event.currentTarget.getBoundingClientRect(); if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) onClose(); } }}>
    <button className="modal-close" onClick={onClose} aria-label="Tutup detail zona" autoFocus>×</button>
    <span className={`zone-icon large ${zone.tone}`}><Icon name={zone.id} size={27} /></span><p className="eyebrow">Zona {zone.label} / Baca {learning.readTime}</p><h2 id="zone-title">{zone.title}</h2><p>{zone.description} <Citation learning={learning} index={0} /></p>
    <div className="learning-columns"><div className="learning-note"><h3>Manfaat untuk manusia</h3><p>{zone.benefit} <Citation learning={learning} index={0} /></p></div>
    <div className="learning-note"><h3>Risiko & tanggung jawab</h3><p>{zone.risk} <Citation learning={learning} index={zone.id === 'health' ? 1 : 0} /></p></div></div>
    <section className="lesson-section"><h3>Cara kerjanya <Citation learning={learning} index={learning.stepSource} /></h3><ol className="learning-steps">{learning.steps.map((step) => <li key={step}>{step}</li>)}</ol></section>
    <section className="evidence-card"><p className="eyebrow">Apa kata sumber?</p><p>{learning.evidence.text} <Citation learning={learning} index={learning.evidence.source} /></p><h3>Batas yang perlu dipahami</h3><p>{learning.limitation} <Citation learning={learning} index={learning.limitationSource} /></p></section>
    <section className="lesson-section"><h3>Bayangkan situasi ini</h3><span className="scenario-label">Contoh ilustratif, bukan hasil penelitian</span><p>{learning.example}</p></section>
    <section className="lesson-section"><h3>Peran kita</h3><p>{learning.action} <Citation learning={learning} index={learning.actionSource} /></p></section>
    <fieldset className="knowledge-check"><legend>Cek pemahaman</legend><p>{learning.quiz.question}</p>{learning.quiz.options.map((option, index) => <button key={option} type="button" aria-pressed={answer === index} className={answer === index ? 'chosen' : ''} onClick={() => setAnswer(index)}>{option}</button>)}{answer !== null && <div className="quiz-feedback" role="status"><strong>{answer === learning.quiz.correct ? 'Tepat.' : 'Coba pertimbangkan lagi.'}</strong><p>{learning.quiz.explanation}</p></div>}</fieldset>
    <div className="modal-rule" /><strong>{zone.question}</strong>
    <section className="lesson-sources"><h3>Sumber & bacaan lanjutan</h3><p className="source-date">Diperiksa 30 September 2026 · Ringkasan editorial dalam bahasa Indonesia.</p><ol>{learning.sources.map((source) => <li key={source.url}><a href={source.url} target="_blank" rel="noopener noreferrer">{source.title} ↗</a><span>{source.publisher} · {source.year}</span><small>{source.type}</small></li>)}</ol></section>
    <button className="return-to-city" onClick={onClose}>Kembali ke kota ↗</button>
  </dialog>;
}
