/**
 * PROCEDURE QUEST - DATA REPOSITORY
 * Mata Pelajaran: Bahasa Indonesia (Kelas IX SMP)
 * Topik: Teks Prosedur
 * Guru Pengampu: Bahaudin Alfiansyah Syafi'i, S.Pd.
 * NIPPPK: 199702042025211039
 */

const GAME_DATA = {
    meta: {
        title: "PROCEDURE QUEST",
        subtitle: "Learn the Steps. Master the Procedure.",
        subject: "Bahasa Indonesia",
        grade: "Kelas IX SMP",
        topic: "Teks Prosedur",
        teacher: {
            name: "Bahaudin Alfiansyah Syafi'i, S.Pd.",
            nipppk: "199702042025211039",
            role: "Guru Pengampu Bahasa Indonesia"
        }
    },

    levels: [
        { level: 1, title: "Procedure Rookie", minXp: 0, maxXp: 300, icon: "🌱", color: "#10b981", desc: "Awal petualanganmu memahami teks prosedur!" },
        { level: 2, title: "Step Explorer", minXp: 301, maxXp: 800, icon: "🧭", color: "#06b6d4", desc: "Mampu menjelajah dan mengenali alur langkah-langkah!" },
        { level: 3, title: "Procedure Analyst", minXp: 801, maxXp: 1500, icon: "🔍", color: "#8b5cf6", desc: "Mampu membedah struktur dan kebahasaan teks dengan jeli!" },
        { level: 4, title: "Procedure Expert", minXp: 1501, maxXp: 2300, icon: "⚡", color: "#f59e0b", desc: "Menguasai kaidah, logika urutan, dan perbaikan teks!" },
        { level: 5, title: "Procedure Master", minXp: 2301, maxXp: 99999, icon: "👑", color: "#ec4899", desc: "Gelar tertinggi penakluk kekacauan prosedur!" }
    ],

    badges: [
        {
            id: "first_mission",
            name: "First Step Explorer",
            icon: "🚀",
            desc: "Menyelesaikan materi pembelajaran pertama.",
            requirement: "Selesaikan 1 modul materi"
        },
        {
            id: "step_master",
            name: "Master of Flow",
            icon: "🧩",
            desc: "Menyusun langkah acak dengan sempurna pada Step Sorter.",
            requirement: "Selesaikan Game Step Sorter"
        },
        {
            id: "detective_pro",
            name: "Flaw Hunter",
            icon: "🕵️‍♂️",
            desc: "Menemukan kesalahan tersembunyi pada Procedure Detective.",
            requirement: "Selesaikan Game Procedure Detective"
        },
        {
            id: "grammar_hero",
            name: "Linguistic Striker",
            icon: "🎯",
            desc: "Menemukan semua unsur kata di Word Hunter tanpa kalah.",
            requirement: "Selesaikan Game Word Hunter"
        },
        {
            id: "boss_slayer",
            name: "Chaos Conqueror",
            icon: "⚔️",
            desc: "Mengalahkan Dr. Chaos dalam Procedure Boss Battle.",
            requirement: "Kalahkan Dr. Chaos di Boss Battle"
        },
        {
            id: "quiz_champion",
            name: "HOTS Scholar",
            icon: "🎓",
            desc: "Menyelesaikan Kuis Evaluasi dengan skor memuaskan.",
            requirement: "Selesaikan 20 Soal Kuis"
        },
        {
            id: "ultimate_master",
            name: "Grand Procedure Master",
            icon: "🏆",
            desc: "Mencapai gelar tertinggi Level 5 Procedure Master.",
            requirement: "Raih minimal 2.300 XP"
        }
    ],

    modules: [
        {
            id: "materi_1",
            number: 1,
            title: "Apa Itu Teks Prosedur?",
            icon: "📖",
            xpReward: 100,
            summary: "Pahami esensi, tujuan komunikatif, dan karakteristik utama teks prosedur dalam kehidupan sehari-hari.",
            sections: [
                {
                    heading: "1. Pengertian Sederhana",
                    type: "cards",
                    items: [
                        {
                            title: "Apa Tujuannya?",
                            badge: "Definisi",
                            text: "Teks prosedur adalah teks yang memberikan instruksi, langkah-langkah, atau petunjuk sistematis untuk membuat, melakukan, atau mengoperasikan sesuatu agar tujuan tercapai secara tepat dan efisien."
                        },
                        {
                            title: "Fungsi Sosial",
                            badge: "Kehidupan Nyata",
                            text: "Membantu orang lain melakukan aktivitas yang belum dipahami secara benar dan aman, mulai dari menyalakan perangkat elektronik, membuat akun digital, hingga memasak resep kuliner."
                        }
                    ]
                },
                {
                    heading: "2. 4 Karakteristik Utama",
                    type: "grid",
                    items: [
                        { icon: "🔢", title: "Sistematis & Berurutan", desc: "Langkah disajikan berurutan secara logis dari awal hingga akhir." },
                        { icon: "🎯", title: "Jelas & Informatif", desc: "Instruksi tidak ambigu, memiliki takaran atau petunjuk terukur." },
                        { icon: "⚡", title: "Berisi Panduan Aksi", desc: "Menggunakan kata kerja tindakan dan kalimat imperatif (perintah)." },
                        { icon: "⚖️", title: "Logis & Objektif", desc: "Bisa dipraktikkan langsung dengan hasil yang dapat diprediksi." }
                    ]
                },
                {
                    heading: "3. Contoh Nyata vs Bukan Teks Prosedur",
                    type: "comparison",
                    items: [
                        {
                            isCorrect: true,
                            label: "✅ Contoh Teks Prosedur",
                            title: "Cara Menghidupkan Komputer Laboratorium Sekolah",
                            content: "1. Pastikan kabel power terhubung ke stopkontak.<br>2. Tekan tombol Power pada CPU.<br>3. Tekan tombol Power pada monitor.<br>4. Tunggu hingga proses booting OS selesai dan desktop muncul."
                        },
                        {
                            isCorrect: false,
                            label: "❌ Bukan Teks Prosedur (Teks Deskripsi/Narasi)",
                            title: "Suasana Laboratorium Komputer",
                            content: "Laboratorium komputer sekolahku sangat dingin dan bersih. Ada 30 unit komputer berwarna hitam berjajar rapi. Kemarin kami belajar mengetik bersama teman-teman dengan gembira."
                        }
                    ]
                },
                {
                    heading: "4. Quick Check Misi 1",
                    type: "quick_check",
                    question: "Manakah di bawah ini yang merupakan tujuan utama dari sebuah teks prosedur?",
                    options: [
                        "Menghibur pembaca dengan kisah petualangan fantasi",
                        "Memberikan panduan langkah-langkah sistematis agar pembaca dapat melakukan sesuatu dengan benar",
                        "Menggambarkan keindahan pemandangan alam secara detail",
                        "Membujuk pembaca agar membeli produk tertentu"
                    ],
                    correctIndex: 1,
                    explanation: "Teks prosedur bertujuan memberikan petunjuk langkah sistematis agar suatu aktivitas dapat dilakukan dengan tepat dan sukses."
                }
            ]
        },
        {
            id: "materi_2",
            number: 2,
            title: "Struktur Teks Prosedur",
            icon: "🏗️",
            xpReward: 100,
            summary: "Bedah 4 pilar anatomi teks prosedur: Tujuan, Bahan/Alat, Langkah-langkah, dan Penutup.",
            sections: [
                {
                    heading: "1. Anatomi Alur Teks Prosedur",
                    type: "diagram",
                    steps: [
                        { step: "01", name: "Tujuan (Goal / Objective)", desc: "Menjelaskan hasil akhir yang akan dicapai atau alasan dibuatnya prosedur tersebut.", icon: "🎯" },
                        { step: "02", name: "Alat & Bahan (Materials)", desc: "Daftar rincian material, takaran, spesifikasi, atau perkakas yang dibutuhkan.", icon: "🧪" },
                        { step: "03", name: "Langkah-Langkah (Steps)", desc: "Rangkaian tindakan urut nomor/kronologis yang harus dipatuhi tahap demi tahap.", icon: "🪜" },
                        { step: "04", name: "Penutup / Simpulan (Closing)", desc: "Opsional: Berisi ucapan selamat, tips keberhasilan, atau ringkasan manfaat.", icon: "✨" }
                    ]
                },
                {
                    heading: "2. Bedah Detail Setiap Struktur",
                    type: "cards",
                    items: [
                        {
                            title: "🎯 1. Bagian Tujuan",
                            badge: "Pembuka",
                            text: "Terletak di awal teks. Sering kali berupa paragraf pengantar singkat yang menerangkan apa manfaat melakukan kegiatan tersebut. Contoh: 'Membuat pupuk kompos organik di rumah bermanfaat mengurangi sampah dapur dan menyuburkan tanaman tanpa biaya.'"
                        },
                        {
                            title: "🧪 2. Bagian Alat dan Bahan",
                            badge: "Rincian",
                            text: "Wajib menyertakan takaran atau ukuran yang pasti (misal: '2 sendok makan garam', '500 ml air hangat', '1 pasang sarung tangan karet'). Pada prosedur jenis 'cara menggunakan alat', bagian bahan terkadang tidak diperlukan."
                        },
                        {
                            title: "🪜 3. Bagian Langkah-Langkah",
                            badge: "Inti Prosedur",
                            text: "Jantung dari teks prosedur. Ditulis menggunakan penomoran (1, 2, 3) atau konjungsi urutan (Pertama, Kemudian, Setelah itu, Akhirnya). Setiap kalimat harus jelas dan mudah dieksekusi."
                        },
                        {
                            title: "✨ 4. Bagian Penutup (Opsional)",
                            badge: "Penutup",
                            text: "Berisi apresiasi atau tips tambahan. Contoh: 'Sekarang teh jahe hangat siap dinikmati selagi hangat untuk melegakan tenggorokan.'"
                        }
                    ]
                },
                {
                    heading: "3. Quick Check Misi 2",
                    type: "quick_check",
                    question: "Jika sebuah teks prosedur tidak menyertakan takaran yang jelas pada bagian alat & bahan, apa dampak yang paling mungkin terjadi bagi pembaca?",
                    options: [
                        "Teks akan otomatis berubah menjadi teks narasi",
                        "Hasil akhir yang dibuat pembaca berisiko gagal atau tidak sesuai standar",
                        "Pembaca akan lebih mudah memahami langkah-langkahnya",
                        "Teks menjadi lebih singkat dan jauh lebih bermutu"
                    ],
                    correctIndex: 1,
                    explanation: "Takaran yang presisi sangat krusial agar pembaca tidak menebak-nebak dan hasil prosedur berhasil optimal."
                }
            ]
        },
        {
            id: "materi_3",
            number: 3,
            title: "Ciri Kebahasaan Teks Prosedur",
            icon: "🖋️",
            xpReward: 100,
            summary: "Kuasai kata kerja imperatif, kata kerja material, konjungsi temporal, kata bilangan, dan keterangan.",
            sections: [
                {
                    heading: "1. Enam Kaidah Kebahasaan Kunci",
                    type: "grid",
                    items: [
                        { icon: "🗣️", title: "1. Kalimat Imperatif", desc: "Mengandung perintah/ajakan. Ciri: akhiran -kan, -i, atau partikel -lah. Contoh: Tuangkan, Masukkanlah, Olesi." },
                        { icon: "🏃", title: "2. Kata Kerja Tindakan", desc: "Menyatakan perbuatan fisik nyata (verba material). Contoh: mengaduk, memotong, mencelupkan, mengeringkan." },
                        { icon: "⏱️", title: "3. Konjungsi Temporal", desc: "Penghubung urutan waktu kejadian. Contoh: pertama, selanjutnya, kemudian, setelah itu, lalu, akhirnya." },
                        { icon: "⚖️", title: "4. Kata Bilangan (Takaran)", desc: "Menunjukkan jumlah/ukuran pasti. Contoh: 2 lembar, 1/2 sendok teh, 100 gram, 3 tetes." },
                        { icon: "🛠️", title: "5. Keterangan Cara & Alat", desc: "Menjelaskan metode atau media kerja. Contoh: dengan perlahan, menggunakan kuas halus, hingga merata." },
                        { icon: "⚠️", title: "6. Kalimat Saran / Larangan", desc: "Peringatan keselamatan atau tips. Contoh: Jangan sentuh kabel basah; Sebaiknya gunakan api kecil." }
                    ]
                },
                {
                    heading: "2. Uji Komparasi Kalimat: ❌ Salah vs ✅ Benar",
                    type: "comparison_list",
                    items: [
                        {
                            bad: "❌ Kamu sebaiknya memikirkan untuk mencuci sayur kalau kamu sempat.",
                            good: "✅ Cucilah sayuran hijau di bawah air mengalir hingga bersih.",
                            note: "Kalimat prosedur harus lugas dan menggunakan kata kerja imperatif/tindakan, bukan berbelit-belit."
                        },
                        {
                            bad: "❌ Berikan sedikit air lalu tunggu sebentar.",
                            good: "✅ Tuangkan 200 ml air mineral, lalu diamkan selama 5 menit.",
                            note: "Hindari ukuran ambigu seperti 'sedikit' atau 'sebentar', gunakan satuan terukur."
                        },
                        {
                            bad: "❌ Akhirnya potong wortel, pertama kupas kulitnya.",
                            good: "✅ Pertama, kupas kulit wortel. Selanjutnya, potong berbentuk dadu kecil.",
                            note: "Konjungsi temporal harus runut sesuai alur waktu kejadian logis."
                        }
                    ]
                },
                {
                    heading: "3. Quick Check Misi 3",
                    type: "quick_check",
                    question: "Manakah kalimat berikut yang menggunakan kata kerja imperatif dengan benar?",
                    options: [
                        "Budi sedang mengaduk adonan kue di dapur sekolah.",
                        "Aduk adonan tersebut menggunakan spatula secara perlahan hingga kalis!",
                        "Adonan itu terlihat sangat lembut dan mengembang.",
                        "Apakah kamu sudah selesai mengaduk adonannya?"
                    ],
                    correctIndex: 1,
                    explanation: "'Aduk ... secara perlahan hingga kalis!' adalah kalimat imperatif (perintah) yang menginstruksikan tindakan langsung."
                }
            ]
        },
        {
            id: "materi_4",
            number: 4,
            title: "Laboratorium Analisis Teks",
            icon: "🔬",
            xpReward: 120,
            summary: "Praktik langsung membedah teks prosedur lengkap menggunakan fitur Interactive Highlighting.",
            interactiveLab: {
                title: "Panduan Membuat Lubang Resapan Biopori di Halaman Sekolah",
                parts: [
                    { type: "tujuan", label: "🎯 TUJUAN", text: "Lubang resapan biopori sangat efektif untuk mengatasi genangan air hujan sekaligus mengolah sampah organik daun menjadi kompos alami di lingkungan sekolah." },
                    { type: "bahan", label: "🧪 ALAT & BAHAN", text: "1. Bor tanah pipa biopori (1 unit)<br>2. Pipa PVC diameter 10 cm panjang 1 meter yang sudah dilubangi (1 buah)<br>3. Sampah daun kering dan sisa kulit buah (1 kantong)<br>4. Penutup pipa biopori berpori (1 buah)<br>5. Air secukupnya untuk membasahi tanah." },
                    { type: "langkah", label: "🪜 LANGKAH-LANGKAH", text: "1. Tentukan lokasi tanah yang terkena limpasan air hujan.<br>2. Siram tanah dengan sedikit air agar tanah menjadi lebih gembur dan mudah dibor.<br>3. Tancapkan bor biopori tegak lurus, lalu putar searah jarum jam hingga kedalaman 80-100 cm.<br>4. Masukkan pipa PVC yang berlubang ke dalam tanah secara perlahan.<br>5. Masukkan sampah organik daun kering ke dalam pipa hingga padat.<br>6. Tutup lubang pipa dengan tutup biopori agar aman saat diinjak." },
                    { type: "penutup", label: "✨ PENUTUP", text: "Biopori siap bekerja meresapkan air. Lakukan pengisian ulang sampah organik setiap 2 minggu sekali agar produksi kompos tetap berjalan optimal." }
                ],
                annotations: {
                    imperatif: ["Tentukan", "Siram", "Tancapkan", "putar", "Masukkan", "Tutup", "Lakukan"],
                    konjungsi: ["lalu", "hingga", "secara perlahan", "agar"],
                    numeralia: ["1 unit", "10 cm", "1 meter", "1 buah", "80-100 cm", "2 minggu sekali"],
                    keterangan: ["tegak lurus", "searah jarum jam", "hingga padat", "setiap 2 minggu sekali"]
                }
            }
        }
    ],

    games: {
        stepSorter: [
            {
                id: "sorter_1",
                scenario: "Resep Herbal: Cara Menyeduh Teh Jahe Madu Lemon Penambah Imunitas",
                difficulty: "Normal",
                xpReward: 100,
                hint: "Perhatikan alur memasak air, mememarkan rempah, hingga memasukkan madu saat air sudah hangat agar nutrisi madu tidak rusak!",
                correctOrder: [
                    "Kupas dan memarkan 2 ruas jahe segar di atas talenan bersih.",
                    "Rebus 400 ml air bersih bersama jahe yang telah dimemarkan hingga mendidih dan beraroma harum.",
                    "Tuangkan air rebusan jahe ke dalam cangkir saji melalui saringan.",
                    "Tunggu hingga uap panas berkurang dan air menjadi hangat suam-suam kuku.",
                    "Tambahkan 2 sendok makan madu murni dan perasan jeruk lemon, lalu aduk rata."
                ],
                initialShuffled: [
                    "Tambahkan 2 sendok makan madu murni dan perasan jeruk lemon, lalu aduk rata.",
                    "Kupas dan memarkan 2 ruas jahe segar di atas talenan bersih.",
                    "Tunggu hingga uap panas berkurang dan air menjadi hangat suam-suam kuku.",
                    "Rebus 400 ml air bersih bersama jahe yang telah dimemarkan hingga mendidih dan beraroma harum.",
                    "Tuangkan air rebusan jahe ke dalam cangkir saji melalui saringan."
                ],
                explanation: "Urutan yang benar: Mempersiapkan bahan jahe -> Merebus air jahe -> Menyaring ke cangkir -> Mendinginkan sejenak -> Menambahkan madu & lemon agar enzim madu terjaga."
            },
            {
                id: "sorter_2",
                scenario: "Digital Literacy: Cara Mengaktifkan Verifikasi Dua Langkah (2FA) pada Akun Digital",
                difficulty: "Hard",
                xpReward: 150,
                hint: "Urutan keamanan akun: Buka pengaturan -> Menu keamanan -> Pilih metode OTP -> Verifikasi kode uji coba.",
                correctOrder: [
                    "Buka aplikasi dan masuk ke menu Pengaturan Akun (Settings).",
                    "Pilih opsi menu 'Keamanan dan Privasi', lalu klik 'Verifikasi Dua Langkah'.",
                    "Pilih metode verifikasi yang diinginkan (Aplikasi Authenticator atau SMS).",
                    "Masukkan kode verifikasi 6-digit yang dikirimkan ke perangkatmu untuk konfirmasi.",
                    "Simpan kode cadangan (backup codes) di tempat aman untuk pemulihan darurat."
                ],
                initialShuffled: [
                    "Simpan kode cadangan (backup codes) di tempat aman untuk pemulihan darurat.",
                    "Pilih metode verifikasi yang diinginkan (Aplikasi Authenticator atau SMS).",
                    "Buka aplikasi dan masuk ke menu Pengaturan Akun (Settings).",
                    "Masukkan kode verifikasi 6-digit yang dikirimkan ke perangkatmu untuk konfirmasi.",
                    "Pilih opsi menu 'Keamanan dan Privasi', lalu klik 'Verifikasi Dua Langkah'."
                ],
                explanation: "Urutan logis aktivasi keamanan digital selalu dimulai dari Menu Pengaturan -> Menu Keamanan -> Pemilihan Metode -> Uji Kode -> Penyimpanan Kunci Cadangan."
            }
        ],

        detective: [
            {
                id: "det_1",
                caseTitle: "Kasus: SOP Mengganti Ban Sepeda yang Rancu",
                xpReward: 120,
                textSnippets: [
                    { id: "s1", text: "1. Siapkan pompa angin, sendok ban, dan ban dalam baru.", isError: false },
                    { id: "s2", text: "2. Pompa ban dalam baru sampai tekanan maksimal 40 PSI sebelum dimasukkan ke pelek.", isError: true, issue: "Kesalahan Logika Langkah: Ban dalam tidak boleh dipompa keras sebelum dipasang ke dalam ban luar dan pelek!", fix: "Seharusnya ban dalam hanya diisi sedikit udara agar tidak terlipat saat dimasukkan." },
                    { id: "s3", text: "3. Lepaskan roda sepeda dari rangkanya menggunakan kunci pas.", isError: false },
                    { id: "s4", text: "4. Cungkil bibir ban luar menggunakan sendok ban secara perlahan.", isError: false }
                ]
            },
            {
                id: "det_2",
                caseTitle: "Kasus: Resep Puding Cokelat Berbahasa Kurang Baku",
                xpReward: 140,
                textSnippets: [
                    { id: "s1", text: "1. Tuang bubuk agar-agar cokelat dan 150 gram gula ke dalam panci.", isError: false },
                    { id: "s2", text: "2. Masukkan air kira-kira seadanya saja sampai pancinya penuh.", isError: true, issue: "Kesalahan Ukuran Takaran: 'Kira-kira seadanya saja' melanggar syarat teks prosedur yang harus terukur dan pasti.", fix: "Gunakan takaran pasti: 'Tuangkan 700 ml air bersih'." },
                    { id: "s3", text: "3. Masak di atas api sedang sambil diaduk perlahan hingga mendidih.", isError: false },
                    { id: "s4", text: "4. Akhirnya, tuang puding ke dalam cetakan dan dinginkan.", isError: false }
                ]
            },
            {
                id: "det_3",
                caseTitle: "Kasus: Petunjuk Menghapus Memori Cache HP",
                xpReward: 140,
                textSnippets: [
                    { id: "s1", text: "1. Buka menu 'Pengaturan' pada smartphone kamu.", isError: false },
                    { id: "s2", text: "2. Ketuk menu 'Aplikasi' lalu pilih aplikasi yang memakan banyak ruang penyimpanan.", isError: false },
                    { id: "s3", text: "3. Langsung banting HP ke lantai jika aplikasi masih berjalan lambat.", isError: true, issue: "Kesalahan Tindakan & Bahasa: Bukan langkah prosedur logis dan membahayakan perangkat.", fix: "Ganti dengan: 'Ketuk tombol Hapus Cache (Clear Cache) pada rincian penyimpanan.'" },
                    { id: "s4", text: "4. Ulangi langkah tersebut untuk aplikasi media sosial lainnya.", isError: false }
                ]
            }
        ],

        wordHunter: [
            {
                id: "wh_1",
                instruction: "Temukan 3 KATA KERJA IMPERATIF (Kata Perintah) dalam teks berikut!",
                targetCategory: "imperatif",
                targetCount: 3,
                xpReward: 120,
                paragraphTokens: [
                    { text: "Siapkan", isTarget: true, type: "imperatif" },
                    { text: "dua", isTarget: false },
                    { text: "lembar", isTarget: false },
                    { text: "kertas", isTarget: false },
                    { text: "origami.", isTarget: false },
                    { text: "Kemudian,", isTarget: false },
                    { text: "lipatlah", isTarget: true, type: "imperatif" },
                    { text: "sudut", isTarget: false },
                    { text: "kertas", isTarget: false },
                    { text: "membentuk", isTarget: false },
                    { text: "segitiga.", isTarget: false },
                    { text: "Setelah", isTarget: false },
                    { text: "itu,", isTarget: false },
                    { text: "rekatkan", isTarget: true, type: "imperatif" },
                    { text: "bagian", isTarget: false },
                    { text: "ujung", isTarget: false },
                    { text: "dengan", isTarget: false },
                    { text: "lem", isTarget: false },
                    { text: "kertas.", isTarget: false }
                ]
            },
            {
                id: "wh_2",
                instruction: "Temukan 3 KONJUNGSI TEMPORAL (Penghubung Waktu) dalam teks berikut!",
                targetCategory: "konjungsi",
                targetCount: 3,
                xpReward: 120,
                paragraphTokens: [
                    { text: "Pertama,", isTarget: true, type: "konjungsi" },
                    { text: "bersihkan", isTarget: false },
                    { text: "luka", isTarget: false },
                    { text: "dengan", isTarget: false },
                    { text: "air", isTarget: false },
                    { text: "mengalir.", isTarget: false },
                    { text: "Selanjutnya,", isTarget: true, type: "konjungsi" },
                    { text: "oleskan", isTarget: false },
                    { text: "antiseptik", isTarget: false },
                    { text: "secara", isTarget: false },
                    { text: "merata.", isTarget: false },
                    { text: "Terakhir,", isTarget: true, type: "konjungsi" },
                    { text: "tutup", isTarget: false },
                    { text: "luka", isTarget: false },
                    { text: "menggunakan", isTarget: false },
                    { text: "plester", isTarget: false },
                    { text: "steril.", isTarget: false }
                ]
            },
            {
                id: "wh_3",
                instruction: "Temukan 3 KATA BILANGAN / TAKARAN (Numeralia) dalam teks berikut!",
                targetCategory: "numeralia",
                targetCount: 3,
                xpReward: 120,
                paragraphTokens: [
                    { text: "Masukkan", isTarget: false },
                    { text: "200 gram", isTarget: true, type: "numeralia" },
                    { text: "tepung", isTarget: false },
                    { text: "terigu", isTarget: false },
                    { text: "dan", isTarget: false },
                    { text: "2 butir", isTarget: true, type: "numeralia" },
                    { text: "telur", isTarget: false },
                    { text: "ayam.", isTarget: false },
                    { text: "Aduk", isTarget: false },
                    { text: "adonan", isTarget: false },
                    { text: "lalu", isTarget: false },
                    { text: "tambahkan", isTarget: false },
                    { text: "3 tetes", isTarget: true, type: "numeralia" },
                    { text: "ekstrak", isTarget: false },
                    { text: "vanili.", isTarget: false }
                ]
            }
        ],

        bossBattle: {
            bossName: "Dr. Chaos (Raja Kekacauan Prosedur)",
            bossTitle: "The Disorder Lord",
            bossHp: 100,
            playerHp: 100,
            story: "Dr. Chaos telah mengacak-acak seluruh Standard Operating Procedure (SOP) di kota! Susun kembali teks prosedur 'Cara Mengoperasikan Tabung APAR saat Kebakaran' secara sempurna untuk mengalahkannya!",
            phases: [
                {
                    phaseNumber: 1,
                    title: "Fase 1: Menentukan Tujuan Prosedur",
                    bossSpeech: "Hahaha! Prosedur tanpa tujuan yang jelas hanyalah omong kosong tak berguna! Bisakah kamu merumuskan tujuan yang paling tepat?",
                    question: "Manakah rumusan bagian TUJUAN yang paling efektif dan tepat untuk teks prosedur pemadaman kebakaran dengan APAR?",
                    options: [
                        { text: "Kebakaran adalah musibah besar yang sering terjadi di perkotaan saat musim kemarau.", correct: false, dmg: 25, feedback: "Itu adalah kalimat teks eksplanasi, bukan tujuan prosedur!" },
                        { text: "Panduan ini memberikan langkah cepat dan aman mengoperasikan Alat Pemadam Api Ringan (APAR) untuk memadamkan api skala kecil.", correct: true, dmg: 20, feedback: "Tepat sekali! Mengandung target aksi dan batasan yang jelas." },
                        { text: "APAR berwarna merah cerah dan tabungnya terbuat dari baja tebal tahan karat.", correct: false, dmg: 25, feedback: "Itu kalimat deskripsi fisik, bukan tujuan prosedur!" }
                    ]
                },
                {
                    phaseNumber: 2,
                    title: "Fase 2: Validasi Alat & Bahan",
                    bossSpeech: "Kurang ajar! Tapi bagaimana dengan rincian alat dan bahannya? Aku telah menyusupkan barang palsu!",
                    question: "Manakah daftar alat/komponen APAR yang wajib dipastikan kondisinya sebelum prosedur pemadaman dimulai?",
                    options: [
                        { text: "Tabung APAR bertekanan normal (jarum hijau), pin pengaman, tuas pegangan, selang (nozzle).", correct: true, dmg: 20, feedback: "Akurat! Komponen pengaman APAR sangat lengkap dan presisi." },
                        { text: "Ember air besar, selimut tebal, korek api, dan bensin cadangan.", correct: false, dmg: 25, feedback: "Salah besar! Membawa bensin justru memperbesar kobaran api!" },
                        { text: "Cat semprot merah, kuas cat, penggaris, dan gunting rumput.", correct: false, dmg: 25, feedback: "Itu alat kerajinan, bukan perlengkapan pemadam api!" }
                    ]
                },
                {
                    phaseNumber: 3,
                    title: "Fase 3: Mengatur Urutan Logis (Metode PASS)",
                    bossSpeech: "Jangan senang dulu! Aku telah mengacak metode PASS internasional! Kamu pasti bingung!",
                    question: "Manakah urutan kronologis yang benar dalam mengoperasikan APAR (T-A-R-I-K / P-A-S-S)?",
                    options: [
                        { text: "Tekan tuas -> Arahkan selang -> Tarik pin pengaman -> Sapukan ke api", correct: false, dmg: 25, feedback: "Jika tuas ditekan sebelum pin ditarik, tabung akan terkunci dan rusak!" },
                        { text: "Tarik pin pengaman -> Arahkan nozzle ke pangkal api -> Tekan tuas -> Sapukan dari sisi ke sisi", correct: true, dmg: 20, feedback: "Sempurna! Urutan PASS (Pull, Aim, Squeeze, Sweep) diterapkan dengan benar." },
                        { text: "Sapukan selang -> Tarik pin -> Goyangkan tabung -> Lempar tabung ke api", correct: false, dmg: 25, feedback: "Tindakan ceroboh dan sangat berbahaya!" }
                    ]
                },
                {
                    phaseNumber: 4,
                    title: "Fase 4: Memilih Kalimat Imperatif & Keterangan Arah",
                    bossSpeech: "Urghhh... HP-ku tinggal sedikit! Tapi bagaimana dengan kalimat perintah kebahasaannya?!",
                    question: "Manakah kalimat imperatif dengan keterangan arah yang paling tepat saat menyemprotkan APAR?",
                    options: [
                        { text: "Semprotkan bahan pemadam tepat ke pangkal api searah hembusan angin!", correct: true, dmg: 20, feedback: "Luar biasa! Menyemprot searah angin mencegah asap dan api membalik ke tubuh." },
                        { text: "Coba disemprotkan ke asap paling atas berlawanan dengan arah angin kencang.", correct: false, dmg: 25, feedback: "Salah! Menyemprot berlawanan arah angin akan membahayakan keselamatan pengguna." },
                        { text: "Kamu bisa menyemprot sesukamu di mana saja yang kamu sukai.", correct: false, dmg: 25, feedback: "Bahasa tidak baku dan instruksi sangat tidak aman." }
                    ]
                },
                {
                    phaseNumber: 5,
                    title: "Fase 5: Merumuskan Penutup & Tips Keselamatan",
                    bossSpeech: "TIDAAAK! Serangan terakhirku! Tentukan langkah pamungkas teks prosedur ini!",
                    question: "Manakah kalimat penutup dan keselamatan kerja yang paling tepat untuk mengakhiri teks prosedur ini?",
                    options: [
                        { text: "Setelah api padam, pastikan bara benar-benar mati dan segera isi ulang tabung APAR.", correct: true, dmg: 20, feedback: "Critical Hit! Teks prosedur selesai sempurna dan Dr. Chaos berhasil dikalahkan!" },
                        { text: "Tinggalkan area kebakaran segera tanpa perlu memeriksa apakah api masih menyala.", correct: false, dmg: 25, feedback: "Sangat berbahaya! Bara yang tersisa bisa memicu kebakaran baru." },
                        { text: "Simpan tabung kosong di tempat tersembunyi agar tidak ada yang tahu.", correct: false, dmg: 25, feedback: "Salah! Tabung kosong harus segera diisi ulang demi kesiapsiagaan." }
                    ]
                }
            ]
        }
    },

    quizBank: [
        {
            id: 1,
            type: "multiple_choice",
            category: "Konsep Dasar",
            question: "Teks yang berisi tahapan atau petunjuk langkah demi langkah yang runtut untuk mencapai hasil tertentu disebut...",
            options: ["Teks Laporan Hasil Observasi", "Teks Prosedur", "Teks Cerita Pendek", "Teks Eksposisi"],
            answer: 1,
            explanation: "Teks prosedur adalah teks yang menjelaskan cara membuat atau melakukan sesuatu secara berurutan dan terstruktur.",
            xp: 50
        },
        {
            id: 2,
            type: "multiple_choice",
            category: "Tujuan Teks",
            question: "Tujuan utama penulisan teks prosedur adalah...",
            options: [
                "Menjelaskan latar belakang peristiwa sejarah",
                "Memandu pembaca agar dapat melakukan atau membuat sesuatu secara tepat dan terukur",
                "Mengkritik kebijakan publik di media massa",
                "Menggambarkan keindahan suasana pantai di sore hari"
            ],
            answer: 1,
            explanation: "Fungsi komunikatif utama teks prosedur adalah memberi petunjuk kerja/tindakan agar tujuan tercapai tanpa kegagalan.",
            xp: 50
        },
        {
            id: 3,
            type: "multiple_choice",
            category: "Struktur Teks",
            question: "Perhatikan kutipan teks berikut:\n'Dengan membuat perangkap nyamuk sederhana dari botol plastik bekas ini, lingkungan rumah kita terbebas dari gigitan nyamuk demam berdarah secara hemat dan ramah lingkungan.'\nKutipan tersebut merupakan bagian struktur...",
            options: ["Tujuan", "Bahan dan Alat", "Langkah-langkah", "Penutup / Simpulan"],
            answer: 3,
            explanation: "Kutipan tersebut menyampaikan manfaat akhir, apresiasi, dan simpulan atas prosedur yang telah dilakukan (Bagian Penutup).",
            xp: 50
        },
        {
            id: 4,
            type: "multiple_choice",
            category: "Ciri Kebahasaan",
            question: "Manakah di antara kelompok kata berikut yang semuanya merupakan kata kerja imperatif (perintah)?",
            options: [
                "Mencuci, memasak, menggoreng",
                "Cucilah, tuangkan, rebuslah",
                "Pencucian, pemasakan, penggorengan",
                "Tercuci, termasak, tergoreng"
            ],
            answer: 1,
            explanation: "Kata 'Cucilah', 'tuangkan', dan 'rebuslah' berakhiran -lah dan -kan yang berfungsi membentuk kalimat imperatif (perintah).",
            xp: 50
        },
        {
            id: 5,
            type: "multiple_choice",
            category: "Konjungsi Temporal",
            question: "Konjungsi temporal yang tepat untuk menghubungkan urutan langkah kerja adalah...",
            options: ["Karena, sebab, oleh karena itu", "Kemudian, setelah itu, selanjutnya", "Walaupun, meskipun, kendati", "Dan, serta, bersama"],
            answer: 1,
            explanation: "Kata 'kemudian', 'setelah itu', dan 'selanjutnya' adalah konjungsi temporal yang menyatakan urutan waktu kejadian.",
            xp: 50
        },
        {
            id: 6,
            type: "multiple_choice",
            category: "Kata Bilangan / Numeralia",
            question: "Kalimat prosedur berikut yang mengandung kata bilangan (takaran pasti) adalah...",
            options: [
                "Beri sedikit garam ke dalam masakan.",
                "Larutkan 1 sendok teh baking soda ke dalam 250 ml air hangat.",
                "Tunggulah beberapa saat sampai adonan mengembang.",
                "Gunakan wadah yang berukuran cukup besar."
            ],
            answer: 1,
            explanation: "'1 sendok teh' dan '250 ml' merupakan kata bilangan/takaran pasti yang menjadi ciri khas teks prosedur yang baik.",
            xp: 50
        },
        {
            id: 7,
            type: "multiple_choice",
            category: "Keterangan Cara",
            question: "Cermati kalimat berikut:\n'Kocok telur dan gula menggunakan mixer pada kecepatan tinggi hingga mengembang putih.'\nFrasa yang menyatakan keterangan cara dan alat pada kalimat di atas adalah...",
            options: [
                "Kocok telur",
                "Gula dan telur",
                "Menggunakan mixer pada kecepatan tinggi",
                "Hingga mengembang"
            ],
            answer: 2,
            explanation: "'Menggunakan mixer' menyatakan keterangan alat, dan 'pada kecepatan tinggi' menyatakan keterangan cara.",
            xp: 50
        },
        {
            id: 8,
            type: "multiple_choice",
            category: "Analisis Logika Langkah",
            question: "Perhatikan langkah acak pembuatan lilin aromaterapi berikut:\n1. Teteskan 10 tetes minyak esensial lavender.\n2. Lelehkan potongan lilin parafin di dalam wadah tahan panas.\n3. Masukkan sumbu lilin tegak di tengah gelas kaca.\n4. Tuangkan lelehan lilin ke dalam gelas dan tunggu hingga mengeras.\nUrutan pembuatan yang paling tepat dan logis adalah...",
            options: ["2 - 1 - 3 - 4", "3 - 2 - 1 - 4", "2 - 3 - 1 - 4", "1 - 2 - 3 - 4"],
            answer: 1,
            explanation: "Urutan logis: Menyiapkan sumbu di gelas (3) -> Melelehkan lilin (2) -> Meneteskan minyak esensial (1) -> Menuang ke gelas dan mendinginkan (4).",
            xp: 60
        },
        {
            id: 9,
            type: "multiple_choice",
            category: "Analisis Struktur",
            question: "Bagian struktur teks prosedur yang memuat rincian benda, alat kerja, dan kuantitas material yang diperlukan disebut...",
            options: ["Bagian Tujuan", "Bagian Material (Alat dan Bahan)", "Bagian Langkah-langkah", "Bagian Orientasi"],
            answer: 1,
            explanation: "Bagian Material (Alat dan Bahan) berisi perincian peralatan serta bahan mentah beserta takarannya.",
            xp: 50
        },
        {
            id: 10,
            type: "multiple_choice",
            category: "Perbaikan Kalimat",
            question: "Perhatikan kalimat tidak efektif ini: 'Kamu jangan sampai lupa untuk tidak membuka tutup panci sebelum airnya mendidih.'\nPerbaikan kalimat agar menjadi kalimat imperatif prosedur yang lugas adalah...",
            options: [
                "Buka saja tutup panci tersebut sekarang juga.",
                "Jangan buka tutup panci sebelum air mendidih!",
                "Mengapa kamu membuka tutup panci sebelum air mendidih?",
                "Tutup panci sebaiknya dipikirkan untuk dibuka jika perlu."
            ],
            answer: 1,
            explanation: "Kalimat 'Jangan buka tutup panci sebelum air mendidih!' lugas, tegas, tidak bermakna ganda, dan berbentuk kalimat larangan/imperatif baku.",
            xp: 60
        },
        {
            id: 11,
            type: "multiple_choice",
            category: "Kaidah Kebahasaan",
            question: "Kata serapan dan istilah teknis sering muncul pada teks prosedur bertema teknologi. Manakah istilah yang tepat digunakan dalam teks 'Cara Menginstal Aplikasi di Komputer'?",
            options: ["Menggoreng, menumis, merebus", "Download, setup wizard, install, reboot", "Gunting, lem, lipat, tempel", "Pupuk, semai, siram, panen"],
            answer: 1,
            explanation: "Download, setup wizard, install, dan reboot adalah istilah khusus (leksikon teknis) bidang teknologi komputer.",
            xp: 50
        },
        {
            id: 12,
            type: "multiple_choice",
            category: "Jenis Teks Prosedur",
            question: "Teks prosedur yang menjelaskan langkah-langkah sederhana hanya dengan 2-3 langkah saja disebut...",
            options: ["Teks Prosedur Protokol", "Teks Prosedur Sederhana", "Teks Prosedur Kompleks", "Teks Prosedur Naratif"],
            answer: 1,
            explanation: "Teks prosedur sederhana hanya membutuhkan 2 hingga 3 tahapan singkat (contoh: cara menyalakan senter, cara mengunci pintu digital).",
            xp: 50
        },
        {
            id: 13,
            type: "multiple_choice",
            category: "Jenis Teks Prosedur",
            question: "Teks prosedur yang langkah-langkahnya sangat fleksibel dan urutannya tidak harus kaku/mutlak disebut...",
            options: ["Teks Prosedur Kompleks", "Teks Prosedur Sederhana", "Teks Prosedur Protokol", "Teks Eksplanasi"],
            answer: 2,
            explanation: "Teks prosedur protokol langkahnya fleksibel dan dapat diubah urutannya asalkan tujuan akhirnya tetap tercapai (misal: cara mencuci piring atau memasak mi instan dengan variasi langkah).",
            xp: 50
        },
        {
            id: 14,
            type: "multiple_choice",
            category: "HOTS - Analisis Kesalahan Teks",
            question: "Cermati kutipan petunjuk berikut:\n'1. Teteskan pewarna makanan merah ke dalam adonan.\n2. Siapkan wadah mangkuk dan sendok aduk.\n3. Aduk adonan hingga warna merata sempurna.'\nKelemahan paling mendasar dari petunjuk di atas adalah...",
            options: [
                "Tidak menggunakan bahasa Indonesia yang baku",
                "Urutan langkah tidak logis karena menyiapkan wadah ditempatkan setelah meneteskan pewarna",
                "Kalimatnya terlalu panjang dan sulit dibaca",
                "Tidak menggunakan tanda seru pada akhir kalimat"
            ],
            answer: 1,
            explanation: "Menyiapkan wadah (langkah 2) seharusnya dilakukan paling awal sebelum bahan diolah.",
            xp: 70
        },
        {
            id: 15,
            type: "multiple_choice",
            category: "Keterangan Waktu",
            question: "Manakah kalimat prosedur di bawah ini yang menggunakan keterangan pembatasan waktu yang tepat?",
            options: [
                "Jemur pakaian basah hingga beberapa hari lamanya.",
                "Panggang roti di dalam oven bersuhu 180°C selama 15 menit.",
                "Tunggulah sampai kamu merasa adonan sudah cukup matang.",
                "Diamkan adonan sebentar saja di atas meja makan."
            ],
            answer: 1,
            explanation: "'selama 15 menit' adalah keterangan pembatasan durasi waktu yang terukur dan presisi.",
            xp: 50
        },
        {
            id: 16,
            type: "multiple_choice",
            category: "HOTS - Rekonstruksi Teks",
            question: "Kamu diminta membuat teks prosedur berjudul 'Cara Membuat Akun Email Sekolah untuk Siswa Kelas IX'. Bagian TUJUAN yang paling tepat adalah...",
            options: [
                "Email adalah sarana surat menyurat elektronik yang diciptakan pada abad ke-20.",
                "Panduan ini mempermudah siswa membuat akun email resmi sekolah guna mengakses materi Google Classroom dan tugas daring.",
                "Guru Bahasa Indonesia memeriksa email siswa setiap hari Senin.",
                "Banyak siswa yang lupa kata sandi email mereka saat ujian berlangsung."
            ],
            answer: 1,
            explanation: "Pilihan tersebut memuat target sasaran (siswa kelas IX) dan manfaat praktis pembuatan email resmi sekolah.",
            xp: 70
        },
        {
            id: 17,
            type: "multiple_choice",
            category: "Kalimat Saran / Larangan",
            question: "Manakah kalimat berikut yang merupakan contoh kalimat larangan dalam teks prosedur keselamatan kerja bengkel sekolah?",
            options: [
                "Sebaiknya kenakan kacamata pelindung saat menggerinda besi.",
                "Gunakan sarung tangan karet berstandar SNI.",
                "Dilarang keras menyentuh mata pisau gergaji mesin saat kabel masih terhubung ke aliran listrik!",
                "Bersihkan meja kerja setelah semua pekerjaan selesai."
            ],
            answer: 2,
            explanation: "Kata 'Dilarang keras...' merupakan bentuk kalimat larangan tegas demi mencegah kecelakaan kerja.",
            xp: 50
        },
        {
            id: 18,
            type: "multiple_choice",
            category: "Verba Material",
            question: "Kata kerja berikut yang termasuk verba material (menunjukkan tindakan fisik secara nyata) adalah...",
            options: ["Memahami, menyukai, mengerti", "Memotong, mencampurkan, menumbuk", "Mengetahui, menduga, merasakan", "Menginginkan, mengharapkan, menyetujui"],
            answer: 1,
            explanation: "Memotong, mencampurkan, dan menumbuk adalah tindakan fisik nyata (verba material) yang dapat diamati panca indera.",
            xp: 50
        },
        {
            id: 19,
            type: "multiple_choice",
            category: "HOTS - Evaluasi SOP",
            question: "Sebuah SOP di perpustakaan sekolah menuliskan: 'Kembalikan buku pada rak yang benar.' Namun banyak siswa salah meletakkan buku karena tidak tahu posisi rak aslinya. Perbaikan teks prosedur yang paling solutif adalah...",
            options: [
                "Kembalikan buku ke rak mana saja yang kosong sesuka hati.",
                "Letakkan buku yang telah selesai dibaca di atas 'Troli Pengembalian Buku' agar petugas perpustakaan dapat menatanya sesuai nomor klasifikasi.",
                "Buku tidak perlu dikembalikan jika belum selesai dibaca.",
                "Jangan membaca buku di perpustakaan jika tidak hafal letak raknya."
            ],
            answer: 1,
            explanation: "Instruksi yang solutif memberikan solusi konkret dan alur yang jelas untuk mencegah kesalahan penataan buku.",
            xp: 70
        },
        {
            id: 20,
            type: "multiple_choice",
            category: "Simpulan Kompetensi",
            question: "Mengapa teks prosedur harus ditulis dengan bahasa yang komunikatif, lugas, dan tidak berbelit-belit?",
            options: [
                "Agar teks terlihat lebih panjang dan tebal saat dicetak",
                "Agar pembaca dari berbagai latar belakang dapat mengikuti instruksi dengan tepat tanpa salah tafsir",
                "Agar teks prosedur bisa diubah menjadi naskah drama panggung",
                "Agar penulis mendapatkan royalti dari penerbit buku"
            ],
            answer: 1,
            explanation: "Kejelasan bahasa pada teks prosedur mencegah multi-tafsir dan menjamin keberhasilan serta keselamatan pembaca saat mempraktikkan langkah-langkahnya.",
            xp: 60
        }
    ]
};

// Export ke window agar dapat diakses dari seluruh skrip
window.GAME_DATA = GAME_DATA;
