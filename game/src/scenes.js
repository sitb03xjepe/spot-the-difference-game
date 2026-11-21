// Hand-crafted scenes for "Spot the Difference".
// Every scene is drawn twice, once per panel, from the same code: the base
// picture is identical, and each of the 7 differences is a small variant
// drawn only on one side. A diff has a hit position (x, y, r) in scene
// coordinates (600 x 440) and a left/right painter; one side may paint
// nothing (missing object) or paint a different colour/shape.
import { SCENE_W, SCENE_H, circle, ellipse, rect, rr, poly, line, cloud, bird, fish, star, flower, tree, steam } from './draw.js';

function sky(ctx, top, bottom) {
  const g = ctx.createLinearGradient(0, 0, 0, 300);
  g.addColorStop(0, top);
  g.addColorStop(1, bottom);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, SCENE_W, 300);
}

function sunFace(ctx, x, y, r, withGlasses) {
  circle(ctx, x, y, r, '#fde047');
  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 4;
  for (let i = 0; i < 8; i++) {
    const a = (i * Math.PI) / 4;
    line(ctx, x + Math.cos(a) * (r + 6), y + Math.sin(a) * (r + 6),
      x + Math.cos(a) * (r + 14), y + Math.sin(a) * (r + 14), '#f59e0b', 4);
  }
  if (withGlasses) {
    rr(ctx, x - 22, y - 8, 18, 12, 5, '#1e293b');
    rr(ctx, x + 4, y - 8, 18, 12, 5, '#1e293b');
    line(ctx, x - 4, y - 2, x + 4, y - 2, '#1e293b', 3);
  } else {
    circle(ctx, x - 10, y - 4, 3, '#78350f');
    circle(ctx, x + 10, y - 4, 3, '#78350f');
    ctx.strokeStyle = '#78350f';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(x, y + 6, 9, 0.15 * Math.PI, 0.85 * Math.PI);
    ctx.stroke();
  }
}

// ---------------------------------------------------------------- scene 1
function drawPark(ctx, side) {
  sky(ctx, '#7cc4f5', '#dff3ff');
  sunFace(ctx, 90, 70, 32, side === 'right');
  cloud(ctx, 220, 62, 1);
  cloud(ctx, 430, 52, 0.9);
  cloud(ctx, 520, 112, 0.8);
  if (side === 'right') cloud(ctx, 320, 132, 0.8);
  bird(ctx, 150, 92);
  bird(ctx, 300, 72);
  if (side === 'left') bird(ctx, 480, 92);
  // Grass.
  ctx.fillStyle = '#79c94f';
  ctx.fillRect(0, 300, SCENE_W, 140);
  ctx.fillStyle = '#8ed45f';
  ellipse(ctx, 300, 310, 320, 26, '#8ed45f');
  // Pond.
  ellipse(ctx, 150, 372, 112, 34, '#38bdf8');
  ellipse(ctx, 150, 368, 96, 26, '#7dd3fc');
  if (side === 'left') {
    // A duck on the pond.
    ellipse(ctx, 118, 366, 14, 9, '#fde68a');
    circle(ctx, 130, 356, 7, '#fde68a');
    poly(ctx, [[136, 356], [143, 358], [136, 360]], '#f97316');
    circle(ctx, 131, 354, 1.6, '#0f172a');
  }
  // Path.
  ctx.fillStyle = '#e8d5a3';
  ctx.beginPath();
  ctx.moveTo(270, 440);
  ctx.lineTo(300, 330);
  ctx.lineTo(330, 330);
  ctx.lineTo(360, 440);
  ctx.closePath();
  ctx.fill();
  // Tree with apples.
  tree(ctx, 505, 305, 1.05);
  circle(ctx, 488, 232, 6, '#ef4444');
  circle(ctx, 528, 246, 6, '#ef4444');
  if (side === 'left') circle(ctx, 522, 224, 6, '#ef4444');
  // Bench.
  ctx.fillStyle = '#8b5a2b';
  ctx.fillRect(330, 322, 96, 10);
  ctx.fillRect(330, 336, 96, 10);
  ctx.fillRect(338, 346, 8, 26);
  ctx.fillRect(410, 346, 8, 26);
  if (side === 'right') {
    // A flower pot on the bench.
    poly(ctx, [[386, 312], [404, 312], [400, 322], [390, 322]], '#b45309');
    flower(ctx, 395, 300, '#f472b6');
  }
  // Kite.
  const kiteColor = side === 'left' ? '#ef4444' : '#14b8a6';
  poly(ctx, [[380, 96], [402, 122], [380, 148], [358, 122]], kiteColor);
  line(ctx, 380, 96, 380, 148, '#0f172a', 1.5);
  line(ctx, 358, 122, 402, 122, '#0f172a', 1.5);
  ctx.strokeStyle = '#64748b';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(380, 148);
  ctx.quadraticCurveTo(360, 190, 336, 224);
  ctx.stroke();
  // Dog.
  ellipse(ctx, 232, 352, 26, 15, '#d97706');
  circle(ctx, 256, 340, 12, '#d97706');
  poly(ctx, [[248, 330], [254, 322], [258, 332]], '#92400e');
  circle(ctx, 259, 337, 2, '#0f172a');
  line(ctx, 208, 344, 198, 332, '#92400e', 5);
  // Flowers.
  flower(ctx, 60, 410, '#f472b6');
  flower(ctx, 90, 422, '#fbbf24');
  flower(ctx, 540, 414, '#c084fc');
  flower(ctx, 566, 426, '#f472b6');
}

const parkDiffs = [
  { id: 'sun-glasses', x: 90, y: 70, r: 40, label: 'the sun wears sunglasses' },
  { id: 'extra-cloud', x: 320, y: 132, r: 36, label: 'an extra cloud' },
  { id: 'kite-colour', x: 380, y: 122, r: 30, label: 'the kite changed colour' },
  { id: 'bench-pot', x: 395, y: 308, r: 24, label: 'a flower pot on the bench' },
  { id: 'pond-duck', x: 122, y: 362, r: 26, label: 'a duck on the pond' },
  { id: 'tree-apple', x: 522, y: 224, r: 16, label: 'an apple on the tree' },
  { id: 'third-bird', x: 480, y: 92, r: 18, label: 'a third bird in the sky' },
];

export const park = {
  id: 'park', name: 'Sunny Park', tagline: 'Kites, ducks and a very cool sun.',
  difficulty: 1, timeLimit: 120, draw: drawPark, diffs: parkDiffs,
};

// ---------------------------------------------------------------- scene 2
function drawKitchen(ctx, side) {
  // Wall and floor.
  rect(ctx, 0, 0, SCENE_W, 340, '#fdeecd');
  rect(ctx, 0, 340, SCENE_W, 100, '#b07a4a');
  for (let x = 0; x < SCENE_W; x += 60) line(ctx, x, 340, x + 30, 440, '#96683d', 2);
  // Window with sky and curtains.
  rr(ctx, 82, 52, 190, 150, 8, '#bae6fd');
  circle(ctx, 130, 92, 22, '#fde047');
  cloud(ctx, 210, 92, 0.7);
  ctx.fillStyle = '#79c94f';
  ctx.fillRect(82, 168, 190, 34);
  ctx.strokeStyle = '#3b82f6';
  ctx.lineWidth = 6;
  ctx.strokeRect(82, 52, 190, 150);
  line(ctx, 177, 52, 177, 202, '#3b82f6', 5);
  line(ctx, 82, 127, 272, 127, '#3b82f6', 5);
  if (side === 'left') {
    // Left curtain drawn closed over the window edge.
    ctx.fillStyle = '#f472b6';
    ctx.fillRect(246, 52, 26, 150);
    ctx.fillStyle = '#ec4899';
    ctx.fillRect(246, 52, 8, 150);
  }
  // Shelf with three jars.
  ctx.fillStyle = '#8b5a2b';
  ctx.fillRect(420, 150, 150, 10);
  const jarColors = ['#fca5a5', side === 'left' ? '#ef4444' : '#22c55e', '#fcd34d'];
  jarColors.forEach((c, i) => {
    const jx = 432 + i * 48;
    rr(ctx, jx, 108, 36, 42, 6, '#e0f2fe');
    rr(ctx, jx + 8, jx === 480 ? 120 : 122, 20, 14, 3, c);
    rr(ctx, jx, 100, 36, 10, 4, '#92400e');
  });
  // Wall clock.
  circle(ctx, 470, 88, 30, '#ffffff');
  ctx.strokeStyle = '#334155';
  ctx.lineWidth = 3;
  ctx.beginPath(); ctx.arc(470, 88, 30, 0, Math.PI * 2); ctx.stroke();
  if (side === 'left') {
    line(ctx, 470, 88, 470, 66, '#0f172a', 3);
    line(ctx, 470, 88, 488, 88, '#0f172a', 3);
  } else {
    line(ctx, 470, 88, 470, 66, '#0f172a', 3);
    line(ctx, 470, 88, 470, 104, '#0f172a', 3);
  }
  circle(ctx, 470, 88, 3, '#0f172a');
  // Table.
  ctx.fillStyle = '#a16207';
  ctx.fillRect(300, 300, 260, 14);
  ctx.fillRect(312, 314, 12, 60);
  ctx.fillRect(536, 314, 12, 60);
  // Fruit bowl.
  ellipse(ctx, 360, 296, 44, 12, '#7c2d12');
  circle(ctx, 342, 288, 9, '#ef4444');
  circle(ctx, 360, 284, 9, '#f59e0b');
  circle(ctx, 378, 288, 9, '#84cc16');
  if (side === 'left') circle(ctx, 352, 272, 9, '#dc2626');
  // Kettle with steam on the right side.
  rr(ctx, 410, 272, 52, 30, 8, '#64748b');
  poly(ctx, [[462, 280], [480, 272], [480, 290], [462, 292]], '#64748b');
  rr(ctx, 428, 262, 16, 12, 5, '#475569');
  if (side === 'right') { steam(ctx, 436, 258, 22); steam(ctx, 448, 260, 18); }
  // Mug.
  if (side === 'left') {
    rr(ctx, 512, 282, 26, 20, 4, '#0ea5e9');
    ctx.strokeStyle = '#0ea5e9';
    ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(540, 292, 7, -Math.PI / 2, Math.PI / 2); ctx.stroke();
  }
  // Chair with a cat.
  ctx.fillStyle = '#78350f';
  ctx.fillRect(150, 300, 90, 12);
  ctx.fillRect(150, 300, 10, 74);
  ctx.fillRect(230, 300, 10, 74);
  ctx.fillRect(150, 260, 10, 42);
  ellipse(ctx, 196, 288, 30, 17, '#f97316');
  circle(ctx, 222, 274, 13, '#f97316');
  poly(ctx, [[214, 264], [218, 254], [224, 264]], '#f97316');
  poly(ctx, [[226, 264], [230, 254], [234, 264]], '#f97316');
  ctx.strokeStyle = '#f97316';
  ctx.lineWidth = 7;
  ctx.lineCap = 'round';
  ctx.beginPath();
  if (side === 'left') { ctx.moveTo(168, 292); ctx.quadraticCurveTo(150, 268, 158, 250); }
  else { ctx.moveTo(168, 292); ctx.quadraticCurveTo(152, 302, 160, 316); }
  ctx.stroke();
  // Rug.
  ellipse(ctx, 300, 414, 150, 20, '#f87171');
  ellipse(ctx, 300, 414, 104, 13, '#fca5a5');
}

const kitchenDiffs = [
  { id: 'clock-time', x: 470, y: 88, r: 30, label: 'the clock shows a different time' },
  { id: 'kettle-steam', x: 442, y: 252, r: 24, label: 'steam over the kettle' },
  { id: 'cat-tail', x: 158, y: 268, r: 26, label: 'the cat’s tail moved' },
  { id: 'fourth-fruit', x: 352, y: 272, r: 18, label: 'a fourth fruit in the bowl' },
  { id: 'jar-label', x: 498, y: 128, r: 20, label: 'the middle jar’s label changed colour' },
  { id: 'curtain', x: 259, y: 127, r: 26, label: 'a curtain over the window' },
  { id: 'mug', x: 525, y: 292, r: 20, label: 'a blue mug on the table' },
];

export const kitchen = {
  id: 'kitchen', name: 'Cozy Kitchen', tagline: 'The kettle is on and the cat is judging you.',
  difficulty: 1, timeLimit: 120, draw: drawKitchen, diffs: kitchenDiffs,
};

// ---------------------------------------------------------------- scene 3
function drawReef(ctx, side) {
  const g = ctx.createLinearGradient(0, 0, 0, SCENE_H);
  g.addColorStop(0, '#0c4a6e');
  g.addColorStop(1, '#0369a1');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, SCENE_W, SCENE_H);
  // Light rays.
  ctx.fillStyle = 'rgba(186,230,253,0.10)';
  poly(ctx, [[80, 0], [140, 0], [220, 440], [120, 440]], 'rgba(186,230,253,0.10)');
  poly(ctx, [[300, 0], [340, 0], [420, 440], [340, 440]], 'rgba(186,230,253,0.10)');
  // Sand.
  ellipse(ctx, 300, 452, 340, 52, '#e8d5a3');
  // Coral.
  ctx.strokeStyle = side === 'left' ? '#f472b6' : '#a78bfa';
  ctx.lineWidth = 10;
  ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(80, 400); ctx.quadraticCurveTo(60, 340, 78, 300); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(80, 400); ctx.quadraticCurveTo(100, 350, 96, 312); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(80, 400); ctx.quadraticCurveTo(52, 372, 40, 340); ctx.stroke();
  // Seaweed.
  ctx.strokeStyle = '#22a06b';
  ctx.lineWidth = 7;
  const blades = side === 'left' ? 4 : 3;
  for (let i = 0; i < blades; i++) {
    const bx = 540 + i * 16;
    ctx.beginPath();
    ctx.moveTo(bx, 420);
    ctx.quadraticCurveTo(bx + 8, 380, bx - 2, 348);
    ctx.stroke();
  }
  // Pebbles and two background fish, identical on both panels.
  ellipse(ctx, 330, 420, 14, 8, '#94a3b8');
  ellipse(ctx, 200, 424, 10, 6, '#64748b');
  ellipse(ctx, 420, 418, 9, 6, '#94a3b8');
  fish(ctx, 420, 250, 0.7, '#67e8f9', true);
  fish(ctx, 150, 282, 0.6, '#fda4af');
  // Starfish.
  star(ctx, 140, 402, 20, side === 'left' ? '#fb923c' : '#a78bfa');
  // Shell.
  if (side === 'left') {
    ctx.fillStyle = '#fda4af';
    ctx.beginPath();
    ctx.arc(240, 412, 16, Math.PI, 0);
    ctx.closePath();
    ctx.fill();
    line(ctx, 232, 412, 232, 398, '#be123c', 2);
    line(ctx, 240, 412, 240, 396, '#be123c', 2);
    line(ctx, 248, 412, 248, 398, '#be123c', 2);
  }
  // Fish school.
  fish(ctx, 200, 150, 1, '#fbbf24');
  fish(ctx, 240, 130, 0.8, '#f472b6');
  fish(ctx, 280, 160, 0.9, '#38bdf8');
  if (side === 'left') fish(ctx, 310, 140, 0.85, '#a3e635');
  fish(ctx, 340, 128, 0.8, '#fbbf24');
  fish(ctx, 180, 210, 0.9, '#38bdf8', true);
  fish(ctx, 380, 210, 1, '#f472b6', true);
  // Diver.
  ctx.save();
  ctx.translate(470, 110);
  ctx.rotate(-0.25);
  ellipse(ctx, 0, 0, 34, 16, '#1e3a5f');
  circle(ctx, 34, -4, 12, '#fcd9b8');
  circle(ctx, 34, -4, 9, 'rgba(186,230,253,0.7)');
  rr(ctx, -28, -22, 16, 26, 6, side === 'left' ? '#facc15' : '#ef4444');
  line(ctx, 44, 0, 58, 10, '#94a3b8', 3);
  ctx.restore();
  // Bubbles above the diver.
  circle(ctx, 440, 66, 6, 'rgba(255,255,255,0.65)');
  circle(ctx, 452, 48, 5, 'rgba(255,255,255,0.65)');
  circle(ctx, 462, 30, 4, 'rgba(255,255,255,0.65)');
  if (side === 'right') {
    circle(ctx, 428, 56, 5, 'rgba(255,255,255,0.65)');
    circle(ctx, 420, 38, 4, 'rgba(255,255,255,0.65)');
  }
  // Treasure chest.
  ctx.fillStyle = '#7c4a21';
  ctx.fillRect(462, 384, 62, 30);
  ctx.fillStyle = '#f59e0b';
  ctx.fillRect(462, 384, 62, 6);
  ctx.fillRect(488, 384, 10, 30);
  if (side === 'right') {
    ctx.fillStyle = '#7c4a21';
    ctx.fillRect(462, 366, 62, 14);
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(462, 366, 62, 5);
    circle(ctx, 476, 380, 5, '#fde047');
    circle(ctx, 492, 378, 6, '#fde047');
    circle(ctx, 508, 380, 5, '#fde047');
    circle(ctx, 500, 372, 4, '#fbbf24');
  } else {
    ctx.fillStyle = '#7c4a21';
    ctx.fillRect(462, 372, 62, 12);
  }
}

const reefDiffs = [
  { id: 'fish-count', x: 310, y: 140, r: 22, label: 'a fourth fish in the school' },
  { id: 'chest-open', x: 493, y: 384, r: 30, label: 'the treasure chest is open' },
  { id: 'starfish-colour', x: 140, y: 402, r: 22, label: 'the starfish changed colour' },
  { id: 'seaweed-count', x: 566, y: 384, r: 26, label: 'a blade of seaweed is missing' },
  { id: 'tank-colour', x: 448, y: 96, r: 24, label: 'the diver’s tank changed colour' },
  { id: 'extra-bubbles', x: 426, y: 46, r: 20, label: 'two extra bubbles' },
  { id: 'shell', x: 240, y: 406, r: 20, label: 'a shell on the sand' },
];

export const reef = {
  id: 'reef', name: 'Deep Reef', tagline: 'Something glitters in the chest. Something else is missing.',
  difficulty: 2, timeLimit: 120, draw: drawReef, diffs: reefDiffs,
};

// ---------------------------------------------------------------- scene 4
function drawStation(ctx, side) {
  // Interior.
  rect(ctx, 0, 0, SCENE_W, SCENE_H, '#1e293b');
  rect(ctx, 0, 0, SCENE_W, 18, '#334155');
  for (let x = 20; x < SCENE_W; x += 80) {
    circle(ctx, x, 9, 3, '#475569');
  }
  // Big round window.
  circle(ctx, 300, 168, 118, '#020617');
  ctx.strokeStyle = '#94a3b8';
  ctx.lineWidth = 10;
  ctx.beginPath(); ctx.arc(300, 168, 118, 0, Math.PI * 2); ctx.stroke();
  ctx.save();
  ctx.beginPath(); ctx.arc(300, 168, 110, 0, Math.PI * 2); ctx.clip();
  // Earth and stars inside the window.
  circle(ctx, 320, 200, 52, '#38bdf8');
  ellipse(ctx, 300, 190, 30, 16, '#22a06b');
  ellipse(ctx, 336, 216, 18, 10, '#22a06b');
  if (side === 'left') circle(ctx, 378, 118, 16, '#e2e8f0');
  star(ctx, 226, 108, 5, '#ffffff');
  star(ctx, 262, 88, 4, '#ffffff');
  if (side === 'left') star(ctx, 250, 138, 4, '#ffffff');
  star(ctx, 356, 84, 4, '#ffffff');
  star(ctx, 388, 168, 5, '#ffffff');
  ctx.restore();
  // Flag on the wall.
  if (side === 'left') {
    line(ctx, 516, 66, 516, 118, '#94a3b8', 3);
    poly(ctx, [[516, 66], [556, 76], [516, 88]], '#ef4444');
    circle(ctx, 528, 76, 4, '#fde047');
  }
  // Astronaut floating.
  ctx.save();
  ctx.translate(118, 300);
  ctx.rotate(0.35);
  rr(ctx, -20, -26, 40, 52, 14, '#f1f5f9');
  circle(ctx, 0, -38, 17, '#f1f5f9');
  circle(ctx, 0, -38, 12, '#0ea5e9');
  if (side === 'left') {
    circle(ctx, -14, -46, 4, '#fde047');
    ctx.fillStyle = 'rgba(253,224,71,0.25)';
    ctx.beginPath(); ctx.arc(0, -38, 24, 0, Math.PI * 2); ctx.fill();
  }
  rr(ctx, -34, -16, 12, 30, 5, '#f1f5f9');
  rr(ctx, 22, -16, 12, 30, 5, '#f1f5f9');
  ctx.restore();
  // Robot.
  rr(ctx, 452, 262, 56, 62, 10, '#94a3b8');
  circle(ctx, 480, 240, 20, '#cbd5e1');
  circle(ctx, 473, 238, 3.5, '#0ea5e9');
  circle(ctx, 487, 238, 3.5, '#0ea5e9');
  rr(ctx, 468, 252, 24, 4, 2, '#334155');
  if (side === 'left') {
    line(ctx, 480, 220, 480, 202, '#94a3b8', 3);
    circle(ctx, 480, 198, 5, '#ef4444');
  }
  rr(ctx, 458, 330, 14, 26, 4, '#64748b');
  rr(ctx, 488, 330, 14, 26, 4, '#64748b');
  // Potted plant.
  poly(ctx, [[548, 396], [572, 396], [568, 414], [552, 414]], '#b45309');
  ctx.strokeStyle = '#22a06b';
  ctx.lineWidth = 5;
  ctx.lineCap = 'round';
  const leaves = side === 'left' ? 5 : 4;
  for (let i = 0; i < leaves; i++) {
    const a = -Math.PI / 2 + (i - 2) * 0.45;
    ctx.beginPath();
    ctx.moveTo(560, 396);
    ctx.quadraticCurveTo(560 + Math.cos(a) * 16, 396 + Math.sin(a) * 22, 560 + Math.cos(a) * 26, 396 + Math.sin(a) * 34);
    ctx.stroke();
  }
  // Control panel with buttons.
  rr(ctx, 210, 396, 220, 30, 8, '#0f172a');
  circle(ctx, 240, 411, 8, '#22c55e');
  circle(ctx, 272, 411, 8, '#f59e0b');
  circle(ctx, 304, 411, 8, side === 'left' ? '#ef4444' : '#22c55e');
  circle(ctx, 336, 411, 8, '#38bdf8');
  rr(ctx, 368, 403, 46, 16, 4, '#1e293b');
  line(ctx, 374, 411, 408, 411, '#22c55e', 3);
}

const stationDiffs = [
  { id: 'moon', x: 378, y: 118, r: 22, label: 'a moon beside Earth' },
  { id: 'helmet-light', x: 104, y: 258, r: 20, label: 'the astronaut’s helmet light' },
  { id: 'robot-antenna', x: 480, y: 204, r: 18, label: 'the robot’s antenna' },
  { id: 'plant-leaf', x: 560, y: 366, r: 22, label: 'a leaf on the plant' },
  { id: 'panel-button', x: 304, y: 411, r: 16, label: 'a panel button changed colour' },
  { id: 'window-star', x: 250, y: 138, r: 16, label: 'a star in the window' },
  { id: 'wall-flag', x: 532, y: 84, r: 24, label: 'a flag on the wall' },
];

export const station = {
  id: 'station', name: 'Space Station', tagline: 'Houston, we have a discrepancy. Seven, actually.',
  difficulty: 2, timeLimit: 120, draw: drawStation, diffs: stationDiffs,
};

// ---------------------------------------------------------------- scene 5
function drawLibrary(ctx, side) {
  rect(ctx, 0, 0, SCENE_W, SCENE_H, '#92400e');
  // Window with the moon.
  rr(ctx, 480, 40, 96, 110, 8, '#0f172a');
  if (side === 'left') {
    circle(ctx, 528, 92, 26, '#fef9c3');
  } else {
    circle(ctx, 528, 92, 26, '#fef9c3');
    circle(ctx, 540, 86, 22, '#0f172a');
  }
  ctx.strokeStyle = '#78350f';
  ctx.lineWidth = 5;
  ctx.strokeRect(480, 40, 96, 110);
  line(ctx, 528, 40, 528, 150, '#78350f', 4);
  // Bookshelves.
  const shelves = [
    { x: 30, y: 60, w: 200, rows: 3 },
    { x: 250, y: 60, w: 180, rows: 3 },
  ];
  const spineColors = ['#ef4444', '#f59e0b', '#22c55e', '#3b82f6', '#a855f7', '#ec4899', '#14b8a6'];
  shelves.forEach((s) => {
    ctx.fillStyle = '#78350f';
    ctx.fillRect(s.x - 8, s.y - 8, s.w + 16, s.rows * 62 + 16);
    for (let r = 0; r < s.rows; r++) {
      let bx = s.x + 4;
      let i = 0;
      while (bx < s.x + s.w - 14) {
        const bw = 14 + ((r * 7 + i * 5) % 10);
        let c = spineColors[(r * 3 + i) % spineColors.length];
        // The one spine that changes colour between panels.
        if (s.x === 30 && r === 1 && i === 3) c = side === 'left' ? '#ef4444' : '#3b82f6';
        ctx.fillStyle = c;
        ctx.fillRect(bx, s.y + r * 62 + 6, bw - 2, 48);
        bx += bw;
        i++;
      }
      ctx.fillStyle = '#5b3413';
      ctx.fillRect(s.x - 4, s.y + r * 62 + 54, s.w + 8, 6);
    }
  });
  // Ladder leaning on the right shelf.
  ctx.strokeStyle = '#a16207';
  ctx.lineWidth = 6;
  ctx.beginPath(); ctx.moveTo(452, 330); ctx.lineTo(500, 130); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(478, 330); ctx.lineTo(526, 130); ctx.stroke();
  const rungs = side === 'left' ? 5 : 4;
  for (let i = 0; i < rungs; i++) {
    const t = 0.18 + i * 0.17;
    const x1 = 452 + (500 - 452) * t;
    const y1 = 330 + (130 - 330) * t;
    const x2 = 478 + (526 - 478) * t;
    const y2 = 330 + (130 - 330) * t;
    line(ctx, x1, y1, x2, y2, '#a16207', 5);
  }
  // Desk.
  ctx.fillStyle = '#5b3413';
  ctx.fillRect(220, 330, 240, 16);
  ctx.fillRect(232, 346, 12, 60);
  ctx.fillRect(436, 346, 12, 60);
  // Lamp.
  line(ctx, 300, 330, 300, 282, '#334155', 5);
  poly(ctx, [[282, 282], [318, 282], [310, 258], [290, 258]], '#f59e0b');
  if (side === 'left') {
    ctx.fillStyle = 'rgba(253,224,71,0.30)';
    ctx.beginPath();
    ctx.moveTo(290, 258);
    ctx.lineTo(310, 258);
    ctx.lineTo(330, 330);
    ctx.lineTo(270, 330);
    ctx.closePath();
    ctx.fill();
  }
  // Globe.
  circle(ctx, 400, 306, 24, '#38bdf8');
  if (side === 'left') {
    ellipse(ctx, 392, 300, 10, 7, '#22a06b');
    ellipse(ctx, 410, 314, 8, 5, '#22a06b');
  }
  ctx.strokeStyle = '#92400e';
  ctx.lineWidth = 4;
  ctx.beginPath(); ctx.arc(400, 306, 24, 0, Math.PI * 2); ctx.stroke();
  line(ctx, 400, 330, 400, 338, '#92400e', 4);
  // Teacup with steam on the right side.
  rr(ctx, 340, 312, 26, 18, 4, '#f8fafc');
  ctx.strokeStyle = '#f8fafc';
  ctx.lineWidth = 3;
  ctx.beginPath(); ctx.arc(368, 321, 6, -Math.PI / 2, Math.PI / 2); ctx.stroke();
  if (side === 'right') { steam(ctx, 348, 308, 18); steam(ctx, 358, 310, 14); }
  // Rug and the sleeping cat.
  ellipse(ctx, 150, 410, 120, 20, '#7c2d12');
  ellipse(ctx, 150, 410, 84, 13, '#b45309');
  if (side === 'left') {
    ellipse(ctx, 150, 398, 34, 14, '#475569');
    circle(ctx, 180, 392, 11, '#475569');
    poly(ctx, [[172, 384], [176, 374], [182, 384]], '#475569');
    line(ctx, 122, 392, 112, 382, '#475569', 5);
  }
}

const libraryDiffs = [
  { id: 'book-spine', x: 96, y: 140, r: 18, label: 'a book spine changed colour' },
  { id: 'globe-land', x: 400, y: 306, r: 26, label: 'land on the globe' },
  { id: 'lamp-glow', x: 300, y: 290, r: 26, label: 'the lamp is lit' },
  { id: 'sleeping-cat', x: 152, y: 394, r: 28, label: 'a cat asleep on the rug' },
  { id: 'ladder-rung', x: 496, y: 212, r: 20, label: 'a rung on the ladder' },
  { id: 'moon-phase', x: 528, y: 92, r: 24, label: 'the moon changed phase' },
  { id: 'teacup-steam', x: 353, y: 304, r: 20, label: 'steam over the teacup' },
];

export const library = {
  id: 'library', name: 'Old Library', tagline: 'Shh. The books are hiding things.',
  difficulty: 3, timeLimit: 120, draw: drawLibrary, diffs: libraryDiffs,
};

// ---------------------------------------------------------------- scene 6
function drawOasis(ctx, side) {
  const g = ctx.createLinearGradient(0, 0, 0, SCENE_H);
  g.addColorStop(0, '#fdba74');
  g.addColorStop(0.6, '#fed7aa');
  g.addColorStop(1, '#fde68a');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, SCENE_W, SCENE_H);
  // Sun: high on the left panel, lower on the right.
  const sunY = side === 'left' ? 66 : 108;
  circle(ctx, 482, sunY, 34, '#fde047');
  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 4;
  for (let i = 0; i < 8; i++) {
    const a = (i * Math.PI) / 4;
    line(ctx, 482 + Math.cos(a) * 40, sunY + Math.sin(a) * 40,
      482 + Math.cos(a) * 48, sunY + Math.sin(a) * 48, '#f59e0b', 4);
  }
  // Dunes.
  ctx.fillStyle = '#eab308';
  ctx.beginPath();
  ctx.moveTo(0, 300);
  ctx.quadraticCurveTo(150, 250, 300, 300);
  ctx.quadraticCurveTo(450, 345, 600, 295);
  ctx.lineTo(600, 440);
  ctx.lineTo(0, 440);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#ca8a04';
  ctx.beginPath();
  ctx.moveTo(0, 360);
  ctx.quadraticCurveTo(200, 320, 400, 360);
  ctx.quadraticCurveTo(520, 385, 600, 355);
  ctx.lineTo(600, 440);
  ctx.lineTo(0, 440);
  ctx.closePath();
  ctx.fill();
  // Oasis pond.
  ellipse(ctx, 290, 396, 120, 26, '#38bdf8');
  ellipse(ctx, 290, 392, 100, 19, '#7dd3fc');
  if (side === 'left') fish(ctx, 280, 392, 0.7, '#f97316');
  // Palm trees.
  ctx.strokeStyle = '#7c4a21';
  ctx.lineWidth = 10;
  ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(120, 330); ctx.quadraticCurveTo(112, 260, 128, 196); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(520, 330); ctx.quadraticCurveTo(528, 270, 512, 210); ctx.stroke();
  ctx.strokeStyle = '#22a06b';
  ctx.lineWidth = 7;
  [[128, 196], [512, 210]].forEach(([px, py]) => {
    for (let i = 0; i < 5; i++) {
      const a = -Math.PI / 2 + (i - 2) * 0.5;
      ctx.beginPath();
      ctx.moveTo(px, py);
      ctx.quadraticCurveTo(px + Math.cos(a) * 26, py + Math.sin(a) * 16, px + Math.cos(a) * 44, py + Math.sin(a) * 30);
      ctx.stroke();
    }
  });
  // Coconuts under the left palm.
  circle(ctx, 118, 200, 6, '#78350f');
  circle(ctx, 132, 204, 6, '#78350f');
  if (side === 'left') circle(ctx, 125, 190, 6, '#78350f');
  // Camel.
  ctx.fillStyle = '#d97706';
  ellipse(ctx, 360, 330, 46, 26, '#d97706');
  if (side === 'left') {
    ellipse(ctx, 340, 300, 16, 18, '#d97706');
    ellipse(ctx, 378, 300, 16, 18, '#d97706');
  } else {
    ellipse(ctx, 360, 300, 16, 18, '#d97706');
  }
  circle(ctx, 410, 296, 14, '#d97706');
  poly(ctx, [[402, 284], [408, 274], [414, 284]], '#d97706');
  ctx.strokeStyle = '#92400e';
  ctx.lineWidth = 6;
  line(ctx, 330, 350, 326, 388, '#92400e', 6);
  line(ctx, 348, 352, 348, 388, '#92400e', 6);
  line(ctx, 374, 352, 376, 388, '#92400e', 6);
  line(ctx, 392, 350, 396, 388, '#92400e', 6);
  // Tent.
  poly(ctx, [[470, 340], [530, 250], [590, 340]], '#dc2626');
  poly(ctx, [[500, 340], [530, 250], [560, 340]], '#7f1d1d');
  line(ctx, 530, 250, 530, 220, '#78350f', 4);
  if (side === 'left') {
    poly(ctx, [[530, 220], [556, 228], [530, 236]], '#f59e0b');
  }
  // Cactus.
  ctx.fillStyle = '#16a34a';
  rr(ctx, 84, 300, 18, 70, 8, '#16a34a');
  rr(ctx, 66, 322, 22, 10, 5, '#16a34a');
  rr(ctx, 66, 322, 10, 26, 5, '#16a34a');
  if (side === 'left') {
    rr(ctx, 92, 312, 22, 10, 5, '#16a34a');
    rr(ctx, 104, 312, 10, 26, 5, '#16a34a');
  }
  // Birds.
  bird(ctx, 200, 80);
  bird(ctx, 250, 64);
  if (side === 'right') bird(ctx, 250, 96);
  // A small flower by the pond.
  flower(ctx, 420, 396, '#f472b6');
}

const oasisDiffs = [
  { id: 'camel-humps', x: 356, y: 302, r: 30, label: 'the camel’s second hump' },
  { id: 'coconut', x: 125, y: 190, r: 18, label: 'a third coconut' },
  { id: 'tent-flag', x: 542, y: 228, r: 20, label: 'a flag on the tent' },
  { id: 'cactus-arm', x: 108, y: 322, r: 24, label: 'the cactus’s second arm' },
  { id: 'sun-height', x: 482, y: 88, r: 34, label: 'the sun sits lower' },
  { id: 'third-bird', x: 250, y: 96, r: 18, label: 'a third bird' },
  { id: 'pond-fish', x: 280, y: 392, r: 20, label: 'a fish in the oasis pond' },
];

export const oasis = {
  id: 'oasis', name: 'Desert Oasis', tagline: 'Two humps or one? The camel knows.',
  difficulty: 3, timeLimit: 120, draw: drawOasis, diffs: oasisDiffs,
};

// ---------------------------------------------------------------- index
export const SCENES = [park, kitchen, reef, station, library, oasis];
export const DIFF_COUNT = 7;
