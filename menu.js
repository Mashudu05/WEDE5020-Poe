/* ==========================================================
   Olive & Oak Café — Dynamic menu
   - Builds menu cards from MENU_ITEMS (site-data.js) with the DOM
   - Search, category filter and sort
   - Item details modal
   - Featured dishes on the home page
   ========================================================== */
'use strict';

let activeModal = null;

document.addEventListener('DOMContentLoaded', function () {
    initFeatured();
    initMenuPage();
});

function createMenuCard(item) {
    const card = document.createElement('article');
    card.className = 'menu-card reveal';

    const head = document.createElement('div');
    head.className = 'menu-card-head';
    const title = document.createElement('h3');
    title.textContent = item.name;
    const price = document.createElement('span');
    price.className = 'menu-price';
    price.textContent = formatRand(item.price);
    head.append(title, price);

    const desc = document.createElement('p');
    desc.textContent = item.description;

    const tags = document.createElement('div');
    tags.className = 'tag-row';
    tags.append(makeTag(item.category, ''));
    item.tags.forEach(function (t) { tags.append(makeTag(t.charAt(0).toUpperCase() + t.slice(1), 'tag-dietary')); });

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'btn btn-secondary btn-small details-btn';
    btn.textContent = 'View details';
    btn.setAttribute('aria-label', 'View details for ' + item.name);
    btn.dataset.id = item.id;

    card.append(head, desc, tags, btn);
    return card;
}

function makeTag(text, extraClass) {
    const span = document.createElement('span');
    span.className = ('tag ' + extraClass).trim();
    span.textContent = text;
    return span;
}

/* ----- Featured dishes (home page) ----- */
function initFeatured() {
    const grid = document.getElementById('featuredItems');
    if (!grid) return;
    MENU_ITEMS.filter(function (i) { return i.featured; }).forEach(function (item) { grid.appendChild(createMenuCard(item)); });
    wireDetailButtons(grid);
    revealElements(grid);
}

/* ----- Full menu page ----- */
function initMenuPage() {
    const grid = document.getElementById('menuGrid');
    if (!grid) return;

    const searchInput = document.getElementById('menuSearch');
    const sortSelect = document.getElementById('menuSort');
    const filterBox = document.getElementById('menuFilters');
    const count = document.getElementById('menuCount');
    const state = { category: 'All', query: '', sort: 'featured' };

    // Category buttons are generated from the data
    const categories = ['All'].concat(MENU_ITEMS.map(function (i) { return i.category; })
        .filter(function (c, idx, arr) { return arr.indexOf(c) === idx; }));
    categories.forEach(function (cat) {
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'filter-btn' + (cat === 'All' ? ' active' : '');
        b.textContent = cat;
        b.dataset.category = cat;
        b.setAttribute('aria-pressed', String(cat === 'All'));
        filterBox.appendChild(b);
    });

    function visibleItems() {
        const q = state.query.trim().toLowerCase();
        const list = MENU_ITEMS.filter(function (i) {
            const inCategory = state.category === 'All' || i.category === state.category;
            const haystack = [i.name, i.description, i.category].concat(i.tags).join(' ').toLowerCase();
            return inCategory && (!q || haystack.indexOf(q) !== -1);
        });
        if (state.sort === 'price-asc') list.sort(function (a, b) { return a.price - b.price; });
        if (state.sort === 'price-desc') list.sort(function (a, b) { return b.price - a.price; });
        if (state.sort === 'name') list.sort(function (a, b) { return a.name.localeCompare(b.name); });
        return list;
    }

    function render() {
        const list = visibleItems();
        grid.replaceChildren();
        if (list.length === 0) {
            const msg = document.createElement('div');
            msg.className = 'no-results';
            const p = document.createElement('p');
            p.textContent = 'No dishes match “' + state.query.trim() + '”. Try another search or clear the filters.';
            const clear = document.createElement('button');
            clear.type = 'button';
            clear.className = 'btn btn-secondary btn-small';
            clear.textContent = 'Clear search and filters';
            clear.addEventListener('click', reset);
            msg.append(p, clear);
            grid.appendChild(msg);
        } else {
            list.forEach(function (item) { grid.appendChild(createMenuCard(item)); });
            revealElements(grid);
        }
        count.textContent = 'Showing ' + list.length + (list.length === 1 ? ' item' : ' items');
    }

    function reset() {
        state.category = 'All';
        state.query = '';
        state.sort = 'featured';
        searchInput.value = '';
        sortSelect.value = 'featured';
        setActiveCategory('All');
        render();
    }

    function setActiveCategory(cat) {
        filterBox.querySelectorAll('.filter-btn').forEach(function (b) {
            const on = b.dataset.category === cat;
            b.classList.toggle('active', on);
            b.setAttribute('aria-pressed', String(on));
        });
    }

    filterBox.addEventListener('click', function (e) {
        const btn = e.target.closest('.filter-btn');
        if (!btn) return;
        state.category = btn.dataset.category;
        setActiveCategory(state.category);
        render();
    });

    let timer = null;
    searchInput.addEventListener('input', function () {
        clearTimeout(timer);
        timer = setTimeout(function () { state.query = searchInput.value; render(); }, 150);
    });
    sortSelect.addEventListener('change', function () { state.sort = sortSelect.value; render(); });

    wireDetailButtons(grid);
    render();
}

function wireDetailButtons(grid) {
    grid.addEventListener('click', function (e) {
        const btn = e.target.closest('.details-btn');
        if (!btn) return;
        const item = MENU_ITEMS.find(function (i) { return i.id === btn.dataset.id; });
        if (item) openItemModal(item, btn);
    });
}

/* ----- Modal ----- */
function openItemModal(item, trigger) {
    closeItemModal();

    const modal = document.createElement('div');
    modal.className = 'modal';
    const dialog = document.createElement('div');
    dialog.className = 'modal-dialog';
    dialog.setAttribute('role', 'dialog');
    dialog.setAttribute('aria-modal', 'true');
    dialog.setAttribute('aria-labelledby', 'modalTitle');

    const close = document.createElement('button');
    close.type = 'button';
    close.className = 'modal-close';
    close.setAttribute('aria-label', 'Close');
    close.textContent = '×';

    const title = document.createElement('h2');
    title.id = 'modalTitle';
    title.textContent = item.name;
    const price = document.createElement('p');
    price.className = 'modal-price';
    price.textContent = formatRand(item.price);
    const desc = document.createElement('p');
    desc.textContent = item.description;
    const tags = document.createElement('div');
    tags.className = 'tag-row';
    tags.append(makeTag(item.category, ''));
    item.tags.forEach(function (t) { tags.append(makeTag(t.charAt(0).toUpperCase() + t.slice(1), 'tag-dietary')); });
    const note = document.createElement('p');
    note.className = 'hint';
    note.textContent = 'Have an allergy or dietary need? Please tell your server before ordering.';
    const link = document.createElement('a');
    link.className = 'btn btn-primary btn-small';
    link.href = 'enquiry.html';
    link.textContent = 'Book a table';

    dialog.append(close, title, price, desc, tags, note, link);
    modal.appendChild(dialog);
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
    close.focus();

    function onKey(e) {
        if (e.key === 'Escape') { closeItemModal(); return; }
        if (e.key === 'Tab') {   // keep focus inside the dialog
            const focusable = dialog.querySelectorAll('button, a[href]');
            const first = focusable[0];
            const last = focusable[focusable.length - 1];
            if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
            else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
        }
    }
    close.addEventListener('click', closeItemModal);
    modal.addEventListener('click', function (e) { if (e.target === modal) closeItemModal(); });
    document.addEventListener('keydown', onKey);
    activeModal = { modal: modal, trigger: trigger, onKey: onKey };
}

function closeItemModal() {
    if (!activeModal) return;
    document.removeEventListener('keydown', activeModal.onKey);
    activeModal.modal.remove();
    document.body.style.overflow = '';
    if (activeModal.trigger) activeModal.trigger.focus();
    activeModal = null;
}
