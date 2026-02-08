// Luxe Salon - Event Handlers Module

import { appState } from '../state/state.js';
import { 
    navigate, 
    navigateToService, 
    navigateToAllServices,
    handleSearch 
} from '../navigation/navigation.js';
import { 
    toggleCategory, 
    updateGenderUI, 
    closeSidebarOnMobile,
    toggleSidebar 
} from '../navigation/renderer.js';

// Handle Gender Switch
export function handleGenderSwitch(gender) {
    appState.setGender(gender);
    updateGenderUI(gender);
    
    // Reload current service if viewing one
    const { currentService } = appState.getState();
    if (currentService) {
        navigateToService(currentService);
    } else {
        navigateToAllServices();
    }
}

// Handle Top Navigation Click
export function handleTopNavClick(e) {
    e.preventDefault();
    const page = e.target.closest('a').dataset.page;
    if (page) {
        navigate(page);
    }
}

// Handle Service Category Click
export function handleServiceClick(e) {
    e.preventDefault();
    const service = e.target.dataset.service;
    if (service) {
        navigateToService(service);
        closeSidebarOnMobile();
    }
}

// Handle Category Expansion
export function handleCategoryClick(e) {
    toggleCategory(e.currentTarget);
}

// Handle Search Input
export function handleSearchInput(e) {
    handleSearch(e.target.value);
}

// Handle Booking Button Click
export function handleBookingClick() {
    alert('Booking system coming soon! Please call us at +91 1234567890');
}

// Handle Sidebar Toggle (Mobile)
export function handleSidebarToggle() {
    toggleSidebar();
}

// Handle Standalone Category Click (like Loyalty Card in sidebar)
export function handleStandaloneCategoryClick(e) {
    const page = e.currentTarget.dataset.page;
    if (page) {
        navigate(page);
        closeSidebarOnMobile();
    }
}

// Handle Window Resize
export function handleWindowResize() {
    const sidebar = document.getElementById('sidebar');
    if (window.innerWidth >= 992 && sidebar) {
        sidebar.classList.remove('open');
    }
}

// Initialize all event listeners
export function initializeEventListeners() {
    // Mobile sidebar toggle
    const sidebarToggle = document.getElementById('sidebarToggle');
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', handleSidebarToggle);
    }

    // Gender tabs
    document.querySelectorAll('.gender-tab').forEach(tab => {
        tab.addEventListener('click', (e) => {
            const gender = e.target.dataset.gender;
            if (gender) {
                handleGenderSwitch(gender);
            }
        });
    });

    // Category expansion
    document.querySelectorAll('.category-item.expandable .category-header').forEach(header => {
        header.addEventListener('click', handleCategoryClick);
    });

    // Service links
    document.querySelectorAll('.subcategory-list a').forEach(link => {
        link.addEventListener('click', handleServiceClick);
    });

    // Top navigation links
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', handleTopNavClick);
    });

    // Standalone category links (like Loyalty Card)
    document.querySelectorAll('.category-header.standalone').forEach(header => {
        header.addEventListener('click', handleStandaloneCategoryClick);
    });

    // Search functionality
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', handleSearchInput);
    }

    // Book appointment buttons
    document.querySelectorAll('.btn-book-nav, .btn-book').forEach(btn => {
        btn.addEventListener('click', handleBookingClick);
    });

    // Window resize
    window.addEventListener('resize', handleWindowResize);
}
