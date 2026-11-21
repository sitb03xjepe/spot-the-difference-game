// Bootstrap: wires the canvas, HUD and overlays together, starts the
// animation loop, and honours ?shot=... for deterministic screenshots.
import { Game, CANVAS_W, CANVAS_H } from './game.js';
import { applyShot } from './shots.js';

const canvas = document.getElementById('game');
canvas.width = CANVAS_W;
canvas.height = CANVAS_H;

const hud = {
  title: document.getElementById('hud-title'),
  level: document.getElementById('hud-level'),
  counter: document.getElementById('hud-counter'),
  dots: document.getElementById('hud-dots'),
  timer: document.getElementById('hud-timer'),
  timerBar: document.getElementById('hud-timer-bar'),
  score: document.getElementById('hud-score'),
  combo: document.getElementById('hud-combo'),
  hintBtn: document.getElementById('btn-hint'),
  muteBtn: document.getElementById('btn-mute'),
  tagline: document.getElementById('hud-tagline'),
  status: document.getElementById('status'),
};

const overlay = {
  root: document.getElementById('overlay'),
  body: document.getElementById('overlay-body'),
};

const game = new Game(canvas, hud, overlay);
// Exposed for automated play-testing: state, diffs and panel geometry.
window.__spotGame = game;

hud.hintBtn.addEventListener('click', () => game.useHint());
hud.muteBtn.addEventListener('click', () => game.toggleMute());

const params = new URLSearchParams(window.location.search);
const shot = params.get('shot');
if (shot && applyShot(game, shot)) {
  document.title = `Spot the Difference — shot ${shot}`;
} else {
  game.setScreen('title');
}

function frame(now) {
  game.tick(now);
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
