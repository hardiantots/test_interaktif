import { learningContent } from './learning-content';

export const zones = [
  { id: 'health', label: 'Kesehatan', title: 'Diagnostik cerdas', assetName: 'Robot MRI diagnostik', icon: '+', tone: 'coral', color: '#ee765f', position: [-4, 0, -3.3], scale: 1,
    description: 'AI membantu tenaga medis mengenali pola pada citra MRI dan X-Ray. Hasilnya perlu ditinjau dokter, bukan dianggap diagnosis otomatis.',
    benefit: 'Membantu memprioritaskan pemeriksaan dan menemukan pola yang perlu diperiksa lebih lanjut.', risk: 'Data pasien harus dilindungi. Model yang kurang mewakili kelompok tertentu dapat menghasilkan kesalahan.', question: 'Siapa yang boleh mengakses hasil scan pasien?', tooltip: 'Ring scanner membantu menggambarkan analisis citra medis.' },
  { id: 'transport', label: 'Transportasi', title: 'Mobilitas otonom', assetName: 'Bus otonom mini', icon: '↗', tone: 'mint', color: '#a9d8c2', position: [4, 0, -3.3], scale: 1,
    description: 'Bus otonom menggabungkan sensor dan algoritma untuk membaca jalan, menjaga jarak, dan merencanakan perjalanan.',
    benefit: 'Membantu keselamatan berkendara dan efisiensi rute saat sistem bekerja dalam kondisi yang sesuai.', risk: 'Sensor dapat keliru dalam cuaca buruk. Keputusan algoritmik perlu pengujian, pengawasan, dan tanggung jawab yang jelas.', question: 'Bagaimana bus harus bertindak ketika sensornya tidak yakin?', tooltip: 'Lidar memindai lingkungan; jalur menyala saat disorot.' },
  { id: 'industry', label: 'Industri', title: 'Pabrik adaptif', assetName: 'Lengan robot kolaboratif', icon: '◒', tone: 'blue', color: '#9ac9d6', position: [-4, 0, 3.3], scale: 1,
    description: 'Robot kolaboratif membantu manusia memindahkan dan memeriksa benda melalui gerakan yang terprogram.',
    benefit: 'Pekerjaan berulang dapat dikerjakan lebih konsisten sehingga manusia bisa berfokus pada pengawasan dan pemecahan masalah.', risk: 'Keselamatan kerja membutuhkan sensor, batas gerak, dan prosedur berhenti. Perubahan pekerjaan perlu diikuti pelatihan manusia.', question: 'Keterampilan baru apa yang dibutuhkan pekerja di pabrik ini?', tooltip: 'Tiga segmen dan gripper bergerak ringan saat disorot.' },
  { id: 'education', label: 'Pendidikan', title: 'Belajar personal', assetName: 'Meja hologram pembelajaran', icon: '✦', tone: 'yellow', color: '#f3cd70', position: [4, 0, 3.3], scale: 1,
    description: 'Tutor AI dapat menyesuaikan latihan dan umpan balik dengan kebutuhan belajar siswa, bersama bimbingan guru.',
    benefit: 'Personalisasi latihan serta dukungan teks dan audio dapat membantu aksesibilitas belajar.', risk: 'Jawaban AI bisa salah. Ketergantungan teknologi dan kesenjangan akses perlu diatasi dengan diskusi, verifikasi, dan pilihan belajar lain.', question: 'Kapan kamu perlu bertanya kepada guru, bukan hanya tutor AI?', tooltip: 'Tiga kartu belajar mengitari proyektor pengetahuan.' },
].map((zone) => ({ ...zone, learning: learningContent[zone.id], assetPath: null, sourceType: 'procedural', license: 'original' }));
