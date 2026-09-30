'use client';

import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';
import Icon from './InterfaceIcon';
import ZoneModal from './ZoneModal';
import { zones } from './scene/scene-data';

const CityScene = dynamic(() => import('./scene/CityScene'), { ssr: false, loading: () => <div className="scene-fallback" role="status">Menyiapkan kota pembelajaran…</div> });

export default function MapExplorer({ exploredZones, onSelect, activeZone, onClose, answers, onAnswer, onReset }) {
  const container = useRef();
  const toggle = useRef();
  const [mode, setMode] = useState(null);
  const [pending, setPending] = useState(false);
  const [notice, setNotice] = useState('');
  const [resetKey, setResetKey] = useState(0);
  const expanded = mode !== null;

  useEffect(() => {
    const sync = () => {
      if (document.fullscreenElement === container.current) setMode('native');
      else setMode((current) => current === 'native' ? null : current);
    };
    document.addEventListener('fullscreenchange', sync);
    return () => document.removeEventListener('fullscreenchange', sync);
  }, []);

  useEffect(() => {
    if (!expanded) return;
    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const hidden = [];
    // Inert only sibling branches: the scene and its nested learning dialog remain usable.
    const containerElement = container.current;
    let branch = containerElement;
    while (branch && branch !== document.body) {
      for (const sibling of branch.parentElement?.children || []) {
        if (sibling !== branch) {
          const hadInert = sibling.hasAttribute('inert');
          hidden.push([sibling, hadInert]);
          sibling.setAttribute('inert', '');
        }
      }
      branch = branch.parentElement;
    }
    const button = toggle.current;
    button?.focus({ preventScroll: true });
    const keys = (event) => {
      if (container.current.querySelector('dialog[open]')) return;
      if (event.key === 'Escape' && mode === 'fallback') { event.preventDefault(); setMode(null); }
      if (event.key === 'Tab') {
        const items = [...container.current.querySelectorAll('button:not(:disabled), a[href], [tabindex="0"]')].filter((el) => el.getClientRects().length && !el.closest('dialog:not([open])'));
        const first = items[0], last = items[items.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
      }
    };
    document.addEventListener('keydown', keys);
    return () => {
      document.body.style.overflow = oldOverflow;
      hidden.forEach(([element, hadInert]) => {
        if (!hadInert) element.removeAttribute('inert');
      });
      document.removeEventListener('keydown', keys);
      button?.focus({ preventScroll: true });
    };
  }, [expanded, mode]);

  const toggleFullscreen = async () => {
    if (pending) return;
    setPending(true); setNotice('');
    try {
      if (document.fullscreenElement === container.current) await document.exitFullscreen();
      else if (expanded) setMode(null);
      else if (container.current.requestFullscreen && document.fullscreenEnabled) {
        try { await container.current.requestFullscreen(); }
        catch { setMode('fallback'); setNotice('Peta diperluas di dalam jendela browser.'); }
      } else { setMode('fallback'); setNotice('Peta diperluas di dalam jendela browser.'); }
    } catch { setNotice('Gunakan tombol Esc atau kontrol browser untuk keluar dari layar penuh.'); }
    finally { setPending(false); }
  };

  return <div ref={container} className={`map-card ${expanded ? 'map-expanded' : ''}`} data-fullscreen-mode={mode || 'inline'} role={mode === 'fallback' ? 'dialog' : undefined} aria-modal={mode === 'fallback' ? true : undefined} aria-label={expanded ? 'Peta kota layar penuh' : 'Peta kota'}>
    <div className="map-toolbar"><span><span className="online-dot" /> Future AI City</span><div className="map-actions"><button onClick={() => setResetKey((key) => key + 1)} aria-label="Atur ulang sudut pandang"><Icon name="compass" size={16} /><span>Atur ulang</span></button><button ref={toggle} onClick={toggleFullscreen} disabled={pending} aria-label={expanded ? 'Keluar layar penuh' : 'Buka layar penuh'} aria-pressed={expanded}><Icon name={expanded ? 'minimize' : 'maximize'} size={16} /><span>{expanded ? 'Keluar' : 'Layar penuh'}</span></button></div></div>
    {notice && <p className="fullscreen-notice" role="status">{notice}</p>}
    <div className="city-map scene-shell"><CityScene exploredZones={exploredZones} onSelect={onSelect} resetKey={resetKey} /><div className="map-caption">Geser untuk memutar <span>·</span> Klik objek untuk membuka pelajaran{expanded && ' · Esc untuk kembali'}</div></div>
    <div className="map-legend">{zones.map((zone) => expanded ? <button key={zone.id} onClick={() => onSelect(zone)} aria-label={`Buka zona ${zone.label}`}><i style={{ background: zone.color }} />{zone.label}{exploredZones.includes(zone.id) && ' ✓'}</button> : <span key={zone.id}><i style={{ background: zone.color }} />{zone.label}</span>)}</div>
    {activeZone && <ZoneModal key={activeZone.id} zone={activeZone} onClose={onClose} answers={answers} onAnswer={onAnswer} onReset={onReset} />}
  </div>;
}
