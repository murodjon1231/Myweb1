const API_URL = "https://6782ae7cc51d092c3dd06dbd.mockapi.io/product/auto_parts";

async function fetchProducts() {
    try {
        const response = await axios.get(API_URL);
        const products = response.data;
        const productList = document.getElementById('productList');

        productList.innerHTML = products.map(product => `
            <div class="col-md-4">
                <div class="card h-100">
                    <img src="${product.image}" class="card-img-top" alt="${product.name}">
                    <div class="card-body">
                        <h5 class="card-title">${product.name}</h5>
                        <p class="card-text">${product.description}</p>
                        <p class="card-text fw-bold">Price: $${product.price}</p>
                        <button class="btn btn-warning me-2" onclick="openEditModal(${product.id}, '${product.name}', '${product.description}', ${product.price}, '${product.image}')">Edit</button>

                        <button class="btn btn-primary" >Buy Now</button>
                    </div>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error fetching products:', error);
    }
}



async function addProduct() {
    const name = document.getElementById('productName').value.trim();
    const description = document.getElementById('productDescription').value.trim();
    const price = document.getElementById('productPrice').value.trim();
    const imageURL = document.getElementById('productImageURL').value.trim();

    if (!name || !description || !price || !imageURL) {
        alert('Please fill in all fields and provide an image URL.');
        return;
    }

    try {
        await axios.post(API_URL, {
            name,
            description,
            price: parseFloat(price),
            image: imageURL,
        });

        alert('Product added successfully!');
        fetchProducts();
    } catch (error) {
        console.error('Error adding product:', error);
        alert('Error while adding the product. Check the console for details.');
    }
}

async function deleteProduct(productId) {
    try {
        await axios.delete(`${API_URL}/${productId}`);
        alert('Product deleted successfully!');
        fetchProducts();
    } catch (error) {
        console.error('Error deleting product:', error);
    }
}

function openEditModal(id, name, description, price, image) {
    document.getElementById('editProductId').value = id;
    document.getElementById('editProductName').value = name;
    document.getElementById('editProductDescription').value = description;
    document.getElementById('editProductPrice').value = price;
    document.getElementById('editProductImageURL').value = image;

    const editModal = new bootstrap.Modal(document.getElementById('editProductModal'));
    editModal.show();
}

async function updateProduct() {
    const id = document.getElementById('editProductId').value;
    const name = document.getElementById('editProductName').value.trim();
    const description = document.getElementById('editProductDescription').value.trim();
    const price = document.getElementById('editProductPrice').value.trim();
    const imageURL = document.getElementById('editProductImageURL').value.trim();

    if (!name || !description || !price || !imageURL) {
        alert('Please fill in all fields.');
        return;
    }

    try {
        await axios.put(`${API_URL}/${id}`, {
            name,
            description,
            price: parseFloat(price),
            image: imageURL,
        });

        alert('Product updated successfully!');
        fetchProducts();

        const editModal = bootstrap.Modal.getInstance(document.getElementById('editProductModal'));
        editModal.hide();
    } catch (error) {
        console.error('Error updating product:', error);
    }
}

document.addEventListener('DOMContentLoaded', fetchProducts);