
  const container = document.getElementById('container');
  const el1 = document.getElementById('blob1');
  const el2 = document.getElementById('blob2');

  const rand = (min, max) => Math.random() * (max - min) + min;

  const size1 = 190;
  const size2 = 160;
  el1.style.width = size1 + 'px'; el1.style.height = size1 + 'px';
  el1.style.marginLeft = (-size1/2) + 'px'; el1.style.marginTop = (-size1/2) + 'px';
  el2.style.width = size2 + 'px'; el2.style.height = size2 + 'px';
  el2.style.marginLeft = (-size2/2) + 'px'; el2.style.marginTop = (-size2/2) + 'px';

  function bounds(){
    const rect = container.getBoundingClientRect();
    return { w: rect.width, h: rect.height };
  }

  function makeBlob(size, speed){
    const { w, h } = bounds();
    const r = size / 2;
    return {
      x: rand(r, w - r), y: rand(r, h - r),
      vx: (Math.random() > 0.5 ? 1 : -1) * speed,
      vy: (Math.random() > 0.5 ? 1 : -1) * speed,
      r,
    };
  }

  const blob1 = makeBlob(size1, 55); // px per second
  const blob2 = makeBlob(size2, 48);

  let hue1 = rand(0, 360);
  const hue1Speed = 20;
  let hue2 = (hue1 + 150) % 360;
  const hue2IdleSpeed = 6;

  function setGradient(el, hue){
    const c1 = `hsl(${hue}, 90%, 60%)`;
    const c2 = `hsl(${(hue + 60) % 360}, 90%, 55%)`;
    el.style.background = `conic-gradient(from ${hue}deg, ${c1}, ${c2}, ${c1})`;
  }

  function shortestHueLerp(from, to, amount){
    let diff = ((to - from + 540) % 360) - 180;
    return (from + diff * amount + 360) % 360;
  }

  function step(blob, dt, w, h){
    blob.x += blob.vx * dt;
    blob.y += blob.vy * dt;

    if (blob.x - blob.r < 0){ blob.x = blob.r; blob.vx *= -1; }
    if (blob.x + blob.r > w){ blob.x = w - blob.r; blob.vx *= -1; }
    if (blob.y - blob.r < 0){ blob.y = blob.r; blob.vy *= -1; }
    if (blob.y + blob.r > h){ blob.y = h - blob.r; blob.vy *= -1; }
  }

  let lastTime = performance.now();

  function animate(now){
    const dt = Math.min((now - lastTime) / 1000, 0.05);
    lastTime = now;

    const { w, h } = bounds();
    step(blob1, dt, w, h);
    step(blob2, dt, w, h);

    el1.style.transform = `translate(${blob1.x}px, ${blob1.y}px)`;
    el2.style.transform = `translate(${blob2.x}px, ${blob2.y}px)`;

    hue1 = (hue1 + hue1Speed * dt) % 360;

    const dx = blob1.x - blob2.x;
    const dy = blob1.y - blob2.y;
    const dist = Math.sqrt(dx*dx + dy*dy);
    const touchDistance = (blob1.r + blob2.r) * 0.85;
    const touching = dist < touchDistance;

    if (touching){
      const closeness = 1 - Math.min(dist / touchDistance, 1);
      const transferAmount = Math.min(0.9, 4 * closeness * dt + dt * 1.5);
      hue2 = shortestHueLerp(hue2, hue1, transferAmount);
    } else {
      hue2 = (hue2 + hue2IdleSpeed * dt) % 360;
    }

    setGradient(el1, hue1);
    setGradient(el2, hue2);

    requestAnimationFrame(animate);
  }
  requestAnimationFrame(animate);

  window.addEventListener('resize', () => {
    const { w, h } = bounds();
    blob1.x = Math.min(blob1.x, w - blob1.r);
    blob1.y = Math.min(blob1.y, h - blob1.r);
    blob2.x = Math.min(blob2.x, w - blob2.r);
    blob2.y = Math.min(blob2.y, h - blob2.r);
  });
