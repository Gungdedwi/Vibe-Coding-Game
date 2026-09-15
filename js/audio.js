// Web Audio API Sound Synthesizer for Procedure Quest
class SoundEngine {
    constructor() {
        this.ctx = null;
        this.enabled = true;
        this.initialized = false;
    }

    init() {
        if (this.initialized) return;
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (AudioContext) {
                this.ctx = new AudioContext();
                this.initialized = true;
            }
        } catch (e) {
            console.warn('AudioContext not supported or blocked:', e);
        }
    }

    ensureContext() {
        if (!this.initialized) this.init();
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    playTap() {
        if (!this.enabled) return;
        this.ensureContext();
        if (!this.ctx) return;

        try {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            const now = this.ctx.currentTime;

            osc.type = 'sine';
            osc.frequency.setValueAtTime(440, now);
            osc.frequency.exponentialRampToValueAtTime(880, now + 0.05);

            gain.gain.setValueAtTime(0.12, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(now);
            osc.stop(now + 0.05);
        } catch (e) {}
    }

    playCorrect() {
        if (!this.enabled) return;
        this.ensureContext();
        if (!this.ctx) return;

        try {
            const now = this.ctx.currentTime;
            const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
            notes.forEach((freq, idx) => {
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                const time = now + idx * 0.07;

                osc.type = 'triangle';
                osc.frequency.setValueAtTime(freq, time);

                gain.gain.setValueAtTime(0.15, time);
                gain.gain.exponentialRampToValueAtTime(0.001, time + 0.18);

                osc.connect(gain);
                gain.connect(this.ctx.destination);

                osc.start(time);
                osc.stop(time + 0.2);
            });
        } catch (e) {}
    }

    playWrong() {
        if (!this.enabled) return;
        this.ensureContext();
        if (!this.ctx) return;

        try {
            const now = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(180, now);
            osc.frequency.linearRampToValueAtTime(110, now + 0.22);

            gain.gain.setValueAtTime(0.18, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(now);
            osc.stop(now + 0.25);
        } catch (e) {}
    }

    playLevelUp() {
        if (!this.enabled) return;
        this.ensureContext();
        if (!this.ctx) return;

        try {
            const now = this.ctx.currentTime;
            const arpeggio = [440, 554.37, 659.25, 880, 1108.73, 1318.51];
            arpeggio.forEach((freq, idx) => {
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                const time = now + idx * 0.08;

                osc.type = 'sine';
                osc.frequency.setValueAtTime(freq, time);

                gain.gain.setValueAtTime(0.18, time);
                gain.gain.exponentialRampToValueAtTime(0.001, time + 0.25);

                osc.connect(gain);
                gain.connect(this.ctx.destination);

                osc.start(time);
                osc.stop(time + 0.28);
            });
        } catch (e) {}
    }

    playBadge() {
        if (!this.enabled) return;
        this.ensureContext();
        if (!this.ctx) return;

        try {
            const now = this.ctx.currentTime;
            const chord = [523.25, 659.25, 783.99, 987.77, 1046.50];
            chord.forEach((freq, idx) => {
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                const time = now + idx * 0.06;

                osc.type = 'sine';
                osc.frequency.setValueAtTime(freq, time);

                gain.gain.setValueAtTime(0.16, time);
                gain.gain.exponentialRampToValueAtTime(0.001, time + 0.4);

                osc.connect(gain);
                gain.connect(this.ctx.destination);

                osc.start(time);
                osc.stop(time + 0.42);
            });
        } catch (e) {}
    }

    playBossHit() {
        if (!this.enabled) return;
        this.ensureContext();
        if (!this.ctx) return;

        try {
            const now = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'square';
            osc.frequency.setValueAtTime(320, now);
            osc.frequency.exponentialRampToValueAtTime(60, now + 0.2);

            gain.gain.setValueAtTime(0.25, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(now);
            osc.stop(now + 0.2);
        } catch (e) {}
    }

    playBossVictory() {
        if (!this.enabled) return;
        this.ensureContext();
        if (!this.ctx) return;

        try {
            const now = this.ctx.currentTime;
            const victoryFanfare = [
                { f: 523.25, d: 0.15 },
                { f: 523.25, d: 0.15 },
                { f: 523.25, d: 0.15 },
                { f: 659.25, d: 0.35 },
                { f: 783.99, d: 0.2 },
                { f: 1046.50, d: 0.6 }
            ];

            let cumulative = 0;
            victoryFanfare.forEach((item) => {
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                const time = now + cumulative;

                osc.type = 'triangle';
                osc.frequency.setValueAtTime(item.f, time);

                gain.gain.setValueAtTime(0.2, time);
                gain.gain.exponentialRampToValueAtTime(0.001, time + item.d);

                osc.connect(gain);
                gain.connect(this.ctx.destination);

                osc.start(time);
                osc.stop(time + item.d + 0.05);

                cumulative += item.d * 0.9;
            });
        } catch (e) {}
    }

    toggle() {
        this.enabled = !this.enabled;
        return this.enabled;
    }
}

window.soundEngine = new SoundEngine();
