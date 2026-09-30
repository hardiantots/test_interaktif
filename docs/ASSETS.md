# Catatan asset dan verifikasi

Tanggal: 2026-09-30. Engine: Three.js + React Three Fiber + Drei. Status semua asset: verified pada Chrome headless (desktop, laptop, emulasi viewport mobile). Jenis: procedural; assetPath: null. Hak penggunaan: original, dibuat untuk proyek ini, tanpa model/media pihak ketiga. Tidak menetapkan lisensi distribusi baru untuk keseluruhan proyek.

Komponen berada di `src/components/scene/assets/ZoneAssets.js` (7.139 byte source gabungan, bukan bundle gzip). Setiap asset memiliki 0 byte GLB/tekstur eksternal. Wrapper ZoneAsset menerima zone, explored, onSelect, onPointerOver, onPointerOut, reducedDetail; progress dikelola HUD.

| Zona / komponen | Triangle normal / reduced | Instance material | Aksen | Screenshot desktop / mobile |
| --- | ---: | ---: | --- | --- |
| Kesehatan / HealthAsset | 1.324 / 812 | 14 | coral, pink | qa/desktop-health.png, qa/mobile-health.png |
| Transportasi / TransportAsset | 1.736 / 1.384 | 26 | mint | qa/desktop-transport.png, qa/mobile-transport.png |
| Industri / IndustryAsset | 952 / 888 | 15 | baby blue | qa/desktop-industry.png, qa/mobile-industry.png |
| Pendidikan / EducationAsset | 940 / 780 | 23 | warm yellow | qa/desktop-education.png, qa/mobile-education.png |

Triangle dihitung dari geometri runtime, termasuk panggung zona. Material adalah jumlah instance, bukan jumlah warna unik. Semua memakai MeshStandardMaterial, roughness 0,85–1, metalness umumnya 0–0,05 dan maksimal 0,3 pada detail industri. Model utama setinggi sekitar 1,6–2,4 unit; label 3,05 unit. Jarak pusat zona terdekat 6,6 unit; skala 1. Panggung terbuka menggantikan paviliun tertutup agar asset terlihat.

MRI: scanner berlubang, meja, monitor, pulse, ring emissive saat hover. Bus: rounded body, empat roda, lidar berputar, lampu, panel rute, marka menyala. Industri: tiga segmen, joint, gripper, panel status, gerak hover. Pendidikan: meja, projector ring, tiga kartu melayang, icosahedron, progress bars. Reduced-motion menghentikan animasi kontinu.

Pohon memakai dua InstancedMesh dengan material/geometri bersama: 16 pohon normal, 8 reduced. Mobile memakai DPR 1, segmen lebih sedikit, tanpa shadow; desktop DPR maksimal 1,5 dan shadow map 1024. PerformanceMonitor menurunkan detail saat FPS turun. Software renderer bukan bukti target 30 FPS pada perangkat siswa.

## Fallback

Keempat asset langsung procedural: tidak ada loader GLB/request aset, sehingga bentuk dasar tersedia saat WebGL bekerja. Error boundary / Canvas fallback menyediakan alternatif eksplorasi melalui City index jika WebGL tidak tersedia. Integrasi GLB kelak perlu loader boundary tersendiri; tidak diklaim sudah diuji.

## Referensi workflow

Referensi untuk organisasi bukti, model yang dapat diedit, dan iterasi pengujian browser. Tidak ada prompt, media, atau model yang disalin. Contoh di bawah hanya referensi, tidak direproduksi. Fidelity mengikuti klaim katalog, bukan verifikasi independen unggahan kreator.

| Kategori / entri | URL sumber katalog | Engine sumber | Status instruksi | Diperiksa | Hak penggunaan / reproduksi |
| --- | --- | --- | --- | --- | --- |
| Blender Scenes / entri 1, furnished room | https://github.com/BeatAPI/awesome-3d-prompts/blob/main/catalog/blender-scenes.md | Blender | creator-stated | 2026-09-30 | Hak kreator; referensi; tidak direproduksi |
| Web 3D / entri 2, interactive courtyard | https://github.com/BeatAPI/awesome-3d-prompts/blob/main/catalog/web-3d.md | Blender + Three.js | exact (katalog: Verbatim) | 2026-09-30 | Hak kreator; referensi; tidak direproduksi |
| Agent Workflows / entri 3, reference-first modeling | https://github.com/BeatAPI/awesome-3d-prompts/blob/main/catalog/3d-workflow.md | Tidak dinyatakan | creator-stated | 2026-09-30 | Hak kreator; referensi; tidak direproduksi |

Kebijakan hak sumber: https://github.com/BeatAPI/awesome-3d-prompts/blob/main/RIGHTS.md. MIT repositori referensi tidak melisensikan ulang media kreator.

## QA

Lint, build Webpack, dan smoke test lulus. `qa/report.json` menyimpan hasil runtime. Overview: `qa/desktop.png`, `qa/laptop.png`, `qa/mobile.png`. Screenshot per zona merekam modal setelah mesh dipilih; `*-learning.png` merekam bagian kuis/bacaan. Tes mencakup mesh hover/click, modal yang benar, parity tombol DOM, progress tanpa duplikasi, penutupan dialog, etika, sumber HTTPS, jawaban kuis, overflow, dan error console. Tidak ditemukan error console pada run terakhir.

Keterbatasan: Firefox, perangkat mobile fisik, dan benchmark FPS perangkat mid-range belum diverifikasi. Smoke test memeriksa tautan sumber di UI, bukan menjamin setiap penerbit dapat diakses dari semua jaringan.
