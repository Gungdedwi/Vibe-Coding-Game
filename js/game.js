/**
 * PROCEDURE QUEST - GAME ENGINE & CONTROLLER
 * Mata Pelajaran: Bahasa Indonesia Kelas IX SMP
 * Topik: Teks Prosedur
 * Guru Pengampu: Bahaudin Alfiansyah Syafi'i, S.Pd. (NIPPPK: 199702042025211039)
 */

class ProcedureQuestApp {
    constructor() {
        this.state = this.loadState();
        this.currentScreen = 'home';
        this.activeMateriIndex = 0;
        this.activeMateriTab = 0;
        
        // Game states
        this.currentSorterIndex = 0;
        this.currentSorterItems = [];
        
        this.currentDetectiveIndex = 0;
        
        this.currentHunterIndex = 0;
        this.hunterHearts = 3;
        this.hunterFoundCount = 0;
        
        this.bossPhase = 0;
        this.bossCurrentHp = 100;
        this.playerCurrentHp = 100;
        
        this.quizIndex = 0;
        this.quizAnswers = [];
        this.quizScore = 0;
        
        this.init();
    }

    loadState() {
        const defaultState = {
            studentName: "",
            xp: 0,
            level: 1,
            title: "Procedure Rookie",
            hearts: 3,
            completedMissions: [], // e.g. ['materi_1', 'materi_2', 'sorter_1', ...]
            unlockedBadges: [],
            quizCompleted: false,
            quizBestScore: 0,
            totalAnswered: 0,
            correctAnswers: 0,
            soundEnabled: true
        };

        try {
            const saved = localStorage.getItem('procedure_quest_save_v1');
            return saved ? { ...defaultState, ...JSON.parse(saved) } : defaultState;
        } catch (e) {
            return defaultState;
        }
    }

    saveState() {
        try {
            localStorage.setItem('procedure_quest_save_v1', JSON.stringify(this.state));
        } catch (e) {
            console.error('Error saving state:', e);
        }
        this.updateHeaderAndDashboardUI();
    }

    init() {
        this.bindEvents();
        this.updateHeaderAndDashboardUI();

        if (this.state.studentName && this.state.studentName.trim() !== '') {
            this.showScreen('dashboard');
        } else {
            this.showScreen('home');
        }
    }

    bindEvents() {
        // Top Nav actions
        const btnSound = document.getElementById('btn-sound-toggle');
        if (btnSound) {
            btnSound.addEventListener('click', () => {
                const enabled = window.soundEngine.toggle();
                this.state.soundEnabled = enabled;
                btnSound.textContent = enabled ? '🔊' : '🔇';
                window.soundEngine.playTap();
                this.saveState();
            });
        }

        const btnTeacher = document.getElementById('btn-teacher-mode');
        if (btnTeacher) {
            btnTeacher.addEventListener('click', () => {
                window.soundEngine.playTap();
                this.openTeacherModal();
            });
        }

        // Bottom Nav Items
        document.querySelectorAll('.bottom-nav .nav-item').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const screen = btn.getAttribute('data-screen');
                window.soundEngine.playTap();
                if (screen === 'materi') {
                    this.openMateriScreen(0);
                } else if (screen === 'games') {
                    this.showScreen('games-hub');
                } else if (screen === 'quiz') {
                    this.startQuiz();
                } else if (screen === 'profile') {
                    this.showScreen('profile');
                } else {
                    this.showScreen('dashboard');
                }
            });
        });

        // Home Start Adventure
        const btnStart = document.getElementById('btn-start-adventure');
        const inputName = document.getElementById('input-student-name');
        if (btnStart && inputName) {
            btnStart.addEventListener('click', () => {
                const name = inputName.value.trim();
                if (!name) {
                    alert('Halo Sobat Siswa! Silakan masukkan nama kamu terlebih dahulu untuk memulai petualangan!');
                    inputName.focus();
                    return;
                }
                this.state.studentName = name;
                this.saveState();
                window.soundEngine.playCorrect();
                this.showScreen('dashboard');
                this.showToast(`Selamat Datang di Procedure Quest, ${name}!`);
            });
        }

        // Modal Close triggers
        document.querySelectorAll('.modal-close-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                window.soundEngine.playTap();
                this.closeAllModals();
            });
        });
    }

    showScreen(screenId) {
        this.currentScreen = screenId;
        document.querySelectorAll('.screen').forEach(scr => scr.classList.remove('active'));
        
        const target = document.getElementById(`screen-${screenId}`);
        if (target) {
            target.classList.add('active');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }

        // Update Bottom Nav active state
        document.querySelectorAll('.bottom-nav .nav-item').forEach(item => {
            const screenAttr = item.getAttribute('data-screen');
            if (screenAttr === screenId || 
               (screenId.startsWith('materi') && screenAttr === 'materi') ||
               (screenId.startsWith('game') && screenAttr === 'games')) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }

    addXP(amount, reason = "") {
        this.state.xp += amount;
        
        // Calculate Level
        const prevLevel = this.state.level;
        const levels = GAME_DATA.levels;
        for (let i = levels.length - 1; i >= 0; i--) {
            if (this.state.xp >= levels[i].minXp) {
                this.state.level = levels[i].level;
                this.state.title = levels[i].title;
                break;
            }
        }

        if (this.state.level > prevLevel) {
            window.soundEngine.playLevelUp();
            this.triggerConfetti();
            this.showLevelUpModal(this.state.level, this.state.title);
        }

        // Check for ultimate master badge
        if (this.state.xp >= 2300) {
            this.unlockBadge('ultimate_master');
        }

        this.saveState();
        if (reason) {
            this.showToast(`+${amount} XP! (${reason})`);
        }
    }

    unlockBadge(badgeId) {
        if (!this.state.unlockedBadges.includes(badgeId)) {
            this.state.unlockedBadges.push(badgeId);
            const badge = GAME_DATA.badges.find(b => b.id === badgeId);
            if (badge) {
                window.soundEngine.playBadge();
                this.triggerConfetti();
                this.showBadgeUnlockedModal(badge);
            }
            this.saveState();
        }
    }

    markMissionCompleted(missionId) {
        if (!this.state.completedMissions.includes(missionId)) {
            this.state.completedMissions.push(missionId);
            this.unlockBadge('first_mission');
            this.saveState();
        }
    }

    updateHeaderAndDashboardUI() {
        // Greeting & Name
        const elName = document.querySelectorAll('.bind-student-name');
        elName.forEach(el => el.textContent = this.state.studentName || "Siswa Pejuang");

        // XP & Level
        const elXp = document.querySelectorAll('.bind-xp');
        elXp.forEach(el => el.textContent = `${this.state.xp} XP`);

        const elLevel = document.querySelectorAll('.bind-level-title');
        elLevel.forEach(el => el.textContent = `Lv.${this.state.level} — ${this.state.title}`);

        // Accuracy
        const total = this.state.totalAnswered || 0;
        const correct = this.state.correctAnswers || 0;
        const accuracy = total > 0 ? Math.round((correct / total) * 100) : 100;
        const elAcc = document.querySelectorAll('.bind-accuracy');
        elAcc.forEach(el => el.textContent = `${accuracy}%`);

        // Missions Done count
        const elMissions = document.querySelectorAll('.bind-missions-count');
        elMissions.forEach(el => el.textContent = `${this.state.completedMissions.length}`);

        // XP Bar
        const curLvlObj = GAME_DATA.levels.find(l => l.level === this.state.level) || GAME_DATA.levels[0];
        const nextLvlObj = GAME_DATA.levels.find(l => l.level === this.state.level + 1);
        
        let percent = 100;
        if (nextLvlObj) {
            const range = nextLvlObj.minXp - curLvlObj.minXp;
            const progress = this.state.xp - curLvlObj.minXp;
            percent = Math.min(100, Math.max(0, Math.round((progress / range) * 100)));
        }

        const elBar = document.getElementById('xp-bar-fill');
        if (elBar) elBar.style.width = `${percent}%`;

        const elLvlProgress = document.getElementById('xp-progress-text');
        if (elLvlProgress) {
            if (nextLvlObj) {
                elLvlProgress.textContent = `${this.state.xp} / ${nextLvlObj.minXp} XP (Target Lv.${nextLvlObj.level})`;
            } else {
                elLvlProgress.textContent = `MAX LEVEL ACHIEVED (${this.state.xp} XP)`;
            }
        }

        // Badges Render
        this.renderBadgesGrid();
        this.renderDashboardMissions();
    }

    renderBadgesGrid() {
        const container = document.getElementById('badges-carousel-wrap');
        if (!container) return;

        container.innerHTML = GAME_DATA.badges.map(b => {
            const isUnlocked = this.state.unlockedBadges.includes(b.id);
            return `
                <div class="badge-item ${isUnlocked ? 'unlocked' : ''}" onclick="window.app.showBadgeDetail('${b.id}')">
                    <div class="badge-icon">${b.icon}</div>
                    <div class="badge-name">${b.name}</div>
                </div>
            `;
        }).join('');
    }

    renderDashboardMissions() {
        const container = document.getElementById('dashboard-missions-list');
        if (!container) return;

        const missions = [
            { id: "materi_1", title: "Materi 1: Apa Itu Teks Prosedur?", icon: "📖", desc: "Konsep, fungsi, dan karakteristik dasar", type: "materi", index: 0 },
            { id: "materi_2", title: "Materi 2: Struktur Teks Prosedur", icon: "🏗️", desc: "Diagram 4 pilar anatomi teks prosedur", type: "materi", index: 1 },
            { id: "materi_3", title: "Materi 3: Ciri Kebahasaan", icon: "🖋️", desc: "Imperatif, konjungsi temporal, & takaran", type: "materi", index: 2 },
            { id: "materi_4", title: "Materi 4: Lab Analisis Interaktif", icon: "🔬", desc: "Bedah teks prosedur nyata dengan highlighting", type: "materi", index: 3 },
            { id: "game_sorter", title: "Game 1: Step Sorter", icon: "🧩", desc: "Menyusun langkah acak berurutan", type: "game", gameKey: "sorter" },
            { id: "game_detective", title: "Game 2: Procedure Detective", icon: "🕵️‍♂️", desc: "Temukan kesalahan fatal dalam prosedur", type: "game", gameKey: "detective" },
            { id: "game_hunter", title: "Game 3: Word Hunter", icon: "🎯", desc: "Tangkap kata imperatif & konjungsi", type: "game", gameKey: "hunter" },
            { id: "game_boss", title: "Game 4: Procedure Boss Battle", icon: "⚔️", desc: "Kalahkan Dr. Chaos dan raih gelar Master!", type: "game", gameKey: "boss" },
            { id: "quiz_eval", title: "Kuis Evaluasi 20 Soal HOTS", icon: "🎓", desc: "Uji pemahaman komprehensif Kelas IX", type: "quiz" }
        ];

        container.innerHTML = missions.map(m => {
            const isDone = this.state.completedMissions.includes(m.id);
            return `
                <div class="mission-card ${isDone ? 'completed' : ''}" onclick="window.app.handleMissionClick('${m.type}', '${m.id}', ${m.index !== undefined ? m.index : `'${m.gameKey}'`})">
                    <div class="mission-icon-wrap">${m.icon}</div>
                    <div class="mission-info">
                        <div class="mission-title">${m.title}</div>
                        <div class="mission-desc">${m.desc}</div>
                    </div>
                </div>
            `;
        }).join('');
    }

    handleMissionClick(type, id, param) {
        window.soundEngine.playTap();
        if (type === 'materi') {
            this.openMateriScreen(param);
        } else if (type === 'game') {
            if (param === 'sorter') this.startStepSorter(0);
            else if (param === 'detective') this.startDetective(0);
            else if (param === 'hunter') this.startWordHunter(0);
            else if (param === 'boss') this.startBossBattle();
        } else if (type === 'quiz') {
            this.startQuiz();
        }
    }

    /* ==========================================================
       MATERI MODULE CONTROLLER
       ========================================================== */
    openMateriScreen(materiIndex) {
        this.activeMateriIndex = materiIndex;
        this.renderMateriModule(materiIndex);
        this.showScreen('materi');
    }

    renderMateriModule(index) {
        const moduleData = GAME_DATA.modules[index];
        if (!moduleData) return;

        // Render Tabs
        const tabsContainer = document.getElementById('materi-tabs-container');
        if (tabsContainer) {
            tabsContainer.innerHTML = GAME_DATA.modules.map((m, idx) => `
                <button class="module-tab-btn ${idx === index ? 'active' : ''}" onclick="window.app.openMateriScreen(${idx})">
                    ${m.icon} Modul ${m.number}
                </button>
            `).join('');
        }

        // Header info
        document.getElementById('materi-title').textContent = moduleData.title;
        document.getElementById('materi-summary').textContent = moduleData.summary;

        const bodyContainer = document.getElementById('materi-body-content');
        if (!bodyContainer) return;

        // Check if Lab module (Module 4) or standard sections
        if (moduleData.interactiveLab) {
            bodyContainer.innerHTML = this.renderInteractiveLabHTML(moduleData.interactiveLab);
        } else {
            let html = '';
            moduleData.sections.forEach((sec, sIdx) => {
                html += `<div class="materi-card-item">
                    <h4 style="margin-bottom:10px; color:#c7d2fe;">${sec.heading}</h4>`;

                if (sec.type === 'cards') {
                    html += sec.items.map(item => `
                        <div style="background:rgba(255,255,255,0.04); padding:12px; border-radius:8px; margin-bottom:8px;">
                            <span class="materi-card-badge">${item.badge}</span>
                            <h5 style="color:#ffffff; margin-bottom:4px;">${item.title}</h5>
                            <p style="font-size:0.8rem; color:var(--text-muted);">${item.text}</p>
                        </div>
                    `).join('');
                } else if (sec.type === 'grid') {
                    html += `<div class="materi-grid-2">` + sec.items.map(item => `
                        <div class="materi-grid-item">
                            <div class="icon">${item.icon}</div>
                            <h5>${item.title}</h5>
                            <p>${item.desc}</p>
                        </div>
                    `).join('') + `</div>`;
                } else if (sec.type === 'comparison') {
                    html += sec.items.map(item => `
                        <div class="comparison-box ${item.isCorrect ? 'correct' : 'wrong'}">
                            <div class="comparison-label">${item.label}</div>
                            <div style="font-weight:700; font-size:0.85rem; margin-bottom:4px;">${item.title}</div>
                            <div class="comparison-content">${item.content}</div>
                        </div>
                    `).join('');
                } else if (sec.type === 'comparison_list') {
                    html += sec.items.map(item => `
                        <div style="margin-bottom:12px; background:rgba(0,0,0,0.3); padding:10px; border-radius:8px;">
                            <div class="comparison-box wrong" style="margin-bottom:4px;">
                                <div class="comparison-content">${item.bad}</div>
                            </div>
                            <div class="comparison-box correct" style="margin-bottom:4px;">
                                <div class="comparison-content">${item.good}</div>
                            </div>
                            <p style="font-size:0.75rem; color:#a5b4fc; font-style:italic;">💡 Penjelasan: ${item.note}</p>
                        </div>
                    `).join('');
                } else if (sec.type === 'diagram') {
                    html += `<div class="diagram-step-flow">` + sec.steps.map(st => `
                        <div class="flow-step-item">
                            <div class="flow-step-number">${st.step}</div>
                            <div class="flow-step-content">
                                <h5>${st.icon} ${st.name}</h5>
                                <p>${st.desc}</p>
                            </div>
                        </div>
                    `).join('') + `</div>`;
                } else if (sec.type === 'quick_check') {
                    html += `
                        <div class="quick-check-box">
                            <div style="font-size:0.75rem; font-weight:800; color:#818cf8; margin-bottom:4px;">⚡ QUICK CHECK PERIKSA PEMAHAMAN</div>
                            <div style="font-weight:600; font-size:0.85rem; margin-bottom:8px;">${sec.question}</div>
                            <div class="qc-options-list">
                                ${sec.options.map((opt, oIdx) => `
                                    <button class="qc-option-btn" id="qc-opt-${index}-${sIdx}-${oIdx}" onclick="window.app.handleQuickCheck(${index}, ${sIdx}, ${oIdx}, ${sec.correctIndex}, '${sec.explanation.replace(/'/g, "\\'")}')">
                                        ${opt}
                                    </button>
                                `).join('')}
                            </div>
                            <div id="qc-feedback-${index}-${sIdx}" style="display:none; margin-top:8px; font-size:0.8rem; padding:8px; border-radius:6px;"></div>
                        </div>
                    `;
                }

                html += `</div>`;
            });

            // Finish button
            html += `
                <button class="btn-primary" onclick="window.app.finishMateriModule(${index})">
                    ✓ Selesaikan Modul ${moduleData.number} (+${moduleData.xpReward} XP)
                </button>
            `;

            bodyContainer.innerHTML = html;
        }
    }

    renderInteractiveLabHTML(lab) {
        return `
            <div class="game-card">
                <h4 style="color:#ffffff; margin-bottom:6px;">${lab.title}</h4>
                <p style="font-size:0.78rem; color:var(--text-muted); margin-bottom:12px;">
                    Sentuh filter kategori di bawah ini untuk melihat bedah anatomi dan fungsi kebahasaan teks secara interaktif!
                </p>

                <div class="lab-filter-row">
                    <button class="lab-chip" id="chip-all" onclick="window.app.highlightLab('all')">👁️ Tampilkan Semua</button>
                    <button class="lab-chip" id="chip-tujuan" onclick="window.app.highlightLab('tujuan')">🎯 Bagian Tujuan</button>
                    <button class="lab-chip" id="chip-bahan" onclick="window.app.highlightLab('bahan')">🧪 Alat & Bahan</button>
                    <button class="lab-chip" id="chip-langkah" onclick="window.app.highlightLab('langkah')">🪜 Langkah-Langkah</button>
                    <button class="lab-chip" id="chip-penutup" onclick="window.app.highlightLab('penutup')">✨ Bagian Penutup</button>
                </div>

                <div class="lab-document-paper">
                    ${lab.parts.map(p => `
                        <div class="lab-section-block highlight-${p.type}" id="lab-part-${p.type}">
                            <div style="font-weight:800; font-size:0.75rem; color:#818cf8; margin-bottom:2px;">${p.label}</div>
                            <div>${p.text}</div>
                        </div>
                    `).join('')}
                </div>

                <button class="btn-primary" style="margin-top:16px;" onclick="window.app.finishMateriModule(3)">
                    ✓ Selesaikan Lab Analisis (+120 XP)
                </button>
            </div>
        `;
    }

    highlightLab(type) {
        window.soundEngine.playTap();
        const parts = ['tujuan', 'bahan', 'langkah', 'penutup'];
        parts.forEach(p => {
            const el = document.getElementById(`lab-part-${p}`);
            if (!el) return;
            if (type === 'all' || type === p) {
                el.style.display = 'block';
                el.classList.add(`highlight-${p}`);
            } else {
                el.style.display = 'none';
            }
        });
    }

    handleQuickCheck(materiIdx, secIdx, selectedIdx, correctIdx, explanation) {
        this.state.totalAnswered = (this.state.totalAnswered || 0) + 1;
        const feedbackEl = document.getElementById(`qc-feedback-${materiIdx}-${secIdx}`);
        const btnSelected = document.getElementById(`qc-opt-${materiIdx}-${secIdx}-${selectedIdx}`);

        if (selectedIdx === correctIdx) {
            this.state.correctAnswers = (this.state.correctAnswers || 0) + 1;
            window.soundEngine.playCorrect();
            btnSelected.classList.add('correct');
            feedbackEl.style.display = 'block';
            feedbackEl.style.background = 'rgba(16, 185, 129, 0.2)';
            feedbackEl.style.color = '#34d399';
            feedbackEl.innerHTML = `🎉 <strong>Benar!</strong> ${explanation}`;
            this.addXP(30, 'Quick Check Benar');
        } else {
            window.soundEngine.playWrong();
            btnSelected.classList.add('wrong');
            const btnCorrect = document.getElementById(`qc-opt-${materiIdx}-${secIdx}-${correctIdx}`);
            if (btnCorrect) btnCorrect.classList.add('correct');

            feedbackEl.style.display = 'block';
            feedbackEl.style.background = 'rgba(239, 68, 68, 0.2)';
            feedbackEl.style.color = '#f87171';
            feedbackEl.innerHTML = `⚠️ <strong>Kurang tepat.</strong> ${explanation}`;
        }
        this.saveState();
    }

    finishMateriModule(index) {
        const mod = GAME_DATA.modules[index];
        this.markMissionCompleted(mod.id);
        this.addXP(mod.xpReward, `Menyelesaikan Modul ${mod.number}`);
        window.soundEngine.playCorrect();
        this.showToast(`🎉 Hebat! Kamu telah menuntaskan Modul ${mod.number}!`);
        this.showScreen('dashboard');
    }

    /* ==========================================================
       GAME 1: STEP SORTER
       ========================================================== */
    startStepSorter(index = 0) {
        this.currentSorterIndex = index;
        const sorterData = GAME_DATA.games.stepSorter[index];
        if (!sorterData) {
            this.showScreen('games-hub');
            return;
        }

        this.currentSorterItems = [...sorterData.initialShuffled];
        this.renderStepSorterUI();
        this.showScreen('game-sorter');
    }

    renderStepSorterUI() {
        const sorterData = GAME_DATA.games.stepSorter[this.currentSorterIndex];
        document.getElementById('sorter-scenario-title').textContent = sorterData.scenario;
        document.getElementById('sorter-hint-text').textContent = `💡 Petunjuk: ${sorterData.hint}`;

        const listContainer = document.getElementById('sorter-items-list');
        listContainer.innerHTML = this.currentSorterItems.map((item, idx) => `
            <div class="sortable-item" data-index="${idx}">
                <div class="item-handle">☰</div>
                <div class="item-text"><strong>${idx + 1}.</strong> ${item}</div>
                <div class="sort-reorder-controls">
                    <button class="btn-move" onclick="window.app.moveSorterItem(${idx}, -1)" ${idx === 0 ? 'disabled style="opacity:0.3;"' : ''}>▲</button>
                    <button class="btn-move" onclick="window.app.moveSorterItem(${idx}, 1)" ${idx === this.currentSorterItems.length - 1 ? 'disabled style="opacity:0.3;"' : ''}>▼</button>
                </div>
            </div>
        `).join('');

        document.getElementById('sorter-feedback-box').style.display = 'none';
    }

    moveSorterItem(index, direction) {
        const newIndex = index + direction;
        if (newIndex < 0 || newIndex >= this.currentSorterItems.length) return;
        
        window.soundEngine.playTap();
        const temp = this.currentSorterItems[index];
        this.currentSorterItems[index] = this.currentSorterItems[newIndex];
        this.currentSorterItems[newIndex] = temp;
        this.renderStepSorterUI();
    }

    checkSorterOrder() {
        this.state.totalAnswered = (this.state.totalAnswered || 0) + 1;
        const sorterData = GAME_DATA.games.stepSorter[this.currentSorterIndex];
        let isCorrect = true;

        for (let i = 0; i < sorterData.correctOrder.length; i++) {
            if (this.currentSorterItems[i] !== sorterData.correctOrder[i]) {
                isCorrect = false;
                break;
            }
        }

        const feedbackBox = document.getElementById('sorter-feedback-box');
        feedbackBox.style.display = 'block';

        if (isCorrect) {
            this.state.correctAnswers = (this.state.correctAnswers || 0) + 1;
            window.soundEngine.playCorrect();
            this.triggerConfetti();
            this.addXP(sorterData.xpReward, 'Menyelesaikan Step Sorter');
            this.unlockBadge('step_master');
            this.markMissionCompleted('game_sorter');

            feedbackBox.style.background = 'rgba(16, 185, 129, 0.2)';
            feedbackBox.style.borderColor = '#10b981';
            feedbackBox.innerHTML = `
                <h4 style="color:#34d399; margin-bottom:4px;">🎉 PERFECT! Urutanmu Sangat Logis!</h4>
                <p style="font-size:0.8rem; color:#e2e8f0; margin-bottom:8px;">${sorterData.explanation}</p>
                ${this.currentSorterIndex + 1 < GAME_DATA.games.stepSorter.length ? `
                    <button class="btn-primary" onclick="window.app.startStepSorter(${this.currentSorterIndex + 1})">
                        Lanjut ke Skenario Berikutnya ➜
                    </button>
                ` : `
                    <button class="btn-primary" onclick="window.app.showScreen('games-hub')">
                        Kembali ke Menu Game ➜
                    </button>
                `}
            `;
        } else {
            window.soundEngine.playWrong();
            feedbackBox.style.background = 'rgba(239, 68, 68, 0.2)';
            feedbackBox.style.borderColor = '#ef4444';
            feedbackBox.innerHTML = `
                <h4 style="color:#f87171; margin-bottom:4px;">⚠️ Masih Ada Langkah yang Kurang Tepat</h4>
                <p style="font-size:0.8rem; color:#e2e8f0;">Perhatikan hubungan sebab-akibat antar langkah. Coba geser kembali posisi kalimat yang belum sesuai!</p>
            `;
        }
        this.saveState();
    }

    /* ==========================================================
       GAME 2: PROCEDURE DETECTIVE
       ========================================================== */
    startDetective(index = 0) {
        this.currentDetectiveIndex = index;
        const caseData = GAME_DATA.games.detective[index];
        if (!caseData) {
            this.showScreen('games-hub');
            return;
        }

        document.getElementById('detective-case-title').textContent = caseData.caseTitle;
        const container = document.getElementById('detective-snippets-container');
        
        container.innerHTML = caseData.textSnippets.map((snip, sIdx) => `
            <div class="detective-snippet-card" id="det-snip-${snip.id}" onclick="window.app.investigateSnippet('${snip.id}', ${snip.isError}, '${(snip.issue || '').replace(/'/g, "\\'")}', '${(snip.fix || '').replace(/'/g, "\\'")}')">
                <div style="font-size:1.3rem;">🔍</div>
                <div style="flex:1; font-size:0.84rem;">${snip.text}</div>
            </div>
        `).join('');

        document.getElementById('detective-report-box').style.display = 'none';
        this.showScreen('game-detective');
    }

    investigateSnippet(id, isError, issue, fix) {
        this.state.totalAnswered = (this.state.totalAnswered || 0) + 1;
        const card = document.getElementById(`det-snip-${id}`);
        const reportBox = document.getElementById('detective-report-box');
        reportBox.style.display = 'block';

        if (isError) {
            this.state.correctAnswers = (this.state.correctAnswers || 0) + 1;
            window.soundEngine.playCorrect();
            card.classList.add('suspect-correct');
            this.triggerConfetti();
            const caseData = GAME_DATA.games.detective[this.currentDetectiveIndex];
            this.addXP(caseData.xpReward, 'Menemukan Kesalahan Prosedur');
            this.unlockBadge('detective_pro');
            this.markMissionCompleted('game_detective');

            reportBox.style.background = 'rgba(16, 185, 129, 0.2)';
            reportBox.style.borderColor = '#10b981';
            reportBox.innerHTML = `
                <h4 style="color:#34d399; margin-bottom:4px;">🕵️‍♂️ KASUS TERPECAHKAN! Kesalahan Ditemukan!</h4>
                <div style="font-size:0.8rem; color:#e2e8f0; margin-bottom:6px;"><strong>Analisis Masalah:</strong> ${issue}</div>
                <div style="font-size:0.8rem; color:#a5b4fc; margin-bottom:10px;"><strong>Rekomendasi Perbaikan:</strong> ${fix}</div>
                ${this.currentDetectiveIndex + 1 < GAME_DATA.games.detective.length ? `
                    <button class="btn-primary" onclick="window.app.startDetective(${this.currentDetectiveIndex + 1})">
                        Selidiki Kasus Berikutnya ➜
                    </button>
                ` : `
                    <button class="btn-primary" onclick="window.app.showScreen('games-hub')">
                        Kembali ke Menu Game ➜
                    </button>
                `}
            `;
        } else {
            window.soundEngine.playWrong();
            card.classList.add('suspect-innocent');
            reportBox.style.background = 'rgba(239, 68, 68, 0.2)';
            reportBox.style.borderColor = '#ef4444';
            reportBox.innerHTML = `
                <h4 style="color:#f87171; margin-bottom:4px;">❌ Kalimat Ini Sudah Benar & Bebas Cacat</h4>
                <p style="font-size:0.8rem; color:#e2e8f0;">Langkah ini logis dan kaidah bahasanya tepat. Coba periksa kalimat lainnya dengan lebih teliti!</p>
            `;
        }
        this.saveState();
    }

    /* ==========================================================
       GAME 3: WORD HUNTER
       ========================================================== */
    startWordHunter(index = 0) {
        this.currentHunterIndex = index;
        const hunterData = GAME_DATA.games.wordHunter[index];
        if (!hunterData) {
            this.showScreen('games-hub');
            return;
        }

        this.hunterHearts = 3;
        this.hunterFoundCount = 0;
        this.renderWordHunterUI();
        this.showScreen('game-hunter');
    }

    renderWordHunterUI() {
        const hunterData = GAME_DATA.games.wordHunter[this.currentHunterIndex];
        document.getElementById('hunter-instruction').textContent = hunterData.instruction;
        document.getElementById('hunter-counter').textContent = `Ditemukan: ${this.hunterFoundCount} / ${hunterData.targetCount}`;

        // Render Hearts
        this.renderHunterHearts();

        const tokenContainer = document.getElementById('hunter-tokens-container');
        tokenContainer.innerHTML = hunterData.paragraphTokens.map((t, idx) => `
            <span class="word-token" id="token-${idx}" onclick="window.app.handleTokenClick(${idx}, ${t.isTarget})">
                ${t.text}
            </span>
        `).join('');

        document.getElementById('hunter-game-over-box').style.display = 'none';
    }

    renderHunterHearts() {
        const container = document.getElementById('hunter-hearts-box');
        if (!container) return;
        let html = '';
        for (let i = 0; i < 3; i++) {
            html += `<span class="${i < this.hunterHearts ? '' : 'heart-lost'}">❤️</span>`;
        }
        container.innerHTML = html;
    }

    handleTokenClick(tokenIdx, isTarget) {
        if (this.hunterHearts <= 0) return;
        this.state.totalAnswered = (this.state.totalAnswered || 0) + 1;
        const tokenEl = document.getElementById(`token-${tokenIdx}`);

        if (isTarget) {
            if (!tokenEl.classList.contains('found-success')) {
                this.state.correctAnswers = (this.state.correctAnswers || 0) + 1;
                window.soundEngine.playCorrect();
                tokenEl.classList.add('found-success');
                this.hunterFoundCount++;
                const hunterData = GAME_DATA.games.wordHunter[this.currentHunterIndex];
                document.getElementById('hunter-counter').textContent = `Ditemukan: ${this.hunterFoundCount} / ${hunterData.targetCount}`;

                if (this.hunterFoundCount >= hunterData.targetCount) {
                    this.triggerConfetti();
                    this.addXP(hunterData.xpReward, 'Menyelesaikan Word Hunter');
                    this.unlockBadge('grammar_hero');
                    this.markMissionCompleted('game_hunter');

                    setTimeout(() => {
                        alert(`🎯 LUAR BIASA! Kamu menemukan seluruh target kebahasaan! (+${hunterData.xpReward} XP)`);
                        if (this.currentHunterIndex + 1 < GAME_DATA.games.wordHunter.length) {
                            this.startWordHunter(this.currentHunterIndex + 1);
                        } else {
                            this.showScreen('games-hub');
                        }
                    }, 300);
                }
            }
        } else {
            window.soundEngine.playWrong();
            tokenEl.classList.add('found-wrong');
            this.hunterHearts--;
            this.renderHunterHearts();

            if (this.hunterHearts <= 0) {
                const gameOverBox = document.getElementById('hunter-game-over-box');
                gameOverBox.style.display = 'block';
                gameOverBox.innerHTML = `
                    <h4 style="color:#f87171; margin-bottom:4px;">💔 NYAWA HABIS!</h4>
                    <p style="font-size:0.8rem; color:#e2e8f0; margin-bottom:8px;">Jangan menyerah! Pelajari kembali ciri kebahasaan dan coba tantangan ini lagi.</p>
                    <button class="btn-primary" onclick="window.app.startWordHunter(${this.currentHunterIndex})">
                        🔄 Coba Lagi
                    </button>
                `;
            }
        }
        this.saveState();
    }

    /* ==========================================================
       GAME 4: BOSS BATTLE (DR. CHAOS)
       ========================================================== */
    startBossBattle() {
        this.bossPhase = 0;
        this.bossCurrentHp = 100;
        this.playerCurrentHp = 100;
        this.renderBossBattleUI();
        this.showScreen('game-boss');
    }

    renderBossBattleUI() {
        const battle = GAME_DATA.games.bossBattle;
        const curPhase = battle.phases[this.bossPhase];

        document.getElementById('boss-phase-title').textContent = curPhase.title;
        document.getElementById('boss-speech-text').textContent = `"${curPhase.bossSpeech}"`;
        document.getElementById('boss-question-text').textContent = curPhase.question;

        // HP Bars
        document.getElementById('boss-hp-fill').style.width = `${this.bossCurrentHp}%`;
        document.getElementById('player-hp-fill').style.width = `${this.playerCurrentHp}%`;
        document.getElementById('boss-hp-text').textContent = `HP: ${this.bossCurrentHp} / 100`;
        document.getElementById('player-hp-text').textContent = `HP: ${this.playerCurrentHp} / 100`;

        // Render Options
        const optionsWrap = document.getElementById('boss-options-grid');
        optionsWrap.innerHTML = curPhase.options.map((opt, idx) => `
            <button class="btn-secondary" style="text-align:left; font-size:0.84rem; padding:12px; margin-bottom:8px; width:100%; display:block;" onclick="window.app.handleBossAction(${idx}, ${opt.correct}, ${opt.dmg}, '${opt.feedback.replace(/'/g, "\\'")}')">
                ⚔️ ${opt.text}
            </button>
        `).join('');

        document.getElementById('boss-feedback-box').style.display = 'none';
    }

    handleBossAction(idx, isCorrect, dmg, feedback) {
        this.state.totalAnswered = (this.state.totalAnswered || 0) + 1;
        const feedbackBox = document.getElementById('boss-feedback-box');
        feedbackBox.style.display = 'block';

        const bossAvatar = document.getElementById('boss-avatar-frame');

        if (isCorrect) {
            this.state.correctAnswers = (this.state.correctAnswers || 0) + 1;
            window.soundEngine.playBossHit();
            bossAvatar.classList.add('hit');
            setTimeout(() => bossAvatar.classList.remove('hit'), 400);

            this.bossCurrentHp = Math.max(0, this.bossCurrentHp - 20);
            this.renderBossBattleUI();

            feedbackBox.style.background = 'rgba(16, 185, 129, 0.2)';
            feedbackBox.style.borderColor = '#10b981';
            feedbackBox.innerHTML = `
                <h4 style="color:#34d399; margin-bottom:4px;">💥 SERANGAN CRITICAL!</h4>
                <p style="font-size:0.8rem; color:#e2e8f0; margin-bottom:8px;">${feedback}</p>
                ${this.bossCurrentHp <= 0 || this.bossPhase + 1 >= GAME_DATA.games.bossBattle.phases.length ? `
                    <button class="btn-primary" onclick="window.app.finishBossVictory()">
                        🏆 KLAIM KEMENANGAN MASTER (+500 XP) ➜
                    </button>
                ` : `
                    <button class="btn-primary" onclick="window.app.nextBossPhase()">
                        Lanjut ke Fase Berikutnya ➜
                    </button>
                `}
            `;
        } else {
            window.soundEngine.playWrong();
            this.playerCurrentHp = Math.max(0, this.playerCurrentHp - dmg);
            this.renderBossBattleUI();

            feedbackBox.style.background = 'rgba(239, 68, 68, 0.2)';
            feedbackBox.style.borderColor = '#ef4444';
            feedbackBox.innerHTML = `
                <h4 style="color:#f87171; margin-bottom:4px;">🛡️ SERANGAN BALASAN DR. CHAOS!</h4>
                <p style="font-size:0.8rem; color:#e2e8f0; margin-bottom:8px;">${feedback}</p>
                ${this.playerCurrentHp <= 0 ? `
                    <button class="btn-danger" onclick="window.app.startBossBattle()">
                        🔄 Ulangi Boss Battle
                    </button>
                ` : ''}
            `;
        }
        this.saveState();
    }

    nextBossPhase() {
        this.bossPhase++;
        this.renderBossBattleUI();
    }

    finishBossVictory() {
        window.soundEngine.playBossVictory();
        this.triggerConfetti();
        this.addXP(500, 'Mengalahkan Boss Dr. Chaos');
        this.unlockBadge('boss_slayer');
        this.markMissionCompleted('game_boss');
        this.showFinalResultScreen();
    }

    /* ==========================================================
       5. QUIZ EVALUASI 20 SOAL HOTS
       ========================================================== */
    startQuiz() {
        this.quizIndex = 0;
        this.quizAnswers = [];
        this.quizScore = 0;
        this.renderQuizQuestion();
        this.showScreen('quiz');
    }

    renderQuizQuestion() {
        const q = GAME_DATA.quizBank[this.quizIndex];
        if (!q) {
            this.finishQuiz();
            return;
        }

        const total = GAME_DATA.quizBank.length;
        document.getElementById('quiz-progress-text').textContent = `Soal ${this.quizIndex + 1} dari ${total}`;
        document.getElementById('quiz-progress-bar').style.width = `${((this.quizIndex + 1) / total) * 100}%`;
        document.getElementById('quiz-category-tag').textContent = q.category;
        document.getElementById('quiz-question-text').textContent = q.question;

        const letters = ['A', 'B', 'C', 'D'];
        const optionsContainer = document.getElementById('quiz-options-container');
        optionsContainer.innerHTML = q.options.map((opt, idx) => `
            <button class="quiz-opt-btn" id="q-opt-${idx}" onclick="window.app.handleQuizAnswer(${idx}, ${q.answer}, '${q.explanation.replace(/'/g, "\\'")}', ${q.xp})">
                <div class="opt-letter">${letters[idx]}</div>
                <div>${opt}</div>
            </button>
        `).join('');

        document.getElementById('quiz-explanation-box').style.display = 'none';
        document.getElementById('btn-quiz-next').style.display = 'none';
    }

    handleQuizAnswer(selectedIdx, correctIdx, explanation, xp) {
        this.state.totalAnswered = (this.state.totalAnswered || 0) + 1;
        // Disable all options
        for (let i = 0; i < 4; i++) {
            const btn = document.getElementById(`q-opt-${i}`);
            if (btn) btn.style.pointerEvents = 'none';
        }

        const btnSelected = document.getElementById(`q-opt-${selectedIdx}`);
        const expBox = document.getElementById('quiz-explanation-box');
        expBox.style.display = 'block';

        const isCorrect = selectedIdx === correctIdx;
        this.quizAnswers.push({ qIndex: this.quizIndex, selected: selectedIdx, isCorrect });

        if (isCorrect) {
            this.state.correctAnswers = (this.state.correctAnswers || 0) + 1;
            this.quizScore += xp;
            window.soundEngine.playCorrect();
            btnSelected.classList.add('state-correct');
            expBox.style.background = 'rgba(16, 185, 129, 0.2)';
            expBox.style.borderColor = '#10b981';
            expBox.innerHTML = `🎉 <strong>Tepat Sekali! (+${xp} XP)</strong><br>${explanation}`;
            this.addXP(xp, 'Jawaban Kuis Benar');
        } else {
            window.soundEngine.playWrong();
            btnSelected.classList.add('state-wrong');
            const btnCorrect = document.getElementById(`q-opt-${correctIdx}`);
            if (btnCorrect) btnCorrect.classList.add('state-correct');
            expBox.style.background = 'rgba(239, 68, 68, 0.2)';
            expBox.style.borderColor = '#ef4444';
            expBox.innerHTML = `⚠️ <strong>Jawaban Kurang Tepat.</strong><br>${explanation}`;
        }

        document.getElementById('btn-quiz-next').style.display = 'flex';
        this.saveState();
    }

    nextQuizQuestion() {
        window.soundEngine.playTap();
        this.quizIndex++;
        if (this.quizIndex < GAME_DATA.quizBank.length) {
            this.renderQuizQuestion();
        } else {
            this.finishQuiz();
        }
    }

    finishQuiz() {
        this.state.quizCompleted = true;
        this.state.quizBestScore = Math.max(this.state.quizBestScore || 0, this.quizScore);
        this.markMissionCompleted('quiz_eval');
        this.unlockBadge('quiz_champion');
        this.saveState();
        this.showFinalResultScreen();
    }

    /* ==========================================================
       6. FINAL RESULT & CERTIFICATE SCREEN
       ========================================================== */
    showFinalResultScreen() {
        window.soundEngine.playBossVictory();
        this.triggerConfetti();

        const totalQ = this.state.totalAnswered || 1;
        const correctQ = this.state.correctAnswers || 0;
        const accuracy = Math.round((correctQ / totalQ) * 100);

        let grade = "A+ (Istimewa)";
        let gradeStamp = "GRADE A+";
        if (accuracy < 60) {
            grade = "C (Cukup)";
            gradeStamp = "GRADE C";
        } else if (accuracy < 80) {
            grade = "B (Baik)";
            gradeStamp = "GRADE B";
        } else if (accuracy < 90) {
            grade = "A (Amat Baik)";
            gradeStamp = "GRADE A";
        }

        document.getElementById('res-student-name').textContent = this.state.studentName || "Siswa Pejuang";
        document.getElementById('res-total-xp').textContent = `${this.state.xp} XP`;
        document.getElementById('res-accuracy').textContent = `${accuracy}%`;
        document.getElementById('res-grade').textContent = grade;
        document.getElementById('res-stamp').textContent = gradeStamp;
        document.getElementById('res-missions-done').textContent = `${this.state.completedMissions.length} Misi Selesai`;
        document.getElementById('res-badges-count').textContent = `${this.state.unlockedBadges.length} Badge Dibuka`;

        this.showScreen('result');
    }

    printCertificate() {
        window.soundEngine.playTap();
        window.print();
    }

    /* ==========================================================
       7. MODALS, TOASTS & VISUAL FX
       ========================================================== */
    showBadgeDetail(badgeId) {
        window.soundEngine.playTap();
        const badge = GAME_DATA.badges.find(b => b.id === badgeId);
        if (!badge) return;

        const isUnlocked = this.state.unlockedBadges.includes(badgeId);
        const content = `
            <div style="text-align:center;">
                <div style="font-size:3.5rem; margin-bottom:8px;">${badge.icon}</div>
                <h3 style="color:#ffffff; margin-bottom:4px;">${badge.name}</h3>
                <div style="font-size:0.75rem; color:${isUnlocked ? '#34d399' : '#f87171'}; font-weight:800; margin-bottom:12px;">
                    ${isUnlocked ? '✓ TELAH TERBUKA' : '🔒 BELUM TERBUKA'}
                </div>
                <p style="font-size:0.85rem; color:var(--text-muted); margin-bottom:14px;">${badge.desc}</p>
                <div style="background:rgba(15,23,42,0.7); padding:10px; border-radius:8px; font-size:0.78rem; color:#a5b4fc;">
                    <strong>Syarat Membuka:</strong> ${badge.requirement}
                </div>
            </div>
        `;
        this.openCustomModal('Rincian Badge', content);
    }

    showBadgeUnlockedModal(badge) {
        const modal = document.getElementById('modal-badge-unlocked');
        if (!modal) return;
        document.getElementById('unlocked-badge-icon').textContent = badge.icon;
        document.getElementById('unlocked-badge-name').textContent = badge.name;
        document.getElementById('unlocked-badge-desc').textContent = badge.desc;
        modal.classList.add('active');
    }

    showLevelUpModal(level, title) {
        const modal = document.getElementById('modal-level-up');
        if (!modal) return;
        document.getElementById('levelup-title').textContent = `LEVEL UP! — Level ${level}`;
        document.getElementById('levelup-subtitle').textContent = `Selamat! Gelar barumu adalah "${title}"!`;
        modal.classList.add('active');
    }

    openTeacherModal() {
        const teacher = GAME_DATA.meta.teacher;
        const content = `
            <div>
                <div style="display:flex; align-items:center; gap:12px; margin-bottom:16px;">
                    <div style="font-size:2.5rem;">👨‍🏫</div>
                    <div>
                        <h4 style="color:#ffffff;">${teacher.name}</h4>
                        <p style="font-size:0.75rem; color:var(--text-muted);">NIPPPK: ${teacher.nipppk}</p>
                        <p style="font-size:0.75rem; color:#818cf8; font-weight:700;">${GAME_DATA.meta.subject} • ${GAME_DATA.meta.grade}</p>
                    </div>
                </div>

                <div style="background:rgba(15,23,42,0.8); padding:12px; border-radius:8px; margin-bottom:14px; font-size:0.8rem;">
                    <div style="font-weight:700; color:#38bdf8; margin-bottom:6px;">📊 Ringkasan Bank Soal & Game:</div>
                    <div>• Bank Soal Kuis: <strong>20 Soal HOTS</strong></div>
                    <div>• Modul Materi: <strong>4 Modul Interaktif</strong></div>
                    <div>• Mini Games: <strong>4 Jenis Game (Step Sorter, Detective, Word Hunter, Boss)</strong></div>
                    <div>• Progression: <strong>5 Level & 7 Trophy Badges</strong></div>
                </div>

                <button class="btn-danger" style="width:100%; margin-bottom:8px;" onclick="window.app.resetStudentProgress()">
                    ⚠️ Reset Seluruh Data & Progress Siswa
                </button>
            </div>
        `;
        this.openCustomModal('Teacher Mode & Informasi Kurikulum', content);
    }

    resetStudentProgress() {
        if (confirm('Apakah kamu yakin ingin mereset seluruh nilai, XP, dan progress pembelajaran?')) {
            localStorage.removeItem('procedure_quest_save_v1');
            window.location.reload();
        }
    }

    openCustomModal(title, bodyHtml) {
        const modal = document.getElementById('modal-custom');
        if (!modal) return;
        document.getElementById('modal-custom-title').textContent = title;
        document.getElementById('modal-custom-body').innerHTML = bodyHtml;
        modal.classList.add('active');
    }

    closeAllModals() {
        document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('active'));
    }

    showToast(message) {
        const toast = document.createElement('div');
        toast.style.position = 'fixed';
        toast.style.bottom = '80px';
        toast.style.left = '50%';
        toast.style.transform = 'translateX(-50%)';
        toast.style.background = 'rgba(15, 23, 42, 0.95)';
        toast.style.border = '1px solid #818cf8';
        toast.style.color = '#ffffff';
        toast.style.padding = '10px 18px';
        toast.style.borderRadius = '30px';
        toast.style.fontSize = '0.82rem';
        toast.style.fontWeight = '700';
        toast.style.zIndex = '350';
        toast.style.boxShadow = '0 10px 25px rgba(0,0,0,0.5)';
        toast.style.transition = 'all 0.3s ease';
        toast.textContent = message;

        document.body.appendChild(toast);
        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 300);
        }, 2800);
    }

    triggerConfetti() {
        const canvas = document.getElementById('confetti-canvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const pieces = [];
        const colors = ['#6366f1', '#ec4899', '#10b981', '#f59e0b', '#38bdf8', '#ffffff'];

        for (let i = 0; i < 75; i++) {
            pieces.push({
                x: canvas.width / 2,
                y: canvas.height / 2,
                vx: (Math.random() - 0.5) * 16,
                vy: (Math.random() - 0.7) * 18,
                size: Math.random() * 8 + 4,
                color: colors[Math.floor(Math.random() * colors.length)],
                rotation: Math.random() * 360,
                rotSpeed: (Math.random() - 0.5) * 10
            });
        }

        let animationFrame;
        const startTime = Date.now();

        const render = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            const elapsed = Date.now() - startTime;

            pieces.forEach(p => {
                p.x += p.vx;
                p.y += p.vy;
                p.vy += 0.4; // gravity
                p.rotation += p.rotSpeed;

                ctx.save();
                ctx.translate(p.x, p.y);
                ctx.rotate((p.rotation * Math.PI) / 180);
                ctx.fillStyle = p.color;
                ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
                ctx.restore();
            });

            if (elapsed < 2000) {
                animationFrame = requestAnimationFrame(render);
            } else {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            }
        };

        render();
    }
}

// Inisialisasi saat window dimuat
window.addEventListener('DOMContentLoaded', () => {
    window.app = new ProcedureQuestApp();
});
