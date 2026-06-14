/**
 * =====================================================
 *  PORTFOLIO DATA — Single source of truth
 *  Edit via admin.html or directly here
 * =====================================================
 */
const PORTFOLIO_DEFAULTS = {
  profile: {
    name:       'Islem Rais',
    role:       'Account Manager | Client Success & Revenue Growth',
    location:   'Algeria',
    email:      '',
    linkedin:   'https://www.linkedin.com/in/islem-rais',
    bio1:       "I help organizations strengthen client relationships, protect revenue, and uncover sustainable growth opportunities through structured account management.",
    bio2:       "My work combines clear communication, disciplined follow-up, and data-informed planning so clients feel supported and commercial teams stay aligned.",
    available:  true,
    badge1:     'Client Growth Focus',
    badge2:     'Relationship-Led Results'
  },
  stats: [
    { value: 5,  suffix: '+', label: 'Years Experience' },
    { value: 50, suffix: '+', label: 'Clients Managed'  },
    { value: 95, suffix: '%', label: 'Retention Rate'   },
    { value: 30, suffix: '%', label: 'Revenue Growth'   }
  ],
  skills: [
    { name: 'Client Relationship Management', pct: 96 },
    { name: 'Revenue Growth & Upselling',     pct: 88 },
    { name: 'Negotiation & Communication',    pct: 92 },
    { name: 'Strategic Account Planning',     pct: 85 }
  ],
  expertise: [
    { icon: 'fa-handshake',  title: 'Client Relationship Management', desc: 'Cultivating trust-based, long-term partnerships with key decision-makers across diverse industries.' },
    { icon: 'fa-chart-line', title: 'Revenue Growth & Upselling',     desc: 'Identifying expansion opportunities within existing accounts to grow revenue while delivering genuine value.' },
    { icon: 'fa-chess',      title: 'Strategic Account Planning',     desc: 'Developing tailored roadmaps that align client objectives with business outcomes for mutual success.' },
    { icon: 'fa-comments',   title: 'Negotiation & Stakeholder Mgmt', desc: 'Leading complex contract negotiations and managing multi-level relationships with confidence.' },
    { icon: 'fa-layer-group',title: 'Cross-functional Coordination',  desc: 'Bridging clients and internal teams to deliver seamless, high-quality experiences at every touchpoint.' },
    { icon: 'fa-chart-bar',  title: 'Analytics & Reporting',          desc: 'Leveraging CRM data and KPI dashboards to drive informed decisions and present compelling reviews.' }
  ],
  tools: ['Salesforce CRM','HubSpot','Microsoft 365','Google Workspace','Slack','Zoom','Trello','Jira','Power BI'],
  experience: [
    {
      period:  '2023 — Present',
      title:   'Account Management Lead',
      company: 'Confidential Portfolio',
      type:    'Full-time',
      current: true,
      bullets: [
        'Managed a multi-account portfolio with a focus on retention, expansion, and stakeholder satisfaction.',
        'Built account plans that connected client goals with measurable commercial priorities.',
        'Led business reviews, renewal conversations, and escalation follow-up with senior stakeholders.',
        'Improved client visibility through regular reporting, risk tracking, and proactive communication.'
      ],
      tags: ['Account Strategy','Client Retention','Stakeholder Management']
    },
    {
      period:  '2021 — 2023',
      title:   'Client Success & Growth Manager',
      company: 'Private Sector',
      type:    'Full-time',
      current: false,
      bullets: [
        'Onboarded and supported mid-market clients across multiple sectors.',
        'Identified renewal risks early and coordinated action plans with internal teams.',
        'Partnered with product, support, and sales teams to resolve client needs within agreed timelines.',
        'Prepared concise client updates, opportunity notes, and service improvement recommendations.'
      ],
      tags: ['Client Success','Account Growth','Cross-functional Delivery']
    },
    {
      period:  '2019 — 2021',
      title:   'Sales & Relationship Associate',
      company: 'Business Development Team',
      type:    'Full-time',
      current: false,
      bullets: [
        'Developed new business opportunities through outreach, qualification, and structured follow-up.',
        'Maintained CRM hygiene across pipeline stages, client notes, and opportunity tracking.',
        'Built a foundation in consultative communication, negotiation, and account handover.'
      ],
      tags: ['B2B Sales','Lead Generation','Pipeline Mgmt']
    }
  ],
  education: [
    {
      period: 'Academic Background',
      degree: "Business & Commerce Studies",
      school: 'Institution available on request',
      desc:   'Focused on business development, marketing strategy, communication, and client relationship management.'
    }
  ],
  achievements: [
    { icon: 'fa-trophy',      title: 'Commercial Discipline', desc: 'Built structured follow-up habits around renewals, client updates, and opportunity development.' },
    { icon: 'fa-shield-alt',  title: 'Retention Mindset',     desc: 'Focused on early risk detection, practical escalation handling, and consistent value delivery.' },
    { icon: 'fa-rocket',      title: 'Growth Orientation',    desc: 'Identified expansion opportunities by connecting client needs with relevant services and business outcomes.' },
    { icon: 'fa-certificate', title: 'CRM-Driven Reporting',  desc: 'Used CRM records, KPI views, and executive summaries to support cleaner account decisions.' }
  ],
  projects: [
    {
      title:  'Account Expansion Framework',
      client: 'Confidential client portfolio',
      result: 'Created a repeatable approach for mapping stakeholders, identifying growth opportunities, and tracking next steps.',
      tags:   ['Account Growth','Upselling','Strategy']
    },
    {
      title:  'Client Retention Operating Rhythm',
      client: 'Portfolio-wide initiative',
      result: 'Designed a practical check-in cadence to surface risks earlier and keep internal teams aligned on account health.',
      tags:   ['Retention','CRM','Process Design']
    },
    {
      title:  'Executive Business Review Format',
      client: 'Internal initiative',
      result: 'Refined business review materials to make priorities, outcomes, risks, and next actions easier to discuss.',
      tags:   ['QBR','Stakeholder Mgmt','Reporting']
    }
  ]
};

/**
 * Safe storage wrapper — works even when blocked by Edge Tracking
 * Prevention on file:// (uses in-memory fallback silently)
 */
function _makeStore(storageKey) {
  let _mem = {};
  let _native = null;

  // Try to access the native storage safely
  try {
    const s = storageKey === 'local' ? window.localStorage : window.sessionStorage;
    s.setItem('__probe__', '1');
    s.removeItem('__probe__');
    _native = s;
  } catch (e) {
    _native = null;
  }

  return {
    get: function (k) {
      if (_native) { try { return _native.getItem(k); } catch(e){} }
      return _mem[k] !== undefined ? _mem[k] : null;
    },
    set: function (k, v) {
      if (_native) { try { _native.setItem(k, v); return; } catch(e){} }
      _mem[k] = v;
    },
    del: function (k) {
      if (_native) { try { _native.removeItem(k); return; } catch(e){} }
      delete _mem[k];
    }
  };
}

const _store   = _makeStore('local');
const _session = _makeStore('session');

/**
 * Returns portfolio data: stored overrides or defaults.
 */
function getPortfolioData() {
  try {
    const saved = _store.get('portfolioData');
    if (saved) return JSON.parse(saved);
  } catch (e) { /* ignore parse errors */ }
  return JSON.parse(JSON.stringify(PORTFOLIO_DEFAULTS));
}

/**
 * Persists data to storage.
 */
function savePortfolioData(data) {
  _store.set('portfolioData', JSON.stringify(data));
}
