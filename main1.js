const API_URL = "https://6782ae7cc51d092c3dd06dbd.mockapi.io/product/auto_parts";

// Theme state (in memory instead of localStorage)
let currentTheme = 'light';

// Multiple image handling for add form
document.getElementById('productImageFile').addEventListener('change', function(e) {
    const files = e.target.files;
    const previewContainer = document.getElementById('imagePreviewContainer');
    previewContainer.innerHTML = '';
    
    Array.from(files).forEach((file, index) => {
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const imgContainer = document.createElement('div');
                imgContainer.className = 'image-preview-item';
                imgContainer.innerHTML = `
                    <img src="${e.target.result}" class="image-preview" alt="Preview ${index + 1}" style="width: 100px; height: 100px; object-fit: cover; margin: 5px; border-radius: 5px;">
                    <button type="button" class="btn btn-sm btn-danger remove-image-btn" onclick="removeImagePreview(this, ${index})" style="position: absolute; top: 0; right: 0;">
                        <i class="fas fa-times"></i>
                    </button>
                `;
                imgContainer.style.position = 'relative';
                imgContainer.style.display = 'inline-block';
                previewContainer.appendChild(imgContainer);
            };
            reader.readAsDataURL(file);
        }
    });
    
    // Clear URL inputs when files are selected
    document.querySelectorAll('#imageUrlContainer .image-url-input').forEach(input => {
        if (input.value) input.value = '';
    });
});

// Multiple image handling for edit form
document.getElementById('editProductImageFile').addEventListener('change', function(e) {
    const files = e.target.files;
    const previewContainer = document.getElementById('editImagePreviewContainer');
    previewContainer.innerHTML = '';
    
    Array.from(files).forEach((file, index) => {
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const imgContainer = document.createElement('div');
                imgContainer.className = 'image-preview-item';
                imgContainer.innerHTML = `
                    <img src="${e.target.result}" class="image-preview" alt="Preview ${index + 1}" style="width: 100px; height: 100px; object-fit: cover; margin: 5px; border-radius: 5px;">
                    <button type="button" class="btn btn-sm btn-danger remove-image-btn" onclick="removeEditImagePreview(this, ${index})" style="position: absolute; top: 0; right: 0;">
                        <i class="fas fa-times"></i>
                    </button>
                `;
                imgContainer.style.position = 'relative';
                imgContainer.style.display = 'inline-block';
                previewContainer.appendChild(imgContainer);
            };
            reader.readAsDataURL(file);
        }
    });
});

function removeImagePreview(button, index) {
    const previewItem = button.parentElement;
    previewItem.remove();
    
    // Clear the corresponding file input
    const fileInput = document.getElementById('productImageFile');
    const dt = new DataTransfer();
    const files = fileInput.files;
    
    for (let i = 0; i < files.length; i++) {
        if (i !== index) {
            dt.items.add(files[i]);
        }
    }
    fileInput.files = dt.files;
}

function removeEditImagePreview(button, index) {
    const previewItem = button.parentElement;
    previewItem.remove();
    
    // Clear the corresponding file input
    const fileInput = document.getElementById('editProductImageFile');
    const dt = new DataTransfer();
    const files = fileInput.files;
    
    for (let i = 0; i < files.length; i++) {
        if (i !== index) {
            dt.items.add(files[i]);
        }
    }
    fileInput.files = dt.files;
}

function addImageUrlInput() {
    const container = document.getElementById('imageUrlContainer');
    const newItem = document.createElement('div');
    newItem.className = 'image-url-item mb-2';
    newItem.innerHTML = `
        <input type="url" class="form-control image-url-input" placeholder="Image URL">
        <button type="button" class="btn btn-sm btn-danger mt-1 remove-url-btn" onclick="removeImageUrl(this)">
            <i class="fas fa-times"></i> Remove
        </button>
    `;
    container.appendChild(newItem);
    
    // Show remove button for first item if there are now multiple items
    const allItems = container.querySelectorAll('.image-url-item');
    if (allItems.length > 1) {
        allItems.forEach(item => {
            const removeBtn = item.querySelector('.remove-url-btn');
            if (removeBtn) removeBtn.style.display = 'block';
        });
    }
}

function addEditImageUrlInput() {
    const container = document.getElementById('editImageUrlContainer');
    const newItem = document.createElement('div');
    newItem.className = 'image-url-item mb-2';
    newItem.innerHTML = `
        <input type="url" class="form-control image-url-input" placeholder="Image URL">
        <button type="button" class="btn btn-sm btn-danger mt-1 remove-url-btn" onclick="removeImageUrl(this)">
            <i class="fas fa-times"></i> Remove
        </button>
    `;
    container.appendChild(newItem);
}

function removeImageUrl(button) {
    const urlItem = button.parentElement;
    const container = urlItem.parentElement;
    urlItem.remove();
    
    // Hide remove buttons if only one item remains
    const remainingItems = container.querySelectorAll('.image-url-item');
    if (remainingItems.length === 1 && container.id === 'imageUrlContainer') {
        const removeBtn = remainingItems[0].querySelector('.remove-url-btn');
        if (removeBtn) removeBtn.style.display = 'none';
    }
}

async function fetchProducts() {
    try {
        const response = await axios.get(API_URL);
        const products = response.data;
        const productList = document.getElementById('productList');
        
        updateStatistics(products);

        productList.innerHTML = products.map(product => {
            const images = Array.isArray(product.images) ? product.images : (product.image ? [product.image] : []);
            const mainImage = images.length > 0 ? images[0] : 'https://via.placeholder.com/300x250';
            
            return `
                <div class="col-lg-4 col-md-6">
                    <div class="card product-card h-100">
                        <div class="product-image-container">
                            <img src="${mainImage}" class="card-img-top" alt="${product.name}" onerror="this.src='https://via.placeholder.com/300x250'" style="height: 250px; object-fit: cover;">
                            ${images.length > 1 ? `<div class="image-count-badge" style="position: absolute; top: 10px; right: 10px; background: rgba(0,0,0,0.7); color: white; padding: 2px 8px; border-radius: 10px; font-size: 12px;">${images.length} images</div>` : ''}
                        </div>
                        <div class="card-body d-flex flex-column">
                            <div class="mb-2">
                                <span class="badge ${product.status === 'available' ? 'bg-success' : 'bg-warning'}">
                                    <i class="fas ${product.status === 'available' ? 'fa-check-circle' : 'fa-clock'}"></i>
                                    ${product.status === 'available' ? 'Available' : 'On Order'}
                                </span>
                                <span class="badge bg-secondary ms-1">
                                    <i class="fas ${getGenderIcon(product.gender)}"></i>
                                    ${(product.gender || 'unisex').charAt(0).toUpperCase() + (product.gender || 'unisex').slice(1)}
                                </span>
                                ${product.category ? `<span class="badge category-badge ms-1">
                                    <i class="fas ${getCategoryIcon(product.category)}"></i>
                                    ${product.category}
                                </span>` : ''}
                                ${product.brand ? `<span class="badge brand-badge ms-1">
                                    <i class="fas fa-star"></i>
                                    ${product.brand}
                                </span>` : ''}
                            </div>
                            <h5 class="card-title">${product.name}</h5>
                            <p class="card-text">${product.description}</p>
                            ${product.descriptionURL ? `<p class="card-text"><small><a href="${product.descriptionURL}" target="_blank" class="text-decoration-none"><i class="fas fa-external-link-alt"></i> More Details</a></small></p>` : ''}
                            ${product.website ? `<p class="card-text"><small><a href="${product.website}" target="_blank" class="text-decoration-none"><i class="fas fa-globe"></i> Website</a></small></p>` : ''}
                            <p class="card-text fw-bold text-success fs-5">Price: $${product.price}</p>
                            ${images.length > 1 ? `
                                <div class="image-gallery mb-2" style="display: flex; gap: 5px; flex-wrap: wrap;">
                                    ${images.slice(1, 4).map(img => `<img src="${img}" style="width: 40px; height: 40px; object-fit: cover; border-radius: 5px;" alt="Gallery image" onerror="this.style.display='none'">`).join('')}
                                    ${images.length > 4 ? `<span class="more-images" style="display: flex; align-items: center; font-size: 12px; color: #666;">+${images.length - 4} more</span>` : ''}
                                </div>
                            ` : ''}
                            <div class="mt-auto">
                                <div class="d-flex gap-2 flex-wrap">
                                    <button class="btn btn-warning flex-fill" onclick="openEditModal('${product.id}')">
                                        <i class="fas fa-edit"></i> Edit
                                    </button>
                                    <button class="btn btn-danger flex-fill" onclick="deleteProduct('${product.id}')">
                                        <i class="fas fa-trash"></i> Delete
                                    </button>
                                </div>
                                
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    } catch (error) {
        console.error('Error fetching products:', error);
        showNotification('Error fetching products: ' + error.message, 'error');
    }
}

function updateStatistics(products) {
    const totalProducts = products.length;
    const availableProducts = products.filter(p => p.status === 'available').length;
    const orderProducts = products.filter(p => p.status === 'order').length;
    const avgPrice = totalProducts > 0 ? (products.reduce((sum, p) => sum + parseFloat(p.price || 0), 0) / totalProducts).toFixed(2) : 0;

    document.getElementById('totalProducts').textContent = totalProducts;
    document.getElementById('availableProducts').textContent = availableProducts;
    document.getElementById('orderProducts').textContent = orderProducts;
    document.getElementById('avgPrice').textContent = `$${avgPrice}`;
}

function getGenderIcon(gender) {
    switch(gender) {
        case 'male': return 'fa-mars';
        case 'female': return 'fa-venus';
        case 'child': return 'fa-child';
        default: return 'fa-users';
    }
}

function getCategoryIcon(category) {
    switch(category) {
        case 'kiyim': return 'fa-tshirt';
        case 'krosofka': return 'fa-running';
        case 'aksesuar': return 'fa-gem';
        case 'vitamin': return 'fa-pills';
        case 'kosmetika': return 'fa-spray-can';
        case 'popular': return 'fa-fire';
        default: return 'fa-tag';
    }
}

async function addProduct() {
    try {
        const name = document.getElementById('productName').value.trim();
        const description = document.getElementById('productDescription').value.trim();
        const price = document.getElementById('productPrice').value.trim();
        const gender = document.getElementById('productGender').value;
        const status = document.getElementById('productStatus').value;
        const category = document.getElementById('productCategory').value;
        const brand = document.getElementById('productBrand').value;
        const descriptionURL = document.getElementById('productDescriptionURL').value.trim();
        const website = document.getElementById('productWebsite').value.trim();
        
        // Get multiple images (both files and URLs)
        const imageFiles = document.getElementById('productImageFile').files;
        const imageUrls = Array.from(document.querySelectorAll('#imageUrlContainer .image-url-input'))
            .map(input => input.value.trim())
            .filter(url => url);

        // Validation
        if (!name || !description || !price || !gender || !status || !category || !brand) {
            showNotification('Please fill in all required fields', 'error');
            return;
        }

        if (isNaN(price) || parseFloat(price) <= 0) {
            showNotification('Please enter a valid price', 'error');
            return;
        }

        if (imageFiles.length === 0 && imageUrls.length === 0) {
            showNotification('Please provide at least one image file or image URL', 'error');
            return;
        }

        let allImages = [];
        
        // Convert files to base64
        if (imageFiles.length > 0) {
            const filePromises = Array.from(imageFiles).map(file => convertFileToBase64(file));
            const base64Images = await Promise.all(filePromises);
            allImages = allImages.concat(base64Images);
        }
        
        // Add URLs
        allImages = allImages.concat(imageUrls);

        const productData = {
            name,
            description,
            price: parseFloat(price),
            images: allImages,
            image: allImages[0], // Keep backward compatibility
            gender,
            status,
            category,
            brand,
            descriptionURL: descriptionURL || null,
            website: website || null
        };

        console.log('Sending product data:', productData);

        const response = await axios.post(API_URL, productData);
        console.log('Product added successfully:', response.data);
        
        showNotification('Product added successfully!', 'success');
        
        // Reset form
        document.getElementById('addProductForm').reset();
        document.getElementById('imagePreviewContainer').innerHTML = '';
        
        // Reset URL inputs
        const urlContainer = document.getElementById('imageUrlContainer');
        urlContainer.innerHTML = `
            <div class="image-url-item mb-2">
                <input type="url" class="form-control image-url-input" placeholder="Image URL">
                <button type="button" class="btn btn-sm btn-danger mt-1 remove-url-btn" onclick="removeImageUrl(this)" style="display: none;">
                    <i class="fas fa-times"></i> Remove
                </button>
            </div>
        `;
        
        fetchProducts();
    } catch (error) {
        console.error('Error adding product:', error);
        showNotification('Error adding product: ' + (error.response?.data?.message || error.message), 'error');
    }
}

function convertFileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
        reader.readAsDataURL(file);
    });
}

async function deleteProduct(productId) {
    if (!confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
        return;
    }

    try {
        await axios.delete(`${API_URL}/${productId}`);
        showNotification('Product deleted successfully!', 'success');
        fetchProducts();
    } catch (error) {
        console.error('Error deleting product:', error);
        showNotification('Error deleting product: ' + (error.response?.data?.message || error.message), 'error');
    }
}

async function openEditModal(id) {
    try {
        const response = await axios.get(`${API_URL}/${id}`);
        const product = response.data;
        
        document.getElementById('editProductId').value = id;
        document.getElementById('editProductName').value = product.name || '';
        document.getElementById('editProductDescription').value = product.description || '';
        document.getElementById('editProductPrice').value = product.price || '';
        document.getElementById('editProductGender').value = product.gender || 'male';
        document.getElementById('editProductStatus').value = product.status || 'available';
        document.getElementById('editProductCategory').value = product.category || '';
        document.getElementById('editProductBrand').value = product.brand || '';
        document.getElementById('editProductDescriptionURL').value = product.descriptionURL || '';
        document.getElementById('editProductWebsite').value = product.website || '';

        // Load existing images
        const editUrlContainer = document.getElementById('editImageUrlContainer');
        editUrlContainer.innerHTML = '';
        
        const images = Array.isArray(product.images) ? product.images : (product.image ? [product.image] : []);
        
        if (images.length > 0) {
            images.forEach((img) => {
                const urlItem = document.createElement('div');
                urlItem.className = 'image-url-item mb-2';
                urlItem.innerHTML = `
                    <input type="url" class="form-control image-url-input" value="${img}" placeholder="Image URL">
                    <button type="button" class="btn btn-sm btn-danger mt-1 remove-url-btn" onclick="removeImageUrl(this)">
                        <i class="fas fa-times"></i> Remove
                    </button>
                `;
                editUrlContainer.appendChild(urlItem);
            });
        } else {
            // Add one empty input if no images
            const urlItem = document.createElement('div');
            urlItem.className = 'image-url-item mb-2';
            urlItem.innerHTML = `
                <input type="url" class="form-control image-url-input" placeholder="Image URL">
                <button type="button" class="btn btn-sm btn-danger mt-1 remove-url-btn" onclick="removeImageUrl(this)" style="display: none;">
                    <i class="fas fa-times"></i> Remove
                </button>
            `;
            editUrlContainer.appendChild(urlItem);
        }
        
        // Clear preview container
        document.getElementById('editImagePreviewContainer').innerHTML = '';

        const editModal = new bootstrap.Modal(document.getElementById('editProductModal'));
        editModal.show();
    } catch (error) {
        console.error('Error loading product for edit:', error);
        showNotification('Error loading product data: ' + (error.response?.data?.message || error.message), 'error');
    }
}

async function updateProduct() {
    try {
        const id = document.getElementById('editProductId').value;
        const name = document.getElementById('editProductName').value.trim();
        const description = document.getElementById('editProductDescription').value.trim();
        const price = document.getElementById('editProductPrice').value.trim();
        const gender = document.getElementById('editProductGender').value;
        const status = document.getElementById('editProductStatus').value;
        const category = document.getElementById('editProductCategory').value;
        const brand = document.getElementById('editProductBrand').value;
        const descriptionURL = document.getElementById('editProductDescriptionURL').value.trim();
        const website = document.getElementById('editProductWebsite').value.trim();

        // Get images from edit form
        const newImageFiles = document.getElementById('editProductImageFile').files;
        const imageUrls = Array.from(document.querySelectorAll('#editImageUrlContainer .image-url-input'))
            .map(input => input.value.trim())
            .filter(url => url);

        if (!name || !description || !price || !gender || !status || !category || !brand) {
            showNotification('Please fill in all required fields', 'error');
            return;
        }

        if (isNaN(price) || parseFloat(price) <= 0) {
            showNotification('Please enter a valid price', 'error');
            return;
        }

        if (newImageFiles.length === 0 && imageUrls.length === 0) {
            showNotification('Please provide at least one image', 'error');
            return;
        }

        let allImages = [];
        
        // Convert new files to base64
        if (newImageFiles.length > 0) {
            const filePromises = Array.from(newImageFiles).map(file => convertFileToBase64(file));
            const base64Images = await Promise.all(filePromises);
            allImages = allImages.concat(base64Images);
        }
        
        // Add URLs (existing and new)
        allImages = allImages.concat(imageUrls);

        const productData = {
            name,
            description,
            price: parseFloat(price),
            images: allImages,
            image: allImages[0], // Keep backward compatibility
            gender,
            status,
            category,
            brand,
            descriptionURL: descriptionURL || null,
            website: website || null
        };

        await axios.put(`${API_URL}/${id}`, productData);
        showNotification('Product updated successfully!', 'success');
        
        const editModal = bootstrap.Modal.getInstance(document.getElementById('editProductModal'));
        editModal.hide();
        
        fetchProducts();
    } catch (error) {
        console.error('Error updating product:', error);
        showNotification('Error updating product: ' + (error.response?.data?.message || error.message), 'error');
    }
}

function addToCart(productId) {
    showNotification('Product added to cart!', 'success');
}

function showNotification(message, type) {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notif => notif.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `alert alert-${type === 'error' ? 'danger' : 'success'} notification`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 9999;
        min-width: 300px;
        max-width: 500px;
        animation: slideIn 0.3s ease;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    `;
    notification.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center;">
            <div>
                <strong>${type === 'error' ? 'Error!' : 'Success!'}</strong> ${message}
            </div>
            <button type="button" class="btn-close" onclick="this.closest('.notification').remove()"></button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification && notification.parentElement) {
            notification.remove();
        }
    }, 4000);
}

function toggleTheme() {
    const body = document.body;
    const themeToggle = document.getElementById('themeToggle');
    
    body.classList.toggle('dark-theme');
    currentTheme = body.classList.contains('dark-theme') ? 'dark' : 'light';
    
    if (currentTheme === 'dark') {
        themeToggle.innerHTML = '<i class="fas fa-sun"></i> Light-mode';
    } else {
        themeToggle.innerHTML = '<i class="fas fa-moon"></i> Dark-mode';
    }
}

// Initialize theme and load products on page load
document.addEventListener('DOMContentLoaded', function() {
    // Initialize product list
    fetchProducts();
    
    // Add CSS for animations and new badges
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        .product-image-container {
            position: relative;
        }
        .image-preview-item {
            position: relative;
            display: inline-block;
        }
        .category-badge {
            background: linear-gradient(45deg, #6f42c1, #e83e8c) !important;
            color: white;
            font-size: 0.75em;
            padding: 0.25em 0.5em;
            border-radius: 0.375rem;
        }
        .brand-badge {
            background: linear-gradient(45deg, #fd7e14, #ffc107) !important;
            color: white;
            font-size: 0.75em;
            padding: 0.25em 0.5em;
            border-radius: 0.375rem;
        }
        .product-form-section {
            background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
            border-radius: 15px;
            padding: 20px;
            margin-bottom: 20px;
            border: 1px solid #dee2e6;
        }
        .section-divider {
            border: none;
            height: 2px;
            background: linear-gradient(90deg, transparent, #6c757d, transparent);
            margin: 20px 0;
        }
    `;
    document.head.appendChild(style);
});

// Global error handler
window.addEventListener('error', function(e) {
    console.error('Global error:', e.error);
    showNotification('An unexpected error occurred. Please try again.', 'error');
});

// Handle axios errors globally
axios.interceptors.response.use(
    response => response,
    error => {
        console.error('Axios error:', error);
        if (error.code === 'NETWORK_ERROR' || !error.response) {
            showNotification('Network error. Please check your connection.', 'error');
        }
        return Promise.reject(error);
    }
);