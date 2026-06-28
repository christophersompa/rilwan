/* ============================================
   PRODUCT DATA — placeholder catalog
   ----------------------------------------------
   This is the ONLY file you need to edit to add
   real products. Replace each entry below once
   the client has decided what they're selling.

   Fields:
     id        - unique slug, used in the URL (product.html?id=...)
     name      - product name
     category  - used for the shop page filters
     price     - number, in whole currency units (e.g. 24.00)
     image     - URL for the product image. Currently a generated
                 SVG gradient placeholder via ph(). Replace with the
                 client's real photography (recommend ~800x900px portrait).
     description - shown on the product detail page
     tag       - optional label shown on the card (e.g. "Sale", "New") — leave blank for none
     rating    - 1-5, shown as stars on the card
     reviews   - integer, shown next to the stars
   ============================================ */

/* ---- Gradient placeholder helper -----------------------------------
   ph(label, opts?) returns an inline SVG data-URI: a warm-palette
   linear gradient with a soft radial highlight, plus a small label
   in the bottom-left. No network needed.

   The gradient colours are picked deterministically from the label,
   so each product gets a different gradient — but the same product
   always gets the same one.

   Swap the ph(...) call for a real image URL when you have one.
----------------------------------------------------------------------- */
const GRADIENT_PALETTE = [
  ['#FF8B2D', '#D86515'],  // bright orange → deep orange
  ['#FFB36B', '#F47B20'],  // peach → orange
  ['#F5C842', '#F47B20'],  // yellow → orange
  ['#FFCAA8', '#FF8B2D'],  // soft peach → bright orange
  ['#FFD9B0', '#D86515'],  // cream peach → deep orange
  ['#FFA882', '#D86515'],  // salmon → deep orange
  ['#F5C842', '#E89614'],  // yellow → amber
  ['#FFE9D6', '#F47B20'],  // cream → orange
  ['#FF9966', '#D86515'],  // coral → deep orange
  ['#FFB088', '#A8430A'],  // peach → dark amber
  ['#FFCC70', '#FF6B1A'],  // gold → vivid orange
  ['#FFA060', '#9B3B0A']   // tangerine → burnt
];

function _hash(str) {
  let h = 0;
  str = String(str || '');
  for (let i = 0; i < str.length; i++) {
    h = ((h << 5) - h) + str.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

function _esc(s) {
  return String(s || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function ph(label, opts) {
  opts = opts || {};
  const w = opts.w || 800;
  const h = opts.h || 900;

  const hash = _hash(label || 'x');
  const grad = opts.gradient || GRADIENT_PALETTE[hash % GRADIENT_PALETTE.length];
  const c1 = grad[0];
  const c2 = grad[1];

  // Pick gradient direction from hash too — gives more visual variety
  const angles = [
    { x1: '0%', y1: '0%',  x2: '100%', y2: '100%' }, // diagonal ↘
    { x1: '0%', y1: '100%', x2: '100%', y2: '0%' },  // diagonal ↗
    { x1: '0%', y1: '0%',  x2: '0%',   y2: '100%' }, // vertical ↓
    { x1: '0%', y1: '0%',  x2: '100%', y2: '0%' }    // horizontal →
  ];
  const ang = angles[(hash >> 4) % angles.length];

  // Soft highlight position — top-left or top-right
  const highlight = (hash >> 8) % 2 === 0
    ? { cx: '20%', cy: '20%' }
    : { cx: '80%', cy: '20%' };

  const gid = 'g' + hash;
  const rid = 'r' + hash;

  const labelSvg = (label && opts.showLabel !== false)
    ? '<text x="' + Math.round(w * 0.04) + '" y="' + (h - Math.round(w * 0.035)) + '" ' +
        'font-family="-apple-system, Inter, sans-serif" font-size="' + Math.round(w * 0.028) + '" ' +
        'font-weight="500" fill="white" opacity="0.6" letter-spacing="0.5">' + _esc(label) + '</text>'
    : '';

  const svg =
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + w + ' ' + h + '" preserveAspectRatio="xMidYMid slice">' +
      '<defs>' +
        '<linearGradient id="' + gid + '" x1="' + ang.x1 + '" y1="' + ang.y1 + '" x2="' + ang.x2 + '" y2="' + ang.y2 + '">' +
          '<stop offset="0%" stop-color="' + c1 + '"/>' +
          '<stop offset="100%" stop-color="' + c2 + '"/>' +
        '</linearGradient>' +
        '<radialGradient id="' + rid + '" cx="' + highlight.cx + '" cy="' + highlight.cy + '" r="65%">' +
          '<stop offset="0%" stop-color="white" stop-opacity="0.35"/>' +
          '<stop offset="100%" stop-color="white" stop-opacity="0"/>' +
        '</radialGradient>' +
      '</defs>' +
      '<rect width="' + w + '" height="' + h + '" fill="url(#' + gid + ')"/>' +
      '<rect width="' + w + '" height="' + h + '" fill="url(#' + rid + ')"/>' +
      labelSvg +
    '</svg>';

  return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
}

/* Avatar placeholder — gradient circle with a white initial */
function phAvatar(initial) {
  const hash = _hash(initial);
  const grad = GRADIENT_PALETTE[hash % GRADIENT_PALETTE.length];
  const gid = 'av' + hash;
  const svg =
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">' +
      '<defs>' +
        '<linearGradient id="' + gid + '" x1="0%" y1="0%" x2="100%" y2="100%">' +
          '<stop offset="0%" stop-color="' + grad[0] + '"/>' +
          '<stop offset="100%" stop-color="' + grad[1] + '"/>' +
        '</linearGradient>' +
      '</defs>' +
      '<rect width="120" height="120" fill="url(#' + gid + ')"/>' +
      '<text x="50%" y="56%" text-anchor="middle" dominant-baseline="middle" ' +
        'font-family="-apple-system, Inter, sans-serif" font-size="52" font-weight="700" ' +
        'fill="white">' + _esc(initial) + '</text>' +
    '</svg>';
  return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
}

const PRODUCTS = [
  { id: "product-01", name: "Classic Denim Jacket",       category: "Outerwear",   price: 75.00,
    image: ph("Denim Jacket"),
    tag: "", rating: 5, reviews: 238,
    description: "Placeholder description. Swap this copy for real product details — materials, fit, what makes it worth buying." },

  { id: "product-02", name: "Slim Fit Chinos",             category: "Outerwear",   price: 50.00,
    image: ph("Slim Chinos"),
    tag: "Sale", rating: 5, reviews: 839,
    description: "Placeholder description. Swap this copy for real product details — materials, fit, what makes it worth buying." },

  { id: "product-03", name: "Floral Summer Dress",         category: "Outerwear",   price: 65.00,
    image: ph("Summer Dress"),
    tag: "", rating: 5, reviews: 358,
    description: "Placeholder description. Swap this copy for real product details — materials, fit, what makes it worth buying." },

  { id: "product-04", name: "Essential Crewneck Sweater",  category: "Outerwear",   price: 45.00,
    image: ph("Crewneck Sweater"),
    tag: "", rating: 4, reviews: 987,
    description: "Placeholder description. Swap this copy for real product details — materials, fit, what makes it worth buying." },

  { id: "product-05", name: "Linen Button-Down Shirt",     category: "Tops",        price: 58.00,
    image: ph("Linen Shirt"),
    tag: "New", rating: 5, reviews: 142,
    description: "Placeholder description. Swap this copy for real product details — materials, fit, what makes it worth buying." },

  { id: "product-06", name: "Vintage Graphic Tee",         category: "Tops",        price: 28.00,
    image: ph("Graphic Tee"),
    tag: "", rating: 4, reviews: 412,
    description: "Placeholder description. Swap this copy for real product details — materials, fit, what makes it worth buying." },

  { id: "product-07", name: "Oversized Wool Coat",         category: "Tops",        price: 165.00,
    image: ph("Wool Coat"),
    tag: "", rating: 5, reviews: 76,
    description: "Placeholder description. Swap this copy for real product details — materials, fit, what makes it worth buying." },

  { id: "product-08", name: "Striped Cotton Polo",         category: "Tops",        price: 38.00,
    image: ph("Cotton Polo"),
    tag: "Sale", rating: 4, reviews: 203,
    description: "Placeholder description. Swap this copy for real product details — materials, fit, what makes it worth buying." },

  { id: "product-09", name: "High-Waist Mom Jeans",        category: "Bottoms",     price: 72.00,
    image: ph("Mom Jeans"),
    tag: "", rating: 5, reviews: 521,
    description: "Placeholder description. Swap this copy for real product details — materials, fit, what makes it worth buying." },

  { id: "product-10", name: "Tailored Black Trousers",     category: "Bottoms",     price: 88.00,
    image: ph("Tailored Trousers"),
    tag: "", rating: 5, reviews: 167,
    description: "Placeholder description. Swap this copy for real product details — materials, fit, what makes it worth buying." },

  { id: "product-11", name: "Pleated Midi Skirt",          category: "Bottoms",     price: 54.00,
    image: ph("Midi Skirt"),
    tag: "New", rating: 4, reviews: 89,
    description: "Placeholder description. Swap this copy for real product details — materials, fit, what makes it worth buying." },

  { id: "product-12", name: "Cargo Utility Pants",         category: "Bottoms",     price: 68.00,
    image: ph("Cargo Pants"),
    tag: "", rating: 4, reviews: 354,
    description: "Placeholder description. Swap this copy for real product details — materials, fit, what makes it worth buying." },

  { id: "product-13", name: "Canvas Backpack",             category: "Accessories", price: 62.00,
    image: ph("Canvas Backpack"),
    tag: "", rating: 5, reviews: 298,
    description: "Placeholder description. Swap this copy for real product details — materials, fit, what makes it worth buying." },

  { id: "product-14", name: "Round Frame Sunglasses",      category: "Accessories", price: 32.00,
    image: ph("Sunglasses"),
    tag: "Sale", rating: 4, reviews: 145,
    description: "Placeholder description. Swap this copy for real product details — materials, fit, what makes it worth buying." },

  { id: "product-15", name: "Minimal Leather Watch",       category: "Accessories", price: 128.00,
    image: ph("Leather Watch"),
    tag: "", rating: 5, reviews: 412,
    description: "Placeholder description. Swap this copy for real product details — materials, fit, what makes it worth buying." },

  { id: "product-16", name: "Wide-Brim Sun Hat",           category: "Accessories", price: 42.00,
    image: ph("Sun Hat"),
    tag: "", rating: 4, reviews: 73,
    description: "Placeholder description. Swap this copy for real product details — materials, fit, what makes it worth buying." }
];

/* All distinct categories, derived automatically — used to build shop.html filter pills */
const CATEGORIES = [...new Set(PRODUCTS.map(p => p.category))];

/* Site-wide lifestyle imagery used in hero, featured, banners, category tiles, etc.
   All gradient placeholders for now — replace with the client's real campaign imagery. */
const SITE_IMAGES = {
  heroModel:       ph("Hero Model",         { w: 900, h: 1100 }),
  featuredModel:   ph("Featured Model",     { w: 900, h: 1100 }),
  bestseller1:     ph("Best Seller — Hero", { w: 1200, h: 1400 }),
  bestseller2:     ph("Best Seller 2",      { w: 900, h: 900 }),
  bestseller3:     ph("Best Seller 3",      { w: 900, h: 900 }),
  bannerLifestyle: ph("Lifestyle Banner",   { w: 1600, h: 900 }),
  freshLooks:      ph("Fresh Looks — Left", { w: 800, h: 1000 }),
  freshLooks2:     ph("Fresh Looks — Right",{ w: 800, h: 1000 }),
  promoLifestyle:  ph("Promo Lifestyle",    { w: 900, h: 700 }),

  /* avatars used in testimonials */
  avatar1: phAvatar("C"),
  avatar2: phAvatar("G"),
  avatar3: phAvatar("P"),

  /* category tile imagery */
  catNewArrivals: ph("New Arrivals", { w: 900, h: 1100 }),
  catOuterwear:   ph("Outerwear",    { w: 600, h: 600 }),
  catTops:        ph("Tops",         { w: 600, h: 600 }),
  catBottoms:     ph("Bottoms",      { w: 600, h: 600 }),
  catAccessories: ph("Accessories",  { w: 600, h: 600 })
};
