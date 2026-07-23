# Luxury Business Template

A premium, single-page website template built with **HTML5, CSS3, vanilla JavaScript and GSAP** — demonstrated here as a luxury barbershop ("Le Rasoir Noir"), but architected from the ground up to relaunch as a restaurant, beauty salon, gym, medical clinic, real estate agency, car dealer, jewelry store, café, spa, or hotel **without touching the application's structure.**

Every piece of business-specific content — name, logo, colors, images, services, pricing, staff, location, hours, contact info — lives in **one file**: [`config/business.config.js`](./config/business.config.js). Everything else (HTML, CSS, JS, animations, API routes) reads from that file.

---

## 1. Quick start

### Option A — Static-only (no backend, no npm install)
Just open `public/index.html` in a browser, or serve the `public/` folder with any static file server. The site, animations, and content all work. The booking form will show a "call or email us directly" fallback, and the map will render via OpenStreetMap (no key needed).

```bash
npx serve public
```

### Option B — Full mode (booking emails, deposits, maps, uploads)
```bash
npm install
cp .env.example .env.local     # fill in whichever keys you have
npm start                      # serves the site AND the API on http://localhost:3000
```

You don't need every key filled in. Each integration degrades gracefully on its own — see the startup log for exactly what's active.

---

## 2. Relaunching this template for a different business

1. Duplicate `config/business.config.js` → e.g. `config/business.config.restaurant.js`.
2. Edit every field: `meta`, `theme.colors`, `theme.fonts`, `hero`, `about`, `services.categories` (rename "Cuts/Shaves" to "Starters/Mains", etc.), `staff.members`, `gallery.images`, `testimonials.quotes`, `location`, `booking`, `footer`.
3. At the bottom of the file, change `const ACTIVE_CONFIG = barberShopConfig;` to point at your new export.
4. That's it — no HTML, CSS, or JS file needs to change. The rendering layer (`public/js/render.js`) reads the config shape generically (`services.categories[].items[]`, `staff.members[]`, etc.), so it fits any of the industries listed above as long as you keep the same shape.

**Design tokens:** `theme.colors` (6 hex values) and `theme.fonts` (3 Google Fonts roles: display / body / mono) drive the entire visual identity. Change those two things alone and the whole site re-skins.

---

## 3. APIs used, and what happens if a key is missing

| Service | Used for | If not configured |
|---|---|---|
| **Stripe** | Booking deposits / payments | Booking still works; no payment step is added |
| **Resend** | Booking confirmation emails | Booking is logged server-side instead of emailed |
| **Google Maps** | Interactive map embed | Falls back to a keyless OpenStreetMap embed |
| **Google Places** | Address autocomplete | Address fields behave as plain text inputs |
| **Cloudinary** | Image uploads/management | Site keeps using the static image URLs in the config |
| **Unsplash/Pexels** | Demo photography only | Swap `image`/`images` URLs in the config for your own photos |

All keys live in `.env.local` (never committed — see `.gitignore`). See `.env.example` for the full list and where to get each one.

**Security note:** the Stripe secret key, Resend key, Cloudinary secret, and Places key all stay server-side (`server/routes/*.js`) and are never sent to the browser. The Google Maps key is the one exception — Maps JS keys are designed to be used client-side and should instead be restricted by HTTP referrer in the Google Cloud Console.

---

## 4. Project structure

```
config/
  business.config.js      ← the single source of truth (edit this to rebrand)
public/
  index.html              ← page skeleton (IDs only — no business content)
  css/
    variables.css          ← design tokens (mirrors theme.colors/fonts)
    main.css               ← layout & components
  js/
    render.js              ← paints config content into the DOM
    animations.js           ← GSAP: hero reveal, scroll reveals, nav
    booking.js              ← booking form submit + offline fallback
    map.js                  ← Google Maps / OpenStreetMap switch
server/
  server.js               ← Express app, static hosting, route mounting
  routes/
    booking.js             ← email + optional Stripe deposit
    stripe.js              ← generic checkout-session endpoint
    places.js              ← Places Autocomplete proxy
    cloudinary.js          ← signed-upload endpoint
.env.example               ← every environment variable, documented
```

---

## 5. Pushing to GitHub

```bash
cd luxury-business-template
git init
git add .
git commit -m "Initial commit: luxury business template (barbershop demo)"
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repo>.git
git push -u origin main
```

`.env.local` is already excluded via `.gitignore`, so your real API keys will never be pushed. Anyone cloning the repo copies `.env.example` to `.env.local` and fills in their own keys.

---

## 6. Deploying

- **Static-only:** any static host (GitHub Pages, Netlify, Vercel, Cloudflare Pages) — just publish `public/`.
- **Full mode:** any Node host (Render, Railway, Fly.io, a VPS) — run `npm install && npm start`, and set the environment variables from `.env.example` in that host's dashboard (not in a committed file).
