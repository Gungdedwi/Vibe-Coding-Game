# 🧩 Brain Puzzle Master (GDevelop Engine)

Game teka-teki logika interaktif (*Brain Puzzle*) bergaya *out-of-the-box* yang dikembangkan menggunakan **GDevelop** dan dilengkapi dengan *Playable Web Engine*.

---

## 📱 Fitur Utama
1. **30 Level Teka-Teki Logika Unik:**
   - **Level 1–5 (Tutorial):** Pengenalan mekanik dasar (*tap*, *drag & drop*).
   - **Level 6–15 (Medium):** Jebakan visual & *lateral thinking*.
   - **Level 16–30 (Advanced):** Manipulasi multi-objek, timer darurat, kombinasi elemen, dan kuis kreatif.
2. **Sistem Hint & Reward:**
   - Pemain dapat menggunakan Hint untuk petunjuk solusi.
   - Nonton iklan video berhadiah (*AdMob Rewarded Video*) untuk mendapatkan +1 Hint & +50 Koin gratis.
3. **Penyimpanan Progres Otomatis (*Autosave*):**
   - Menggunakan sistem penyimpanan lokal (*Storage* / *LocalStorage*) untuk menyimpan level yang terbuka, skor, dan hint.
4. **Monetisasi AdMob:**
   - Banner Ad di menu utama dan level selector.
   - Interstitial Ad setiap kelipatan 3 level.
   - Rewarded Video Ad untuk petunjuk gratis.

---

## 📂 Struktur Proyek
```text
.
├── game.json              # File Proyek Resmi GDevelop 5 (dapat dibuka di GDevelop)
├── index.html             # Playable Web Engine / Web Preview
├── style.css              # Styling Modern Glassmorphism UI
├── game.js                # Logika 30 Level Puzzle & Web Audio Synthesizer
├── assets/
│   └── images/            # Aset Vektor SVG Game (Brain, Bulb, Coin, Key)
├── issue.md               # Spesifikasi Fitur Awal
├── GD_GUIDE.md            # Panduan Membuka di GDevelop & Ekspor ke Android
└── README.md              # Dokumentasi Utama
```

---

## 🎮 Cara Menjalankan & Memainkan

### 1. Mainkan Langsung di Web Browser
Buka file `index.html` langsung di browser favorit Anda (Google Chrome, Firefox, Safari, Edge) atau jalankan melalui live server lokal:
```bash
# Menggunakan npx serve atau python http server
npx serve .
# atau
python3 -m http.server 8080
```

### 2. Membuka di GDevelop 5
1. Unduh dan buka aplikasi **[GDevelop 5](https://gdevelop.io/)** (Desktop atau Web Editor).
2. Klik **Open a project** lalu pilih file [`game.json`](./game.json).
3. Anda dapat melihat Scene `MainMenu` dan `Gameplay`, mengedit Event Sheet, serta menjalankan Preview langsung di engine GDevelop.

---

## 🛠️ Ekspor ke Android (APK / AAB)
Silakan baca panduan lengkap pada [GD_GUIDE.md](./GD_GUIDE.md) untuk langkah-langkah konfigurasi Google AdMob dan ekspor APK/AAB melalui GDevelop Cloud Build.
