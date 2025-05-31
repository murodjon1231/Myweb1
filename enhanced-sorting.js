// Enhanced sorting functionality with animations and better UX

// Add this after your existing sortProducts function or replace it
function sortProducts(sortBy) {
    if (!allProducts || allProducts.length === 0) {
        console.warn('No products loaded yet');
        return;
    }

    // Add loading animation
    const productList = document.getElementById('product-list');
    productList.classList.add('sorting-loading');

    // Get all product cards for animation
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach(card => {
        card.classList.add('sorting');
    });

    // Small delay for animation effect
    setTimeout(() => {
        let filteredProducts = [...allProducts];

        // Get current filter values
        const sortSelect = document.getElementById('sortSelect');
        const genderFilter = document.getElementById('genderFilter');
        const statusFilter = document.getElementById('statusFilter');

        const currentSort = sortSelect ? sortSelect.value : sortBy;
        const currentGender = genderFilter ? genderFilter.value : 'default';
        const currentStatus = statusFilter ? statusFilter.value : 'default';

        // Update filter indicators
        updateFilterIndicators(currentSort, currentGender, currentStatus);

        // Apply gender filter
        if (currentGender !== 'default') {
            switch (currentGender) {
                case 'gender-male':
                    filteredProducts = filteredProducts.filter(p => 
                        p.gender?.toLowerCase() === 'male' || p.gender?.toLowerCase() === 'erkak'
                    );
                    break;
                case 'gender-female':
                    filteredProducts = filteredProducts.filter(p => 
                        p.gender?.toLowerCase() === 'female' || p.gender?.toLowerCase() === 'ayol'
                    );
                    break;
                case 'gender-kids':
                    filteredProducts = filteredProducts.filter(p => 
                        p.gender?.toLowerCase() === 'kids' || 
                        p.gender?.toLowerCase() === 'child' || 
                        p.gender?.toLowerCase() === 'bola'
                    );
                    break;
            }
        }

        // Apply status filter
        if (currentStatus !== 'default') {
            switch (currentStatus) {
                case 'status-available':
                    filteredProducts = filteredProducts.filter(p => p.status === 'available');
                    break;
                case 'status-order':
                    filteredProducts = filteredProducts.filter(p => p.status !== 'available');
                    break;
            }
        }

        // Apply sorting with animation
        switch (currentSort) {
            case 'name':
                filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'price-low':
                filteredProducts.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
                break;
            case 'price-high':
                filteredProducts.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
                break;
            case 'rating':
                filteredProducts.sort((a, b) => (b.rating || 0) - (a.rating || 0));
                break;
            case 'newest':
                filteredProducts.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
                break;
            default:
                filteredProducts.sort((a, b) => parseInt(a.id) - parseInt(b.id));
        }

        // Display products with animation
        displayProductsWithAnimation(filteredProducts);

        // Show results counter
        showResultsCounter(filteredProducts.length, allProducts.length);

        // Remove loading animation
        setTimeout(() => {
            productList.classList.remove('sorting-loading');
        }, 300);

        // Show notification for filter results
        if (filteredProducts.length === 0) {
            showNotification('No products match your filters', 'info');
            showNoResultsMessage();
        } else if (filteredProducts.length < allProducts.length) {
            const productCountText = filteredProducts.length === 1 ? '1 product found' : `${filteredProducts.length} products found`;
            showNotification(productCountText, 'success');
        }

    }, 200);
}

// Enhanced display function with animations
function displayProductsWithAnimation(products) {
    const productList = document.getElementById('product-list');
    
    if (products.length === 0) {
        productList.innerHTML = `
            <div class="col-12">
                <div class="no-results">
                    <h3><i class="fas fa-search"></i> No Products Found</h3>
                    <p>Try adjusting your filters or search criteria</p>
                </div>
            </div>
        `;
        return;
    }

    productList.innerHTML = products.map((product, index) => `
        <div class="col-lg-4 col-md-6 mt-3">
            <div class="card product-card h-100 sort-fade-in" style="animation-delay: ${index * 0.1}s">
                <img src="${product.image || 'https://via.placeholder.com/300x250'}" class="card-img-top" alt="${product.name}" onerror="this.src='https://via.placeholder.com/300x250'">
                <div class="card-body d-flex flex-column">
                    <div class="mb-2">
                        <span class="status-badge ${product.status === 'available' ? 'status-available' : 'status-order'}">
                            <i class="fas ${product.status === 'available' ? 'fa-check-circle' : 'fa-clock'}"></i>
                            ${product.status === 'available' ? 'Available' : 'On Order'}
                        </span>
                        <span class="gender-badge gender-${product.gender || 'unisex'}">
                            <i class="fas ${getGenderIcon(product.gender)}"></i>
                            ${getGenderDisplayName(product.gender)}
                        </span>
                    </div>
                    <h5 class="card-title">${product.name}</h5>
                    <p class="card-text">${product.description}</p>
                    ${product.descriptionURL ? `<p class="card-text"><small><a href="${product.descriptionURL}" target="_blank" class="text-decoration-none"><i class="fas fa-external-link-alt"></i> More Details</a></small></p>` : ''}
                    ${product.website ? `<p class="card-text"><small><a href="${product.website}" target="_blank" class="text-decoration-none"><i class="fas fa-globe"></i> Website</a></small></p>` : ''}
                    <p class="card-text fw-bold text-success fs-5">Price: $${product.price}</p>
                    <div class="mt-auto">
                        <div class="card-buttons d-flex justify-content-between gap-3"> 
                            <button class="btn btn-primary" onclick="viewProductDetails(${product.id})">
                                <i class="fas fa-eye"></i> View Details
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

// Update filter indicators
function updateFilterIndicators(sort, gender, status) {
    const sortSelect = document.getElementById('sortSelect');
    const genderFilter = document.getElementById('genderFilter');
    const statusFilter = document.getElementById('statusFilter');

    // Remove existing indicators
    document.querySelectorAll('.filter-indicator').forEach(el => {
        el.classList.remove('filter-indicator', 'active');
    });

    // Add indicators for active filters
    if (sort !== 'default' && sortSelect) {
        sortSelect.parentElement.classList.add('filter-indicator', 'active');
    }
    if (gender !== 'default' && genderFilter) {
        genderFilter.parentElement.classList.add('filter-indicator', 'active');
    }
    if (status !== 'default' && statusFilter) {
        statusFilter.parentElement.classList.add('filter-indicator', 'active');
    }
}

// Show results counter
function showResultsCounter(filteredCount, totalCount) {
    // Remove existing counter
    const existingCounter = document.querySelector('.results-counter');
    if (existingCounter) {
        existingCounter.remove();
    }

    if (filteredCount < totalCount) {
        const counter = document.createElement('div');
        counter.className = 'results-counter';
        counter.innerHTML = `
            <i class="fas fa-filter"></i> 
            Showing ${filteredCount} of ${totalCount} products
        `;

        const productList = document.getElementById('product-list');
        productList.parentNode.insertBefore(counter, productList);
    }
}

// Show no results message
function showNoResultsMessage() {
    const productList = document.getElementById('product-list');
    productList.innerHTML = `
        <div class="col-12">
            <div class="no-results">
                <h3><i class="fas fa-search"></i> No Products Found</h3>
                <p>No products match your current filters. Try:</p>
                <ul style="color: #bdc3c7; text-align: left; display: inline-block; margin-top: 15px;">
                    <li>Changing your filter selections</li>
                    <li>Resetting all filters</li>
                    <li>Trying a different search term</li>
                </ul>
                <div style="margin-top: 20px;">
                    <button class="btn btn-primary" onclick="resetFilters()">
                        <i class="fas fa-refresh"></i> Reset All Filters
                    </button>
                </div>
            </div>
        </div>
    `;
}

// Enhanced reset filters function
function resetFilters() {
    // Add loading animation
    const productList = document.getElementById('product-list');
    productList.classList.add('sorting-loading');

    // Reset all dropdowns with animation
    const sortSelect = document.getElementById('sortSelect');
    const genderFilter = document.getElementById('genderFilter');
    const statusFilter = document.getElementById('statusFilter');
    
    if (sortSelect) {
        sortSelect.style.transform = 'scale(0.95)';
        setTimeout(() => {
            sortSelect.value = 'default';
            sortSelect.style.transform = 'scale(1)';
        }, 100);
    }
    
    if (genderFilter) {
        genderFilter.style.transform = 'scale(0.95)';
        setTimeout(() => {
            genderFilter.value = 'default';
            genderFilter.style.transform = 'scale(1)';
        }, 150);
    }
    
    if (statusFilter) {
        statusFilter.style.transform = 'scale(0.95)';
        setTimeout(() => {
            statusFilter.value = 'default';
            statusFilter.style.transform = 'scale(1)';
        }, 200);
    }

    // Remove filter indicators
    document.querySelectorAll('.filter-indicator').forEach(el => {
        el.classList.remove('filter-indicator', 'active');
    });

    // Remove results counter
    const resultsCounter = document.querySelector('.results-counter');
    if (resultsCounter) {
        resultsCounter.remove();
    }

    setTimeout(() => {
        // Display original products with default sorting
        if (allProducts && allProducts.length > 0) {
            let sortedProducts = [...allProducts];
            sortedProducts.sort((a, b) => parseInt(a.id) - parseInt(b.id));
            displayProductsWithAnimation(sortedProducts);
        } else {
            fetchProducts();
        }

        // Remove loading animation
        setTimeout(() => {
            productList.classList.remove('sorting-loading');
        }, 300);

        showNotification('All filters reset successfully!', 'success');
    }, 300);
}

// Enhanced search with animation
function searchProductsEnhanced(searchTerm) {
    if (!allProducts || allProducts.length === 0) {
        console.warn('No products loaded yet');
        return;
    }

    const searchLower = searchTerm.toLowerCase().trim();
    
    if (searchLower === '') {
        // If search is empty, show all products
        displayProductsWithAnimation(allProducts);
        showResultsCounter(allProducts.length, allProducts.length);
        return;
    }

    const filteredProducts = allProducts.filter(product => {
        return (
            product.name.toLowerCase().includes(searchLower) ||
            product.description.toLowerCase().includes(searchLower) ||
            (product.gender && product.gender.toLowerCase().includes(searchLower))
        );
    });

    displayProductsWithAnimation(filteredProducts);
    showResultsCounter(filteredProducts.length, allProducts.length);

    if (filteredProducts.length === 0) {
        showNotification('No products found for your search', 'info');
    } else {
        const resultText = filteredProducts.length === 1 ? '1 product found' : `${filteredProducts.length} products found`;
        showNotification(resultText, 'success');
    }
}

// Add event listeners for enhanced functionality
document.addEventListener('DOMContentLoaded', function() {
    // Enhanced search functionality
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        let searchTimeout;
        searchInput.addEventListener('input', function(e) {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                searchProductsEnhanced(e.target.value);
            }, 300); // Debounce search
        });
    }

    // Add smooth transitions to filter controls
    const filterControls = document.querySelectorAll('.form-select');
    filterControls.forEach(control => {
        control.addEventListener('change', function() {
            this.style.transform = 'scale(0.98)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 100);
        });
    });

    // Add hover effects to sorting controls
    const sortingControls = document.querySelector('.sorting-controls');
    if (sortingControls) {
        sortingControls.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
        });
        
        sortingControls.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    }
});

// Add these functions to handle the enhanced sorting dropdown options
function addAdvancedSortingOptions() {
    const sortSelect = document.getElementById('sortSelect');
    if (sortSelect && sortSelect.children.length <= 4) {
        // Add more sorting options
        const newOptions = [
            { value: 'rating', text: 'Rating (High to Low)' },
            { value: 'newest', text: 'Newest First' },
            { value: 'popularity', text: 'Most Popular' }
        ];

        newOptions.forEach(option => {
            const optionElement = document.createElement('option');
            optionElement.value = option.value;
            optionElement.textContent = option.text;
            sortSelect.appendChild(optionElement);
        });
    }
}

// Call this function after DOM loads
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(addAdvancedSortingOptions, 1000);
});