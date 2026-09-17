# Olive & Oak Café — Website (Part 2: CSS Styling)

## About
Multi-page website for Olive & Oak Café, a local café serving all-day
breakfast and lunch using locally sourced, farm-to-table ingredients.
This submission covers **Parts 1 and 2**: HTML structure plus full CSS
styling. JavaScript interactivity (mobile nav toggle, menu filters,
form validation, gallery lightbox) is planned for Part 3.

## File Structure

olive-oak-cafe/
├── index.html Home page
├── about.html Our Story page
├── menu.html Menu page (breakfast / lunch / drinks)
├── gallery.html Photo gallery page
├── contact.html Reservations & contact page
├── css/
│ └── style.css Full stylesheet (Part 2)
├── js/
│ └── script.js Scripts (Part 3 — not yet implemented)
├── images/
│ └── README.txt Notes on image files to add
└── README.md


## Design Notes (Part 2)
- Colour palette: terracotta (#c1622d), olive green (#5f6e42), and
  cream (#faf3e9), reflecting the café's farm-to-table branding.
- Typography: Georgia (serif) for headings, Segoe UI (sans-serif) for
  body text and UI elements — chosen for a warm, readable contrast.
- Layout: CSS Grid for card layouts (highlights, team, footer,
  gallery) and Flexbox for the header/nav and form.
- Responsive: mobile-first breakpoints at 768px and 480px collapse
  multi-column layouts to a single column and reveal the nav toggle
  button (functionality wired up in Part 3).
- Elements that still need JavaScript (nav toggle, menu filters,
  reservation form, gallery lightbox) are styled and ready, with
  comments in the code marking what Part 3 will add.

## How to View
Open `index.html` in any modern browser (Chrome, Firefox, Edge) — no
build step or server required. Note: CSS Grid and flexbox `gap` are
used throughout, so very old browsers may not render the layout
correctly; this is not a concern for current browser versions.

## References
- MDN Web Docs (2026) *CSS Grid Layout*. Available at:
  https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_grid_layout
  (Accessed: 17 August 2026).
- MDN Web Docs (2026) *Using CSS flexible boxes*. Available at:
  https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_flexible_box_layout/Basic_concepts_of_flexbox
  (Accessed: 17 August 2026).
