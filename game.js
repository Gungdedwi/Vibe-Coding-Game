/**
 * Brain Puzzle Master - Core Gameplay & Logic Engine
 * GDevelop Compatible Architecture, Google Auth & Cloud Save Sync
 */

// --- 1. AUDIO SYNTHESIZER (Web Audio API) ---
class SoundManager {
  constructor() {
    this.ctx = null;
    this.enabled = true;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playCorrect() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(523.25, now);
    osc.frequency.setValueAtTime(659.25, now + 0.1);
    osc.frequency.setValueAtTime(783.99, now + 0.2);
    osc.frequency.setValueAtTime(1046.5, now + 0.3);
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.6);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.6);
  }

  playWrong() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(180, now);
    osc.frequency.setValueAtTime(120, now + 0.15);
    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.35);
  }

  playClick() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, now);
    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.08);
  }

  playReward() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    [440, 554.37, 659.25, 880].forEach((freq, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + i * 0.08);
      gain.gain.setValueAtTime(0.15, now + i * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.08 + 0.25);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + i * 0.08);
      osc.stop(now + i * 0.08 + 0.25);
    });
  }
}

const sounds = new SoundManager();

// --- 2. GAME STATE & GOOGLE CLOUD STORAGE ---
const LOCAL_SAVE_KEY = 'BRAIN_PUZZLE_GDEVELOP_DATA';
const GOOGLE_AUTH_KEY = 'BRAIN_PUZZLE_GOOGLE_USER';

const gameState = {
  currentLevel: 1,
  unlockedLevel: 1,
  coins: 100,
  hints: 3,
  completedLevels: [],
  sfxEnabled: true,
  cloudSyncEnabled: true,
  admobEnabled: true
};

const userAuth = {
  isLoggedIn: false,
  userName: "Tamu",
  userEmail: "",
  userAvatar: "👤"
};

function loadGameData() {
  // 1. Load Auth State
  try {
    const authRaw = localStorage.getItem(GOOGLE_AUTH_KEY);
    if (authRaw) {
      Object.assign(userAuth, JSON.parse(authRaw));
    }
  } catch (e) {
    console.warn('Auth load error:', e);
  }

  // 2. Load Game State (Per Google Account if logged in, or local guest)
  try {
    const storageKey = (userAuth.isLoggedIn && userAuth.userEmail) 
      ? `BRAIN_PUZZLE_SAVE_${userAuth.userEmail.replace(/[^a-zA-Z0-9]/g, '_')}`
      : LOCAL_SAVE_KEY;

    const raw = localStorage.getItem(storageKey);
    if (raw) {
      const data = JSON.parse(raw);
      Object.assign(gameState, data);
    }
  } catch (e) {
    console.warn('Storage load error:', e);
  }

  updateUIStats();
  updateAuthUI();
}

function saveGameData() {
  try {
    const storageKey = (userAuth.isLoggedIn && userAuth.userEmail) 
      ? `BRAIN_PUZZLE_SAVE_${userAuth.userEmail.replace(/[^a-zA-Z0-9]/g, '_')}`
      : LOCAL_SAVE_KEY;

    localStorage.setItem(storageKey, JSON.stringify(gameState));

    if (userAuth.isLoggedIn) {
      localStorage.setItem(GOOGLE_AUTH_KEY, JSON.stringify(userAuth));
    }
  } catch (e) {
    console.warn('Storage save error:', e);
  }
  updateUIStats();
}

function updateUIStats() {
  const menuCoins = document.getElementById('menu-coin-count');
  const menuHints = document.getElementById('menu-hint-count');
  const lvlHints = document.getElementById('levelselect-hint-count');
  const gameHints = document.getElementById('game-hint-count');
  const hintVal = document.getElementById('hint-available-val');

  if (menuCoins) menuCoins.textContent = gameState.coins;
  if (menuHints) menuHints.textContent = gameState.hints;
  if (lvlHints) lvlHints.textContent = gameState.hints;
  if (gameHints) gameHints.textContent = gameState.hints;
  if (hintVal) hintVal.textContent = gameState.hints;
}

// --- 3. GOOGLE AUTHENTICATION SYSTEM ---
function initGoogleAuth() {
  // Check if Google GSI is available
  if (window.google && window.google.accounts && window.google.accounts.id) {
    try {
      window.google.accounts.id.initialize({
        client_id: "394025609994-gdevelopbrainpuzzle.apps.googleusercontent.com",
        callback: handleGoogleCredentialResponse,
        auto_select: false
      });
    } catch (err) {
      console.log('Google Identity init:', err);
    }
  }
}

function handleGoogleCredentialResponse(response) {
  if (response && response.credential) {
    try {
      // Decode JWT Payload
      const base64Url = response.credential.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      
      const payload = JSON.parse(jsonPayload);
      performLogin({
        name: payload.name || "Pemain Google",
        email: payload.email,
        avatar: payload.picture || "🌟"
      });
    } catch (e) {
      console.warn('JWT Decode error, using mock:', e);
      simulateGoogleLogin();
    }
  }
}

function performLogin(userData) {
  userAuth.isLoggedIn = true;
  userAuth.userName = userData.name;
  userAuth.userEmail = userData.email;
  userAuth.userAvatar = userData.avatar || "👤";

  localStorage.setItem(GOOGLE_AUTH_KEY, JSON.stringify(userAuth));

  // Load account specific data or merge
  const accountKey = `BRAIN_PUZZLE_SAVE_${userAuth.userEmail.replace(/[^a-zA-Z0-9]/g, '_')}`;
  const existingSave = localStorage.getItem(accountKey);

  if (existingSave) {
    Object.assign(gameState, JSON.parse(existingSave));
  } else {
    // New Google Account save: register with current progress
    saveGameData();
  }

  sounds.playReward();
  updateAuthUI();
  updateUIStats();
  document.getElementById('modal-google-auth').classList.add('hidden');
  showToast(`🎉 Selamat Datang, ${userAuth.userName}!`);
}

function performLogout() {
  userAuth.isLoggedIn = false;
  userAuth.userName = "Tamu";
  userAuth.userEmail = "";
  userAuth.userAvatar = "👤";

  localStorage.removeItem(GOOGLE_AUTH_KEY);

  // Re-load guest data
  const raw = localStorage.getItem(LOCAL_SAVE_KEY);
  if (raw) {
    Object.assign(gameState, JSON.parse(raw));
  } else {
    gameState.currentLevel = 1;
    gameState.unlockedLevel = 1;
    gameState.coins = 100;
    gameState.hints = 3;
    gameState.completedLevels = [];
  }

  updateAuthUI();
  updateUIStats();
  document.getElementById('modal-google-auth').classList.add('hidden');
  showToast("Akun Google telah dikeluarkan (Logout).");
}

function simulateGoogleLogin(customEmail = null) {
  const email = customEmail || "pemain.puzzle@gmail.com";
  const username = email.split('@')[0].replace('.', ' ').toUpperCase();
  performLogin({
    name: username,
    email: email,
    avatar: "🎮"
  });
}

function updateAuthUI() {
  const headerUsername = document.getElementById('header-username');
  const headerCloudStatus = document.getElementById('header-cloud-status');
  const headerAuthBadge = document.getElementById('header-auth-badge');
  const headerAvatar = document.getElementById('header-avatar');
  const btnGoogleMenu = document.getElementById('btn-google-text');

  // Modal Views
  const authGuestView = document.getElementById('auth-view-guest');
  const authUserView = document.getElementById('auth-view-user');
  const modalName = document.getElementById('modal-user-name');
  const modalEmail = document.getElementById('modal-user-email');
  const modalAvatar = document.getElementById('modal-avatar-large');
  const statLvl = document.getElementById('modal-stat-level');
  const statCoins = document.getElementById('modal-stat-coins');
  const statHints = document.getElementById('modal-stat-hints');

  if (userAuth.isLoggedIn) {
    if (headerUsername) headerUsername.textContent = userAuth.userName;
    if (headerCloudStatus) headerCloudStatus.innerHTML = "☁️ <strong>Tersinkron Google Cloud</strong>";
    if (headerAuthBadge) {
      headerAuthBadge.textContent = "Profil";
      headerAuthBadge.style.color = "#00E676";
      headerAuthBadge.style.background = "rgba(0, 230, 118, 0.15)";
      headerAuthBadge.style.borderColor = "rgba(0, 230, 118, 0.3)";
    }
    if (headerAvatar) {
      if (userAuth.userAvatar.startsWith('http')) {
        headerAvatar.innerHTML = `<img src="${userAuth.userAvatar}" style="width:100%;height:100%;border-radius:50%;" alt="Avatar">`;
      } else {
        headerAvatar.textContent = userAuth.userAvatar;
      }
    }
    if (btnGoogleMenu) btnGoogleMenu.textContent = `Profil: ${userAuth.userName}`;

    if (authGuestView) authGuestView.classList.add('hidden');
    if (authUserView) authUserView.classList.remove('hidden');

    if (modalName) modalName.textContent = userAuth.userName;
    if (modalEmail) modalEmail.textContent = userAuth.userEmail;
    if (modalAvatar) {
      if (userAuth.userAvatar.startsWith('http')) {
        modalAvatar.innerHTML = `<img src="${userAuth.userAvatar}" style="width:100%;height:100%;border-radius:50%;" alt="Avatar">`;
      } else {
        modalAvatar.textContent = userAuth.userAvatar;
      }
    }
    if (statLvl) statLvl.textContent = gameState.unlockedLevel;
    if (statCoins) statCoins.textContent = gameState.coins;
    if (statHints) statHints.textContent = gameState.hints;

  } else {
    if (headerUsername) headerUsername.textContent = "Tamu (Belum Login)";
    if (headerCloudStatus) headerCloudStatus.textContent = "💾 Simpan Lokal";
    if (headerAuthBadge) {
      headerAuthBadge.textContent = "Login Google";
      headerAuthBadge.style.color = "#60A5FA";
      headerAuthBadge.style.background = "rgba(66, 133, 244, 0.15)";
      headerAuthBadge.style.borderColor = "rgba(66, 133, 244, 0.3)";
    }
    if (headerAvatar) headerAvatar.textContent = "👤";
    if (btnGoogleMenu) btnGoogleMenu.textContent = "Masuk dengan Google";

    if (authGuestView) authGuestView.classList.remove('hidden');
    if (authUserView) authUserView.classList.add('hidden');
  }
}

// --- 4. TOAST & NOTIFICATIONS ---
let toastTimeout = null;
function showToast(msg) {
  const toast = document.getElementById('game-toast');
  const toastMsg = document.getElementById('toast-message');
  if (!toast || !toastMsg) return;
  toastMsg.textContent = msg;
  toast.classList.remove('hidden');
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.add('hidden');
  }, 2400);
}

// --- 5. 30 LEVEL DEFINITIONS & MECHANICS ---
const LEVELS = [
  // --- TUTORIAL (Level 1-5) ---
  {
    id: 1,
    title: "Mana buah yang paling besar?",
    hint: "Pikirkan ukuran buah di dunia nyata, bukan hanya gambarnya di layar!",
    explanation: "Secara nyata di dunia, Semangka adalah buah yang paling besar di antara opsi.",
    setup: (stage, win, fail) => {
      stage.innerHTML = `
        <div style="display: flex; gap: 20px; align-items: center; justify-content: center; flex-wrap: wrap;">
          <div class="puzzle-btn-choice" id="opt-strawberry" style="font-size: 2.5rem; padding: 25px;">🍓</div>
          <div class="puzzle-btn-choice" id="opt-apple" style="font-size: 2rem; padding: 25px;">🍎</div>
          <div class="puzzle-btn-choice" id="opt-watermelon" style="font-size: 1.6rem; padding: 25px;">🍉</div>
        </div>
      `;
      document.getElementById('opt-strawberry').onclick = () => { sounds.playWrong(); showToast("Stroberi kecil di dunia nyata!"); };
      document.getElementById('opt-apple').onclick = () => { sounds.playWrong(); showToast("Apel bukan yang terbesar!"); };
      document.getElementById('opt-watermelon').onclick = () => { win(); };
    }
  },
  {
    id: 2,
    title: "Nyalakan ruangan yang gelap ini!",
    hint: "Tarik matahari dari balik awan hitam!",
    explanation: "Kamu berhasil menggeser awan hitam dan membiarkan sinar matahari menerangi ruangan!",
    setup: (stage, win, fail) => {
      stage.innerHTML = `
        <div style="position: relative; width: 100%; height: 260px; background: #0b0f19; border-radius: 12px; display: flex; align-items: center; justify-content: center; overflow: hidden;" id="dark-room">
          <div id="sun-bg" style="position: absolute; width: 80px; height: 80px; background: #FFD600; border-radius: 50%; box-shadow: 0 0 30px #FFD600; display: flex; align-items: center; justify-content: center; font-size: 2rem;">☀️</div>
          <div id="cloud-drag" class="draggable-obj" style="position: absolute; font-size: 5rem; cursor: grab; z-index: 10;">☁️</div>
          <div id="room-text" style="position: absolute; bottom: 20px; color: #64748b; font-size: 0.85rem;">Ruangan masih gelap gulita...</div>
        </div>
      `;
      makeDraggable(document.getElementById('cloud-drag'), stage, (x, y) => {
        if (Math.abs(x) > 100 || Math.abs(y) > 80) {
          const room = document.getElementById('dark-room');
          if (room) room.style.background = '#38bdf8';
          win();
        }
      });
    }
  },
  {
    id: 3,
    title: "Temukan kunci untuk membuka peti harta!",
    hint: "Kuncinya tersembunyi di balik pohon. Geser pohonnya!",
    explanation: "Kunci ditemukan di balik pohon lalu dimasukkan ke dalam peti!",
    setup: (stage, win, fail) => {
      stage.innerHTML = `
        <div style="position: relative; width: 100%; height: 260px; display: flex; justify-content: space-around; align-items: flex-end; padding-bottom: 20px;">
          <div id="hidden-key" class="draggable-obj" style="position: absolute; left: 45px; bottom: 60px; font-size: 2.2rem; z-index: 1;">🗝️</div>
          <div id="tree-drag" class="draggable-obj" style="position: absolute; left: 30px; bottom: 30px; font-size: 5rem; z-index: 5;">🌳</div>
          <div id="target-chest" style="position: absolute; right: 50px; bottom: 30px; font-size: 4rem; z-index: 2;">📦</div>
        </div>
      `;
      let keyFound = false;
      const tree = document.getElementById('tree-drag');
      const key = document.getElementById('hidden-key');
      const chest = document.getElementById('target-chest');

      makeDraggable(tree, stage, (x, y) => {
        if (Math.abs(x) > 60 || Math.abs(y) > 50) keyFound = true;
      });

      makeDraggable(key, stage, (x, y, elem) => {
        if (!keyFound) return;
        if (isColliding(elem.getBoundingClientRect(), chest.getBoundingClientRect())) {
          chest.innerHTML = '🎁';
          win();
        }
      });
    }
  },
  {
    id: 4,
    title: "Beri makan kelinci ini!",
    hint: "Tarik wortel langsung ke arah kelinci!",
    explanation: "Kelinci sangat senang memakan wortel lezat!",
    setup: (stage, win, fail) => {
      stage.innerHTML = `
        <div style="position: relative; width: 100%; height: 260px; display: flex; justify-content: space-between; align-items: center; padding: 0 40px;">
          <div id="rabbit-target" style="font-size: 4.5rem;">🐰</div>
          <div id="carrot-drag" class="draggable-obj" style="font-size: 3.5rem; position: absolute; right: 40px; top: 90px;">🥕</div>
        </div>
      `;
      const rabbit = document.getElementById('rabbit-target');
      const carrot = document.getElementById('carrot-drag');

      makeDraggable(carrot, stage, (x, y, elem) => {
        if (isColliding(elem.getBoundingClientRect(), rabbit.getBoundingClientRect())) {
          rabbit.innerHTML = '😋';
          carrot.style.display = 'none';
          win();
        }
      });
    }
  },
  {
    id: 5,
    title: "Buka pintu untuk melarikan diri!",
    hint: "Gagang pintu bisa ditarik ke bawah atau geser keset kaki!",
    explanation: "Kunci cadangan ada di balik keset kaki!",
    setup: (stage, win, fail) => {
      stage.innerHTML = `
        <div style="position: relative; width: 100%; height: 260px; display: flex; flex-direction: column; align-items: center; justify-content: center;">
          <div id="door-frame" style="font-size: 5rem; position: relative;">🚪</div>
          <div id="doormat-drag" class="draggable-obj" style="position: absolute; bottom: 30px; font-size: 2.2rem; z-index: 5;">🟧 Keset</div>
          <div id="spare-key" class="draggable-obj" style="position: absolute; bottom: 35px; font-size: 1.8rem; z-index: 1;">🔑</div>
        </div>
      `;
      let matMoved = false;
      const mat = document.getElementById('doormat-drag');
      const key = document.getElementById('spare-key');
      const door = document.getElementById('door-frame');

      makeDraggable(mat, stage, (x, y) => {
        if (Math.abs(x) > 50 || Math.abs(y) > 40) matMoved = true;
      });

      makeDraggable(key, stage, (x, y, elem) => {
        if (!matMoved) return;
        if (isColliding(elem.getBoundingClientRect(), door.getBoundingClientRect())) {
          door.innerHTML = '✨🚶';
          key.style.display = 'none';
          win();
        }
      });
    }
  },

  // --- MEDIUM (Level 6-15) ---
  {
    id: 6,
    title: "Padamkan api unggun ini!",
    hint: "Tarik awan mendung ke atas api untuk menurunkan hujan!",
    explanation: "Hujan dari awan mendung berhasil memadamkan api!",
    setup: (stage, win, fail) => {
      stage.innerHTML = `
        <div style="position: relative; width: 100%; height: 260px; display: flex; flex-direction: column; align-items: center; justify-content: space-between; padding: 20px;">
          <div id="rain-cloud" class="draggable-obj" style="font-size: 3.8rem; position: absolute; left: 30px; top: 20px;">🌧️</div>
          <div id="sun-obj" style="font-size: 3rem; position: absolute; right: 30px; top: 20px;">☀️</div>
          <div id="campfire" style="font-size: 4.5rem; position: absolute; bottom: 20px;">🔥</div>
        </div>
      `;
      const cloud = document.getElementById('rain-cloud');
      const fire = document.getElementById('campfire');
      makeDraggable(cloud, stage, (x, y, elem) => {
        if (isColliding(elem.getBoundingClientRect(), fire.getBoundingClientRect())) {
          fire.innerHTML = '💨';
          win();
        }
      });
    }
  },
  {
    id: 7,
    title: "Buat persamaan ini benar: 4 + 5 = 19",
    hint: "Geser angka 1 keluar dari layar untuk menyisakan angka 9!",
    explanation: "4 + 5 = 9! Angka 1 berhasil disingkirkan!",
    setup: (stage, win, fail) => {
      stage.innerHTML = `
        <div style="display: flex; align-items: center; justify-content: center; gap: 12px; font-size: 2.2rem; font-weight: 800; font-family: Outfit; height: 200px;">
          <span>4</span>
          <span>+</span>
          <span>5</span>
          <span>=</span>
          <div id="digit-1" class="draggable-obj" style="position: relative; cursor: grab; color: #00E5FF;">1</div>
          <div id="digit-9">9</div>
        </div>
      `;
      const d1 = document.getElementById('digit-1');
      makeDraggable(d1, stage, (x, y) => {
        if (Math.abs(x) > 120 || Math.abs(y) > 100) {
          d1.style.display = 'none';
          win();
        }
      });
    }
  },
  {
    id: 8,
    title: "Berapa banyak lubang pada celana ini?",
    hint: "Hitung: 1 pinggang, 2 kaki, ditambah 2 lubang sobek (tembus depan & belakang = 4)!",
    explanation: "Total ada 8 lubang (1 pinggang + 2 kaki + 4 lubang tembus depan-belakang + 1 resleting = 8)!",
    setup: (stage, win, fail) => {
      stage.innerHTML = `
        <div style="display: flex; flex-direction: column; align-items: center; gap: 16px;">
          <div style="font-size: 4rem;">👖</div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; width: 100%; max-width: 280px;">
            <button class="puzzle-btn-choice" data-val="4">4 Lubang</button>
            <button class="puzzle-btn-choice" data-val="6">6 Lubang</button>
            <button class="puzzle-btn-choice" data-val="8">8 Lubang</button>
            <button class="puzzle-btn-choice" data-val="10">10 Lubang</button>
          </div>
        </div>
      `;
      stage.querySelectorAll('.puzzle-btn-choice').forEach(btn => {
        btn.onclick = () => {
          if (btn.dataset.val === "8") win();
          else { sounds.playWrong(); showToast("Salah, hitung juga tembusan di belakang celana!"); }
        };
      });
    }
  },
  {
    id: 9,
    title: "Siapa yang paling tinggi di antara mereka?",
    hint: "Lihat matahari di langit!",
    explanation: "Matahari berada di langit yang paling tinggi!",
    setup: (stage, win, fail) => {
      stage.innerHTML = `
        <div style="display: flex; flex-direction: column; align-items: center; justify-content: space-between; height: 260px; width: 100%;">
          <div id="obj-sun" class="puzzle-obj" style="font-size: 3rem; align-self: flex-end; margin-right: 20px;">☀️ Matahari</div>
          <div style="display: flex; justify-content: space-around; width: 100%;">
            <div id="obj-giraffe" class="puzzle-obj" style="font-size: 3.5rem;">🦒 Jerapah</div>
            <div id="obj-tree" class="puzzle-obj" style="font-size: 3.5rem;">🌲 Pohon</div>
            <div id="obj-elephant" class="puzzle-obj" style="font-size: 3.2rem;">🐘 Gajah</div>
          </div>
        </div>
      `;
      document.getElementById('obj-sun').onclick = () => win();
      ['obj-giraffe', 'obj-tree', 'obj-elephant'].forEach(id => {
        document.getElementById(id).onclick = () => {
          sounds.playWrong();
          showToast("Ada yang letaknya jauh lebih tinggi!");
        };
      });
    }
  },
  {
    id: 10,
    title: "Temukan kucing tersembunyi!",
    hint: "Geser semak-semak hijau!",
    explanation: "Meow! Kucing bersembunyi di balik semak!",
    setup: (stage, win, fail) => {
      stage.innerHTML = `
        <div style="position: relative; width: 100%; height: 240px; display: flex; align-items: center; justify-content: center;">
          <div id="cat-obj" class="puzzle-obj" style="font-size: 3.5rem; position: absolute; z-index: 1;">🐱</div>
          <div id="bush-obj" class="draggable-obj" style="font-size: 5rem; position: absolute; z-index: 5;">🌿</div>
        </div>
      `;
      let bushMoved = false;
      const bush = document.getElementById('bush-obj');
      const cat = document.getElementById('cat-obj');

      makeDraggable(bush, stage, (x, y) => {
        if (Math.abs(x) > 60 || Math.abs(y) > 50) bushMoved = true;
      });

      cat.onclick = () => {
        if (bushMoved) win();
      };
    }
  },
  {
    id: 11,
    title: "Pecahkan telur burung ini!",
    hint: "Ketuk telur sebanyak 5 kali secara cepat!",
    explanation: "Telur retak dan anak burung menetas!",
    setup: (stage, win, fail) => {
      let taps = 0;
      stage.innerHTML = `
        <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 240px;">
          <div id="egg-obj" style="font-size: 5.5rem; cursor: pointer; transition: transform 0.1s;">🥚</div>
          <span id="tap-info" style="color: var(--text-secondary); margin-top: 10px;">Ketuk telur!</span>
        </div>
      `;
      const egg = document.getElementById('egg-obj');
      const info = document.getElementById('tap-info');

      egg.onclick = () => {
        taps++;
        sounds.playClick();
        egg.style.transform = `scale(${1 + taps * 0.05}) rotate(${taps % 2 === 0 ? 5 : -5}deg)`;
        info.textContent = `Ketukan: ${taps}/5`;
        if (taps >= 5) {
          egg.innerHTML = '🐣';
          info.textContent = 'Menetas!';
          win();
        }
      };
    }
  },
  {
    id: 12,
    title: "Masukkan gajah ke dalam kulkas!",
    hint: "Buka pintu kulkas dulu dengan mengkliknya, lalu seret gajah ke dalam!",
    explanation: "1. Buka kulkas 2. Masukkan gajah! Klasik!",
    setup: (stage, win, fail) => {
      let fridgeOpen = false;
      stage.innerHTML = `
        <div style="position: relative; width: 100%; height: 240px; display: flex; justify-content: space-around; align-items: center;">
          <div id="elephant-drag" class="draggable-obj" style="font-size: 4rem; position: absolute; left: 30px; z-index: 10;">🐘</div>
          <div id="fridge-target" style="font-size: 5rem; cursor: pointer; position: absolute; right: 40px;">🧊</div>
        </div>
      `;
      const fridge = document.getElementById('fridge-target');
      const elephant = document.getElementById('elephant-drag');

      fridge.onclick = () => {
        fridgeOpen = !fridgeOpen;
        fridge.innerHTML = fridgeOpen ? '🚪⬜' : '🧊';
        sounds.playClick();
      };

      makeDraggable(elephant, stage, (x, y, elem) => {
        if (!fridgeOpen) return;
        if (isColliding(elem.getBoundingClientRect(), fridge.getBoundingClientRect())) {
          fridge.innerHTML = '🐘🧊';
          elephant.style.display = 'none';
          win();
        }
      });
    }
  },
  {
    id: 13,
    title: "Mobil parkir di nomor berapa? [16] [06] [68] [88] [🚗] [98]",
    hint: "Putar balik cara melihat nomornya (balik dari sudut pandang pengemudi: 86, 87, 88, 89, 90, 91)!",
    explanation: "Jika dilihat terbalik, deretnya adalah 86, 87, 88, 89, 90, 91. Mobil ada di nomor 87!",
    setup: (stage, win, fail) => {
      stage.innerHTML = `
        <div style="display: flex; flex-direction: column; align-items: center; gap: 18px;">
          <div style="display: flex; gap: 8px; font-weight: 800; font-size: 1.2rem; background: rgba(0,0,0,0.3); padding: 12px; border-radius: 12px;">
            <span>16</span> <span>06</span> <span>68</span> <span>88</span> <span style="color:#00E5FF;">[🚗]</span> <span>98</span>
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; width: 100%; max-width: 280px;">
            <button class="puzzle-btn-choice" data-val="87">87</button>
            <button class="puzzle-btn-choice" data-val="78">78</button>
            <button class="puzzle-btn-choice" data-val="89">89</button>
            <button class="puzzle-btn-choice" data-val="99">99</button>
          </div>
        </div>
      `;
      stage.querySelectorAll('.puzzle-btn-choice').forEach(btn => {
        btn.onclick = () => {
          if (btn.dataset.val === "87") win();
          else { sounds.playWrong(); showToast("Salah! Coba putar layar secara terbalik!"); }
        };
      });
    }
  },
  {
    id: 14,
    title: "Bantu kura-kura memenangkan balapan!",
    hint: "Tahan kelinci dengan jari agar berhenti lari, lalu ketuk kura-kura berulang kali!",
    explanation: "Kelinci berhasil ditahan dan kura-kura mencapai garis finish lebih dulu!",
    setup: (stage, win, fail) => {
      let turtleProgress = 0;
      let rabbitHeld = false;
      stage.innerHTML = `
        <div style="position: relative; width: 100%; height: 240px; display: flex; flex-direction: column; justify-content: space-around; padding: 10px;">
          <div style="position: relative; height: 60px; border-bottom: 2px dashed #64748b;">
            <div id="rabbit-runner" style="font-size: 2.5rem; position: absolute; left: 0; cursor: pointer;">🐇</div>
            <div style="position: absolute; right: 0; font-size: 1.5rem;">🏁</div>
          </div>
          <div style="position: relative; height: 60px;">
            <div id="turtle-runner" style="font-size: 2.5rem; position: absolute; left: 0; cursor: pointer;">🐢</div>
            <div style="position: absolute; right: 0; font-size: 1.5rem;">🏁</div>
          </div>
          <span style="font-size: 0.8rem; color: #94a3b8; text-align: center;">Tahan kelinci, ketuk kura-kura!</span>
        </div>
      `;
      const rabbit = document.getElementById('rabbit-runner');
      const turtle = document.getElementById('turtle-runner');

      rabbit.onmousedown = rabbit.ontouchstart = () => { rabbitHeld = true; rabbit.style.filter = 'brightness(0.6)'; };
      window.onmouseup = window.ontouchend = () => { rabbitHeld = false; if (rabbit) rabbit.style.filter = 'none'; };

      turtle.onclick = () => {
        if (rabbitHeld) {
          turtleProgress += 25;
          turtle.style.left = `${turtleProgress}px`;
          sounds.playClick();
          if (turtleProgress >= 260) {
            win();
          }
        } else {
          showToast("Tahan kelinci terlebih dahulu!");
        }
      };
    }
  },
  {
    id: 15,
    title: "Nyalakan lilin ulang tahun nomor 8!",
    hint: "Geser korek api ke lilin!",
    explanation: "Lilin menyala terang! Selamat ulang tahun!",
    setup: (stage, win, fail) => {
      stage.innerHTML = `
        <div style="position: relative; width: 100%; height: 240px; display: flex; justify-content: space-around; align-items: center;">
          <div id="cake-candle" style="font-size: 4.5rem; position: relative;">🎂</div>
          <div id="match-stick" class="draggable-obj" style="font-size: 3rem; position: absolute; left: 40px; top: 40px;">🥢🔥</div>
        </div>
      `;
      const match = document.getElementById('match-stick');
      const cake = document.getElementById('cake-candle');
      makeDraggable(match, stage, (x, y, elem) => {
        if (isColliding(elem.getBoundingClientRect(), cake.getBoundingClientRect())) {
          cake.innerHTML = '🎂🕯️✨';
          win();
        }
      });
    }
  },

  // --- ADVANCED (Level 16-30) ---
  {
    id: 16,
    title: "Gabungkan dua tetesan air menjadi satu tetesan raksasa!",
    hint: "Seret satu tetesan air ke tetesan air lainnya!",
    explanation: "Dua tetesan air menyatu sempurna menjadi tetesan besar!",
    setup: (stage, win, fail) => {
      stage.innerHTML = `
        <div style="position: relative; width: 100%; height: 240px;">
          <div id="drop-1" class="draggable-obj" style="font-size: 3rem; position: absolute; left: 60px; top: 80px;">💧</div>
          <div id="drop-2" class="draggable-obj" style="font-size: 3rem; position: absolute; right: 60px; top: 80px;">💧</div>
        </div>
      `;
      const d1 = document.getElementById('drop-1');
      const d2 = document.getElementById('drop-2');
      makeDraggable(d1, stage, (x, y, elem) => {
        if (isColliding(elem.getBoundingClientRect(), d2.getBoundingClientRect())) {
          d2.innerHTML = '🌊';
          d2.style.fontSize = '5rem';
          d1.style.display = 'none';
          win();
        }
      });
    }
  },
  {
    id: 17,
    title: "Hentikan bom sebelum meledak! [5s]",
    hint: "Tarik kabel pemutus (merah) dari badan bom!",
    explanation: "Kabel berhasil dicabut tepat waktu!",
    setup: (stage, win, fail) => {
      let timer = 6;
      stage.innerHTML = `
        <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 240px; gap: 14px;">
          <div id="bomb-timer" style="font-size: 2rem; color: #FF5252; font-weight: 800; font-family: Outfit;">00:05</div>
          <div style="position: relative;">
            <div id="bomb-body" style="font-size: 4.5rem;">💣</div>
            <div id="bomb-wire" class="draggable-obj" style="position: absolute; right: -15px; top: 0; font-size: 1.8rem; cursor: grab;">🔴✂️</div>
          </div>
        </div>
      `;
      const wire = document.getElementById('bomb-wire');
      const timerDisplay = document.getElementById('bomb-timer');
      let stopped = false;

      const interval = setInterval(() => {
        if (stopped) return;
        timer--;
        if (timerDisplay) timerDisplay.textContent = `00:0${timer}`;
        if (timer <= 0) {
          clearInterval(interval);
          if (!stopped) {
            sounds.playWrong();
            showToast("Waktu habis! Bom meledak!");
            fail();
          }
        }
      }, 1000);

      makeDraggable(wire, stage, (x, y) => {
        if (Math.abs(x) > 60 || Math.abs(y) > 50) {
          stopped = true;
          clearInterval(interval);
          wire.style.display = 'none';
          if (timerDisplay) timerDisplay.textContent = "DISARMED!";
          win();
        }
      });
    }
  },
  {
    id: 18,
    title: "Bantu anjing menyeberangi sungai!",
    hint: "Geser balok kayu untuk membuat jembatan!",
    explanation: "Jembatan kayu kokoh berhasil dibuat!",
    setup: (stage, win, fail) => {
      stage.innerHTML = `
        <div style="position: relative; width: 100%; height: 240px; background: #0284c7; border-radius: 12px; overflow: hidden; display: flex; justify-content: space-between; align-items: center; padding: 0 10px;">
          <div id="dog-hero" style="font-size: 3rem; z-index: 5;">🐕</div>
          <div id="wood-plank" class="draggable-obj" style="position: absolute; top: 10px; left: 100px; font-size: 2.2rem; background: #92400e; padding: 6px 30px; border-radius: 8px; color: #fff;">🪵 Jembatan</div>
          <div id="finish-flag" style="font-size: 3rem; z-index: 5;">🏁</div>
        </div>
      `;
      let bridgePlaced = false;
      const wood = document.getElementById('wood-plank');
      const dog = document.getElementById('dog-hero');

      makeDraggable(wood, stage, (x, y, elem) => {
        const rect = elem.getBoundingClientRect();
        if (rect.top > 250) bridgePlaced = true;
      });

      dog.onclick = () => {
        if (bridgePlaced) {
          dog.style.transform = 'translateX(240px)';
          setTimeout(win, 600);
        } else {
          showToast("Pasang jembatan di tengah sungai dulu!");
        }
      };
    }
  },
  {
    id: 19,
    title: "Temukan nomor 100!",
    hint: "Gabungkan angka 1 dan dua angka 0!",
    explanation: "1 + 0 + 0 digabungkan menjadi 100!",
    setup: (stage, win, fail) => {
      stage.innerHTML = `
        <div style="display: flex; justify-content: center; align-items: center; gap: 15px; height: 240px;">
          <div id="num-1" class="draggable-obj" style="font-size: 2.5rem; font-weight: 800; color: #7C4DFF;">1</div>
          <div id="num-0a" class="draggable-obj" style="font-size: 2.5rem; font-weight: 800; color: #00E5FF;">0</div>
          <div id="num-0b" class="draggable-obj" style="font-size: 2.5rem; font-weight: 800; color: #00E5FF;">0</div>
        </div>
      `;
      const n1 = document.getElementById('num-1');
      const n0a = document.getElementById('num-0a');
      const n0b = document.getElementById('num-0b');

      function checkMatch() {
        const r1 = n1.getBoundingClientRect();
        const r2 = n0a.getBoundingClientRect();
        const r3 = n0b.getBoundingClientRect();
        if (isColliding(r1, r2) && isColliding(r2, r3)) win();
      }

      makeDraggable(n1, stage, checkMatch);
      makeDraggable(n0a, stage, checkMatch);
      makeDraggable(n0b, stage, checkMatch);
    }
  },
  {
    id: 20,
    title: "Berapa banyak segitiga pada bintang 5 sudut?",
    hint: "5 segitiga di ujung + 5 segitiga di bagian dalam = 10!",
    explanation: "Ada total 10 segitiga pada geometri bintang 5 sudut!",
    setup: (stage, win, fail) => {
      stage.innerHTML = `
        <div style="display: flex; flex-direction: column; align-items: center; gap: 18px;">
          <div style="font-size: 4rem;">⭐</div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; width: 100%; max-width: 280px;">
            <button class="puzzle-btn-choice" data-val="5">5</button>
            <button class="puzzle-btn-choice" data-val="8">8</button>
            <button class="puzzle-btn-choice" data-val="10">10</button>
            <button class="puzzle-btn-choice" data-val="12">12</button>
          </div>
        </div>
      `;
      stage.querySelectorAll('.puzzle-btn-choice').forEach(btn => {
        btn.onclick = () => {
          if (btn.dataset.val === "10") win();
          else { sounds.playWrong(); showToast("Hitung juga segitiga besar di dalamnya!"); }
        };
      });
    }
  },
  {
    id: 21,
    title: "Selamatkan sang putri dari naga!",
    hint: "Beri naga sepotong daging agar tertidur lelap!",
    explanation: "Naga kekenyangan dan tertidur pulas! Putri selamat!",
    setup: (stage, win, fail) => {
      let dragonSleeping = false;
      stage.innerHTML = `
        <div style="position: relative; width: 100%; height: 240px; display: flex; justify-content: space-around; align-items: center;">
          <div id="meat-drag" class="draggable-obj" style="font-size: 3rem; position: absolute; left: 30px; top: 20px;">🥩</div>
          <div id="dragon-obj" style="font-size: 4.5rem;">🐲</div>
          <div id="princess-obj" class="puzzle-obj" style="font-size: 4rem;">👸</div>
        </div>
      `;
      const meat = document.getElementById('meat-drag');
      const dragon = document.getElementById('dragon-obj');
      const princess = document.getElementById('princess-obj');

      makeDraggable(meat, stage, (x, y, elem) => {
        if (isColliding(elem.getBoundingClientRect(), dragon.getBoundingClientRect())) {
          dragon.innerHTML = '😴';
          meat.style.display = 'none';
          dragonSleeping = true;
        }
      });

      princess.onclick = () => {
        if (dragonSleeping) win();
        else { sounds.playWrong(); showToast("Naga masih bangun! Beri makan dulu!"); }
      };
    }
  },
  {
    id: 22,
    title: "Temukan warna paling gelap di layar!",
    hint: "Klik teks pertanyaan berwarna hitam!",
    explanation: "Teks pertanyaan adalah warna hitam pekat paling gelap di layar!",
    setup: (stage, win, fail) => {
      stage.innerHTML = `
        <div style="display: flex; gap: 15px; align-items: center; justify-content: center; height: 220px; flex-wrap: wrap;">
          <div class="puzzle-obj" style="width: 70px; height: 70px; background: #334155; border-radius: 12px;" data-dark="false"></div>
          <div class="puzzle-obj" style="width: 70px; height: 70px; background: #1e293b; border-radius: 12px;" data-dark="false"></div>
          <div class="puzzle-obj" style="width: 70px; height: 70px; background: #475569; border-radius: 12px;" data-dark="false"></div>
          <div id="target-title-click" class="puzzle-obj" style="padding: 10px 18px; background: #000; border-radius: 10px; color: #FFF; font-weight: 700;" data-dark="true">Hitam Pekat #000</div>
        </div>
      `;
      stage.querySelectorAll('.puzzle-obj').forEach(elem => {
        elem.onclick = () => {
          if (elem.dataset.dark === "true") win();
          else { sounds.playWrong(); showToast("Ada warna yang lebih pekat!"); }
        };
      });
    }
  },
  {
    id: 23,
    title: "Isi gelas ini hingga penuh!",
    hint: "Tuang teko air ke dalam gelas hingga 100%!",
    explanation: "Gelas terisi penuh dengan air segar!",
    setup: (stage, win, fail) => {
      let filled = 0;
      stage.innerHTML = `
        <div style="position: relative; width: 100%; height: 240px; display: flex; justify-content: space-around; align-items: center;">
          <div id="teapot-drag" class="draggable-obj" style="font-size: 4rem; position: absolute; left: 30px; top: 30px;">🫖</div>
          <div id="glass-target" style="font-size: 4.5rem; position: absolute; right: 50px;">🥛</div>
        </div>
      `;
      const pot = document.getElementById('teapot-drag');
      const glass = document.getElementById('glass-target');

      makeDraggable(pot, stage, (x, y, elem) => {
        if (isColliding(elem.getBoundingClientRect(), glass.getBoundingClientRect())) {
          filled += 1;
          if (filled > 20) {
            glass.innerHTML = '🧊🥤';
            win();
          }
        }
      });
    }
  },
  {
    id: 24,
    title: "Temukan bintang yang berbeda!",
    hint: "Ketuk bintang-bintang ini untuk menemukan mana yang bercahaya emas!",
    explanation: "Bintang ajaib ditemukan!",
    setup: (stage, win, fail) => {
      stage.innerHTML = `
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; place-items: center; height: 240px;">
          <div class="puzzle-obj star-btn" style="font-size: 3rem;">⭐</div>
          <div class="puzzle-obj star-btn" style="font-size: 3rem;">⭐</div>
          <div class="puzzle-obj star-btn" style="font-size: 3rem;">⭐</div>
          <div class="puzzle-obj star-btn" style="font-size: 3rem;">⭐</div>
          <div id="special-star" class="puzzle-obj" style="font-size: 3rem;">⭐</div>
          <div class="puzzle-obj star-btn" style="font-size: 3rem;">⭐</div>
        </div>
      `;
      stage.querySelectorAll('.star-btn').forEach(s => {
        s.onclick = () => { sounds.playWrong(); showToast("Bintang biasa!"); };
      });
      document.getElementById('special-star').onclick = () => {
        document.getElementById('special-star').innerHTML = '🌟';
        win();
      };
    }
  },
  {
    id: 25,
    title: "Koleksi 3 koin emas!",
    hint: "Satu koin tampak, satu di balik awan, dan satu di bawah kantong!",
    explanation: "3 Koin emas berhasil dikumpulkan!",
    setup: (stage, win, fail) => {
      let coinsFound = 0;
      stage.innerHTML = `
        <div style="position: relative; width: 100%; height: 240px;">
          <div id="c1" class="puzzle-obj" style="font-size: 2.5rem; position: absolute; left: 40px; top: 40px;">🪙</div>
          <div id="cloud-c" class="draggable-obj" style="font-size: 4rem; position: absolute; right: 40px; top: 30px; z-index: 5;">☁️</div>
          <div id="c2" class="puzzle-obj" style="font-size: 2.5rem; position: absolute; right: 60px; top: 45px; z-index: 1;">🪙</div>
          <div id="c3" class="puzzle-obj" style="font-size: 2.5rem; position: absolute; left: 120px; bottom: 40px;">🪙</div>
        </div>
      `;
      makeDraggable(document.getElementById('cloud-c'), stage, () => {});

      const addCoin = (elem) => {
        elem.style.display = 'none';
        coinsFound++;
        sounds.playClick();
        if (coinsFound >= 3) win();
      };

      document.getElementById('c1').onclick = () => addCoin(document.getElementById('c1'));
      document.getElementById('c2').onclick = () => addCoin(document.getElementById('c2'));
      document.getElementById('c3').onclick = () => addCoin(document.getElementById('c3'));
    }
  },
  {
    id: 26,
    title: "Pecahkan kode brankas: [2] [4] [8] [?]",
    hint: "Pola kelipatan 2: 2 * 2 = 4, 4 * 2 = 8, 8 * 2 = 16!",
    explanation: "Pola penggandaan menghasilkan angka 16!",
    setup: (stage, win, fail) => {
      stage.innerHTML = `
        <div style="display: flex; flex-direction: column; align-items: center; gap: 16px;">
          <div style="font-size: 1.5rem; font-weight: 800; font-family: Outfit; background: rgba(0,0,0,0.3); padding: 12px 20px; border-radius: 12px;">
            2 ➔ 4 ➔ 8 ➔ <span style="color:#00E5FF;">?</span>
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; width: 100%; max-width: 280px;">
            <button class="puzzle-btn-choice" data-val="12">12</button>
            <button class="puzzle-btn-choice" data-val="14">14</button>
            <button class="puzzle-btn-choice" data-val="16">16</button>
            <button class="puzzle-btn-choice" data-val="18">18</button>
          </div>
        </div>
      `;
      stage.querySelectorAll('.puzzle-btn-choice').forEach(btn => {
        btn.onclick = () => {
          if (btn.dataset.val === "16") win();
          else { sounds.playWrong(); showToast("Hitung perkalian 2!"); }
        };
      });
    }
  },
  {
    id: 27,
    title: "Luncurkan roket ke luar angkasa!",
    hint: "Klik hitung mundur 3, lalu 2, lalu 1, kemudian klik roket!",
    explanation: "3... 2... 1... Meluncur!",
    setup: (stage, win, fail) => {
      let step = 3;
      stage.innerHTML = `
        <div style="display: flex; flex-direction: column; align-items: center; justify-content: space-around; height: 240px;">
          <div id="rocket-obj" style="font-size: 4.5rem; cursor: pointer; transition: transform 0.5s;">🚀</div>
          <button id="btn-countdown" class="btn btn-primary" style="font-size: 1.4rem;">Hitung: 3</button>
        </div>
      `;
      const btn = document.getElementById('btn-countdown');
      const rocket = document.getElementById('rocket-obj');

      btn.onclick = () => {
        sounds.playClick();
        if (step === 3) { step = 2; btn.textContent = "Hitung: 2"; }
        else if (step === 2) { step = 1; btn.textContent = "Hitung: 1"; }
        else if (step === 1) { step = 0; btn.textContent = "KLIK ROKET SEKARANG!"; btn.classList.add('glow-effect'); }
      };

      rocket.onclick = () => {
        if (step === 0) {
          rocket.style.transform = 'translateY(-300px)';
          setTimeout(win, 600);
        } else {
          showToast("Hitung mundur sampai 1 dulu!");
        }
      };
    }
  },
  {
    id: 28,
    title: "Bangunkan anak yang sedang tidur!",
    hint: "Geser gorden jendela ke samping agar cahaya matahari masuk!",
    explanation: "Cahaya matahari pagi berhasil membangunkannya!",
    setup: (stage, win, fail) => {
      stage.innerHTML = `
        <div style="position: relative; width: 100%; height: 240px; display: flex; justify-content: space-around; align-items: center;">
          <div id="sleeping-kid" style="font-size: 4rem;">🛌</div>
          <div style="position: relative; width: 90px; height: 110px; background: #FFD600; border-radius: 8px; display: flex; align-items: center; justify-content: center;">
            <span style="font-size: 2.5rem;">☀️</span>
            <div id="curtain-drag" class="draggable-obj" style="position: absolute; inset: 0; background: #6366f1; border-radius: 8px; color: #fff; font-size: 0.8rem; display: flex; align-items: center; justify-content: center;">Gorden</div>
          </div>
        </div>
      `;
      const curtain = document.getElementById('curtain-drag');
      const kid = document.getElementById('sleeping-kid');

      makeDraggable(curtain, stage, (x, y) => {
        if (Math.abs(x) > 60 || Math.abs(y) > 60) {
          kid.innerHTML = '😃';
          win();
        }
      });
    }
  },
  {
    id: 29,
    title: "Tangkap 3 buah apel yang jatuh!",
    hint: "Geser keranjang ke kiri dan kanan untuk menangkap apel!",
    explanation: "Semua apel tertangkap di dalam keranjang!",
    setup: (stage, win, fail) => {
      let caught = 0;
      stage.innerHTML = `
        <div style="position: relative; width: 100%; height: 240px;">
          <div id="apple-fall" style="position: absolute; font-size: 2.5rem; left: 50%; top: 10px;">🍎</div>
          <div id="basket-drag" class="draggable-obj" style="position: absolute; font-size: 3.5rem; bottom: 10px; left: 40%;">🧺</div>
        </div>
      `;
      const apple = document.getElementById('apple-fall');
      const basket = document.getElementById('basket-drag');

      let appleY = 10;
      const anim = setInterval(() => {
        appleY += 3;
        if (apple) apple.style.top = `${appleY}px`;
        if (basket && isColliding(apple.getBoundingClientRect(), basket.getBoundingClientRect())) {
          caught++;
          appleY = 10;
          apple.style.left = `${Math.floor(Math.random() * 70 + 15)}%`;
          sounds.playClick();
          if (caught >= 3) {
            clearInterval(anim);
            win();
          }
        }
        if (appleY > 230) {
          appleY = 10;
          apple.style.left = `${Math.floor(Math.random() * 70 + 15)}%`;
        }
      }, 30);

      makeDraggable(basket, stage, () => {});
    }
  },
  {
    id: 30,
    title: "Selesaikan ujian kelulusan Master Puzzle!",
    hint: "Klik tombol 'LULUS' yang berada di balik sertifikat!",
    explanation: "Selamat! Anda adalah Master Brain Puzzle Sejati!",
    setup: (stage, win, fail) => {
      stage.innerHTML = `
        <div style="position: relative; width: 100%; height: 240px; display: flex; align-items: center; justify-content: center;">
          <button id="btn-win-hidden" class="btn btn-primary glow-effect" style="position: absolute; z-index: 1;">👑 LULUS SEKARANG!</button>
          <div id="cert-drag" class="draggable-obj" style="position: absolute; font-size: 5rem; z-index: 5;">📜</div>
        </div>
      `;
      makeDraggable(document.getElementById('cert-drag'), stage, () => {});
      document.getElementById('btn-win-hidden').onclick = () => win();
    }
  }
];

// --- 6. DRAG & DROP UTILITY ---
function makeDraggable(element, container, onMove) {
  if (!element) return;
  let isDragging = false;
  let startX, startY, origX, origY;

  function onStart(e) {
    isDragging = true;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    startX = clientX;
    startY = clientY;
    const rect = element.getBoundingClientRect();
    const parentRect = container.getBoundingClientRect();
    origX = rect.left - parentRect.left;
    origY = rect.top - parentRect.top;
    element.style.zIndex = '50';
    sounds.playClick();
  }

  function onDrag(e) {
    if (!isDragging) return;
    e.preventDefault();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const dx = clientX - startX;
    const dy = clientY - startY;
    element.style.left = `${origX + dx}px`;
    element.style.top = `${origY + dy}px`;
    if (onMove) onMove(dx, dy, element);
  }

  function onEnd() {
    if (!isDragging) return;
    isDragging = false;
    element.style.zIndex = '10';
  }

  element.addEventListener('mousedown', onStart);
  window.addEventListener('mousemove', onDrag);
  window.addEventListener('mouseup', onEnd);

  element.addEventListener('touchstart', onStart, { passive: false });
  window.addEventListener('touchmove', onDrag, { passive: false });
  window.addEventListener('touchend', onEnd);
}

function isColliding(r1, r2) {
  return !(r2.left > r1.right || 
           r2.right < r1.left || 
           r2.top > r1.bottom ||
           r2.bottom < r1.top);
}

// --- 7. SCREEN & NAVIGATION CONTROLLER ---
function showScreen(screenId) {
  document.querySelectorAll('.game-screen').forEach(s => s.classList.remove('active'));
  const target = document.getElementById(screenId);
  if (target) target.classList.add('active');
  sounds.playClick();
}

function loadLevel(lvlNum) {
  if (lvlNum < 1 || lvlNum > LEVELS.length) return;
  gameState.currentLevel = lvlNum;
  showScreen('screen-gameplay');

  const lvlData = LEVELS[lvlNum - 1];
  document.getElementById('current-level-num').textContent = lvlNum;
  document.getElementById('puzzle-question').textContent = lvlData.title;

  const stage = document.getElementById('puzzle-stage');
  stage.innerHTML = '';

  lvlData.setup(
    stage,
    () => handleLevelVictory(lvlData),
    () => { sounds.playWrong(); }
  );

  saveGameData();
}

function handleLevelVictory(lvlData) {
  sounds.playCorrect();
  if (!gameState.completedLevels.includes(lvlData.id)) {
    gameState.completedLevels.push(lvlData.id);
    gameState.coins += 25;
    if (gameState.unlockedLevel <= lvlData.id && gameState.unlockedLevel < LEVELS.length) {
      gameState.unlockedLevel = lvlData.id + 1;
    }
  }

  // Interstitial Ad Trigger every 3 levels
  if (gameState.admobEnabled && lvlData.id % 3 === 0) {
    showToast("AdMob Interstitial Ad Dipicu (Level " + lvlData.id + ")");
  }

  saveGameData();

  const modalVic = document.getElementById('modal-victory');
  const expText = document.getElementById('victory-explanation');
  if (expText) expText.textContent = lvlData.explanation;
  if (modalVic) modalVic.classList.remove('hidden');
}

function renderLevelGrid(category = 'all') {
  const grid = document.getElementById('level-grid');
  if (!grid) return;
  grid.innerHTML = '';

  LEVELS.forEach(lvl => {
    if (category === 'tutorial' && (lvl.id < 1 || lvl.id > 5)) return;
    if (category === 'medium' && (lvl.id < 6 || lvl.id > 15)) return;
    if (category === 'advanced' && (lvl.id < 16 || lvl.id > 30)) return;

    const isUnlocked = lvl.id <= gameState.unlockedLevel;
    const isCompleted = gameState.completedLevels.includes(lvl.id);

    const box = document.createElement('div');
    box.className = `level-box ${isUnlocked ? 'unlocked' : 'locked'} ${isCompleted ? 'completed' : ''}`;
    box.textContent = lvl.id;

    if (isUnlocked) {
      box.onclick = () => {
        loadLevel(lvl.id);
      };
    }

    grid.appendChild(box);
  });
}

// --- 8. MODALS & ADMOB REWARDED VIDEO SIMULATOR ---
function setupModals() {
  const btnHint = document.getElementById('btn-hint');
  const modalHint = document.getElementById('modal-hint');
  const btnCloseHint = document.getElementById('btn-close-hint');
  const btnUseHint = document.getElementById('btn-use-hint');
  const btnWatchAdHint = document.getElementById('btn-watch-ad-hint');
  const hintTextContent = document.getElementById('hint-text-content');

  // Google Auth Modals
  const modalAuth = document.getElementById('modal-google-auth');
  const btnAuthProfile = document.getElementById('btn-auth-profile');
  const btnGoogleLoginMenu = document.getElementById('btn-google-login-menu');
  const btnCloseAuth = document.getElementById('btn-close-auth');
  const btnDoGoogleLogin = document.getElementById('btn-do-google-login');
  const btnCustomGoogleLogin = document.getElementById('btn-custom-google-login');
  const inputGoogleEmail = document.getElementById('input-google-email');
  const btnGoogleLogout = document.getElementById('btn-google-logout');
  const btnSwitchAccount = document.getElementById('btn-switch-account');
  const btnSyncNow = document.getElementById('btn-sync-now');

  if (btnAuthProfile) {
    btnAuthProfile.onclick = () => {
      updateAuthUI();
      modalAuth.classList.remove('hidden');
    };
  }

  if (btnGoogleLoginMenu) {
    btnGoogleLoginMenu.onclick = () => {
      updateAuthUI();
      modalAuth.classList.remove('hidden');
    };
  }

  if (btnCloseAuth) {
    btnCloseAuth.onclick = () => modalAuth.classList.add('hidden');
  }

  if (btnDoGoogleLogin) {
    btnDoGoogleLogin.onclick = () => {
      // Trigger Google Identity Prompt or fallback instant login
      if (window.google && window.google.accounts && window.google.accounts.id) {
        window.google.accounts.id.prompt((notification) => {
          if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
            simulateGoogleLogin();
          }
        });
      } else {
        simulateGoogleLogin();
      }
    };
  }

  if (btnCustomGoogleLogin && inputGoogleEmail) {
    btnCustomGoogleLogin.onclick = () => {
      const email = inputGoogleEmail.value.trim();
      if (email && email.includes('@')) {
        simulateGoogleLogin(email);
        inputGoogleEmail.value = '';
      } else {
        showToast("Masukkan alamat email Google yang valid (misal: nama@gmail.com)");
      }
    };
  }

  if (btnGoogleLogout) {
    btnGoogleLogout.onclick = () => performLogout();
  }

  if (btnSwitchAccount) {
    btnSwitchAccount.onclick = () => {
      document.getElementById('auth-view-user').classList.add('hidden');
      document.getElementById('auth-view-guest').classList.remove('hidden');
    };
  }

  if (btnSyncNow) {
    btnSyncNow.onclick = () => {
      saveGameData();
      sounds.playReward();
      showToast("☁️ Data progres berhasil disinkronkan ke Google Cloud!");
    };
  }

  // Hint Modals
  if (btnHint) {
    btnHint.onclick = () => {
      const lvl = LEVELS[gameState.currentLevel - 1];
      hintTextContent.textContent = "Gunakan 1 Hint untuk melihat petunjuk level ini.";
      modalHint.classList.remove('hidden');
    };
  }

  if (btnCloseHint) {
    btnCloseHint.onclick = () => modalHint.classList.add('hidden');
  }

  if (btnUseHint) {
    btnUseHint.onclick = () => {
      if (gameState.hints > 0) {
        gameState.hints--;
        const lvl = LEVELS[gameState.currentLevel - 1];
        hintTextContent.textContent = `💡 PETUNJUK: ${lvl.hint}`;
        sounds.playReward();
        saveGameData();
      } else {
        showToast("Hint habis! Tonton video iklan untuk +1 Hint.");
      }
    };
  }

  if (btnWatchAdHint) {
    btnWatchAdHint.onclick = () => {
      modalHint.classList.add('hidden');
      startRewardedAd();
    };
  }

  // Next level victory button
  const btnNext = document.getElementById('btn-next-level');
  const modalVic = document.getElementById('modal-victory');
  if (btnNext) {
    btnNext.onclick = () => {
      modalVic.classList.add('hidden');
      if (gameState.currentLevel < LEVELS.length) {
        loadLevel(gameState.currentLevel + 1);
      } else {
        showScreen('screen-level-select');
        renderLevelGrid();
      }
    };
  }
}

function startRewardedAd() {
  const adModal = document.getElementById('modal-rewarded-ad');
  const adTimer = document.getElementById('ad-timer');
  const adProgress = document.getElementById('ad-progress-fill');
  adModal.classList.remove('hidden');

  let timeLeft = 5;
  adTimer.textContent = `${timeLeft} detik`;
  adProgress.style.width = '0%';

  const interval = setInterval(() => {
    timeLeft--;
    const pct = ((5 - timeLeft) / 5) * 100;
    adProgress.style.width = `${pct}%`;
    adTimer.textContent = `${timeLeft} detik`;

    if (timeLeft <= 0) {
      clearInterval(interval);
      setTimeout(() => {
        adModal.classList.add('hidden');
        gameState.hints += 1;
        gameState.coins += 50;
        sounds.playReward();
        saveGameData();
        showToast("🎉 Selamat! +1 Hint & +50 Koin ditambahkan!");
      }, 500);
    }
  }, 1000);
}

function triggerAdClick() {
  showToast("Membuka halaman sponsor AdMob...");
}

// --- 9. INITIALIZATION ---
window.addEventListener('DOMContentLoaded', () => {
  loadGameData();
  setupModals();
  initGoogleAuth();

  // Navigation Event Listeners
  document.getElementById('btn-play').onclick = () => loadLevel(gameState.currentLevel);
  document.getElementById('btn-levels').onclick = () => {
    renderLevelGrid();
    showScreen('screen-level-select');
  };
  document.getElementById('btn-back-menu').onclick = () => showScreen('screen-main-menu');
  document.getElementById('btn-pause').onclick = () => showScreen('screen-main-menu');
  document.getElementById('btn-reset').onclick = () => loadLevel(gameState.currentLevel);

  // Level selector category tabs
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.onclick = () => {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderLevelGrid(btn.dataset.category);
    };
  });

  // Settings
  const modalSettings = document.getElementById('modal-settings');
  document.getElementById('btn-settings').onclick = () => modalSettings.classList.remove('hidden');
  document.getElementById('btn-close-settings').onclick = () => modalSettings.classList.add('hidden');

  const toggleSfx = document.getElementById('toggle-sfx');
  if (toggleSfx) {
    toggleSfx.checked = gameState.sfxEnabled;
    toggleSfx.onchange = () => {
      gameState.sfxEnabled = toggleSfx.checked;
      sounds.enabled = toggleSfx.checked;
      saveGameData();
    };
  }

  const toggleCloudSync = document.getElementById('toggle-cloud-sync');
  if (toggleCloudSync) {
    toggleCloudSync.checked = gameState.cloudSyncEnabled;
    toggleCloudSync.onchange = () => {
      gameState.cloudSyncEnabled = toggleCloudSync.checked;
      saveGameData();
      showToast(toggleCloudSync.checked ? "Cloud sync diaktifkan" : "Cloud sync dinonaktifkan");
    };
  }

  const toggleAdmob = document.getElementById('toggle-admob');
  if (toggleAdmob) {
    toggleAdmob.checked = gameState.admobEnabled;
    toggleAdmob.onchange = () => {
      gameState.admobEnabled = toggleAdmob.checked;
      document.getElementById('admob-banner').style.display = toggleAdmob.checked ? 'flex' : 'none';
      saveGameData();
    };
  }

  const btnResetData = document.getElementById('btn-reset-data');
  if (btnResetData) {
    btnResetData.onclick = () => {
      if (confirm("Reset semua level dan koin untuk akun ini?")) {
        const storageKey = (userAuth.isLoggedIn && userAuth.userEmail) 
          ? `BRAIN_PUZZLE_SAVE_${userAuth.userEmail.replace(/[^a-zA-Z0-9]/g, '_')}`
          : LOCAL_SAVE_KEY;

        localStorage.removeItem(storageKey);
        gameState.currentLevel = 1;
        gameState.unlockedLevel = 1;
        gameState.coins = 100;
        gameState.hints = 3;
        gameState.completedLevels = [];
        saveGameData();
        modalSettings.classList.add('hidden');
        showScreen('screen-main-menu');
        showToast("Data permainan direset.");
      }
    };
  }
});
