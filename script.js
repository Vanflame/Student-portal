/* Student Portal — final JS
   - Widgets grid (customizable)
   - Customize drawer works
   - SVG icons used in HTML (no emojis)
   - Announcement badge & read behavior
   - Enrollment, Billing, Grades, Schedule (mock)
   - Persist widgets selection + ledger + enrollment + tasks
*/

(() => {
    const $ = s => document.querySelector(s);
    const $$ = s => Array.from(document.querySelectorAll(s));
    const LS = {
        widgets: 'sp_widgets_v2',
        ledger: 'sp_ledger_v2',
        enrollment: 'sp_enroll_v2',
        tasks: 'sp_tasks_v2',
        theme: 'sp_theme_v2'
    };

    // ------- Mock data -------
    const STUDENT = {
        name: 'John Dela Cruz',
        id: '2023-01456',
        program: 'BS Information Technology',
        year: '3rd Year',
        email: 'john.delacruz@uni.edu',
        tuitionTotal: 40000,
        tuitionPaid: 27500 // s    const ANNOUNCEMENTS = [
        { id: 1, title: 'Semester Registration Opens', date: Date.now() - 86400000 * 2, body: 'Registration for Spring 2024 semester opens October 15-20. Please complete your course selection by the deadline.', unread: true, priority: 'high' },
        { id: 2, title: 'Library Hours Extended', date: Date.now() - 1000 * 60 * 60 * 8, body: 'The main library will be open until 10PM during exam week (Dec 10-16). Study rooms are available for group work.', unread: true, priority: 'medium' },
        { id: 3, title: 'Tech Hackathon This Weekend', date: Date.now() - 1000 * 60 * 60 * 40, body: 'Join us for the annual university hackathon! Prizes include internships and cash awards. Register at tech.uni.edu/hackathon', unread: true, priority: 'high' },
        { id: 4, title: 'Financial Aid Workshop', date: Date.now() - 1000 * 60 * 60 * 24 * 3, body: 'Learn about scholarship opportunities and financial planning. Workshop scheduled for Dec 5th at 2PM in Room 201.', unread: false, priority: 'medium' },
        { id: 5, title: 'Campus WiFi Upgrade Complete', date: Date.now() - 1000 * 60 * 60 * 24 * 7, body: 'New high-speed WiFi is now available across campus. Connect to "Uni-Secure" for the best experience.', unread: false, priority: 'low' },
        { id: 6, title: 'Career Fair Registration', date: Date.now() - 1000 * 60 * 60 * 24 * 10, body: 'Spring Career Fair registration is now open. Over 50 companies will be attending. Register by Dec 20th.', unread: false, priority: 'high' }
    ];p and id    const GRADE_LABELS = ['CS101', 'MATH201', 'CS102', 'WEB303', 'ENG101', 'PHYS201', 'STAT301', 'CS201'];
    const GRADE_VALUES = [88, 76, 92, 81, 85, 79, 87, 91];
    
    const DETAILED_GRADES = [
        { course: 'CS101 - Intro to Programming', grade: 88, credits: 3, semester: 'Fall 2023', instructor: 'Dr. Smith' },
        { course: 'MATH201 - Discrete Mathematics', grade: 76, credits: 4, semester: 'Fall 2023', instructor: 'Prof. Johnson' },
        { course: 'CS102 - Data Structures', grade: 92, credits: 4, semester: 'Fall 2023', instructor: 'Dr. Williams' },
        { course: 'WEB303 - Web Development', grade: 81, credits: 3, semester: 'Fall 2023', instructor: 'Prof. Brown' },
        { course: 'ENG101 - Academic Writing', grade: 85, credits: 2, semester: 'Fall 2023', instructor: 'Dr. Davis' },
        { course: 'PHYS201 - Physics I', grade: 79, credits: 4, semester: 'Fall 2023', instructor: 'Prof. Wilson' },
        { course: 'STAT301 - Statistics', grade: 87, credits: 3, semester: 'Fall 2023', instructor: 'Dr. Miller' },
        { course: 'CS201 - Algorithms', grade: 91, credits: 4, semester: 'Fall 2023', instructor: 'Prof. Garcia' }
    ];E_VALU    const CATALOG = [
        { code: 'CS101', name: 'Introduction to Programming', credits: 3, schedule: 'Mon 08:00', instructor: 'Dr. Smith', room: 'Room 301', capacity: 30, enrolled: 28 },
        { code: 'CS102', name: 'Data Structures and Algorithms', credits: 4, schedule: 'Tue 09:00', instructor: 'Prof. Johnson', room: 'Room 205', capacity: 25, enrolled: 24 },
        { code: 'WEB303', name: 'Web Development Fundamentals', credits: 3, schedule: 'Thu 15:00', instructor: 'Dr. Williams', room: 'Lab 1', capacity: 20, enrolled: 18 },
        { code: 'MATH201', name: 'Discrete Mathematics', credits: 3, schedule: 'Wed 10:00', instructor: 'Prof. Brown', room: 'Room 102', capacity: 35, enrolled: 32 },
        { code: 'ENG101', name: 'Academic Writing and Communication', credits: 2, schedule: 'Fri 11:00', instructor: 'Dr. Davis', room: 'Room 99', capacity: 25, enrolled: 22 },
        { code: 'CS301', name: 'Database Systems', credits: 3, schedule: 'Mon 14:00', instructor: 'Prof. Wilson', room: 'Lab 2', capacity: 20, enrolled: 19 },
        { code: 'MATH301', name: 'Calculus III', credits: 4, schedule: 'Tue 11:00', instructor: 'Dr. Miller', room: 'Room 201', capacity: 30, enrolled: 27 },
        { code: 'CS401', name: 'Software Engineering', credits: 4, schedule: 'Wed 15:00', instructor: 'Prof. Garcia', room: 'Room 301', capacity: 25, enrolled: 23 }
    ];: 2, schedule: 'Fri 11:00' }
    ];

    // default widgets selection
    const DEFAULT_WIDGETS = ['gpa', 'tuition', 'nextClass', 'announcements', 'weather', 'quote', 'progress', 'upcoming'];
    const WIDGETS = [
        { id: 'gpa', label: 'GPA Overview' },
        { id: 'tuition', label: 'Tuition Balance' },
        { id: 'nextClass', label: 'Next Class' },
        { id: 'schedule', label: 'Weekly Schedule' },
        { id: 'grades', label: 'Grade Chart' },
        { id: 'announcements', label: 'Recent Announcements' },
        { id: 'weather', label: 'Weather (mock)' },
        { id: 'quote', label: 'Motivational Quote' },
        { id: 'clock', label: 'Clock & Date' },
        { id: 'pomodoro', label: 'Pomodoro (mini)' },
        { id: 'progress', label: 'Academic Progress' },
        { id: 'upcoming', label: 'Upcoming Events' },
        { id: 'library', label: 'Library Status' },
        { id: 'campus', label: 'Campus News' }
    ];'pomodoro', label: 'Pomodoro (mini)' }
    ];

    // ------- Elements -------
    const navItems = $$('.nav-item');
    const sections = $$('.section');
    const menuToggle = $('#menuToggle');
    const sidebar = $('#sidebar');
    const openCustomizeBtns = [$('#openCustomize'), $('#openCustomizeNav')].filter(Boolean);
    const customizeDrawer = $('#customizeDrawer');
    const widgetsForm = $('#widgetsForm');
    const widgetsGrid = $('#widgetsGrid');
    const annBadge = $('#annBadge');

    // ------- Utilities -------
    const fmt = v => `₱ ${Number(v).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    const timeAgo = ts => {
        const s = Math.floor((Date.now() - ts) / 1000);
        if (s < 60) return `${s}s ago`; if (s < 3600) return `${Math.floor(s / 60)}m ago`;
        if (s < 86400) return `${Math.floor(s / 3600)}h ago`; return `${Math.floor(s / 86400)}d ago`;
    };
    const escapeHtml = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

    // ------- State -------
    let activeWidgets = (() => {
        try {
            const raw = localStorage.getItem(LS.widgets);
            if (!raw) return DEFAULT_WIDGETS.slice();
            const parsed = JSON.parse(raw);
            return Array.isArray(parsed) && parsed.length ? parsed : DEFAULT_WIDGETS.slice();
        } catch { return DEFAULT_WIDGETS.slice(); }
    })();

    // ledger - persist
    let ledger = (() => {
        try {
            const raw = localStorage.getItem(LS.ledger);
            if (!raw) {
                const seed = {
                    tuitionTotal: STUDENT.tuitionTotal,
                    transactions: [
                        { date: Date.now() - 1000 * 60 * 60 * 24 * 45, desc: 'Tuition billed', debit: STUDENT.tuitionTotal, credit: 0 },
                        { date: Date.now() - 1000 * 60 * 60 * 24 * 12, desc: 'Payment - Installment 1', debit: 0, credit: 15000 },
                        { date: Date.now() - 1000 * 60 * 60 * 24 * 3, desc: 'Payment - Installment 2', debit: 0, credit: 12500 }
                    ]
                };
                localStorage.setItem(LS.ledger, JSON.stringify(seed));
                return seed;
            }
            return JSON.parse(raw);
        } catch { return { tuitionTotal: STUDENT.tuitionTotal, transactions: [] }; }
    })();

    // enrollment
    let enrollment = (() => {
        try {
            const raw = localStorage.getItem(LS.enrollment);
            if (!raw) { const s = { selected: [], enrolled: [] }; localStorage.setItem(LS.enrollment, JSON.stringify(s)); return s; }
            return JSON.parse(raw);
        } catch { return { selected: [], enrolled: [] }; }
    })();

    // tasks simple
    let tasks = JSON.parse(localStorage.getItem(LS.tasks) || '[]');

    // ------- Navigation behavior -------
    navItems.forEach(item => item.addEventListener('click', () => {
        navItems.forEach(i => i.classList.remove('active'));
        item.classList.add('active');
        const tab = item.dataset.tab;
        sections.forEach(s => s.classList.toggle('active', s.id === tab));
        if (tab === 'announcements') markAllAnnouncementsRead();
        if (window.innerWidth < 900) sidebar.classList.remove('active');
    }));

    if (menuToggle) menuToggle.addEventListener('click', () => sidebar.classList.toggle('active'));

    // open customize drawer from multiple triggers
    openCustomizeBtns.forEach(btn => btn.addEventListener('click', () => openCustomizeDrawer()));

    // close on close button or outside click handled later
    $('#closeCustomize') && $('#closeCustomize').addEventListener('click', () => closeCustomizeDrawer());

    // ------- Theme -------
    const savedTheme = localStorage.getItem(LS.theme) || (window.matchMedia && window.matchMedia('(prefers-color-scheme:dark)').matches ? 'dark' : 'light');
    (savedTheme === 'dark') ? document.documentElement.setAttribute('data-theme', 'dark') : document.documentElement.removeAttribute('data-theme');
    $('#themeToggle') && $('#themeToggle').addEventListener('click', () => {
        const t = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        if (t === 'dark') document.documentElement.setAttribute('data-theme', 'dark'); else document.documentElement.removeAt    function renderAnnouncementsList() {
        const out = $('#annList');
        if (!out) return;
        out.innerHTML = ANNOUNCEMENTS.map(a => {
            const priorityColor = a.priority === 'high' ? '#ef4444' : a.priority === 'medium' ? '#f59e0b' : '#6b7280';
            const priorityIcon = a.priority === 'high' ? '🔴' : a.priority === 'medium' ? '🟡' : '🔵';
            return `<li style="padding:16px;border-radius:12px;background:var(--gradient-card);border:1px solid var(--border);margin-bottom:12px;box-shadow:0 2px 8px var(--shadow)">
                <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px">
                    <span style="font-size:12px">${priorityIcon}</span>
                    <strong style="color:var(--text)">${escapeHtml(a.title)}</strong>
                    ${a.unread ? '<span style="background:var(--gradient-primary);color:white;padding:2px 8px;border-radius:12px;font-size:10px;font-weight:600">NEW</span>' : ''}
                </div>
                <div class="muted small" style="margin-bottom:8px">${timeAgo(a.date)} • Priority: <span style="color:${priorityColor};font-weight:600">${a.priority.toUpperCase()}</span></div>
                <div class="muted small" style="line-height:1.5">${escapeHtml(a.body)}</div>
            </li>`;
        }).join('');
        updateAnnBadge();
    }div><div class="muted small" style="margin-top:6px">${escapeHtml(a.body)}</div></li>`).join('');
        updateAnnBadge();
    }
    function updateAnnBadge() {
        const unread = ANNOUNCEMENTS.filter(a => a.unread).length;
        if (!annBadge) return;
        if (unread > 0) { annBadge.style.display = 'inline-block'; annBadge.textContent = unread; }
        else annBadge.style.display = 'none';
    }
    function markAllAnnouncementsRead() {
        ANNOUNCEMENTS.forEach(a => a.unread = false);
        renderAnnouncementsList();
    }
    renderAnnouncementsList();

    // ------- Widgets creation -------
    function createWidgetElement(id) {
        const el = document.createElement('div');
        el.className = 'card';
        switch (id) {
            case 'gpa':
                el.innerHTML = `<h3><svg class="icon" viewBox="0 0 24 24" aria-hidden><path d="M12 15.5A3.5 3.5 0 1 0 12 8.5"/></svg> GPA Overview</h3>
          <div class="card-row"><div class="big">3.78</div></div><div class="muted small">Semester: 3.78 • Cumulative: 3.65</div>`;
                break;

            case 'tuition':
                el.innerHTML = `<h3><svg class="icon" viewBox="0 0 24 24" aria-hidden><rect x="3" y="8" width="18" height="13" rx="2"/></svg> Tuition Balance</h3>
          <div class="card-row"><div class="big" id="widgetBalance">${fmt(STUDENT.tuitionTotal - STUDENT.tuitionPaid)}</div></div>
          <div class="muted small">Total billed: ${fmt(STUDENT.tuitionTotal)} • Paid: ${fmt(STUDENT.tuitionPaid)}</div>`;
                break;

            case 'nextClass':
                el.innerHTML = `<h3><svg class="icon" viewBox="0 0 24 24" aria-hidden><path d="M9 17v-6"/></svg> Next Class</h3>
          <div class="muted small">Today</div><div style="margin-top:8px"><strong>Web Development — 08:00 • Room 301</strong></div>`;
                break;

            case 'schedule':
                el.innerHTML = `<h3><svg class="icon" viewBox="0 0 24 24" aria-hidden><rect x="3" y="4" width="18" height="18" rx="2"/></svg> Weekly Schedule</h3>
          <div id="miniSchedule"></div>`;
                break;

            case 'grades':
                el.innerHTML = `<h3><svg class="icon" viewBox="0 0 24 24" aria-hidden><path d="M3 3v18h18"/></svg> Grade Chart</h3><canvas id="miniGrades" height="100"></canvas>`;
                break;

            case 'announcements':
                el.innerHTML = `<h3><svg class="icon" viewBox="0 0 24 24" aria-hidden><path d="M18 8a6 6 0 0 0-12 0v5"/></svg> Recent Announcements</h3>
          <ul class="list">${ANNOUNCEMENTS.slice(0, 3).map(a => `<li><strong>${escapeHtml(a.title)}</strong><div class="muted small">${timeAgo(a.date)}</div></li>`).join('')}</ul>`;
                break;

            case 'weather':
                el.innerHTML = `<h3><svg class="icon" viewBox="0 0 24 24" aria-hidden><path d="M3 13a4 4 0 0 1 4-4h1"/></svg> Weather (Manila)</h3>
          <div style="display:flex;align-items:center;gap:12px"><div style="font-size:28px">31°C</div><div class="muted">Sunny • Humidity 60%</div></div>`;
                break;

            case 'quote':
                const Qs = ["Progress, not perfection.", "Small steps every day.", "Study smart, not hard.", "Focus on understanding."];
                const q = Qs[Math.floor(Math.random() * Qs.length)];
                el.innerHTML = `<h3><svg class="icon" viewBox="0 0 24 24" aria-hidden><path d="M7 17H3V9a6 6 0 0 1 6-6h1"/></svg> Motivational Quote</h3>
          <div style="font-style:italic;margin-top:8px">"${escapeHtml(q)}"</div>`;
                break;

            case 'clock':
                el.innerHTML = `<h3><svg class="icon" viewBox="0 0 24 24" aria-hidden><circle cx="12" cy="12"            case 'pomodoro':
                el.innerHTML = `<h3><svg class="icon" viewBox="0 0 24 24" aria-hidden><path d="M12 2v4"/></svg> Pomodoro</h3>
          <div id="miniPomTimer" style="font-weight:700;font-size:20px">25:00</div><div style="margin-top:8px"><button id="miniPomStart" class="btn-primary">Start</button> <button id="miniPomStop" class="btn-ghost">Stop</button></div>`;
                break;

            case 'progress':
                el.innerHTML = `<h3><svg class="icon" viewBox="0 0 24 24" aria-hidden><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg> Academic Progress</h3>
          <div style="margin:12px 0"><div style="display:flex;justify-content:space-between;margin-bottom:8px"><span>Credits Completed</span><span><strong>89/120</strong></span></div>
          <div style="background:#e2e8f0;height:8px;border-radius:4px;overflow:hidden"><div style="background:var(--gradient-primary);height:100%;width:74%;transition:width 0.5s"></div></div></div>
          <div class="muted small">74% Complete • 31 credits remaining</div>`;
                break;

            case 'upcoming':
                el.innerHTML = `<h3><svg class="icon" viewBox="0 0 24 24" aria-hidden><path d="M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z"/></svg> Upcoming Events</h3>
          <ul style="list-style:none;padding:0;margin:8px 0"><li style="padding:6px 0;border-bottom:1px solid var(--border)"><strong>Dec 15</strong><br><span class="muted small">Final Exams Begin</span></li>
          <li style="padding:6px 0;border-bottom:1px solid var(--border)"><strong>Dec 20</strong><br><span class="muted small">Career Fair</span></li>
          <li style="padding:6px 0"><strong>Dec 22</strong><br><span class="muted small">Winter Break Starts</span></li></ul>`;
                break;

            case 'library':
                el.innerHTML = `<h3><svg class="icon" viewBox="0 0 24 24" aria-hidden><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/></svg> Library Status</h3>
          <div style="margin:12px 0"><div style="display:flex;align-items:center;gap:8px;margin-bottom:8px"><div style="width:8px;height:8px;background:#10b981;border-radius:50%"></div><span><strong>Open</strong> • Closes at 10PM</span></div>
          <div class="muted small">Current capacity: 45/100<br>Study rooms available: 3</div></div>`;
                break;

            case 'campus':
                el.innerHTML = `<h3><svg class="icon" viewBox="0 0 24 24" aria-hidden><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/></svg> Campus News</h3>
          <div style="margin:8px 0"><div style="padding:8px;background:rgba(59,130,246,0.05);border-radius:8px;margin-bottom:8px"><strong>New Research Lab Opens</strong><br><span class="muted small">State-of-the-art facilities now available</span></div>
          <div style="padding:8px;background:rgba(16,185,129,0.05);border-radius:8px"><strong>Student Achievement</strong><br><span class="muted small">CS students win national competition</span></div></div>`;
                break;

            default:
                el.innerHTML = `<h3>${escapeHtml(id)}</h3>`;tn-primary">Start</button> <button id="miniPomStop" class="btn-ghost">Stop</button></div>`;
                break;

            default:
                el.innerHTML = `<h3>${escapeHtml(id)}</h3>`;
        }
        return el;
    }

    function renderWidgets() {
        widgetsGrid.innerHTML = '';
        activeWidgets.forEach(id => {
            const w = createWidgetElement(id);
            widgetsGrid.appendChild(w);
        });
        afterWidgetRenderWarmup();
    }

    function createWidgetElement(id) { return createWidgetElementImpl(id); }
    // use a small wrapper to avoid hoisting confusion
    function createWidgetElementImpl(id) { return createWidgetElementImplCore(id); }
    function createWidgetElementImplCore(id) {
        return (function () { return createWidgetElementDirect(id); })();
    }
    // real creator
    function createWidgetElementDirect(id) {
        return (function () {
            const el = document.createElement('div');
            el.className = 'card';
            // delegate to createWidgetElement to avoid duplication
            return createWidgetElementImplementation(id, el);
        })();
    }

    // final implementation (keeps code readable)
    function createWidgetElementImplementation(id, el) {
        // reuse earlier createWidgetElement code body
        switch (id) {
            case 'gpa':
                el.innerHTML = `<h3><svg class="icon" viewBox="0 0 24 24" aria-hidden><path d="M12 15.5A3.5 3.5 0 1 0 12 8.5"/></svg> GPA Overview</h3>
          <div class="card-row"><div class="big">3.78</div></div><div class="muted small">Semester: 3.78 • Cumulative: 3.65</div>`;
                break;
            case 'tuition':
                el.innerHTML = `<h3><svg class="icon" viewBox="0 0 24 24" aria-hidden><rect x="3" y="8" width="18" height="13" rx="2"/></svg> Tuition Balance</h3>
          <div class="card-row"><div class="big">${fmt(STUDENT.tuitionTotal - STUDENT.tuitionPaid)}</div></div>
          <div class="muted small">Total billed: ${fmt(STUDENT.tuitionTotal)} • Paid: ${fmt(STUDENT.tuitionPaid)}</div>`;
                break;
            case 'nextClass':
                el.innerHTML = `<h3><svg class="icon" viewBox="0 0 24 24" aria-hidden><path d="M9 17v-6"/></svg> Next Class</h3>
          <div class="muted small">Today</div><div style="margin-top:8px"><strong>Web Development — 08:00 • Room 301</strong></div>`;
                break;
            case 'schedule':
                el.innerHTML = `<h3><svg class="icon" viewBox="0 0 24 24" aria-hidden><rect x="3" y="4" width="18" height="18" rx="2"/></svg> Weekly Schedule</h3>
          <div id="miniSchedule"></div>`;
                break;
            case 'grades':
                el.innerHTML = `<h3><svg class="icon" viewBox="0 0 24 24" aria-hidden><path d="M3 3v18h18"/></svg> Grade Chart</h3><canvas id="miniGrades" height="100"></canvas>`;
                break;
            case 'announcements':
                el.innerHTML = `<h3><svg class="icon" viewBox="0 0 24 24" aria-hidden><path d="M18 8a6 6 0 0 0-12 0v5"/></svg> Recent Announcements</h3>
          <ul class="list">${ANNOUNCEMENTS.slice(0, 3).map(a => `<li><strong>${escapeHtml(a.title)}</strong><div class="muted small">${timeAgo(a.date)}</div></li>`).join('')}</ul>`;
                break;
            case 'weather':
                el.innerHTML = `<h3><svg class="icon" viewBox="0 0 24 24" aria-hidden><path d="M3 13a4 4 0 0 1 4-4h1"/></svg> Weather (Manila)</h3>
          <div style="display:flex;align-items:center;gap:12px"><div style="font-size:28px">31°C</div><div class="muted">Sunny • Humidity 60%</div></div>`;
                break;
            case 'quote':
                const Qs = ["Progress, not perfection.", "Small steps every day.", "Study smart, not hard.", "Focus on understanding."];
                const q = Qs[Math.floor(Math.random() * Qs.length)];
                el.innerHTML = `<h3><svg class="icon" viewBox="0 0 24 24" aria-hidden><path d="M7 17H3V9a6 6 0 0 1 6-6h1"/></svg> Motivational Quote</h3>
          <div style="font-style:italic;margin-top:8px">"${escapeHtml(q)}"</div>`;
                break;
            case 'clock':
                el.innerHTML = `<h3            case 'pomodoro':
                el.innerHTML = `<h3><svg class="icon" viewBox="0 0 24 24" aria-hidden><path d="M12 2v4"/></svg> Pomodoro</h3>
          <div id="miniPomTimer" style="font-weight:700;font-size:20px">25:00</div><div style="margin-top:8px"><button id="miniPomStart" class="btn-primary">Start</button> <button id="miniPomStop" class="btn-ghost">Stop</button></div>`;
                break;

            case 'progress':
                el.innerHTML = `<h3><svg class="icon" viewBox="0 0 24 24" aria-hidden><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg> Academic Progress</h3>
          <div style="margin:12px 0"><div style="display:flex;justify-content:space-between;margin-bottom:8px"><span>Credits Completed</span><span><strong>89/120</strong></span></div>
          <div style="background:#e2e8f0;height:8px;border-radius:4px;overflow:hidden"><div style="background:var(--gradient-primary);height:100%;width:74%;transition:width 0.5s"></div></div></div>
          <div class="muted small">74% Complete • 31 credits remaining</div>`;
                break;

            case 'upcoming':
                el.innerHTML = `<h3><svg class="icon" viewBox="0 0 24 24" aria-hidden><path d="M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z"/></svg> Upcoming Events</h3>
          <ul style="list-style:none;padding:0;margin:8px 0"><li style="padding:6px 0;border-bottom:1px solid var(--border)"><strong>Dec 15</strong><br><span class="muted small">Final Exams Begin</span></li>
          <li style="padding:6px 0;border-bottom:1px solid var(--border)"><strong>Dec 20</strong><br><span class="muted small">Career Fair</span></li>
          <li style="padding:6px 0"><strong>Dec 22</strong><br><span class="muted small">Winter Break Starts</span></li></ul>`;
                break;

            case 'library':
                el.innerHTML = `<h3><svg class="icon" viewBox="0 0 24 24" aria-hidden><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/></svg> Library Status</h3>
          <div style="margin:12px 0"><div style="display:flex;align-items:center;gap:8px;margin-bottom:8px"><div style="width:8px;height:8px;background:#10b981;border-radius:50%"></div><span><strong>Open</strong> • Closes at 10PM</span></div>
          <div class="muted small">Current capacity: 45/100<br>Study rooms available: 3</div></div>`;
                break;

            case 'campus':
                el.innerHTML = `<h3><svg class="icon" viewBox="0 0 24 24" aria-hidden><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/></svg> Campus News</h3>
          <div style="margin:8px 0"><div style="padding:8px;background:rgba(59,130,246,0.05);border-radius:8px;margin-bottom:8px"><strong>New Research Lab Opens</strong><br><span class="muted small">State-of-the-art facilities now available</span></div>
          <div style="padding:8px;background:rgba(16,185,129,0.05);border-radius:8px"><strong>Student Achievement</strong><br><span class="muted small">CS students win national competition</span></div></div>`;
                break;

            default:
                el.innerHTML = `<h3>${escapeHtml(id)}</h3>`;25:00</div><div style="margin-top:8px"><button id="miniPomStart" class="btn-primary">Start</button> <button id="miniPomStop" class="btn-ghost">Stop</button></div>`;
                break;
            default:
                el.innerHTML = `<h3>${escapeHtml(id)}</h3>`;
        }
        return el;
    }

    // warmup after widgets inserted
    function afterWidgetRenderWarmup() {
        // mini schedule
        const miniSchedule = $('#miniSchedule');
        if (miniSchedule) {
            const scheduleData = {
                Monday: ['08:00 — Web Dev', '10:00 — Discrete Math'],
                Tuesday: ['09:00 — Algorithms', '13:00 — DB Systems'],
                Wednesday: ['08:00 — CS Lab', '14:00 — History'],
                Thursday: ['10:00 — Math Tut', '15:00 — Web Dev'],
                Friday: ['08:00 — Practicum', '11:00 — Seminar']
            };
            const today = new Date().toLocaleDateString(undefined, { weekday: 'long' });
            miniSchedule.innerHTML = Object.keys(scheduleData).map(day => `<div style="margin-bottom:8px"><strong ${day === today ? 'style="color:var(--primary)"' : ''}>${day}</strong><div class="muted small" style="margin-top:6px">${scheduleData[day].join('<br>')}</div></div>`).join('');
        }

        // mini grades chart
        const miniGrades = $('#miniGrades');
        if (miniGrades) {
            new Chart(miniGrades.getContext('2d'), { type: 'bar', data: { labels: GRADE_LABELS, datasets: [{ data: GRADE_VALUES, backgroundColor: 'rgba(47,110,242,0.9)', borderRadius: 6 }] }, options: { responsive: true, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, max: 100 } } } });
        }

        // clock
        const widgetClock = $('#widgetClock');
        if (widgetClock) setInterval(() => widgetClock.textContent = new Date().toLocaleString(), 1000);

        // pomodoro
        const miniPomTimer = $('#miniPomTimer');
        if (miniPomTimer) {
            let remaining = 25 * 60, interval = null;
            const fmtTime = t => `${String(Math.floor(t / 60)).padStart(2, '0')}:${String(t % 60).padStart(2, '0')}`;
            miniPomTimer.textContent = fmtTime(remaining);
            $('#miniPomStart') && $('#miniPomStart').addEventListener('click', () => {
                if (interval) return;
                interval = setInterval(() => { remaining--; miniPomTimer.textContent = fmtTime(remaining); if (remaining <= 0) { clearInterval(interval); interval = null; remaining = 25 * 60; showNotification('Pomodoro session completed!', 'success'); miniPomTimer.textContent = fmtTime(remaining); } }, 1000);
            });
            $('#miniPomStop') && $('#miniPomStop').addEventListener('click', () => { if (interval) clearInterval(interval); interval = null; remaining = 25 * 60; miniPomTimer.textContent = fmtTime(remaining); });
        }
    }

    // initial render of widgets
    function renderWidgetsGrid() {
        widgetsGrid.innerHTML = '';
        activeWidgets.forEach(id => widgetsGrid.appendChild(createWidgetElementDirect(id)));
        afterWidgetRenderWarmup();
    }
    renderWidgetsGrid();

    // ------- Customize drawer logic -------
    function openCustomizeDrawer() {
        // populate checkboxes
        widgetsForm.innerHTML = '';
        WIDGETS.forEach(w => {
            const label = document.createElement('label');
            const checked = activeWidgets.includes(w.id) ? 'checked' : '';
            label.innerHTML = `<input type="checkbox" name="widget" value="${w.id}" ${checked}/> ${w.label}`;
            widgetsForm.appendChild(label);
        });
        customizeDrawer.classList.add('open');
        customizeDrawer.setAttribute('aria-hidden', 'false');
    }
    function closeCustomizeDrawer() {
        customizeDrawer.classList.remove('open');
        customizeDrawer.setAttribute('aria-hidden', 'true');
    }

    widgetsForm.addEventListener('change', () => {
        const checked = Array.from(widgetsForm.querySelectorAll('input[name="widget"]:checked')).map(i => i.value);
        if (checked.length === 0) {
            // disallow empty selection — restore previous
            Array.from(widgetsForm.querySelectorAll('input[name="widget"]')).forEach(i => i.checked = activeWidgets.includes(i.value));
            return;
        }
        activeWidgets = checked;
        localStorage.setItem(LS.widgets, JSON.stringify(activeWidgets));
        renderWidgetsGrid();
    });

    // close drawer clicking outside
    document.addEventListener('click', e => {
        if (!customizeDrawer.classList.contains('open')) return;
        const inside = customizeDrawer.contains(e.target) || openCustomizeBtns.some(b => b && b.contains(e.target));
     function renderCatalog() {
        catalogListEl.innerHTML = CATALOG.map(c => {
            const disabled = enrollment.enrolled.some(e => e.code === c.code) || enrollment.selected.some(s => s.code === c.code);
            const isFull = c.enrolled >= c.capacity;
            return `<li style="padding:16px;background:var(--gradient-card);border-radius:12px;margin-bottom:12px;border:1px solid var(--border);box-shadow:0 2px 8px var(--shadow)">
                <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:16px">
                    <div style="flex:1">
                        <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px">
                            <strong style="color:var(--primary)">${c.code}</strong>
                            <span style="background:rgba(59,130,246,0.1);color:var(--primary);padding:2px 8px;border-radius:12px;font-size:11px;font-weight:600">${c.credits} credits</span>
                            ${isFull ? '<span style="background:#ef4444;color:white;padding:2px 8px;border-radius:12px;font-size:11px;font-weight:600">FULL</span>' : ''}
                        </div>
                        <div style="font-weight:600;margin-bottom:4px">${escapeHtml(c.name)}</div>
                        <div class="muted small" style="margin-bottom:4px">Instructor: ${escapeHtml(c.instructor)}</div>
                        <div class="muted small">${escapeHtml(c.schedule)} • ${escapeHtml(c.room)} • ${c.enrolled}/${c.capacity} enrolled</div>
                    </div>
                    <div>
                        <button data-select="${c.code}" class="btn-primary" ${disabled || isFull ? 'disabled' : ''} style="min-width:80px">
                            ${disabled ? 'Selected' : isFull ? 'Full' : 'Select'}
                        </button>
                    </div>
                </div>
            </li>`;
        }).join('');
    } c.code) || enrollment.selected.some(s => s.code === c.code);
            return `<li><div><strong>${c.code}</strong><div class="meta">${escapeHtml(c.name)} • ${c.credits} cr • ${escapeHtml(c.schedule)}</div></div><div><button data-select="${c.code}" class="btn-primary" ${disabled ? 'disabled' : ''}>Select</button></div></li>`;
        }).join('');
    }
    function renderSelection() {
        selectionListEl.innerHTML = enrollment.selected.length ? enrollment.selected.map((s, i) => `<li><div><strong>${s.code}</strong><div class="meta">${escapeHtml(s.name)} • ${s.credits} cr</div></div><div><button data-remove="${i}" class="btn-ghost">Remove</button></div></li>`).join('') : '<div class="muted">No courses selected</div>';
        selectedCreditsEl.textContent = enrollment.selected.reduce((sum, s) => sum + (Number(s.credits) || 0), 0);            if (enrollment.enrolled.some(ec => ec.code === code)) return showNotification('Already enrolled in this course', 'warning');
            if (enrollment.selected.some(sc => sc.code === code)) return showNotification('Course already selected', 'warning');el) {
            const code = sel.getAttribute('data-select');
            const course = CATALOG.find(c => c.code === code);
            if (!course) return;
            if (enrollment.enrolled.some(ec => ec.code === code)) return alert('Already enrolled');
            if (enrollment.selected.some(sc => sc.code === code)) return alert('Already selected');
            enrollment.selected.push(course);
            localStorage.setItem(LS.enrollment, JSON.stringify(enrollment));
            renderCatalog(); renderSelection();
        }
        const rem = e.target.closest('[data-remove]');
        if (rem) {
            const i = +rem.getAttribute('data-remove');
            enrollment.selected.splice(i, 1);
            localStorage.setItem(LS.enrollment, JSON.stringify(enrollment));
            renderCatal        localStorage.setItem(LS.enrollment, JSON.stringify(enrollment));
        renderCatalog(); renderSelection();
        showNotification('Enrollment submitted successfully!', 'success');ected.length) return alert('No courses selected');
        enrollment.selected.forEach(s => { if (!enrollment.enrolled.some(e => e.code === s.code)) enrollment.enrolled.push(s); });
        enrollment.selected = [];
        localStorage.setItem(LS.enrollment, JSON.stringify(enrollment));
        renderCatalog(); renderSelection();
        alert('Enrollment submitted (mock).');
    });

    // ------- Billing ledger -------
    function calcOutstanding(led) {
        const credits = led.transactions.reduce((s, t) => s + (t.credit || 0), 0);
        return Math.max(0, led.tuitionTotal - credits);
    }
    function runningBalance(tx) {
        const sorted = [...ledger.transactions].sort((a, b) => a.date - b.date);
        let running = ledger.tuitionTotal;
        for (const t of sorted) {
            running = running - (t.credit || 0) + (t.debit || 0);
            if (t.date === tx.date && t.desc === tx.desc && (t.credit || 0) === (tx.credit || 0) && (t.debit || 0) === (tx.debit || 0)) return running;
        }
        return running;
    }
    function renderLedger() {
        const tbody = $('#ledgerTable tbody');
        if (!tbody) return;
        tbody.innerHTML = ledger.transactions.map(tx => {
            const bal = runningBalance(tx);
            return `<tr><td>${(new Date(tx.date)).toLocaleDateString()}</td><td>${escapeHtml(tx.desc)}</td><td class="debit">${tx.debit ? fmt(tx.debit) : '-'}</td><td class="credit">${tx.credit ? fmt(tx.credit) : '-'}</td><td>${fmt(bal)}</td><td><button data-del="${tx.date}" class="btn-ghost">Remove</button></td></tr>`;
        }).join('');
        $('#tuitionTotal').textContent = fmt(ledger.tuitionTotal);
        $('#balance').textContent = fmt(calcOutstanding(ledger));
        $('#outstandingBalance') && ($('#outstandingBalance').textContent = fmt(calcOutstanding(ledger)));
        const last = ledger.transactions.filter(t => t.credit).sort((a, b) => b.date - a.date)[0];
        $('#lastPaymentDate') && ($('#lastPaymentDate').textContent = last ? new Date(last.date).toLocaleDateString() : '—');
    }
    renderLedger();

    $('#openPayForm') && $('#openPayForm').addEventListener('click', () => $('#paymentForm').style.display = 'block');
    $('#cancelPayment') && $('#cancelPayment').addEventListener('click', () => $('#paymentForm').style.display = 'none');
    $('#savePayment') && $('#savePayment').addEventListener('click', () => {
        const amt = parseFloat($('#paymentAmount').        $('#paymentAmount').value = ''; $('#paymentDate').value = ''; $('#paymentDesc').value = '';
        $('#paymentForm').style.display = 'none'; renderLedger(); showNotification('Payment recorded successfully!', 'success');|| amt <= 0) return alert('Enter a valid amount');
        ledger.transactions.push({ date: new Date(dateStr).getTime(), desc, debit: 0, credit: amt });
        localStorage.setItem(LS.ledger, JSON.stringify(ledger));
        $('#paymentAmount').value = ''; $('#paymentDate').value = ''; $('#paymentDesc').value = '';
        $('#paymentForm').style.display = 'none'; renderLedger(); alert('Payment recorded (mock)');
    });

    // ledger     // ------- Grades chart (main) -------
    if ($('#detailedGrades')) {
        new Chart($('#detailedGrades').getContext('2d'), { 
            type: 'bar', 
            data: { 
                labels: GRADE_LABELS, 
                datasets: [{ 
                    label: 'Grade', 
                    data: GRADE_VALUES, 
                    backgroundColor: 'rgba(59, 130, 246, 0.8)', 
                    borderRadius: 8,
                    borderSkipped: false
                }] 
            }, 
            options: { 
                responsive: true, 
                plugins: { 
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleColor: 'white',
                        bodyColor: 'white',
                        borderColor: 'rgba(59, 130, 246, 0.8)',
                        borderWidth: 1
                    }
                }, 
                scales: { 
                    y: { 
                        beginAtZero: true, 
                        max: 100,
                        grid: {
                            color: 'rgba(0, 0, 0, 0.1)'
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                } 
            } 
        });
        $('#gradeList') && ($('#gradeList').innerHTML = DETAILED_GRADES.map(g => 
            `<div style="display:flex;justify-content:space-between;align-items:center;padding:12px;background:var(--gradient-card);border-radius:8px;margin-bottom:8px;border:1px solid var(--border)">
                <div>
                    <strong>${escapeHtml(g.course)}</strong><br>
                    <span class="muted small">${escapeHtml(g.instructor)} • ${g.credits} credits</span>
                </div>
                <div style="text-align:right">
                    <div style="font-size:20px;font-weight:700;color:${g.grade >= 90 ? '#10b981' : g.grade >= 80 ? '#3b82f6' : g.grade >= 70 ? '#f59e0b' : '#ef4444'}">${g.grade}%</div>
                    <span class="muted small">${escapeHtml(g.semester)}</span>
                </div>
            </div>`
        ).join(''));
    }), { type: 'bar', data: { labels: GRADE_LABELS, datasets: [{ label: 'Grade', data: GRADE_VALUES, backgroundColor: 'rgba(47,110,242,0.85)', borderRadius: 6 }] }, options: { responsive: true, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, max: 100 } } } });
        $('#gradeList') && ($('#gradeList').innerHTML = GRADE_LABELS.map((l, i) => `<div>${escapeHtml(l)}: <strong>${GRADE_VALUES[i]}%</strong></div>`).join(''));
    }

    // ------- Schedule page -------
    const scheduleData = {
        Monday: ['08:00 — Web Dev (Room 301)', '10:00 — Discrete Math (Room 205)'],
        Tuesday: ['09:00 — Algorithms (Room 102)', '13:00 — DB Systems (Room 205)'],
        Wednesday: ['08:00 — CS Lab (Lab 1)', '14:00 — History (Room 111)'],
        Thursday: ['10:00 — Discrete Math (Room 205)', '15:00 — Web Dev (Room 301)'],
        Friday: ['08:00 — Practicum (Lab)', '11:00 — Seminar (Room 99)']
    };
    function renderScheduleFull() {
        const container = $('#scheduleList');
        if (!container) return;
        const weekday = new Date().toLocaleDateString(undefined, { weekday: 'long' });
        const slots = scheduleData[weekday] || [];
        container.innerHTML = `<h4 class="muted">${weekday}</h4>` + (slots.length ? `<ul>${slots.map(s => `<li>${escapeHtml(s)}</li>`).join('')}</ul>` : `<div class="muted">No classes today</div>`);
    }
    renderScheduleFull();

    // ------- Tasks (mini) -------
    const tasksKey = LS.tasks;
    const taskInput = $('#taskInput');
    const addTaskBtn = $('#addTaskBtn');
    const tasksListEl = $('#tasksList');
    function saveTasks() { localStorage.setItem(tasksKey, JSON.stringify(tasks)); }
    function renderTasks() { if (!tasksListEl) return; tasksListEl.innerHTML = tasks.length ? tasks.map((t, i) => `<li class="${t.done ? 'done' : ''}"><span>${escapeHtml(t.title)}</span><div><button data-toggle="${i}">✓</button> <button data-del="${i}">✖</button></div></li>`).join('') : '<div class="muted">No tasks</div>'; }
    renderTasks();
    addTaskBtn && addTaskBtn.addEventListener('click', () => { const v = (taskInput && taskInput.value || '').trim(); if (!v)     // ------- Notification System -------
    function showNotification(message, type = 'success') {
        const toast = $('#notificationToast');
        const messageEl = $('.toast-message');
        const iconEl = $('.toast-icon');
        
        if (!toast || !messageEl) return;
        
        messageEl.textContent = message;
        
        // Update icon based on type
        if (iconEl) {
            if (type === 'success') {
                iconEl.innerHTML = '<path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>';
                iconEl.style.color = 'var(--success)';
            } else if (type === 'error') {
                iconEl.innerHTML = '<path d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"/>';
                iconEl.style.color = 'var(--danger)';
            } else if (type === 'warning') {
                iconEl.innerHTML = '<path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"/>';
                iconEl.style.color = 'var(--warning)';
            }
        }
        
        toast.classList.add('show');
        
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }

    // ------- Search functionality -------
    const searchInput = $('#searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase().trim();
            if (query.length < 2) return;
            
            // Search through announcements
            const matchingAnnouncements = ANNOUNCEMENTS.filter(a => 
                a.title.toLowerCase().includes(query) || 
                a.body.toLowerCase().includes(query)
            );
            
            // Search through courses
            const matchingCourses = CATALOG.filter(c => 
                c.code.toLowerCase().includes(query) || 
                c.name.toLowerCase().includes(query) ||
                c.instructor.toLowerCase().includes(query)
            );
            
            // Show search results (you could create a search results modal here)
            console.log('Search results:', { announcements: matchingAnnouncements, courses: matchingCourses });
        });
    }

    // ------- init UI (nav, widgets, customize drawer contents) -------
    function initWidgetsForm() {    tasksListEl && tasksListEl.addEventListener('click', e => { const t = e.target; if (t.matches('[data-toggle]')) { const i = +t.dataset.toggle; tasks[i].done = !tasks[i].done; saveTasks(); renderTasks(); } if (t.matches('[data-del]')) { const i = +t.dataset.del; if (confirm('Delete task?')) { tasks.splice(i, 1); saveTasks(); renderTasks(); } } });

    // ------- init UI (nav, widgets, customize drawer contents) -------
    function initWidgetsForm() {
        widgetsForm.innerHTML = '';
        WIDGETS.forEach(w => {
            const label = document.createElement('label');
            const checked = activeWidgets.includes(w.id) ? 'checked' : '';
            label.innerHTML = `<input type="checkbox" name="widget" value="${w.id}" ${checked}/> ${w.label}`;
            widgetsForm.appendChild(label);
        });
    }
    initWidgetsForm();

    // when customize form changes -> update widgets live
    widgetsForm.addEventListener('change', () => {
        const checked = Array.from(widgetsForm.querySelectorAll('input[name="widget"]:checked')).map(i => i.value);
        if (checked.length === 0) {
            // prevent empty selection
            Array.from(widgetsForm.querySelectorAll('input[name="widget"]')).forEach(i => i.checked = activeWidgets.includes(i.value));
            return;
        }
        activeWidgets = checked;
        localStorage.setItem(LS.widgets, JSON.stringify(activeWidgets));
        renderWidgetsGrid();
    });

    // close drawer clicking outside
    document.addEventListener('click', e => {
        if (!customizeDrawer.classList.contains('open')) return;
        const inside = customizeDrawer.contains(e.target) || openCustomizeBtns.some(b => b && b.contains(e.target));
        if (!inside) customizeDrawer.classList.remove('open');
    });

    // open/close helper
    function openCustomizeDrawer() {
        initWidgetsForm();
        customizeDrawer.classList.add('open');
        customizeDrawer.setAttribute('aria-hidden', 'false');
    }
    function closeCustomizeDrawer() {
        customizeDrawer.classList.remove('open');
        customizeDrawer.setAttribute('aria-hidden', 'true');
    }

    // clicking close button
    $('#closeCustomize') && $('#closeCustomize').addEventListener('click', closeCustomizeDrawer);

    // ---------- small helpers ----------
    document.addEventListener('keydown', e => { if (e.key === '/' && !['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) { e.preventDefault(); const t = $('#taskInput'); if (t) t.focus(); } });
    window.addEventListener('resize', () => { if (window.innerWidth > 900) sidebar.classList.remove('active'); });

    // expose for debugging
    window._SP = { STUDENT, ANNOUNCEMENTS, activeWidgets, ledger, enrollment };

})();
