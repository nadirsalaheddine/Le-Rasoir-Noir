/**
 * MAP MODULE
 * Fetches a public runtime config from the backend to see whether a Google
 * Maps API key is configured. If yes -> renders an interactive Google Map.
 * If no key, or the backend isn't running at all -> renders an
 * OpenStreetMap embed, which needs no key and always works.
 */
document.addEventListener("business:rendered", async function (e) {
  const cfg = e.detail;
  const mount = document.getElementById("map-embed");
  const note = document.getElementById("map-fallback-note");
  if (!mount) return;

  const { lat, lng } = cfg.location.coordinates;

  function renderOSM() {
    const bbox = [lng - 0.01, lat - 0.008, lng + 0.01, lat + 0.008].join(",");
    mount.innerHTML = `<iframe title="Map" src="https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat},${lng}" loading="lazy"></iframe>`;
    if (note) note.textContent = "Map via OpenStreetMap.";
  }

  function renderGoogle(apiKey) {
    function initGoogleMap() {
      const map = new google.maps.Map(mount, {
        center: { lat, lng },
        zoom: 15,
        disableDefaultUI: true,
        zoomControl: true,
      });
      new google.maps.Marker({ position: { lat, lng }, map, title: cfg.meta.businessName });
      if (note) note.textContent = "";
    }

    if (!window.google || !window.google.maps) {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}`;
      script.async = true;
      script.onload = initGoogleMap;
      script.onerror = renderOSM; // key invalid / blocked / offline -> fall back
      document.head.appendChild(script);
    } else {
      initGoogleMap();
    }
  }

  try {
    const res = await fetch("/api/config/public");
    if (!res.ok) throw new Error("no backend config");
    const { googleMapsKey } = await res.json();
    if (googleMapsKey) {
      renderGoogle(googleMapsKey);
    } else {
      renderOSM();
    }
  } catch (err) {
    // No backend reachable at all (e.g. static preview) -> safe default.
    renderOSM();
  }
});
