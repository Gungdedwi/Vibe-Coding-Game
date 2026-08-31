# 🧩 Brain Puzzle Master (GDevelop Engine)

Game teka-teki logika interaktif (*Brain Puzzle*) bergaya *out-of-the-box* yang dikembangkan menggunakan **GDevelop** dan dilengkapi dengan *Playable Web Engine*, **Autentikasi Akun Google**, dan **Cloud Save Sync**.

---

## 📱 Fitur Utama
1. **Autentikasi Akun Google (Google Sign-In & Registration):**
   - Registrasi dan Login mudah menggunakan akun Google.
   - Header profil dinamis (Avatar, Nama Akun, Email, Status Sinkronisasi).
   - **Google Cloud Save Sync:** Progres permainan (level terbuka, koin, hint) disimpan aman berdasarkan akun Google pemain dan dapat disinkronkan di perangkat lain.
2. **30 Level Teka-Teki Logika Unik:**
   - **Level 1–5 (Tutorial):** Pengenalan mekanik dasar (*tap*, *drag & drop*).
   - **Level 6–15 (Medium):** Jebakan visual & *lateral thinking*.
   - **Level 16–30 (Advanced):** Manipulasi multi-objek, timer darurat, kombinasi elemen, dan kuis kreatif.
3. **Sistem Hint & Reward:**
   - Pemain dapat menggunakan Hint untuk petunjuk solusi.
   - Nonton iklan video berhadiah (*AdMob Rewarded Video*) untuk mendapatkan +1 Hint & +50 Koin gratis.
4. **Monetisasi AdMob:**
   - Banner Ad di menu utama dan level selector.
   - Interstitial Ad setiap kelipatan 3 level.
   - Rewarded Video Ad untuk petunjuk gratis.

---

## 📂 Struktur Proyek
```text
.
├── game.json              # File Proyek Resmi GDevelop 5 (mendukung Google Auth & AdMob)
├── index.html             # Playable Web Engine / Web Preview
├── style.css              # Styling Modern Glassmorphism & Google Auth UI
├── game.js                # Logika 30 Level, Google Identity Auth & Audio Synth
├── assets/
│   └── images/            # Aset Vektor SVG (Google, Brain, Bulb, Coin, Key)
├── issue.md               # Spesifikasi Fitur Awal
├── GD_GUIDE.md            # Panduan Membuka di GDevelop, Google Auth & Ekspor ke Android
└── README.md              # Dokumentasi Utama
```

---

## 🎮 Cara Menjalankan & Memainkan

### 1. Mainkan Langsung di Web Browser
Buka file `index.html` langsung di browser atau jalankan via live server lokal:
```bash
python3 -m http.server 8080
```
Lalu buka `http://localhost:8080` pada browser.

### 2. Membuka di GDevelop 5
1. Unduh dan buka aplikasi **[GDevelop 5](https://gdevelop.io/)**.
2. Klik **Open a project** lalu pilih file [`game.json`](./game.json).
3. Anda dapat melihat Scene `MainMenu` dan `Gameplay`, menguji tombol Google Login, dan mengekspor game ke Android.
