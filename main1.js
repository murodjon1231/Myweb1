const API_URL = "https://6782ae7cc51d092c3dd06dbd.mockapi.io/product/auto_parts";

let cart = JSON.parse(localStorage.getItem('cart')) || [];

document.addEventListener('DOMContentLoaded', () => {
    fetchProducts();
    updateCartUI();
    updateCartCount();
});

async function fetchProducts() {
    try {
        const response = await fetch(API_URL);
        const products = await response.json();

        const productList = document.getElementById('product-list');
        
        if (products.length === 0) {
            productList.innerHTML = `
                <div class="col-12 text-center" style="color: #fff; padding: 50px;">
                    <h3>No products available</h3>
                    <p>Please check back later for new products.</p>
                </div>
            `;
            return;
        }

        productList.innerHTML = products.map(product => `
            <div class="product-card">
                <img src="${product.image}" alt="${product.name}" onerror="this.src='./logo.png'">
                <div class="card-body">
                    <h5 class="card-title">${product.name}</h5>
                    <p class="card-text">${product.description}</p>
                    <p class="price">$${product.price}</p>
                    <div class="card-buttons d-flex justify-content-between gap-3"> 
                        <button class="btn btn-primary" onclick="viewProductDetails(${product.id})">
                            <i class="fas fa-eye"></i> View Details
                        </button>
                        <button class="btn btn-success" onclick="quickAddToCart(${product.id}, '${escapeHtml(product.name)}', ${product.price}, '${escapeHtml(product.image)}')">
                            <i class="fas fa-cart-plus"></i> Quick Add
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error("Error fetching products:", error);
        const productList = document.getElementById('product-list');
        productList.innerHTML = `
            <div class="col-12 text-center" style="color: #fff; padding: 50px;">
                <h3>Error loading products</h3>
                <p>Please try refreshing the page or contact support.</p>
                <button class="btn btn-primary" onclick="fetchProducts()">Retry</button>
            </div>
        `;
    }
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// New function to redirect to product details page
function viewProductDetails(productId) {
    window.location.href = `product-details.html?id=${productId}`;
}

// Quick add to cart function for direct adding
function quickAddToCart(productId, productName, productPrice, productImage) {
    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
        existingItem.quantity += 1; 
        showNotification(`${productName} quantity updated in cart!`, 'success');
    } else {
        cart.push({
            id: productId,
            name: productName,
            price: productPrice,
            image: productImage,
            quantity: 1,
        });
        showNotification(`${productName} added to cart!`, 'success');
    }

    localStorage.setItem('cart', JSON.stringify(cart));

    updateCartUI();
    updateCartCount();
    
    // Optional: Show mini cart animation
    animateCartIcon();
}

// Deprecated - kept for backward compatibility but now redirects to details page
function addToCart(productId, productName, productPrice, productImage) {
    viewProductDetails(productId);
}

function removeFromCart(productId) {
    const item = cart.find(item => item.id === productId);
    cart = cart.filter(item => item.id !== productId);

    localStorage.setItem('cart', JSON.stringify(cart));

    if (item) {
        showNotification(`${item.name} removed from cart!`, 'info');
    }

    updateCartUI();
    updateCartCount();
}

function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartUI();
            updateCartCount();
        }
    }
}

function buyNow() {
    if (cart.length === 0) {
        showNotification("Your cart is empty!", 'warning');
        return;
    }

    // Redirect to cart page for checkout
    window.location.href = 'cart.html';
}

function updateCartUI() {
    const cartItemsContainer = document.getElementById('cartItems');
    const totalPriceContainer = document.getElementById('totalPrice');

    if (!cartItemsContainer) return; // Exit if cart modal doesn't exist on this page

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<div class="empty-cart">Your cart is empty</div>';
        if (totalPriceContainer) {
            totalPriceContainer.textContent = 'Total: $0.00';
        }
        return;
    }

    cartItemsContainer.innerHTML = cart.map(item => `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.name}" class="cart-item-image" onerror="this.src='./logo.png'">
            <div class="cart-item-details">
                <h6 class="cart-item-name">${item.name}</h6>
                <p class="cart-item-price">$${item.price}</p>
                <div class="quantity-controls">
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">
                        <i class="fas fa-minus"></i>
                    </button>
                    <span class="quantity">${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">
                        <i class="fas fa-plus"></i>
                    </button>
                </div>
            </div>
            <div class="cart-item-total">
                <p class="item-total">$${(item.price * item.quantity).toFixed(2)}</p>
                <button class="remove-btn" onclick="removeFromCart(${item.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');

    // Update total price
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    if (totalPriceContainer) {
        totalPriceContainer.textContent = `Total: $${total.toFixed(2)}`;
    }
}

function updateCartCount() {
    const cartCountElements = document.querySelectorAll('.cart-count, #cartCount');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    cartCountElements.forEach(element => {
        if (element) {
            element.textContent = totalItems;
            
            // Add animation when count changes
            element.style.transform = 'scale(1.2)';
            setTimeout(() => {
                element.style.transform = 'scale(1)';
            }, 200);
        }
    });
}

function clearCart() {
    if (cart.length === 0) {
        showNotification("Cart is already empty!", 'info');
        return;
    }

    if (confirm("Are you sure you want to clear your cart?")) {
        cart = [];
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartUI();
        updateCartCount();
        showNotification("Cart cleared successfully!", 'success');
    }
}

function animateCartIcon() {
    const cartIcon = document.querySelector('.cart-icon, .fa-shopping-cart');
    if (cartIcon) {
        cartIcon.style.transform = 'scale(1.3)';
        cartIcon.style.color = '#4CAF50';
        
        setTimeout(() => {
            cartIcon.style.transform = 'scale(1)';
            cartIcon.style.color = '';
        }, 300);
    }
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 25px;
        border-radius: 10px;
        color: white;
        font-weight: 600;
        z-index: 10000;
        transform: translateX(400px);
        transition: all 0.3s ease;
        max-width: 350px;
        word-wrap: break-word;
        box-shadow: 0 10px 25px rgba(0,0,0,0.2);
    `;

    switch (type) {
        case 'success':
            notification.style.background = 'linear-gradient(45deg, #4CAF50, #45a049)';
            break;
        case 'warning':
            notification.style.background = 'linear-gradient(45deg, #FF9800, #F57C00)';
            break;
        case 'error':
            notification.style.background = 'linear-gradient(45deg, #f44336, #d32f2f)';
            break;
        default:
            notification.style.background = 'linear-gradient(45deg, #2196F3, #1976D2)';
    }

    notification.textContent = message;
    document.body.appendChild(notification);

    // Slide in animation
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);

    // Auto remove after 4 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            if (notification.parentNode) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 4000);
}

// Search functionality
function searchProducts(searchTerm) {
    const productCards = document.querySelectorAll('.product-card');
    const searchLower = searchTerm.toLowerCase();

    productCards.forEach(card => {
        const title = card.querySelector('.card-title').textContent.toLowerCase();
        const description = card.querySelector('.card-text').textContent.toLowerCase();
        
        if (title.includes(searchLower) || description.includes(searchLower)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// Filter products by price range
function filterByPrice(minPrice, maxPrice) {
    const productCards = document.querySelectorAll('.product-card');

    productCards.forEach(card => {
        const priceText = card.querySelector('.price').textContent;
        const price = parseFloat(priceText.replace('$', ''));
        
        if (price >= minPrice && price <= maxPrice) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// Sort products
function sortProducts(sortBy) {
    const productList = document.getElementById('product-list');
    const products = Array.from(productList.children);

    products.sort((a, b) => {
        switch (sortBy) {
            case 'name':
                const nameA = a.querySelector('.card-title').textContent;
                const nameB = b.querySelector('.card-title').textContent;
                return nameA.localeCompare(nameB);
            
            case 'price-low':
                const priceA = parseFloat(a.querySelector('.price').textContent.replace('$', ''));
                const priceB = parseFloat(b.querySelector('.price').textContent.replace('$', ''));
                return priceA - priceB;
            
            case 'price-high':
                const priceC = parseFloat(a.querySelector('.price').textContent.replace('$', ''));
                const priceD = parseFloat(b.querySelector('.price').textContent.replace('$', ''));
                return priceD - priceC;
            
            default:
                return 0;
        }
    });

    // Re-append sorted products
    products.forEach(product => productList.appendChild(product));
}

// Checkout functionality
function proceedToCheckout() {
    if (cart.length === 0) {
        showNotification("Your cart is empty!", 'warning');
        return;
    }

    // Calculate total
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // Simple checkout simulation
    const confirmCheckout = confirm(`Proceed to checkout?\nTotal: $${total.toFixed(2)}\n\nItems: ${cart.length} product(s)`);
    
    if (confirmCheckout) {
        showNotification("Order placed successfully! Thank you for your purchase.", 'success');
        
        // Clear cart after successful checkout
        setTimeout(() => {
            cart = [];
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartUI();
            updateCartCount();
        }, 2000);
    }
}

// Theme toggle functionality
function toggleTheme() {
    const body = document.body;
    const themeToggle = document.getElementById('themeToggle');

    body.classList.toggle('dark-theme');

    if (body.classList.contains('dark-theme')) {
        themeToggle.innerHTML = '<i class="fas fa-sun"></i> Light-mode';
        localStorage.setItem('theme', 'dark');
    } else {
        themeToggle.innerHTML = '<i class="fas fa-moon"></i> Dark-mode';
        localStorage.setItem('theme', 'light');
    }
}

// Login functionality
function login() {
    window.location.href = 'login.html';
}

// Load saved theme on page load
document.addEventListener('DOMContentLoaded', function() {
    const savedTheme = localStorage.getItem('theme');
    const themeToggle = document.getElementById('themeToggle');
    
    if (savedTheme === 'dark' && themeToggle) {
        document.body.classList.add('dark-theme');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i> Light-mode';
    }
});

// Initialize search functionality if search input exists
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            searchProducts(e.target.value);
        });
    }
});

// Responsive cart modal functions
function openCartModal() {
    const cartModal = document.getElementById('cartModal');
    if (cartModal) {
        cartModal.style.display = 'block';
        updateCartUI();
    }
}

function closeCartModal() {
    const cartModal = document.getElementById('cartModal');
    if (cartModal) {
        cartModal.style.display = 'none';
    }
}

// Close modal when clicking outside
window.addEventListener('click', function(event) {
    const cartModal = document.getElementById('cartModal');
    if (event.target === cartModal) {
        closeCartModal();
    }
});