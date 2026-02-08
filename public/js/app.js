// Luxe Salon - Main Application Entry Point
// Complete modular version with JSON loading

import { appState } from './state/state.js';
import { loadServicesData, getServicesData } from './data/services.js';
import { 
    createHomePage, 
    createLoyaltyPage, 
    createAdminPage,
    createServicesGrid,
    createServiceCard,
    createLoadingSpinner
} from './components/ui.js';

// ==================== DOM ELEMENTS ====================
let sidebar;
let sidebarToggle;
let contentArea;
let searchInput;

// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Initialize DOM elements
        initializeDOMElements();
        
        // Show loading
        showLoading();
        
        // Load services data from JSON
        await loadServicesData();
        console.log('Services data loaded successfully');
        
        // Initialize app
        initializeApp();
        
        // Attach event listeners
        attachEventListeners();
        
        // Load home page
        loadHomePage();
        
        // Hide loading
        hideLoading();
        
    } catch (error) {
        console.error('Error initializing app:', error);
        showError(error.message);
    }
});

function initializeDOMElements() {
    sidebar = document.getElementById('sidebar');
    sidebarToggle = document.getElementById('sidebarToggle');
    contentArea = document.getElementById('content-area');
    searchInput = document.getElementById('searchInput');
}

function initializeApp() {
    console.log('Luxe Salon App Initialized');
}

function showLoading() {
    if (contentArea) {
        contentArea.innerHTML = createLoadingSpinner();
    }
}

function hideLoading() {
    // Content will be replaced by actual page
}

function showError(message) {
    if (contentArea) {
        contentArea.innerHTML = `
            <div style="text-align: center; padding: 4rem 2rem;">
                <i class="fas fa-exclamation-triangle" style="font-size: 4rem; color: #ff6b6b;"></i>
                <h2 class="mt-4">Error Loading Application</h2>
                <p style="color: #666; margin: 1.5rem 0;">${message}</p>
                <button class="btn-view" onclick="window.location.reload()">
                    <i class="fas fa-redo"></i> Retry
                </button>
            </div>
        `;
    }
}

// ==================== EVENT LISTENERS ====================
function attachEventListeners() {
    // Mobile sidebar toggle
    sidebarToggle?.addEventListener('click', () => {
        sidebar.classList.toggle('open');
    });

    // Gender tabs
    document.querySelectorAll('.gender-tab').forEach(tab => {
        tab.addEventListener('click', (e) => {
            switchGender(e.target.dataset.gender);
        });
    });

    // Category expansion
    document.querySelectorAll('.category-item.expandable .category-header').forEach(header => {
        header.addEventListener('click', (e) => {
            toggleCategory(e.currentTarget);
        });
    });

    // Service links
    document.querySelectorAll('.subcategory-list a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const service = e.target.dataset.service;
            loadServicePage(service);
            closeSidebarOnMobile();
        });
    });

    // Top navigation links
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const page = e.target.dataset.page;
            handleNavigation(page);
        });
    });

    // Standalone category links (like Loyalty Card)
    document.querySelectorAll('.category-header.standalone').forEach(header => {
        header.addEventListener('click', (e) => {
            const page = e.currentTarget.dataset.page;
            if (page) {
                handleNavigation(page);
                closeSidebarOnMobile();
            }
        });
    });

    // Search functionality
    searchInput?.addEventListener('input', (e) => {
        handleSearch(e.target.value);
    });

    // Book appointment buttons (initial ones)
    document.querySelectorAll('.btn-book-nav, .btn-book').forEach(btn => {
        btn.addEventListener('click', () => {
            showBookingAlert();
        });
    });

    // Window resize
    window.addEventListener('resize', () => {
        if (window.innerWidth >= 992 && sidebar) {
            sidebar.classList.remove('open');
        }
    });
}

// ==================== NAVIGATION ====================
function handleNavigation(page) {
    appState.setPage(page);
    
    // Update active nav link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.classList.remove('active');
        if (link.dataset.page === page) {
            link.classList.add('active');
        }
    });

    // Load appropriate page
    switch(page) {
        case 'home':
            loadHomePage();
            break;
        case 'services':
            loadAllServicesPage();
            break;
        case 'loyalty':
            loadLoyaltyPage();
            break;
        case 'admin':
            loadAdminPage();
            break;
        default:
            loadHomePage();
    }
}

// ==================== PAGE LOADERS ====================
function loadHomePage() {
    contentArea.innerHTML = createHomePage();
}

function loadAllServicesPage() {
    const servicesData = getServicesData();
    const currentGender = appState.getState().currentGender;
    const allServices = getAllServices(servicesData, currentGender);
    displayServices(allServices, 'All Services');
}

function loadServicePage(serviceName) {
    const servicesData = getServicesData();
    const currentGender = appState.getState().currentGender;
    
    appState.setService(serviceName);
    
    const services = servicesData[currentGender][serviceName] || [];
    const title = formatServiceTitle(serviceName);
    displayServices(services, title);
    
    // Update active subcategory
    document.querySelectorAll('.subcategory-list a').forEach(link => {
        link.classList.remove('active');
        if (link.dataset.service === serviceName) {
            link.classList.add('active');
        }
    });
}

function loadLoyaltyPage() {
    contentArea.innerHTML = createLoyaltyPage();
}

function loadAdminPage() {
    contentArea.innerHTML = createAdminPage();
    
    // Attach admin button event after a tick
    setTimeout(() => {
        const adminBtn = document.getElementById('adminAccessBtn');
        if (adminBtn) {
            adminBtn.addEventListener('click', () => {
                alert('Please contact your administrator for access credentials.');
            });
        }
    }, 0);
}

// ==================== SERVICE DISPLAY ====================
function displayServices(services, title) {
    const content = createServicesGrid(services, title);
    contentArea.innerHTML = content;

    // Attach view buttons event
    setTimeout(() => {
        document.querySelectorAll('.btn-view').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const serviceId = parseInt(e.target.dataset.id);
                showServiceDetails(serviceId);
            });
        });
    }, 0);
}

function showServiceDetails(serviceId) {
    const servicesData = getServicesData();
    const service = findServiceById(servicesData, serviceId);
    if (!service) return;

    alert(
        `Booking: ${service.name}\n` +
        `Price: ₹${service.price}\n` +
        `Duration: ${service.duration}\n\n` +
        `Please call +91 1234567890 to confirm your appointment.`
    );
}

function showBookingAlert() {
    alert('Booking system coming soon! Please call us at +91 1234567890');
}

// ==================== HELPER FUNCTIONS ====================
function switchGender(gender) {
    appState.setGender(gender);
    
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

    // Reload current service if viewing one
    const servicesData = getServicesData();
    const currentService = appState.getState().currentService;
    
    if (currentService && servicesData[gender][currentService]) {
        loadServicePage(currentService);
    } else {
        loadAllServicesPage();
    }
}

function toggleCategory(header) {
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

function getAllServices(servicesData, gender) {
    const allServices = [];
    Object.values(servicesData[gender] || {}).forEach(category => {
        allServices.push(...category);
    });
    return allServices;
}

function findServiceById(servicesData, id) {
    const allServices = [];
    Object.values(servicesData.women || {}).forEach(cat => allServices.push(...cat));
    Object.values(servicesData.men || {}).forEach(cat => allServices.push(...cat));
    return allServices.find(s => s.id === id);
}

function formatServiceTitle(serviceName) {
    return serviceName
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

function closeSidebarOnMobile() {
    if (window.innerWidth < 992 && sidebar) {
        sidebar.classList.remove('open');
    }
}

function handleSearch(query) {
    const servicesData = getServicesData();
    const currentGender = appState.getState().currentGender;
    const currentService = appState.getState().currentService;
    
    if (!query.trim()) {
        if (currentService) {
            loadServicePage(currentService);
        } else {
            loadAllServicesPage();
        }
        return;
    }

    const allServices = getAllServices(servicesData, currentGender);
    const filtered = allServices.filter(service => 
        service.name.toLowerCase().includes(query.toLowerCase()) ||
        service.description.toLowerCase().includes(query.toLowerCase())
    );

    displayServices(filtered, `Search Results for "${query}"`);
}

// Export for compatibility
export { loadServicePage, loadHomePage };