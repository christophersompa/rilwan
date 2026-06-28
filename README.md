# Bésa — storefront

A small, dependency-free storefront front-end built with plain **HTML, CSS, and JavaScript** — no build step, no framework. It's a *skeleton*: the layout, cart, and product rendering are fully wired up, so launching a real store is mostly a matter of swapping in the client's brand name, palette, and product catalog.

## Pages

| File | Page |
|------|------|
| `index.html` | Home — hero, categories, featured collection, testimonials |
| `shop.html`  | Shop — product grid with category filters |
| `about.html` | About |
| `cart.html`  | Cart |

## Project structure

```
.
├── index.html        # Home
├── shop.html         # Product listing
├── about.html        # About
├── cart.html         # Cart
├── css/
│   └── styles.css    # All styles
└── js/
    ├── products.js   # Placeholder product catalog (edit this to add real products)
    ├── cart.js       # Cart state, persisted via localStorage (with in-memory fallback)
    └── main.js       # Rendering + page wiring, shared across all pages
```

## Running it locally

It's static — no install or build required. Either:

- **Open directly:** double-click `index.html`, or
- **Serve it** (recommended, so relative paths and `fetch` behave like production):

  ```bash
  # Python 3
  python -m http.server 8000
  ```

  Then visit <http://localhost:8000>.

## Customizing for a real store

1. **Products** — edit `js/products.js`. It's the only file you need to touch to populate the catalog; each entry documents its fields (name, category, price, image, rating, etc.). Images currently use generated SVG gradient placeholders — replace the `image` values with real photography (~800×900px portrait recommended).
2. **Branding** — the brand name "Bésa" appears in the HTML (logo, titles, footer); tune the color palette / fonts in `css/styles.css`.
3. **Copy** — swap the placeholder marketing copy throughout the HTML pages.

## Notes

- No external runtime dependencies; fonts are loaded from Google Fonts via `<link>`.
- The cart uses `localStorage` when available and falls back to in-memory state when storage is blocked (e.g. some sandboxed previews), so it always works for the current session.
