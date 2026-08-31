# 📘 Panduan Teknis GDevelop, Google Auth & Ekspor Android

Panduan ini menjelaskan cara membuka, mengonfigurasi autentikasi Google, AdMob, dan mengekspor game **Brain Puzzle Master** ke format Android (APK/AAB).

---

## 1. Membuka Proyek di GDevelop 5
1. Buka aplikasi **GDevelop 5** (tersedia di Windows, macOS, Linux, atau versi Web di [editor.gdevelop.io](https://editor.gdevelop.io/)).
2. Pada layar utama, klik tombol **"Open a project"** (Buka Proyek).
3. Arahkan ke folder proyek ini dan pilih file `game.json`.
4. GDevelop akan memuat seluruh struktur scene, objek, variabel global, dan aset visual.

---

## 2. Struktur Scene & Variabel Akun
- **Scene `MainMenu`:** Tampilan judul, tombol Play, Level Select, Tombol Akun Google, dan bar profil.
- **Scene `Gameplay`:** Tempat teka-teki logika interaktif dimainkan.
- **Variabel Global:**
  - `IsLoggedIn` (Boolean): Status apakah user sedang login akun Google (`true`/`false`).
  - `UserName` (String): Nama lengkap pengguna dari profil Google.
  - `UserEmail` (String): Alamat email akun Google pengguna.
  - `UserAvatar` (String): URL foto atau emoji avatar pemain.
  - `CurrentLevel` (Number): Level aktif saat ini (1–30).
  - `UnlockedLevel` (Number): Level tertinggi yang telah terbuka.
  - `Coins` (Number): Jumlah koin pemain.
  - `Hints` (Number): Jumlah petunjuk yang dimiliki pemain.

---

## 3. Konfigurasi Autentikasi Akun Google (Google Sign-In)

### Untuk Versi Web / HTML5:
Game sudah terintegrasi dengan SDK resmi **Google Identity Services (GSI)** pada `index.html` dan `game.js`.
- Ganti Client ID pada `game.js` di fungsi `initGoogleAuth()` dengan Client ID OAuth 2.0 milik Anda dari [Google Cloud Console](https://console.cloud.google.com/apis/credentials).
- Game juga menyediakan *Instant Login Mode* untuk kemudahan testing offline/lokal.

### Untuk Versi Android di GDevelop:
1. Pasang ekstensi **Firebase Authentication** atau **Google Play Games Services** melalui menu *Project Manager ➔ Functions/Extensions ➔ Search New Extensions*.
2. Pada Event Sheet saat objek `BtnGoogleLogin` ditekan:
   - Tambahkan aksi `Firebase Authentication: Sign in with Google` atau `Google Play Games: Sign in`.
   - Pada sub-event *Success*:
     - Set variable `IsLoggedIn = true`
     - Set variable `UserName = FirebaseAuth::UserDisplayName()`
     - Set variable `UserEmail = FirebaseAuth::UserEmail()`
     - Muat data simpanan cloud user (`Storage::Read` dengan key email user).

---

## 4. Konfigurasi Google AdMob
1. **Buka Project Properties di GDevelop:**
   - Masukkan **AdMob App ID** Anda (misal: `ca-app-pub-XXXXXXXXXXXXXXXX~XXXXXXXXXX`).
2. **Atur Ad Unit IDs pada Event Sheet:**
   - **Banner Ad:** Panggil `AdMob::ShowBanner` pada event *At the beginning of scene*.
   - **Interstitial Ad:** Panggil `AdMob::ShowInterstitial` setiap 3 level.
   - **Rewarded Video Ad:** Panggil `AdMob::ShowRewardedVideo` pada tombol *"Tonton Iklan (+1 Hint)"*.

---

## 5. Ekspor ke Android (APK / AAB)

### Metode 1: GDevelop Cloud Build (Paling Mudah)
1. Di GDevelop, klik tombol **Publish / Export** di toolbar atas kanan.
2. Pilih tab **Android & iOS**.
3. Pilih opsi **Android (APK & Google Play Bundle .AAB)**.
4. Klik **Package for Android**.
5. GDevelop Cloud Build akan memproses build secara otomatis. Anda akan menerima link download file `.apk` dan `.aab`.

### Metode 2: Ekspor Manual via Cordova / Capacitor
```bash
npm install -g cordova
cordova platform add android
cordova build android --release
```
