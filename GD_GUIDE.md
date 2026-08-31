# 📘 Panduan Teknis GDevelop & Ekspor Android

Panduan ini menjelaskan cara membuka, mengonfigurasi AdMob, dan mengekspor game **Brain Puzzle Master** ke format Android (APK/AAB).

---

## 1. Membuka Proyek di GDevelop 5
1. Buka aplikasi **GDevelop 5** (tersedia di Windows, macOS, Linux, atau versi Web di [editor.gdevelop.io](https://editor.gdevelop.io/)).
2. Pada layar utama, klik tombol **"Open a project"** (Buka Proyek).
3. Arahkan ke folder proyek ini dan pilih file `game.json`.
4. GDevelop akan memuat seluruh struktur scene, objek, variabel global, dan aset visual.

---

## 2. Struktur Scene & Variabel
- **Scene `MainMenu`:** Tampilan judul, tombol Play, tombol Level Select, dan ringkasan koin/hint.
- **Scene `Gameplay`:** Tempat teka-teki logika interaktif dimainkan dengan perilaku *Draggable*, deteksi tabrakan (*Collision*), dan dialog kemenangan.
- **Variabel Global:**
  - `CurrentLevel` (Number): Level aktif saat ini (1–30).
  - `UnlockedLevel` (Number): Level tertinggi yang telah terbuka.
  - `Coins` (Number): Jumlah koin pemain.
  - `Hints` (Number): Jumlah petunjuk yang dimiliki pemain.
  - `SoundEnabled` (Boolean): Status audio SFX.

---

## 3. Konfigurasi Google AdMob
Untuk menampilkan iklan nyata pada game Android:

1. **Buka Project Properties di GDevelop:**
   - Klik menu *Game settings* ➔ *Properties*.
   - Masukkan **AdMob App ID** Anda pada kolom yang tersedia (misal: `ca-app-pub-XXXXXXXXXXXXXXXX~XXXXXXXXXX`).

2. **Atur Ad Unit IDs pada Event Sheet:**
   - **Banner Ad:** Panggil action `AdMob::ShowBanner` pada event *At the beginning of scene* di scene MainMenu.
   - **Interstitial Ad:** Panggil action `AdMob::ShowInterstitial` saat kondisi `CurrentLevel % 3 == 0` terpenuhi setelah level selesai.
   - **Rewarded Video Ad:** Panggil action `AdMob::ShowRewardedVideo` saat tombol *"Tonton Iklan (+1 Hint)"* ditekan. Pada sub-event `AdMob::UserEarnedReward`, tambahkan action:
     - Ubah variabel `Hints` + 1
     - Simpan variabel `Hints` ke penyimpanan lokal (`Storage::Write`).

> **Catatan Uji Coba (Test Ads):**
> Saat tahap pengujian di emulator/device, selalu gunakan **AdMob Test Ad Unit ID** resmi dari Google agar akun AdMob Anda tidak terkena sanksi *invalid traffic*.

---

## 4. Ekspor ke Android (APK / AAB)

### Metode 1: GDevelop Cloud Build (Paling Mudah)
1. Di GDevelop, klik tombol **Publish / Export** di toolbar atas kanan.
2. Pilih tab **Android & iOS**.
3. Pilih opsi **Android (APK & Google Play Bundle .AAB)**.
4. Klik **Package for Android**.
5. GDevelop Cloud Build akan memproses build secara otomatis. Setelah selesai, Anda akan menerima link download file `.apk` (untuk testing mandiri) dan `.aab` (untuk publikasi ke Google Play Store).

### Metode 2: Ekspor Manual via Cordova / Capacitor
1. Di menu Publish, pilih **Manual build** ➔ **Cordova (iOS & Android)**.
2. Ekspor ke folder lokal di komputer Anda.
3. Jalankan perintah di terminal:
   ```bash
   npm install -g cordova
   cordova platform add android
   cordova build android --release
   ```

---

## 5. Menambahkan Level Baru di GDevelop
Untuk menambahkan level teka-teki baru:
1. Duplikasi template event level pada Event Sheet `Gameplay`.
2. Tentukan objek yang dapat digeser (*Draggable behavior*).
3. Buat kondisi target (misal: `Collision between Key and Chest` atau `Distance between Cloud and Fire < 50`).
4. Pada blok aksi benar (*Actions*):
   - Bunyikan suara kemenangan.
   - Tambahkan nilai variabel `UnlockedLevel` jika level baru lebih tinggi.
   - Tampilkan popup sukses dan simpan progres via *Storage Action*.
