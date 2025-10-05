// Cart functionality using localStorage
const cartIcon = document.getElementById('cart-icon');
const cartPanel = document.getElementById('cart-panel');
const closeCartBtn = document.getElementById('close-cart');
const cartItemsList = document.getElementById('cart-items');
const cartTotalEl = document.getElementById('cart-total');
const cartCountEl = document.getElementById('cart-count');

let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Update cart UI
function updateCartUI() {
  cartItemsList.innerHTML = '';
  let total = 0;
  cart.forEach((item, index) => {
    const li = document.createElement('li');
    li.textContent = `${item.name} - $${item.price} x ${item.qty}`;
    // remove button
    const removeBtn = document.createElement('button');
    removeBtn.textContent = 'Remove';
    removeBtn.style.marginLeft = '8px';
    removeBtn.addEventListener('click', () => {
      cart.splice(index, 1);
      saveCart();
      updateCartUI();
    });
    li.appendChild(removeBtn);
    cartItemsList.appendChild(li);
    total += item.price * item.qty;
  });
  cartTotalEl.textContent = total.toFixed(2);
  cartCountEl.textContent = cart.reduce((acc, item) => acc + item.qty, 0);
}

// Save cart to localStorage
function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

// Add product to cart
function addToCart(product) {
  const existing = cart.find(item => item.name === product.name);
  if (existing) existing.qty += 1;
  else cart.push({...product, qty: 1});
  saveCart();
  updateCartUI();
}

// Event listeners
cartIcon.addEventListener('click', () => cartPanel.classList.toggle('show'));
closeCartBtn.addEventListener('click', () => cartPanel.classList.remove('show'));

// Initialize
updateCartUI();

// Add "Buy Now" buttons on products
document.querySelectorAll('.product-card button').forEach((btn, idx) => {
  btn.addEventListener('click', () => {
    const card = btn.closest('.product-card');
    const product = {
      name: card.querySelector('h3').textContent,
      price: parseFloat(card.getAttribute('data-price')) || 25, // Example price
    };
    addToCart(product);
  });
});
