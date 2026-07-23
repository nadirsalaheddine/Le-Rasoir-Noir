/**
 * POST /api/booking
 * Accepts a booking request, sends a confirmation email (Resend), and — if
 * a deposit is configured in business.config.js and Stripe keys exist —
 * returns a Stripe Checkout URL for the client to redirect to.
 *
 * Every external call is wrapped so a missing/invalid key degrades to a
 * clear response rather than a 500.
 */
const express = require("express");

module.exports = function (env, businessConfig) {
  const router = express.Router();

  router.post("/", async (req, res) => {
    const { name, email, phone, service, preferredDate, notes } = req.body || {};

    if (!name || !email || !phone || !service || !preferredDate) {
      return res.status(400).json({ message: "Missing required booking fields." });
    }

    // --- 1. Send confirmation email (Resend) -----------------------------
    let emailSent = false;
    if (env.hasResend) {
      try {
        const { Resend } = require("resend");
        const resend = new Resend(process.env.RESEND_API_KEY);
        await resend.emails.send({
          from: process.env.RESEND_FROM_EMAIL || "bookings@example.com",
          to: email,
          subject: `Booking request received — ${businessConfig.meta.businessName}`,
          html: `<p>Hi ${escapeHtml(name)},</p>
                 <p>We received your request for <strong>${escapeHtml(service)}</strong> on ${escapeHtml(preferredDate)}.</p>
                 <p>We'll confirm within one business day. Notes: ${escapeHtml(notes || "—")}</p>
                 <p>— ${escapeHtml(businessConfig.meta.businessName)}</p>`,
        });
        emailSent = true;
      } catch (err) {
        console.error("Resend email failed:", err.message);
      }
    } else {
      console.log("[booking] Resend not configured — logging booking instead:", { name, email, phone, service, preferredDate, notes });
    }

    // --- 2. Optional Stripe deposit checkout ------------------------------
    let checkoutUrl = null;
    if (businessConfig.booking.depositRequired && env.hasStripe) {
      try {
        const Stripe = require("stripe");
        const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
        const session = await stripe.checkout.sessions.create({
          mode: "payment",
          payment_method_types: ["card"],
          line_items: [
            {
              price_data: {
                currency: (businessConfig.services.currency || "usd").toLowerCase(),
                product_data: { name: `Deposit — ${service}` },
                unit_amount: Math.round(businessConfig.booking.depositAmount * 100),
              },
              quantity: 1,
            },
          ],
          customer_email: email,
          success_url: `${process.env.PUBLIC_BASE_URL || "http://localhost:3000"}/?booking=success`,
          cancel_url: `${process.env.PUBLIC_BASE_URL || "http://localhost:3000"}/?booking=cancelled`,
        });
        checkoutUrl = session.url;
      } catch (err) {
        console.error("Stripe checkout session failed:", err.message);
      }
    }

    res.json({
      message: emailSent
        ? "Booking request received — check your email for confirmation."
        : "Booking request received. We'll be in touch to confirm.",
      checkoutUrl,
    });
  });

  return router;
};

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}
