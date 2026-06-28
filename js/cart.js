/* ============================================
   CART — storage + state
   ----------------------------------------------
   Uses localStorage when available (real hosting)
   and silently falls back to an in-memory object
   when storage is blocked (some sandboxed
   previews disable it). Either way the cart works
   for the current session; only persistence across
   page loads depends on which mode is active.
   ============================================ */

const CART_KEY = "besa_cart_v1";

const memoryStore = {};

const safeStorage = {
  get(key) {
    try {
      const raw = window.localStorage.getItem(key);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return memoryStore[key] || null;
    }
  },
  set(key, value) {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      memoryStore[key] = value;
    }
  }
};

function getCart() {
  return safeStorage.get(CART_KEY) || [];
}

function saveCart(cart) {
  safeStorage.set(CART_KEY, cart);
  renderCartBadge();
}

function addToCart(id, qty = 1) {
  const cart = getCart();
  const existing = cart.find(line => line.id === id);
  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({ id, qty });
  }
  saveCart(cart);
}

function updateQty(id, qty) {
  let cart = getCart();
  if (qty <= 0) {
    cart = cart.filter(line => line.id !== id);
  } else {
    const existing = cart.find(line => line.id === id);
    if (existing) existing.qty = qty;
  }
  saveCart(cart);
}

function removeFromCart(id) {
  const cart = getCart().filter(line => line.id !== id);
  saveCart(cart);
}

function cartCount() {
  return getCart().reduce((sum, line) => sum + line.qty, 0);
}

function cartLinesWithProducts() {
  return getCart()
    .map(line => {
      const product = PRODUCTS.find(p => p.id === line.id);
      return product ? { ...line, product } : null;
    })
    .filter(Boolean);
}

function cartTotal() {
  return cartLinesWithProducts().reduce(
    (sum, line) => sum + line.product.price * line.qty,
    0
  );
}

function formatPrice(value) {
  return "$" + value.toFixed(2);
}

function renderCartBadge() {
  document.querySelectorAll("[data-cart-count]").forEach(el => {
    el.textContent = cartCount();
  });
}

document.addEventListener("DOMContentLoaded", renderCartBadge);
