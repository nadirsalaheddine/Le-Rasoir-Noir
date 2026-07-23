/**
 * ANIMATION LAYER — GSAP + ScrollTrigger
 * Waits for the "business:rendered" event from render.js so it only ever
 * animates real content, never empty placeholders.
 */
document.addEventListener("business:rendered", function () {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (typeof gsap === "undefined") {
    // GSAP failed to load (offline / CDN blocked) — reveal everything instantly.
    document.querySelectorAll(".reveal").forEach((n) => n.classList.add("is-visible"));
    const mask = document.querySelector(".blade-mask");
    if (mask) mask.style.display = "none";
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  // ---------------------------------------------------------------------
  // HERO LOAD SEQUENCE — the signature moment: a razor-straight panel
  // sweeps up to "unveil" the hero portrait, then copy rises into place.
  // ---------------------------------------------------------------------
  const heroTl = gsap.timeline({ defaults: { ease: "power3.out" } });

  heroTl
    .to(".blade-mask", { scaleY: 0, duration: reduceMotion ? 0.01 : 1.1, ease: "power4.inOut" })
    .from(".hero-eyebrow", { opacity: 0, y: 12, duration: 0.5 }, "-=0.5")
    .from(".hero h1", { opacity: 0, y: 28, duration: 0.7 }, "-=0.3")
    .from(".hero-sub", { opacity: 0, y: 20, duration: 0.6 }, "-=0.4")
    .from(".cta-row", { opacity: 0, y: 20, duration: 0.6 }, "-=0.4");

  // ---------------------------------------------------------------------
  // SCROLL REVEALS
  // ---------------------------------------------------------------------
  function makeReveal(node) {
    ScrollTrigger.create({
      trigger: node,
      start: "top 90%",
      once: true,
      onEnter: () => node.classList.add("is-visible"),
    });
  }
  document.querySelectorAll(".reveal").forEach(makeReveal);
  document.querySelectorAll(".section-heading, .service-row, .gallery-grid img").forEach((node) => {
    if (!node.classList.contains("reveal")) {
      node.classList.add("reveal");
      makeReveal(node);
    }
  });

  // ---------------------------------------------------------------------
  // HEADER — background solidifies after scrolling past hero
  // ---------------------------------------------------------------------
  ScrollTrigger.create({
    trigger: ".hero",
    start: "bottom top",
    onEnter: () => document.querySelector(".site-header").classList.add("is-scrolled"),
    onLeaveBack: () => document.querySelector(".site-header").classList.remove("is-scrolled"),
  });

  // ---------------------------------------------------------------------
  // MOBILE NAV TOGGLE
  // ---------------------------------------------------------------------
  const navToggle = document.querySelector(".nav-toggle");
  const navLinks = document.querySelector(".nav-links");
  if (navToggle && navLinks) {
    navToggle.addEventListener("click", () => navLinks.classList.toggle("is-open"));
    navLinks.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => navLinks.classList.remove("is-open")));
  }
});
