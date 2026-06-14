/* =====================================================
   ADMIN DASHBOARD - Islem Rais Portfolio
   ===================================================== */

/* ---- AUTH ---- */
function getPassword() {
  return _store.get('adminPassword');
}

function doLogin(e) {
  e.preventDefault();
  const pass = document.getElementById('loginPass').value;
  const savedPass = getPassword();

  if (!savedPass) {
    if (pass.length < 6) {
      showLoginError('Set a password with at least 6 characters.');
      return;
    }
    _store.set('adminPassword', pass);
    finishLogin();
    return;
  }

  if (pass === savedPass) {
    finishLogin();
  } else {
    showLoginError('Incorrect password. Please try again.');
  }
}

function finishLogin() {
  _session.set('adminAuth', '1');
  document.getElementById('loginScreen').style.display = 'none';
  document.getElementById('dashboard').style.display = 'flex';
  document.body.classList.remove('locked');
  loadAll();
}

function showLoginError(message) {
  const err = document.getElementById('loginError');
  err.textContent = message;
  document.getElementById('loginPass').value = '';
  setTimeout(() => { err.textContent = ''; }, 3000);
}

function doLogout() {
  _session.del('adminAuth');
  location.reload();
}

function togglePass() {
  const input = document.getElementById('loginPass');
  const icon  = document.getElementById('passEyeIcon');
  if (input.type === 'password') {
    input.type = 'text';
    icon.className = 'fas fa-eye-slash';
  } else {
    input.type = 'password';
    icon.className = 'fas fa-eye';
  }
}

// Auto-check session
window.addEventListener('DOMContentLoaded', () => {
  const note = document.getElementById('loginNote');
  if (note && !getPassword()) {
    note.textContent = 'First visit: enter a new password with 6+ characters.';
  }

  if (_session.get('adminAuth') === '1') {
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('dashboard').style.display = 'flex';
    document.body.classList.remove('locked');
    loadAll();
  }
});

/* ---- NAVIGATION ---- */
function switchTab(link, tab) {
  document.querySelectorAll('.sb-link').forEach(l => l.classList.remove('active'));
  document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
  link.classList.add('active');
  document.getElementById('tab-' + tab).classList.add('active');
  document.getElementById('topbarTitle').textContent = link.textContent.trim();
}

function toggleSidebar() {
  const sb   = document.getElementById('sidebar');
  const main = document.querySelector('.main-content');
  sb.classList.toggle('collapsed');
  sb.classList.toggle('open');
  main.classList.toggle('expanded');
}

/* ---- TOAST ---- */
function showToast(msg, type = 'success') {
  const t = document.getElementById('toast');
  t.textContent = (type === 'success' ? 'Saved: ' : 'Error: ') + msg;
  t.className = 'toast show' + (type === 'error' ? ' error' : '');
  clearTimeout(t._timer);
  t._timer = setTimeout(() => { t.classList.remove('show'); }, 3000);
}

/* ---- LOAD ALL ---- */
let D; // working copy of portfolio data

function loadAll() {
  D = getPortfolioData();
  loadProfile();
  loadStats();
  loadSkills();
  loadExpertise();
  loadTools();
  loadExperience();
  loadEducation();
  loadProjects();
  loadAchievements();
}

/* ---- SAVE ALL ---- */
function saveAll() {
  collectProfile();
  collectStats();
  collectSkills();
  collectExpertise();
  collectTools();
  collectExperience();
  collectEducation();
  collectProjects();
  collectAchievements();
  savePortfolioData(D);
  showToast('Changes saved in this browser. Refresh the portfolio to preview.');
}

function confirmReset() {
  if (confirm('Reset ALL content to defaults? This cannot be undone.')) {
    _store.del('portfolioData');
    D = getPortfolioData();
    loadAll();
    showToast('Content reset to defaults.');
  }
}

/* =====================================================
   PROFILE
   ===================================================== */
function loadProfile() {
  const p = D.profile;
  val('p-name',      p.name);
  val('p-role',      p.role);
  val('p-location',  p.location);
  val('p-email',     p.email);
  val('p-linkedin',  p.linkedin);
  val('p-bio1',      p.bio1);
  val('p-bio2',      p.bio2);
  val('p-badge1',    p.badge1);
  val('p-badge2',    p.badge2);
  document.getElementById('p-available').checked = !!p.available;
}

function collectProfile() {
  D.profile = {
    name:      gv('p-name'),
    role:      gv('p-role'),
    location:  gv('p-location'),
    email:     gv('p-email'),
    linkedin:  gv('p-linkedin'),
    bio1:      gv('p-bio1'),
    bio2:      gv('p-bio2'),
    badge1:    gv('p-badge1'),
    badge2:    gv('p-badge2'),
    available: document.getElementById('p-available').checked
  };
}

/* =====================================================
   STATS
   ===================================================== */
function loadStats() {
  renderCards('statsEditor', D.stats, statCard);
}

function statCard(s, i) {
  const div = document.createElement('div');
  div.className = 'item-card';
  div.dataset.idx = i;
  div.innerHTML = `
    <div class="item-card-header">
      <span>Stat #${i+1}</span>
      <div class="item-actions">
        <button class="btn-up"  onclick="moveItem('stats',${i},-1)" title="Move up"><i class="fas fa-chevron-up"></i></button>
        <button class="btn-dn"  onclick="moveItem('stats',${i}, 1)" title="Move down"><i class="fas fa-chevron-down"></i></button>
        <button class="btn-del" onclick="delItem('stats',${i})"     title="Delete"><i class="fas fa-trash"></i></button>
      </div>
    </div>
    <div class="form-grid">
      <div class="form-group"><label>Value (number)</label><input type="number" class="s-value" value="${s.value}" min="0"/></div>
      <div class="form-group"><label>Suffix (e.g. + or %)</label><input type="text" class="s-suffix" value="${esc(s.suffix)}" maxlength="4"/></div>
      <div class="form-group span-2"><label>Label</label><input type="text" class="s-label" value="${esc(s.label)}"/></div>
    </div>`;
  return div;
}

function addStat() {
  D.stats.push({ value: 0, suffix: '+', label: 'New Stat' });
  loadStats();
}

function collectStats() {
  D.stats = Array.from(document.querySelectorAll('#statsEditor .item-card')).map(c => ({
    value:  +c.querySelector('.s-value').value,
    suffix: c.querySelector('.s-suffix').value,
    label:  c.querySelector('.s-label').value
  }));
}

/* =====================================================
   SKILLS
   ===================================================== */
function loadSkills() {
  renderCards('skillsEditor', D.skills, skillCard);
}

function skillCard(s, i) {
  const div = document.createElement('div');
  div.className = 'item-card';
  div.innerHTML = `
    <div class="item-card-header">
      <span>Skill #${i+1}</span>
      <div class="item-actions">
        <button class="btn-up"  onclick="moveItem('skills',${i},-1)"><i class="fas fa-chevron-up"></i></button>
        <button class="btn-dn"  onclick="moveItem('skills',${i}, 1)"><i class="fas fa-chevron-down"></i></button>
        <button class="btn-del" onclick="delItem('skills',${i})"><i class="fas fa-trash"></i></button>
      </div>
    </div>
    <div class="form-grid">
      <div class="form-group span-2"><label>Skill Name</label><input type="text" class="sk-name" value="${esc(s.name)}"/></div>
      <div class="form-group span-2">
        <label>Proficiency: <span class="range-val" id="rv-${i}">${s.pct}%</span></label>
        <div class="range-wrap">
          <input type="range" class="sk-pct" min="1" max="100" value="${s.pct}"
            oninput="document.getElementById('rv-${i}').textContent=this.value+'%'"/>
        </div>
      </div>
    </div>`;
  return div;
}

function addSkill() {
  D.skills.push({ name: 'New Skill', pct: 75 });
  loadSkills();
}

function collectSkills() {
  D.skills = Array.from(document.querySelectorAll('#skillsEditor .item-card')).map(c => ({
    name: c.querySelector('.sk-name').value,
    pct:  +c.querySelector('.sk-pct').value
  }));
}

/* =====================================================
   EXPERTISE
   ===================================================== */
const FA_ICONS = [
  'fa-handshake','fa-chart-line','fa-chess','fa-comments','fa-layer-group',
  'fa-chart-bar','fa-users','fa-briefcase','fa-star','fa-rocket','fa-bullseye',
  'fa-lightbulb','fa-cogs','fa-globe','fa-phone','fa-envelope'
];

function loadExpertise() {
  renderCards('expertiseEditor', D.expertise, expertCard);
}

function expertCard(x, i) {
  const div = document.createElement('div');
  div.className = 'item-card';
  div.innerHTML = `
    <div class="item-card-header">
      <span>Card #${i+1}</span>
      <div class="item-actions">
        <button class="btn-up"  onclick="moveItem('expertise',${i},-1)"><i class="fas fa-chevron-up"></i></button>
        <button class="btn-dn"  onclick="moveItem('expertise',${i}, 1)"><i class="fas fa-chevron-down"></i></button>
        <button class="btn-del" onclick="delItem('expertise',${i})"><i class="fas fa-trash"></i></button>
      </div>
    </div>
    <div class="form-grid">
      <div class="form-group">
        <label>Icon (Font Awesome class)</label>
        <select class="x-icon">${FA_ICONS.map(ic=>`<option value="${ic}" ${ic===x.icon?'selected':''}>${ic}</option>`).join('')}</select>
      </div>
      <div class="form-group"><label>Title</label><input type="text" class="x-title" value="${esc(x.title)}"/></div>
      <div class="form-group span-2"><label>Description</label><textarea class="x-desc" rows="2">${esc(x.desc)}</textarea></div>
    </div>`;
  return div;
}

function addExpertise() {
  D.expertise.push({ icon: 'fa-star', title: 'New Skill', desc: 'Description here.' });
  loadExpertise();
}

function collectExpertise() {
  D.expertise = Array.from(document.querySelectorAll('#expertiseEditor .item-card')).map(c => ({
    icon:  c.querySelector('.x-icon').value,
    title: c.querySelector('.x-title').value,
    desc:  c.querySelector('.x-desc').value
  }));
}

/* =====================================================
   TOOLS
   ===================================================== */
function loadTools() {
  const c = document.getElementById('toolsEditor');
  const fragment = document.createDocumentFragment();
  D.tools.forEach((t, i) => {
    const div = document.createElement('div');
    div.className = 'item-card';
    div.innerHTML = `
      <div class="item-card-header">
        <span>Tool #${i+1}</span>
        <div class="item-actions">
          <button class="btn-up"  onclick="moveItem('tools',${i},-1)"><i class="fas fa-chevron-up"></i></button>
          <button class="btn-dn"  onclick="moveItem('tools',${i}, 1)"><i class="fas fa-chevron-down"></i></button>
          <button class="btn-del" onclick="delItem('tools',${i})"><i class="fas fa-trash"></i></button>
        </div>
      </div>
      <div class="form-group"><label>Tool Name</label><input type="text" class="t-name" value="${esc(t)}"/></div>`;
    fragment.appendChild(div);
  });
  c.replaceChildren(fragment);
}

function addTool() {
  D.tools.push('New Tool');
  loadTools();
}

function collectTools() {
  D.tools = Array.from(document.querySelectorAll('#toolsEditor .t-name')).map(i => i.value);
}

/* =====================================================
   EXPERIENCE
   ===================================================== */
function loadExperience() {
  renderCards('expEditor', D.experience, expCard);
}

function expCard(e, i) {
  const div = document.createElement('div');
  div.className = 'item-card';
  div.innerHTML = `
    <div class="item-card-header">
      <span>${esc(e.title) || 'Position #' + (i+1)}</span>
      <div class="item-actions">
        <button class="btn-up"  onclick="moveItem('experience',${i},-1)"><i class="fas fa-chevron-up"></i></button>
        <button class="btn-dn"  onclick="moveItem('experience',${i}, 1)"><i class="fas fa-chevron-down"></i></button>
        <button class="btn-del" onclick="delItem('experience',${i})"><i class="fas fa-trash"></i></button>
      </div>
    </div>
    <div class="form-grid">
      <div class="form-group"><label>Job Title</label><input type="text" class="e-title" value="${esc(e.title)}"/></div>
      <div class="form-group"><label>Company</label><input type="text" class="e-company" value="${esc(e.company)}"/></div>
      <div class="form-group"><label>Period (e.g. 2021 - 2023)</label><input type="text" class="e-period" value="${esc(e.period)}"/></div>
      <div class="form-group"><label>Type (e.g. Full-time)</label><input type="text" class="e-type" value="${esc(e.type)}"/></div>
      <div class="form-group span-2">
        <label class="toggle-label">
          <input type="checkbox" class="e-current" ${e.current?'checked':''}/>
          <span>Mark as current position</span>
        </label>
      </div>
      <div class="form-group span-2">
        <label>Bullet Points (one per line)</label>
        <textarea class="e-bullets" rows="4">${e.bullets.map(esc).join('\n')}</textarea>
      </div>
      <div class="form-group span-2">
        <label>Tags (comma-separated)</label>
        <input type="text" class="e-tags" value="${e.tags.map(esc).join(', ')}"/>
      </div>
    </div>`;
  return div;
}

function addExp() {
  D.experience.push({ period: '', title: 'New Position', company: '', type: 'Full-time', current: false, bullets: [], tags: [] });
  loadExperience();
}

function collectExperience() {
  D.experience = Array.from(document.querySelectorAll('#expEditor .item-card')).map(c => ({
    period:  c.querySelector('.e-period').value,
    title:   c.querySelector('.e-title').value,
    company: c.querySelector('.e-company').value,
    type:    c.querySelector('.e-type').value,
    current: c.querySelector('.e-current').checked,
    bullets: c.querySelector('.e-bullets').value.split('\n').map(s=>s.trim()).filter(Boolean),
    tags:    c.querySelector('.e-tags').value.split(',').map(s=>s.trim()).filter(Boolean)
  }));
}

/* =====================================================
   EDUCATION
   ===================================================== */
function loadEducation() {
  renderCards('eduEditor', D.education, eduCard);
}

function eduCard(e, i) {
  const div = document.createElement('div');
  div.className = 'item-card';
  div.innerHTML = `
    <div class="item-card-header">
      <span>${esc(e.degree) || 'Degree #' + (i+1)}</span>
      <div class="item-actions">
        <button class="btn-up"  onclick="moveItem('education',${i},-1)"><i class="fas fa-chevron-up"></i></button>
        <button class="btn-dn"  onclick="moveItem('education',${i}, 1)"><i class="fas fa-chevron-down"></i></button>
        <button class="btn-del" onclick="delItem('education',${i})"><i class="fas fa-trash"></i></button>
      </div>
    </div>
    <div class="form-grid">
      <div class="form-group span-2"><label>Degree / Qualification</label><input type="text" class="ed-degree" value="${esc(e.degree)}"/></div>
      <div class="form-group"><label>School / University</label><input type="text" class="ed-school" value="${esc(e.school)}"/></div>
      <div class="form-group"><label>Period</label><input type="text" class="ed-period" value="${esc(e.period)}"/></div>
      <div class="form-group span-2"><label>Description</label><textarea class="ed-desc" rows="2">${esc(e.desc)}</textarea></div>
    </div>`;
  return div;
}

function addEdu() {
  D.education.push({ period: '', degree: 'New Degree', school: '', desc: '' });
  loadEducation();
}

function collectEducation() {
  D.education = Array.from(document.querySelectorAll('#eduEditor .item-card')).map(c => ({
    degree: c.querySelector('.ed-degree').value,
    school: c.querySelector('.ed-school').value,
    period: c.querySelector('.ed-period').value,
    desc:   c.querySelector('.ed-desc').value
  }));
}

/* =====================================================
   PROJECTS
   ===================================================== */
function loadProjects() {
  renderCards('projEditor', D.projects, projCard);
}

function projCard(p, i) {
  const div = document.createElement('div');
  div.className = 'item-card';
  div.innerHTML = `
    <div class="item-card-header">
      <span>${esc(p.title) || 'Project #' + (i+1)}</span>
      <div class="item-actions">
        <button class="btn-up"  onclick="moveItem('projects',${i},-1)"><i class="fas fa-chevron-up"></i></button>
        <button class="btn-dn"  onclick="moveItem('projects',${i}, 1)"><i class="fas fa-chevron-down"></i></button>
        <button class="btn-del" onclick="delItem('projects',${i})"><i class="fas fa-trash"></i></button>
      </div>
    </div>
    <div class="form-grid">
      <div class="form-group"><label>Project Title</label><input type="text" class="pr-title" value="${esc(p.title)}"/></div>
      <div class="form-group"><label>Client / Context</label><input type="text" class="pr-client" value="${esc(p.client)}"/></div>
      <div class="form-group span-2"><label>Result / Description</label><textarea class="pr-result" rows="2">${esc(p.result)}</textarea></div>
      <div class="form-group span-2"><label>Tags (comma-separated)</label><input type="text" class="pr-tags" value="${p.tags.map(esc).join(', ')}"/></div>
    </div>`;
  return div;
}

function addProj() {
  D.projects.push({ title: 'New Project', client: '', result: '', tags: [] });
  loadProjects();
}

function collectProjects() {
  D.projects = Array.from(document.querySelectorAll('#projEditor .item-card')).map(c => ({
    title:  c.querySelector('.pr-title').value,
    client: c.querySelector('.pr-client').value,
    result: c.querySelector('.pr-result').value,
    tags:   c.querySelector('.pr-tags').value.split(',').map(s=>s.trim()).filter(Boolean)
  }));
}

/* =====================================================
   ACHIEVEMENTS
   ===================================================== */
function loadAchievements() {
  renderCards('achEditor', D.achievements, achCard);
}

function achCard(a, i) {
  const div = document.createElement('div');
  div.className = 'item-card';
  div.innerHTML = `
    <div class="item-card-header">
      <span>${esc(a.title) || 'Achievement #' + (i+1)}</span>
      <div class="item-actions">
        <button class="btn-up"  onclick="moveItem('achievements',${i},-1)"><i class="fas fa-chevron-up"></i></button>
        <button class="btn-dn"  onclick="moveItem('achievements',${i}, 1)"><i class="fas fa-chevron-down"></i></button>
        <button class="btn-del" onclick="delItem('achievements',${i})"><i class="fas fa-trash"></i></button>
      </div>
    </div>
    <div class="form-grid">
      <div class="form-group">
        <label>Icon (Font Awesome class)</label>
        <select class="ac-icon">${FA_ICONS.map(ic=>`<option value="${ic}" ${ic===a.icon?'selected':''}>${ic}</option>`).join('')}</select>
      </div>
      <div class="form-group"><label>Title</label><input type="text" class="ac-title" value="${esc(a.title)}"/></div>
      <div class="form-group span-2"><label>Description</label><textarea class="ac-desc" rows="2">${esc(a.desc)}</textarea></div>
    </div>`;
  return div;
}

function addAch() {
  D.achievements.push({ icon: 'fa-trophy', title: 'New Achievement', desc: '' });
  loadAchievements();
}

function collectAchievements() {
  D.achievements = Array.from(document.querySelectorAll('#achEditor .item-card')).map(c => ({
    icon:  c.querySelector('.ac-icon').value,
    title: c.querySelector('.ac-title').value,
    desc:  c.querySelector('.ac-desc').value
  }));
}

/* =====================================================
   PASSWORD CHANGE
   ===================================================== */
function changePassword() {
  const current = document.getElementById('pw-current').value;
  const next    = document.getElementById('pw-new').value;
  const confirm = document.getElementById('pw-confirm').value;

  if (current !== getPassword()) { showToast('Current password is incorrect.', 'error'); return; }
  if (next.length < 6)           { showToast('New password must be at least 6 characters.', 'error'); return; }
  if (next !== confirm)          { showToast('Passwords do not match.', 'error'); return; }

  _store.set('adminPassword', next);
  document.getElementById('pw-current').value = '';
  document.getElementById('pw-new').value     = '';
  document.getElementById('pw-confirm').value = '';
  showToast('Password updated successfully!');
}

/* =====================================================
   SHARED HELPERS
   ===================================================== */
function moveItem(key, i, dir) {
  const arr = D[key];
  const ni  = i + dir;
  if (ni < 0 || ni >= arr.length) return;
  [arr[i], arr[ni]] = [arr[ni], arr[i]];
  loadSection(key);
}

function delItem(key, i) {
  if (!confirm('Delete this item?')) return;
  D[key].splice(i, 1);
  loadSection(key);
}

function loadSection(key) {
  const map = {
    stats: loadStats, skills: loadSkills, expertise: loadExpertise,
    tools: loadTools, experience: loadExperience, education: loadEducation,
    projects: loadProjects, achievements: loadAchievements
  };
  if (map[key]) map[key]();
}

function renderCards(containerId, items, factory) {
  const container = document.getElementById(containerId);
  if (!container) return;
  const fragment = document.createDocumentFragment();
  items.forEach((item, index) => fragment.appendChild(factory(item, index)));
  container.replaceChildren(fragment);
}

function val(id, v) { const e = document.getElementById(id); if (e) e.value = v || ''; }
function gv(id)     { const e = document.getElementById(id); return e ? e.value.trim() : ''; }
function esc(str)   { return String(str || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
