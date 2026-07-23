/**
 * RENDER LAYER
 * Reads window.BUSINESS_CONFIG (from config/business.config.js) and paints
 * every section of the page. Nothing business-specific is hardcoded here —
 * change the config, not this file, to relaunch for a new client.
 */
(function () {
  const cfg = window.BUSINESS_CONFIG;
  if (!cfg) {
    console.error("BUSINESS_CONFIG missing — check config/business.config.js is loaded before render.js");
    return;
  }

  const $ = (sel, root = document) => root.querySelector(sel);
  const el = (tag, cls, html) => {
    const node = document.createElement(tag);
    if (cls) node.className = cls;
    if (html !== undefined) node.innerHTML = html;
    return node;
  };
  const escapeHtml = (str) =>
    String(str).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  function applyTheme() {
    const root = document.documentElement.style;
    const c = cfg.theme.colors;
    root.setProperty("--color-bg", c.background);
    root.setProperty("--color-surface", c.surface);
    root.setProperty("--color-text", c.textPrimary);
    root.setProperty("--color-text-muted", c.textMuted);
    root.setProperty("--color-accent", c.accent);
    root.setProperty("--color-accent-deep", c.accentDeep);
    root.setProperty("--color-divider", c.divider);
    root.setProperty("--font-display", cfg.theme.fonts.display);
    root.setProperty("--font-body", cfg.theme.fonts.body);
    root.setProperty("--font-mono", cfg.theme.fonts.mono);
    root.setProperty("--radius", cfg.theme.radius);

    document.title = cfg.meta.seo.title;
    const metaDesc = $('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute("content", cfg.meta.seo.description);
  }

  function renderHeader() {
    $("#logo-text").textContent = cfg.meta.logoText;
    $("#business-name-hidden").textContent = cfg.meta.businessName;
  }

  function renderHero() {
    $("#hero-eyebrow").textContent = cfg.hero.eyebrow;
    $("#hero-headline").textContent = cfg.hero.headline;
    $("#hero-sub").textContent = cfg.hero.subheadline;
    $("#hero-cta-primary").textContent = cfg.hero.ctaPrimary.label;
    $("#hero-cta-primary").setAttribute("href", cfg.hero.ctaPrimary.href);
    $("#hero-cta-secondary").textContent = cfg.hero.ctaSecondary.label;
    $("#hero-cta-secondary").setAttribute("href", cfg.hero.ctaSecondary.href);
    $("#hero-image").src = cfg.hero.image.src;
    $("#hero-image").alt = cfg.hero.image.alt;
  }

  function renderAbout() {
    $("#about-eyebrow").textContent = cfg.about.eyebrow;
    $("#about-heading").textContent = cfg.about.heading;
    $("#about-body").textContent = cfg.about.body;
    $("#about-quote-text").textContent = cfg.about.pullQuote;
    $("#about-quote-attr").textContent = cfg.about.pullQuoteAttribution;
    $("#about-image").src = cfg.about.image.src;
    $("#about-image").alt = cfg.about.image.alt;
  }

  function formatPrice(amount) {
    try {
      return new Intl.NumberFormat("en-US").format(amount) + " " + cfg.services.currency;
    } catch (e) {
      return amount + " " + cfg.services.currency;
    }
  }

  function renderServices() {
    $("#services-eyebrow").textContent = cfg.services.eyebrow;
    $("#services-heading").textContent = cfg.services.heading;
    const wrap = $("#services-list");
    wrap.innerHTML = "";
    cfg.services.categories.forEach((cat) => {
      const catEl = el("div", "service-category");
      catEl.appendChild(el("div", "service-category-name", escapeHtml(cat.name)));
      cat.items.forEach((item) => {
        const row = el("div", "service-row");
        const left = el(
          "div",
          "",
          `<div class="service-name">${escapeHtml(item.name)}</div><div class="service-desc">${escapeHtml(item.description)}</div>`
        );
        const leader = el("div", "service-leader");
        const meta = el(
          "div",
          "service-meta",
          `<span class="service-price">${formatPrice(item.price)}</span><span class="service-duration">${escapeHtml(item.duration)}</span>`
        );
        row.append(left, leader, meta);
        catEl.appendChild(row);
      });
      wrap.appendChild(catEl);
    });
  }

  function renderStaff() {
    $("#staff-eyebrow").textContent = cfg.staff.eyebrow;
    $("#staff-heading").textContent = cfg.staff.heading;
    const wrap = $("#staff-scroller");
    wrap.innerHTML = "";
    cfg.staff.members.forEach((person) => {
      const card = el(
        "div",
        "staff-card reveal",
        `<div class="staff-photo"><img src="${person.image}" alt="${escapeHtml(person.name)}" loading="lazy"></div>
         <div class="staff-info">
           <h3>${escapeHtml(person.name)}</h3>
           <div class="staff-role">${escapeHtml(person.role)}</div>
           <p class="staff-bio">${escapeHtml(person.bio)}</p>
         </div>`
      );
      wrap.appendChild(card);
    });
  }

  function renderGallery() {
    $("#gallery-eyebrow").textContent = cfg.gallery.eyebrow;
    $("#gallery-heading").textContent = cfg.gallery.heading;
    const wrap = $("#gallery-grid");
    wrap.innerHTML = "";
    cfg.gallery.images.forEach((img) => {
      const image = el("img");
      image.src = img.src;
      image.alt = img.alt;
      image.loading = "lazy";
      wrap.appendChild(image);
    });
  }

  function renderTestimonials() {
    $("#testimonials-eyebrow").textContent = cfg.testimonials.eyebrow;
    $("#testimonials-heading").textContent = cfg.testimonials.heading;
    const stage = $("#testimonial-stage");
    const dots = $("#testimonial-dots");
    stage.innerHTML = "";
    dots.innerHTML = "";
    cfg.testimonials.quotes.forEach((t, i) => {
      const slide = el(
        "div",
        "testimonial-slide" + (i === 0 ? " is-active" : ""),
        `<q>${escapeHtml(t.quote)}</q><div class="testimonial-author">${escapeHtml(t.author)}</div>`
      );
      stage.appendChild(slide);
      const dot = el("button", i === 0 ? "is-active" : "");
      dot.setAttribute("aria-label", "Show testimonial " + (i + 1));
      dot.dataset.index = i;
      dots.appendChild(dot);
    });

    let current = 0;
    const slides = stage.querySelectorAll(".testimonial-slide");
    const dotEls = dots.querySelectorAll("button");
    function show(i) {
      slides[current].classList.remove("is-active");
      dotEls[current].classList.remove("is-active");
      current = i;
      slides[current].classList.add("is-active");
      dotEls[current].classList.add("is-active");
    }
    dotEls.forEach((dot) => dot.addEventListener("click", () => show(Number(dot.dataset.index))));
    if (slides.length > 1) {
      setInterval(() => show((current + 1) % slides.length), 6000);
    }
  }

  function renderLocation() {
    $("#location-eyebrow").textContent = cfg.location.eyebrow;
    $("#location-heading").textContent = cfg.location.heading;
    $("#location-address").textContent = cfg.location.address;
    $("#location-phone").textContent = cfg.location.phone;
    $("#location-phone").setAttribute("href", "tel:" + cfg.location.phone.replace(/\s+/g, ""));
    $("#location-email").textContent = cfg.location.email;
    $("#location-email").setAttribute("href", "mailto:" + cfg.location.email);

    const hoursWrap = $("#hours-list");
    hoursWrap.innerHTML = "";
    cfg.location.hours.forEach((h) => {
      const row = el(
        "div",
        "hours-row" + (h.open ? "" : " is-closed"),
        `<span>${h.day}</span><span>${h.open ? h.open + " – " + h.close : "Closed"}</span>`
      );
      hoursWrap.appendChild(row);
    });

    const socialsWrap = $("#footer-socials");
    socialsWrap.innerHTML = "";
    cfg.location.socials.forEach((s) => {
      const a = el("a", "", s.platform);
      a.href = s.url;
      a.target = "_blank";
      a.rel = "noopener";
      socialsWrap.appendChild(a);
    });
  }

  function renderBooking() {
    $("#booking-eyebrow").textContent = cfg.booking.eyebrow;
    $("#booking-heading").textContent = cfg.booking.heading;
    $("#booking-subheading").textContent = cfg.booking.subheading;
    const select = $("#booking-service");
    select.innerHTML = "";
    cfg.services.categories.forEach((cat) => {
      cat.items.forEach((item) => {
        const opt = el("option", "", escapeHtml(item.name) + " — " + formatPrice(item.price));
        opt.value = item.name;
        select.appendChild(opt);
      });
    });
  }

  function renderFooter() {
    $("#footer-note").textContent = cfg.footer.note;
    $("#footer-copyright").textContent =
      "© " + new Date().getFullYear() + " " + cfg.footer.copyrightName + ". All rights reserved.";
  }

  applyTheme();
  renderHeader();
  renderHero();
  renderAbout();
  renderServices();
  renderStaff();
  renderGallery();
  renderTestimonials();
  renderLocation();
  renderBooking();
  renderFooter();

  document.dispatchEvent(new CustomEvent("business:rendered", { detail: cfg }));
})();
