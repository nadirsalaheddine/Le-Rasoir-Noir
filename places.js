/**
 * GET /api/places/autocomplete?input=...
 * Thin proxy to Google Places Autocomplete so the request's API key never
 * appears in client-side JS. If GOOGLE_PLACES_API_KEY isn't set, returns an
 * empty suggestion list rather than an error — the front end's address
 * field just behaves as a plain text input in that case.
 */
const express = require("express");

module.exports = function (env) {
  const router = express.Router();

  router.get("/autocomplete", async (req, res) => {
    const input = req.query.input;
    if (!input) return res.json({ predictions: [] });

    if (!env.hasGooglePlaces) {
      return res.json({ predictions: [], note: "Places API not configured — using free text input." });
    }

    try {
      const url = new URL("https://maps.googleapis.com/maps/api/place/autocomplete/json");
      url.searchParams.set("input", input);
      url.searchParams.set("key", process.env.GOOGLE_PLACES_API_KEY);

      const response = await fetch(url.toString());
      const data = await response.json();
      res.json({ predictions: data.predictions || [] });
    } catch (err) {
      console.error("Places autocomplete failed:", err.message);
      res.json({ predictions: [] });
    }
  });

  return router;
};
