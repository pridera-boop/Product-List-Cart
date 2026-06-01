const products = [
  {
    image: {
      desktop: './assets/images/image-waffle-desktop.jpg'
    },
    name: 'Waffle with Berries',
    category: 'Waffle',
    price: 6.5
  },
  {
    image: {
      desktop: './assets/images/image-creme-brulee-desktop.jpg'
    },
    name: 'Vanilla Bean Crème Brûlée',
    category: 'Crème Brûlée',
    price: 7.0
  },
  {
    image: {
      desktop: './assets/images/image-macaron-desktop.jpg'
    },
    name: 'Macaron Mix of Five',
    category: 'Macaron',
    price: 8.0
  },
  {
    image: {
      desktop: './assets/images/image-tiramisu-desktop.jpg'
    },
    name: 'Classic Tiramisu',
    category: 'Tiramisu',
    price: 5.5
  },
  {
    image: {
      desktop: './assets/images/image-baklava-desktop.jpg'
    },
    name: 'Pistachio Baklava',
    category: 'Baklava',
    price: 4.0
  },
  {
    image: {
      desktop: './assets/images/image-meringue-desktop.jpg'
    },
    name: 'Lemon Meringue Pie',
    category: 'Pie',
    price: 5.0
  },
  {
    image: {
      desktop: './assets/images/image-cake-desktop.jpg'
    },
    name: 'Red Velvet Cake',
    category: 'Cake',
    price: 4.5
  },
  {
    image: {
      desktop: './assets/images/image-brownie-desktop.jpg'
    },
    name: 'Salted Caramel Brownie',
    category: 'Brownie',
    price: 4.5
  },
  {
    image: {
      desktop: './assets/images/image-panna-cotta-desktop.jpg'
    },
    name: 'Vanilla Panna Cotta',
    category: 'Panna Cotta',
    price: 6.5
  }
];

const productGrid = document.getElementById('productGrid');
const cartItemsEl = document.getElementById('cartItems');
const cartCountEl = document.getElementById('cart-count');
const cartTotalEl = document.getElementById('cart-total');
const confirmButton = document.getElementById('confirmOrderButton');
const orderMessage = document.getElementById('orderMessage');

const cart = {};

function formatPrice(value) {
  return value.toFixed(2);
}

function renderProducts() {
  productGrid.innerHTML = '';

  products.forEach((product, index) => {
    const key = product.name;
    const quantity = cart[key]?.quantity || 0;
    const card = document.createElement('article');
    card.className = `product-card${quantity > 0 ? ' selected' : ''}`;

    card.innerHTML = `
      <img src="${product.image.desktop}" alt="${product.name}" />
      ${quantity > 0 ? `
        <div class="quantity-selector">
          <button class="quantity-button decrement" type="button" data-index="${index}">-</button>
          <span class="quantity-value">${quantity}</span>
          <button class="quantity-button increment" type="button" data-index="${index}">+</button>
        </div>
      ` : `
        <button class="cart-button" type="button" data-index="${index}">
          <img src="assets/images/icon-add-to-cart.svg" alt="Add to cart" />
          Add to Cart
        </button>
      `}
      <p class="category">${product.category}</p>
      <h3>${product.name}</h3>
      <p class="price">$${formatPrice(product.price)}</p>
    `;

    if (quantity > 0) {
      card.querySelector('.decrement').addEventListener('click', () => adjustCartQuantity(index, -1));
      card.querySelector('.increment').addEventListener('click', () => adjustCartQuantity(index, 1));
    } else {
      card.querySelector('.cart-button').addEventListener('click', () => addToCart(index));
    }

    productGrid.appendChild(card);
  });
}

function addToCart(productIndex) {
  adjustCartQuantity(productIndex, 1);
}

function adjustCartQuantity(productIndex, delta) {
  const product = products[productIndex];
  const key = product.name;

  if (!cart[key]) {
    cart[key] = {
      ...product,
      quantity: 0
    };
  }

  cart[key].quantity += delta;

  if (cart[key].quantity <= 0) {
    delete cart[key];
  }

  orderMessage.textContent = '';
  renderProducts();
  renderCart();
}

function removeFromCart(itemName) {
  delete cart[itemName];
  renderProducts();
  renderCart();
}

function getCartTotals() {
  const items = Object.values(cart);
  return items.reduce(
    (totals, item) => {
      totals.count += item.quantity;
      totals.total += item.price * item.quantity;
      return totals;
    },
    { count: 0, total: 0 }
  );
}

function renderCart() {
  const cartItems = Object.values(cart);
  cartItemsEl.innerHTML = '';

  if (cartItems.length === 0) {
    cartItemsEl.innerHTML = `
      <div class="cart-empty-state">
        <img src="assets/images/illustration-empty-cart.svg" alt="Empty cart illustration" />
        <p class="cart-empty">Your added items will appear here</p>
      </div>
    `;
  } else {
    cartItems.forEach((item) => {
      const cartRow = document.createElement('div');
      cartRow.className = 'cart-item';
      cartRow.innerHTML = `
        <div class="cart-item-info">
          <p class="item-name">${item.name}</p>
          <p class="item-meta">${item.quantity} x $${formatPrice(item.price)} = $${formatPrice(
            item.price * item.quantity
          )}</p>
        </div>
        <button class="remove-button" type="button" aria-label="Remove ${item.name}">
          <img src="assets/images/icon-remove-item.svg" alt="Remove" />
        </button>
      `;

      const removeButton = cartRow.querySelector('.remove-button');
      removeButton.addEventListener('click', () => removeFromCart(item.name));

      cartItemsEl.appendChild(cartRow);
    });
  }

  const totals = getCartTotals();
  cartCountEl.textContent = totals.count;
  cartTotalEl.textContent = formatPrice(totals.total);
}

confirmButton.addEventListener('click', () => {
  const totals = getCartTotals();

  if (totals.count === 0) {
    orderMessage.textContent = 'Add something to your cart before confirming your order.';
    return;
  }

  orderMessage.textContent = 'Your order has been confirmed!';
  Object.keys(cart).forEach((itemName) => delete cart[itemName]);
  renderCart();
});

renderProducts();
renderCart();