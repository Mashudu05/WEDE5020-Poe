# Olive & Oak Café — Website (PoE Part 3: Enhancing Functionality and SEO)

Website for **Olive & Oak Café**, a family-owned café serving all-day breakfast and
lunch made with locally sourced, farm-to-table ingredients. This repository contains
Parts 1 to 3 of the PoE: HTML structure, CSS styling, and JavaScript functionality with
SEO.

**Live site:** https://mashudu05.github.io/olive-oak-cafe/
**Repository:** https://github.com/Mashudu05/olive-oak-cafe

---

## 1. File structure

```
olive-oak-cafe/
├── index.html        Home (hero, open/closed status, featured dishes)
├── about.html        Our Story
├── menu.html         Dynamic menu (search, filter, sort, details modal)
├── gallery.html      Photo gallery with lightbox
├── enquiry.html      Enquiry form (availability + price estimate) and FAQ accordion
├── contact.html      Contact form (builds an email) and interactive map
├── robots.txt        Crawler instructions
├── sitemap.xml       List of pages for search engines
├── _headers          Security and caching headers (Netlify)
├── css/style.css     All styling
├── js/
│   ├── site-data.js  Shared data: menu items, opening hours, prices, contact details
│   ├── script.js     Site-wide: nav toggle, open status, scroll animation, back-to-top, lightbox
│   ├── menu.js       Dynamic menu, search/filter/sort, modal, featured dishes
│   ├── forms.js      Validation, quote/availability logic, mailto builder, AJAX
│   ├── faq.js        jQuery accordion
│   └── map.js        Leaflet map
├── vendor/           Self-hosted libraries: jQuery 3.7.1, Leaflet 1.9.4 (licences included)
└── images/           Photos (descriptive file names — see images/README.txt)
```

---

## 2. Part 3 functionality

### 2.1 Interactive elements
| Requirement | Implementation | Files |
|---|---|---|
| Accordion | FAQ accordion on the enquiry page using **jQuery** (`slideToggle`); one panel open at a time; `aria-expanded` kept in sync | `enquiry.html`, `js/faq.js` |
| Modal | Menu item details modal with focus trap, Escape/backdrop close, focus returned to the trigger | `js/menu.js` |
| Interactive map | **Leaflet** with OpenStreetMap tiles, marker + popup, scroll-zoom only after clicking the map, “Get directions” link | `contact.html`, `js/map.js` |
| Animations and transitions | CSS transitions (hover lift, button, accordion icon, image zoom); CSS keyframes (hero, modal, results); JavaScript scroll-reveal using `IntersectionObserver` with staggered delays; back-to-top button; all disabled when the visitor prefers reduced motion | `css/style.css`, `js/script.js` |
| Advanced DOM manipulation | Menu cards, filter buttons, price guide, quote tables, lightbox, modal and back-to-top button are all built with `createElement`; event delegation; `replaceChildren`; the form changes when the enquiry type changes. User text is always inserted with `textContent` | all `js/` files |
| Gallery with lightbox | Click a photo to enlarge; arrows, keyboard (← → Esc), click outside to close; focus management | `js/script.js` |

### 2.2 Dynamic content
- **Menu** (`menu.html`): all 15 dishes are loaded from the `MENU_ITEMS` array in `js/site-data.js` and rendered by JavaScript.
- **Search**: live search across name, description, category and dietary tags (150 ms debounce).
- **Filter**: category buttons are generated from the data.
- **Sort**: menu order, price low→high, price high→low, name A→Z.
- A “no results” message with a reset button, and an `aria-live` result count.
- **Home page**: “Customer Favourites” are loaded from the same data (items marked `featured`).
- **Open/closed status** is calculated from the opening hours using South African time, so it is correct for visitors in any time zone.

### 2.3 Forms
**`enquiry.html` — Make an Enquiry**
- Elements: `select`, `input` (text, email, tel, date, time, number), radio buttons, `textarea`, checkbox, honeypot field.
- HTML5 attributes: `required`, `minlength`, `maxlength`, `min`, `max`, `step`, `pattern`, `type`, `autocomplete`, `inputmode`.
- Form submission: `action="https://jsonplaceholder.typicode.com/posts"` `method="post"`.
- **JavaScript validation** (`novalidate` + custom checks): name length, email format, South African phone numbers (`0XXXXXXXXX` or `+27XXXXXXXXX`), date (not in the past, within 12 months), time, guest limits per enquiry type, package required for functions/catering, reply method, consent.
- **Error handling**: messages appear under each field (`aria-describedby`, `aria-invalid`), a summary message appears, and focus moves to the first invalid field. Fields validate on blur and re-check as the user fixes them.
- **Response** once validated — availability and cost:
  - Checks opening hours for that weekday, public-holiday closures, minimum notice (tables: same day with 1 hour notice; catering: 2 days; functions: 3 days) and last start time.
  - Cost estimate: venue fee + per-person package price, deposit (30%) for functions/catering, refundable R50 pp deposit for table groups of 9+.
  - If unavailable, explains why and what to change.
- **AJAX submission**: `fetch()` with a JSON body, 8-second timeout (`AbortController`), loading state on the button, and success/failure messages without reloading the page. If sending fails, the quote stays on screen.

**`contact.html` — Send Us a Message**
- Collects name, email, optional phone, message type (`select`) and a full message (`textarea`, 1000-character counter).
- Validated with the same JavaScript rules, then compiled into an **email**: To, Subject and Body are shown in a preview, and the visitor presses **Send email** to open their email app addressed to `hello@oliveandoakcafe.co.za` (`mailto:` link built with `encodeURIComponent`).

---

## 3. SEO

### 3.1 On-page SEO
| Requirement | What was done |
|---|---|
| Keyword research | See the keyword table below |
| Title tags and meta descriptions | Unique title (under 60 characters) and description (120–160 characters) on every page |
| Header tags | One `<h1>` per page, then `<h2>`/`<h3>` in order; footer titles are not headings so the outline stays clean |
| Image optimisation | Descriptive file names (e.g. `farm-breakfast-plate.jpg`), descriptive `alt` text, `width`/`height` set, `loading="lazy"` |
| URL structure | Short, lowercase, descriptive page names: `/menu.html`, `/enquiry.html`, `/contact.html` |
| Internal linking | Links in body text between Home, Our Story, Menu, Gallery, Enquiries and Contact, plus the navigation and footer |
| Mobile-friendliness | Viewport meta tag, responsive layouts at 860 px and 520 px, large tap targets, no horizontal scrolling at 375 px |
| Other | `lang="en-ZA"`, canonical URLs, Open Graph + Twitter card tags, `LocalBusiness` structured data (JSON-LD `CafeOrCoffeeShop`) on Home and Contact, skip link, favicon |

**Keyword table** (starting list — volumes should be checked with Google Keyword Planner / Google Trends)

| Keyword / phrase | Intent | Used on |
|---|---|---|
| all-day breakfast café | Local / food | Home title, h1, meta description |
| locally sourced / farm-to-table café | Brand | Home, Our Story |
| breakfast, lunch and coffee menu | Informational | Menu title, description, home links |
| vegetarian and vegan options | Informational | Menu description, dish tags |
| book a table | Transactional | Home buttons, Enquiry page |
| private function venue, catering | Commercial | Enquiry page, Our Story |
| café with Wi-Fi to study | Local | Home intro, FAQ |

### 3.2 Off-page SEO (plan)
- **Backlinks:** ask local suppliers/farms we buy from to link to the café; list the café on local business and food directories; invite local food bloggers and community pages to review it.
- **Social media:** Instagram and Facebook links in the footer (replace with the real accounts); Open Graph tags make shared links show a title, description and photo.
- **Local SEO:** claim a Google Business Profile, keep name/address/phone identical everywhere, use `en-ZA` and local structured data, and collect Google reviews.

### 3.3 Additional requests
- **robots.txt:** allows all crawlers and points to the sitemap.
- **sitemap.xml:** lists all six pages with last-modified date, change frequency and priority.
- **Page speed:** system fonts (no web-font download), scripts loaded with `defer`, lazy-loaded images with fixed dimensions, small CSS, libraries self-hosted, cache headers in `_headers`. Photos must be compressed before upload (see `images/README.txt`).
- **Security:**
  - Content-Security-Policy on every page (scripts and styles only from this site; no inline scripts).
  - No third-party CDN scripts: jQuery and Leaflet are self-hosted.
  - Dynamic text is inserted with `textContent`, never `innerHTML`.
  - Honeypot field and input clean-up (control characters removed) on both forms.
  - `rel="noopener noreferrer"` on external links, strict referrer policy.
  - `_headers` adds `X-Content-Type-Options`, `X-Frame-Options`, HSTS and `Permissions-Policy` on Netlify.
  - Note: client-side validation can be bypassed, so a real back end must validate again.

---

## 4. Deployment
Deployed on **GitHub Pages**:
1. Repository → **Settings → Pages**.
2. Source: **Deploy from a branch** → branch `main`, folder `/ (root)` → Save.
3. After about a minute the site is live at https://mashudu05.github.io/olive-oak-cafe/.

If the site is deployed somewhere else, change `SITE` URLs in the `<link rel="canonical">` and Open Graph tags, `sitemap.xml` and `robots.txt`.

---

## 5. Things to replace before going live
- Address, coordinates (`OO.location`), phone number and email in `js/site-data.js`, the footer, `contact.html` and the JSON-LD block.
- Social media links in the footer.
- Menu items, prices, dietary tags, packages and opening hours (`js/site-data.js`) — check allergens and dietary claims.
- The form endpoint `OO.endpoint` / the enquiry form `action`. `jsonplaceholder.typicode.com` is a free test API that accepts a POST but does **not** store or forward it. Use a real service (e.g. Formspree or Netlify Forms) so enquiries reach the café.
- Public holidays in `OO.closedDates` (update each year).

---

## 6. Testing
Tested in Chromium at desktop (1280 px) and mobile (375 px) widths:
- All six pages load with no JavaScript or Content-Security-Policy errors, no duplicate IDs, one `<h1>` each, and no horizontal scrolling on mobile.
- Menu: 15 items, search, category filter, sorting, no-results state, modal.
- Enquiry form: empty-form errors, invalid email/phone/guests, available and unavailable results (short notice, outside opening hours, public holiday), correct cost totals, AJAX success and failure, honeypot.
- Contact form: validation, email preview, and `mailto:` link content.
- Accordion (one open at a time), lightbox (keyboard + wrap-around), Leaflet map and marker, mobile navigation.

---

## 7. Changelog

### Part 2 feedback changes
> Each point of feedback received on Part 2 is recorded here, with what was changed and where.

| # | Feedback received on Part 2 | Change made | File(s) |
|---|---|---|---|
| 1 | _To be completed — add the lecturer’s Part 2 feedback_ | | |

### v3.0.0 — Part 3 (26 October 2026)

**Added**
- `enquiry.html`: enquiry form (reservation / private function / catering) that checks availability, calculates an estimate, and submits with AJAX; price guide; FAQ accordion (jQuery).
- `contact.html`: general contact form that validates and builds an email to send; Leaflet map with marker and directions link; open/closed status.
- `js/site-data.js`: single source for menu data, opening hours, prices and contact details, plus shared helpers (South African time, date/time/rand formatting).
- `js/menu.js`: dynamic menu with search, filter, sort and details modal; featured dishes on the home page.
- `js/forms.js`, `js/faq.js`, `js/map.js`.
- Self-hosted libraries in `vendor/`: jQuery 3.7.1 and Leaflet 1.9.4 (with licences).
- SEO: unique titles/descriptions, canonical URLs, Open Graph and Twitter tags, JSON-LD structured data, `robots.txt`, `sitemap.xml`, favicon, skip link.
- Security: Content-Security-Policy meta tag, referrer policy, `_headers` file, honeypot fields.
- Animations: scroll-reveal with staggered delay, hover/transition effects, hero/modal/result keyframes, back-to-top button, reduced-motion support.
- “Enquiries” link added to the navigation and footer of every page.

**Changed**
- `menu.html`: the static menu list was replaced with content generated from `MENU_ITEMS`; the four fixed filter buttons became generated category buttons plus search and sort.
- Table reservation form moved from `contact.html` to `enquiry.html`; `contact.html` is now the general message form.
- `contact.html`: the empty `<iframe>` map placeholder was replaced with an interactive Leaflet map.
- `gallery.html`: photos renamed from `gallery-1.jpg`…`gallery-6.jpg` to descriptive names; images wrapped in buttons for keyboard access; `width`, `height`, `loading="lazy"` added. Hero image `hero-bg.jpg` renamed to `cafe-breakfast-table-hero.jpg`.
- `js/script.js`: rewritten. Mobile nav and lightbox from the earlier draft were kept and improved (ARIA attributes, Escape/outside-click closing, focus return).
- `css/style.css`: terracotta darkened from `#c1622d` to `#b0551f` so white button text meets accessible contrast; navigation breakpoint moved from 768 px to 860 px for the extra link; hero secondary button made readable on dark backgrounds; focus outlines added; footer titles changed from `<h3>` to `<p>` to fix the heading hierarchy.
- All pages: `lang="en-ZA"`; `<main id="main">`; scripts loaded with `defer`; footer year is filled in automatically.

**Removed**
- The client-side `data-filter` buttons and the booking form from `contact.html` (replaced as described above).
- The empty `src=""` iframe and its inline `style` attribute (inline styles are blocked by the Content-Security-Policy).

---

## 8. References
- Google (2026) *SEO Starter Guide*. Available at: https://developers.google.com/search/docs/fundamentals/seo-starter-guide (Accessed: 26 October 2026).
- Google (2026) *Introduction to robots.txt*. Available at: https://developers.google.com/search/docs/crawling-indexing/robots/intro (Accessed: 26 October 2026).
- Google (2026) *Build and submit a sitemap*. Available at: https://developers.google.com/search/docs/crawling-indexing/sitemaps/overview (Accessed: 26 October 2026).
- Google (2026) *Local business structured data*. Available at: https://developers.google.com/search/docs/appearance/structured-data/local-business (Accessed: 26 October 2026).
- Schema.org (2026) *CafeOrCoffeeShop*. Available at: https://schema.org/CafeOrCoffeeShop (Accessed: 26 October 2026).
- Agafonkin, V. (2023) *Leaflet 1.9.4 documentation*. Available at: https://leafletjs.com/reference.html (Accessed: 26 October 2026).
- OpenStreetMap Foundation (2026) *Tile Usage Policy*. Available at: https://operations.osmfoundation.org/policies/tiles/ (Accessed: 26 October 2026).
- jQuery Foundation (2026) *.slideToggle()*. Available at: https://api.jquery.com/slideToggle/ (Accessed: 26 October 2026).
- MDN Web Docs (2026) *Using the Fetch API*. Available at: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch (Accessed: 26 October 2026).
- MDN Web Docs (2026) *IntersectionObserver*. Available at: https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver (Accessed: 26 October 2026).
- MDN Web Docs (2026) *Client-side form validation*. Available at: https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Forms/Form_validation (Accessed: 26 October 2026).
- MDN Web Docs (2026) *Content Security Policy (CSP)*. Available at: https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP (Accessed: 26 October 2026).
- MDN Web Docs (2026) *Lazy loading*. Available at: https://developer.mozilla.org/en-US/docs/Web/Performance/Lazy_loading (Accessed: 26 October 2026).
- Gellens, R., Newman, C. and Zawinski, J. (2010) *RFC 6068: The ‘mailto’ URI Scheme*. Available at: https://www.rfc-editor.org/rfc/rfc6068 (Accessed: 26 October 2026).
- Typicode (2026) *JSONPlaceholder – free fake API*. Available at: https://jsonplaceholder.typicode.com/ (Accessed: 26 October 2026).
- GitHub (2026) *Configuring a publishing source for your GitHub Pages site*. Available at: https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site (Accessed: 26 October 2026).
- Earlier references (Parts 1–2): MDN Web Docs *CSS Grid Layout* and *Using CSS flexible boxes*.
