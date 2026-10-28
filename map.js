/* ==========================================================
   Olive & Oak Café — Interactive map (Leaflet + OpenStreetMap)
   Loaded on contact.html after vendor/leaflet
   ========================================================== */
'use strict';

document.addEventListener('DOMContentLoaded', function () {
    const mapEl = document.getElementById('map');
    if (!mapEl || typeof L === 'undefined') return;

    const pos = [OO.location.lat, OO.location.lng];
    const map = L.map(mapEl, { scrollWheelZoom: false }).setView(pos, 16);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" rel="noopener noreferrer">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Popup built from DOM nodes (no HTML strings)
    const popup = document.createElement('div');
    const strong = document.createElement('strong');
    strong.textContent = OO.name;
    const addr = document.createElement('div');
    addr.textContent = OO.address;
    popup.append(strong, addr);

    L.marker(pos, { title: OO.name, alt: 'Map marker for ' + OO.name }).addTo(map).bindPopup(popup).openPopup();

    // Scroll-zoom only after the visitor clicks the map (so page scrolling isn't hijacked)
    map.on('click', function () { map.scrollWheelZoom.enable(); });
    map.on('mouseout', function () { map.scrollWheelZoom.disable(); });

    const dir = document.getElementById('directionsLink');
    if (dir) dir.href = 'https://www.google.com/maps/dir/?api=1&destination=' + OO.location.lat + ',' + OO.location.lng;
});
