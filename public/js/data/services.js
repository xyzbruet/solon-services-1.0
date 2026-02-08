// Luxe Salon - Services Data Module (Complete JSON Loader)

let servicesData = null;

// Load services data from JSON file
export async function loadServicesData() {
    if (servicesData) {
        return servicesData;
    }
    
    try {
        // Use absolute path from root
        const response = await fetch('/services.json');
        
        if (!response.ok) {
            throw new Error(`Failed to load services data: ${response.status} ${response.statusText}`);
        }
        
        servicesData = await response.json();
        
        // Validate data structure
        if (!servicesData || !servicesData.women || !servicesData.men) {
            throw new Error('Invalid services data structure');
        }
        
        return servicesData;
        
    } catch (error) {
        console.error('Error loading services:', error);
        
        // Return empty data structure as fallback
        servicesData = {
            women: {},
            men: {}
        };
        
        throw error; // Re-throw so app can handle it
    }
}

// Get services data (ensure it's loaded first)
export function getServicesData() {
    if (!servicesData) {
        console.warn('Services data not loaded yet. Call loadServicesData() first.');
        return {
            women: {},
            men: {}
        };
    }
    return servicesData;
}

// Helper function to get all services for a gender
export function getAllServicesForGender(gender) {
    if (!servicesData) {
        console.warn('Services data not loaded yet');
        return [];
    }
    
    const allServices = [];
    const genderData = servicesData[gender];
    
    if (!genderData) {
        console.warn(`No data found for gender: ${gender}`);
        return [];
    }
    
    Object.values(genderData).forEach(category => {
        if (Array.isArray(category)) {
            allServices.push(...category);
        }
    });
    
    return allServices;
}

// Helper function to find a service by ID
export function findServiceById(id) {
    if (!servicesData) {
        console.warn('Services data not loaded yet');
        return null;
    }
    
    const allServices = [];
    
    // Get all women's services
    if (servicesData.women) {
        Object.values(servicesData.women).forEach(category => {
            if (Array.isArray(category)) {
                allServices.push(...category);
            }
        });
    }
    
    // Get all men's services
    if (servicesData.men) {
        Object.values(servicesData.men).forEach(category => {
            if (Array.isArray(category)) {
                allServices.push(...category);
            }
        });
    }
    
    return allServices.find(service => service.id === id);
}

// Helper function to search services
export function searchServices(query, gender) {
    if (!servicesData) {
        console.warn('Services data not loaded yet');
        return [];
    }
    
    const allServices = getAllServicesForGender(gender);
    const lowerQuery = query.toLowerCase();
    
    return allServices.filter(service => 
        service.name.toLowerCase().includes(lowerQuery) ||
        service.description.toLowerCase().includes(lowerQuery)
    );
}

// Helper function to get services by category
export function getServicesByCategory(gender, category) {
    if (!servicesData) {
        console.warn('Services data not loaded yet');
        return [];
    }
    
    const genderData = servicesData[gender];
    
    if (!genderData || !genderData[category]) {
        return [];
    }
    
    return genderData[category];
}

// Helper function to get all categories for a gender
export function getCategoriesForGender(gender) {
    if (!servicesData) {
        console.warn('Services data not loaded yet');
        return [];
    }
    
    const genderData = servicesData[gender];
    
    if (!genderData) {
        return [];
    }
    
    return Object.keys(genderData);
}

// Helper function to check if data is loaded
export function isDataLoaded() {
    return servicesData !== null;
}

// Export servicesData for direct access (use with caution)
export { servicesData };