import { useRef, useState } from 'react';
import { extraQuestions } from './scene/zone-extras';

export function questionsFor(zone) {
  return [{ ...zone.learning.quiz, source: zone.id === 'transport' ? 1 : 0 }, ...extraQuestions[zone.id]];
}

export default function ZoneQuiz({ zone, answers, onAnswer, onReset }) {
  const questions = questionsFor(zone);
  const [index, setIndex] = useState(() => Math.max(0, questions.findIndex((_, i) => answers[i] === undefined)));
  const heading = useRef();
  const question = questions[index];
  const answer = answers[index];
  const answered = answer !== undefined;
  const complete = answers.filter((value) => value !== undefined).length === questions.length;
  const score = questions.filter((item, i) => answers[i] === item.correct).length;
  const move = (next) => { setIndex(next); heading.current?.focus(); };
  return <section className="quiz-workspace" aria-label={`Latihan ${zone.label}`}>
    <div className="quiz-topline"><span>Latihan {zone.label}</span><span>{answers.filter((v) => v !== undefined).length}/7 dijawab</span></div>
    <div className="quiz-dots" aria-label="Navigasi soal">{questions.map((item, i) => <button key={item.question} onClick={() => move(i)} aria-label={`Soal ${i + 1}${answers[i] !== undefined ? ', sudah dijawab' : ''}`} aria-current={index === i ? 'step' : undefined} className={answers[i] !== undefined ? 'answered' : ''}>{i + 1}</button>)}</div>
    <fieldset className="knowledge-check">
      <legend ref={heading} tabIndex={-1}>Soal {index + 1} dari 7</legend><p className="quiz-question">{question.question}</p>
      <p className="quiz-instruction">Pilih satu jawaban. Pilihan dicatat sekali untuk setiap percobaan.</p>
      <div className="quiz-options">{question.options.map((option, i) => <button key={option} type="button" disabled={answered} aria-pressed={answer === i} className={answered && i === question.correct ? 'correct-answer' : answer === i ? 'incorrect-answer' : ''} onClick={() => onAnswer(index, i)}><span className="option-letter">{String.fromCharCode(65 + i)}</span><span>{option}</span></button>)}</div>
      {answered && <div className={`quiz-feedback ${answer === question.correct ? '' : 'needs-review'}`} role="status"><strong>{answer === question.correct ? 'Tepat.' : 'Belum tepat. Mari pelajari alasannya.'}</strong><p>{question.explanation}</p><p><b>Jawaban yang tepat:</b> {question.options[question.correct]}</p><a href={zone.learning.sources[question.source].url} target="_blank" rel="noopener noreferrer">Pelajari sumber pembahasan ↗</a></div>}
    </fieldset>
    <div className="quiz-navigation"><button disabled={index === 0} onClick={() => move(index - 1)}>← Sebelumnya</button><button disabled={!answered || index === questions.length - 1} onClick={() => move(index + 1)}>Soal berikutnya →</button></div>
    {complete && <div className="quiz-result" role="status"><span className="eyebrow">LATIHAN SELESAI</span><h3>{score} dari 7 jawaban tepat</h3><p>{score === 7 ? 'Semua konsep pada latihan ini terjawab tepat. Coba jelaskan alasannya dengan kata-katamu sendiri.' : 'Gunakan nomor soal untuk meninjau pembahasan, lalu coba kembali setelah membaca materi.'}</p><button onClick={() => { onReset(); move(0); }}>Ulangi 7 soal</button></div>}
    <p className="quiz-session-note">Jawaban tersimpan di browser perangkat ini, termasuk setelah memuat ulang halaman. Gunakan perangkat pribadi untuk menjaga progresmu.</p>
  </section>;
}
