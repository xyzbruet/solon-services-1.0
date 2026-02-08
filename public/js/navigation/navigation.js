// Luxe Salon - Navigation Module

import { appState } from '../state/state.js';
import { servicesData, getAllServicesForGender, searchServices } from '../data/services.js';
import { 
    createHomePage, 
    createLoyaltyPage, 
    createAdminPage, 
    createServicesGrid 
} from '../components/ui.js';
import { renderContent, attachServiceEventListeners } from './renderer.js';

// Format service title helper
function formatServiceTitle(serviceName) {
    return serviceName
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

// Navigate to Home Page
export function navigateToHome() {
    appState.setPage('home');
    appState.setService(null);
    const content = createHomePage();
    renderContent(content);
}

// Navigate to All Services Page
export function navigateToAllServices() {
    appState.setPage('services');
    appState.setService(null);
    
    const services = getAllServicesForGender(appState.getState().currentGender);
    const content = createServicesGrid(services, 'All Services');
    renderContent(content);
    attachServiceEventListeners();
}

// Navigate to Specific Service Category
export function navigateToService(serviceName) {
    appState.setPage('services');
    appState.setService(serviceName);
    
    const { currentGender } = appState.getState();
    const services = servicesData[currentGender][serviceName] || [];
    const title = formatServiceTitle(serviceName);
    
    const content = createServicesGrid(services, title);
    renderContent(content);
    attachServiceEventListeners();
    
    // Update active subcategory
    updateActiveSubcategory(serviceName);
}

// Navigate to Loyalty Page
export function navigateToLoyalty() {
    appState.setPage('loyalty');
    appState.setService(null);
    const content = createLoyaltyPage();
    renderContent(content);
}

// Navigate to Admin Page
export function navigateToAdmin() {
    appState.setPage('admin');
    appState.setService(null);
    const content = createAdminPage();
    renderContent(content);
    
    // Attach admin button event
    setTimeout(() => {
        const adminBtn = document.getElementById('adminAccessBtn');
        if (adminBtn) {
            adminBtn.addEventListener('click', () => {
                alert('Please contact your administrator for access credentials.');
            });
        }
    }, 0);
}

// Handle Search
export function handleSearch(query) {
    appState.setSearchQuery(query);
    
    if (!query.trim()) {
        const { currentService } = appState.getState();
        if (currentService) {
            navigateToService(currentService);
        } else {
            navigateToAllServices();
        }
        return;
    }

    const { currentGender } = appState.getState();
    const filteredServices = searchServices(query, currentGender);
    const content = createServicesGrid(filteredServices, `Search Results for "${query}"`);
    renderContent(content);
    attachServiceEventListeners();
}

// Update Active Navigation Link
export function updateActiveNavLink(page) {
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.classList.remove('active');
        if (link.dataset.page === page) {
            link.classList.add('active');
        }
    });
}

// Update Active Subcategory
function updateActiveSubcategory(serviceName) {
    document.querySelectorAll('.subcategory-list a').forEach(link => {
        link.classList.remove('active');
        if (link.dataset.service === serviceName) {
            link.classList.add('active');
        }
    });
}

// Generic Navigation Handler
export function navigate(page) {
    switch(page) {
        case 'home':
            navigateToHome();
            break;
        case 'services':
            navigateToAllServices();
            break;
        case 'loyalty':
            navigateToLoyalty();
            break;
        case 'admin':
            navigateToAdmin();
            break;
        default:
            navigateToHome();
    }
    
    updateActiveNavLink(page);
}
