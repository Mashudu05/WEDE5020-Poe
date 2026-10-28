/* ==========================================================
   Olive & Oak Café — Forms
   contact.html : validate -> build an email (mailto) to send
   enquiry.html : validate -> availability + cost response
                  -> submit with AJAX (fetch)
   ========================================================== */
'use strict';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^(0\d{9}|\+27\d{9})$/;

document.addEventListener('DOMContentLoaded', function () {
    initContactForm();
    initEnquiryForm();
});

/* ----- Shared helpers ----- */
function byId(id) { return document.getElementById(id); }
function cleanLine(s) { return s.replace(/[\u0000-\u001F\u007F]/g, ' ').replace(/\s+/g, ' ').trim(); }
function cleanText(s) { return s.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '').trim(); }

// Show or clear an error for one validation item
function applyResult(item, message) {
    const err = byId(item.errorId || item.field.id + '-error');
    if (message) {
        item.field.classList.add('invalid');
        item.field.setAttribute('aria-invalid', 'true');
        if (err) err.textContent = message;
    } else {
        item.field.classList.remove('invalid');
        item.field.removeAttribute('aria-invalid');
        if (err) err.textContent = '';
    }
    return message;
}

// Live (client-side) validation as the user moves through the form
function bindValidation(items) {
    Object.keys(items).forEach(function (key) {
        const item = items[key];
        (item.targets || [item.field]).forEach(function (target) {
            if (item.eager) {
                target.addEventListener('change', function () { applyResult(item, item.check()); });
                return;
            }
            target.addEventListener('blur', function () { applyResult(item, item.check()); });
            ['input', 'change'].forEach(function (evt) {
                target.addEventListener(evt, function () {
                    if (item.field.classList.contains('invalid')) applyResult(item, item.check());
                });
            });
        });
    });
}

// Validate everything; returns the first invalid field (or null)
function validateItems(items) {
    let first = null;
    Object.keys(items).forEach(function (key) {
        const item = items[key];
        if (item.skip && item.skip()) { applyResult(item, ''); return; }
        if (applyResult(item, item.check()) && !first) first = item.field;
    });
    return first;
}

function nameCheck(field) {
    return function () {
        const v = cleanLine(field.value);
        if (v.length < 2) return 'Please enter your full name (at least 2 characters).';
        if (v.length > 80) return 'Please keep your name under 80 characters.';
        return '';
    };
}
function emailCheck(field) {
    return function () { return EMAIL_RE.test(field.value.trim()) ? '' : 'Enter a valid email address, e.g. name@example.com.'; };
}
function phoneCheck(field, required) {
    return function () {
        const v = field.value.replace(/[\s-]/g, '');
        if (!v) return required ? 'Please enter your phone number.' : '';
        return PHONE_RE.test(v) ? '' : 'Enter a valid SA number, e.g. 082 123 4567 or +27 82 123 4567.';
    };
}

/* ==========================================================
   CONTACT FORM — builds an email the visitor can send
   ========================================================== */
function initContactForm() {
    const form = byId('contactForm');
    if (!form) return;

    const f = {
        name: byId('name'), email: byId('email'), phone: byId('phone'),
        type: byId('messageType'), message: byId('message')
    };
    const summary = byId('formSummary');
    const counter = byId('message-count');
    const preview = byId('emailPreview');

    const items = {
        name: { field: f.name, check: nameCheck(f.name) },
        email: { field: f.email, check: emailCheck(f.email) },
        phone: { field: f.phone, check: phoneCheck(f.phone, false) },
        type: { field: f.type, check: function () { return f.type.value ? '' : 'Please choose what your message is about.'; } },
        message: { field: f.message, check: function () {
            const len = cleanText(f.message.value).length;
            if (len < 10) return 'Please write at least 10 characters so we can help.';
            if (len > 1000) return 'Please keep your message under 1000 characters.';
            return '';
        } }
    };
    bindValidation(items);

    f.message.addEventListener('input', function () { counter.textContent = f.message.value.length + ' / 1000'; });

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        summary.textContent = '';
        preview.hidden = true;
        if (byId('website').value) return;   // honeypot: bots fill this in

        const firstBad = validateItems(items);
        if (firstBad) {
            summary.textContent = 'Please fix the highlighted fields and try again.';
            firstBad.focus();
            return;
        }

        const name = cleanLine(f.name.value);
        const typeLabel = f.type.options[f.type.selectedIndex].text;
        const phone = cleanLine(f.phone.value) || 'not provided';
        const subject = typeLabel + ' – message from ' + name;
        const body = 'Hi ' + OO.name + ' team,\n\n' + cleanText(f.message.value) +
            '\n\nKind regards,\n' + name + '\nEmail: ' + f.email.value.trim() + '\nPhone: ' + phone;

        byId('previewTo').textContent = OO.email;
        byId('previewSubject').textContent = subject;
        byId('previewBody').textContent = body;
        byId('sendEmailLink').href = 'mailto:' + OO.email + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
        preview.hidden = false;
        preview.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });

    byId('editMessage').addEventListener('click', function () {
        preview.hidden = true;
        f.message.focus();
    });
}

/* ==========================================================
   ENQUIRY FORM — availability + cost, then AJAX submission
   ========================================================== */
const ENQUIRY_RULES = {
    reservation: { label: 'Table reservation', min: 1, max: 20, notice: 0, lastBefore: 30 },
    function: { label: 'Private function', min: 10, max: 60, notice: 3, lastBefore: 120 },
    catering: { label: 'Catering order', min: 10, max: 200, notice: 2, lastBefore: 30 }
};

function initEnquiryForm() {
    const form = byId('enquiryForm');
    if (!form) return;

    const f = {
        name: byId('name'), email: byId('email'), phone: byId('phone'), type: byId('enquiryType'),
        pkg: byId('package'), date: byId('date'), time: byId('time'), guests: byId('guests'),
        message: byId('message'), consent: byId('consent'),
        prefEmail: byId('contactPref-email'), prefPhone: byId('contactPref-phone')
    };
    const pkgGroup = byId('packageGroup');
    const summary = byId('formSummary');
    const result = byId('enquiryResult');
    const submitBtn = form.querySelector('button[type="submit"]');

    // Date limits: today (SA time) up to one year ahead
    const today = nowInSA();
    f.date.min = dateString(today);
    f.date.max = dateString(new Date(today.getFullYear() + 1, today.getMonth(), today.getDate()));

    // Package choices come from the shared data
    Object.keys(OO.packages).forEach(function (key) {
        const opt = document.createElement('option');
        opt.value = key;
        opt.textContent = OO.packages[key].label + ' – ' + formatRand(OO.packages[key].price) + ' pp';
        f.pkg.appendChild(opt);
    });

    // Price guide beside the form is also built from the shared data
    const guide = byId('priceGuide');
    if (guide) {
        const rows = Object.keys(OO.packages).map(function (key) {
            return [OO.packages[key].label + ' (functions & catering)', formatRand(OO.packages[key].price) + ' pp'];
        });
        rows.push(['Private function venue fee', formatRand(OO.venueFee)]);
        rows.push(['Booking deposit (functions & catering)', Math.round(OO.depositRate * 100) + '%']);
        rows.forEach(function (r) {
            const li = document.createElement('li');
            const a = document.createElement('span');
            a.textContent = r[0];
            const b = document.createElement('strong');
            b.textContent = r[1];
            li.append(a, b);
            guide.appendChild(li);
        });
    }

    function needsPackage() { return f.type.value === 'function' || f.type.value === 'catering'; }

    const items = {
        name: { field: f.name, check: nameCheck(f.name) },
        email: { field: f.email, check: emailCheck(f.email) },
        phone: { field: f.phone, check: phoneCheck(f.phone, true) },
        type: { field: f.type, check: function () { return f.type.value ? '' : 'Please choose what you are enquiring about.'; } },
        pkg: { field: f.pkg, skip: function () { return !needsPackage(); },
               check: function () { return f.pkg.value ? '' : 'Please choose a package.'; } },
        date: { field: f.date, check: function () {
            if (!f.date.value) return 'Please choose a date.';
            if (f.date.value < f.date.min) return 'Please choose today or a later date.';
            if (f.date.value > f.date.max) return 'Please choose a date within the next 12 months.';
            return '';
        } },
        time: { field: f.time, check: function () { return f.time.value ? '' : 'Please choose a time.'; } },
        guests: { field: f.guests, check: function () {
            const rule = ENQUIRY_RULES[f.type.value] || ENQUIRY_RULES.reservation;
            const n = Number(f.guests.value);
            if (!f.guests.value || !Number.isInteger(n)) return 'Please enter a whole number of guests.';
            if (n < rule.min || n > rule.max) return rule.label + 's are for ' + rule.min + ' to ' + rule.max + ' guests.';
            return '';
        } },
        pref: { field: f.prefEmail, targets: [f.prefEmail, f.prefPhone], errorId: 'contactPref-error', eager: true,
                check: function () { return (f.prefEmail.checked || f.prefPhone.checked) ? '' : 'Please choose how we should reply.'; } },
        message: { field: f.message, check: function () {
            return cleanText(f.message.value).length > 500 ? 'Please keep your message under 500 characters.' : '';
        } },
        consent: { field: f.consent, eager: true, check: function () {
            return f.consent.checked ? '' : 'We need your permission to use your details to reply.';
        } }
    };
    bindValidation(items);

    // Adjust the form when the enquiry type changes (DOM manipulation)
    f.type.addEventListener('change', function () {
        const rule = ENQUIRY_RULES[f.type.value];
        pkgGroup.hidden = !needsPackage();
        f.pkg.required = needsPackage();
        if (rule) {
            f.guests.min = rule.min;
            f.guests.max = rule.max;
            byId('guests-hint').textContent = rule.label + 's: ' + rule.min + ' to ' + rule.max + ' guests.';
        }
        if (f.guests.value) applyResult(items.guests, items.guests.check());
        if (f.pkg.classList.contains('invalid')) applyResult(items.pkg, needsPackage() ? items.pkg.check() : '');
    });

    form.addEventListener('submit', async function (e) {
        e.preventDefault();
        summary.textContent = '';
        result.replaceChildren();
        if (byId('website').value) return;   // honeypot

        const firstBad = validateItems(items);
        if (firstBad) {
            summary.textContent = 'Please fix the highlighted fields and try again.';
            firstBad.focus();
            return;
        }

        const data = {
            type: f.type.value,
            name: cleanLine(f.name.value),
            email: f.email.value.trim(),
            phone: f.phone.value.replace(/[\s-]/g, ''),
            package: needsPackage() ? f.pkg.value : '',
            date: f.date.value,
            time: f.time.value,
            guests: Number(f.guests.value),
            contactPref: f.prefEmail.checked ? 'email' : 'phone',
            message: cleanText(f.message.value)
        };

        const outcome = evaluateEnquiry(data);
        data.reference = outcome.reference;
        data.estimatedTotal = outcome.total;

        const panel = renderOutcome(data, outcome);
        result.appendChild(panel);
        panel.scrollIntoView({ behavior: 'smooth', block: 'center' });
        panel.focus();

        if (!outcome.available) return;   // nothing to submit — they need to pick another slot

        // AJAX submission
        const status = panel.querySelector('.send-status');
        submitBtn.disabled = true;
        const originalLabel = submitBtn.textContent;
        submitBtn.textContent = 'Sending…';
        status.textContent = 'Sending your enquiry to our team…';
        const sent = await submitEnquiry(form.action, data);
        submitBtn.disabled = false;
        submitBtn.textContent = originalLabel;
        if (sent) {
            status.className = 'send-status ok';
            status.textContent = '✓ Your enquiry has been sent. We will reply by ' + data.contactPref + ' within one business day.';
            form.reset();
            pkgGroup.hidden = true;
        } else {
            status.className = 'send-status fail';
            status.textContent = 'We could not send your enquiry just now. Your quote above is saved on this page — please try again or email ' + OO.email + ' quoting ' + data.reference + '.';
        }
    });
}

/* ----- Availability and cost ----- */
function evaluateEnquiry(d) {
    const rule = ENQUIRY_RULES[d.type];
    const issues = [];
    const now = nowInSA();
    const dateObj = parseDate(d.date);
    const day = dateObj.getDay();
    const hours = OO.hours[day];
    const parts = d.time.split(':');
    const mins = parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10);
    const noticeDays = Math.round((dateObj - parseDate(dateString(now))) / 86400000);
    const pretty = prettyDate(dateObj);

    if (OO.closedDates.indexOf(d.date) !== -1) {
        issues.push('We are closed on ' + pretty + ' (public holiday). The next day we are open is ' + prettyDate(nextOpenDay(dateObj)) + '.');
    } else {
        if (mins < hours[0] || mins > hours[1] - rule.lastBefore) {
            issues.push('On ' + DAY_NAMES[day] + 's we are open ' + fmtTime(hours[0]) + '–' + fmtTime(hours[1]) +
                '. For a ' + rule.label.toLowerCase() + ', please choose a start time between ' + fmtTime(hours[0]) + ' and ' + fmtTime(hours[1] - rule.lastBefore) + '.');
        }
        if (noticeDays < rule.notice) {
            issues.push(rule.label + 's need at least ' + rule.notice + ' days’ notice.');
        }
        if (d.type === 'reservation' && noticeDays === 0 && mins < now.getHours() * 60 + now.getMinutes() + 60) {
            issues.push('Same-day table bookings need at least one hour’s notice.');
        }
    }

    const lines = [];
    let total = 0;
    if (d.type === 'reservation') {
        if (d.guests >= 9) {
            const deposit = d.guests * OO.tableDeposit;
            lines.push({ label: 'Refundable deposit (' + d.guests + ' × ' + formatRand(OO.tableDeposit) + ')', amount: deposit });
            total = deposit;
        }
    } else {
        const pkg = OO.packages[d.package];
        if (d.type === 'function') {
            lines.push({ label: 'Venue fee', amount: OO.venueFee });
            total += OO.venueFee;
        }
        const food = d.guests * pkg.price;
        lines.push({ label: pkg.label + ' (' + d.guests + ' × ' + formatRand(pkg.price) + ')', amount: food });
        total += food;
    }

    return {
        available: issues.length === 0,
        issues: issues,
        lines: lines,
        total: total,
        deposit: d.type === 'reservation' ? 0 : Math.round(total * OO.depositRate),
        reference: 'OO-' + Math.random().toString(36).slice(2, 8).toUpperCase(),
        when: pretty + ' at ' + d.time
    };
}

function prettyDate(d) {
    return d.toLocaleDateString('en-ZA', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
}

function nextOpenDay(d) {
    for (let i = 1; i <= 14; i++) {
        const next = new Date(d.getFullYear(), d.getMonth(), d.getDate() + i);
        if (OO.closedDates.indexOf(dateString(next)) === -1) return next;
    }
    return d;
}

/* ----- Result panel (built with DOM methods, no HTML strings) ----- */
function renderOutcome(d, o) {
    const rule = ENQUIRY_RULES[d.type];
    const panel = document.createElement('div');
    panel.className = 'result-panel' + (o.available ? '' : ' no');
    panel.tabIndex = -1;

    const h = document.createElement('h3');
    h.textContent = o.available ? 'Good news — we have space' : 'We can’t confirm that slot';
    const ref = document.createElement('p');
    const refLabel = document.createElement('span');
    refLabel.textContent = 'Reference: ';
    const refValue = document.createElement('span');
    refValue.className = 'result-ref';
    refValue.textContent = o.reference;
    ref.append(refLabel, refValue);
    panel.append(h, ref);

    const summary = document.createElement('p');
    summary.textContent = rule.label + ' for ' + d.guests + (d.guests === 1 ? ' guest' : ' guests') + ' on ' + o.when + '.';
    panel.appendChild(summary);

    if (!o.available) {
        const list = document.createElement('ul');
        list.className = 'issue-list';
        o.issues.forEach(function (text) {
            const li = document.createElement('li');
            li.textContent = text;
            list.appendChild(li);
        });
        panel.appendChild(list);
        const tip = document.createElement('p');
        tip.textContent = 'Please change the date or time above and submit again.';
        panel.appendChild(tip);
        return panel;
    }

    if (o.lines.length === 0) {
        const free = document.createElement('p');
        free.textContent = 'There is no charge for your table reservation.';
        panel.appendChild(free);
    } else {
        const table = document.createElement('table');
        table.className = 'quote-table';
        o.lines.forEach(function (line) { table.appendChild(quoteRow(line.label, formatRand(line.amount), '')); });
        table.appendChild(quoteRow(d.type === 'reservation' ? 'Refundable deposit due' : 'Estimated total', formatRand(o.total), 'total'));
        panel.appendChild(table);
        if (o.deposit) {
            const dep = document.createElement('p');
            dep.textContent = 'A ' + Math.round(OO.depositRate * 100) + '% deposit (' + formatRand(o.deposit) + ') secures your booking. Final prices are confirmed by our team.';
            panel.appendChild(dep);
        }
    }

    const status = document.createElement('p');
    status.className = 'send-status';
    status.setAttribute('role', 'status');
    panel.appendChild(status);
    return panel;
}

function quoteRow(label, value, cls) {
    const tr = document.createElement('tr');
    if (cls) tr.className = cls;
    const a = document.createElement('td');
    a.textContent = label;
    const b = document.createElement('td');
    b.textContent = value;
    tr.append(a, b);
    return tr;
}

/* ----- AJAX submission (fetch) ----- */
async function submitEnquiry(url, payload) {
    const controller = new AbortController();
    const timer = setTimeout(function () { controller.abort(); }, 8000);
    try {
        const res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify(payload),
            signal: controller.signal
        });
        return res.ok;
    } catch (err) {
        return false;
    } finally {
        clearTimeout(timer);
    }
}
