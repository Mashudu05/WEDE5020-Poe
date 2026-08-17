# Olive & Oak Café — Website (PoE Part 1: HTML Structure)

## About
Static multi-page website for Olive & Oak Café, a fictional local café
built for the Website Development PoE. This submission covers **Part 1:
HTML structure only** — no CSS styling or JavaScript behaviour has been
added yet (planned for Parts 2 and 3).

## File Structure
```
olive-oak-cafe/
├── index.html          Home page
├── about.html           Our Story page
├── menu.html             Menu page (breakfast / lunch / drinks)
├── gallery.html           Photo gallery page
├── contact.html            Reservations & contact page
├── css/
│   └── style.css              Stylesheet (Part 2 — not yet styled)
├── js/
│   └── script.js               Scripts (Part 3 — not yet implemented)
├── images/
│   └── README.txt                 Notes on image files to add
└── README.md
```

## Structure Notes
- Every page shares the same `<header>` (logo + navigation) and
  `<footer>` (about, quick links, contact info) for consistency.
- Navigation uses a `.active` class on the current page's link.
- Elements that will need JavaScript later (nav toggle, menu filters,
  reservation form, gallery lightbox) already have the `id`/`class`
  hooks in place, with comments marking what Part 3 will add.
- The reservation form (`contact.html`) uses native HTML5 input types
  and `required` attributes as a baseline; full validation logic and
  error messaging will be added in Part 3.

## How to View
Open `index.html` in any browser — no build step or server required
at this stage.

## References
- MDN Web Docs (2026) *HTML elements reference*. Available at:
  https://developer.mozilla.org/en-US/docs/Web/HTML/Element
  (Accessed: 17 August 2026).
