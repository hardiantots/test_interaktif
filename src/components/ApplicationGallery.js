import Image from 'next/image';
import { useState } from 'react';
import { applications } from './scene/zone-extras';

export default function ApplicationGallery({ zone }) {
  const [expanded, setExpanded] = useState(null);
  const items = applications[zone.id];
  return <section className="application-gallery" aria-label={`Ilustrasi penerapan ${zone.label}`}>
    <h3>Penerapannya dalam keseharian</h3><p className="gallery-note">Ilustrasi konsep buatan untuk belajar, bukan foto kejadian nyata. Pilih gambar untuk memperbesar.</p>
    <div className="application-grid">{items.map(([id, title, caption, alt], index) => <figure key={id}><button className="illustration-button" onClick={() => setExpanded(expanded === index ? null : index)} aria-expanded={expanded === index} aria-label={`Perbesar gambar: ${title}`}><Image src={`/illustrations/${id}.svg`} width={360} height={230} alt={alt} unoptimized /></button><figcaption><strong>{title}</strong><p>{caption}</p></figcaption></figure>)}</div>
    {expanded !== null && <div className="image-expanded" role="region" aria-label="Gambar diperbesar"><button className="image-collapse" onClick={() => setExpanded(null)}>Tutup gambar ×</button><Image src={`/illustrations/${items[expanded][0]}.svg`} width={720} height={460} alt={items[expanded][3]} unoptimized /><h4>{items[expanded][1]}</h4><p>{items[expanded][2]}</p><a href={zone.learning.sources[items[expanded][4]].url} target="_blank" rel="noopener noreferrer">Rujukan konsep ↗</a></div>}
  </section>;
}
