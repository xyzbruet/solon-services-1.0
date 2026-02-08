// Luxe Salon - State Management Module

class AppState {
    constructor() {
        this.currentGender = 'women';
        this.currentPage = 'home';
        this.currentService = null;
        this.searchQuery = '';
        this.listeners = [];
    }

    // Get current state
    getState() {
        return {
            currentGender: this.currentGender,
            currentPage: this.currentPage,
            currentService: this.currentService,
            searchQuery: this.searchQuery
        };
    }

    // Set gender
    setGender(gender) {
        if (this.currentGender !== gender) {
            this.currentGender = gender;
            this.notify('genderChanged', gender);
        }
    }

    // Set current page
    setPage(page) {
        if (this.currentPage !== page) {
            this.currentPage = page;
            this.notify('pageChanged', page);
        }
    }

    // Set current service
    setService(service) {
        if (this.currentService !== service) {
            this.currentService = service;
            this.notify('serviceChanged', service);
        }
    }

    // Set search query
    setSearchQuery(query) {
        if (this.searchQuery !== query) {
            this.searchQuery = query;
            this.notify('searchChanged', query);
        }
    }

    // Subscribe to state changes
    subscribe(callback) {
        this.listeners.push(callback);
        return () => {
            this.listeners = this.listeners.filter(listener => listener !== callback);
        };
    }

    // Notify listeners
    notify(event, data) {
        this.listeners.forEach(listener => listener(event, data, this.getState()));
    }

    // Reset to initial state
    reset() {
        this.currentGender = 'women';
        this.currentPage = 'home';
        this.currentService = null;
        this.searchQuery = '';
        this.notify('reset', null);
    }
}

// Create singleton instance
export const appState = new AppState();
