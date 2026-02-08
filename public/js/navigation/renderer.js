// Luxe Salon - Renderer Module

import { findServiceById } from '../data/services.js';

// Get content area element
const getContentArea = () => document.getElementById('content-area');

// Render content to the main area
export function renderContent(htmlContent) {
    const contentArea = getContentArea();
    if (contentArea) {
        contentArea.innerHTML = htmlContent;
    }
}

// Show Service Details (Booking Modal)
export function showServiceDetails(serviceId) {
    const service = findServiceById(serviceId);
    if (!service) return;

    alert(
        `Booking: ${service.name}\n` +
        `Price: ₹${service.price}\n` +
        `Duration: ${service.duration}\n\n` +
        `Please call +91 1234567890 to confirm your appointment.`
    );
}

// Attach event listeners to service cards
export function attachServiceEventListeners() {
    // Small delay to ensure DOM is ready
    setTimeout(() => {
        document.querySelectorAll('.btn-view').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const serviceId = parseInt(e.target.dataset.id);
                showServiceDetails(serviceId);
            });
        });
    }, 0);
}

// Toggle Category Expansion
export function toggleCategory(header) {
    const subcategoryList = header.nextElementSibling;
    const isOpen = subcategoryList.classList.contains('open');
    
    // Close all categories
    document.querySelectorAll('.subcategory-list').forEach(list => {
        list.classList.remove('open');
    });
    document.querySelectorAll('.category-header').forEach(h => {
        h.classList.remove('active');
    });

    // Open clicked category if it wasn't open
    if (!isOpen) {
        subcategoryList.classList.add('open');
        header.classList.add('active');
    }
}

// Update Gender UI
export function updateGenderUI(gender) {
    // Update active tab
    document.querySelectorAll('.gender-tab').forEach(tab => {
        tab.classList.remove('active');
        if (tab.dataset.gender === gender) {
            tab.classList.add('active');
        }
    });

    // Show/hide category menus
    const womenCategories = document.getElementById('women-categories');
    const menCategories = document.getElementById('men-categories');
    
    if (womenCategories && menCategories) {
        womenCategories.style.display = gender === 'women' ? 'block' : 'none';
        menCategories.style.display = gender === 'men' ? 'block' : 'none';
    }
}

// Close sidebar on mobile
export function closeSidebarOnMobile() {
    const sidebar = document.getElementById('sidebar');
    if (window.innerWidth < 992 && sidebar) {
        sidebar.classList.remove('open');
    }
}

// Toggle sidebar
export function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    if (sidebar) {
        sidebar.classList.toggle('open');
    }
}
