/**
 * POST /api/stripe/create-checkout-session
 * Generic Stripe Checkout session creator, usable outside the booking flow
 * (e.g. a "Buy a Gift Card" button, a product purchase for a jewelry-store
 * or dealer variant of this template). Returns 501 with a clear message if
 * Stripe isn't configured, so the front end can show a sensible fallback
 * instead of a raw error.
 */
const express = require("express");

module.exports = function (env, businessConfig) {
  const router = express.Router();

  router.post("/create-checkout-session", async (req, res) => {
    if (!env.hasStripe) {
      return res.status(501).json({
        message: "Payments aren't configured yet. Add STRIPE_SECRET_KEY to .env.local to enable checkout.",
      });
    }

    const { itemName, amount, currency, customerEmail } = req.body || {};
    if (!itemName || !amount) {
      return res.status(400).json({ message: "itemName and amount are required." });
    }

    try {
      const Stripe = require("stripe");
      const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
      const session = await stripe.checkout.sessions.create({
        mode: "payment",
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: (currency || businessConfig.services.currency || "usd").toLowerCase(),
              product_data: { name: itemName },
              unit_amount: Math.round(amount * 100),
            },
            quantity: 1,
          },
        ],
        customer_email: customerEmail,
        success_url: `${process.env.PUBLIC_BASE_URL || "http://localhost:3000"}/?payment=success`,
        cancel_url: `${process.env.PUBLIC_BASE_URL || "http://localhost:3000"}/?payment=cancelled`,
      });
      res.json({ checkoutUrl: session.url });
    } catch (err) {
      console.error("Stripe error:", err.message);
      res.status(502).json({ message: "Could not create a checkout session right now." });
    }
  });

  return router;
};
