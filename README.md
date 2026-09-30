# Future AI City

Kota pembelajaran AI dengan Next.js, React Three Fiber, dan empat asset procedural asli: robot MRI, bus otonom, lengan robot kolaboratif, serta meja hologram. Klik mesh atau City index untuk membaca manfaat, cara kerja, bukti, batasan, dan kuis singkat.

## Menjalankan

```sh
npm install
npm run dev
```

Buka http://localhost:3000. Script dev memakai Webpack karena binding SWC native pada lingkungan Windows ini gagal dimuat; Next.js menggunakan fallback WASM.

Untuk mode produksi:

```sh
npm run lint
npm run build -- --webpack
npm run start -- --hostname 127.0.0.1 --port 3000
```

Di PowerShell dengan execution policy yang memblokir npm.ps1, gunakan npm.cmd.

## Validasi browser

Dengan server produksi aktif dan Google Chrome terpasang, jalankan `npm run test:smoke`.
Tes memakai Chrome headless dengan software WebGL. Ukuran layar: 1440×1080, 1024×900, 390×844. Hasil JSON dan screenshot ada di docs/qa/. Pengujian ini bukan benchmark GPU/perangkat mobile fisik. Firefox belum diuji.

## Struktur

- src/components/scene/assets/ZoneAssets.js: empat model procedural.
- src/components/scene/scene-data.js: definisi zona tunggal untuk Canvas dan HUD.
- src/components/scene/learning-content.js: materi, kuis, sumber, dan tanggal pemeriksaan.
- src/components/scene/CityScene.js: kamera, interaksi, instancing, dan detail adaptif.
- src/components/ZoneModal.js: bacaan, kutipan, kuis, dialog keyboard.
- docs/ASSETS.md: polygon, material, lisensi, dan provenance referensi.

Semua model dibuat dari kode; tidak ada unduhan GLB/HDR atau generator online saat runtime. Model procedural juga merupakan fallback dasar, sehingga tidak ada fetch model yang dapat gagal. Bila WebGL tidak tersedia, panel DOM tetap dapat digunakan. UI mengadaptasi gaya Notion yang terang dan editorial. Inter dilayani dari aplikasi melalui next/font setelah build; Georgia memakai font sistem. Tidak ada request Google Fonts dari browser. Lihat DESIGN.md untuk referensi dan token desain.

Progress menghitung zona yang dibuka, bukan kelulusan kuis, dan hanya berlaku selama sesi halaman. Jawaban kuis memberi umpan balik tanpa mengubah progress eksplorasi.

Materi merupakan ringkasan edukatif. Sumber jurnal dan institusi ditautkan langsung pada tiap zona; skenario buatan diberi label. Panduan lembaga AS dipakai untuk menjelaskan konsep, bukan disajikan sebagai aturan Indonesia.
