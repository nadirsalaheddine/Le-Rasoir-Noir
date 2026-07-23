/**
 * ============================================================================
 * BUSINESS CONFIGURATION — SINGLE SOURCE OF TRUTH
 * ============================================================================
 * This file is the ONLY place that should contain business-specific content.
 * Everything else in the codebase (HTML rendering, CSS variables, animation
 * triggers, API payloads) reads from this object. To turn this project into
 * a Restaurant, Spa, Gym, Clinic, Dealership, Hotel, etc. — duplicate this
 * file (e.g. business.config.restaurant.js), edit the values below, and
 * point ACTIVE_CONFIG (bottom of file) at it. No other file needs to change.
 *
 * Naming stays generic on purpose: "items" instead of "haircuts", "staff"
 * instead of "barbers" — so the same shape fits any vertical.
 * ============================================================================
 */

const barberShopConfig = {
  // ---------------------------------------------------------------------
  // META / IDENTITY
  // ---------------------------------------------------------------------
  meta: {
    businessName: "Le Rasoir Noir",
    tagline: "Precision. Tradition. Craft.",
    industry: "barbershop", // barbershop | restaurant | salon | gym | clinic | realestate | dealer | jewelry | cafe | spa | hotel
    logoText: "LRN",
    logoImage: null, // e.g. "/assets/logo.svg" — falls back to logoText if null
    favicon: null,
    seo: {
      title: "Le Rasoir Noir — Luxury Barbershop",
      description:
        "A private barbershop for men who take their craft seriously. Traditional straight-razor shaves, precision cuts, by appointment.",
      keywords: ["barbershop", "luxury barber", "straight razor shave", "men's grooming"],
    },
  },

  // ---------------------------------------------------------------------
  // THEME — every color/type token the CSS pulls from. Change these six
  // colors and two fonts and the entire visual identity shifts.
  // ---------------------------------------------------------------------
  theme: {
    colors: {
      background: "#14110F", // obsidian
      surface: "#1D1A17", // slightly lifted panel
      textPrimary: "#EDE6D6", // bone
      textMuted: "#A79E8E",
      accent: "#B08D57", // brass
      accentDeep: "#8C3B2E", // oxblood / ember
      divider: "#3A362F",
    },
    fonts: {
      display: "'Fraunces', serif",
      body: "'Archivo', sans-serif",
      mono: "'JetBrains Mono', monospace",
    },
    radius: "2px", // sharp, tailored corners — not a rounded/soft brand
  },

  // ---------------------------------------------------------------------
  // HERO
  // ---------------------------------------------------------------------
  hero: {
    eyebrow: "Established 2014 — By Appointment Only",
    headline: "The blade remembers what the razor forgets.",
    subheadline:
      "A private barbershop for men who take their craft seriously. Traditional straight-razor shaves and precision cuts in Algiers.",
    ctaPrimary: { label: "Book a Chair", href: "#booking" },
    ctaSecondary: { label: "View Services", href: "#services" },
    image: {
      src: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=1200&auto=format&fit=crop",
      alt: "Barber giving a precision straight-razor shave",
    },
  },

  // ---------------------------------------------------------------------
  // ABOUT / MANIFESTO
  // ---------------------------------------------------------------------
  about: {
    eyebrow: "The Manifesto",
    heading: "We do not rush a good line.",
    body:
      "Le Rasoir Noir was built on a simple refusal: to treat a haircut as a transaction. Every chair, every blade, every hot towel is chosen the way a tailor chooses cloth. We see six clients a day, by design, because craft and volume have never agreed with each other.",
    pullQuote: "\u201CA barbershop is a workshop first, a room second.\u201D",
    pullQuoteAttribution: "— House Philosophy",
    image: {
      src: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?q=80&w=1000&auto=format&fit=crop",
      alt: "Interior of the barbershop, leather chairs and brass fittings",
    },
  },

  // ---------------------------------------------------------------------
  // SERVICES / MENU — generic "items" so it fits a restaurant menu,
  // a spa's treatment list, a clinic's procedures, etc.
  // ---------------------------------------------------------------------
  services: {
    eyebrow: "The Ledger",
    heading: "Services & Pricing",
    currency: "DZD",
    categories: [
      {
        name: "Cuts",
        items: [
          { name: "Signature Cut", description: "Consultation, cut, hot towel finish", price: 3500, duration: "45 min" },
          { name: "Skin Fade", description: "Precision fade, razor-lined", price: 4000, duration: "50 min" },
          { name: "Cut & Beard Combo", description: "Full cut with beard sculpt", price: 5500, duration: "70 min" },
        ],
      },
      {
        name: "Shaves",
        items: [
          { name: "Traditional Straight Razor", description: "Hot towel, pre-shave oil, straight razor", price: 3000, duration: "40 min" },
          { name: "Royal Shave", description: "Double hot towel, clay mask, razor finish", price: 4500, duration: "60 min" },
        ],
      },
      {
        name: "Grooming",
        items: [
          { name: "Beard Sculpt", description: "Shape, trim, oil treatment", price: 2000, duration: "25 min" },
          { name: "Grey Blending", description: "Natural-finish color blending", price: 3500, duration: "45 min" },
        ],
      },
    ],
  },

  // ---------------------------------------------------------------------
  // STAFF / TEAM — generic naming fits "chefs", "therapists", "trainers",
  // "doctors", "agents", depending on industry.
  // ---------------------------------------------------------------------
  staff: {
    eyebrow: "The Chairs",
    heading: "Meet the Barbers",
    members: [
      {
        name: "Yacine Bourras",
        role: "Master Barber & Founder",
        bio: "18 years behind the chair. Trained in Algiers and Istanbul.",
        image: "https://images.unsplash.com/photo-1622287162716-f311baa1a2b3?q=80&w=800&auto=format&fit=crop",
      },
      {
        name: "Rayan Haddad",
        role: "Senior Barber",
        bio: "Specialist in skin fades and traditional straight-razor shaves.",
        image: "https://images.unsplash.com/photo-1595152772835-219674b2a8a6?q=80&w=800&auto=format&fit=crop",
      },
      {
        name: "Sofiane Larbi",
        role: "Barber",
        bio: "Beard sculpting and grey-blend color work.",
        image: "https://images.unsplash.com/photo-1567894340315-735d7c361db0?q=80&w=800&auto=format&fit=crop",
      },
    ],
  },

  // ---------------------------------------------------------------------
  // GALLERY
  // ---------------------------------------------------------------------
  gallery: {
    eyebrow: "The Work",
    heading: "Recent Cuts",
    images: [
      { src: "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?q=80&w=800&auto=format&fit=crop", alt: "Precision fade" },
      { src: "https://images.unsplash.com/photo-1512690459411-b9245aed614b?q=80&w=800&auto=format&fit=crop", alt: "Straight razor shave" },
      { src: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?q=80&w=800&auto=format&fit=crop", alt: "Beard sculpt" },
      { src: "https://images.unsplash.com/photo-1517832606299-7ae9b720a186?q=80&w=800&auto=format&fit=crop", alt: "Barbershop interior" },
    ],
  },

  // ---------------------------------------------------------------------
  // TESTIMONIALS
  // ---------------------------------------------------------------------
  testimonials: {
    eyebrow: "Word of Mouth",
    heading: "What Clients Say",
    quotes: [
      { quote: "The only place I trust with a straight razor near my throat.", author: "K. Meziane" },
      { quote: "Six clients a day shows. Nothing here feels rushed.", author: "A. Bensalem" },
      { quote: "Booked once, stayed for four years.", author: "T. Cherif" },
    ],
  },

  // ---------------------------------------------------------------------
  // LOCATION / CONTACT / HOURS
  // ---------------------------------------------------------------------
  location: {
    eyebrow: "Find the Chair",
    heading: "Visit Us",
    address: "12 Rue Didouche Mourad, Algiers, Algeria",
    coordinates: { lat: 36.7538, lng: 3.0588 },
    phone: "+213 555 012 345",
    email: "contact@lerasoirnoir.dz",
    whatsapp: "+213555012345",
    hours: [
      { day: "Monday", open: "10:00", close: "20:00" },
      { day: "Tuesday", open: "10:00", close: "20:00" },
      { day: "Wednesday", open: "10:00", close: "20:00" },
      { day: "Thursday", open: "10:00", close: "20:00" },
      { day: "Friday", open: "14:00", close: "20:00" },
      { day: "Saturday", open: "10:00", close: "18:00" },
      { day: "Sunday", open: null, close: null },
    ],
    socials: [
      { platform: "instagram", url: "https://instagram.com" },
      { platform: "facebook", url: "https://facebook.com" },
    ],
  },

  // ---------------------------------------------------------------------
  // BOOKING FORM
  // ---------------------------------------------------------------------
  booking: {
    eyebrow: "Reserve",
    heading: "Book a Chair",
    subheading: "Tell us what you need. We confirm by email within one business day.",
    depositRequired: true,
    depositAmount: 500,
  },

  // ---------------------------------------------------------------------
  // FOOTER
  // ---------------------------------------------------------------------
  footer: {
    note: "By appointment only. Walk-ins accommodated when a chair is free.",
    copyrightName: "Le Rasoir Noir",
  },
};

// ============================================================================
// ACTIVE CONFIG SWITCH
// To relaunch this template for a different business, create a sibling file
// (e.g. business.config.restaurant.js) matching this exact shape, import it
// below, and point module.exports at it instead. Nothing else in the app
// needs to know.
// ============================================================================
const ACTIVE_CONFIG = barberShopConfig;

if (typeof module !== "undefined" && module.exports) {
  module.exports = ACTIVE_CONFIG;
}
if (typeof window !== "undefined") {
  window.BUSINESS_CONFIG = ACTIVE_CONFIG;
}
