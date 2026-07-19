
const canvas = document.getElementById('c');
const ctx = canvas.getContext('2d');
const hint = document.getElementById('hint');
let W, H, DPR;

function resize() {
  DPR = Math.min(window.devicePixelRatio || 1, 2);
  W = canvas.clientWidth;
  H = canvas.clientHeight;
  canvas.width = Math.max(1, Math.round(W * DPR));
  canvas.height = Math.max(1, Math.round(H * DPR));
  ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
}
window.addEventListener('resize', resize);
resize();
let ripples = [];
function addRipple(x, y, strength = 1) {
  ripples.push({
    x, y,
    born: performance.now(),
    maxRadius: (Math.min(W, H) * 0.35
    + Math.random() * 60) * strength,
    speed: 70 + Math.random() * 30,
    energy: strength,
    seed: Math.random() * 1000
  });
  if (ripples.length > 24) ripples.shift();
}

function drawRipples(now) {
  ripples = ripples.filter(r => (now - r.born) / 1000 * r.speed < r.maxRadius + 40);
  for (const r of ripples) {
    const age = (now - r.born) / 1000;
    const radius = age * r.speed;
    const life = Math.max(0, 1 - radius / r.maxRadius);
    if (life <= 0) continue;
    
    for (let ring = 0; ring < 3; ring++) {
      const rad = radius - ring * 22;
      if (rad <= 2) continue;
      const alpha = life * (0.55 - ring * 0.15) * r.energy;
      if (alpha <= 0) continue;
      ctx.beginPath();
      const segs = 64;
      for (let i = 0; i <= segs; i++) {
        const a = (i / segs) * Math.PI * 2;
        const wobble = Math.sin(a * 7 + r.seed + age * 3) * (2 + rad * 0.02);
        const rr = Math.max(0, rad + wobble);
        const px = r.x + Math.cos(a) * rr;
        const py = r.y + Math.sin(a) * rr;
        if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.lineWidth = 2.4 - ring * 0.5;
      ctx.strokeStyle = `rgba(235,255,250,${alpha})`;
      ctx.stroke();
    }
  }
}

function drawBackground(now) {
  const cx = W * 0.5, cy = H * 0.42;
  const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(W, H) * 0.85);
  grad.addColorStop(0, '#22c2bf');
  grad.addColorStop(0.35, '#1aa3a8');
  grad.addColorStop(0.7, '#0b5f70');
  grad.addColorStop(1, '#052f3d');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);

  ctx.save();
  ctx.globalAlpha = 0.10;
  ctx.strokeStyle = '#eafffb';
  for (let i = 0; i < 6; i++) {
    const yOff = ((now * 0.02 + i * 140) % (H + 200)) - 100;
    ctx.beginPath();
    for (let x = 0; x <= W; x += 20) {
      const y = yOff + Math.sin(x * 0.01 + i) * 18;
      if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.lineWidth = 6;
    ctx.stroke();
  }
  ctx.restore();
}

const FISH_PALETTES = [
  { body: '#ff9f5a', fin: '#ff7a3d' },
  { body: '#ffe066', fin: '#ffbf3d' },
  { body: '#ff6b9d', fin: '#e0447a' },
  { body: '#7bd8ff', fin: '#3d9bff' }
];

class Fish {
  constructor() { this.reset(true); }
  reset(initial) {
    this.x = Math.random() * W;
    this.y = H * 0.2 + Math.random() * H * 0.7;
    this.len = 20 + Math.random() * 16;
    this.dir = Math.random() * Math.PI * 2;
    this.speed = 25 + Math.random() * 20;
    this.wiggle = Math.random() * Math.PI * 2;
    this.wiggleSpeed = 3 + Math.random() * 2;
    this.palette = FISH_PALETTES[Math.floor(Math.random() * FISH_PALETTES.length)];
  }
  update(dt, now) {
    this.wiggle += this.wiggleSpeed * dt;
    this.dir += (Math.random() - 0.5) * 0.6 * dt;

    for (const r of ripples) {
      const age = (now - r.born) / 1000;
      if (age > 0.4 || r.energy < 0.9) continue;
      const dx = this.x - r.x, dy = this.y - r.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 130 && dist > 0.001) this.dir = Math.atan2(dy, dx);
    }

    const margin = 50;
    if (this.x < margin) this.dir = 0;
    if (this.x > W - margin) this.dir = Math.PI;
    if (this.y < margin) this.dir = Math.PI / 2;
    if (this.y > H - margin) this.dir = -Math.PI / 2;

    const speed = this.speed * (1 + 0.2 * Math.sin(this.wiggle));
    this.x += Math.cos(this.dir) * speed * dt;
    this.y += Math.sin(this.dir) * speed * dt;
  }
  draw(ctx) {
    const len = this.len;
    const wag = Math.sin(this.wiggle * 2) * 0.4;
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.dir);
    ctx.globalAlpha = 0.92;

    ctx.beginPath();
    ctx.moveTo(-len * 0.5, 0);
    ctx.quadraticCurveTo(-len * 0.85, wag * len * 0.6 - 4, -len * 1.05, wag * len * 0.9);
    ctx.quadraticCurveTo(-len * 0.85, wag * len * 0.6 + 4, -len * 0.5, 0);
    ctx.fillStyle = this.palette.fin;
    ctx.fill();

    ctx.beginPath();
    ctx.ellipse(0, 0, len * 0.5, len * 0.22, 0, 0, Math.PI * 2);
    ctx.fillStyle = this.palette.body;
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(-len * 0.05, -len * 0.2);
    ctx.quadraticCurveTo(len * 0.05, -len * 0.42, len * 0.2, -len * 0.18);
    ctx.closePath();
    ctx.fillStyle = this.palette.fin;
    ctx.fill();

    ctx.beginPath();
    ctx.arc(len * 0.32, -len * 0.03, len * 0.045, 0, Math.PI * 2);
    ctx.fillStyle = '#04303f';
    ctx.fill();

    ctx.restore();
  }
}

let fishes = [];
function initFish() {
  fishes = [];
  const count = Math.max(5, Math.floor((W * H) / 40000));
  for (let i = 0; i < count; i++) fishes.push(new Fish());
}
initFish();
window.addEventListener('resize', initFish);

let lastFrame = performance.now();
function loop(now) {
  const dt = Math.min((now - lastFrame) / 1000, 0.05);
  lastFrame = now;

  drawBackground(now);
  for (const f of fishes) f.update(dt, now);
  for (const f of fishes) f.draw(ctx);
  drawRipples(now);

  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);

function ambientDrop() {
  addRipple(W * (0.3 + Math.random() * 0.4), H * (0.25 + Math.random() * 0.4), 0.6 + Math.random() * 0.5);
  setTimeout(ambientDrop, 1200 + Math.random() * 1800);
}
setTimeout(ambientDrop, 800);

function pointerToLocal(e) {
  const rect = canvas.getBoundingClientRect();
  const cx = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
  const cy = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top;
  return { x: cx, y: cy };
}
function fadeHint() { hint.style.opacity = 0; }

canvas.addEventListener('mousedown', (e) => {
  const p = pointerToLocal(e);
  addRipple(p.x, p.y, 1.3);
  fadeHint();
});
canvas.addEventListener('mousemove', (e) => {
  if (!(e.buttons & 1)) return;
  const p = pointerToLocal(e);
  addRipple(p.x, p.y, 0.5);
});
canvas.addEventListener('touchstart', (e) => {
  const p = pointerToLocal(e);
  addRipple(p.x, p.y, 1.3);
  fadeHint();
  e.preventDefault();
}, { passive: false });
canvas.addEventListener('touchmove', (e) => {
  const p = pointerToLocal(e);
  addRipple(p.x, p.y, 0.5);
  e.preventDefault();
}, { passive: false });
