# 🧩 [Feature Request] Pengembangan Game Brain Puzzle Menggunakan GDevelop

## 📌 Ringkasan Fitur
Mengembangkan game teka-teki logika interaktif (*Brain Puzzle*) bergaya *out-of-the-box* menggunakan **GDevelop** (No-Code engine). Proyek ini mencakup alur gameplay interaktif, sistem level bertingkat, penyimpanan otomatis, dan monetisasi iklan AdMob.

---

## 🎯 Tujuan & Fitur Utama

### 1. Mekanisme & Gameplay (GDevelop Event System)
- [ ] **Interaksi Sentuhan:** Implementasi kondisi *Cursor/Touch is over object* dan aksi *Drag and Drop* bawaan GDevelop.
- [ ] **Logika Visual:** Teka-teki berbasis manipulasi objek (misal: menggeser objek tersembunyi, memindahkan elemen visual untuk menemukan kunci).
- [ ] **Sistem Hint (Petunjuk):** Tombol *Hint* yang mengurangi poin/koin pemain.

### 2. Struktur Level & Perancangan Scene
- [ ] **Level 1–5 (Tutorial):** Pengenalan mekanik dasar (*tap* dan *drag & drop*).
- [ ] **Level 6–15 (Medium):** Teka-teki dengan jebakan visual dan logika kalimat.
- [ ] **Level 16–30+ (Advanced):** Teka-teki berbasis multi-objek atau penggunaan timer.
- [ ] **Penyimpanan Progres:** Menggunakan fitur *Storage* bawaan GDevelop (Write/Read Value) agar level terakhir pemain tersimpan otomatis saat game ditutup.

### 3. Monetisasi & Iklan (GDevelop AdMob Extension)
- [ ] **Banner Ads:** Ditampilkan pada menu utama dan layar pemilihan level.
- [ ] **Interstitial Ads:** Muncul otomatis saat perpindahan scene/level tertentu (misal: setiap 3 level).
- [ ] **Rewarded Video Ads:** Pemain menonton iklan untuk mendapatkan *Hint* (Petunjuk) gratis secara otomatis.

---

## 🛠️ Stack Teknis & Tools
- **Engine:** GDevelop (Open Source / Free)
- **Desain Aset:** Inkscape / Canva / Figma
- **Audio:** BFXR / FreeSound (SFX untuk jawaban benar/salah)
- **Jaringan Iklan:** Google AdMob (Integrasi via ekstensi AdMob resmi GDevelop)
- **Target Platform:** Android (Ekspor ke APK / AAB)

---

## ✅ Kriteria Selesai (Acceptance Criteria)
1. Seluruh level dapat dimainkan secara berurutan tanpa adanya *logic bug* pada Event Sheet.
2. Fitur *Save & Load Progress* berfungsi dengan baik menggunakan *Storage* lokal.
3. Ekstensi AdMob terkonfigurasi dengan benar (Banner, Interstitial, dan Rewarded Ads dapat dipanggil melalui Event Sheet).
4. Hasil ekspor APK/AAB dapat berjalan lancar di perangkat Android.
