"use client";


import { useState } from "react";
import { zones } from "../components/scene/scene-data";
import MapExplorer from "../components/MapExplorer";
import Icon from "../components/InterfaceIcon";

export default function Home() {
  const [quizAnswers, setQuizAnswers] = useState({});
  const [activeZone, setActiveZone] = useState(null);
  const [exploredZones, setExploredZones] = useState([]);
  const [ethics, setEthics] = useState({ biasFree: false, attributed: false, aiLabeled: false });
  const explore = (zone) => {
    setActiveZone(zone);
    setExploredZones((current) => [...new Set([...current, zone.id])]);
  };
  const ethicsComplete = Object.values(ethics).filter(Boolean).length;

  return (
    <div className="city-shell">
      <a className="skip-link" href="#main-content">Langsung ke konten</a>
      <aside className="workspace-sidebar" aria-label="Navigasi ruang belajar">
        <a className="brand-lockup" href="#main-content"><span className="brand-mark"><Icon name="city" size={23} /></span><span>Future AI City<small>Ruang belajar bersama</small></span></a>
        <div className="workspace-label">WORKSPACE</div>
        <nav className="workspace-nav">
          <a className="nav-current" href="#explore"><Icon name="compass" />Jelajahi kota<span className="nav-count">04</span></a>
          <a href="#ethics"><Icon name="shield" />Studio etika</a>
          <a href="#reading"><Icon name="book" />Catatan & sumber</a>
        </nav>
        <div className="sidebar-note"><span className="note-spark">✧</span><p>Rasa ingin tahu adalah<br />awal yang baik.</p><span>Amati. Tanyakan. Pahami.</span></div>
        <div className="sidebar-bottom"><span className="avatar">P</span><div>Penjelajah kota<small>Sesi belajar pribadi</small></div><span className="online-dot" /></div>
      </aside>

      <main className="workspace-main" id="main-content">
        <header className="topbar"><div className="breadcrumb"><Icon name="book" size={17} /><span>Ruang belajar</span><span className="breadcrumb-slash">/</span><strong>Future AI City</strong></div><span className="topbar-status"><span className="online-dot" /> Siap dijelajahi</span></header>
        <div className="page-content">
          <section className="intro-row">
            <span className="page-icon"><Icon name="city" size={36} /></span>
            <p className="eyebrow">SEBUAH PERJALANAN BELAJAR TENTANG AI</p>
            <h1>Kota masa depan.<br /><em>Pelajaran untuk hari ini.</em></h1>
            <p className="intro-description">Kenali bagaimana AI hadir di sekitar kita. Jelajahi kotanya,<br className="desktop-break" /> temukan manfaatnya, dan pikirkan dampaknya bagi manusia.</p>
            <div className="intro-actions"><a className="primary-button" href="#explore">Mulai menjelajah <Icon name="arrow" size={17} /></a><span>4 zona <i /> 28 soal untuk memperdalam pemahaman</span></div>
          </section>

          <section className="learning-callout"><span>✦</span><p><strong>Tidak perlu jadi ahli teknologi.</strong> Mulai dari satu pertanyaan: bagaimana AI bisa membantu, dan apa yang perlu kita jaga?</p></section>

          <section className="exploration-section" id="explore" aria-label="Zona eksplorasi AI">
            <div className="section-heading"><div><Icon name="compass" size={20} /><h2>Peta pembelajaran</h2></div><span>Pilih objek atau daftar zona untuk belajar</span></div>
            <div className="city-grid">
              <MapExplorer exploredZones={exploredZones} onSelect={explore} activeZone={activeZone} onClose={() => setActiveZone(null)} answers={quizAnswers[activeZone?.id] || []}
                onAnswer={(index, choice) => setQuizAnswers((current) => {
                  const previous = current[activeZone.id] || [];
                  if (previous[index] !== undefined) return current;
                  const next = [...previous]; next[index] = choice;
                  return { ...current, [activeZone.id]: next };
                })}
                onReset={() => setQuizAnswers((current) => ({ ...current, [activeZone.id]: [] }))} />
              <aside className="control-panel" aria-label="Daftar zona">
                <div className="panel-heading"><div><p className="eyebrow">PERJALANANMU</p><h3>Selangkah lebih paham.</h3></div><span className="progress-value" aria-live="polite">{exploredZones.length}/4</span></div>
                <div className="progress-track"><span style={{ width: `${exploredZones.length * 25}%` }} /></div><p className="progress-caption">{exploredZones.length === 4 ? 'Semua zona sudah kamu jelajahi. Hebat!' : 'Setiap zona membuka sudut pandang baru.'}</p>
                <div className="zone-list">{zones.map((zone) => <button key={zone.id} className={`zone-row ${activeZone?.id === zone.id ? "selected" : ""}`} onClick={() => explore(zone)}><span className={`zone-icon ${zone.tone}`}><Icon name={zone.id} /></span><span className="zone-row-copy"><b>{zone.label}</b><small>{zone.title}</small></span><span className={`arrow ${exploredZones.includes(zone.id) ? 'visited' : ''}`}><Icon name={exploredZones.includes(zone.id) ? 'check' : 'arrow'} size={16} /></span></button>)}</div>
                <div className="panel-note"><Icon name="book" size={18} /><p>Setiap zona berisi penjelasan, sumber tepercaya, dan 7 soal latihan.</p></div>
              </aside>
            </div>
          </section>

          <div className="notes-grid">
            <section className="ethics-card" id="ethics"><div className="card-topline"><span className="section-kicker"><Icon name="shield" size={18} /> Studio etika</span><span>{ethicsComplete}/3 prinsip diperiksa</span></div><h2>Teknologi yang baik,<br /><em>dimulai dari niat yang baik.</em></h2><p>Sebelum berkarya dengan AI, luangkan waktu untuk memeriksa tiga hal ini.</p><div className="ethics-checks">{[["biasFree", "Bias diperiksa"], ["attributed", "Sumber teratribusi"], ["aiLabeled", "AI diberi label"]].map(([key, label]) => <label className="check-row" key={key}><input type="checkbox" checked={ethics[key]} onChange={() => setEthics((current) => ({ ...current, [key]: !current[key] }))} /><span className="custom-check">{ethics[key] && <Icon name="check" size={14} />}</span>{label}</label>)}</div><details><summary>Apa yang perlu diperiksa?</summary><p>Bias: periksa stereotip dan kelompok yang tidak terwakili. Checklist ini bukan jaminan bebas bias.</p><p>Atribusi: telusuri sumber asli dan izin penggunaan materi. Label AI: jelaskan bagian yang dibuat atau dibantu AI.</p><a href="https://www.unesco.org/en/articles/guidance-generative-ai-education-and-research" target="_blank" rel="noopener noreferrer">Baca panduan UNESCO ↗</a></details></section>
            <section className="reading-card" id="reading"><span className="section-kicker"><Icon name="book" size={18} /> Catatan belajar</span><h2>Rasa penasaran,<br /><em>bertemu sumber tepercaya.</em></h2><p>Materi dirangkum dari jurnal dan lembaga tepercaya. Temukan rujukan lengkap, konteks, dan batas buktinya di setiap zona.</p><div className="source-tags"><span>WHO</span><span>UNESCO</span><span>npj Digital Medicine</span><span>NHTSA</span><span>OSHA</span><span>ILO</span></div><a className="text-link" href="#explore">Buka zona & temukan bacaannya <Icon name="arrow" size={16} /></a></section>
          </div>
          <footer className="footer-bar"><span><Icon name="city" size={16} /> Future AI City</span><span>Dibuat untuk belajar, bertanya, dan memahami.</span><span>Catatan belajar / 01</span></footer>
        </div>

      </main>
    </div>
  );
}
