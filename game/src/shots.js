// Deterministic screenshot states, driven by ?shot=... in the URL.
// The game renders these states from its own code, exactly as a player
// would reach them, so every screenshot is a real render of the game.
//   ?shot=cover — Deep Reef mid-hunt: 3 differences found, 4 still hiding.
//   ?shot=select — the level-select screen.
//   ?shot=play  — Sunny Park mid-hunt: 2 differences found.
//   ?shot=win   — the Old Library cleared, three stars.
// Without a shot parameter the game opens on its title screen.
import { SCENES } from './scenes.js';

export const SHOTS = {
  cover: { level: 2, found: 3, timeLeft: 74 },
  select: { level: 0, found: 0, timeLeft: 120, screen: 'select' },
  play: { level: 0, found: 2, timeLeft: 96 },
  win: { level: 4, found: 7, timeLeft: 68 },
};

export function applyShot(game, name) {
  const shot = SHOTS[name];
  if (!shot) return false;
  game.shotMode = true;
  game.score = name === 'win' ? 1840 : name === 'cover' ? 325 : 200;
  game.combo = shot.found >= 2 ? 2 : 0;
  game.bestCombo = 2;
  game.startLevel(shot.level);
  game.found = new Set(SCENES[shot.level].diffs.slice(0, shot.found).map((d) => d.id));
  game.markers = SCENES[shot.level].diffs
    .slice(0, shot.found)
    .map((d) => ({ x: d.x, y: d.y, kind: 'found', born: 0 }));
  game.timeLeft = shot.timeLeft;
  game.hintsLeft = 3;
  if (name === 'win') {
    game.stars[SCENES[shot.level].id] = 3;
    game.setScreen('levelDone');
  } else if (shot.screen) {
    game.setScreen(shot.screen);
  } else {
    game.setScreen('play');
  }
  game.updateHud();
  return true;
}
