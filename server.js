/**
 * ============================================================================
 * SERVER
 * ============================================================================
 * This server exists for exactly two reasons:
 *   1. Stripe and Resend need SECRET keys that must never reach the browser.
 *   2. Everything else (HTML/CSS/JS/GSAP) is plain static files and works
 *      fine with zero backend if you only need a brochure site with no
 *      payments or emails — see README "Static-only mode".
 *
 * Design rule followed throughout: if an API key is missing from
 * .env.local, the matching feature degrades gracefully (mock/placeholder
 * response) instead of crashing the server or the request.
 * ============================================================================
 */

require("dotenv").config({ path: require("path").join(__dirname, "..", ".env.local") });

const path = require("path");
const express = require("express");
const cors = require("cors");
const businessConfig = require("../config/business.config.js");

const app = express();
app.use(cors());
app.use(express.json());

// ----------------------------------------------------------------------------
// Static files: the whole front-end (index.html, css/, js/) plus the config
// folder so the browser can load business.config.js directly.
// ----------------------------------------------------------------------------
app.use(express.static(path.join(__dirname, "..", "public")));
app.use("/config", express.static(path.join(__dirname, "..", "config")));

// ----------------------------------------------------------------------------
// Env helper — never throws, just tells routes what's available.
// ----------------------------------------------------------------------------
const env = {
  hasStripe: Boolean(process.env.STRIPE_SECRET_KEY),
  hasResend: Boolean(process.env.RESEND_API_KEY),
  hasGoogleMaps: Boolean(process.env.GOOGLE_MAPS_API_KEY),
  hasGooglePlaces: Boolean(process.env.GOOGLE_PLACES_API_KEY),
  hasCloudinary: Boolean(
    process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET
  ),
};

// ----------------------------------------------------------------------------
// Public runtime config — safe to expose. Never put secret keys here; a
// Maps *browser* key is meant to be public and restricted by HTTP referrer
// in the Google Cloud Console, not kept secret like Stripe's key.
// ----------------------------------------------------------------------------
app.get("/api/config/public", (req, res) => {
  res.json({
    googleMapsKey: env.hasGoogleMaps ? process.env.GOOGLE_MAPS_API_KEY : null,
    googlePlacesKey: env.hasGooglePlaces ? process.env.GOOGLE_PLACES_API_KEY : null,
    businessName: businessConfig.meta.businessName,
  });
});

app.use("/api/booking", require("./routes/booking")(env, businessConfig));
app.use("/api/stripe", require("./routes/stripe")(env, businessConfig));
app.use("/api/places", require("./routes/places")(env));
app.use("/api/cloudinary", require("./routes/cloudinary")(env));

// ----------------------------------------------------------------------------
// Fallback to index.html for any unmatched non-API route (simple SPA-style
// serving; harmless for this multi-section single page).
// ----------------------------------------------------------------------------
app.get(/^(?!\/api).*/, (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "index.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`\n${businessConfig.meta.businessName} server running on http://localhost:${PORT}`);
  console.log("Configured integrations:");
  console.log(`  Stripe (deposits):        ${env.hasStripe ? "yes" : "no — booking will skip payment step"}`);
  console.log(`  Resend (emails):          ${env.hasResend ? "yes" : "no — booking will log instead of emailing"}`);
  console.log(`  Google Maps:              ${env.hasGoogleMaps ? "yes" : "no — falling back to OpenStreetMap"}`);
  console.log(`  Google Places Autocomplete: ${env.hasGooglePlaces ? "yes" : "no — address field is plain text"}`);
  console.log(`  Cloudinary:               ${env.hasCloudinary ? "yes" : "no — using static image URLs from config"}\n`);
});

module.exports = app;
