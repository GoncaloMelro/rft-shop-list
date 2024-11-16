const API_URL = 'https://rft-shop-list-api-sparkling-meadow-4377.fly.dev/products';

const productForm = document.getElementById('product-form');
const productNameInput = document.getElementById('product-name');
const productList = document.getElementById('products');

async function getProducts() {
  try {
    const response = await fetch(API_URL);
    const products = await response.json();
    renderProductList(products);
  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
  }
}

function renderProductList(products) {
  productList.innerHTML = '';

  products.forEach(product => {
    const li = document.createElement('li');
    li.innerHTML = `
      <input 
        type="checkbox" 
        class="form-check-input me-2" 
        style="margin-right: 10px;" 
        ${product.status ? 'checked' : ''} 
        onchange="updateProductStatus(${product.id}, '${product.name}', this.checked)" 
      />
      <span style="display: flex; align-items: center; justify-content: space-between; width: 100%">
        <span style="text-decoration: ${product.status ? 'line-through' : 'none'};">
          ${product.name}
        </span>
        <button type="button" class="delete-btn float-right" onclick="deleteProduct(${product.id})">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x" viewBox="0 0 16 16">
            <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"/>
          </svg>
        </button>
      </span>
    `;

    productList.appendChild(li);
  });
}

async function updateProductStatus(id, name, newStatus) {
  var product = {
    id: id,
    name: name,
    status: newStatus
  };

  try {
    const response = await fetch(API_URL, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(product),
    });

    const newProduct = await response.json();
    getProducts();
  } catch (error) {
    console.error('Erro ao criar produto:', error);
  }
}

async function createProduct(event) {
  event.preventDefault();

  const name = productNameInput.value.trim();

  if (!name) {
    alert('O nome do produto é obrigatório!');
    return;
  }

  const product = {
    name: name,
  };

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(product),
    });

    const newProduct = await response.json();
    console.log('Produto criado:', newProduct);

    productForm.reset();
    getProducts();
  } catch (error) {
    console.error('Erro ao criar produto:', error);
  }
}

async function deleteProduct(id) {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      console.log(`Produto ${id} apagado`);
      getProducts();
    } else {
      console.error('Erro ao apagar o produto');
    }
  } catch (error) {
    console.error('Erro ao apagar o produto:', error);
  }
}

productForm.addEventListener('submit', createProduct);

window.onload = getProducts;
