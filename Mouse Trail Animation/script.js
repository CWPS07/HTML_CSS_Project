const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let width, height;

function resize() {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
}
resize();

class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = Math.random() * 5 + 3;
    this.speedX = (Math.random() - 0.5) * 2;
    this.speedY = (Math.random() - 0.5) * 2;
    this.life = 1;
    this.decay = Math.random() * 
    0.02 + 0.015;
    const hue = (Date.now() / 10) % 360;
    this.hue = hue;
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    this.life -= this.decay;
    this.size *= 0.96;
  }

  draw() {
    ctx.save();
    ctx.globalAlpha = Math.max(this.life, 0);
    const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size * 2);
    gradient.addColorStop(0, `hsla(${this.hue}, 100%, 70%, 1)`);
    gradient.addColorStop(1, `hsla(${this.hue}, 100%, 60%, 0)`);
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(this.x, this.y, Math.max(this.size, 0), 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

let particles = [];
let ripples = [];
let stars = [];
let trailPoints = [];
let mouseX = width / 2;
let mouseY = height / 2;
let lastX = mouseX;
let lastY = mouseY;
let moved = false;

class Star {
  constructor() {
    this.reset();
  }
  reset() {
    this.x = Math.random() * width;
    this.y = Math.random() * height;
    this.size = Math.random() * 1.5 + 0.3;
    this.baseAlpha = Math.random() * 0.5 + 0.2;
    this.twinkleSpeed = Math.random() * 0.02 + 0.005;
    this.phase = Math.random() * Math.PI * 2;
  }
  update() {
    this.phase += this.twinkleSpeed;
  }
  draw() {
    const alpha = this.baseAlpha * (0.5 + 0.5 * Math.sin(this.phase));
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

function initStars() {
  stars = [];
  const count = Math.floor((width * height) / 9000);
  for (let i = 0; i < count; i++) stars.push(new Star());
}
initStars();
window.addEventListener('resize', () => {
  resize();
  initStars();
});

class Ripple {
  constructor(x, y, hue) {
    this.x = x;
    this.y = y;
    this.radius = 2;
    this.maxRadius = Math.random() * 60 + 80;
    this.alpha = 0.8;
    this.hue = hue;
  }
  update() {
    this.radius += (this.maxRadius - this.radius) * 0.12;
    this.alpha *= 0.94;
  }
  draw() {
    ctx.save();
    ctx.globalAlpha = Math.max(this.alpha, 0);
    ctx.strokeStyle = `hsla(${this.hue}, 100%, 75%, 1)`;
    ctx.lineWidth = 2;
    ctx.shadowColor = `hsla(${this.hue}, 100%, 70%, 1)`;
    ctx.shadowBlur = 12;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }
  get dead() {
    return this.alpha < 0.02;
  }
}

function spawnBurst(x, y) {
  const hue = (Date.now() / 10) % 360;
  ripples.push(new Ripple(x, y, hue));
  const count = 24;
  for (let i = 0; i < count; i++) {
    const angle = (Math.PI * 2 * i) / count + Math.random() * 0.3;
    const speed = Math.random() * 4 + 2;
    const p = new Particle(x, y);
    p.speedX = Math.cos(angle) * speed;
    p.speedY = Math.sin(angle) * speed;
    p.size = Math.random() * 6 + 4;
    p.decay = Math.random() * 0.015 + 0.01;
    p.hue = hue;
    particles.push(p);
  }
}

function spawnParticles(x, y) {
  const dist = Math.hypot(x - lastX, y - lastY);
  const count = Math.min(Math.max(Math.floor(dist / 3), 1), 8);
  for (let i = 0; i < count; i++) {
    const t = i / count;
    const px = lastX + (x - lastX) * t;
    const py = lastY + (y - lastY) * t;
    particles.push(new Particle(px, py));
  }
}

function handleMove(x, y) {
  mouseX = x;
  mouseY = y;
  spawnParticles(x, y);
  trailPoints.push({ x, y, life: 1 });
  if (trailPoints.length > 25) trailPoints.shift();
  lastX = x;
  lastY = y;
  if (!moved) {
    moved = true;
    const hint = document.getElementById('hint');
    hint.style.opacity = '0';
  }
}

window.addEventListener('mousemove', (e) => handleMove(e.clientX, e.clientY));
window.addEventListener('touchmove', (e) => {
  if (e.touches.length > 0) {
    handleMove(e.touches[0].clientX, e.touches[0].clientY);
  }
}, { passive: true });

window.addEventListener('mousedown', (e) => spawnBurst(e.clientX, e.clientY));
window.addEventListener('touchstart', (e) => {
  if (e.touches.length > 0) {
    spawnBurst(e.touches[0].clientX, e.touches[0].clientY);
  }
}, { passive: true });

function drawTrailLine() {
  if (trailPoints.length < 2) return;
  ctx.save();
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  for (let i = 1; i < trailPoints.length; i++) {
    const p0 = trailPoints[i - 1];
    const p1 = trailPoints[i];
    const t = i / trailPoints.length;
    ctx.globalAlpha = t * 0.35;
    ctx.strokeStyle = 'rgba(255,255,255,0.8)';
    ctx.lineWidth = t * 3;
    ctx.beginPath();
    ctx.moveTo(p0.x, p0.y);
    ctx.lineTo(p1.x, p1.y);
    ctx.stroke();
  }
  ctx.restore();
}

function drawCursor() {
  ctx.save();
  ctx.beginPath();
  ctx.arc(mouseX, mouseY, 6, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(255,255,255,0.9)';
  ctx.shadowColor = 'rgba(255,255,255,0.8)';
  ctx.shadowBlur = 15;
  ctx.fill();
  ctx.restore();
}

function animate() {
  ctx.fillStyle = 'rgba(15, 12, 41, 0.15)';
  ctx.fillRect(0, 0, width, height);

  for (const s of stars) {
    s.update();
    s.draw();
  }

  drawTrailLine();

  for (let i = ripples.length - 1; i >= 0; i--) {
    const r = ripples[i];
    r.update();
    r.draw();
    if (r.dead) ripples.splice(i, 1);
  }

  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.update();
    p.draw();
    if (p.life <= 0 || p.size <= 0.3) {
      particles.splice(i, 1);
    }
  }

  if (moved) drawCursor();

  requestAnimationFrame(animate);
}

animate();
