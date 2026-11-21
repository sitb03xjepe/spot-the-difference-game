// Game state, input and scoring for "Spot the Difference".
// The canvas holds two panels side by side; each panel shows the same scene
// with its own variants. Clicking a difference on either panel finds it.
import { SCENE_W, SCENE_H } from './draw.js';
import { SCENES, DIFF_COUNT } from './scenes.js';
import { SoundBank } from './audio.js';

export const PANEL = { w: 600, h: 440 };
export const CANVAS_W = 1280;
export const CANVAS_H = 560;
const PANEL_Y = 84;
const PANEL_GAP = 40;
export const LEFT_X = 20;
export const RIGHT_X = LEFT_X + PANEL.w + PANEL_GAP;

const BEST_KEY = 'spot-the-difference-best-v1';

export function loadBest() {
  try {
    return JSON.parse(localStorage.getItem(BEST_KEY) || '{}');
  } catch {
    return {};
  }
}

export function saveBest(best) {
  try {
    localStorage.setItem(BEST_KEY, JSON.stringify(best));
  } catch {
    // Private mode or no storage: best scores simply do not persist.
  }
}

export class Game {
  constructor(canvas, hud, overlay) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.hud = hud;
    this.overlay = overlay;
    this.sounds = new SoundBank();
    this.screen = 'title'; // title | select | play | levelDone | gameOver | win
    this.levelIndex = 0;
    this.found = new Set();
    this.markers = []; // {x, y, kind: 'found'|'wrong', born}
    this.hintPulse = null; // {diff, until}
    this.score = 0;
    this.combo = 0;
    this.bestCombo = 0;
    this.hintsLeft = 3;
    this.timeLeft = 120;
    this.lastTick = 0;
    this.lastSecond = -1;
    this.totalFound = 0;
    this.stars = {};
    this.best = loadBest();
    this.shotMode = false;
    this.onScreenChange = null;
    this.bindInput();
  }

  get scene() {
    return SCENES[this.levelIndex];
  }

  get foundCount() {
    return this.found.size;
  }

  startLevel(index) {
    this.levelIndex = index;
    this.found = new Set();
    this.markers = [];
    this.hintPulse = null;
    this.combo = 0;
    this.hintsLeft = 3;
    this.timeLeft = this.scene.timeLimit;
    this.lastSecond = -1;
    this.setScreen('play');
    this.announce(`${this.scene.name}. Find ${DIFF_COUNT} differences.`);
  }

  setScreen(name) {
    this.screen = name;
    if (this.onScreenChange) this.onScreenChange(name);
    this.renderOverlay();
    this.updateHud();
  }

  // -- input ---------------------------------------------------------------
  bindInput() {
    this.canvas.addEventListener('pointerdown', (e) => this.onPointer(e));
    window.addEventListener('keydown', (e) => {
      if (e.key === 'h' || e.key === 'H') this.useHint();
      if (e.key === 'm' || e.key === 'M') this.toggleMute();
      if (e.key === 'Escape' && this.screen === 'play') this.setScreen('select');
      if (e.key === 'Enter' && (this.screen === 'title' || this.screen === 'select')) this.startLevel(0);
    });
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) this.lastTick = 0;
    });
  }

  // Convert a pointer event to scene coordinates, or null when off-panel.
  pointerToScene(e) {
    const rect = this.canvas.getBoundingClientRect();
    const cx = ((e.clientX - rect.left) / rect.width) * CANVAS_W;
    const cy = ((e.clientY - rect.top) / rect.height) * CANVAS_H;
    if (cy < PANEL_Y || cy > PANEL_Y + PANEL.h) return null;
    if (cx >= LEFT_X && cx <= LEFT_X + PANEL.w) {
      return { x: cx - LEFT_X, y: cy - PANEL_Y };
    }
    if (cx >= RIGHT_X && cx <= RIGHT_X + PANEL.w) {
      return { x: cx - RIGHT_X, y: cy - PANEL_Y };
    }
    return null;
  }

  onPointer(e) {
    if (this.screen !== 'play') return;
    const p = this.pointerToScene(e);
    if (!p) return;
    this.sounds.ensure();
    const hit = this.scene.diffs.find((d) => {
      if (this.found.has(d.id)) return false;
      const dx = p.x - d.x;
      const dy = p.y - d.y;
      return dx * dx + dy * dy <= (d.r + 8) * (d.r + 8);
    });
    if (hit) {
      this.found.add(hit.id);
      this.totalFound += 1;
      this.combo += 1;
      this.bestCombo = Math.max(this.bestCombo, this.combo);
      const points = 100 + 25 * (this.combo - 1);
      this.score += points;
      this.markers.push({ x: hit.x, y: hit.y, kind: 'found', born: performance.now() });
      this.sounds.found();
      this.announce(`Found: ${hit.label}. ${this.foundCount} of ${DIFF_COUNT}.`);
      if (this.foundCount === DIFF_COUNT) this.completeLevel();
    } else {
      this.combo = 0;
      this.score = Math.max(0, this.score - 25);
      this.timeLeft = Math.max(0, this.timeLeft - 3);
      this.markers.push({ x: p.x, y: p.y, kind: 'wrong', born: performance.now() });
      this.sounds.wrong();
      this.announce('Not a difference. Three seconds lost.');
    }
    this.updateHud();
  }

  useHint() {
    if (this.screen !== 'play' || this.shotMode) return;
    if (this.hintsLeft <= 0) {
      this.announce('No hints left on this level.');
      return;
    }
    const remaining = this.scene.diffs.filter((d) => !this.found.has(d.id));
    if (remaining.length === 0) return;
    const pick = remaining[Math.floor(Math.random() * remaining.length)];
    this.hintsLeft -= 1;
    this.hintPulse = { diff: pick, until: performance.now() + 2500 };
    this.sounds.hint();
    this.announce(`Hint used. ${this.hintsLeft} left.`);
    this.updateHud();
  }

  toggleMute() {
    this.sounds.muted = !this.sounds.muted;
    this.updateHud();
    this.announce(this.sounds.muted ? 'Sound off.' : 'Sound on.');
  }

  completeLevel() {
    const bonus = Math.round(this.timeLeft) * 5;
    this.score += bonus;
    const stars = this.timeLeft > 60 ? 3 : this.timeLeft > 30 ? 2 : 1;
    this.stars[this.scene.id] = Math.max(this.stars[this.scene.id] || 0, stars);
    const prev = this.best[this.scene.id] || 0;
    if (this.score > prev) {
      this.best[this.scene.id] = this.score;
      saveBest(this.best);
    }
    this.sounds.win();
    this.announce(`Level complete! ${this.scene.name}, ${stars} stars, time bonus ${bonus}.`);
    this.setScreen(this.levelIndex === SCENES.length - 1 ? 'win' : 'levelDone');
  }

  failLevel() {
    this.sounds.wrong();
    this.announce('Time ran out. Try the level again.');
    this.setScreen('gameOver');
  }

  nextLevel() {
    this.startLevel(Math.min(this.levelIndex + 1, SCENES.length - 1));
  }

  // -- loop ----------------------------------------------------------------
  tick(now) {
    if (this.screen === 'play' && !this.shotMode) {
      if (this.lastTick) {
        this.timeLeft -= (now - this.lastTick) / 1000;
        const whole = Math.ceil(this.timeLeft);
        if (whole !== this.lastSecond) {
          this.lastSecond = whole;
          if (whole <= 10 && whole > 0) this.sounds.countdownTick();
          this.updateHud();
        }
        if (this.timeLeft <= 0) {
          this.timeLeft = 0;
          this.lastTick = 0;
          this.failLevel();
        }
      }
      this.lastTick = now;
    } else {
      this.lastTick = 0;
    }
    this.draw(now);
  }

  // -- rendering ------------------------------------------------------------
  draw(now) {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
    this.drawPanel(ctx, 'left', LEFT_X);
    this.drawPanel(ctx, 'right', RIGHT_X);
    // Panel tabs.
    this.drawTab(ctx, LEFT_X, 'Panel A');
    this.drawTab(ctx, RIGHT_X, 'Panel B');
    this.drawMarkers(ctx, now);
  }

  drawPanel(ctx, side, x) {
    ctx.save();
    ctx.beginPath();
    ctx.roundRect(x, PANEL_Y, PANEL.w, PANEL.h, 12);
    ctx.clip();
    ctx.translate(x, PANEL_Y);
    this.scene.draw(ctx, side);
    ctx.restore();
    ctx.strokeStyle = 'rgba(255,255,255,0.35)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(x, PANEL_Y, PANEL.w, PANEL.h, 12);
    ctx.stroke();
  }

  drawTab(ctx, x, label) {
    ctx.fillStyle = '#f8fafc';
    ctx.beginPath();
    ctx.roundRect(x, PANEL_Y - 34, 92, 28, 8);
    ctx.fill();
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 15px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(label, x + 46, PANEL_Y - 19);
  }

  drawMarkers(ctx, now) {
    // Hint pulse: a dashed ring on both panels.
    if (this.hintPulse && now < this.hintPulse.until) {
      const d = this.hintPulse.diff;
      const pulse = 1 + 0.12 * Math.sin(now / 90);
      ctx.save();
      ctx.strokeStyle = '#facc15';
      ctx.lineWidth = 4;
      ctx.setLineDash([10, 8]);
      for (const px of [LEFT_X, RIGHT_X]) {
        ctx.beginPath();
        ctx.arc(px + d.x, PANEL_Y + d.y, (d.r + 10) * pulse, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.restore();
    } else if (this.hintPulse) {
      this.hintPulse = null;
    }
    // Found markers: green ring + check on both panels. Wrong clicks fade.
    this.markers = this.markers.filter((m) => m.kind === 'found' || now - m.born < 700);
    for (const m of this.markers) {
      for (const px of [LEFT_X, RIGHT_X]) {
        const cx = px + m.x;
        const cy = PANEL_Y + m.y;
        if (m.kind === 'found') {
          ctx.save();
          ctx.strokeStyle = '#22c55e';
          ctx.lineWidth = 5;
          ctx.beginPath();
          ctx.arc(cx, cy, 24, 0, Math.PI * 2);
          ctx.stroke();
          ctx.fillStyle = '#22c55e';
          ctx.beginPath();
          ctx.arc(cx, cy, 13, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 3.5;
          ctx.lineCap = 'round';
          ctx.beginPath();
          ctx.moveTo(cx - 6, cy);
          ctx.lineTo(cx - 1.5, cy + 5);
          ctx.lineTo(cx + 7, cy - 5);
          ctx.stroke();
          ctx.restore();
        } else {
          const alpha = 1 - (now - m.born) / 700;
          ctx.save();
          ctx.globalAlpha = alpha;
          ctx.strokeStyle = '#ef4444';
          ctx.lineWidth = 5;
          ctx.lineCap = 'round';
          ctx.beginPath();
          ctx.moveTo(cx - 11, cy - 11);
          ctx.lineTo(cx + 11, cy + 11);
          ctx.moveTo(cx + 11, cy - 11);
          ctx.lineTo(cx - 11, cy + 11);
          ctx.stroke();
          ctx.restore();
        }
      }
    }
  }

  // -- HUD and overlays ------------------------------------------------------
  fmtTime() {
    const s = Math.max(0, Math.ceil(this.timeLeft));
    return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
  }

  updateHud() {
    const scene = this.scene;
    this.hud.title.textContent = `${scene.name} — find ${DIFF_COUNT} differences`;
    this.hud.level.textContent = `Level ${this.levelIndex + 1} of ${SCENES.length}`;
    this.hud.counter.textContent = `${this.foundCount} / ${DIFF_COUNT} found`;
    this.hud.dots.innerHTML = '';
    for (let i = 0; i < DIFF_COUNT; i++) {
      const dot = document.createElement('span');
      dot.className = 'dot' + (i < this.foundCount ? ' on' : '');
      this.hud.dots.appendChild(dot);
    }
    this.hud.timer.textContent = this.fmtTime();
    this.hud.timer.classList.toggle('low', this.timeLeft <= 15 && this.screen === 'play');
    const bar = this.hud.timerBar;
    bar.style.width = `${Math.max(0, (this.timeLeft / scene.timeLimit) * 100)}%`;
    bar.classList.toggle('low', this.timeLeft <= 15);
    this.hud.score.textContent = `Score ${this.score}`;
    this.hud.combo.textContent = this.combo > 1 ? `Combo x${this.combo}` : '';
    this.hud.hintBtn.textContent = `Hint (${this.hintsLeft})`;
    this.hud.hintBtn.disabled = this.hintsLeft <= 0 || this.screen !== 'play';
    this.hud.muteBtn.textContent = this.sounds.muted ? 'Sound: off' : 'Sound: on';
    this.hud.tagline.textContent = scene.tagline;
  }

  announce(msg) {
    if (this.hud.status) this.hud.status.textContent = msg;
  }

  renderOverlay() {
    const o = this.overlay;
    o.root.classList.toggle('hidden', this.screen === 'play');
    if (this.screen === 'play') return;
    const scene = this.scene;
    if (this.screen === 'title') {
      o.body.innerHTML = `
        <p class="eyebrow">A spot-the-difference hunt in six hand-drawn worlds</p>
        <h1>Spot the<br>Difference</h1>
        <p class="lede">Two pictures. Seven differences. One sharp eye.
        Hunt through a sunny park, a cosy kitchen, a deep reef, a space station,
        an old library and a desert oasis — before the clock runs out.</p>
        <p class="howto"><strong>How to play:</strong> click a difference on either picture to mark it.
        Find all ${DIFF_COUNT} to clear the level. Wrong clicks cost 25 points and 3 seconds.
        Press <kbd>H</kbd> for a hint (3 per level), <kbd>M</kbd> to mute.</p>
        <button class="primary" data-act="play">Play — start at Sunny Park</button>
        <button class="ghost" data-act="select">Choose a level</button>
        ${this.bestTotal() ? `<p class="best">Best total score so far: <strong>${this.bestTotal()}</strong></p>` : ''}`;
    } else if (this.screen === 'select') {
      const cards = SCENES.map((s, i) => {
        const best = this.best[s.id] || 0;
        const stars = '★'.repeat(this.stars[s.id] || 0) + '☆'.repeat(3 - (this.stars[s.id] || 0));
        return `<button class="level-card" data-level="${i}">
          <span class="lvl-num">Level ${i + 1}</span>
          <span class="lvl-name">${s.name}</span>
          <span class="lvl-tag">${s.tagline}</span>
          <span class="lvl-meta">${stars} ${best ? `· best ${best}` : '· not played yet'}</span>
        </button>`;
      }).join('');
      o.body.innerHTML = `
        <h2>Choose a level</h2>
        <p class="lede">Every level hides ${DIFF_COUNT} differences. Harder worlds hide them better.</p>
        <div class="level-grid">${cards}</div>
        <button class="ghost" data-act="title">Back to title</button>`;
    } else if (this.screen === 'levelDone') {
      const stars = '★'.repeat(this.stars[scene.id]) + '☆'.repeat(3 - this.stars[scene.id]);
      o.body.innerHTML = `
        <p class="eyebrow">Level ${this.levelIndex + 1} complete</p>
        <h2>${scene.name} — cleared!</h2>
        <p class="stars">${stars}</p>
        <p class="lede">All ${DIFF_COUNT} differences found. Time bonus banked.</p>
        <p class="best">Score: <strong>${this.score}</strong> · Best combo: <strong>x${this.bestCombo}</strong></p>
        <button class="primary" data-act="next">Next level — ${SCENES[this.levelIndex + 1].name}</button>
        <button class="ghost" data-act="select">Level select</button>`;
    } else if (this.screen === 'gameOver') {
      o.body.innerHTML = `
        <p class="eyebrow">Out of time</p>
        <h2>The clock beat you on ${scene.name}</h2>
        <p class="lede">You found ${this.foundCount} of ${DIFF_COUNT} differences. The rest are still hiding.</p>
        <p class="best">Score: <strong>${this.score}</strong></p>
        <button class="primary" data-act="retry">Try ${scene.name} again</button>
        <button class="ghost" data-act="select">Level select</button>`;
    } else if (this.screen === 'win') {
      const totalStars = Object.values(this.stars).reduce((a, b) => a + b, 0);
      o.body.innerHTML = `
        <p class="eyebrow">All six worlds cleared</p>
        <h1>You found<br>them all!</h1>
        <p class="stars">${'★'.repeat(Math.min(18, totalStars))}</p>
        <p class="lede">Forty-two differences, six worlds, one very sharp eye.</p>
        <p class="best">Final score: <strong>${this.score}</strong> · Best combo: <strong>x${this.bestCombo}</strong></p>
        <button class="primary" data-act="again">Play again from Sunny Park</button>
        <button class="ghost" data-act="select">Replay a level</button>`;
    }
    o.body.querySelectorAll('[data-act]').forEach((b) => {
      b.addEventListener('click', () => this.handleAction(b.dataset.act));
    });
    o.body.querySelectorAll('[data-level]').forEach((b) => {
      b.addEventListener('click', () => {
        this.sounds.tick();
        this.startLevel(Number(b.dataset.level));
      });
    });
  }

  bestTotal() {
    return Object.values(this.best).reduce((a, b) => a + b, 0);
  }

  handleAction(act) {
    this.sounds.ensure();
    this.sounds.tick();
    if (act === 'play') this.startLevel(0);
    else if (act === 'select') this.setScreen('select');
    else if (act === 'title') this.setScreen('title');
    else if (act === 'next') this.nextLevel();
    else if (act === 'retry') this.startLevel(this.levelIndex);
    else if (act === 'again') { this.score = 0; this.bestCombo = 0; this.startLevel(0); }
  }
}
