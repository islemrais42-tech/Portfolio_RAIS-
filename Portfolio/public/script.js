/* =====================================================
   DYNAMIC PORTFOLIO - Islem Rais
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
  initScrollProgressBar();
  initParallaxElements();
  initFloatingElements();
  initEnhancedCardInteractions();
  initGlowingEffects();
  initSmoothPageTransitions();
}

/* ---- CUSTOM CURSOR ---- */
function initCursor() {
  const cursor = document.getElementById('cursor');
  const follower = document.getElementById('cursorFollower');
  if (!cursor || !follower || !window.matchMedia('(pointer: fine)').matches) return;

  let fx = 0, fy = 0, cx = 0, cy = 0;
  let isMoving = false;

  document.addEventListener('mousemove', e => {
    cx = e.clientX; cy = e.clientY;
    cursor.style.left = cx + 'px';
    cursor.style.top  = cy + 'px';
    isMoving = true;
  }, { passive: true });

  (function animFollower() {
    if (isMoving) {
      fx += (cx - fx) * 0.12;
      fy += (cy - fy) * 0.12;
      follower.style.left = fx + 'px';
      follower.style.top  = fy + 'px';
      isMoving = Math.abs(cx - fx) > 0.2 || Math.abs(cy - fy) > 0.2;
    }
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
  if (!navbar) return;
  let ticking = false;

  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      navbar.classList.toggle('scrolled', window.scrollY > 40);
      ticking = false;
    });
  }, { passive: true });
}

/* ---- MOBILE MENU ---- */
function initMobileMenu() {
  const btn   = document.getElementById('hamburger');
  const links = document.getElementById('navLinks');
  if (!btn || !links) return;

  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    btn.classList.toggle('open');
    links.classList.toggle('open');
  });

  // Close menu when clicking a link
  links.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      btn.classList.remove('open');
      links.classList.remove('open');
    });
  });

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!btn.contains(e.target) && !links.contains(e.target)) {
      btn.classList.remove('open');
      links.classList.remove('open');
    }
  }, { passive: true });

  // Close menu on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      btn.classList.remove('open');
      links.classList.remove('open');
    }
  }, { passive: true });
}

/* ---- PARTICLES ---- */
function initHeroParticles() {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  let W, H, particles = [];

  function resize() {
    W = canvas.offsetWidth;
    H = canvas.offsetHeight;
    canvas.width = Math.floor(W * dpr);
    canvas.height = Math.floor(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  resize();
  window.addEventListener('resize', debounce(() => { resize(); createParticles(); }, 150), { passive: true });

  function createParticles() {
    const count = reduceMotion ? 0 : Math.min(95, Math.floor((W * H) / 18000));
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
  }, { passive: true });

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
  if (!el) return;
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
  if (!targets.length) return;

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
  if (!items.length) return;

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const siblings = Array.from(el.parentElement.querySelectorAll('.stagger-item'));
      const idx = siblings.indexOf(el);
      el.style.transitionDelay = Math.min(idx * 90, 450) + 'ms';
      el.classList.add('visible');
      obs.unobserve(el);
    });
  }, { threshold: 0.1 });

  items.forEach(el => obs.observe(el));
}

/* ---- SKILL BARS ---- */
function initSkillBars() {
  const bars = document.querySelectorAll('.skill-bar-fill');
  if (!bars.length) return;

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
  if (!window.matchMedia('(pointer: fine)').matches) return;

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
  if (!window.matchMedia('(pointer: fine)').matches) return;

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
  if (!card || !window.matchMedia('(pointer: fine)').matches) return;
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
  if (!sections.length || !navAnchors.length) return;

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

function debounce(fn, delay) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

/* ---- SCROLL PROGRESS BAR ---- */
function initScrollProgressBar() {
  let progressBar = document.getElementById('scrollProgressBar');
  if (!progressBar) {
    progressBar = document.createElement('div');
    progressBar.id = 'scrollProgressBar';
    progressBar.style.cssText = `
      position: fixed; top: 0; left: 0; height: 3px; 
      background: linear-gradient(90deg, var(--purple-l), var(--cyan-l), var(--pink-l));
      z-index: 9999; width: 0;
      box-shadow: 0 0 10px rgba(96, 165, 250, 0.8);
    `;
    document.body.appendChild(progressBar);
  }
  
  window.addEventListener('scroll', debounce(() => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrolled = (scrollTop / docHeight) * 100;
    progressBar.style.width = scrolled + '%';
  }, 10), { passive: true });
}

/* ---- PARALLAX SCROLLING ---- */
function initParallaxElements() {
  const parallaxElements = document.querySelectorAll('[data-parallax]');
  if (!parallaxElements.length) return;
  
  window.addEventListener('scroll', debounce(() => {
    parallaxElements.forEach(el => {
      const speed = el.getAttribute('data-parallax') || 0.5;
      const yPos = window.scrollY * speed;
      el.style.transform = `translateY(${yPos}px)`;
    });
  }, 10), { passive: true });
}

/* ---- FLOATING ANIMATED ELEMENTS ---- */
function initFloatingElements() {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes float {
      0%, 100% { transform: translateY(0px) rotate(0deg); }
      50% { transform: translateY(-20px) rotate(5deg); }
    }
    @keyframes pulse-glow {
      0%, 100% { box-shadow: 0 0 10px rgba(96, 165, 250, 0.4); }
      50% { box-shadow: 0 0 30px rgba(96, 165, 250, 0.8); }
    }
    .floating-element {
      animation: float 6s ease-in-out infinite;
    }
    .floating-element:nth-child(2) {
      animation-delay: 1s;
    }
    .floating-element:nth-child(3) {
      animation-delay: 2s;
    }
  `;
  document.head.appendChild(style);
  
  // Add floating elements to hero section
  const hero = document.querySelector('.hero');
  if (hero) {
    const floatingHTML = `
      <div class="floating-element" style="position: absolute; top: 10%; left: 10%; width: 40px; height: 40px; background: linear-gradient(135deg, var(--purple-l), var(--cyan-l)); border-radius: 50%; opacity: 0.1;"></div>
      <div class="floating-element" style="position: absolute; top: 60%; right: 5%; width: 60px; height: 60px; background: linear-gradient(135deg, var(--cyan-l), var(--pink-l)); border-radius: 50%; opacity: 0.08;"></div>
      <div class="floating-element" style="position: absolute; bottom: 20%; left: 5%; width: 50px; height: 50px; background: linear-gradient(135deg, var(--pink-l), var(--purple-l)); border-radius: 50%; opacity: 0.1;"></div>
    `;
    hero.insertAdjacentHTML('beforeend', floatingHTML);
  }
}

/* ---- ENHANCED CARD INTERACTIONS ---- */
function initEnhancedCardInteractions() {
  const cards = document.querySelectorAll('.project-card, [data-tilt]');
  
  cards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.style.transition = 'all 0.4s var(--ease-spring)';
      card.style.transform = 'translateY(-8px) scale(1.02)';
      card.style.boxShadow = '0 20px 60px rgba(96, 165, 250, 0.3)';
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.boxShadow = '';
    });
  });
}

/* ---- GLOWING EFFECTS ---- */
function initGlowingEffects() {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes glow-pulse {
      0%, 100% { text-shadow: 0 0 10px rgba(96, 165, 250, 0.3); }
      50% { text-shadow: 0 0 20px rgba(96, 165, 250, 0.8); }
    }
    @keyframes box-glow {
      0%, 100% { box-shadow: inset 0 0 20px rgba(96, 165, 250, 0.1), 0 0 20px rgba(96, 165, 250, 0.1); }
      50% { box-shadow: inset 0 0 30px rgba(96, 165, 250, 0.2), 0 0 30px rgba(96, 165, 250, 0.2); }
    }
    .glow-text {
      animation: glow-pulse 3s ease-in-out infinite;
    }
    .glow-box {
      animation: box-glow 3s ease-in-out infinite;
    }
  `;
  document.head.appendChild(style);
  
  // Apply glow to section titles
  document.querySelectorAll('.section-title em').forEach(el => {
    el.classList.add('glow-text');
  });
}

/* ---- SMOOTH PAGE TRANSITIONS ---- */
function initSmoothPageTransitions() {
  // Add smooth fade-in animation to all sections
  const style = document.createElement('style');
  style.textContent = `
    @keyframes fade-in-up {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    section {
      animation: fade-in-up 0.8s var(--ease) forwards;
    }
    section:nth-of-type(1) { animation-delay: 0s; }
    section:nth-of-type(2) { animation-delay: 0.1s; }
    section:nth-of-type(3) { animation-delay: 0.2s; }
    section:nth-of-type(4) { animation-delay: 0.3s; }
    section:nth-of-type(5) { animation-delay: 0.4s; }
  `;
  document.head.appendChild(style);
  
  // Smooth transitions for internal links
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      if (link.getAttribute('href') !== '#') {
        e.preventDefault();
        const target = document.querySelector(link.getAttribute('href'));
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  });
}


/* ---- CONTACT FORM TO GOOGLE SHEETS ---- */

// Replace this URL with your deployed Google Apps Script Web App URL.
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

    // Create abort controller with 8 second timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    // Send to Google Sheets via Apps Script with optimizations
    const response = await fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      mode:   'no-cors',          // Apps Script requires no-cors
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name, email, subject, message,
        timestamp: new Date().toLocaleString('en-GB', { timeZone: 'Africa/Algiers' })
      }),
      signal: controller.signal,
      keepalive: true             // Keep connection alive for faster subsequent requests
    });

    clearTimeout(timeoutId);

    // no-cors means we cannot read the response, so treat completion as success.
    btn.innerHTML = '<span>Send Message</span><i class="fas fa-paper-plane"></i>';
    btn.disabled  = false;
    success.style.display = 'block';
    form.reset();
    setTimeout(() => { success.style.display = 'none'; }, 3500);  // Reduced from 6000 to 3500ms

  } catch (err) {
    btn.innerHTML = '<span>Send Message</span><i class="fas fa-paper-plane"></i>';
    btn.disabled  = false;
    if (errorEl) {
      errorEl.style.display = 'block';
      setTimeout(() => { errorEl.style.display = 'none'; }, 3500);  // Reduced from 6000 to 3500ms
    }
    console.error('Form submission error:', err.message);
  }
}
