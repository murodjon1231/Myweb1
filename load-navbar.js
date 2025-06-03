// Load navbar content
document.addEventListener('DOMContentLoaded', async function() {
    try {
        // Fetch navbar content
        const response = await fetch('navbar.html');
        const navbarHtml = await response.text();
        
        // Insert navbar at the start of body
        document.body.insertAdjacentHTML('afterbegin', navbarHtml);
        
        // Set active nav item based on current page
        setActiveNavItem();
        
        // Initialize user state
        updateNavbarForUser();
        
        // Initialize theme
        initializeTheme();
        
        // Update cart counter
        updateCartCounter();
    } catch (error) {
        console.error('Error loading navbar:', error);
    }
});

// Set active nav item
function setActiveNavItem() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const currentParams = new URLSearchParams(window.location.search);
    
    // Remove any existing active classes
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    
    // Find and set the active link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage) {
            link.classList.add('active');
        }
        
        // Handle dropdown active states
        if (currentPage === 'products.html') {
            const linkParams = new URLSearchParams(link.getAttribute('href')?.split('?')[1] || '');
            if (Array.from(currentParams.entries()).every(([key, value]) => 
                linkParams.get(key) === value)) {
                link.classList.add('active');
            }
        }
    });
}

// Update navbar for user
function updateNavbarForUser() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const navbarActions = document.getElementById('navbarActions');
    
    if (!navbarActions) return;

    if (isLoggedIn && currentUser) {
        navbarActions.innerHTML = `
            <a href="cart.html" class="cart-icon">
                <i class="fas fa-shopping-cart"></i>
                <span class="cart-counter hidden">0</span>
            </a>
            
            <button class="theme-toggle" id="themeToggle" onclick="toggleTheme()">
                <i class="fas fa-moon"></i> Dark Mode
            </button>
            
            <div class="dropdown">
                <button class="btn-login dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                    <i class="fas fa-user"></i> ${currentUser.fullName.split(' ')[0]}
                </button>
                <ul class="dropdown-menu">
                    <li><a class="dropdown-item" href="profile.html"><i class="fas fa-user-cog"></i> Profile</a></li>
                    <li><a class="dropdown-item" href="cart.html"><i class="fas fa-shopping-bag"></i> Orders</a></li>
                    <li><a class="dropdown-item" href="favorites.html"><i class="fas fa-heart"></i> Favorites</a></li>
                    <li><hr class="dropdown-divider"></li>
                    <li><a class="dropdown-item" href="#" onclick="logout()"><i class="fas fa-sign-out-alt"></i> Logout</a></li>
                </ul>
            </div>
        `;
    } else {
        navbarActions.innerHTML = `
            <a href="cart.html" class="cart-icon">
                <i class="fas fa-shopping-cart"></i>
                <span class="cart-counter hidden">0</span>
            </a>
            
            <button class="theme-toggle" id="themeToggle" onclick="toggleTheme()">
                <i class="fas fa-moon"></i> Dark Mode
            </button>
            
            <a href="login.html" class="btn-login">
                <i class="fas fa-sign-in-alt"></i> Login
            </a>
            <a href="register.html" class="btn-login">
                <i class="fas fa-user-plus"></i> Register
            </a>
        `;
    }
    
    // Update cart counter
    updateCartCounter();
}

// Update cart counter
function updateCartCounter() {
    const cartCounter = document.querySelector('.cart-counter');
    if (!cartCounter) return;

    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 0), 0);

    if (totalItems > 0) {
        cartCounter.textContent = totalItems;
        cartCounter.classList.remove('hidden');
    } else {
        cartCounter.classList.add('hidden');
    }
} 