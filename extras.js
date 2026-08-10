/* ===== Konami code easter egg ===== */
(function konami() {
  const seq = [
    'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
    'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
    'KeyB', 'KeyA',
  ];
  let pos = 0;

  document.addEventListener('keydown', (e) => {
    pos = (e.code === seq[pos]) ? pos + 1 : (e.code === seq[0] ? 1 : 0);
    if (pos === seq.length) {
      pos = 0;
      triggerKonami();
    }
  });

  function triggerKonami() {
    showToast();
    confettiBurst();
  }

  function showToast() {
    const el = document.createElement('div');
    el.className = 'konami-toast';
    el.textContent = "🎮 KONAMI CODE ACCEPTED — YOU'RE HIRED* (*not legally binding)";
    document.body.appendChild(el);
    requestAnimationFrame(() => el.classList.add('show'));
    setTimeout(() => {
      el.classList.remove('show');
      setTimeout(() => el.remove(), 500);
    }, 3400);
  }

  function confettiBurst() {
    const colors = ['#2fd6c0', '#ff3c8f', '#9cff2f', '#e6efe6'];
    const count = 90;
    for (let i = 0; i < count; i++) {
      const p = document.createElement('div');
      p.className = 'confetti-piece';
      p.style.left = Math.random() * 100 + 'vw';
      p.style.background = colors[Math.floor(Math.random() * colors.length)];
      p.style.animationDuration = (2 + Math.random() * 1.5) + 's';
      p.style.animationDelay = (Math.random() * 0.3) + 's';
      p.style.setProperty('--drift', (Math.random() * 160 - 80) + 'px');
      document.body.appendChild(p);
      setTimeout(() => p.remove(), 4200);
    }
  }
})();

/* ===== Retro sparkle cursor trail (mouse-driven devices only) ===== */
(function sparkleTrail() {
  if (!window.matchMedia('(pointer: fine)').matches) return;

  const colors = ['#2fd6c0', '#ff3c8f', '#9cff2f'];
  let last = 0;

  document.addEventListener('mousemove', (e) => {
    const now = Date.now();
    if (now - last < 45) return; // throttle so it stays light
    last = now;

    const s = document.createElement('span');
    s.className = 'sparkle';
    s.textContent = '✦';
    s.style.left = e.clientX + 'px';
    s.style.top = e.clientY + 'px';
    s.style.color = colors[Math.floor(Math.random() * colors.length)];
    document.body.appendChild(s);
    setTimeout(() => s.remove(), 700);
  });
})();
