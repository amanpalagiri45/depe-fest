/* ---- AIMEX 2026 DEPARTMENT FEST SCRIPT ---- */

const CONFIG = {
  college: 'MITS Deemed to be University (MITS)',
  dept: 'Department of Artificial Intelligence and Machine Learning',
  fest: 'AIMEX 2026',
  upiId: 'deptfest@upi',
  payee: 'AIMEX 2026 Dept Fest',
  festDate: '2026-10-30T09:00:00'
};

const EVENTS = [
  {
    id: 'codestorm',
    name: 'CodeStorm',
    tag: 'Competitive coding',
    category: 'coding',
    desc: 'Three hours, eight algorithmic problems, one live leaderboard. Solo or in pairs. Battle against the best coders on campus.',
    date: '2026-10-30T11:30',
    venue: 'Lab 2',
    fee: 50,
    min: 1,
    max: 2,
    c: '#2B3AE7',
    on: '#ffffff',
    slotsLeft: 6,
    prizes: [
      { place: '1st Prize', amount: '₹5,000', rank: 'gold' },
      { place: '2nd Prize', amount: '₹3,000', rank: 'silver' },
      { place: '3rd Prize', amount: '₹1,500', rank: 'bronze' }
    ],
    rules: [
      'Solo or pairs (max 2 members).',
      'Supported languages: C, C++, Java, and Python.',
      'Plagiarism or external assistance leads to immediate disqualification.',
      'Tie-breakers will be resolved based on submission time and penalty points.'
    ],
    coordinators: [
      { name: 'Arjun Sharma', role: 'Student Lead', phone: '+91 98765 43210' },
      { name: 'Pooja Reddy', role: 'Technical Head', phone: '+91 98765 43211' }
    ],
    extra: {
      id: 'lang',
      label: 'Preferred programming language',
      type: 'select',
      opts: ['C++', 'Java', 'Python', 'C', 'Any']
    }
  },
  {
    id: 'hackship',
    name: 'Hack and Ship',
    tag: 'Mini hackathon',
    category: 'coding',
    desc: 'Build a working web/mobile or AI prototype in four hours around a surprise theme revealed at kickoff. Pitch live to judges.',
    date: '2026-10-30T09:30',
    venue: 'Seminar Hall',
    fee: 50,
    min: 2,
    max: 4,
    c: '#F2545B',
    on: '#ffffff',
    slotsLeft: 4,
    prizes: [
      { place: '1st Prize', amount: '₹8,000', rank: 'gold' },
      { place: '2nd Prize', amount: '₹4,500', rank: 'silver' },
      { place: '3rd Prize', amount: '₹2,500', rank: 'bronze' }
    ],
    rules: [
      'Teams must consist of 2 to 4 participants.',
      'Theme will be announced 15 minutes before official kickoff.',
      'Pre-written core boilerplates allowed, but business logic must be built during the hackathon.',
      'Judging criteria: Innovation (30%), Technical Execution (40%), and Pitch/Demo (30%).'
    ],
    coordinators: [
      { name: 'Siddharth Rao', role: 'Hackathon Lead', phone: '+91 98765 43212' },
      { name: 'Neha Varma', role: 'Event Coordinator', phone: '+91 98765 43213' }
    ],
    extra: {
      id: 'idea',
      label: 'Tech stack or preliminary idea (optional)',
      type: 'text',
      optional: true
    }
  },
  {
    id: 'quiz',
    name: 'Byte Me Tech Quiz',
    tag: 'Tech Trivia',
    category: 'quiz',
    desc: 'Buzzers, rapid-fire rounds, audio-visual mysteries, and tech trivia that tests your knowledge of AI, computing history, and pop culture.',
    date: '2026-10-30T10:30',
    venue: 'Seminar Hall',
    fee: 50,
    min: 2,
    max: 3,
    c: '#E5A912',
    on: '#10132B',
    slotsLeft: 12,
    prizes: [
      { place: '1st Prize', amount: '₹3,000', rank: 'gold' },
      { place: '2nd Prize', amount: '₹2,000', rank: 'silver' },
      { place: '3rd Prize', amount: '₹1,000', rank: 'bronze' }
    ],
    rules: [
      'Teams of 2 or 3 students.',
      'Preliminary pen-and-paper round to shortlist the top 6 teams for the stage finals.',
      'No smartphones or smartwatches allowed during quiz rounds.',
      'Quizmaster decision is final and binding.'
    ],
    coordinators: [
      { name: 'Kavya Nair', role: 'Quizmaster', phone: '+91 98765 43214' },
      { name: 'Vikram Joshi', role: 'Event Coordinator', phone: '+91 98765 43215' }
    ],
    extra: {
      id: 'team',
      label: 'Team Name',
      type: 'text'
    }
  },
  {
    id: 'pixel',
    name: 'Pixel Clash',
    tag: 'Esports Championship',
    category: 'esports',
    desc: 'High-octane 5v5 knockout tournament on high-spec lab PCs. Bring your A-game, team synergy, and competitive spirit.',
    date: '2026-10-30T12:30',
    venue: 'Gaming Lab',
    fee: 50,
    min: 4,
    max: 5,
    c: '#0FA3B1',
    on: '#ffffff',
    slotsLeft: 3,
    prizes: [
      { place: '1st Prize', amount: '₹6,000', rank: 'gold' },
      { place: '2nd Prize', amount: '₹3,500', rank: 'silver' },
      { place: '3rd Prize', amount: '₹1,500', rank: 'bronze' }
    ],
    rules: [
      'Teams must consist of 4 or 5 players.',
      'Single-elimination knockout format with Best-of-3 Finals.',
      'Bring your own mice, mousepads, and 3.5mm/USB headsets.',
      'Toxicity, foul language, or unsportsmanlike behavior results in immediate forfeit.'
    ],
    coordinators: [
      { name: 'Rohan Mehra', role: 'Esports Marshal', phone: '+91 98765 43216' },
      { name: 'Sameer Khan', role: 'Lab Technical Lead', phone: '+91 98765 43217' }
    ],
    extra: {
      id: 'ign',
      label: "Team Captain's In-Game Tag (IGN)",
      type: 'text'
    }
  },
  {
    id: 'design',
    name: 'Design Sprint',
    tag: 'UI/UX Design',
    category: 'uiux',
    desc: 'Redesign a real broken campus mobile or web app screen in 90 minutes. Present your visual hierarchy, user flow, and design rationale to judges.',
    date: '2026-10-30T15:00',
    venue: 'Lab 3',
    fee: 50,
    min: 1,
    max: 1,
    c: '#7A4DFF',
    on: '#ffffff',
    slotsLeft: 9,
    prizes: [
      { place: '1st Prize', amount: '₹4,000', rank: 'gold' },
      { place: '2nd Prize', amount: '₹2,500', rank: 'silver' },
      { place: '3rd Prize', amount: '₹1,000', rank: 'bronze' }
    ],
    rules: [
      'Solo participation only.',
      'Time limit: 90 minutes for designing + 3 minutes for pitch.',
      'Any UI tool (Figma, Adobe XD, Penpot) or high-fidelity hand sketch is permitted.',
      'Evaluated on Usability, Aesthetics, Accessibility, and Design Rationale.'
    ],
    coordinators: [
      { name: 'Ananya Deshmukh', role: 'Design Lead', phone: '+91 98765 43218' },
      { name: 'Manish Gupta', role: 'Event Coordinator', phone: '+91 98765 43219' }
    ],
    extra: {
      id: 'tool',
      label: 'Primary design tool you will use',
      type: 'select',
      opts: ['Figma', 'Adobe XD', 'Penpot', 'Sketch', 'Other']
    }
  },
  {
    id: 'debate',
    name: 'Campus Debate Clash',
    tag: 'Public Speaking',
    category: 'nontech',
    desc: 'A high-energy speaking challenge where teams argue, rebut, and persuade with clarity, confidence, and composure.',
    date: '2026-10-30T09:00',
    venue: 'Auditorium',
    fee: 50,
    min: 2,
    max: 3,
    c: '#FF6B6B',
    on: '#ffffff',
    slotsLeft: 10,
    prizes: [
      { place: '1st Prize', amount: '₹3,000', rank: 'gold' },
      { place: '2nd Prize', amount: '₹2,000', rank: 'silver' },
      { place: '3rd Prize', amount: '₹1,000', rank: 'bronze' }
    ],
    rules: [
      'Teams of 2 to 3 members.',
      'Participants must speak in a formal, respectful manner.',
      'Judges may interrupt for rebuttal round and cross-questioning.',
      'The topic will be announced 15 minutes before the round.'
    ],
    coordinators: [
      { name: 'Aditi Nair', role: 'Debate Mentor', phone: '+91 98765 43220' },
      { name: 'Kabir Iyer', role: 'Event Coordinator', phone: '+91 98765 43221' }
    ],
    extra: {
      id: 'topic',
      label: 'Preferred debate style',
      type: 'select',
      opts: ['Parliamentary', 'Turncoat', 'Extempore', 'Open House']
    }
  },
  {
    id: 'dance',
    name: 'Groove Arena',
    tag: 'Dance Battle',
    category: 'nontech',
    desc: 'Showcase your rhythm, stage presence, and creative choreography in an electrifying dance battle.',
    date: '2026-10-30T11:00',
    venue: 'Open Stage',
    fee: 50,
    min: 2,
    max: 6,
    c: '#FF9F43',
    on: '#ffffff',
    slotsLeft: 8,
    prizes: [
      { place: '1st Prize', amount: '₹4,500', rank: 'gold' },
      { place: '2nd Prize', amount: '₹2,500', rank: 'silver' },
      { place: '3rd Prize', amount: '₹1,500', rank: 'bronze' }
    ],
    rules: [
      'Groups of 2 to 6 members only.',
      'Music can be instrumental or song-based with a clear track cue.',
      'No dangerous stunts, fire, or props that can harm performers.',
      'Judging is based on choreography, confidence, and energy.'
    ],
    coordinators: [
      { name: 'Rhea Kapoor', role: 'Dance Captain', phone: '+91 98765 43222' },
      { name: 'Nikhil Joshi', role: 'Stage Lead', phone: '+91 98765 43223' }
    ],
    extra: {
      id: 'danceStyle',
      label: 'Dance style you will perform',
      type: 'select',
      opts: ['Hip-Hop', 'Bollywood', 'Contemporary', 'Fusion', 'Classical']
    }
  },
  {
    id: 'sing',
    name: 'Melody Quest',
    tag: 'Music & Singing',
    category: 'nontech',
    desc: 'From soulful vocals to energetic performances, bring your melody and sing your way to the spotlight.',
    date: '2026-10-30T12:30',
    venue: 'Main Stage',
    fee: 50,
    min: 1,
    max: 2,
    c: '#3ECF8E',
    on: '#ffffff',
    slotsLeft: 12,
    prizes: [
      { place: '1st Prize', amount: '₹3,500', rank: 'gold' },
      { place: '2nd Prize', amount: '₹2,000', rank: 'silver' },
      { place: '3rd Prize', amount: '₹1,250', rank: 'bronze' }
    ],
    rules: [
      'Solo or duo participation.',
      'Song duration should not exceed 3 minutes.',
      'Backing tracks or karaoke allowed with prior check-in.',
      'Original or cover songs are both permitted.'
    ],
    coordinators: [
      { name: 'Sanjana Pillai', role: 'Music Lead', phone: '+91 98765 43224' },
      { name: 'Yash Verma', role: 'Audio Coordinator', phone: '+91 98765 43225' }
    ],
    extra: {
      id: 'genre',
      label: 'Preferred music genre',
      type: 'select',
      opts: ['Classical', 'Bollywood', 'Rock', 'Indie', 'Western Pop']
    }
  },
  {
    id: 'art',
    name: 'Canvas Canvas',
    tag: 'Art & Craft',
    category: 'nontech',
    desc: 'Transform blank surfaces into vibrant expressions with your imagination, colours, and creative craft skills.',
    date: '2026-10-30T10:00',
    venue: 'Creative Studio',
    fee: 50,
    min: 1,
    max: 2,
    c: '#7C3AED',
    on: '#ffffff',
    slotsLeft: 14,
    prizes: [
      { place: '1st Prize', amount: '₹2,500', rank: 'gold' },
      { place: '2nd Prize', amount: '₹1,500', rank: 'silver' },
      { place: '3rd Prize', amount: '₹1,000', rank: 'bronze' }
    ],
    rules: [
      'Individual or pair participation.',
      'Bring your own materials or use provided craft essentials.',
      'Original ideas and neat finish are encouraged.',
      'Judging focuses on creativity, design, and presentation.'
    ],
    coordinators: [
      { name: 'Devika Rao', role: 'Art Mentor', phone: '+91 98765 43228' },
      { name: 'Vivek Nanda', role: 'Craft Coordinator', phone: '+91 98765 43229' }
    ],
    extra: {
      id: 'medium',
      label: 'Art medium you prefer',
      type: 'select',
      opts: ['Acrylic', 'Watercolor', 'Sketch', 'Mixed Media', 'Craft Paper']
    }
  },
  {
    id: 'photography',
    name: 'Frame Story',
    tag: 'Photography',
    category: 'nontech',
    desc: 'Capture compelling campus stories through a lens and show the world how moments become memories.',
    date: '2026-10-30T15:30',
    venue: 'Campus Trails',
    fee: 50,
    min: 1,
    max: 1,
    c: '#38BDF8',
    on: '#ffffff',
    slotsLeft: 9,
    prizes: [
      { place: '1st Prize', amount: '₹3,000', rank: 'gold' },
      { place: '2nd Prize', amount: '₹2,000', rank: 'silver' },
      { place: '3rd Prize', amount: '₹1,000', rank: 'bronze' }
    ],
    rules: [
      'Solo participation only.',
      'Submit 3 best shots on the theme announced at the venue.',
      'Editing is allowed but should remain natural and honest.',
      'Judging focuses on composition, story, and creativity.'
    ],
    coordinators: [
      { name: 'Ishita Sen', role: 'Photography Lead', phone: '+91 98765 43230' },
      { name: 'Aditya Menon', role: 'Media Coordinator', phone: '+91 98765 43231' }
    ],
    extra: {
      id: 'camera',
      label: 'Camera/device you will use',
      type: 'select',
      opts: ['DSLR', 'Mirrorless', 'Phone Camera', 'Action Camera', 'Other']
    }
  },
  {
    id: 'treasure',
    name: 'Treasure Trail',
    tag: 'Campus Adventure',
    category: 'nontech',
    desc: 'Follow clues, solve riddles, and race through the campus in a creative scavenger hunt filled with fun.',
    date: '2026-10-30T13:00',
    venue: 'Campus Grounds',
    fee: 50,
    min: 2,
    max: 4,
    c: '#F59E0B',
    on: '#ffffff',
    slotsLeft: 6,
    prizes: [
      { place: '1st Prize', amount: '₹4,000', rank: 'gold' },
      { place: '2nd Prize', amount: '₹2,500', rank: 'silver' },
      { place: '3rd Prize', amount: '₹1,500', rank: 'bronze' }
    ],
    rules: [
      'Teams of 2 to 4 members.',
      'All clues must be solved within the given time window.',
      'Respect all campus spaces and avoid disturbing classes.',
      'Team coordination and speed will influence final ranking.'
    ],
    coordinators: [
      { name: 'Tanya Roy', role: 'Adventure Lead', phone: '+91 98765 43232' },
      { name: 'Pranav Shah', role: 'Campus Guide', phone: '+91 98765 43233' }
    ],
    extra: {
      id: 'teamName',
      label: 'Team name',
      type: 'text'
    }
  }
];

const DEPTS = [
  'Artificial Intelligence and Machine Learning',
  'Computer Science and Engineering',
  'Data Science',
  'Information Technology',
  'Electronics and Communication',
  'Electrical and Electronics',
  'Mechanical Engineering',
  'Civil Engineering',
  'Other'
];

const YEARS = ['1st year', '2nd year', '3rd year', '4th year'];

/* ---- Helpers ---- */
const $ = s => document.querySelector(s);
const $$ = s => document.querySelectorAll(s);

const esc = s =>
  String(s || '').replace(/[&<>"']/g, c => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }[c]));

let mem = [];
const store = {
  get() {
    try {
      const v = JSON.parse(localStorage.getItem('aimex') || localStorage.getItem('amix') || '[]');
      mem = v;
      return v;
    } catch (e) {
      return mem;
    }
  },
  set(a) {
    mem = a;
    try {
      localStorage.setItem('aimex', JSON.stringify(a));
    } catch (e) {}
  }
};

const ev = id => EVENTS.find(e => e.id === id);

const fmtD = d =>
  new Date(d).toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  });

const fmtT = d =>
  new Date(d).toLocaleTimeString('en-IN', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });

const unit = e => (e.max > 1 ? 'per team' : 'per person');

const teamTxt = e =>
  e.max === 1
    ? 'Solo'
    : e.min === 1
    ? `Solo or up to ${e.max} members`
    : `${e.min}–${e.max} members`;

/* ---- Toast Notification ---- */
function showToast(message, icon = '✓') {
  const box = $('#toastBox');
  if (!box) return;
  const t = document.createElement('div');
  t.className = 'toast';
  t.innerHTML = `<span>${icon}</span> <span>${esc(message)}</span>`;
  box.appendChild(t);
  setTimeout(() => {
    t.style.opacity = '0';
    t.style.transform = 'translateY(10px)';
    setTimeout(() => t.remove(), 300);
  }, 3200);
}

/* ---- Theme Toggle ---- */
function initTheme() {
  const saved = localStorage.getItem('aimex_theme') || localStorage.getItem('amix_theme');
  const currentTheme = saved || 'dark';

  applyTheme(currentTheme);

  $('#themeBtn').addEventListener('click', () => {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const next = isDark ? 'light' : 'dark';
    applyTheme(next);
    localStorage.setItem('aimex_theme', next);
    showToast(`Switched to ${next} mode`, next === 'dark' ? '🌙' : '☀️');
  });
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  const icon = $('#themeIcon');
  if (icon) {
    icon.textContent = theme === 'dark' ? '☀️' : '🌙';
  }
}

/* ---- Live Countdown Timer ---- */
function initCountdown() {
  const festTime = new Date(CONFIG.festDate).getTime();

  function update() {
    const now = Date.now();
    const diff = festTime - now;

    if (diff <= 0) {
      $('#cdDays').textContent = '00';
      $('#cdHours').textContent = '00';
      $('#cdMins').textContent = '00';
      $('#cdSecs').textContent = '00';
      return;
    }

    const d = Math.floor(diff / (1000 * 60 * 60 * 24));
    const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((diff % (1000 * 60)) / 1000);

    $('#cdDays').textContent = String(d).padStart(2, '0');
    $('#cdHours').textContent = String(h).padStart(2, '0');
    $('#cdMins').textContent = String(m).padStart(2, '0');
    $('#cdSecs').textContent = String(s).padStart(2, '0');
  }

  update();
  setInterval(update, 1000);
}

/* ---- View Navigation ---- */
function show(id) {
  document.querySelectorAll('.view').forEach(v => (v.hidden = v.id !== id));
  $('#hero').hidden = id !== 'v-events';
  const countEl = $('#cnt');
  if (countEl) countEl.textContent = store.get().length;
  window.scrollTo({ top: 0, behavior: 'smooth' });

  const h = $('#' + id + ' h1, #' + id + ' h2');
  if (h) {
    h.setAttribute('tabindex', '-1');
    h.focus({ preventScroll: true });
  }
}

/* ---- Event Filtering & Search State ---- */
let currentCat = 'all';
let searchQuery = '';
let activeViewMode = 'cards'; // 'cards' | 'timeline'

function filterEvents() {
  return [...EVENTS].filter(e => {
    const matchesCat = currentCat === 'all' || e.category === currentCat;
    const query = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !query ||
      e.name.toLowerCase().includes(query) ||
      e.tag.toLowerCase().includes(query) ||
      e.desc.toLowerCase().includes(query) ||
      e.venue.toLowerCase().includes(query);
    return matchesCat && matchesSearch;
  });
}

function renderEvents() {
  const filtered = filterEvents();
  const evList = $('#evList');
  const emptyState = $('#emptyState');

  if (filtered.length === 0) {
    evList.innerHTML = '';
    emptyState.hidden = false;
    return;
  }

  emptyState.hidden = true;
  evList.innerHTML = filtered
    .sort((a, b) => a.date.localeCompare(b.date))
    .map(e => {
      const d = new Date(e.date);
      return `<article class="ev" style="--c:${e.c};--on:${e.on}">
      <div class="body">
        <div class="ev-header">
          <span class="tag">${e.tag}</span>
          <span class="urgency-badge">Slots available</span>
        </div>
        <h3>${e.name}</h3>
        <p>${e.desc}</p>
        <div class="foot">
          <div class="price">₹${e.fee} <small>${unit(e)}</small></div>
          <div class="ev-actions">
            <button class="btn sm" data-reg="${e.id}" aria-label="Register for ${e.name}">Register</button>
          </div>
        </div>
      </div>
    </article>`;
    })
    .join('');
}

function renderTimeline() {
  const filtered = filterEvents();
  const timelineList = $('#timelineList');

  if (filtered.length === 0) {
    timelineList.innerHTML = '';
    return;
  }

  const sorted = [...filtered].sort((a, b) => a.date.localeCompare(b.date));

  timelineList.innerHTML = sorted
    .map(e => {
      return `
      <div class="timeline-row">
        <div class="timeline-node" style="--brand:${e.c}"></div>
        <div class="timeline-card" style="--c:${e.c}">
          <h3 style="margin:2px 0">${e.name}</h3>
          <p style="margin:0;color:var(--muted);font-size:14px">${e.desc}</p>
          <div style="display:flex;justify-content:space-between;align-items:center;margin-top:6px">
            <span style="font-weight:700">₹${e.fee} (${unit(e)})</span>
            <div class="ev-actions"></div>
          </div>
        </div>
      </div>`;
    })
    .join('');
}

function showAdminAccessModal() {
  const modal = $('#adminAccessModal');
  if (!modal) return;
  $('#adminAccessError').textContent = '';
  $('#adminRole').value = '';
  $('#adminPass').value = '';
  modal.showModal();
}

function closeAdminAccessModal() {
  const modal = $('#adminAccessModal');
  if (modal && modal.open) modal.close();
}

async function handleAdminAccessSubmit() {
  const role = $('#adminRole').value;
  const pass = $('#adminPass').value.trim();
  const errorEl = $('#adminAccessError');

  if (!role) {
    errorEl.textContent = 'Please select your role.';
    return;
  }

  try {
    const response = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role, accessCode: pass })
    });
    const result = await response.json();
    if (!response.ok) {
      errorEl.textContent = result.error || 'Unable to sign in.';
      return;
    }

    closeAdminAccessModal();
    show('v-admin');
    loadAdminDashboard();
  } catch (error) {
    errorEl.textContent = 'Unable to contact the server. Try again.';
  }
}

async function openAdminDashboard() {
  try {
    const response = await fetch('/api/admin/session');
    if (!response.ok) {
      showAdminAccessModal();
      return;
    }
    show('v-admin');
    loadAdminDashboard();
  } catch (error) {
    showAdminAccessModal();
  }
}

async function logoutAdmin() {
  await fetch('/api/admin/logout', { method: 'POST' });
  show('v-events');
}

/* ---- Admin Dashboard ---- */
async function loadAdminDashboard() {
  const statsWrap = $('#adminStats');
  const tableBody = $('#adminTableBody');
  const eventFilter = $('#adminEventFilter');
  const statusFilter = $('#adminStatusFilter');
  const queryInput = $('#adminSearch');

  if (!statsWrap || !tableBody || !eventFilter || !statusFilter || !queryInput) return;

  const eventOptions = EVENTS.map(
    e => `<option value="${e.id}">${esc(e.name)}</option>`
  ).join('');

  if (eventFilter.children.length <= 1) {
    eventFilter.insertAdjacentHTML('beforeend', eventOptions);
  }

  try {
    const [statsRes, regsRes] = await Promise.all([
      fetch('/api/admin/stats'),
      fetch(`/api/admin/registrations?eventId=${encodeURIComponent(eventFilter.value || 'all')}`)
    ]);

    if (!statsRes.ok || !regsRes.ok) {
      throw new Error('Unable to load admin data');
    }

    const statsData = await statsRes.json();
    const regsData = await regsRes.json();
    const registrations = regsData.registrations || [];

    const stats = [
      { label: 'Total Registrations', value: statsData.totalRegistrations ?? registrations.length },
      { label: 'Confirmed', value: statsData.confirmedCount ?? registrations.filter(r => /confirmed/i.test(r.status || '')).length },
      { label: 'Checked In', value: statsData.checkedInCount ?? registrations.filter(r => r.checkedIn).length },
      { label: 'Total Revenue', value: `₹${Number(statsData.totalRevenue || 0).toLocaleString('en-IN')}` }
    ];

    statsWrap.innerHTML = stats
      .map(
        item => `
          <div class="admin-stat">
            <span class="admin-stat-label">${item.label}</span>
            <span class="admin-stat-value">${item.value}</span>
          </div>`
      )
      .join('');

    const filtered = registrations.filter(r => {
      const selectedEvent = eventFilter.value || 'all';
      const selectedStatus = statusFilter.value || 'all';
      const search = queryInput.value.trim().toLowerCase();

      const eventMatch = selectedEvent === 'all' || r.eventId === selectedEvent;
      const statusMatch =
        selectedStatus === 'all' ||
        (selectedStatus === 'Payment Pending' && /payment pending/i.test(r.status || '')) ||
        (selectedStatus === 'Confirmed' && /confirmed/i.test(r.status || '')) ||
        (selectedStatus === 'Checked In' && !!r.checkedIn);

      const searchMatch =
        !search ||
        [r.name, r.email, r.roll, r.id, r.utr, r.eventName].some(value =>
          String(value || '').toLowerCase().includes(search)
        );

      return eventMatch && statusMatch && searchMatch;
    });

    if (!filtered.length) {
      tableBody.innerHTML = '<tr><td colspan="7" class="admin-empty">No registration records found for the selected filters.</td></tr>';
      return;
    }

    tableBody.innerHTML = filtered
      .slice(0, 100)
      .map(r => {
        const status = /confirmed/i.test(r.status || '')
          ? 'confirmed'
          : /payment pending/i.test(r.status || '')
          ? 'pending'
          : 'checked-in';

        return `
          <tr>
            <td><strong>${esc(r.id || '—')}</strong></td>
            <td>${esc(r.eventName || 'Unknown')}</td>
            <td>${esc(r.name || '—')}<br><small>${esc(r.email || '')}</small></td>
            <td>${esc(r.roll || '—')}</td>
            <td><span class="status-pill ${status}">${esc(r.status || 'Pending')}</span></td>
            <td>₹${Number(r.fee || 0).toLocaleString('en-IN')}</td>
            <td>${esc(r.utr || '—')}</td>
          </tr>
        `;
      })
      .join('');
  } catch (error) {
    statsWrap.innerHTML = '<div class="admin-empty">Admin data is not available right now. Start the backend server and try again.</div>';
    tableBody.innerHTML = '<tr><td colspan="7" class="admin-empty">No data loaded.</td></tr>';
  }
}

/* ---- Rules & Prizes Modal ---- */
function openRulesModal(id) {
  const e = ev(id);
  if (!e) return;

  const modal = $('#rulesModal');
  const header = $('#modalHeader');
  header.style.setProperty('--c', e.c);
  header.style.setProperty('--on', e.on);

  $('#mTag').textContent = e.tag;
  $('#mTitle').textContent = e.name;

  const prizesHtml = e.prizes
    ? `<div class="modal-section">
        <h4>🏆 Cash Prizes & Awards</h4>
        <div class="prizes-grid">
          ${e.prizes
            .map(
              p => `<div class="prize-badge ${p.rank}">
                <span class="prize-place">${p.place}</span>
                <span class="prize-amount">${p.amount}</span>
              </div>`
            )
            .join('')}
        </div>
      </div>`
    : '';

  const rulesHtml = e.rules
    ? `<div class="modal-section">
        <h4>📋 Rules & Guidelines</h4>
        <ul class="rules-list">
          ${e.rules.map(r => `<li>${esc(r)}</li>`).join('')}
        </ul>
      </div>`
    : '';

  const coordinatorsHtml = e.coordinators
    ? `<div class="modal-section">
        <h4>📞 Event Coordinators</h4>
        <div style="display:flex;flex-direction:column;gap:8px">
          ${e.coordinators
            .map(
              c => `<div class="coordinator-card">
                <div class="coordinator-info">
                  <b>${esc(c.name)}</b>
                  <span>${esc(c.role)}</span>
                </div>
                <a href="tel:${c.phone.replace(/\s+/g, '')}" class="contact-btn">📞 Call</a>
              </div>`
            )
            .join('')}
        </div>
      </div>`
    : '';

  $('#modalBody').innerHTML = `
    <div style="display:flex;gap:12px;font-size:14px;color:var(--muted);flex-wrap:wrap">
      <span>🕒 <b>Time:</b> ${fmtT(e.date)}</span>
      <span>📍 <b>Venue:</b> ${e.venue}</span>
      <span>👥 <b>Team:</b> ${teamTxt(e)}</span>
      <span>💰 <b>Fee:</b> ₹${e.fee} (${unit(e)})</span>
    </div>
    ${prizesHtml}
    ${rulesHtml}
    ${coordinatorsHtml}
  `;

  modal.showModal();
}

/* ---- Registration Form ---- */
const F = (id, label, input, hint = '') =>
  `<div class="f">
    <label for="${id}">${label}</label>
    ${input}
    ${hint ? `<small class="hint">${hint}</small>` : ''}
    <p class="err" id="${id}-e" role="alert"></p>
  </div>`;

const sel = (id, opts, ph) =>
  `<select id="${id}" name="${id}"><option value="">${ph}</option>${opts
    .map(o => `<option value="${esc(o)}">${esc(o)}</option>`)
    .join('')}</select>`;

function openForm(id) {
  const e = ev(id);
  if (!e) return;

  const size =
    e.max > 1
      ? F(
          'size',
          'Team size',
          `<select id="size" name="size">${Array.from(
            { length: e.max - e.min + 1 },
            (_, i) => `<option value="${e.min + i}">${e.min + i}</option>`
          ).join('')}</select>`
        )
      : '';

  const members =
    e.max > 1
      ? `<div id="membersWrap" ${e.min === 1 ? 'hidden' : ''}>${F(
          'members',
          'Other team member names & roll numbers',
          '<textarea id="members" name="members" placeholder="e.g. Rahul Sharma (21AI045)&#10;Kavita Sen (21AI082)"></textarea>',
          'Enter one member per line'
        )}</div>`
      : '';

  const x = e.extra;
  const extra = x
    ? F(
        x.id,
        x.label,
        x.type === 'select'
          ? sel(x.id, x.opts, 'Choose one')
          : `<input id="${x.id}" name="${x.id}" type="text">`,
        x.optional ? 'Optional' : ''
      )
    : '';

  $('#formBox').innerHTML = `
    <button class="back" data-go="events">← Back to events</button>
    <div class="summary" style="--c:${e.c}">
      <h2>${e.name} Registration</h2>
      <p>${fmtD(e.date)} at ${fmtT(e.date)} &bull; ${e.venue}</p>
    </div>
    <form id="regForm" novalidate>
      ${F('name', 'Full Name (Lead / Participant)', '<input id="name" name="name" autocomplete="name" placeholder="e.g. Alex Kumar">')}
      <div class="row2">
        ${F('email', 'Email Address', '<input id="email" name="email" type="email" autocomplete="email" placeholder="name@college.edu">')}
        ${F('phone', 'Phone / WhatsApp Number', '<input id="phone" name="phone" type="tel" autocomplete="tel" placeholder="10-digit number">')}
      </div>
      <div class="row2">
        ${F('roll', 'College Roll Number / ID', '<input id="roll" name="roll" placeholder="e.g. 22AI012">')}
        ${F('dept', 'Department / Branch', sel('dept', DEPTS, 'Select department'))}
      </div>
      ${F('year', 'Current Year of Study', sel('year', YEARS, 'Select year'))}
      ${size}
      ${members}
      ${extra}
      <div class="total">
        <span>Registration Fee:</span>
        <b class="price">₹${e.fee} <small>(${unit(e)})</small></b>
      </div>
      <button type="submit" class="btn block">Proceed to UPI Payment →</button>
    </form>
  `;

  show('v-form');

  const sizeSel = $('#size');
  if (sizeSel) {
    sizeSel.onchange = () => {
      const isMulti = parseInt(sizeSel.value, 10) > 1;
      const wrap = $('#membersWrap');
      if (wrap) wrap.hidden = !isMulti;
    };
  }

  $('#regForm').onsubmit = formSubmit(e);
}

function formSubmit(e) {
  return function (evt) {
    evt.preventDefault();
    const fd = new FormData(evt.target);
    const data = Object.fromEntries(fd.entries());
    let ok = true;

    const err = (id, msg) => {
      const el = $(`#${id}-e`);
      const input = $(`#${id}`);
      if (el) el.textContent = msg;
      if (input) input.setAttribute('aria-invalid', msg ? 'true' : 'false');
      if (msg) ok = false;
    };

    // Reset errors
    evt.target.querySelectorAll('.err').forEach(el => (el.textContent = ''));
    evt.target.querySelectorAll('[aria-invalid]').forEach(el => el.setAttribute('aria-invalid', 'false'));

    if (!data.name || !data.name.trim()) err('name', 'Full name is required.');
    if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) err('email', 'Enter a valid email address.');
    if (!data.phone || !/^[6-9]\d{9}$/.test(data.phone.replace(/[\s-]/g, '')))
      err('phone', 'Enter a valid 10-digit mobile number.');
    if (!data.roll || !data.roll.trim()) err('roll', 'Roll number is required.');
    if (!data.dept) err('dept', 'Please select your department.');
    if (!data.year) err('year', 'Please select your year.');

    if (e.extra && !e.extra.optional && (!data[e.extra.id] || !data[e.extra.id].trim())) {
      err(e.extra.id, `${e.extra.label} is required.`);
    }

    if (e.max > 1 && parseInt(data.size || '1', 10) > 1 && (!data.members || !data.members.trim())) {
      err('members', 'Please list the names and roll numbers of your teammates.');
    }

    if (!ok) return;

    const reg = {
      id: 'AIMEX-' + Math.random().toString(36).substring(2, 8).toUpperCase(),
      eventId: e.id,
      name: data.name.trim(),
      email: data.email.trim(),
      phone: data.phone.trim(),
      roll: data.roll.trim().toUpperCase(),
      dept: data.dept,
      year: data.year,
      size: data.size || '1',
      members: data.members ? data.members.trim() : '',
      extraLabel: e.extra ? e.extra.label : '',
      extraValue: e.extra ? data[e.extra.id] || '' : '',
      fee: e.fee,
      status: 'Payment Pending',
      timestamp: new Date().toISOString()
    };

    showPay(reg);
  };
}

/* ---- UPI Payment View ---- */
function showPay(reg) {
  const e = ev(reg.eventId);
  const upiUrl = `upi://pay?pa=${encodeURIComponent(CONFIG.upiId)}&pn=${encodeURIComponent(
    CONFIG.payee
  )}&am=${reg.fee}&cu=INR&tn=${encodeURIComponent(`${reg.id} ${e.name}`)}`;

  $('#formBox').innerHTML = `
    <button class="back" data-go="events">← Back to events</button>
    <div class="summary" style="--c:${e.c}">
      <h2>${e.name} Registration</h2>
      <p>${fmtD(e.date)} at ${fmtT(e.date)} &bull; ${e.venue}</p>
    </div>

    <div class="qrbox" style="margin-top:18px; margin-bottom:18px;">
      <div class="amt">₹${reg.fee}</div>
      <div class="qr" id="payQR" aria-label="UPI Payment QR Code"></div>
      <small style="color:var(--muted)">UPI ID: <b>${CONFIG.upiId}</b></small>
    </div>

    <ol class="steps">
      <li>Scan the QR code above using any UPI App or click the direct UPI button.</li>
      <li>Ensure the transaction note displays: <b>${reg.id}</b></li>
      <li>Once paid, enter your 12-digit UPI Reference / UTR Number below.</li>
    </ol>

    <div style="margin-bottom:18px">
      <a href="${upiUrl}" class="btn ghost block sm" style="margin-bottom:12px">📱 Pay via UPI App Directly</a>
      <div class="f">
        <label for="utr">UPI Reference / UTR Number</label>
        <input id="utr" placeholder="e.g. 328109847291" maxlength="16">
        <p class="err" id="utr-e" role="alert"></p>
      </div>
    </div>

    <button class="btn block" id="confirmPayBtn">I have completed payment ✓</button>
  `;

  $('#confirmPayBtn').onclick = () => {
    const utr = $('#utr').value.trim();
    if (!utr || utr.length < 6) {
      $('#utr-e').textContent = 'Please enter a valid UPI Reference / UTR number.';
      $('#utr').setAttribute('aria-invalid', 'true');
      return;
    }

    reg.utr = utr;
    reg.status = 'Confirmed (Verified)';
    const current = store.get().filter(r => r.id !== reg.id);
    store.set([reg, ...current]);

    showDone(reg, true);
    triggerConfetti();
  };

  show('v-form');
  drawQR($('#payQR'), upiUrl, 200);
}

/* ---- Confirmation & Ticket View ---- */
function showDone(reg, fresh = true) {
  const e = ev(reg.eventId);

  $('#doneBox').innerHTML = `
    ${
      fresh
        ? `<div class="done-h">
            <div class="check" aria-hidden="true">✓</div>
            <div>
              <h1>Registration Confirmed!</h1>
              <p style="margin:4px 0 0;color:var(--muted)">Your ticket is saved on this device. Present the QR at the fest registration desk.</p>
            </div>
          </div>`
        : `<div class="done-h"><h1>Your Ticket</h1></div>`
    }

    <article class="ticket" id="festTicket" style="--c:${e.c};--on:${e.on}">
      <div class="tk-head">
        <small>${e.tag} &bull; ${CONFIG.fest}</small>
        <h2>${e.name}</h2>
        <div style="margin-top:6px;font-size:14.5px">📅 ${fmtD(e.date)} at ${fmtT(e.date)} &bull; 📍 ${e.venue}</div>
      </div>

      <div class="tk-body">
        <dl class="kv">
          <dt>Attendee</dt><dd><b>${esc(reg.name)}</b></dd>
          <dt>Roll No.</dt><dd>${esc(reg.roll)}</dd>
          <dt>Department</dt><dd>${esc(reg.dept)}</dd>
          <dt>Year</dt><dd>${esc(reg.year)}</dd>
          <dt>Email</dt><dd>${esc(reg.email)}</dd>
          <dt>Phone</dt><dd>${esc(reg.phone)}</dd>
          ${e.max > 1 ? `<dt>Team Size</dt><dd>${reg.size} members</dd>` : ''}
          ${reg.members ? `<dt>Teammates</dt><dd style="white-space:pre-line">${esc(reg.members)}</dd>` : ''}
          ${reg.extraValue ? `<dt>${esc(reg.extraLabel)}</dt><dd>${esc(reg.extraValue)}</dd>` : ''}
          <dt>Fee Paid</dt><dd>₹${reg.fee} (${unit(e)})</dd>
          <dt>Status</dt><dd><span style="color:var(--ok);font-weight:700">● ${esc(reg.status)}</span></dd>
          ${reg.utr ? `<dt>UTR Ref</dt><dd style="font-family:monospace">${esc(reg.utr)}</dd>` : ''}
        </dl>
      </div>

      <div class="cut"></div>

      <div class="tk-foot">
        <div class="qr" id="tkQR" aria-label="Check-in QR Code"></div>
        <div>
          <small style="color:var(--muted);text-transform:uppercase;letter-spacing:0.04em">Registration ID</small>
          <div class="tk-id" id="ticketIdText">${reg.id}</div>
          <small style="color:var(--muted)">Show this QR pass at the entrance on Oct 10, 2026.</small>
        </div>
      </div>
    </article>

    <div class="actions">
      <button class="btn sm" id="copyIdBtn">📋 Copy Ticket ID</button>
      <button class="btn sm ghost" id="printTicketBtn">🖨️ Print / Save Ticket</button>
      <button class="btn sm ghost" data-go="events">Browse More Events</button>
    </div>
  `;

  show('v-done');
  drawQR($('#tkQR'), `AIMEX2026|${reg.id}|${e.name}|${reg.roll}`, 96);

  $('#copyIdBtn').onclick = () => {
    navigator.clipboard.writeText(reg.id).then(() => {
      showToast('Registration ID copied to clipboard!');
    });
  };

  $('#printTicketBtn').onclick = () => {
    window.print();
  };
}

/* ---- QR Code Generator Wrapper ---- */
function drawQR(el, text, size) {
  if (!el) return;
  el.innerHTML = '';
  try {
    new QRCode(el, {
      text: text,
      width: size,
      height: size,
      colorDark: '#10132B',
      colorLight: '#FFFFFF',
      correctLevel: QRCode.CorrectLevel.M
    });
  } catch (err) {
    el.textContent = text;
  }
}

/* ---- Confetti Particle Engine ---- */
function triggerConfetti() {
  const canvas = $('#confettiCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const count = 100;
  const colors = ['#2B3AE7', '#F2545B', '#FFC93C', '#0FA3B1', '#7A4DFF', '#3CD39C'];
  const particles = [];

  for (let i = 0; i < count; i++) {
    particles.push({
      x: canvas.width / 2,
      y: canvas.height / 2,
      w: Math.random() * 8 + 4,
      h: Math.random() * 8 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      vx: (Math.random() - 0.5) * 16,
      vy: (Math.random() - 0.5) * 16 - 3,
      gravity: 0.35,
      rotation: Math.random() * 360,
      dr: (Math.random() - 0.5) * 8,
      alpha: 1
    });
  }

  let animationFrame;
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let alive = false;

    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.gravity;
      p.rotation += p.dr;
      p.alpha -= 0.008;

      if (p.alpha > 0) {
        alive = true;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      }
    });

    if (alive) {
      animationFrame = requestAnimationFrame(animate);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      cancelAnimationFrame(animationFrame);
    }
  }

  animate();
}

/* ---- Event Listeners & Initialization ---- */
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initCountdown();

  // Populate config texts
  $('#fest').textContent = CONFIG.fest;
  $('#college').textContent = CONFIG.dept;
  $('#heroT').textContent = CONFIG.fest;
  $('#foot').textContent = CONFIG.college;
  $('#footFest').textContent = CONFIG.fest;

  renderEvents();
  renderTimeline();
  show('v-events');

  // Search input
  const searchInput = $('#eventSearch');
  const clearBtn = $('#clearSearch');

  searchInput.addEventListener('input', e => {
    searchQuery = e.target.value;
    clearBtn.hidden = !searchQuery;
    renderEvents();
    renderTimeline();
  });

  clearBtn.addEventListener('click', () => {
    searchInput.value = '';
    searchQuery = '';
    clearBtn.hidden = true;
    renderEvents();
    renderTimeline();
    searchInput.focus();
  });

  // Category chips
  $$('#catChips .chip').forEach(chip => {
    chip.addEventListener('click', () => {
      $$('#catChips .chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      currentCat = chip.dataset.cat;
      renderEvents();
      renderTimeline();
    });
  });

  // Reset filter button
  $('#resetFiltersBtn').onclick = () => {
    searchQuery = '';
    currentCat = 'all';
    searchInput.value = '';
    clearBtn.hidden = true;
    $$('#catChips .chip').forEach(c => {
      c.classList.toggle('active', c.dataset.cat === 'all');
    });
    renderEvents();
    renderTimeline();
  };

  // View switcher (Cards vs Schedule Timeline)
  const btnCards = $('#btnViewCards');
  const btnTimeline = $('#btnViewTimeline');

  btnCards.addEventListener('click', () => {
    activeViewMode = 'cards';
    btnCards.classList.add('active');
    btnCards.setAttribute('aria-pressed', 'true');
    btnTimeline.classList.remove('active');
    btnTimeline.setAttribute('aria-pressed', 'false');
    $('#evList').hidden = false;
    $('#timelineList').hidden = true;
  });

  btnTimeline.addEventListener('click', () => {
    activeViewMode = 'timeline';
    btnTimeline.classList.add('active');
    btnTimeline.setAttribute('aria-pressed', 'true');
    btnCards.classList.remove('active');
    btnCards.setAttribute('aria-pressed', 'false');
    $('#evList').hidden = true;
    $('#timelineList').hidden = false;
  });

  // Admin dashboard controls
  $('#adminBtn').addEventListener('click', openAdminDashboard);
  $('#adminRefreshBtn').addEventListener('click', loadAdminDashboard);
  $('#adminEventFilter').addEventListener('change', loadAdminDashboard);
  $('#adminStatusFilter').addEventListener('change', loadAdminDashboard);
  $('#adminSearch').addEventListener('input', loadAdminDashboard);
  $('#adminAccessSubmit').addEventListener('click', handleAdminAccessSubmit);
  $('#adminPass').addEventListener('keydown', e => {
    if (e.key === 'Enter') handleAdminAccessSubmit();
  });
  $('#adminAccessClose').addEventListener('click', () => closeAdminAccessModal());
  $('#adminAccessModal').addEventListener('click', e => {
    if (e.target === $('#adminAccessModal')) closeAdminAccessModal();
  });
  $('#adminLogoutBtn').addEventListener('click', logoutAdmin);

  // Global delegation
  document.addEventListener('click', e => {
    const t = e.target.closest('button, a');
    if (!t) return;

    if (t.dataset.reg) openForm(t.dataset.reg);
    else if (t.dataset.go === 'events') show('v-events');
    else if (t.dataset.edit) openForm(t.dataset.edit);
    else if (t.dataset.ticket) {
      const reg = store.get().find(r => r.id === t.dataset.ticket);
      if (reg) showDone(reg, false);
    }
  });

  // Modal close handlers
  const modal = $('#rulesModal');
  $('#modalClose').onclick = () => modal.close();
  $('#modalCancel').onclick = () => modal.close();
  modal.addEventListener('click', e => {
    if (e.target === modal) modal.close();
  });

  $('#home').onclick = () => show('v-events');
});
