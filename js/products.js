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
     image     - path to the product photo (images/products/<id>.jpg,
                 ~1000x1250 / 4:5). Currently free-licensed (CC0/public-domain)
                 stock placeholders — replace with the client's real photography.
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
  ['#3B82F6', '#1F63E8'],  // blue
  ['#5B9BF8', '#1E5FE0'],  // light blue -> blue
  ['#8DBBFB', '#2E6FEA'],  // pale blue -> blue
  ['#2E6FEA', '#123FA6'],  // blue -> deep
  ['#4F8DF7', '#1F63E8'],  // sky blue -> blue
  ['#7AAEF9', '#1B57CC'],  // soft blue -> blue
  ['#1F63E8', '#0B2E78'],  // blue -> navy
  ['#9CC4FC', '#2E6FEA'],  // pale -> blue
  ['#3E82F4', '#0F3FA8'],  // blue -> deep
  ['#6BA3F8', '#1F63E8'],  // sky -> blue
  ['#2A66E2', '#0A2A6E'],  // blue -> darkest navy
  ['#86B6FB', '#1E5FE0']   // light -> blue
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

/* PLACEHOLDER CATALOG — Bésa (African goods)
   These 16 products are realistic stand-ins for demoing the storefront.
   Names/prices/descriptions are illustrative — replace each entry with the
   client's real products, prices, and photography once supplied. */
const PRODUCTS = [
  /* ---- Clothing ---- */
  { id: "ankara-maxi-dress",   name: "Ankara Print Maxi Dress",     category: "Clothing",    price: 48.00,
    image: "images/products/ankara-maxi-dress.jpg",
    tag: "New", rating: 5, reviews: 184,
    description: "Placeholder copy: a flowing maxi dress cut from vibrant Ankara wax print. Replace with the client's real fabric, sizing, and care details." },

  { id: "dashiki-shirt",       name: "Embroidered Dashiki Shirt",   category: "Clothing",    price: 38.00,
    image: "images/products/dashiki-shirt.jpg",
    tag: "", rating: 5, reviews: 327,
    description: "Placeholder copy: a relaxed-fit dashiki with traditional neckline embroidery. Swap for real product details — fabric, fit, and sizing." },

  { id: "kente-wrap",          name: "Handwoven Kente Wrap",        category: "Clothing",    price: 65.00,
    image: "images/products/kente-wrap.jpg",
    tag: "", rating: 5, reviews: 96,
    description: "Placeholder copy: a handwoven Kente cloth wrap in a bold colourway. Replace with the client's real weave, dimensions, and origin." },

  { id: "adire-tunic",         name: "Adire Indigo Tunic",          category: "Clothing",    price: 42.00,
    image: "images/products/adire-tunic.jpg",
    tag: "Sale", rating: 4, reviews: 142,
    description: "Placeholder copy: a hand-dyed adire indigo tunic, each piece a little different. Swap for real materials and sizing." },

  /* ---- Food ---- */
  { id: "jollof-spice",        name: "Jollof Rice Spice Blend",     category: "Food",        price: 9.50,
    image: "images/products/jollof-spice.jpg",
    tag: "Bestseller", rating: 5, reviews: 512,
    description: "Placeholder copy: a ready-mixed jollof seasoning blend. Replace with the client's real ingredients, weight, and allergen info." },

  { id: "plantain-chips",      name: "Plantain Chips (Salted)",     category: "Food",        price: 6.00,
    image: "images/products/plantain-chips.jpg",
    tag: "", rating: 5, reviews: 433,
    description: "Placeholder copy: crisp, lightly salted plantain chips. Swap for real pack size, ingredients, and nutrition details." },

  { id: "suya-pepper",         name: "Suya Pepper Mix",             category: "Food",        price: 7.50,
    image: "images/products/suya-pepper.jpg",
    tag: "", rating: 5, reviews: 218,
    description: "Placeholder copy: a smoky, nutty suya spice rub for grilled meats. Replace with the client's real blend and heat level." },

  { id: "zobo-tea",            name: "Hibiscus (Zobo) Tea",         category: "Food",        price: 8.00,
    image: "images/products/zobo-tea.jpg",
    tag: "New", rating: 4, reviews: 87,
    description: "Placeholder copy: dried hibiscus petals for a tart, ruby-red zobo drink. Swap for real weight, sourcing, and brewing notes." },

  /* ---- Skincare ---- */
  { id: "shea-butter",         name: "Raw Unrefined Shea Butter",   category: "Skincare",    price: 14.00,
    image: "images/products/shea-butter.jpg",
    tag: "Bestseller", rating: 5, reviews: 641,
    description: "Placeholder copy: raw, unrefined shea butter for skin and hair. Replace with the client's real sourcing, weight, and ingredients." },

  { id: "black-soap",          name: "African Black Soap",          category: "Skincare",    price: 11.00,
    image: "images/products/black-soap.jpg",
    tag: "", rating: 5, reviews: 389,
    description: "Placeholder copy: traditional African black soap for daily cleansing. Swap for real ingredients, weight, and usage guidance." },

  { id: "baobab-oil",          name: "Baobab Body Oil",             category: "Skincare",    price: 18.00,
    image: "images/products/baobab-oil.jpg",
    tag: "", rating: 4, reviews: 154,
    description: "Placeholder copy: lightweight baobab seed oil rich in vitamins. Replace with the client's real ingredients and volume." },

  { id: "moringa-mask",        name: "Moringa Clay Face Mask",      category: "Skincare",    price: 16.00,
    image: "images/products/moringa-mask.jpg",
    tag: "New", rating: 4, reviews: 73,
    description: "Placeholder copy: a moringa-and-clay face mask for a weekly refresh. Swap for real ingredients, weight, and directions." },

  /* ---- Accessories ---- */
  { id: "waist-beads",         name: "Handmade Waist Beads",        category: "Accessories", price: 12.00,
    image: "images/products/waist-beads.jpg",
    tag: "", rating: 5, reviews: 201,
    description: "Placeholder copy: handmade glass waist beads on an adjustable strand. Replace with the client's real materials and sizing." },

  { id: "gele-headwrap",       name: "Ankara Headwrap (Gele)",      category: "Accessories", price: 22.00,
    image: "images/products/gele-headwrap.jpg",
    tag: "", rating: 5, reviews: 176,
    description: "Placeholder copy: a stiffened Ankara gele headwrap that holds its shape. Swap for real fabric, length, and styling notes." },

  { id: "cowrie-necklace",     name: "Cowrie Shell Necklace",       category: "Accessories", price: 28.00,
    image: "images/products/cowrie-necklace.jpg",
    tag: "Sale", rating: 4, reviews: 118,
    description: "Placeholder copy: a beaded necklace finished with natural cowrie shells. Replace with the client's real materials and length." },

  { id: "raffia-tote",         name: "Woven Raffia Tote",           category: "Accessories", price: 34.00,
    image: "images/products/raffia-tote.jpg",
    tag: "", rating: 5, reviews: 95,
    description: "Placeholder copy: a hand-woven raffia tote with leather handles. Swap for real dimensions, materials, and capacity." }
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
  catClothing:    ph("Clothing",     { w: 600, h: 600 }),
  catFood:        ph("Food",         { w: 600, h: 600 }),
  catSkincare:    ph("Skincare",     { w: 600, h: 600 }),
  catAccessories: ph("Accessories",  { w: 600, h: 600 })
};
