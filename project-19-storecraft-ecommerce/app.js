const BASE_URL = "https://fakestoreapi.com/products";

const productsGrid = document.getElementById('productsGrid');
const catalogSpinner = document.getElementById('catalogSpinner');
const cartCounter = document.getElementById('cartCounter');
const productSearchInput = document.getElementById('productSearchInput');

let globalCartCount = 0;
let fetchedProductsArray = []; // Stores the master payload for instant local filtering

window.addEventListener('DOMContentLoaded', () => {
    fetchInventory();
});

productSearchInput.addEventListener('input', (event) => {
    const searchTerm = event.target.value.toLowerCase().trim();
    
    const filteredResults = fetchedProductsArray.filter(product => 
        product.title.toLowerCase().includes(searchTerm)
    );
    
    renderProducts(filteredResults);
});


async function fetchInventory() {
    try {
        const response = await fetch(BASE_URL);
        
        if (!response.ok) {
            throw new Error("Inventory payload retrieval failed.");
        }

        fetchedProductsArray = await response.json();
        
        catalogSpinner.classList.add('d-none');
        renderProducts(fetchedProductsArray);

    } catch (error) {
        catalogSpinner.classList.add('d-none');
        productsGrid.innerHTML = `
            <div class="col-12 text-center text-danger fs-5 py-5">
                🚨 Critical Failure: Unable to fetch inventory. Server returned connection error.
            </div>
        `;
        console.error("AJAX Fetch Inventory Error:", error);
    }
}


function renderProducts(productsList) {
    productsGrid.innerHTML = ''; // Clear container completely before rendering

    if (productsList.length === 0) {
        productsGrid.innerHTML = `
            <div class="col-12 text-center text-muted fs-5 py-5">
                🔍 No matching products found. Try another keywords.
            </div>
        `;
        return;
    }

    productsList.forEach(product => {
        const cardCol = document.createElement('div');
        cardCol.className = 'col';

        cardCol.innerHTML = `
            <div class="card h-100 product-card text-white">
                <div class="img-container">
                    <img src="${product.image}" class="product-img" alt="${product.title}">
                </div>
                <div class="card-body d-flex flex-column justify-content-between p-3">
                    <div>
                        <span class="badge bg-secondary mb-2 text-uppercase small">${product.category}</span>
                        <h6 class="card-title text-white fw-bold mb-2 text-truncate-2" title="${product.title}">${product.title}</h6>
                    </div>
                    <div class="mt-3">
                        <div class="d-flex justify-content-between align-items-center mb-2">
                            <span class="price-tag">$${product.price.toFixed(2)}</span>
                        </div>
                        <button class="btn btn-outline-warning w-100 fw-bold btn-sm add-cart-btn">Add To Cart</button>
                    </div>
                </div>
            </div>
        `;

        const cartButton = cardCol.querySelector('.add-cart-btn');
        cartButton.addEventListener('click', () => {
            globalCartCount++;
            cartCounter.innerText = globalCartCount;
            
            cartButton.innerText = "✓ Added";
            cartButton.className = "btn btn-success w-100 fw-bold btn-sm";
            
            setTimeout(() => {
                cartButton.innerText = "Add To Cart";
                cartButton.className = "btn btn-outline-warning w-100 fw-bold btn-sm";
            }, 1000);
        });

        productsGrid.appendChild(cardCol);
    });
}