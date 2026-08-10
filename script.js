/* =====================================================================
   PLUG IN YOUR SONG HERE
   - Direct audio file: put the file in assets/ (e.g. assets/song.mp3)
     and set SONG_URL = "assets/song.mp3"
   - YouTube link: paste the full video URL, e.g.
     SONG_URL = "https://www.youtube.com/watch?v=XXXXXXXXXXX"
   Leave it as "" to keep the "no record loaded yet" placeholder.
===================================================================== */
const SONG_URL = "https://www.youtube.com/watch?v=1jqjspMuaKY";
const SONG_TITLE = "Ruby Soho — Rancid";

(function jukebox() {
  const btn = document.getElementById('jukebox-btn');
  const status = document.getElementById('jukebox-status');
  const cd = document.getElementById('jukebox-cd');
  let audio = null;
  let playing = false;

  if (!SONG_URL) {
    status.textContent = 'no record loaded yet — check back soon!';
    return;
  }

  const isYouTube = /youtube\.com|youtu\.be/.test(SONG_URL);

  if (isYouTube) {
    status.textContent = SONG_TITLE || 'click to open my jam on YouTube';
    btn.addEventListener('click', () => {
      window.open(SONG_URL, '_blank', 'noopener');
    });
  } else {
    audio = new Audio(SONG_URL);
    status.textContent = SONG_TITLE || 'ready to play';
    btn.addEventListener('click', () => {
      if (!playing) {
        audio.play();
        btn.textContent = '⏸ PAUSE';
        cd.classList.add('spinning');
        status.textContent = SONG_TITLE || 'now playing...';
      } else {
        audio.pause();
        btn.textContent = '▶ PLAY MY JAM';
        cd.classList.remove('spinning');
      }
      playing = !playing;
    });
    audio.addEventListener('ended', () => {
      playing = false;
      btn.textContent = '▶ PLAY MY JAM';
      cd.classList.remove('spinning');
    });
  }
})();

/* Fun Stuff list starts rolled up; hero button and inline toggle both open it */
(function funListToggle() {
  const list = document.getElementById('fun-list');
  const toggleBtn = document.getElementById('fun-list-toggle');
  const heroBtn = document.getElementById('hero-fun-btn');

  function setExpanded(expanded) {
    list.classList.toggle('expanded', expanded);
    list.style.maxHeight = expanded ? list.scrollHeight + 'px' : '0px';
    toggleBtn.textContent = expanded ? '▼ HIDE THE LIST' : '▶ SHOW THE LIST';
    toggleBtn.setAttribute('aria-expanded', String(expanded));
  }

  toggleBtn.addEventListener('click', () => {
    setExpanded(toggleBtn.getAttribute('aria-expanded') !== 'true');
  });

  heroBtn.addEventListener('click', () => setExpanded(true));
})();

/* Real guestbook — submits via FormSubmit.co, no backend of my own needed.
   NOTE: the first submission to a new address requires a one-time click-to-
   activate confirmation email from FormSubmit before delivery works. */
const GUESTBOOK_EMAIL = "oneadp@gmail.com";

(function guestbook() {
  const form = document.getElementById('guestbook-form');
  const status = document.getElementById('guestbook-status');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // honeypot: bots fill every field, real visitors never see this one
    if (form.elements.website && form.elements.website.value) {
      status.textContent = '✅ SIGNED! THANKS FOR STOPPING BY.';
      form.reset();
      return;
    }

    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    status.textContent = 'SENDING...';

    try {
      const res = await fetch(`https://formsubmit.co/ajax/${GUESTBOOK_EMAIL}`, {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: new FormData(form),
      });
      if (!res.ok) throw new Error('bad response');
      status.textContent = '✅ SIGNED! THANKS FOR STOPPING BY.';
      form.reset();
    } catch (err) {
      status.textContent = '⚠ COULD NOT SEND — EMAIL ME DIRECTLY INSTEAD.';
    } finally {
      submitBtn.disabled = false;
    }
  });
})();

/* Fun fake visitor counter, persisted locally per-browser */
(function visitorCounter() {
  const el = document.getElementById('visitor-count');
  const key = 'alex-site-visitor-count';
  let count = parseInt(localStorage.getItem(key) || '1337', 10);
  count += 1;
  localStorage.setItem(key, String(count));
  el.textContent = String(count).padStart(6, '0');
})();
