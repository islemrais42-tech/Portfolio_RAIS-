/* =====================================================
   DYNAMIC PORTFOLIO — Islem Rais
   ===================================================== */

/* ---- PRELOADER ---- */
(function () {
  const fill = document.getElementById('preloaderFill');
  const text = document.getElementById('preloaderText');
  const loader = document.getElementById('preloader');
  const msgs = ['Loading...', 'Preparing...', 'Almost there...'];
  let prog = 0;
  let idx = 0;

  const interval = setInterval(() => {
    prog += Math.random() * 18 + 5;
    if (prog > 100) prog = 100;
    fill.style.width = prog + '%';
    if (prog > 40 && idx === 0) { idx = 1; text.textContent = msgs[1]; }
    if (prog > 75 && idx === 1) { idx = 2; text.textContent = msgs[2]; }
    if (prog >= 100) {
      clearInterval(interval);
      setTimeout(() => {
        loader.classList.add('hidden');
        document.body.classList.remove('loading');
        initAll();
      }, 400);
    }
  }, 80);
})();

/* ---- INIT ALL ---- */
function initAll() {
  initCursor();
  initNavbar();
  initMobileMenu();
  initHeroParticles();
  initTyped();
  initCounters();
  initScrollReveal();
  initSkillBars();
  initTilt();
  initMagnetic();
  init3DCard();
  initActiveNav();
}

/* ---- CUSTOM CURSOR ---- */
function initCursor() {
  const cursor = document.getElementById('cursor');
  const follower = document.getElementById('cursorFollower');
  let fx = 0, fy = 0, cx = 0, cy = 0;

  document.addEventListener('mousemove', e => {
    cx = e.clientX; cy = e.clientY;
    cursor.style.left = cx + 'px';
    cursor.style.top  = cy + 'px';
  });

  (function animFollower() {
    fx += (cx - fx) * 0.12;
    fy += (cy - fy) * 0.12;
    follower.style.left = fx + 'px';
    follower.style.top  = fy + 'px';
    requestAnimationFrame(animFollower);
  })();

  document.querySelectorAll('a, button, [data-tilt], input, textarea').forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.classList.add('hovered');
      follower.classList.add('hovered');
    });
    el.addEventListener('mouseleave', () => {
      cursor.classList.remove('hovered');
      follower.classList.remove('hovered');
    });
  });
}

/* ---- NAVBAR ---- */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  });
}

/* ---- MOBILE MENU ---- */
function initMobileMenu() {
  const btn   = document.getElementById('hamburger');
  const links = document.getElementById('navLinks');

  btn.addEventListener('click', () => {
    btn.classList.toggle('open');
    links.classList.toggle('open');
  });

  links.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      btn.classList.remove('open');
      links.classList.remove('open');
    });
  });
}

/* ---- PARTICLES ---- */
function initHeroParticles() {
  const canvas = document.getElementById('particleCanvas');
  const ctx = canvas.getContext('2d');
  let W, H, particles = [];

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', () => { resize(); createParticles(); });

  function createParticles() {
    const count = Math.floor((W * H) / 14000);
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 1.8 + 0.4,
      dx: (Math.random() - 0.5) * 0.4,
      dy: (Math.random() - 0.5) * 0.4,
      alpha: Math.random() * 0.5 + 0.1
    }));
  }
  createParticles();

  let mouseX = W / 2, mouseY = H / 2;
  canvas.addEventListener('mousemove', e => {
    const r = canvas.getBoundingClientRect();
    mouseX = e.clientX - r.left;
    mouseY = e.clientY - r.top;
  });

  function draw() {
    ctx.clearRect(0, 0, W, H);

    particles.forEach(p => {
      // Move
      p.x += p.dx;
      p.y += p.dy;
      if (p.x < 0 || p.x > W) p.dx *= -1;
      if (p.y < 0 || p.y > H) p.dy *= -1;

      // Mouse repulsion
      const dx = p.x - mouseX, dy = p.y - mouseY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist > 0 && dist < 120) {
        p.x += dx / dist * 1.2;
        p.y += dy / dist * 1.2;
      }

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(96,165,250,${p.alpha})`;
      ctx.fill();
    });

    // Lines between close particles
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < 90) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(94,234,212,${0.06 * (1 - d / 90)})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(draw);
  }
  draw();
}

/* ---- TYPED TEXT ---- */
function initTyped() {
  const el = document.getElementById('typedRole');
  const roles = ['Account Manager', 'Client Success Partner', 'Retention & Growth Strategist', 'Stakeholder Relationship Lead'];
  let ri = 0, ci = 0, deleting = false;

  function type() {
    const word = roles[ri];
    if (!deleting) {
      el.textContent = word.slice(0, ++ci);
      if (ci === word.length) { deleting = true; setTimeout(type, 2200); return; }
    } else {
      el.textContent = word.slice(0, --ci);
      if (ci === 0) { deleting = false; ri = (ri + 1) % roles.length; setTimeout(type, 400); return; }
    }
    setTimeout(type, deleting ? 55 : 95);
  }
  type();
}

/* ---- COUNTERS ---- */
function initCounters() {
  const targets = document.querySelectorAll('[data-target]');
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const el = e.target;
        const target = +el.dataset.target;
        let current = 0;
        const step = target / 60;
        const tick = setInterval(() => {
          current += step;
          if (current >= target) { current = target; clearInterval(tick); }
          el.textContent = Math.floor(current);
        }, 25);
        obs.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  targets.forEach(t => obs.observe(t));
}

/* ---- SCROLL REVEAL ---- */
function initScrollReveal() {
  const items = document.querySelectorAll('.stagger-item');

  // Group siblings in same grid/flex parent for stagger
  const groups = {};
  items.forEach(el => {
    const key = el.parentElement;
    if (!groups[key]) groups[key] = [];
    groups[key].push(el);
  });

  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const siblings = Array.from(el.parentElement.querySelectorAll('.stagger-item'));
        const idx = siblings.indexOf(el);
        el.style.transitionDelay = Math.min(idx * 90, 450) + 'ms';
        el.classList.add('visible');
        obs.unobserve(el);
      }
    });
  }, { threshold: 0.1 });

  items.forEach(el => obs.observe(el));
}

/* ---- SKILL BARS ---- */
function initSkillBars() {
  const bars = document.querySelectorAll('.skill-bar-fill');
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.width = e.target.dataset.width + '%';
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.4 });
  bars.forEach(b => obs.observe(b));
}

/* ---- TILT EFFECT ---- */
function initTilt() {
  document.querySelectorAll('[data-tilt]').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r   = card.getBoundingClientRect();
      const cx  = r.left + r.width  / 2;
      const cy  = r.top  + r.height / 2;
      const rx  = ((e.clientY - cy) / (r.height / 2)) * -8;
      const ry  = ((e.clientX - cx) / (r.width  / 2)) *  8;
      card.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-4px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

/* ---- MAGNETIC BUTTONS ---- */
function initMagnetic() {
  // Only apply to .magnetic elements that are NOT [data-tilt] cards
  document.querySelectorAll('.magnetic:not([data-tilt])').forEach(el => {
    el.addEventListener('mousemove', e => {
      const r = el.getBoundingClientRect();
      const x = e.clientX - r.left - r.width  / 2;
      const y = e.clientY - r.top  - r.height / 2;
      el.style.transform = `translate(${x * 0.25}px, ${y * 0.25}px)`;
    });
    el.addEventListener('mouseleave', () => {
      el.style.transform = '';
    });
  });
}

/* ---- 3D CARD MOUSE TRACKING ---- */
function init3DCard() {
  const card = document.getElementById('aboutCard');
  if (!card) return;
  card.addEventListener('mousemove', e => {
    const r  = card.getBoundingClientRect();
    const cx = r.left + r.width  / 2;
    const cy = r.top  + r.height / 2;
    const rx = ((e.clientY - cy) / (r.height / 2)) * -12;
    const ry = ((e.clientX - cx) / (r.width  / 2)) *  12;
    card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
}

/* ---- ACTIVE NAV ---- */
function initActiveNav() {
  const sections   = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav-links a:not(.nav-cta)');

  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navAnchors.forEach(a => a.style.color = '');
        const active = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
        if (active) active.style.color = 'var(--purple-l)';
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });

  sections.forEach(s => obs.observe(s));
}

/* ---- CONTACT FORM → GOOGLE SHEETS ---- */

// ⚠️ Replace this URL with your deployed Google Apps Script Web App URL
// See README.md for setup instructions
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzjmoKmL_Bxtys44X6bR26wCSZPOtu4C8gM5NXbNocXG_QoYK9KK4wpLvVTUzCnqJDDhg/exec';

async function handleSubmit(e) {
  e.preventDefault();
  const form   = e.target;
  const btn    = form.querySelector('.cf-submit');
  const success = document.getElementById('cfSuccess');
  const errorEl = document.getElementById('cfError');

  // Collect form data
  const name     = form.querySelector('[name="name"]').value.trim();
  const email    = form.querySelector('[name="email"]').value.trim();
  const subject  = form.querySelector('[name="subject"]').value.trim();
  const message  = form.querySelector('[name="message"]').value.trim();

  // Loading state
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span>Sending...</span>';
  btn.disabled  = true;
  success.style.display = 'none';
  if (errorEl) errorEl.style.display = 'none';

  try {
    if (!APPS_SCRIPT_URL || APPS_SCRIPT_URL.includes('YOUR_APPS_SCRIPT_URL')) {
      throw new Error('Contact endpoint is not configured.');
    }

    // Send to Google Sheets via Apps Script
    await fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      mode:   'no-cors',          // Apps Script requires no-cors
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name, email, subject, message,
        timestamp: new Date().toLocaleString('en-GB', { timeZone: 'Africa/Algiers' })
      })
    });

    // no-cors means we can't read the response — treat as success
    btn.innerHTML = '<span>Send Message</span><i class="fas fa-paper-plane"></i>';
    btn.disabled  = false;
    success.style.display = 'block';
    form.reset();
    setTimeout(() => { success.style.display = 'none'; }, 6000);

  } catch (err) {
    btn.innerHTML = '<span>Send Message</span><i class="fas fa-paper-plane"></i>';
    btn.disabled  = false;
    if (errorEl) {
      errorEl.style.display = 'block';
      setTimeout(() => { errorEl.style.display = 'none'; }, 6000);
    }
  }
}
