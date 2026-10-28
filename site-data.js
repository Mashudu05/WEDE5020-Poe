/* ==========================================================
   Olive & Oak Café — Shared site data and helpers
   Edit this file to change the menu, hours, prices or contact
   details — every page reads from here.
   ========================================================== */
'use strict';

const OO = {
    name: 'Olive & Oak Café',
    email: 'hello@oliveandoakcafe.co.za',
    phone: '012 345 6789',
    address: '123 Main Road, South Africa',
    // Map centre — replace with the café's real coordinates
    location: { lat: -26.2041, lng: 28.0473 },
    // Opening hours as minutes since midnight [open, close]. 0 = Sunday
    hours: {
        0: [480, 780],   // Sun 08:00–13:00
        1: [420, 1020],  // Mon 07:00–17:00
        2: [420, 1020],
        3: [420, 1020],
        4: [420, 1020],
        5: [420, 1020],
        6: [480, 900]    // Sat 08:00–15:00
    },
    // Public holidays we are closed (YYYY-MM-DD). Update each year.
    closedDates: ['2026-12-16', '2026-12-25', '2026-12-26', '2027-01-01'],
    // Per-person prices (Rand) for functions and catering
    packages: {
        breakfast: { label: 'Breakfast platter', price: 95 },
        lunch: { label: 'Lunch platter', price: 120 },
        cakes: { label: 'Coffee & cakes', price: 65 }
    },
    venueFee: 1200,          // private function venue fee (Rand)
    depositRate: 0.3,        // deposit to secure functions/catering
    tableDeposit: 50,        // refundable deposit per person, groups of 9+
    // Demo endpoint for AJAX submission — swap for a real form service
    endpoint: 'https://jsonplaceholder.typicode.com/posts'
};

const MENU_ITEMS = [
    { id: 'farm-breakfast', name: 'Farm Breakfast', category: 'Breakfast', price: 85, tags: [], featured: true,
      description: 'Free-range eggs, grilled tomato and sourdough toast.' },
    { id: 'avocado-toast', name: 'Avocado Toast', category: 'Breakfast', price: 75, tags: ['vegetarian'], featured: true,
      description: 'Smashed avocado, feta, chilli flakes and sourdough.' },
    { id: 'buttermilk-pancakes', name: 'Buttermilk Pancakes', category: 'Breakfast', price: 70, tags: ['vegetarian'], featured: false,
      description: 'Fluffy pancakes with seasonal fruit and local honey.' },
    { id: 'granola-bowl', name: 'Granola & Yoghurt Bowl', category: 'Breakfast', price: 60, tags: ['vegetarian'], featured: false,
      description: 'House granola, thick yoghurt and fresh fruit.' },
    { id: 'roast-veg-bowl', name: 'Roast Veg Bowl', category: 'Lunch', price: 95, tags: ['vegan'], featured: true,
      description: 'Seasonal roast vegetables, quinoa and tahini dressing.' },
    { id: 'oak-sandwich', name: 'Olive & Oak Sandwich', category: 'Lunch', price: 90, tags: [], featured: false,
      description: 'Grilled chicken, rocket and sundried tomato pesto.' },
    { id: 'soup-of-the-day', name: 'Soup of the Day', category: 'Lunch', price: 65, tags: [], featured: false,
      description: 'Made fresh each morning, served with warm sourdough.' },
    { id: 'chicken-caesar', name: 'Chicken Caesar Salad', category: 'Lunch', price: 98, tags: [], featured: false,
      description: 'Crisp cos lettuce, grilled chicken, parmesan and croutons.' },
    { id: 'flat-white', name: 'Flat White', category: 'Drinks', price: 35, tags: ['vegetarian'], featured: false,
      description: 'Locally roasted beans and silky steamed milk.' },
    { id: 'cappuccino', name: 'Cappuccino', category: 'Drinks', price: 35, tags: ['vegetarian'], featured: false,
      description: 'Espresso topped with velvety foam.' },
    { id: 'iced-latte', name: 'Iced Latte', category: 'Drinks', price: 42, tags: ['vegetarian'], featured: false,
      description: 'Cold espresso poured over milk and ice.' },
    { id: 'fresh-juice', name: 'Fresh Juice', category: 'Drinks', price: 40, tags: ['vegan'], featured: false,
      description: 'Seasonal fruit, cold-pressed daily.' },
    { id: 'hot-chocolate', name: 'Hot Chocolate', category: 'Drinks', price: 38, tags: ['vegetarian'], featured: false,
      description: 'Rich dark chocolate with steamed milk.' },
    { id: 'carrot-cake', name: 'Carrot Cake', category: 'Treats', price: 48, tags: ['vegetarian'], featured: false,
      description: 'Spiced carrot cake with cream cheese icing.' },
    { id: 'seasonal-muffin', name: 'Seasonal Muffin', category: 'Treats', price: 32, tags: ['vegetarian'], featured: false,
      description: 'Baked fresh daily with seasonal ingredients.' }
];

/* ----- Shared helpers ----- */
const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

// Current date/time in South Africa, regardless of the visitor's time zone
function nowInSA() {
    const parts = new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Africa/Johannesburg', year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit', hour12: false
    }).formatToParts(new Date());
    const get = function (type) { return parseInt(parts.find(function (p) { return p.type === type; }).value, 10); };
    return new Date(get('year'), get('month') - 1, get('day'), get('hour') % 24, get('minute'));
}

function dateString(d) {
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
}

function fmtTime(totalMinutes) {
    return String(Math.floor(totalMinutes / 60)).padStart(2, '0') + ':' + String(totalMinutes % 60).padStart(2, '0');
}

function formatRand(amount) {
    // Same output in every browser: R3 600
    return 'R' + String(Math.round(amount)).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

function parseDate(str) { return new Date(str + 'T00:00:00'); }
