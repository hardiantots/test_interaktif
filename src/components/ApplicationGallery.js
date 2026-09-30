import Image from 'next/image';
import { useState } from 'react';
import { applications } from './scene/zone-extras';

export default function ApplicationGallery({ zone }) {
  const [activeIndex, setActiveIndex] = useState(0);

  const items = applications[zone.id];
  const activeItem = items[activeIndex];

  const move = (offset) => setActiveIndex((index) => (index + offset + items.length) % items.length);
  const handleKeyDown = (event) => {
    if (event.key === 'ArrowLeft') { event.preventDefault(); move(-1); }
    if (event.key === 'ArrowRight') { event.preventDefault(); move(1); }
  };

  return <section className="application-gallery" aria-label={`Ilustrasi penerapan ${zone.label}`}>
    <h3>Penerapannya dalam keseharian</h3><p className="gallery-note">Ilustrasi konsep buatan untuk belajar, bukan foto kejadian nyata. Pilih salah satu dari tiga ilustrasi untuk melihat contoh penerapan.</p>
    <div className="application-carousel" tabIndex="0" onKeyDown={handleKeyDown}>
      <div className="carousel-media"><Image src={`/illustrations/${activeItem[0]}.svg`} width={720} height={460} alt={activeItem[3]} unoptimized /><button className="carousel-arrow previous" onClick={() => move(-1)} aria-label="Ilustrasi sebelumnya">‹</button><button className="carousel-arrow next" onClick={() => move(1)} aria-label="Ilustrasi berikutnya">›</button></div>
      <div className="carousel-copy"><span className="carousel-count">{activeIndex + 1} / {items.length}</span><h4>{activeItem[1]}</h4><p>{activeItem[2]}</p><a href={zone.learning.sources[activeItem[4]].url} target="_blank" rel="noopener noreferrer">Rujukan konsep ↗</a></div>
      <div className="carousel-dots" role="group" aria-label="Pilih ilustrasi">{items.map((item, index) => <button key={item[0]} aria-pressed={activeIndex === index} className={activeIndex === index ? 'active' : ''} onClick={() => setActiveIndex(index)} aria-label={`Ilustrasi ${index + 1}: ${item[1]}`}>{index + 1}<span>{item[1]}</span></button>)}</div>
    </div>
  </section>;
}
