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
        tuitionPaid: 27500 // so outstanding 12500
    };

    const ANNOUNCEMENTS = [
        { id: 1, title: 'Semester registration opens', date: Date.now() - 86400000 * 2, body: 'Register Oct 15–20', unread: true },
        { id: 2, title: 'Library hours extended', date: Date.now() - 1000 * 60 * 60 * 8, body: 'Open until 10PM during exam week', unread: true },
        { id: 3, title: 'Hackathon this weekend', date: Date.now() - 1000 * 60 * 60 * 40, body: 'Bring your laptop and idea', unread: true }
    ];

    const GRADE_LABELS = ['CS101', 'MATH201', 'CS102', 'WEB303', 'ENG101'];
    const GRADE_VALUES = [88, 76, 92, 81, 85];

    const CATALOG = [
        { code: 'CS101', name: 'Intro to Programming', credits: 3, schedule: 'Mon 08:00' },
        { code: 'CS102', name: 'Data Structures', credits: 4, schedule: 'Tue 09:00' },
        { code: 'WEB303', name: 'Web Development', credits: 3, schedule: 'Thu 15:00' },
        { code: 'MATH201', name: 'Discrete Math', credits: 3, schedule: 'Wed 10:00' },
        { code: 'ENG101', name: 'Academic Writing', credits: 2, schedule: 'Fri 11:00' }
    ];

    // default widgets selection
    const DEFAULT_WIDGETS = ['gpa', 'tuition', 'nextClass', 'announcements', 'weather', 'quote'];

    // available widgets (id and label)
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
        { id: 'pomodoro', label: 'Pomodoro (mini)' }
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
        if (t === 'dark') document.documentElement.setAttribute('data-theme', 'dark'); else document.documentElement.removeAttribute('data-theme');
        localStorage.setItem(LS.theme, t);
    });

    // ------- Announcements (badge) -------
    function renderAnnouncementsList() {
        const out = $('#annList');
        if (!out) return;
        out.innerHTML = ANNOUNCEMENTS.map(a => `<li><strong>${escapeHtml(a.title)}</strong><div class="muted small">${timeAgo(a.date)}${a.unread ? ' • <strong style="color:var(--primary)">New</strong>' : ''}</div><div class="muted small" style="margin-top:6px">${escapeHtml(a.body)}</div></li>`).join('');
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
                el.innerHTML = `<h3><svg class="icon" viewBox="0 0 24 24" aria-hidden><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg> Clock & Date</h3>
          <div id="widgetClock" style="font-weight:700;margin-top:8px">${new Date().toLocaleString()}</div>`;
                break;

            case 'pomodoro':
                el.innerHTML = `<h3><svg class="icon" viewBox="0 0 24 24" aria-hidden><path d="M12 2v4"/></svg> Pomodoro</h3>
          <div id="miniPomTimer" style="font-weight:700;font-size:20px">25:00</div><div style="margin-top:8px"><button id="miniPomStart" class="btn-primary">Start</button> <button id="miniPomStop" class="btn-ghost">Stop</button></div>`;
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
                el.innerHTML = `<h3><svg class="icon" viewBox="0 0 24 24" aria-hidden><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg> Clock & Date</h3>
          <div id="widgetClock" style="font-weight:700;margin-top:8px">${new Date().toLocaleString()}</div>`;
                break;
            case 'pomodoro':
                el.innerHTML = `<h3><svg class="icon" viewBox="0 0 24 24" aria-hidden><path d="M12 2v4"/></svg> Pomodoro</h3>
          <div id="miniPomTimer" style="font-weight:700;font-size:20px">25:00</div><div style="margin-top:8px"><button id="miniPomStart" class="btn-primary">Start</button> <button id="miniPomStop" class="btn-ghost">Stop</button></div>`;
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
                interval = setInterval(() => { remaining--; miniPomTimer.textContent = fmtTime(remaining); if (remaining <= 0) { clearInterval(interval); interval = null; remaining = 25 * 60; alert('Pomodoro finished (mock)'); miniPomTimer.textContent = fmtTime(remaining); } }, 1000);
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
        if (!inside) closeCustomizeDrawer();
    });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeCustomizeDrawer(); });

    // ------- Enrollment (realistic) -------
    const catalogListEl = $('#catalogList');
    const selectionListEl = $('#selectionList');
    const selectedCreditsEl = $('#selectedCredits');
    function renderCatalog() {
        catalogListEl.innerHTML = CATALOG.map(c => {
            const disabled = enrollment.enrolled.some(e => e.code === c.code) || enrollment.selected.some(s => s.code === c.code);
            return `<li><div><strong>${c.code}</strong><div class="meta">${escapeHtml(c.name)} • ${c.credits} cr • ${escapeHtml(c.schedule)}</div></div><div><button data-select="${c.code}" class="btn-primary" ${disabled ? 'disabled' : ''}>Select</button></div></li>`;
        }).join('');
    }
    function renderSelection() {
        selectionListEl.innerHTML = enrollment.selected.length ? enrollment.selected.map((s, i) => `<li><div><strong>${s.code}</strong><div class="meta">${escapeHtml(s.name)} • ${s.credits} cr</div></div><div><button data-remove="${i}" class="btn-ghost">Remove</button></div></li>`).join('') : '<div class="muted">No courses selected</div>';
        selectedCreditsEl.textContent = enrollment.selected.reduce((sum, s) => sum + (Number(s.credits) || 0), 0);
    }
    renderCatalog(); renderSelection();

    // catalog select / remove
    document.addEventListener('click', e => {
        const sel = e.target.closest('[data-select]');
        if (sel) {
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
            renderCatalog(); renderSelection();
        }
    });

    $('#submitEnrollment') && $('#submitEnrollment').addEventListener('click', () => {
        if (!enrollment.selected.length) return alert('No courses selected');
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
        const amt = parseFloat($('#paymentAmount').value || '0');
        const dateStr = $('#paymentDate').value || new Date().toISOString().slice(0, 10);
        const desc = ($('#paymentDesc').value || 'Payment').trim();
        if (isNaN(amt) || amt <= 0) return alert('Enter a valid amount');
        ledger.transactions.push({ date: new Date(dateStr).getTime(), desc, debit: 0, credit: amt });
        localStorage.setItem(LS.ledger, JSON.stringify(ledger));
        $('#paymentAmount').value = ''; $('#paymentDate').value = ''; $('#paymentDesc').value = '';
        $('#paymentForm').style.display = 'none'; renderLedger(); alert('Payment recorded (mock)');
    });

    // ledger remove
    $('#ledgerTable tbody').addEventListener('click', e => {
        const but = e.target.closest('button[data-del]');
        if (!but) return;
        const key = +but.getAttribute('data-del');
        if (!confirm('Remove this ledger entry?')) return;
        ledger.transactions = ledger.transactions.filter(t => t.date !== key);
        localStorage.setItem(LS.ledger, JSON.stringify(ledger));
        renderLedger();
    });

    // ------- Grades chart (main) -------
    if ($('#detailedGrades')) {
        new Chart($('#detailedGrades').getContext('2d'), { type: 'bar', data: { labels: GRADE_LABELS, datasets: [{ label: 'Grade', data: GRADE_VALUES, backgroundColor: 'rgba(47,110,242,0.85)', borderRadius: 6 }] }, options: { responsive: true, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, max: 100 } } } });
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
    addTaskBtn && addTaskBtn.addEventListener('click', () => { const v = (taskInput && taskInput.value || '').trim(); if (!v) return; tasks.unshift({ title: v, done: false }); saveTasks(); renderTasks(); taskInput.value = ''; });
    tasksListEl && tasksListEl.addEventListener('click', e => { const t = e.target; if (t.matches('[data-toggle]')) { const i = +t.dataset.toggle; tasks[i].done = !tasks[i].done; saveTasks(); renderTasks(); } if (t.matches('[data-del]')) { const i = +t.dataset.del; if (confirm('Delete task?')) { tasks.splice(i, 1); saveTasks(); renderTasks(); } } });

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
