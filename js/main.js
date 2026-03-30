/**
 * Eco-Friendly Junk Removal & Hauling Service 
 * Core JavaScript Logic
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initializations
    initQuoteCalculator();
    initTrackingSimulation();
    initBookingForm();
    initContactForm();
    initThemeToggle();
    initNavbarActiveState();
    initScrollToTop();
    initDashboardToggle();
});

// --- Instant Quote Calculator ---
function initQuoteCalculator() {
    const calcForm = document.getElementById('quote-form');
    if (!calcForm) return;

    const volumeSlider = document.getElementById('volume-slider');
    const itemCheckboxes = document.querySelectorAll('.item-checkbox');
    const displayPrice = document.getElementById('instant-price');

    if (volumeSlider) {
        volumeSlider.addEventListener('input', updatePrice);
    }
    
    itemCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', updatePrice);
    });

    function updatePrice() {
        let basePrice = 50; // Minimum service fee
        
        // Volume pricing: $100 per 1/4 truck load
        if (volumeSlider) {
            const volume = parseInt(volumeSlider.value);
            basePrice += (volume * 100);
            document.getElementById('volume-display').textContent = 
                volume === 0 ? 'Minimum Load' : 
                volume === 1 ? '1/4 Truck' : 
                volume === 2 ? '1/2 Truck' : 
                volume === 3 ? '3/4 Truck' : 'Full Truck';
        }

        // Add-ons per item type
        itemCheckboxes.forEach(cb => {
            if (cb.checked) {
                basePrice += parseInt(cb.dataset.price || 0);
            }
        });

        if (displayPrice) {
            animateValue(displayPrice, parseInt(displayPrice.textContent.replace('$', '')), basePrice, 500);
        }
    }
}

// --- Live Tracking Simulation ---
function initTrackingSimulation() {
    const mapArea = document.querySelector('.tracking-map');
    const truckMarker = document.querySelector('.truck-marker');
    const etaDisplay = document.getElementById('truck-eta');
    const statusDisplay = document.getElementById('truck-status');

    if (!mapArea || !truckMarker) return;

    let progress = 0;
    const path = [
        { left: '10%', top: '80%' },
        { left: '30%', top: '60%' },
        { left: '50%', top: '70%' },
        { left: '70%', top: '40%' },
        { left: '90%', top: '10%' }
    ];

    const interval = setInterval(() => {
        if (progress >= path.length) {
            clearInterval(interval);
            truckMarker.style.left = '90%';
            truckMarker.style.top = '10%';
            if (statusDisplay) statusDisplay.textContent = 'Arrived';
            if (etaDisplay) etaDisplay.textContent = '0 mins';
            return;
        }

        const point = path[progress];
        truckMarker.style.left = point.left;
        truckMarker.style.top = point.top;
        
        if (statusDisplay) statusDisplay.textContent = 'On the way';
        if (etaDisplay) etaDisplay.textContent = (25 - (progress * 5)) + ' mins';
        
        progress++;
    }, 3000); // Move every 3 seconds for simulation
}

// --- Booking System ---
function initBookingForm() {
    const bookingForm = document.getElementById('main-booking-form');
    if (!bookingForm) return;

    bookingForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Bootstrap standard validation
        if (!bookingForm.checkValidity()) {
            e.stopPropagation();
            bookingForm.classList.add('was-validated');
            return;
        }

        const formData = new FormData(bookingForm);
        const booking = Object.fromEntries(formData.entries());
        booking.id = 'JUNK-' + Math.floor(Math.random() * 100000);
        booking.status = 'Confirmed';
        booking.timestamp = new Date().toLocaleString();

        // Save to localStorage for the dashboard simulation
        const bookings = JSON.parse(localStorage.getItem('junk_bookings') || '[]');
        bookings.push(booking);
        localStorage.setItem('junk_bookings', JSON.stringify(bookings));

        // Show success message and redirect
        const submitBtn = bookingForm.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Confirming...';

        setTimeout(() => {
            alert('Success! Your pickup has been scheduled.\nBooking ID: ' + booking.id);
            window.location.href = 'index.html'; // Redirect to home or a success page
        }, 1500);
    });
}

// --- Contact Form System ---
function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    if (!contactForm) return;

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        if (!contactForm.checkValidity()) {
            e.stopPropagation();
            contactForm.classList.add('was-validated');
            return;
        }

        const submitBtn = contactForm.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Sending...';

        setTimeout(() => {
            alert('Message Sent! Our team will get back to you within 24 hours.');
            contactForm.reset();
            contactForm.classList.remove('was-validated');
            submitBtn.disabled = false;
            submitBtn.innerHTML = 'Send Message <i class="bi bi-send-fill ms-2"></i>';
        }, 1500);
    });
}

// --- Theme Toggle ---
function initThemeToggle() {
    const toggleBtn = document.getElementById('theme-toggle');
    if (!toggleBtn) return;

    // Check saved preference
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-mode');
    }

    toggleBtn.addEventListener('click', (e) => {
        if(e) e.preventDefault();
        document.body.classList.toggle('dark-mode');
        const isDark = document.body.classList.contains('dark-mode');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });

    initZipChecker();
}

function initZipChecker() {
    const zipBtn = document.querySelector('.input-group button.btn-light');
    const zipInput = document.querySelector('.input-group input[placeholder="Enter Zip Code"]');
    
    if (!zipBtn || !zipInput) return;

    zipBtn.addEventListener('click', () => {
        const zip = zipInput.value.trim();
        if (zip.length === 5 && !isNaN(zip)) {
            alert('Great news! We serve ' + zip + '. You can proceed with your booking.');
        } else {
            alert('Please enter a valid 5-digit zip code.');
        }
    });
}

// --- Navbar Active State Handler ---
function initNavbarActiveState() {
    const currentPath = window.location.pathname;
    const filename = currentPath.split('/').pop() || 'index.html';
    
    // Reset all active classes
    document.querySelectorAll('.nav-link, .dropdown-item').forEach(el => el.classList.remove('active'));

    const navLinks = document.querySelectorAll('.nav-link, .dropdown-item');
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        
        // Exact match or Home 1 match
        if (href === filename || (filename === 'index.html' && href === '#')) {
            link.classList.add('active');
            
            // If it's a dropdown item, highlight its parent toggle
            if (link.classList.contains('dropdown-item')) {
                const parentDropdown = link.closest('.dropdown');
                if (parentDropdown) {
                    const toggle = parentDropdown.querySelector('.dropdown-toggle');
                    if (toggle) toggle.classList.add('active');
                }
            }
        }
    });

    initNavIcons();
}

function initNavIcons() {
    const rtlBtn = document.getElementById('rtl-toggle');
    if (rtlBtn) {
        rtlBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const html = document.documentElement;
            const isRtl = html.getAttribute('dir') === 'rtl';
            html.setAttribute('dir', isRtl ? 'ltr' : 'rtl');
            rtlBtn.querySelector('i').classList.toggle('bi-translate');
            rtlBtn.querySelector('i').classList.toggle('bi-arrow-left-right');
        });
    }

    const dashboardBtn = document.getElementById('dashboard-link');
    if (dashboardBtn) {
        dashboardBtn.addEventListener('click', (e) => {
            // Simulation: Normally would just follow the link
            console.log('Navigating to Customer Dashboard...');
        });
    }
}

// --- Dashboard Sidebar Toggle ---
function initDashboardToggle() {
    const toggleBtn = document.getElementById('sidebarToggle');
    const sidebar = document.getElementById('sidebar');
    
    if (toggleBtn && sidebar) {
        toggleBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            sidebar.classList.toggle('show');
        });

        // Close sidebar when clicking outside on mobile
        document.addEventListener('click', (e) => {
            if (window.innerWidth < 992 && 
                sidebar.classList.contains('show') &&
                !sidebar.contains(e.target) && 
                !toggleBtn.contains(e.target)) {
                sidebar.classList.remove('show');
            }
        });
    }
}

// --- Scroll to Top ---
function initScrollToTop() {
    const scrollBtn = document.getElementById('scroll-to-top');
    if (!scrollBtn) return;

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollBtn.classList.add('show');
        } else {
            scrollBtn.classList.remove('show');
        }
    });

    scrollBtn.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// Helper: Animate number change
function animateValue(obj, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        obj.innerHTML = '$' + Math.floor(progress * (end - start) + start);
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}
