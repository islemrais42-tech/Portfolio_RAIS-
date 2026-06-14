/**
 * render.js - Reads portfolio data and populates the page DOM
 * Called before script.js animations run
 */
(function () {
  const d = getPortfolioData();

  /* ---- PROFILE ---- */
  const p = d.profile;
  setText('navName',        p.name);
  setText('heroFirstName',  p.name.split(' ')[0]);
  setText('heroLastName',   p.name.split(' ')[1] || '');
  setText('heroBio1',       p.bio1);
  setText('aboutBio1',      p.bio1);
  setText('aboutBio2',      p.bio2);
  setText('acName',         p.name);
  setText('acRole',         p.role);
  setText('acLocation',     p.location);
  setText('badge1Text',     p.badge1);
  setText('badge2Text',     p.badge2);
  setText('footerName',     p.name);
  setText('footerCopy',     `\u00a9 ${new Date().getFullYear()} ${p.name} \u00b7 ${p.role} \u00b7 All rights reserved.`);
  setText('contactLocation',p.location);

  setLink('acLinkedin',      p.linkedin, 'islem-rais');
  setLink('contactLinkedin', p.linkedin, p.linkedin.replace('https://www.',''));
  setLink('footerLinkedin',  p.linkedin);
  const emailHref = p.email ? 'mailto:' + p.email : '#contact';
  setLink('contactEmail', emailHref, p.email || 'Use the contact form');
  setLink('footerEmail',  emailHref);

  el('footerEmail') && el('footerEmail').setAttribute('aria-label', p.email ? 'Send email to ' + p.email : 'Go to contact form');
  el('heroAvailText') && (el('heroAvailText').textContent = p.available ? 'Available for new opportunities' : 'Not currently available');

  /* ---- STATS ---- */
  const statsEl = el('heroStats');
  if (statsEl) {
    statsEl.innerHTML = d.stats.map((s, i) => `
      ${i > 0 ? '<div class="h-divider"></div>' : ''}
      <div class="h-stat">
        <span class="h-stat-n" data-target="${s.value}">0</span><span class="h-stat-n">${s.suffix}</span>
        <span class="h-stat-l">${s.label}</span>
      </div>`).join('');
  }

  /* ---- SKILL BARS ---- */
  const skillsEl = el('skillBars');
  if (skillsEl) {
    skillsEl.innerHTML = d.skills.map(s => `
      <div class="skill-bar-item">
        <div class="skill-bar-header">
          <span>${esc(s.name)}</span><span class="skill-pct">${s.pct}%</span>
        </div>
        <div class="skill-bar-track">
          <div class="skill-bar-fill" data-width="${s.pct}"></div>
        </div>
      </div>`).join('');
  }

  /* ---- EXPERTISE CARDS ---- */
  const expertEl = el('expertiseGrid');
  if (expertEl) {
    expertEl.innerHTML = d.expertise.map((x, i) => `
      <div class="exp-card stagger-item" data-tilt>
        <div class="exp-card-glow"></div>
        <div class="exp-card-num">${String(i+1).padStart(2,'0')}</div>
        <div class="exp-card-icon"><i class="fas ${x.icon}" aria-hidden="true"></i></div>
        <h3>${esc(x.title)}</h3>
        <p>${esc(x.desc)}</p>
        <div class="exp-card-arrow"><i class="fas fa-arrow-right" aria-hidden="true"></i></div>
      </div>`).join('');
  }

  /* ---- TOOLS MARQUEE ---- */
  const marqueeEl = el('marqueeInner');
  if (marqueeEl) {
    const doubled = [...d.tools, ...d.tools];
    marqueeEl.innerHTML = doubled.map(t => `<span>${esc(t)}</span>`).join('');
  }

  /* ---- EXPERIENCE TIMELINE ---- */
  const expEl = el('experienceList');
  if (expEl) {
    expEl.innerHTML = d.experience.map(e => `
      <div class="tl-item stagger-item">
        <div class="tl-dot"><span></span></div>
        <div class="tl-date">${esc(e.period)}</div>
        <div class="tl-card">
          <div class="tl-card-header">
            <div>
              <h3>${esc(e.title)}</h3>
              <p class="tl-company">${esc(e.company)} &nbsp;&middot;&nbsp; ${esc(e.type)}</p>
            </div>
            ${e.current ? '<span class="tl-badge current">Current</span>' : ''}
          </div>
          <ul class="tl-list">
            ${e.bullets.map(b => `<li>${esc(b)}</li>`).join('')}
          </ul>
          <div class="tl-tags">${e.tags.map(t => `<span>${esc(t)}</span>`).join('')}</div>
        </div>
      </div>`).join('');
  }

  /* ---- EDUCATION TIMELINE ---- */
  const eduEl = el('educationList');
  if (eduEl) {
    eduEl.innerHTML = d.education.map(e => `
      <div class="tl-item stagger-item">
        <div class="tl-dot edu"><span></span></div>
        <div class="tl-date">${esc(e.period)}</div>
        <div class="tl-card edu-card">
          <div class="tl-card-header">
            <div>
              <h3>${esc(e.degree)}</h3>
              <p class="tl-company">${esc(e.school)}</p>
            </div>
            <span class="tl-badge edu">Education</span>
          </div>
          <p class="tl-edu-desc">${esc(e.desc)}</p>
        </div>
      </div>`).join('');
  }

  /* ---- PROJECTS ---- */
  const projEl = el('projectsGrid');
  if (projEl) {
    projEl.innerHTML = d.projects.map((pr, i) => `
      <div class="proj-card stagger-item" data-tilt>
        <div class="proj-num">${String(i+1).padStart(2,'0')}</div>
        <h3>${esc(pr.title)}</h3>
        <p class="proj-client"><i class="fas fa-building" aria-hidden="true"></i> ${esc(pr.client)}</p>
        <p class="proj-result">${esc(pr.result)}</p>
        <div class="proj-tags">${pr.tags.map(t => `<span>${esc(t)}</span>`).join('')}</div>
      </div>`).join('');
  }

  /* ---- ACHIEVEMENTS ---- */
  const achEl = el('achGrid');
  if (achEl) {
    achEl.innerHTML = d.achievements.map((a, i) => `
      <div class="ach-card stagger-item" data-tilt>
        <div class="ach-number">${String(i+1).padStart(2,'0')}</div>
        <i class="fas ${a.icon} ach-icon" aria-hidden="true"></i>
        <h3>${esc(a.title)}</h3>
        <p>${esc(a.desc)}</p>
      </div>`).join('');
  }

  /* ---- HELPERS ---- */
  function el(id) { return document.getElementById(id); }
  function setText(id, val) { const e = el(id); if (e) e.textContent = val; }
  function setLink(id, href, text) {
    const e = el(id);
    if (!e) return;
    e.href = href;
    if (text) e.textContent = text;
  }
  function esc(str) {
    return String(str)
      .replace(/&/g,'&amp;')
      .replace(/</g,'&lt;')
      .replace(/>/g,'&gt;')
      .replace(/"/g,'&quot;');
  }
})();
