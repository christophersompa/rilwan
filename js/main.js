/* ============================================
   MAIN — rendering + page wiring
   Runs on every page; each block checks for the
   elements it needs before doing anything, so one
   file can be shared across index/shop/product/cart.
   ============================================ */

/* Render N stars (filled for rating, empty otherwise) as text. */
function ratingStars(n) {
  const filled = "★".repeat(Math.min(5, Math.round(n || 0)));
  const empty = "☆".repeat(5 - filled.length);
  return filled + empty;
}

function productCardHTML(product) {
  const tag = product.tag
    ? `<span class="product-tag">${product.tag}</span>`
    : "";
  return `
    <article class="product-card">
      <div class="product-media">
        ${tag}
        <button class="wishlist-btn" type="button" aria-label="Add ${product.name} to wishlist" data-wishlist="${product.id}">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
        </button>
        <a class="card-link" href="product.html?id=${product.id}">
          <img src="${product.image}" alt="${product.name}" loading="lazy">
        </a>
        <button class="quick-shop" type="button" data-add="${product.id}">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18M16 10a4 4 0 0 1-8 0"/></svg>
          Quick Shop
        </button>
      </div>
      <div class="body">
        <h3><a class="card-link" href="product.html?id=${product.id}">${product.name}</a></h3>
        <div class="rating-row">
          <span class="rating-stars">${ratingStars(product.rating)}</span>
          <span class="rating-count">${product.reviews || 0} Reviews</span>
        </div>
        <div class="price-row">
          <span class="price">${formatPrice(product.price)}</span>
        </div>
      </div>
    </article>`;
}

function renderGrid(containerId, list) {
  const el = document.getElementById(containerId);
  if (!el) return;
  el.innerHTML = list.map(productCardHTML).join("");

  // Quick Shop / Add to cart
  el.querySelectorAll("[data-add]").forEach(btn => {
    btn.addEventListener("click", e => {
      e.preventDefault();
      e.stopPropagation();
      addToCart(btn.dataset.add, 1);
      const original = btn.innerHTML;
      btn.innerHTML = "✓ Added";
      setTimeout(() => (btn.innerHTML = original), 1000);
    });
  });

  // Wishlist toggle (visual only — not persisted)
  el.querySelectorAll("[data-wishlist]").forEach(btn => {
    btn.addEventListener("click", e => {
      e.preventDefault();
      e.stopPropagation();
      btn.classList.toggle("is-active");
    });
  });
}

/* ---------- Category mosaic ---------- */
function renderCategoryTiles(containerId) {
  const el = document.getElementById(containerId);
  if (!el) return;

  // First tile is "New Arrivals" (uses the category image), then a tile per
  // category. The first tile takes the left column full-height via CSS.
  const tiles = [
    {
      label: "New Arrivals",
      image: SITE_IMAGES.catNewArrivals,
      href: "shop.html"
    },
    ...CATEGORIES.map(cat => ({
      label: cat,
      image: ({
        Outerwear:   SITE_IMAGES.catOuterwear,
        Tops:        SITE_IMAGES.catTops,
        Bottoms:     SITE_IMAGES.catBottoms,
        Accessories: SITE_IMAGES.catAccessories
      })[cat] || SITE_IMAGES.catNewArrivals,
      href: `shop.html?category=${encodeURIComponent(cat)}`
    }))
  ];

  el.innerHTML = tiles.map(t => `
    <a class="cat-tile" href="${t.href}">
      <img src="${t.image}" alt="" loading="lazy">
      <span class="cat-tile-content">
        <span>
          <h3>${t.label}</h3>
        </span>
        <span class="cat-tile-arrow" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17 17 7M7 7h10v10"/></svg>
        </span>
      </span>
    </a>
  `).join("");
}

/* ---------- Mobile nav ---------- */
function initMobileNav() {
  const toggle = document.querySelector("[data-nav-toggle]");
  const drawer = document.querySelector("[data-nav-drawer]");
  const close = document.querySelector("[data-nav-close]");
  if (!toggle || !drawer) return;
  toggle.addEventListener("click", () => drawer.classList.add("is-open"));
  close?.addEventListener("click", () => drawer.classList.remove("is-open"));
  drawer.querySelectorAll("a").forEach(a =>
    a.addEventListener("click", () => drawer.classList.remove("is-open"))
  );
}

/* ---------- Newsletter stub ---------- */
function initNewsletterForm() {
  document.querySelectorAll("[data-newsletter-form]").forEach(form => {
    form.addEventListener("submit", e => {
      e.preventDefault();
      const btn = form.querySelector("button");
      const original = btn.textContent;
      btn.textContent = "Subscribed ✓";
      form.reset();
      setTimeout(() => (btn.textContent = original), 2200);
    });
  });
}

/* ---------- Hero visual injection ---------- */
function initHeroImages() {
  const heroImg = document.querySelector("[data-hero-image]");
  if (heroImg) heroImg.src = SITE_IMAGES.heroModel;

  const heroCardImg = document.querySelector("[data-hero-card-image]");
  if (heroCardImg) heroCardImg.src = PRODUCTS[0].image;
}

/* ---------- Featured section ---------- */
function initFeatured() {
  const img = document.querySelector("[data-featured-image]");
  if (img) img.src = SITE_IMAGES.featuredModel;

  const card = document.querySelector("[data-featured-product-card]");
  if (card) {
    const p = PRODUCTS[3]; // any product can stand in here
    card.querySelector("[data-fp-img]").src = p.image;
    card.querySelector("[data-fp-name]").textContent = p.name;
    card.querySelector("[data-fp-price]").textContent = formatPrice(p.price);
  }
}

/* ---------- Best sellers lifestyle cards ---------- */
function initBestSellers() {
  const set = document.querySelectorAll("[data-best-image]");
  const sources = [SITE_IMAGES.bestseller1, SITE_IMAGES.bestseller2, SITE_IMAGES.bestseller3];
  set.forEach((el, i) => { el.src = sources[i] || sources[0]; });
}

/* ---------- Banner + fresh looks + promo lifestyle ---------- */
function initLifestyleImages() {
  document.querySelectorAll("[data-img-banner]").forEach(el => el.src = SITE_IMAGES.bannerLifestyle);
  document.querySelectorAll("[data-img-fresh]").forEach(el => el.src = SITE_IMAGES.freshLooks);
  document.querySelectorAll("[data-img-fresh-2]").forEach(el => el.src = SITE_IMAGES.freshLooks2);
  document.querySelectorAll("[data-img-promo]").forEach(el => el.src = SITE_IMAGES.promoLifestyle);
}

/* ---------- Testimonials ---------- */
const TESTIMONIALS = [
  {
    quote: "This has always taken the time to really understand our needs and our many audiences, while keeping true to the overall agency brand.",
    name: "Camilla Scianna",
    date: "December 21, 2025",
    avatar: "avatar1"
  },
  {
    quote: "Our brand has been strengthened through their creative application. I am very happy and fit with their work. Thanks.",
    name: "Gillian Freeman",
    date: "December 21, 2025",
    avatar: "avatar2"
  },
  {
    quote: "We are very pleased with the excellent customer service. Their work is very fast and accurate and really helps my goal of building all.",
    name: "Peter Ronstadt",
    date: "December 21, 2025",
    avatar: "avatar3"
  }
];
function initTestimonials() {
  const el = document.getElementById("testimonial-grid");
  if (!el) return;
  el.innerHTML = TESTIMONIALS.map(t => `
    <div class="testimonial-card">
      <p>${t.quote}</p>
      <div class="testimonial-author">
        <div class="testimonial-avatar">
          <img src="${SITE_IMAGES[t.avatar]}" alt="${t.name}" loading="lazy">
        </div>
        <div>
          <div class="testimonial-author-name">${t.name}</div>
          <div class="testimonial-author-meta">
            <span class="testimonial-stars">★★★★★</span>
            <span>${t.date}</span>
          </div>
        </div>
      </div>
    </div>`).join("");
}

/* ---------- Shop page ---------- */
function initShopPage() {
  const grid = document.getElementById("shop-grid");
  if (!grid) return;

  const params = new URLSearchParams(window.location.search);
  let activeCategory = params.get("category") || "all";

  const pillsEl = document.getElementById("filter-pills");
  const pills = ["all", ...CATEGORIES];
  pillsEl.innerHTML = pills
    .map(
      c =>
        `<button class="filter-pill ${c === activeCategory ? "is-active" : ""}" data-filter="${c}">${
          c === "all" ? "All products" : c
        }</button>`
    )
    .join("");

  function apply(category) {
    activeCategory = category;
    pillsEl.querySelectorAll(".filter-pill").forEach(p =>
      p.classList.toggle("is-active", p.dataset.filter === category)
    );
    const list = category === "all" ? PRODUCTS : PRODUCTS.filter(p => p.category === category);
    renderGrid("shop-grid", list);
    const countEl = document.getElementById("result-count");
    if (countEl) countEl.textContent = `${list.length} product${list.length === 1 ? "" : "s"}`;
  }

  pillsEl.querySelectorAll(".filter-pill").forEach(p =>
    p.addEventListener("click", () => apply(p.dataset.filter))
  );

  apply(activeCategory);
}

/* ---------- Product detail page ---------- */
function initProductDetail() {
  const el = document.getElementById("product-detail");
  if (!el) return;

  const params = new URLSearchParams(window.location.search);
  const product = PRODUCTS.find(p => p.id === params.get("id")) || PRODUCTS[0];
  let qty = 1;

  el.innerHTML = `
    <div class="product-media">
      <img src="${product.image}" alt="${product.name}">
    </div>
    <div>
      <span class="cat-tag">${product.category}</span>
      <h1>${product.name}</h1>
      <div class="rating-row" style="margin-top:10px;display:flex;align-items:center;gap:8px;">
        <span class="rating-stars" style="color:var(--orange);letter-spacing:1px;font-size:14px;">${ratingStars(product.rating)}</span>
        <span class="rating-count" style="color:var(--ink-faint);font-size:12px;">${product.reviews || 0} Reviews</span>
      </div>
      <p class="price">${formatPrice(product.price)}</p>
      <p class="desc">${product.description}</p>
      <div class="qty-row">
        <div class="qty-stepper">
          <button type="button" data-step="-1" aria-label="Decrease quantity">–</button>
          <span data-qty-display>1</span>
          <button type="button" data-step="1" aria-label="Increase quantity">+</button>
        </div>
        <button class="btn btn-flare" type="button" data-add-detail="${product.id}">Add to cart</button>
      </div>
      <div class="detail-meta">
        <span>Free shipping over $50</span>
        <span>Ships within 2–4 days</span>
        <span>Easy 14-day returns</span>
      </div>
    </div>`;

  document.title = `${product.name} — Bésa`;

  const display = el.querySelector("[data-qty-display]");
  el.querySelectorAll("[data-step]").forEach(btn => {
    btn.addEventListener("click", () => {
      qty = Math.max(1, qty + Number(btn.dataset.step));
      display.textContent = qty;
    });
  });

  el.querySelector("[data-add-detail]").addEventListener("click", e => {
    addToCart(product.id, qty);
    const btn = e.currentTarget;
    const original = btn.textContent;
    btn.textContent = "Added ✓";
    setTimeout(() => (btn.textContent = original), 1200);
  });
}

/* ---------- Cart page ---------- */
function initCartPage() {
  const linesEl = document.getElementById("cart-lines");
  if (!linesEl) return;

  function render() {
    const lines = cartLinesWithProducts();

    if (lines.length === 0) {
      linesEl.innerHTML = `
        <div class="empty-cart">
          <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M6 8h6l4 24h22l4-16H14"/><circle cx="20" cy="40" r="2.4"/><circle cx="34" cy="40" r="2.4"/></svg>
          <p>Your cart is empty.</p>
          <a class="btn btn-flare btn-sm" style="margin-top:16px" href="shop.html">Browse products</a>
        </div>`;
    } else {
      linesEl.innerHTML = lines
        .map(
          line => `
        <div class="cart-line">
          <div class="product-media">
            <img src="${line.product.image}" alt="${line.product.name}">
          </div>
          <div>
            <span class="cat-tag">${line.product.category}</span>
            <h3>${line.product.name}</h3>
            <button class="remove" type="button" data-remove="${line.id}">Remove</button>
          </div>
          <div class="qty-stepper">
            <button type="button" data-line-step="-1" data-id="${line.id}" aria-label="Decrease quantity">–</button>
            <span>${line.qty}</span>
            <button type="button" data-line-step="1" data-id="${line.id}" aria-label="Increase quantity">+</button>
          </div>
          <span class="line-price">${formatPrice(line.product.price * line.qty)}</span>
        </div>`
        )
        .join("");
    }

    const subtotal = cartTotal();
    document.getElementById("summary-subtotal").textContent = formatPrice(subtotal);
    document.getElementById("summary-total").textContent = formatPrice(subtotal);
    const checkoutBtn = document.getElementById("checkout-btn");
    if (checkoutBtn) checkoutBtn.disabled = lines.length === 0;

    linesEl.querySelectorAll("[data-remove]").forEach(btn =>
      btn.addEventListener("click", () => {
        removeFromCart(btn.dataset.remove);
        render();
      })
    );
    linesEl.querySelectorAll("[data-line-step]").forEach(btn =>
      btn.addEventListener("click", () => {
        const current = getCart().find(l => l.id === btn.dataset.id);
        const next = (current ? current.qty : 0) + Number(btn.dataset.lineStep);
        updateQty(btn.dataset.id, next);
        render();
      })
    );
  }

  render();

  document.getElementById("checkout-btn")?.addEventListener("click", () => {
    alert(
      "This is a skeleton checkout — connect Stripe Checkout here once payments are wired up."
    );
  });
}

/* ---------- About page image fills ---------- */
function initAboutImages() {
  document.querySelectorAll("[data-about-block]").forEach((el, i) => {
    const imgs = [
      SITE_IMAGES.bestseller1,
      SITE_IMAGES.bestseller2,
      SITE_IMAGES.bestseller3,
      SITE_IMAGES.bannerLifestyle
    ];
    el.style.backgroundImage = `url('${imgs[i % imgs.length]}')`;
  });
}

/* ---------- Promo popup ---------- */
function initPromoPopup() {
  const overlay = document.querySelector("[data-promo-overlay]");
  if (!overlay) return;

  const DISMISS_KEY = "besa_promo_dismissed";
  const memoryFlag = { dismissed: false };

  function getDismissed() {
    try {
      return window.sessionStorage.getItem(DISMISS_KEY) === "1";
    } catch (e) {
      return memoryFlag.dismissed;
    }
  }
  function setDismissed() {
    try {
      window.sessionStorage.setItem(DISMISS_KEY, "1");
    } catch (e) {
      memoryFlag.dismissed = true;
    }
  }

  if (getDismissed()) return;

  const closeBtn = overlay.querySelector("[data-promo-close]");
  const dismissLink = overlay.querySelector("[data-promo-dismiss]");
  const form = overlay.querySelector("[data-promo-form]");
  const successEl = overlay.querySelector("[data-promo-success]");
  let lastFocused = null;

  function onKeydown(e) {
    if (e.key === "Escape") closePopup();
  }

  function openPopup() {
    lastFocused = document.activeElement;
    overlay.classList.add("is-open");
    overlay.querySelector("input")?.focus();
    document.addEventListener("keydown", onKeydown);
  }

  function closePopup(markDismissed = true) {
    overlay.classList.remove("is-open");
    if (markDismissed) setDismissed();
    document.removeEventListener("keydown", onKeydown);
    if (lastFocused instanceof HTMLElement) lastFocused.focus();
  }

  closeBtn?.addEventListener("click", () => closePopup());
  dismissLink?.addEventListener("click", () => closePopup());
  overlay.addEventListener("click", e => {
    if (e.target === overlay) closePopup();
  });

  form?.addEventListener("submit", e => {
    e.preventDefault();
    form.hidden = true;
    if (successEl) successEl.hidden = false;
    setDismissed();
    setTimeout(() => closePopup(false), 1800);
  });

  setTimeout(openPopup, 1500);
}

document.addEventListener("DOMContentLoaded", () => {
  initMobileNav();
  initNewsletterForm();
  initPromoPopup();
  initHeroImages();
  initFeatured();
  initBestSellers();
  initLifestyleImages();
  initTestimonials();
  renderGrid("featured-grid", PRODUCTS.slice(0, 4));
  renderCategoryTiles("category-grid");
  initShopPage();
  initProductDetail();
  initCartPage();
  initAboutImages();
});
