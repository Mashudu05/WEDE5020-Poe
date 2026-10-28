/* ==========================================================
   Olive & Oak Café — Site-wide scripts (all pages)
   1. Mobile navigation   2. Open/closed status   3. Footer year
   4. Scroll-reveal animation   5. Back-to-top button
   6. Gallery lightbox
   ========================================================== */
'use strict';

let revealObserver = null;

document.addEventListener('DOMContentLoaded', function () {
    initNavToggle();
    initOpenStatus();
    initYear();
    initReveal();
    initBackToTop();
    initLightbox();
});

/* ----- 1. Mobile navigation toggle ----- */
function initNavToggle() {
    const toggle = document.getElementById('navToggle');
    const menu = document.getElementById('navMenu');
    if (!toggle || !menu) return;

    function setOpen(open) {
        menu.classList.toggle('show', open);
        toggle.setAttribute('aria-expanded', String(open));
    }

    toggle.addEventListener('click', function () { setOpen(!menu.classList.contains('show')); });
    menu.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', function () { setOpen(false); }); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setOpen(false); });
    document.addEventListener('click', function (e) {
        if (!menu.contains(e.target) && !toggle.contains(e.target)) setOpen(false);
    });
}

/* ----- 2. "Open now" status (uses South African time) ----- */
function getOpenStatus() {
    const now = nowInSA();
    const mins = now.getHours() * 60 + now.getMinutes();
    const hours = OO.hours[now.getDay()];
    const closedToday = OO.closedDates.indexOf(dateString(now)) !== -1;

    if (!closedToday && mins >= hours[0] && mins < hours[1]) {
        return { open: true, text: 'Open now · closes at ' + fmtTime(hours[1]) };
    }
    if (!closedToday && mins < hours[0]) {
        return { open: false, text: 'Closed · opens today at ' + fmtTime(hours[0]) };
    }
    for (let i = 1; i <= 8; i++) {
        const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() + i);
        if (OO.closedDates.indexOf(dateString(d)) === -1) {
            const when = i === 1 ? 'tomorrow' : DAY_NAMES[d.getDay()];
            return { open: false, text: 'Closed · opens ' + when + ' at ' + fmtTime(OO.hours[d.getDay()][0]) };
        }
    }
    return { open: false, text: 'Closed' };
}

function initOpenStatus() {
    document.querySelectorAll('.open-status').forEach(function (el) {
        const status = getOpenStatus();
        el.textContent = status.text;
        el.classList.add(status.open ? 'is-open' : 'is-closed');
    });
}

/* ----- 3. Footer year ----- */
function initYear() {
    document.querySelectorAll('.js-year').forEach(function (el) { el.textContent = new Date().getFullYear(); });
}

/* ----- 4. Scroll-reveal animation ----- */
function initReveal() {
    if ('IntersectionObserver' in window) {
        revealObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    revealObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12 });
    }
    revealElements(document);
}

// Also called by menu.js for cards that are created dynamically
function revealElements(root) {
    root.querySelectorAll('.reveal:not(.is-visible)').forEach(function (el, i) {
        el.style.transitionDelay = (i % 4) * 90 + 'ms';   // stagger siblings
        if (revealObserver) { revealObserver.observe(el); } else { el.classList.add('is-visible'); }
    });
}

/* ----- 5. Back-to-top button (created with JavaScript) ----- */
function initBackToTop() {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'back-to-top';
    btn.setAttribute('aria-label', 'Back to top');
    btn.textContent = '↑';
    document.body.appendChild(btn);

    let ticking = false;
    window.addEventListener('scroll', function () {
        if (ticking) return;
        ticking = true;
        window.requestAnimationFrame(function () {
            btn.classList.toggle('show', window.scrollY > 400);
            ticking = false;
        });
    }, { passive: true });

    btn.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });
}

/* ----- 6. Gallery lightbox ----- */
function initLightbox() {
    const items = Array.from(document.querySelectorAll('.gallery-item'));
    if (items.length === 0) return;

    const overlay = document.createElement('div');
    overlay.className = 'lightbox';
    overlay.hidden = true;
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', 'Photo viewer');

    function makeButton(cls, label, symbol) {
        const b = document.createElement('button');
        b.type = 'button';
        b.className = cls;
        b.setAttribute('aria-label', label);
        b.textContent = symbol;
        return b;
    }
    const closeBtn = makeButton('lightbox-close', 'Close', '×');
    const prevBtn = makeButton('lightbox-prev', 'Previous photo', '❮');
    const nextBtn = makeButton('lightbox-next', 'Next photo', '❯');
    const figure = document.createElement('figure');
    const img = document.createElement('img');
    const caption = document.createElement('figcaption');
    figure.append(img, caption);
    overlay.append(closeBtn, prevBtn, figure, nextBtn);
    document.body.appendChild(overlay);

    let current = 0;
    let lastFocus = null;

    function show(index) {
        current = (index + items.length) % items.length;
        const source = items[current].querySelector('img');
        img.src = source.currentSrc || source.src;
        img.alt = source.alt;
        caption.textContent = items[current].querySelector('figcaption').textContent;
    }
    function open(index) {
        lastFocus = document.activeElement;
        show(index);
        overlay.hidden = false;
        document.body.style.overflow = 'hidden';
        closeBtn.focus();
    }
    function close() {
        overlay.hidden = true;
        document.body.style.overflow = '';
        if (lastFocus) lastFocus.focus();
    }

    items.forEach(function (item, i) { item.addEventListener('click', function () { open(i); }); });
    closeBtn.addEventListener('click', close);
    prevBtn.addEventListener('click', function () { show(current - 1); });
    nextBtn.addEventListener('click', function () { show(current + 1); });
    overlay.addEventListener('click', function (e) { if (e.target === overlay) close(); });
    document.addEventListener('keydown', function (e) {
        if (overlay.hidden) return;
        if (e.key === 'Escape') close();
        if (e.key === 'ArrowLeft') show(current - 1);
        if (e.key === 'ArrowRight') show(current + 1);
    });
}
