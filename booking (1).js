/**
 * BOOKING FORM
 * Submits to the backend (/api/booking), which sends the confirmation email
 * (Resend) and, if a deposit is configured, creates a Stripe Checkout
 * session. If the backend is unreachable (e.g. this page is opened as a
 * static file with no server running), the form degrades to a clear
 * "contact us directly" message instead of failing silently.
 */
document.addEventListener("business:rendered", function (e) {
  const cfg = e.detail;
  const form = document.getElementById("booking-form");
  const status = document.getElementById("form-status");
  if (!form) return;

  form.addEventListener("submit", async function (evt) {
    evt.preventDefault();
    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    status.dataset.state = "";
    status.textContent = "Sending…";

    const payload = {
      name: form.elements["name"].value.trim(),
      email: form.elements["email"].value.trim(),
      phone: form.elements["phone"].value.trim(),
      service: form.elements["service"].value,
      preferredDate: form.elements["date"].value,
      notes: form.elements["notes"].value.trim(),
      businessName: cfg.meta.businessName,
    };

    try {
      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Server responded with an error");
      const data = await res.json();

      status.dataset.state = "ok";
      status.textContent = data.message || "Booking request received — check your email for confirmation.";

      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
        return;
      }
      form.reset();
    } catch (err) {
      status.dataset.state = "err";
      status.innerHTML =
        `Couldn't reach the booking server. Please call <a href="tel:${cfg.location.phone.replace(/\s+/g, "")}">${cfg.location.phone}</a> ` +
        `or email <a href="mailto:${cfg.location.email}">${cfg.location.email}</a> directly.`;
    } finally {
      submitBtn.disabled = false;
    }
  });
});
