// Luxe Salon - UI Components Module

// Service Card Component
export function createServiceCard(service) {
    const popularBadge = service.popular ? 
        '<div class="popular-badge"><i class="fas fa-star"></i> POPULAR</div>' : '';
    
    return `
        <div class="service-card ${service.popular ? 'popular' : ''}">
            ${popularBadge}
            <div class="service-card-body">
                <i class="${service.icon} service-icon"></i>
                <div class="service-name">${service.name}</div>
                <div class="service-description">${service.description}</div>
                <div class="service-meta">
                    <div>
                        <div class="service-price">₹${service.price}</div>
                        <div class="service-duration"><i class="fas fa-clock"></i> ${service.duration}</div>
                    </div>
                </div>
                <button class="btn-view" data-id="${service.id}">
                    <i class="fas fa-calendar-check"></i> Book Now
                </button>
            </div>
        </div>
    `;
}

// Services Grid Component
export function createServicesGrid(services, title) {
    if (services.length === 0) {
        return `
            <div class="text-center" style="padding: 4rem 2rem;">
                <i class="fas fa-inbox" style="font-size: 4rem; color: #ddd;"></i>
                <h3 class="mt-4">No services found</h3>
                <p style="color: #999;">Try adjusting your filters or search</p>
            </div>
        `;
    }

    const servicesHTML = services.map(service => createServiceCard(service)).join('');
    
    return `
        <div>
            <h2 style="margin-bottom: 2rem; color: var(--text-dark); border-bottom: 3px solid var(--gold); padding-bottom: 0.5rem; display: inline-block;">
                ${title}
            </h2>
            <div class="services-grid">
                ${servicesHTML}
            </div>
        </div>
    `;
}

// Home Page Component
export function createHomePage() {
    return `
        <div class="welcome-page">
            <h1>Welcome to Luxe Salon</h1>
            <p class="mb-4">Experience luxury and elegance with our premium salon services</p>
            <img src="https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800" 
                 alt="Salon Interior" 
                 style="max-width: 100%; border-radius: 12px; margin: 2rem 0;">
            <div class="row mt-5">
                <div class="col-md-4">
                    <div class="text-center p-4">
                        <i class="fas fa-star" style="font-size: 3rem; color: var(--gold);"></i>
                        <h3 class="mt-3">Premium Services</h3>
                        <p>Expertly crafted treatments for your beauty needs</p>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="text-center p-4">
                        <i class="fas fa-users" style="font-size: 3rem; color: var(--gold);"></i>
                        <h3 class="mt-3">Expert Team</h3>
                        <p>Trained professionals dedicated to your care</p>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="text-center p-4">
                        <i class="fas fa-award" style="font-size: 3rem; color: var(--gold);"></i>
                        <h3 class="mt-3">Quality Products</h3>
                        <p>Only the finest brands for exceptional results</p>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Loyalty Page Component
export function createLoyaltyPage() {
    return `
        <div class="loyalty-page">
            <h2><i class="fas fa-star"></i> Loyalty Card Program</h2>
            <p style="font-size: 1.1rem; color: #666; margin-bottom: 2rem;">
                Earn rewards with every visit! Our tiered loyalty program offers exclusive benefits.
            </p>

            <div class="tier-grid">
                <div class="tier-card bronze">
                    <div class="tier-icon">🥉</div>
                    <h4>Bronze</h4>
                    <p>₹0 - ₹10,000</p>
                    <strong>5% OFF</strong>
                    <p class="mt-2" style="font-size: 0.9rem;">Basic rewards on all services</p>
                </div>

                <div class="tier-card silver">
                    <div class="tier-icon">🥈</div>
                    <h4>Silver</h4>
                    <p>₹10,001 - ₹25,000</p>
                    <strong>10% OFF</strong>
                    <p class="mt-2" style="font-size: 0.9rem;">Priority booking + special offers</p>
                </div>

                <div class="tier-card gold">
                    <div class="tier-icon">🥇</div>
                    <h4>Gold</h4>
                    <p>₹25,001 - ₹50,000</p>
                    <strong>15% OFF</strong>
                    <p class="mt-2" style="font-size: 0.9rem;">Free add-ons + birthday treats</p>
                </div>

                <div class="tier-card platinum">
                    <div class="tier-icon">💎</div>
                    <h4>Platinum</h4>
                    <p>₹50,001+</p>
                    <strong>20% OFF</strong>
                    <p class="mt-2" style="font-size: 0.9rem;">VIP perks + exclusive events</p>
                </div>
            </div>

            <div style="background: white; padding: 2rem; border-radius: 12px; margin-top: 3rem;">
                <h3 style="margin-bottom: 1.5rem;">How It Works</h3>
                <div class="row">
                    <div class="col-md-3 text-center mb-4">
                        <i class="fas fa-user-plus" style="font-size: 2.5rem; color: var(--gold);"></i>
                        <h5 class="mt-3">1. Sign Up</h5>
                        <p>Create your loyalty account</p>
                    </div>
                    <div class="col-md-3 text-center mb-4">
                        <i class="fas fa-scissors" style="font-size: 2.5rem; color: var(--gold);"></i>
                        <h5 class="mt-3">2. Book Services</h5>
                        <p>Enjoy our premium treatments</p>
                    </div>
                    <div class="col-md-3 text-center mb-4">
                        <i class="fas fa-coins" style="font-size: 2.5rem; color: var(--gold);"></i>
                        <h5 class="mt-3">3. Earn Points</h5>
                        <p>₹100 spent = 1 point earned</p>
                    </div>
                    <div class="col-md-3 text-center mb-4">
                        <i class="fas fa-gift" style="font-size: 2.5rem; color: var(--gold);"></i>
                        <h5 class="mt-3">4. Redeem Rewards</h5>
                        <p>Use points for discounts</p>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Admin Page Component
export function createAdminPage() {
    return `
        <div style="max-width: 600px; margin: 4rem auto; text-align: center;">
            <i class="fas fa-lock" style="font-size: 4rem; color: var(--gold);"></i>
            <h2 class="mt-4">Admin Access</h2>
            <p style="color: #666; margin: 1.5rem 0;">This section is restricted to authorized personnel only.</p>
            <button class="btn-view" style="max-width: 300px;" id="adminAccessBtn">
                Request Access
            </button>
        </div>
    `;
}

// Loading Component
export function createLoadingSpinner() {
    return `
        <div class="loading">
            <div class="spinner"></div>
            <p>Loading...</p>
        </div>
    `;
}
