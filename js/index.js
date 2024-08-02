document.addEventListener('DOMContentLoaded', () => {
    fetch('data/productos.json')
        .then(response => response.json())
        .then(data => loadProducts(data));
});

const loadProducts = (products) => {
    const productList = document.querySelector('.container-items');
    products.forEach(product => {
        const productHTML = `
            <div class="item" id="${product.id}">
                <figure>
                    <img src="${product.image}" alt="producto" />
                </figure>
                <div class="info-product">
                    <h2>${product.title}</h2>
                    <p class="price">${product.price}</p>
                    <button class="btn-add-cart" data-id="${product.id}">Añadir al carrito</button>
                </div>
            </div>
        `;
        productList.innerHTML += productHTML;
    });
}

const btnCart = document.querySelector('.container-cart-icon');
const containerCartProducts = document.querySelector('.container-cart-products');

btnCart.addEventListener('click', () => {
    containerCartProducts.classList.toggle('hidden-cart');
});

/*===============*/
const rowProduct = document.querySelector('.row-product');

// Variable de arreglo de productos
let allProducts = [];

const valorTotal = document.querySelector('.total-pagar');

const countProducts = document.querySelector('#contador-productos');

document.addEventListener('click', e => {
    if (e.target.classList.contains('btn-add-cart')) {
        const productElement = e.target.parentElement.parentElement;
        const productId = e.target.getAttribute('data-id');
        const productTitle = productElement.querySelector('h2').textContent;
        const productPrice = productElement.querySelector('p').textContent;

        const infoProduct = {
            id: productId,
            quantity: 1,
            title: productTitle,
            price: productPrice,
        };

        const exists = allProducts.some(product => product.id === infoProduct.id);

        if (exists) {
            const products = allProducts.map(product => {
                if (product.id === infoProduct.id) {
                    product.quantity++;
                    return product;
                } else {
                    return product;
                }
            });
            allProducts = [...products];
        } else {
            allProducts = [...allProducts, infoProduct];
        }

        showHTML();
    }

    if (e.target.classList.contains('icon-close')) {
        const productElement = e.target.parentElement;
        const productId = productElement.querySelector('.titulo-producto-carrito').dataset.id;

        allProducts = allProducts.filter(
            product => product.id !== productId
        );
        showHTML();
    }
});

// Función para mostrar el HTML
const showHTML = () => {
    // Limpiar el contenido del carrito
    rowProduct.innerHTML = '';

    if (!allProducts.length) {
        rowProduct.innerHTML = `
        <p class="cart-empty">El carrito está vacío</p>
        `;
        valorTotal.innerText = `$0`;
        countProducts.innerText = 0;
        return; // Salir de la función si el carrito está vacío
    }

    let total = 0;
    let totalOfProducts = 0;

    allProducts.forEach(product => {
        const containerProduct = document.createElement('div');
        containerProduct.classList.add('cart-product');

        containerProduct.innerHTML = `
        <div class="info-cart-product">
            <span class="cantidad-producto-carrito">${product.quantity}</span>
            <p class="titulo-producto-carrito" data-id="${product.id}">${product.title}</p>
            <span class="precio-producto-carrito">${product.price}</span>
        </div>
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="icon-close"
        >
            <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M6 18L18 6M6 6l12 12"
            />
        </svg>
        `;

        rowProduct.append(containerProduct);

        total += parseInt(product.quantity * product.price.slice(1));
        totalOfProducts += product.quantity;
    });

    valorTotal.innerText = `$${total}`;
    countProducts.innerText = totalOfProducts;
}