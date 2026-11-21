// Shared canvas drawing helpers for the spot-the-difference scenes.
// Every scene is drawn in a 600 x 440 box; the helpers only draw shapes,
// they never decide what differs between the two panels.
export const SCENE_W = 600;
export const SCENE_H = 440;

export function circle(ctx, x, y, r, fill) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  if (fill) { ctx.fillStyle = fill; ctx.fill(); }
}

export function ellipse(ctx, x, y, rx, ry, fill) {
  ctx.beginPath();
  ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
  if (fill) { ctx.fillStyle = fill; ctx.fill(); }
}

export function rect(ctx, x, y, w, h, fill) {
  if (fill) ctx.fillStyle = fill;
  ctx.fillRect(x, y, w, h);
}

export function rr(ctx, x, y, w, h, r, fill) {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
  if (fill) { ctx.fillStyle = fill; ctx.fill(); }
}

export function poly(ctx, points, fill, close = true) {
  ctx.beginPath();
  ctx.moveTo(points[0][0], points[0][1]);
  for (let i = 1; i < points.length; i++) ctx.lineTo(points[i][0], points[i][1]);
  if (close) ctx.closePath();
  if (fill) { ctx.fillStyle = fill; ctx.fill(); }
}

export function line(ctx, x1, y1, x2, y2, color, width = 2) {
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
}

// A puffy cloud made of overlapping circles.
export function cloud(ctx, x, y, s, color = '#ffffff') {
  circle(ctx, x, y, 18 * s, color);
  circle(ctx, x + 18 * s, y + 4 * s, 14 * s, color);
  circle(ctx, x - 18 * s, y + 5 * s, 13 * s, color);
  circle(ctx, x + 4 * s, y - 10 * s, 14 * s, color);
  ctx.fillStyle = color;
  ctx.fillRect(x - 28 * s, y, 56 * s, 12 * s);
}

// A small distant bird: two curved strokes.
export function bird(ctx, x, y, s = 1, color = '#334155') {
  ctx.strokeStyle = color;
  ctx.lineWidth = 2.5 * s;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(x - 10 * s, y);
  ctx.quadraticCurveTo(x - 4 * s, y - 7 * s, x, y);
  ctx.quadraticCurveTo(x + 4 * s, y - 7 * s, x + 10 * s, y);
  ctx.stroke();
}

// A simple side-view fish. flip mirrors it.
export function fish(ctx, x, y, s, color, flip = false) {
  ctx.save();
  ctx.translate(x, y);
  if (flip) ctx.scale(-1, 1);
  ctx.scale(s, s);
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.ellipse(0, 0, 16, 9, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(-13, 0);
  ctx.lineTo(-24, -8);
  ctx.lineTo(-24, 8);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#0f172a';
  ctx.beginPath();
  ctx.arc(8, -2, 2, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

// A five-point star.
export function star(ctx, x, y, r, fill, points = 5) {
  ctx.beginPath();
  for (let i = 0; i < points * 2; i++) {
    const rad = i % 2 === 0 ? r : r * 0.45;
    const a = (i * Math.PI) / points - Math.PI / 2;
    const px = x + Math.cos(a) * rad;
    const py = y + Math.sin(a) * rad;
    if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
  }
  ctx.closePath();
  if (fill) { ctx.fillStyle = fill; ctx.fill(); }
}

// A small flower: stem, petals, centre.
export function flower(ctx, x, y, petal, centre = '#fbbf24') {
  ctx.strokeStyle = '#15803d';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x, y + 14);
  ctx.stroke();
  for (let i = 0; i < 5; i++) {
    const a = (i * 2 * Math.PI) / 5 - Math.PI / 2;
    circle(ctx, x + Math.cos(a) * 6, y + Math.sin(a) * 6, 5, petal);
  }
  circle(ctx, x, y, 4.5, centre);
}

// A leafy tree: trunk + three canopy blobs.
export function tree(ctx, x, y, s = 1, leaf = '#22a06b') {
  ctx.fillStyle = '#7c4a21';
  ctx.fillRect(x - 7 * s, y - 40 * s, 14 * s, 42 * s);
  circle(ctx, x - 22 * s, y - 48 * s, 24 * s, leaf);
  circle(ctx, x + 22 * s, y - 48 * s, 24 * s, leaf);
  circle(ctx, x, y - 66 * s, 28 * s, leaf);
}

// A wavy steam curl.
export function steam(ctx, x, y, h = 22) {
  ctx.strokeStyle = 'rgba(255,255,255,0.85)';
  ctx.lineWidth = 3;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.bezierCurveTo(x - 6, y - h * 0.35, x + 6, y - h * 0.6, x, y - h);
  ctx.stroke();
}
