/* =========================================================
   MIMI'S BIRTHDAY SITE — main controller
   ========================================================= */

/* ---------- CONFIG ---------- */
const CLIP_INTRO = 'clips/clip1.mp4';
const INTRO_DURATION = 6;   // seconds — clip1 gets cut here no matter how long it is

const CLIP_COLLAGE = [
  'clips/clip2.mp4','clips/clip3.mp4','clips/clip4.mp4',
  'clips/clip5.mp4','clips/clip6.mp4','clips/clip7.mp4','clips/clip8.mp4'
];
const CLIP_AMBIENT = [
  'clips/clip2.mp4','clips/clip3.mp4','clips/clip4.mp4',
  'clips/clip5.mp4','clips/clip6.mp4','clips/clip7.mp4','clips/clip8.mp4'
];

const PLAYLIST = [
  ['Ann Marie – Party Where We At',''],
  ['Anne-Marie – 2002',''],
  ['Anne-Marie – Ciao Adios',''],
  ['BLACKPINK – How You Like That',''],
  ['BLACKPINK – Ice Cream (with Selena Gomez)',''],
  ['BLACKPINK – As If It\'s Your Last',''],
  ['BLACKPINK – Pink Venom',''],
  ['BTS – Butter',''],
  ['BTS – Dynamite',''],
  ['BTS – IDOL',''],
  ['BTS – Boy With Luv (feat. Halsey)',''],
  ['Clean Bandit – Rockabye (feat. Sean Paul & Anne-Marie)',''],
  ['Doja Cat – Demons',''],
  ['Jason Derulo – Savage Love',''],
  ['Kanye West – Father (feat. Travis Scott)',''],
  ['Megan Thee Stallion – Mamushi (feat. Yuki Chiba)',''],
  ['Megan Thee Stallion – Savage',''],
  ['NewJeans – New Jeans (ft. The Powerpuff Girls)',''],
  ['NewJeans – New Jeans',''],
  ['NewJeans – Super Shy',''],
  ['Stray Kids – CASE 143',''],
  ['Stray Kids – ESCAPE (Bang Chan & Hyunjin)',''],
  ['Stray Kids – Easy',''],
  ['Stray Kids – Walkin On Water',''],
  ['TWICE – THIS IS FOR',''],
  ['TWICE – The Feels',''],
  ['TWICE – What is Love?',''],
  ['TWICE – Strategy (feat. Megan Thee Stallion)',''],
  ['Travis Scott – SIRENS',''],
  ['Tyler, The Creator – Sticky','']
];

const IMAGES = [
  'images/gif1.gif','images/gif2.gif','images/gif3.gif',
  'images/gif4.gif','images/gif5.gif','images/gif6.gif','images/gif7.gif'
];

const MAX_VOL = 0.85;

/* ---------- HELPERS ---------- */
const $ = id => document.getElementById(id);
const $$ = sel => [...document.querySelectorAll(sel)];
const rm = matchMedia('(prefers-reduced-motion:reduce)').matches;

/* =========================================================
   TITLE LETTER SPLIT
   ========================================================= */
const lt = (t, off=0, cls='') =>
  [...t].map((ch,i) =>
    `<span class="l ${cls}" style="--i:${i+off}">${ch===' '?'&nbsp;':ch}</span>`
  ).join('');

$('heroTitle').innerHTML =
  `<span class="a">${lt('Happy Birthday')}</span>` +
  `<span class="n"><span class="g">${lt('Mimi',14)}</span>` +
  `<span class="ex">${lt('!!!!',18)}</span></span>`;

/* =========================================================
   GALLERY RAIL
   ========================================================= */
const rail = $('rail');
IMAGES.forEach((src, n) => {
  const c = document.createElement('div');
  c.className = 'card-m';
  const img = new Image();
  img.src = src;
  img.alt = '';
  img.loading = 'lazy';
  img.onerror = () => {
    const ph = document.createElement('div');
    ph.style.cssText =
      'width:100%;height:100%;display:grid;place-items:center;' +
      'text-align:center;padding:20px;font:italic 600 1.1rem var(--serif);' +
      'color:var(--ink);border-radius:195px 195px 16px 16px;' +
      'background:linear-gradient(160deg,#f7ecd2,#c8963e 55%,#8c5a22);';
    ph.textContent = `Moment ${n+1}`;
    c.innerHTML = '';
    c.appendChild(ph);
  };
  c.appendChild(img);
  rail.appendChild(c);

  const move = e => {
    const r = c.getBoundingClientRect();
    const x = (e.clientX - r.left)/r.width;
    const y = (e.clientY - r.top)/r.height;
    c.style.setProperty('--ry', (x-.5)*22 + 'deg');
    c.style.setProperty('--rx', (.5-y)*22 + 'deg');
    c.style.setProperty('--sx', x*100 + '%');
    c.style.setProperty('--sy', y*100 + '%');
  };
  c.addEventListener('pointermove', move);
  c.addEventListener('pointerdown', move);
  ['pointerleave','pointerup'].forEach(nm =>
    c.addEventListener(nm, () => {
      c.style.setProperty('--rx','0deg');
      c.style.setProperty('--ry','0deg');
    })
  );
});

/* =========================================================
   PLAYLIST
   ========================================================= */
const music = $('music');
const player = $('player');
const listEl = $('list');
let current = 0;

const tracksEl = $('tracks');
PLAYLIST.forEach(([title], i) => {
  const li = document.createElement('li');
  li.dataset.i = i;
  li.innerHTML = `<span>${title}</span>`;
  li.addEventListener('click', () => loadTrack(i, true));
  tracksEl.appendChild(li);
});
$('lcount').textContent = PLAYLIST.length + ' tracks';

function loadTrack(i, play=true) {
  current = ((i % PLAYLIST.length) + PLAYLIST.length) % PLAYLIST.length;
  music.src = 'audio/song' + String(current + 1).padStart(2,'0') + '.mp3';
  $('song').textContent = PLAYLIST[current][0];
  $('artist').textContent = PLAYLIST[current][1] || '';
  [...tracksEl.children].forEach((li, k) =>
    li.classList.toggle('active', k === current)
  );
  $('fill').style.width = '0%';
  $('cur').textContent = '0:00';
  if (play) music.play().catch(()=>{});
}

/* =========================================================
   PLAYER UI
   ========================================================= */
const fmt = s => isFinite(s)
  ? Math.floor(s/60) + ':' + String(Math.floor(s%60)).padStart(2,'0')
  : '0:00';

$('pp').onclick = () => music.paused ? music.play().catch(()=>{}) : music.pause();
$('next').onclick = () => loadTrack(current + 1, true);
$('prev').onclick = () => {
  if (music.currentTime > 3) { music.currentTime = 0; return; }
  loadTrack(current - 1, true);
};
music.onplay = () => player.classList.add('playing');
music.onpause = () => player.classList.remove('playing');
music.onloadedmetadata = () => $('dur').textContent = fmt(music.duration);
music.ontimeupdate = () => {
  $('cur').textContent = fmt(music.currentTime);
  const pct = (music.currentTime / music.duration) * 100 || 0;
  $('fill').style.width = pct + '%';
};
music.onended = () => loadTrack(current + 1, true);

/* seek */
let dragging = false;
function seekTo(e) {
  if (!music.duration) return;
  const r = $('track').getBoundingClientRect();
  const pct = Math.max(0, Math.min(1, (e.clientX - r.left) / r.width));
  music.currentTime = pct * music.duration;
}
$('seek').addEventListener('pointerdown', e => {
  dragging = true;
  $('seek').setPointerCapture(e.pointerId);
  seekTo(e);
});
$('seek').addEventListener('pointermove', e => dragging && seekTo(e));
$('seek').addEventListener('pointerup', () => dragging = false);
$('seek').addEventListener('pointercancel', () => dragging = false);

/* playlist toggle */
$('disc').addEventListener('click', e => {
  e.stopPropagation();
  listEl.classList.toggle('on');
  listEl.setAttribute('aria-hidden', listEl.classList.contains('on') ? 'false' : 'true');
});
document.addEventListener('pointerdown', e => {
  if (!listEl.classList.contains('on')) return;
  if (e.target.closest('#list,#disc')) return;
  listEl.classList.remove('on');
  listEl.setAttribute('aria-hidden','true');
});

/* equalizer */
const eq = $('eq');
for (let i=0;i<22;i++) eq.appendChild(document.createElement('b'));
setInterval(() => {
  const on = !music.paused;
  const t = Date.now() / 240;
  [...eq.children].forEach((b,i) => {
    const v = on
      ? 0.2 + 0.8 * Math.abs(Math.sin(t + i*0.55) * Math.cos(t*0.7 + i*0.31))
      : 0.12;
    b.style.transform = `scaleY(${v})`;
  });
}, 130);

/* =========================================================
   AMBIENT BACKGROUND REEL
   ========================================================= */
const va = $('va'), vb = $('vb');
let cur = va, idx = 0, busy = false;

function playAmbient(first = false) {
  const nxt = first ? va : (cur === va ? vb : va);
  nxt.src = CLIP_AMBIENT[idx % CLIP_AMBIENT.length];
  idx++;
  nxt.currentTime = 0;
  nxt.classList.remove('on');
  void nxt.offsetWidth;
  nxt.classList.add('on');
  nxt.play().catch(()=>{});
  if (!first && cur !== nxt) {
    const old = cur;
    setTimeout(() => {
      old.classList.remove('on');
      try { old.pause(); } catch(_) {}
    }, 1600);
  }
  cur = nxt;
  busy = false;
}
function nextAmbient() {
  if (busy) return;
  busy = true;
  playAmbient(false);
}
[va, vb].forEach(v => {
  v.addEventListener('timeupdate', () => {
    if (v === cur && v.duration && v.duration - v.currentTime < 1.4) nextAmbient();
  });
  v.addEventListener('ended', () => v === cur && nextAmbient());
  v.addEventListener('error', () => v === cur && setTimeout(nextAmbient, 700));
});

/* =========================================================
   VIDEO COLLAGE GRID (6 tiles, crossfade)
   ========================================================= */
const TILE_COUNT = 6;
const collage = $('collage');
let tiles = [];

function buildCollage() {
  for (let i=0;i<TILE_COUNT;i++) {
    const tile = document.createElement('div');
    tile.className = 'tile';
    const v1 = document.createElement('video');
    const v2 = document.createElement('video');
    [v1, v2].forEach(v => {
      v.muted = true;
      v.playsInline = true;
      v.preload = 'auto';
      v.setAttribute('playsinline','');
      v.setAttribute('webkit-playsinline','');
      tile.appendChild(v);
    });
    collage.appendChild(tile);
    tiles.push(makeTile(tile, v1, v2, i));
  }
}

function makeTile(el, v1, v2, offset) {
  const state = {
    el, front: v1, back: v2,
    idx: offset % CLIP_COLLAGE.length,
    alive: true
  };
  v1.src = CLIP_COLLAGE[state.idx];
  v1.currentTime = 0;
  v1.play().catch(()=>{});
  v1.classList.add('on');

  const advance = () => {
    if (!state.alive) return;
    const nextIdx = (state.idx + 1) % CLIP_COLLAGE.length;
    state.idx = nextIdx;
    const b = state.back;
    b.src = CLIP_COLLAGE[nextIdx];
    b.currentTime = 0;
    b.play().catch(()=>{});
    b.classList.add('on');
    const f = state.front;
    setTimeout(() => {
      f.classList.remove('on');
      try { f.pause(); } catch(_){}
      const tmp = state.front;
      state.front = state.back;
      state.back = tmp;
      waitForFront();
    }, 1500);
  };

  const waitForFront = () => {
    if (!state.alive) return;
    const f = state.front;
    const dur = isFinite(f.duration) && f.duration > 0 ? f.duration : 6;
    const delay = Math.max(2500, (dur - 1.5) * 1000);
    setTimeout(advance, delay);
  };

  v1.addEventListener('loadedmetadata', () => waitForFront(), { once:true });
  setTimeout(() => waitForFront(), 4000);

  return state;
}

function stopCollage() {
  tiles.forEach(t => {
    t.alive = false;
    try { t.front.pause(); t.back.pause(); } catch(_) {}
  });
  tiles = [];
}

/* =========================================================
   MASTER SEQUENCE
   ========================================================= */
let collageStarted = false;
let cardShown = false;

/* ---------- GATE ---------- */
const gateEl = $('gate');
const askEls = $$('#gate .ask');

function showStep(n) {
  askEls.forEach(a => a.classList.toggle('on', a.dataset.step === String(n)));
}
showStep(1);

$$('#gate [data-go]').forEach(btn => {
  btn.addEventListener('click', () => {
    const go = btn.dataset.go;
    if (go === 'open') {
      openTheGates();
    } else {
      showStep(go);
    }
  });
});

async function openTheGates() {
  // music — this click is the iOS unlock gesture
  loadTrack(0, false);
  music.volume = 0;
  try {
    await music.play();
    let v = 0;
    const t = setInterval(() => {
      v += 0.02;
      music.volume = Math.min(v, MAX_VOL);
      if (v >= MAX_VOL) clearInterval(t);
    }, 130);
  } catch (_) {}

  if (window.DeviceOrientationEvent && DeviceOrientationEvent.requestPermission) {
    try { await DeviceOrientationEvent.requestPermission(); } catch (_) {}
  }

  gateEl.classList.add('out');
  setTimeout(() => gateEl.remove(), 1100);
  startSplash();
}

/* --- SPLASH --- */
function startSplash() {
  const intro = $('intro');
  intro.muted = true;
  $('splash').classList.add('cine');
  intro.play().catch(toCollage);
  intro.addEventListener('ended', toCollage);
  intro.addEventListener('error', toCollage);
  // hard-cut clip1 at INTRO_DURATION seconds, whether it finished or not
  setTimeout(toCollage, INTRO_DURATION * 1000);
}
$('skip').addEventListener('click', toCollage);

/* --- COLLAGE --- */
function toCollage() {
  if (collageStarted) return;
  collageStarted = true;

  buildCollage();

  const tl = gsap.timeline();

  tl.to('#splash', {
    opacity: 0,
    duration: 1.2,
    ease: 'power2.inOut',
    onComplete: () => {
      const s = $('splash');
      if (s) s.remove();
      const i = $('intro');
      if (i) { try { i.pause(); } catch(_) {} }
    }
  })
  .fromTo('#collage',
    { opacity: 0, scale: 1.15, y: 40 },
    { opacity: 1, scale: 1, y: 0, duration: 1.8, ease: 'power3.out' },
    '-=0.9'
  )
  .fromTo('.tile',
    { opacity: 0, scale: 0.85, filter: 'blur(20px)' },
    { opacity: 1, scale: 1, filter: 'blur(0px)',
      duration: 1.2, stagger: 0.08, ease: 'power2.out' },
    '-=1.2'
  );

  setTimeout(showBridgeTitle, 6500);
}

/* --- BRIDGE TITLE --- */
function showBridgeTitle() {
  gsap.fromTo('#collageTitle',
    { opacity: 0, y: 40, filter: 'blur(24px)', scale: 1.06 },
    { opacity: 1, y: 0, filter: 'blur(0px)', scale: 1,
      duration: 1.6, ease: 'power3.out' }
  );
  setTimeout(hideBridge, 3200);
}
function hideBridge() {
  gsap.to('#collageTitle', {
    opacity: 0, y: -20, filter: 'blur(14px)',
    duration: 1, ease: 'power2.in',
    onComplete: showGlassCard
  });
}

/* --- GLASS CARD --- */
function showGlassCard() {
  if (cardShown) return;
  cardShown = true;

  gsap.to('#stage, #collage', {
    filter: 'blur(26px) brightness(.4) saturate(1.2)',
    duration: 1.8, ease: 'power2.inOut'
  });

  gsap.fromTo('#card',
    { opacity: 0, y: 60, scale: 0.94 },
    { opacity: 1, y: 0, scale: 1, duration: 1.4, ease: 'power3.out',
      onComplete: () => { $('card').style.pointerEvents = 'auto'; } }
  );
  gsap.set('#card', { xPercent: -50, yPercent: -50 });
}

/* --- CONTINUE (dismiss card, kill collage, unblur, reveal page) --- */
$('beginBtn').addEventListener('click', () => {
  // 1) fade the glass card out
  gsap.to('#card', {
    opacity: 0, y: -40, scale: 0.96,
    duration: 1, ease: 'power2.in',
    onComplete: () => { $('card').style.display = 'none'; }
  });

  // 2) fade the collage OUT — this was blocking the page before
  const collageEl = $('collage');
  gsap.to(collageEl, {
    opacity: 0,
    scale: 1.06,
    duration: 1.2,
    ease: 'power2.inOut',
    onComplete: () => {
      stopCollage();
      collageEl.classList.add('done');   // display:none via CSS
    }
  });

  // 3) un-blur the ambient stage so the reel shows through
  gsap.to('#stage', {
    filter: 'blur(0px) brightness(1) saturate(1)',
    duration: 1.6,
    ease: 'power2.inOut'
  });

  // 4) reveal the page + start ambient
  playAmbient(true);
  document.body.classList.remove('locked');
  $('page').classList.add('show');

  setTimeout(() => player.classList.add('show'), 1600);
  setTimeout(() => burst(1.4), 1800);
});

/* =========================================================
   SCROLL REVEALS
   ========================================================= */
const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('in');
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.18 });
$$('.rv').forEach(el => io.observe(el));

addEventListener('scroll', () => {
  const max = document.body.scrollHeight - innerHeight;
  $('bar-top').style.transform = `scaleX(${max > 0 ? scrollY / max : 0})`;
}, { passive: true });

/* =========================================================
   POINTER / TILT
   ========================================================= */
let mx = innerWidth/2, my = innerHeight/2, hasPtr = false;
addEventListener('pointermove', e => {
  mx = e.clientX; my = e.clientY; hasPtr = true;
  const g = $('glow');
  g.style.opacity = 1;
  g.style.transform = `translate(${mx}px,${my}px)`;
  document.documentElement.style.setProperty('--px', (mx/innerWidth - .5) * 2);
  document.documentElement.style.setProperty('--py', (my/innerHeight - .5) * 2);
}, { passive: true });

addEventListener('deviceorientation', e => {
  if (e.gamma == null) return;
  document.documentElement.style.setProperty('--px', Math.max(-1, Math.min(1, e.gamma/30)));
  document.documentElement.style.setProperty('--py', Math.max(-1, Math.min(1, (e.beta-45)/30)));
});

function reactLetters() {
  if (rm) return;
  $$('#heroTitle .l').forEach(l => {
    const r = l.getBoundingClientRect();
    const cxL = r.left + r.width/2, cyL = r.top + r.height/2;
    const d = Math.hypot(mx - cxL, my - cyL);
    const k = Math.max(0, 1 - d/180);
    l.style.transform = k > 0.03
      ? `translateY(${-k*18}px) scale(${1 + k*0.22}) rotate(${(mx - cxL) * -0.02 * k}deg)`
      : '';
  });
}

/* =========================================================
   CANVAS FX
   ========================================================= */
const cv = $('fx'), cx2d = cv.getContext('2d');
const dpr = Math.min(devicePixelRatio || 1, 2);
let W, H, dust = [], conf = [], ripples = [];

function sizeCanvas() {
  W = cv.width = innerWidth * dpr;
  H = cv.height = innerHeight * dpr;
}
sizeCanvas();
addEventListener('resize', sizeCanvas);

for (let i=0;i<55;i++) {
  dust.push({
    x: Math.random()*innerWidth*dpr,
    y: Math.random()*innerHeight*dpr,
    r: (.6 + Math.random()*2) * dpr,
    vx: (Math.random()-.5)*.25*dpr,
    vy: (-.15 - Math.random()*.4)*dpr,
    a: .2 + Math.random()*.6,
    p: Math.random()*6
  });
}
const COLS = ['#e9c27a','#c8963e','#f7ecd2','#b79cf0','#8c5a22','#e6d3b1'];
function burst(k=1, x=W/2, y=H*.4) {
  for (let i=0;i<110*k;i++) {
    conf.push({
      x, y,
      vx: (Math.random()-.5)*18*dpr,
      vy: (-Math.random()*18 - 4)*dpr,
      w: (5 + Math.random()*8) * dpr,
      c: COLS[i % 6],
      r: Math.random()*6,
      vr: (Math.random()-.5)*.4,
      l: 1
    });
  }
}
addEventListener('pointerdown', e => {
  if (e.target.closest('#player,#list,#skip,#gate,#card')) return;
  ripples.push({ x: e.clientX*dpr, y: e.clientY*dpr, r: 0, l: 1 });
});

function frame(t) {
  cx2d.clearRect(0, 0, W, H);

  dust.forEach(p => {
    p.x += p.vx + Math.sin(t/1700 + p.p) * .25 * dpr;
    p.y += p.vy;
    if (hasPtr) {
      const dx = p.x - mx*dpr, dy = p.y - my*dpr;
      const d = Math.hypot(dx, dy);
      if (d < 140*dpr) { p.x += dx/d * 3 * dpr; p.y += dy/d * 3 * dpr; }
    }
    if (p.y < -10) p.y = H + 10;
    if (p.x < -10) p.x = W + 10;
    if (p.x > W + 10) p.x = -10;
    cx2d.globalAlpha = p.a * (.6 + .4 * Math.sin(t/500 + p.p));
    cx2d.fillStyle = '#e9c27a';
    cx2d.shadowColor = '#c8963e';
    cx2d.shadowBlur = 8*dpr;
    cx2d.beginPath();
    cx2d.arc(p.x, p.y, p.r, 0, 7);
    cx2d.fill();
  });
  cx2d.shadowBlur = 0;

  conf = conf.filter(p => p.l > 0);
  conf.forEach(p => {
    p.vy += .5 * dpr;
    p.x += p.vx;
    p.y += p.vy;
    p.vx *= .99;
    p.r += p.vr;
    p.l -= .006;
    cx2d.save();
    cx2d.globalAlpha = Math.max(p.l, 0);
    cx2d.translate(p.x, p.y);
    cx2d.rotate(p.r);
    cx2d.fillStyle = p.c;
    cx2d.fillRect(-p.w/2, -p.w/4, p.w, p.w/2);
    cx2d.restore();
  });

  for (let i = ripples.length - 1; i >= 0; i--) {
    const q = ripples[i];
    q.r += 5 * dpr;
    q.l -= .025;
    if (q.l <= 0) { ripples.splice(i, 1); continue; }
    cx2d.globalAlpha = q.l;
    cx2d.strokeStyle = '#e9c27a';
    cx2d.lineWidth = 2*dpr;
    cx2d.beginPath();
    cx2d.arc(q.x, q.y, q.r, 0, 7);
    cx2d.stroke();
  }
  cx2d.globalAlpha = 1;

  reactLetters();
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);

/* =========================================================
   WISH (cake)
   ========================================================= */
let wished = false;
function blowCandle() {
  if (wished) return;
  wished = true;
  $('cake').classList.add('out');
  const r = $('cake').getBoundingClientRect();
  burst(1, (r.left + r.width/2) * dpr, (r.top + 30) * dpr);
  const w = $('wishtxt');
  w.style.opacity = 0;
  setTimeout(() => {
    w.textContent = 'Wish made. Keep it to yourself and it comes true.';
    w.style.opacity = 1;
  }, 500);
}
$('cake').addEventListener('click', blowCandle);
$('cake').addEventListener('keydown', e => {
  if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); blowCandle(); }
});

/* =========================================================
   KEYBOARD
   ========================================================= */
addEventListener('keydown', e => {
  if (e.target.matches('input,textarea')) return;
  if (e.code === 'Space') { e.preventDefault(); $('pp').click(); }
  if (e.code === 'ArrowRight') loadTrack(current + 1, true);
  if (e.code === 'ArrowLeft')  loadTrack(current - 1, true);
});