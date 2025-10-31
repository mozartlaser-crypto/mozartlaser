// ============================
// CART HANDLING LOGIC (Optimized)
// ============================

// Elements
const cartIcon = document.getElementById('cart-icon');
const cartPanel = document.getElementById('cart-panel');
const closeCartBtn = document.getElementById('close-cart');
const cartItemsList = document.getElementById('cart-items');
const cartCount = document.getElementById('cart-count');
const cartTotal = document.getElementById('cart-total');
const checkoutButton = document.getElementById('checkout');

// ============================
// LOAD CART FROM LOCALSTORAGE
// ============================
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// ============================
// SHOW / HIDE CART PANEL
// ============================
function showCart() {
  cartPanel.classList.add('show');          // show immediately
  requestAnimationFrame(updateCart);        // update DOM asynchronously
}

function hideCart() {
  cartPanel.classList.remove('show');
}

// Open cart on icon click
cartIcon.addEventListener('click', (e) => {
  e.stopPropagation();
  showCart();
});

// Close cart on button click
closeCartBtn.addEventListener('click', hideCart);

// Hide cart when clicking outside
document.addEventListener('click', (e) => {
  if (!cartPanel.contains(e.target) && !cartIcon.contains(e.target)) {
    hideCart();
  }
});

// ============================
// SAVE CART TO LOCALSTORAGE
// ============================
function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

// ============================
// ADD ITEM TO CART
// ============================
function addToCart(name, price) {
  price = parseFloat(price);
  if (isNaN(price)) return;

  const existingItem = cart.find(item => item.name === name);
  if (existingItem) {
    existingItem.quantity++;
  } else {
    cart.push({ name, price, quantity: 1 });
  }

  showCart();               // show panel instantly
  requestAnimationFrame(() => {
    saveCart();
  });
}

// ============================
// UPDATE CART DISPLAY
// ============================
function updateCart() {
  cartItemsList.innerHTML = '';

  let total = 0;
  let itemCount = 0;

  cart.forEach((item, index) => {
    const li = document.createElement('li');

    // Item text
    const text = document.createElement('span');
    text.textContent = `${item.name} x${item.quantity} — $${(item.price * item.quantity).toFixed(2)}`;
    li.appendChild(text);

    // Remove button
    const removeBtn = document.createElement('button');
    removeBtn.textContent = 'Remove';
    removeBtn.style.marginLeft = '10px';
    removeBtn.style.padding = '2px 6px';
    removeBtn.style.fontSize = '0.8rem';
    removeBtn.style.cursor = 'pointer';

    removeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      cart.splice(index, 1);
      saveCart();
      requestAnimationFrame(updateCart);  // update asynchronously
    });

    li.appendChild(removeBtn);
    cartItemsList.appendChild(li);

    total += item.price * item.quantity;
    itemCount += item.quantity;
  });

  cartTotal.textContent = total.toFixed(2);
  cartCount.textContent = itemCount;
}

// Initial update to show saved cart
updateCart();

// ============================
// STRIPE CHECKOUT
// ============================
checkoutButton.addEventListener('click', async () => {
  try {
    if (cart.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    const response = await fetch("https://mozart-backend.onrender.com/create-checkout-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: cart })
    });

    const session = await response.json();

    if (session.url) {
      window.location.href = session.url;
    } else {
      console.error("Stripe session error:", session);
      alert("Checkout failed. Please try again.");
    }

  } catch (error) {
    console.error("Checkout error:", error);
    alert("Something went wrong during checkout.");
  }
});

// ============================
// ADD-TO-CART BUTTONS
// ============================
document.querySelectorAll('.add-to-cart').forEach(button => {
  button.addEventListener('click', () => {
    const name = button.dataset.name;
    const price = parseFloat(button.dataset.price);

    if (!name || isNaN(price)) {
      console.error("Add to cart error — missing name or price", { name, price, button });
      alert("This product is not properly configured.");
      return;
    }

    addToCart(name, price);
  });
});

// Expose addToCart globally if needed
window.addToCart = addToCart;