/* ═══════════════════════════════════════════
   Clement WellbeingAtWork — Firma Customization
   Læser config/firma.json og anvender
   virksomhedsspecifikke tilpasninger
   ═══════════════════════════════════════════ */

(function() {
  'use strict';

  var _config = null;

  // ── Load config ──
  function loadFirmaConfig() {
    return fetch('config/firma.json')
      .then(function(res) {
        if (!res.ok) return null;
        return res.json();
      })
      .then(function(config) {
        if (!config) return null;
        _config = config;
        applyConfig(config);
        return config;
      })
      .catch(function() {
        return null; // Config ikke fundet — brug standard
      });
  }

  // ── Apply CSS custom properties ──
  function applyConfig(config) {
    if (!config) return;

    var root = document.documentElement;

    // Farver
    if (config.farver) {
      var f = config.farver;
      if (f.primaer) root.style.setProperty('--primary', f.primaer);
      if (f.sekundaer) root.style.setProperty('--primary-light', f.sekundaer);
      if (f.accent) root.style.setProperty('--accent', f.accent);
      if (f.baggrund) root.style.setProperty('--bg', f.baggrund);
      if (f.tekst) root.style.setProperty('--text', f.tekst);
      if (f.groen_zone) root.style.setProperty('--sage', f.groen_zone);
      if (f.gul_zone) root.style.setProperty('--amber', f.gul_zone);
      if (f.roed_zone) root.style.setProperty('--rose', f.roed_zone);
    }

    // Typografi
    if (config.typografi) {
      var t = config.typografi;
      if (t.overskrift) root.style.setProperty('--font-heading', t.overskrift);
      if (t.broedtekst) root.style.setProperty('--font-body', t.broedtekst);
    }

    // Virksomhed — logo og navn
    if (config.virksomhed) {
      if (config.virksomhed.logo) {
        var logos = document.querySelectorAll('.onboarding-kolibri, .nav-kolibri, .footer-kolibri');
        logos.forEach(function(img) {
          img.src = config.virksomhed.logo;
        });
      }
      if (config.virksomhed.navn) {
        // Tilføj virksomhedsnavn til footer
        var footerMain = document.getElementById('footerMain');
        if (footerMain && config.virksomhed.navn) {
          footerMain.textContent = footerMain.textContent + ' — ' + config.virksomhed.navn;
        }
      }
    }

    // Indhold — skjul perspektiver der er slået fra
    if (config.indhold && config.indhold.perspektiver) {
      var p = config.indhold.perspektiver;
      if (p.medarbejder === false) {
        var empBtn = document.querySelector('[data-rolle="medarbejder"]');
        if (empBtn) empBtn.style.display = 'none';
      }
      if (p.leder === false) {
        var ledBtn = document.querySelector('[data-rolle="leder"]');
        if (ledBtn) ledBtn.style.display = 'none';
      }
    }
  }

  // ── Get branche examples ──
  function getBrancheEksempler() {
    if (!_config || !_config.virksomhed || !_config.branche_eksempler) return null;
    var branche = _config.virksomhed.branche;
    if (!branche) return null;
    return _config.branche_eksempler[branche] || null;
  }

  // ── Check if a theme is enabled ──
  function isThemeEnabled(themeId) {
    if (!_config || !_config.indhold || !_config.indhold.temaer) return true;
    var val = _config.indhold.temaer[themeId];
    return val !== false; // Default til true
  }

  // ── Get config ──
  function getConfig() {
    return _config;
  }

  // ── Expose globally ──
  window.ClementFirma = {
    load: loadFirmaConfig,
    getConfig: getConfig,
    getBrancheEksempler: getBrancheEksempler,
    isThemeEnabled: isThemeEnabled
  };

})();
