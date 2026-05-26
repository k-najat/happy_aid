// ===================================================
//  Eid Al-Adha — app.js  |  Najat Khatib
// ===================================================

// ── 1. Date ───────────────────────────────────────
(function setDate() {
  const el = document.getElementById('today-date');
  if (!el) return;
  const now = new Date();
  const fr  = now.toLocaleDateString('fr-FR', {
    weekday:'long', day:'2-digit', month:'long', year:'numeric'
  });
  el.textContent = fr.charAt(0).toUpperCase() + fr.slice(1);
})();


// ── 2. Pastel particles ───────────────────────────
(function createParticles() {
  const container = document.getElementById('particles');
  if (!container) return;
  const colors = [
    'rgba(167,139,250,0.55)',
    'rgba(244,114,182,0.45)',
    'rgba(196,181,253,0.65)',
    'rgba(251,207,232,0.7)',
    'rgba(124,58,237,0.35)',
    'rgba(255,255,255,0.85)',
    'rgba(232,121,249,0.4)',
  ];
  for (let i = 0; i < 45; i++) {
    const p     = document.createElement('div');
    p.classList.add('particle');
    const size  = Math.random() * 9 + 3;
    const dur   = Math.random() * 10 + 7;
    const delay = Math.random() * 14;
    const color = colors[Math.floor(Math.random() * colors.length)];
    const shape = Math.random() > 0.4 ? '50%' : '4px';
    p.style.cssText = `
      width:${size}px; height:${size}px;
      left:${Math.random()*100}%;
      bottom:-10px;
      background:${color};
      border-radius:${shape};
      --dur:${dur}s; --delay:${delay}s;
      box-shadow:0 0 ${size}px ${color};
    `;
    container.appendChild(p);
  }
})();


// ── 3. Fireworks canvas ───────────────────────────
(function fireworks() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const fwColors = [
    '#a78bfa','#c4b5fd','#f472b6','#fbcfe8',
    '#7c3aed','#e879f9','#fbbf24','#fff',
    '#818cf8','#f9a8d4'
  ];
  const particles = [];

  class FWP {
    constructor(x, y) {
      this.x = x; this.y = y;
      this.color = fwColors[Math.floor(Math.random() * fwColors.length)];
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 5 + 1.5;
      this.vx = Math.cos(angle) * speed;
      this.vy = Math.sin(angle) * speed;
      this.alpha = 1;
      this.decay = Math.random() * 0.018 + 0.008;
      this.r = Math.random() * 3 + 1;
      this.gravity = 0.055;
    }
    update() {
      this.x += this.vx; this.y += this.vy;
      this.vy += this.gravity; this.vx *= 0.98;
      this.alpha -= this.decay;
    }
    draw() {
      ctx.save();
      ctx.globalAlpha = Math.max(0, this.alpha);
      ctx.fillStyle   = this.color;
      ctx.shadowBlur  = 8;
      ctx.shadowColor = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  function burst(x, y, count = 55) {
    for (let i = 0; i < count; i++) particles.push(new FWP(x, y));
  }

  setTimeout(() => burst(window.innerWidth * .22, window.innerHeight * .28, 70), 500);
  setTimeout(() => burst(window.innerWidth * .78, window.innerHeight * .22, 70), 1000);
  setTimeout(() => burst(window.innerWidth * .5,  window.innerHeight * .35, 90), 1600);

  function autoFW() {
    burst(Math.random() * window.innerWidth, Math.random() * window.innerHeight * .55, 55);
    setTimeout(autoFW, Math.random() * 2200 + 900);
  }
  setTimeout(autoFW, 2500);

  document.addEventListener('click', e => burst(e.clientX, e.clientY, 65));

  function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = particles.length - 1; i >= 0; i--) {
      particles[i].update();
      particles[i].draw();
      if (particles[i].alpha <= 0) particles.splice(i, 1);
    }
    requestAnimationFrame(loop);
  }
  loop();
})();


// ── 4. Card 3D tilt ───────────────────────────────
(function cardTilt() {
  const card = document.querySelector('.glass-card');
  if (!card || window.matchMedia('(max-width:480px)').matches) return;
  document.addEventListener('mousemove', e => {
    const r  = card.getBoundingClientRect();
    const dx = (e.clientX - (r.left + r.width  / 2)) / (window.innerWidth  / 2);
    const dy = (e.clientY - (r.top  + r.height / 2)) / (window.innerHeight / 2);
    card.style.transform  = `perspective(900px) rotateY(${dx*4}deg) rotateX(${-dy*4}deg)`;
    card.style.transition = 'transform 0.1s ease';
  });
  document.addEventListener('mouseleave', () => {
    card.style.transform  = 'perspective(900px) rotateY(0) rotateX(0)';
    card.style.transition = 'transform 0.5s ease';
  });
})();
