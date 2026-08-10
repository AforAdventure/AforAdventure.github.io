/* ===== Snake (canvas, no dependencies) ===== */
(function snakeGame() {
  const canvas = document.getElementById('snake-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const GRID = 20;
  const CELL = canvas.width / GRID;
  const TICK_START_MS = 130;
  const TICK_MIN_MS = 70;
  const SPEEDUP_EVERY = 5; // points

  const COLOR_BG = '#000000';
  const COLOR_GRID = 'rgba(230, 239, 230, 0.06)';
  const COLOR_SNAKE = '#2fd6c0';
  const COLOR_HEAD = '#9cff2f';
  const COLOR_FOOD = '#ff3c8f';
  const COLOR_TEXT = '#e6efe6';

  const scoreEl = document.getElementById('snake-score');
  const highEl = document.getElementById('snake-high');
  const restartBtn = document.getElementById('snake-restart');
  const dpad = document.querySelector('.snake-dpad');

  const HIGH_KEY = 'alex-site-snake-high';
  let high = parseInt(localStorage.getItem(HIGH_KEY) || '0', 10);
  highEl.textContent = high;

  let snake, dir, nextDir, food, score, tickMs, timer, started, gameOver, priorHigh;

  function reset() {
    snake = [{ x: 9, y: 10 }, { x: 8, y: 10 }, { x: 7, y: 10 }];
    dir = { x: 1, y: 0 };
    nextDir = dir;
    score = 0;
    tickMs = TICK_START_MS;
    started = false;
    gameOver = false;
    priorHigh = high;
    scoreEl.textContent = '0';
    placeFood();
    draw();
    clearInterval(timer);
  }

  function showMilestoneToast(text) {
    const rect = canvas.getBoundingClientRect();
    const el = document.createElement('div');
    el.className = 'snake-toast';
    el.textContent = text;
    el.style.left = (rect.left + rect.width / 2) + 'px';
    el.style.top = (rect.top + 16) + 'px';
    el.style.transform = 'translate(-50%, -12px)';
    document.body.appendChild(el);
    requestAnimationFrame(() => el.classList.add('show'));
    setTimeout(() => {
      el.classList.remove('show');
      setTimeout(() => el.remove(), 350);
    }, 1700);
  }

  function placeFood() {
    let cell;
    do {
      cell = { x: Math.floor(Math.random() * GRID), y: Math.floor(Math.random() * GRID) };
    } while (snake.some(s => s.x === cell.x && s.y === cell.y));
    food = cell;
  }

  function setDir(x, y) {
    // ignore reversal into own neck
    if (dir.x === -x && dir.y === -y) return;
    nextDir = { x, y };
    if (!started && !gameOver) start();
  }

  function start() {
    started = true;
    clearInterval(timer);
    timer = setInterval(tick, tickMs);
  }

  function restartTimer() {
    clearInterval(timer);
    timer = setInterval(tick, tickMs);
  }

  function tick() {
    dir = nextDir;
    const head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };

    if (head.x < 0 || head.x >= GRID || head.y < 0 || head.y >= GRID ||
        snake.some(s => s.x === head.x && s.y === head.y)) {
      endGame();
      return;
    }

    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
      score += 1;
      scoreEl.textContent = String(score);
      if (priorHigh > 0 && score === priorHigh + 1) {
        showMilestoneToast('🎉 NEW HIGH SCORE!');
      }
      if (score > high) {
        high = score;
        highEl.textContent = String(high);
        localStorage.setItem(HIGH_KEY, String(high));
      }
      if (score % SPEEDUP_EVERY === 0 && tickMs > TICK_MIN_MS) {
        tickMs -= 10;
        restartTimer();
      }
      placeFood();
    } else {
      snake.pop();
    }

    draw();
  }

  function endGame() {
    gameOver = true;
    clearInterval(timer);
    draw();
  }

  function draw() {
    ctx.fillStyle = COLOR_BG;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = COLOR_GRID;
    ctx.lineWidth = 1;
    for (let i = 1; i < GRID; i++) {
      ctx.beginPath();
      ctx.moveTo(i * CELL, 0);
      ctx.lineTo(i * CELL, canvas.height);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * CELL);
      ctx.lineTo(canvas.width, i * CELL);
      ctx.stroke();
    }

    ctx.fillStyle = COLOR_FOOD;
    ctx.fillRect(food.x * CELL + 2, food.y * CELL + 2, CELL - 4, CELL - 4);

    snake.forEach((seg, i) => {
      ctx.fillStyle = i === 0 ? COLOR_HEAD : COLOR_SNAKE;
      ctx.fillRect(seg.x * CELL + 1, seg.y * CELL + 1, CELL - 2, CELL - 2);
    });

    if (!started && !gameOver) {
      overlay('PRESS AN ARROW KEY', 'OR TAP A BUTTON TO START');
    } else if (gameOver) {
      overlay('GAME OVER', `SCORE ${score} — HIT RESTART`);
    }
  }

  function overlay(line1, line2) {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
    ctx.fillRect(0, canvas.height / 2 - 34, canvas.width, 68);
    ctx.fillStyle = COLOR_TEXT;
    ctx.font = '700 16px "Space Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText(line1, canvas.width / 2, canvas.height / 2 - 6);
    ctx.font = '400 12px "Space Mono", monospace';
    ctx.fillText(line2, canvas.width / 2, canvas.height / 2 + 16);
  }

  const KEY_MAP = {
    ArrowUp: [0, -1], KeyW: [0, -1],
    ArrowDown: [0, 1], KeyS: [0, 1],
    ArrowLeft: [-1, 0], KeyA: [-1, 0],
    ArrowRight: [1, 0], KeyD: [1, 0],
  };

  document.addEventListener('keydown', (e) => {
    const move = KEY_MAP[e.code];
    if (!move) return;
    // only capture arrow/wasd when the game is in view, so page scroll elsewhere isn't blocked
    const rect = canvas.getBoundingClientRect();
    if (rect.bottom < 0 || rect.top > window.innerHeight) return;
    e.preventDefault();
    setDir(move[0], move[1]);
  });

  dpad.addEventListener('click', (e) => {
    const btn = e.target.closest('.snake-btn');
    if (!btn) return;
    const moves = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] };
    const m = moves[btn.dataset.dir];
    setDir(m[0], m[1]);
  });

  // swipe support directly on the canvas
  let touchStart = null;
  canvas.addEventListener('touchstart', (e) => {
    const t = e.changedTouches[0];
    touchStart = { x: t.clientX, y: t.clientY };
  }, { passive: true });
  canvas.addEventListener('touchend', (e) => {
    if (!touchStart) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - touchStart.x;
    const dy = t.clientY - touchStart.y;
    if (Math.abs(dx) > Math.abs(dy)) {
      if (Math.abs(dx) > 20) setDir(dx > 0 ? 1 : -1, 0);
    } else {
      if (Math.abs(dy) > 20) setDir(0, dy > 0 ? 1 : -1);
    }
    touchStart = null;
  });

  canvas.addEventListener('click', () => {
    if (gameOver) reset();
  });

  restartBtn.addEventListener('click', reset);

  reset();
})();
