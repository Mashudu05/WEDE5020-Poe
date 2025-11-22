// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
}

// Close mobile menu when clicking links
document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
    if (hamburger) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }
}));

// Accommodation Gallery Slider
let currentSlide = 0;
const slides = document.querySelectorAll('.slide');
const dots = document.querySelectorAll('.dot');

function showSlide(n) {
    if (slides.length === 0) return;
    slides.forEach(slide => slide.style.display = 'none');
    dots.forEach(dot => dot.classList.remove('active'));
    
    currentSlide = (n + slides.length) % slides.length;
    slides[currentSlide].style.display = 'block';
    dots[currentSlide].classList.add('active');
}

function nextSlide() {
    showSlide(currentSlide + 1);
}

function prevSlide() {
    showSlide(currentSlide - 1);
}

// Auto-advance slides every 5 seconds
if (slides.length > 0) {
    setInterval(nextSlide, 5000);
    showSlide(0);
}

// Form Validation
function validateBookingForm() {
    const form = document.getElementById('bookingForm');
    if (!form) return true;

    const name = document.getElementById('name');
    const email = document.getElementById('email');
    const phone = document.getElementById('phone');
    const checkin = document.getElementById('checkin');
    const checkout = document.getElementById('checkout');
    const roomType = document.getElementById('roomType');
    
    if (!name || !email || !phone || !checkin || !checkout || !roomType) return false;
    
    let isValid = true;

    // Clear previous errors
    clearAllErrors();

    // Name validation
    if (!name.value.trim()) {
        showError(name, 'Full name is required');
        isValid = false;
    }

    // Email validation
    if (!email.value.trim()) {
        showError(email, 'Email is required');
        isValid = false;
    } else if (!isValidEmail(email.value)) {
        showError(email, 'Please enter a valid email address');
        isValid = false;
    }

    // Phone validation
    if (!phone.value.trim()) {
        showError(phone, 'Phone number is required');
        isValid = false;
    } else if (!isValidPhone(phone.value)) {
        showError(phone, 'Please enter a valid phone number');
        isValid = false;
    }

    // Date validation
    if (!checkin.value) {
        showError(checkin, 'Check-in date is required');
        isValid = false;
    }
    
    if (!checkout.value) {
        showError(checkout, 'Check-out date is required');
        isValid = false;
    } else if (checkin.value && checkout.value) {
        const checkinDate = new Date(checkin.value);
        const checkoutDate = new Date(checkout.value);
        if (checkoutDate <= checkinDate) {
            showError(checkout, 'Check-out date must be after check-in date');
            isValid = false;
        }
    }

    // Room type validation
    if (!roomType.value) {
        showError(roomType, 'Please select a room type');
        isValid = false;
    }

    if (isValid) {
        showSuccessMessage();
    }

    return isValid;
}

function validateContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return true;

    const name = document.getElementById('contactName');
    const email = document.getElementById('contactEmail');
    const subject = document.getElementById('subject');
    const message = document.getElementById('message');
    
    if (!name || !email || !subject || !message) return false;
    
    let isValid = true;

    clearAllErrors();

    if (!name.value.trim()) {
        showError(name, 'Name is required');
        isValid = false;
    }

    if (!email.value.trim()) {
        showError(email, 'Email is required');
        isValid = false;
    } else if (!isValidEmail(email.value)) {
        showError(email, 'Please enter a valid email address');
        isValid = false;
    }

    if (!subject.value.trim()) {
        showError(subject, 'Subject is required');
        isValid = false;
    }

    if (!message.value.trim()) {
        showError(message, 'Message is required');
        isValid = false;
    }

    if (isValid) {
        showSuccessMessage('Message sent successfully! We will get back to you within 24 hours.');
    }

    return isValid;
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPhone(phone) {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
}

function showError(input, message) {
    input.style.borderColor = '#ff4444';
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.style.cssText = 'color: #ff4444; font-size: 0.8em; margin-top: 5px;';
    errorDiv.textContent = message;
    input.parentNode.appendChild(errorDiv);
}

function clearError(input) {
    input.style.borderColor = '';
    const errorDiv = input.parentNode.querySelector('.error-message');
    if (errorDiv) {
        errorDiv.remove();
    }
}

function clearAllErrors() {
    document.querySelectorAll('.error-message').forEach(error => error.remove());
    document.querySelectorAll('input, select, textarea').forEach(input => {
        input.style.borderColor = '';
    });
}

function showSuccessMessage(message = 'Booking submitted successfully! We will contact you shortly.') {
    const successDiv = document.createElement('div');
    successDiv.style.cssText = `
        background: #4CAF50;
        color: white;
        padding: 15px;
        margin: 20px 0;
        border-radius: 5px;
        text-align: center;
    `;
    successDiv.textContent = message;
    
    const form = document.querySelector('form');
    if (!form) return;
    
    form.parentNode.insertBefore(successDiv, form);
    
    setTimeout(() => {
        successDiv.remove();
        form.reset();
    }, 5000);
}

// Room Availability Check
function checkAvailability() {
    const roomType = document.getElementById('roomType');
    const checkin = document.getElementById('checkin');
    
    if (roomType && checkin && checkin.value) {
        // Simulate availability check
        const available = Math.random() > 0.3; // 70% chance available
        const availabilityDiv = document.getElementById('availability');
        
        if (availabilityDiv) {
            if (available) {
                availabilityDiv.innerHTML = '<p style="color: #4CAF50;">✓ This room type is available for your selected dates!</p>';
            } else {
                availabilityDiv.innerHTML = '<p style="color: #ff4444;">✗ This room type is not available for your selected dates. Please choose different dates or room type.</p>';
            }
        }
    }
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Initialize functions when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Add event listeners to form inputs
    const checkinInput = document.getElementById('checkin');
    const checkoutInput = document.getElementById('checkout');
    const roomTypeSelect = document.getElementById('roomType');
    
    if (checkinInput) {
        checkinInput.addEventListener('change', checkAvailability);
    }
    if (checkoutInput) {
        checkoutInput.addEventListener('change', checkAvailability);
    }
    if (roomTypeSelect) {
        roomTypeSelect.addEventListener('change', checkAvailability);
    }
    
    // Set minimum date for check-in to today
    const today = new Date().toISOString().split('T')[0];
    if (checkinInput) {
        checkinInput.min = today;
    }
    if (checkoutInput && checkinInput) {
        checkinInput.addEventListener('change', function() {
            checkoutInput.min = this.value;
        });
    }
});

// Google Maps Integration
function initMap() {
    // Main location - University area
    const mainLocation = { lat: -26.238947, lng: 28.032466 }; // Johannesburg coordinates
    const mapElement = document.getElementById("map");
    if (!mapElement) return;
    
    const map = new google.maps.Map(mapElement, {
        zoom: 14,
        center: mainLocation,
    });
    
    // Multiple accommodation locations
    const locations = [
        {
            position: { lat: -26.238947, lng: 28.032466 },
            title: "Main Student Hub",
            info: "24/7 Security, WiFi, Study Rooms"
        },
        {
            position: { lat: -26.235947, lng: 28.035466 },
            title: "Campus Residence",
            info: "Furnished Rooms, Laundry Facility"
        },
        {
            position: { lat: -26.241947, lng: 28.029466 },
            title: "City View Apartments",
            info: "Private Bathrooms, Gym Access"
        }
    ];
    
    locations.forEach(location => {
        const marker = new google.maps.Marker({
            position: location.position,
            map: map,
            title: location.title
        });
        
        const infowindow = new google.maps.InfoWindow({
            content: `<strong>${location.title}</strong><br>${location.info}`
        });
        
        marker.addListener('click', () => {
            infowindow.open(map, marker);
        });
    });
}