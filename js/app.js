/* ═══════════════════════════════════════════
   Clement WellbeingAtWork — App Logic
   Multi-view SPA med routing, tabs og interaktioner
   ═══════════════════════════════════════════ */

(function() {
  'use strict';

  // ── SVG ikoner ──
  function svgWrap(s, inner) {
    return '<svg width="' + s + '" height="' + s + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' + inner + '</svg>';
  }
  var IKONER = {
    bookmark:     function(s) { return svgWrap(s || 16, '<path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>'); },
    bookmarkFill: function(s) { return '<svg width="' + (s || 16) + '" height="' + (s || 16) + '" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>'; },
    share:        function(s) { return svgWrap(s || 16, '<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>'); }
  };

  // ── State ──
  var aktivPerspektiv = 'medarbejder';
  var aktivCirkel = null;
  var aktivTema = null;
  var aktivTrin = null;

  // ── Language-aware data access ──
  function D_CIRKEL_TEKSTER() { return isEn() ? CIRKEL_TEKSTER_EN : CIRKEL_TEKSTER; }
  function D_CIRKLER() { return isEn() ? CIRKLER_EN : CIRKLER; }
  function D_TRAPPEN() { return isEn() ? TRAPPEN_EN : TRAPPEN; }
  function D_TRAPPEN_FORSTAAELSE() { return isEn() ? TRAPPEN_FORSTAAELSE_EN : TRAPPEN_FORSTAAELSE; }
  function D_TEMA_INDHOLD() { return isEn() ? TEMA_INDHOLD_EN : TEMA_INDHOLD; }
  function D_OEVELSER() { return isEn() ? OEVELSER_EN : OEVELSER; }
  function D_REFLEKSIONER() { return isEn() ? REFLEKSIONER_EN : REFLEKSIONER; }
  function D_SAMMENHAENGE() { return isEn() ? SAMMENHAENGE_EN : SAMMENHAENGE; }
  function D_CIRKEL_NAVNE() { return isEn() ? CIRKEL_NAVNE_EN : CIRKEL_NAVNE; }
  function D_hentSammenhaenge(id) { return isEn() ? hentSammenhaengeEN(id) : hentSammenhaenge(id); }

  // ── Favoritter ──
  function getFavoritter() {
    try { return JSON.parse(localStorage.getItem('cf_favoritter') || '[]'); } catch (e) { return []; }
  }
  function saveFavoritter(fav) { localStorage.setItem('cf_favoritter', JSON.stringify(fav)); }
  function isFavorit(type, id) { return getFavoritter().some(function(f) { return f.type === type && f.id === id; }); }
  function toggleFavorit(type, id, titel) {
    var fav = getFavoritter();
    var idx = -1;
    for (var i = 0; i < fav.length; i++) { if (fav[i].type === type && fav[i].id === id) { idx = i; break; } }
    if (idx !== -1) { fav.splice(idx, 1); saveFavoritter(fav); return false; }
    fav.push({ type: type, id: id, titel: titel, dato: new Date().toISOString().slice(0, 10) });
    saveFavoritter(fav);
    return true;
  }
  function escapeAttr(str) { return String(str).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/'/g, '&#39;').replace(/</g, '&lt;'); }
  function buildActionBar(type, id, titel, shareText) {
    var saved = isFavorit(type, id);
    var iconHtml = saved ? IKONER.bookmarkFill(16) : IKONER.bookmark(16);
    var labelHtml = saved ? t('savedLabel') : t('save');
    return '<div class="action-bar" data-action-type="' + type + '" data-action-id="' + escapeAttr(id) + '" data-action-titel="' + escapeAttr(titel) + '" data-action-share="' + escapeAttr(shareText) + '">' +
      '<button class="action-btn action-btn-save" title="' + t('save') + '">' + iconHtml + '<span>' + labelHtml + '</span></button>' +
      '<button class="action-btn action-btn-share" title="' + t('share') + '">' + IKONER.share(16) + '<span>' + t('share') + '</span></button>' +
      '</div>';
  }
  function bindActionBars(container) {
    container.querySelectorAll('.action-bar').forEach(function(bar) {
      var saveBtn = bar.querySelector('.action-btn-save');
      var shareBtn = bar.querySelector('.action-btn-share');

      saveBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        var type = bar.dataset.actionType;
        var id = bar.dataset.actionId;
        var titel = bar.dataset.actionTitel;
        var added = toggleFavorit(type, id, titel);
        var span = saveBtn.querySelector('span');
        if (added) {
          saveBtn.querySelector('svg').outerHTML = IKONER.bookmarkFill(16);
          span.textContent = t('savedLabel');
        } else {
          saveBtn.querySelector('svg').outerHTML = IKONER.bookmark(16);
          span.textContent = t('save');
        }
        updateFavoritBadge();
      });

      shareBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        var text = bar.dataset.actionTitel + '\n\n' + bar.dataset.actionShare;
        if (navigator.share) {
          navigator.share({ title: bar.dataset.actionTitel, text: text }).catch(function() {});
        } else {
          navigator.clipboard.writeText(text).then(function() {
            var span = shareBtn.querySelector('span');
            span.textContent = t('copied');
            setTimeout(function() { span.textContent = t('share'); }, 2000);
          }).catch(function() {});
        }
      });
    });
  }
  function updateFavoritBadge() {
    var badge = document.getElementById('favoritBadge');
    if (!badge) return;
    var count = getFavoritter().length;
    badge.textContent = count;
    badge.style.display = count > 0 ? 'inline-flex' : 'none';
  }

  // ── DOM refs ──
  var onboarding = document.getElementById('onboarding');
  var bottomNav = document.getElementById('bottomNav');
  var views = document.querySelectorAll('.view');
  var navItems = document.querySelectorAll('.nav-item');
  var cirkelNodes = document.querySelectorAll('.cirkel-node');
  var rolleLabel = document.getElementById('rolleLabel');
  var rolleSkift = document.getElementById('rolleSkift');

  // Cirkel detail
  var cirkelDetailIkon = document.getElementById('cirkelDetailIkon');
  var cirkelDetailTitel = document.getElementById('cirkelDetailTitel');
  var tabs = document.querySelectorAll('.tab');
  var tabPanels = document.querySelectorAll('.tab-panel');
  var panelOverblik = document.getElementById('panelOverblik');
  var panelDybde = document.getElementById('panelDybde');
  var panelOevelse = document.getElementById('panelOevelse');

  // Trappen
  var trappeTrin = document.querySelectorAll('.trappe-trin');
  var trappenResponse = document.getElementById('trappenResponse');

  // Temaer
  var temaGrid = document.getElementById('temaGrid');
  var temaExpanded = document.getElementById('temaExpanded');

  // Øvelser
  var oevelserGrid = document.getElementById('oevelserGrid');

  // Top bar / Menu / Search
  var topBar = document.getElementById('topBar');
  var menuBtn = document.getElementById('menuBtn');
  var menuOverlay = document.getElementById('menuOverlay');
  var menuPanel = document.getElementById('menuPanel');
  var menuClose = document.getElementById('menuClose');
  var menuContent = document.getElementById('menuContent');
  var searchBtn = document.getElementById('searchBtn');
  var searchOverlay = document.getElementById('searchOverlay');
  var searchInput = document.getElementById('searchInput');
  var searchClear = document.getElementById('searchClear');
  var searchClose = document.getElementById('searchClose');
  var searchTags = document.getElementById('searchTags');
  var searchResults = document.getElementById('searchResults');

  // Velkommen
  var velkommenSection = document.getElementById('velkommenSection');
  var velkommenTitel = document.getElementById('velkommenTitel');
  var velkommenTekst = document.getElementById('velkommenTekst');
  var isFirstVisit = false;

  // ── Update all static HTML texts based on current language ──
  function updateStaticTexts() {
    // HTML lang attribute
    document.documentElement.lang = isEn() ? 'en' : 'da';
    // Page title
    document.title = t('appTitle');
    // Onboarding
    var el;
    el = document.getElementById('onboardingTitle'); if (el) el.innerHTML = t('onboardingTitle');
    el = document.getElementById('onboardingSub'); if (el) el.textContent = t('onboardingSub');
    el = document.getElementById('onboardingPrompt'); if (el) el.textContent = t('onboardingPrompt');
    el = document.getElementById('choiceTitleMedarbejder'); if (el) el.textContent = t('choiceEmployee');
    el = document.getElementById('choiceDescMedarbejder'); if (el) el.textContent = t('choiceEmployeeDesc');
    el = document.getElementById('choiceTitleLeder'); if (el) el.textContent = t('choiceLeader');
    el = document.getElementById('choiceDescLeder'); if (el) el.textContent = t('choiceLeaderDesc');
    el = document.getElementById('choiceTitleVirksomhed'); if (el) el.textContent = t('choiceCompany');
    el = document.getElementById('choiceDescVirksomhed'); if (el) el.textContent = t('choiceCompanyDesc');
    // Menu header
    el = document.getElementById('menuHeaderSub'); if (el) el.textContent = isEn() ? 'Nervous system specialist' : 'Nervesystemsspecialist';
    // Search
    el = document.getElementById('searchInput'); if (el) el.placeholder = t('searchPlaceholder');
    // Bottom nav
    el = document.getElementById('navHome'); if (el) el.textContent = t('navHome');
    el = document.getElementById('navTrappen'); if (el) el.textContent = t('navLadder');
    el = document.getElementById('navTemaer'); if (el) el.textContent = t('navThemes');
    el = document.getElementById('navOevelser'); if (el) el.textContent = t('navExercises');
    // Hero
    el = document.getElementById('heroTitle'); if (el) el.textContent = t('heroTitle');
    el = document.getElementById('heroSub'); if (el) el.textContent = t('heroSub');
    // Seven dimensions
    el = document.getElementById('cirkelIntroTitle'); if (el) el.textContent = t('sevenDimensions');
    el = document.getElementById('cirkelHint'); if (el) el.textContent = t('circleHint');
    el = document.getElementById('dynamikLinkTitle'); if (el) el.textContent = t('dynamikLinkTitle');
    el = document.getElementById('dynamikLinkDesc'); if (el) el.textContent = t('dynamikLinkDesc');
    // Favorites
    el = document.getElementById('favTitle'); if (el) el.textContent = t('favTitle');
    el = document.getElementById('favSub'); if (el) el.textContent = t('favSub');
    // Circle detail tabs
    el = document.getElementById('tabOverblik'); if (el) el.textContent = t('tabOverview');
    el = document.getElementById('tabDybde'); if (el) el.textContent = t('tabDeepDive');
    el = document.getElementById('tabOevelse'); if (el) el.textContent = t('tabExercise');
    // Dynamik
    el = document.getElementById('dynamikBack'); if (el) el.textContent = t('backToHome');
    el = document.getElementById('dynamikTitle'); if (el) el.textContent = t('dynamikTitle');
    // Trappen
    el = document.getElementById('trappenTitle'); if (el) el.textContent = t('ladderTitle');
    el = document.getElementById('trappenSub'); if (el) el.textContent = t('ladderSub');
    el = document.getElementById('trappenIntro'); if (el) el.textContent = t('ladderIntro');
    el = document.getElementById('trappenCheckinLabel'); if (el) el.textContent = t('ladderCheckinLabel');
    el = document.getElementById('trinGroenTitle'); if (el) el.textContent = t('greenState');
    el = document.getElementById('trinGroenDesc'); if (el) el.textContent = t('greenSub');
    el = document.getElementById('trinGroenHint'); if (el) el.textContent = t('greenHint');
    el = document.getElementById('trinGulTitle'); if (el) el.textContent = t('yellowState');
    el = document.getElementById('trinGulDesc'); if (el) el.textContent = t('yellowSub');
    el = document.getElementById('trinGulHint'); if (el) el.textContent = t('yellowHint');
    el = document.getElementById('trinRoedTitle'); if (el) el.textContent = t('redState');
    el = document.getElementById('trinRoedDesc'); if (el) el.textContent = t('redSub');
    el = document.getElementById('trinRoedHint'); if (el) el.textContent = t('redHint');
    // Temaer
    el = document.getElementById('temaerTitle'); if (el) el.textContent = t('themesTitle');
    el = document.getElementById('temaerSub'); if (el) el.textContent = t('themesSub');
    el = document.getElementById('temaerIntro'); if (el) el.textContent = t('themesIntro');
    // Øvelser
    el = document.getElementById('oevelserTitle'); if (el) el.innerHTML = t('exercisesTitle');
    el = document.getElementById('oevelserSub'); if (el) el.textContent = t('exercisesSub');
    el = document.getElementById('oevelserIntro'); if (el) el.textContent = t('exercisesIntro');
    el = document.getElementById('oevelserLabel'); if (el) el.textContent = t('exercisesSectionLabel');
    el = document.getElementById('filterAlle'); if (el) el.textContent = t('filterAll');
    el = document.getElementById('filterKrop'); if (el) el.textContent = t('filterBody');
    el = document.getElementById('filterAandedraet'); if (el) el.textContent = t('filterBreathing');
    el = document.getElementById('filterRegulering'); if (el) el.textContent = t('filterRegulation');
    el = document.getElementById('filterTeam'); if (el) el.textContent = t('filterTeam');
    // Refleksioner
    el = document.getElementById('refleksionerLabel'); if (el) el.textContent = t('reflectionsSectionLabel');
    el = document.getElementById('refleksionerIntro'); if (el) el.textContent = t('reflectionsIntro');
    // Din proces
    el = document.getElementById('dinProcesLabel'); if (el) el.textContent = t('processSectionLabel');
    el = document.getElementById('dinProcesIntro'); if (el) el.textContent = t('processIntro');
    // Virksomhed
    el = document.getElementById('virksomhedTitle'); if (el) el.textContent = t('companyTitle');
    // Footer
    el = document.getElementById('footerMain'); if (el) el.textContent = t('footerMain');
    el = document.getElementById('footerSub'); if (el) el.textContent = t('footerSub');
    // Role bar
    el = document.getElementById('rolleSkift'); if (el) el.textContent = t('roleSwitch');
    // Back buttons
    var backBtns = document.querySelectorAll('.back-btn');
    backBtns.forEach(function(btn) {
      if (btn.classList.contains('back-to-hjem')) {
        btn.textContent = t('backToHome');
      } else {
        btn.textContent = t('back');
      }
    });
  }

  // ── Init ──
  function init() {
    updateStaticTexts();
    // Check om bruger allerede har valgt rolle
    var gemt = localStorage.getItem('clementRolle');
    if (gemt) {
      aktivPerspektiv = gemt;
      startApp(false);
    } else {
      visOnboarding();
    }
  }

  // ── Onboarding ──
  function visOnboarding() {
    onboarding.classList.remove('hidden');
    bottomNav.classList.add('hidden');
    topBar.classList.add('hidden');

    var choices = onboarding.querySelectorAll('.onboarding-choice');
    choices.forEach(function(btn) {
      btn.addEventListener('click', function() {
        aktivPerspektiv = this.dataset.rolle;
        localStorage.setItem('clementRolle', aktivPerspektiv);
        startApp(true);
      });
    });
  }

  function startApp(firstVisit) {
    isFirstVisit = firstVisit;
    onboarding.classList.add('hidden');
    bottomNav.classList.remove('hidden');
    topBar.classList.remove('hidden');
    opdaterRolleLabel();
    opdaterCirkelTekster();
    renderTemaer();
    renderOevelser();
    renderRefleksioner();
    renderDinProces();
    renderTrappenMoenster();
    renderTrappenForstaaelse();
    renderMenuContent();
    renderSearchTags();
    bindEvents();
    bindMenuEvents();
    bindSearchEvents();
    bindFilterEvents();

    if (firstVisit) {
      if (aktivPerspektiv === 'virksomhed') {
        // Virksomhed goes straight to the virksomhed page
        renderVirksomhed();
        window.location.hash = 'virksomhed';
        navigateTo('virksomhed', false);
      } else {
        // Always go to hjem on first visit
        window.location.hash = 'hjem';
        navigateTo('hjem', false);
        showVelkommen();
        animateCircles();
      }
    } else {
      handleHash();
    }
    updateHeroVisibility();
  }

  // ── Rolle ──
  function opdaterRolleLabel() {
    if (rolleLabel) {
      var roleMap = { medarbejder: t('roleEmployee'), leder: t('roleLeader'), virksomhed: t('roleCompany') };
      var label = roleMap[aktivPerspektiv] || aktivPerspektiv;
      rolleLabel.innerHTML = t('roleLabel') + ' <strong>' + label + '</strong>';
    }
  }

  function skiftRolle() {
    // Cycle: medarbejder → leder → medarbejder (virksomhed skifter til medarbejder)
    if (aktivPerspektiv === 'virksomhed') {
      aktivPerspektiv = 'medarbejder';
    } else {
      aktivPerspektiv = aktivPerspektiv === 'medarbejder' ? 'leder' : 'medarbejder';
    }
    localStorage.setItem('clementRolle', aktivPerspektiv);
    opdaterRolleLabel();
    opdaterCirkelTekster();
    renderTemaer();
    renderTrappenForstaaelse();
    renderDynamik();
    if (aktivCirkel) renderCirkelDetail(aktivCirkel);
    if (aktivTrin) visTrappenSvar(aktivTrin);
    if (aktivTema) visTemaDetalje(aktivTema);
  }

  // ── Navigation ──
  function navigateTo(viewName, push) {
    if (push !== false) {
      window.location.hash = viewName;
    }

    var baseView = viewName.split('/')[0];

    // Nulstil tilstande når man forlader en side
    if (baseView !== 'trappen') {
      if (aktivTrin) {
        aktivTrin = null;
        trappeTrin.forEach(function(t) {
          t.classList.remove('selected');
          var exp = t.querySelector('.trin-expand');
          if (exp) exp.innerHTML = '';
        });
        var checkinBekraeft = document.getElementById('trappenCheckinBekraeft');
        if (checkinBekraeft) { checkinBekraeft.innerHTML = ''; checkinBekraeft.style.display = 'none'; }
      }
      // Nulstil session-trackers så næste besøg kan registrere nye check-ins
      trappenSessionCheckins = {};
    }
    if (baseView !== 'temaer' && aktivTema) {
      aktivTema = null;
      if (temaExpanded) {
        temaExpanded.innerHTML = '';
        temaExpanded.classList.remove('visible');
      }
      document.querySelectorAll('.tema-card').forEach(function(c) { c.classList.remove('active'); });
    }
    if (baseView !== 'cirkel') {
      aktivCirkel = null;
      // Reset tabs til overblik
      tabs.forEach(function(t) { t.classList.toggle('active', t.dataset.tab === 'overblik'); });
      tabPanels.forEach(function(p) { p.classList.toggle('active', p.dataset.panel === 'overblik'); });
    }
    // Reset øvelser filter
    if (baseView !== 'oevelser') {
      document.querySelectorAll('.oevelser-filter-btn').forEach(function(btn) {
        btn.classList.toggle('active', btn.dataset.filter === 'alle');
      });
    }

    views.forEach(function(v) {
      v.classList.remove('active', 'fade-in');
    });

    var target = document.querySelector('.view[data-view="' + baseView + '"]');
    if (target) {
      target.classList.add('active', 'fade-in');
      window.scrollTo(0, 0);
    }

    // Update nav
    navItems.forEach(function(item) {
      item.classList.toggle('active', item.dataset.view === baseView);
    });

    updateHeroVisibility();
  }

  function handleHash() {
    var hash = window.location.hash.slice(1) || 'hjem';

    if (hash.indexOf('cirkel/') === 0) {
      var cirkelId = hash.split('/')[1];
      if (D_CIRKLER()[cirkelId]) {
        aktivCirkel = cirkelId;
        renderCirkelDetail(cirkelId);
        navigateTo('cirkel', false);
      } else {
        navigateTo('hjem', false);
      }
    } else if (hash === 'virksomhed') {
      renderVirksomhed();
      navigateTo('virksomhed', false);
    } else if (hash === 'dynamik') {
      renderDynamik();
      navigateTo('dynamik', false);
    } else if (hash === 'gave') {
      renderGave();
      navigateTo('gave', false);
    } else if (hash === 'vurdering') {
      startAssessment();
    } else if (hash === 'resultat') {
      // Redirect to hjem if no data
      if (getAssessmentHistorik().length === 0) { navigateTo('hjem', false); return; }
      renderResultat();
      navigateTo('resultat', false);
    } else if (hash === 'historik') {
      renderHistorik();
      navigateTo('historik', false);
    } else {
      navigateTo(hash, false);
    }
  }

  // ── Events ──
  function bindEvents() {
    // Nav
    navItems.forEach(function(item) {
      item.addEventListener('click', function() {
        navigateTo(this.dataset.view);
      });
    });

    // Hash change
    window.addEventListener('hashchange', handleHash);

    // Rolle skift
    if (rolleSkift) {
      rolleSkift.addEventListener('click', skiftRolle);
    }

    // Cirkel klik
    cirkelNodes.forEach(function(node) {
      node.addEventListener('click', function() {
        var cirkelId = this.dataset.cirkel;
        aktivCirkel = cirkelId;
        renderCirkelDetail(cirkelId);
        navigateTo('cirkel/' + cirkelId);
      });

      node.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.click();
        }
      });
    });

    // Cirkel back
    document.getElementById('cirkelBack').addEventListener('click', function() {
      navigateTo('hjem');
    });

    // Favoritter back
    var favBack = document.getElementById('favBack');
    if (favBack) {
      favBack.addEventListener('click', function() {
        navigateTo('hjem');
      });
    }

    // Tilbage-knapper på trappen, temaer, øvelser
    document.querySelectorAll('.back-to-hjem').forEach(function(btn) {
      btn.addEventListener('click', function() {
        navigateTo('hjem');
      });
    });

    // Assessment back-buttons
    var vurderingBack = document.getElementById('vurderingBack');
    if (vurderingBack) vurderingBack.addEventListener('click', function() { navigateTo('dynamik'); renderDynamik(); });
    var resultatBack = document.getElementById('resultatBack');
    if (resultatBack) resultatBack.addEventListener('click', function() { navigateTo('hjem'); });
    var historikBack = document.getElementById('historikBack');
    if (historikBack) historikBack.addEventListener('click', function() { navigateTo('hjem'); });

    // Dynamik link fra forsiden
    var dynamikLink = document.getElementById('dynamikLink');
    if (dynamikLink) {
      dynamikLink.addEventListener('click', function() {
        showDynamik();
      });
    }

    // Tabs
    tabs.forEach(function(tab) {
      tab.addEventListener('click', function() {
        var tabName = this.dataset.tab;
        tabs.forEach(function(t) { t.classList.toggle('active', t.dataset.tab === tabName); });
        tabPanels.forEach(function(p) { p.classList.toggle('active', p.dataset.panel === tabName); });
      });
    });

    // Trappen
    trappeTrin.forEach(function(trin) {
      trin.addEventListener('click', function() {
        var trinId = this.dataset.trin;
        var trinEl = this;

        // Toggle: klik på samme trin lukker det
        if (aktivTrin === trinId) {
          trinEl.classList.remove('selected');
          var expandEl = trinEl.querySelector('.trin-expand');
          if (expandEl) expandEl.innerHTML = '';
          aktivTrin = null;
          var checkinBekraeft = document.getElementById('trappenCheckinBekraeft');
          if (checkinBekraeft) { checkinBekraeft.innerHTML = ''; checkinBekraeft.style.display = 'none'; }
          return;
        }

        // Luk alle andre
        trappeTrin.forEach(function(t) {
          t.classList.remove('selected');
          var exp = t.querySelector('.trin-expand');
          if (exp) exp.innerHTML = '';
        });
        trinEl.classList.add('selected');
        aktivTrin = trinId;
        visTrappenSvar(trinId);
      });
    });
  }

  // ── Opdater SVG-cirkel-tekster ──
  function getDataPerspektiv() {
    // Virksomhed bruger medarbejder-indhold som fallback
    return (aktivPerspektiv === 'virksomhed') ? 'medarbejder' : aktivPerspektiv;
  }

  function opdaterCirkelTekster() {
    cirkelNodes.forEach(function(node) {
      var cirkelId = node.dataset.cirkel;
      var tekster = D_CIRKEL_TEKSTER()[cirkelId];
      if (!tekster) return;

      var perspektivTekst = tekster[getDataPerspektiv()];
      node.querySelectorAll('.cirkel-tekst-1').forEach(function(el) { el.textContent = perspektivTekst[0]; });
      node.querySelectorAll('.cirkel-tekst-2').forEach(function(el) { el.textContent = perspektivTekst[1]; });
      node.querySelectorAll('.cirkel-tekst-3').forEach(function(el) { el.textContent = perspektivTekst[2] || ''; });
    });
  }

  // ── Cirkel Detail ──
  function renderCirkelDetail(cirkelId) {
    var data = D_CIRKLER()[cirkelId];
    if (!data) return;

    var indhold = data[getDataPerspektiv()];

    // Header
    cirkelDetailIkon.textContent = data.ikon || '◉';
    cirkelDetailTitel.textContent = data.titel;

    // Reset to overblik tab
    tabs.forEach(function(t) { t.classList.toggle('active', t.dataset.tab === 'overblik'); });
    tabPanels.forEach(function(p) { p.classList.toggle('active', p.dataset.panel === 'overblik'); });

    // Overblik
    var html = '<p class="overblik-beskrivelse">' + indhold.overblik.beskrivelse + '</p>';
    html += '<ul class="overblik-punkter">';
    indhold.overblik.punkter.forEach(function(p) {
      html += '<li>' + p + '</li>';
    });
    html += '</ul>';
    html += '<div class="overblik-tip">' + indhold.overblik.tip + '</div>';
    panelOverblik.innerHTML = html;

    // Dybde
    html = '';
    indhold.dybde.forEach(function(afsnit) {
      html += '<p class="dybde-afsnit">' + afsnit + '</p>';
    });
    html += buildActionBar('fordybelse', cirkelId, data.titel + ' — Fordybelse', indhold.dybde.join('\n\n'));

    // Dynamiske sammenhænge
    var sammenhaenge = D_hentSammenhaenge(cirkelId);
    if (sammenhaenge.length > 0) {
      html += '<div class="sammenhaenge-section">';
      html += '<div class="sammenhaenge-header">';
      html += '<div class="sammenhaenge-linje"></div>';
      html += '<span class="sammenhaenge-label">' + t('dynamicConnections') + '</span>';
      html += '<div class="sammenhaenge-linje"></div>';
      html += '</div>';
      html += '<p class="sammenhaenge-intro">' + t('dynamicConnectionsIntro').replace('{name}', (D_CIRKEL_NAVNE()[cirkelId] || cirkelId).toLowerCase()) + '</p>';

      sammenhaenge.forEach(function(s) {
        var tekst = s.data[getDataPerspektiv()];
        var andenNavn = D_CIRKEL_NAVNE()[s.id] || s.titel;
        var cirkelNavn = D_CIRKEL_NAVNE()[cirkelId] || D_CIRKLER()[cirkelId].titel;

        html += '<div class="sammenhaeng-item" data-cirkel="' + s.id + '">';
        html += '<button class="sammenhaeng-toggle">';
        html += '<span class="sammenhaeng-titel">' + cirkelNavn + ' <span class="sammenhaeng-pil">↔</span> ' + andenNavn + '</span>';
        html += '<span class="sammenhaeng-chevron">›</span>';
        html += '</button>';
        html += '<div class="sammenhaeng-indhold">';
        html += '<p>' + tekst + '</p>';
        html += '<button class="sammenhaeng-link" data-goto="' + s.id + '">' + t('explore').replace('{name}', andenNavn) + '</button>';
        html += '</div>';
        html += '</div>';
      });

      html += '</div>';
    }

    panelDybde.innerHTML = html;
    bindActionBars(panelDybde);

    // Bind sammenhænge expand/collapse
    panelDybde.querySelectorAll('.sammenhaeng-toggle').forEach(function(btn) {
      btn.addEventListener('click', function() {
        var item = this.closest('.sammenhaeng-item');
        var wasOpen = item.classList.contains('open');

        // Close all
        panelDybde.querySelectorAll('.sammenhaeng-item').forEach(function(el) {
          el.classList.remove('open');
        });

        // Toggle clicked
        if (!wasOpen) {
          item.classList.add('open');
          item.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      });
    });

    // Bind sammenhænge navigation links
    panelDybde.querySelectorAll('.sammenhaeng-link').forEach(function(link) {
      link.addEventListener('click', function(e) {
        e.stopPropagation();
        var gotoId = this.dataset.goto;
        aktivCirkel = gotoId;
        renderCirkelDetail(gotoId);
        navigateTo('cirkel/' + gotoId);
        window.scrollTo(0, 0);
      });
    });

    // Øvelse — find relateret øvelse
    var relOevelse = null;
    for (var i = 0; i < D_OEVELSER().length; i++) {
      if (D_OEVELSER()[i].cirkel === cirkelId) {
        relOevelse = D_OEVELSER()[i];
        break;
      }
    }

    if (relOevelse) {
      html = '<div class="oevelse-inline">';
      html += '<h3>' + relOevelse.titel + '</h3>';
      html += '<div class="oevelse-meta">';
      html += '<span>' + relOevelse.tid + '</span>';
      html += '<span>' + relOevelse.sted + '</span>';
      html += '</div>';
      html += '<p style="color:var(--text-light); margin-bottom:16px; line-height:1.7;">' + relOevelse.intro + '</p>';
      html += '<ol class="oevelse-steps" style="display:block;">';
      relOevelse.steps.forEach(function(step, idx) {
        html += '<li data-step="' + (idx + 1) + '">' + step + '</li>';
      });
      html += '</ol>';
      html += '</div>';
    } else {
      html = '<p style="color:var(--text-light); padding:20px;">' + t('noExercise') + '</p>';
    }
    panelOevelse.innerHTML = html;
  }

  // ── Trappen ──
  // Check-in tracking
  function getTrappenCheckins() {
    try { return JSON.parse(localStorage.getItem('cf_trappen_checkins') || '[]'); } catch (e) { return []; }
  }
  function saveTrappenCheckin(trinId) {
    var checkins = getTrappenCheckins();
    checkins.push({
      trin: trinId,
      dato: new Date().toISOString().slice(0, 10),
      tid: new Date().toLocaleTimeString('da-DK', { hour: '2-digit', minute: '2-digit' })
    });
    saveTrappenCheckins(checkins);
  }
  function saveTrappenCheckins(c) { localStorage.setItem('cf_trappen_checkins', JSON.stringify(c)); }

  function renderTrappenCheckinBekraeft(trinId) {
    var container = document.getElementById('trappenCheckinBekraeft');
    if (!container) return;
    var data = D_TRAPPEN()[trinId];
    if (!data) return;
    var tid = new Date().toLocaleTimeString('da-DK', { hour: '2-digit', minute: '2-digit' });
    var farveClass = data.farve;

    container.innerHTML = '<div class="checkin-bekraeft checkin-bekraeft-' + farveClass + '">' +
      '<span class="checkin-bekraeft-dot checkin-dot-' + farveClass + '"></span>' +
      '<span>' + t('registered') + ' &middot; ' + tid + '</span>' +
      '</div>';
    container.style.display = 'block';
  }

  function renderTrappenMoenster() {
    var container = document.getElementById('trappenMoenster');
    if (!container) return;
    var checkins = getTrappenCheckins();
    if (checkins.length === 0) {
      container.innerHTML = '';
      container.style.display = 'none';
      return;
    }

    var html = '<div class="moenster-card">';
    html += '<div class="moenster-header">';
    html += '<h4>' + t('yourPattern') + '</h4>';
    html += '</div>';

    // Build 7-day calendar (current week Mon-Sun)
    var today = new Date();
    var dayOfWeek = today.getDay(); // 0=Sun, 1=Mon...
    var mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    var monday = new Date(today);
    monday.setDate(today.getDate() + mondayOffset);

    var dagNavne = t('dayNames');

    html += '<div class="moenster-uge">';
    for (var d = 0; d < 7; d++) {
      var dag = new Date(monday);
      dag.setDate(monday.getDate() + d);
      var dagStr = dag.toISOString().slice(0, 10);
      var isToday = dagStr === today.toISOString().slice(0, 10);

      // Find checkins for this day
      var dagCheckins = checkins.filter(function(c) { return c.dato === dagStr; });
      var lastCheckin = dagCheckins.length > 0 ? dagCheckins[dagCheckins.length - 1] : null;

      var dotClass = 'moenster-dot-empty';
      if (lastCheckin) {
        dotClass = 'moenster-dot-' + (D_TRAPPEN()[lastCheckin.trin] ? D_TRAPPEN()[lastCheckin.trin].farve : 'empty');
      }

      html += '<div class="moenster-dag' + (isToday ? ' moenster-dag-idag' : '') + '">';
      html += '<span class="moenster-dag-navn">' + dagNavne[d] + '</span>';
      html += '<span class="moenster-dag-dot ' + dotClass + '"></span>';
      html += '</div>';
    }
    html += '</div>';

    // Insight text
    var totalCheckins = checkins.length;
    var thisWeekCheckins = checkins.filter(function(c) {
      return c.dato >= monday.toISOString().slice(0, 10);
    });

    if (thisWeekCheckins.length <= 2) {
      var plural = thisWeekCheckins.length !== 1 ? (isEn() ? 's' : 'e') : '';
      html += '<p class="moenster-indsigt">' + t('patternInsightLow').replace('{count}', thisWeekCheckins.length).replace('{plural}', plural) + '</p>';
    } else {
      // Count tilstande this week
      var groenCount = thisWeekCheckins.filter(function(c) { return c.trin === 'groen'; }).length;
      var gulCount = thisWeekCheckins.filter(function(c) { return c.trin === 'gul'; }).length;
      var roedCount = thisWeekCheckins.filter(function(c) { return c.trin === 'roed'; }).length;
      var dominant = groenCount >= gulCount && groenCount >= roedCount ? (isEn() ? 'green' : 'grøn') : gulCount >= roedCount ? (isEn() ? 'yellow' : 'gul') : (isEn() ? 'red' : 'rød');
      html += '<p class="moenster-indsigt">' + t('patternInsightHigh').replace('{state}', dominant) + '</p>';
    }

    html += '</div>';
    container.innerHTML = html;
    container.style.display = 'block';
  }

  function renderTrappenForstaaelse() {
    var container = document.getElementById('trappenForstaaelse');
    if (!container) return;
    var perspektiv = getDataPerspektiv();
    var tekster = D_TRAPPEN_FORSTAAELSE()[perspektiv];
    if (!tekster) return;

    var rolleText = perspektiv === 'leder' ? t('roleLeader') : t('roleEmployee');
    var html = '<div class="forstaaelse-section">';
    html += '<div class="forstaaelse-divider"></div>';
    html += '<h3 class="forstaaelse-title">' + t('understandTitle').replace('{role}', rolleText) + '</h3>';

    tekster.forEach(function(t) {
      html += '<div class="forstaaelse-card">';
      html += '<h4 class="forstaaelse-card-title">' + t.titel + '</h4>';
      html += '<p class="forstaaelse-card-tekst">' + t.tekst + '</p>';
      html += '</div>';
    });

    html += '</div>';
    container.innerHTML = html;
  }

  // Track which trin has been checked in this session to avoid duplicates
  var trappenSessionCheckins = {};

  function visTrappenSvar(trinId) {
    var data = D_TRAPPEN()[trinId];
    if (!data) return;

    // Register check-in only once per trin per session
    if (!trappenSessionCheckins[trinId]) {
      trappenSessionCheckins[trinId] = true;
      saveTrappenCheckin(trinId);
    }
    renderTrappenCheckinBekraeft(trinId);
    renderTrappenMoenster();

    var svar = data[getDataPerspektiv()];
    var farveClass = data.farve === 'sage' ? 'sage-border' : data.farve === 'amber' ? 'amber-border' : 'rose-border';

    var html = '<div class="trappen-card ' + farveClass + '">';
    html += '<h3>' + data.navn + '</h3>';
    html += '<p>' + svar.beskrivelse + '</p>';

    // Kropslige signaler
    html += '<div class="trappen-signaler-section">';
    html += '<strong>' + t('bodySignals') + '</strong>';
    html += '<ul class="trappen-signaler">';
    svar.kropsSignaler.forEach(function(s) {
      html += '<li>' + s + '</li>';
    });
    html += '</ul>';
    html += '</div>';

    // Handlinger (now bullet list)
    html += '<div class="trappen-handling">';
    html += '<strong>' + t('actions') + '</strong>';
    if (svar.handlinger) {
      html += '<ul class="trappen-handlinger-list">';
      svar.handlinger.forEach(function(h) {
        html += '<li>' + h + '</li>';
      });
      html += '</ul>';
    } else {
      html += '<p>' + svar.handling + '</p>';
    }
    html += '</div>';

    // Hvad mærker andre?
    if (svar.hvadMaerkerAndre) {
      html += '<div class="trappen-andre">';
      html += '<strong>' + t('whatOthersNotice') + '</strong>';
      var andre = svar.hvadMaerkerAndre;
      var keys = Object.keys(andre);
      keys.forEach(function(key) {
        var label = key.charAt(0).toUpperCase() + key.slice(1);
        if (key === 'kolleger') label = t('yourColleagues');
        if (key === 'teamet') label = t('wholeTeam');
        if (key === 'medarbejderne') label = t('yourEmployees');
        if (key === 'organisationen') label = t('organization');
        html += '<div class="trappen-andre-sub">';
        html += '<h5>' + label + '</h5>';
        html += '<p>' + andre[key] + '</p>';
        html += '</div>';
      });
      html += '</div>';
    }

    // Prøv nu
    html += '<div class="trappen-oevelse">';
    html += '<strong>' + t('tryNow') + '</strong>';
    html += '<p>' + svar.oevelse + '</p>';
    html += '</div>';

    html += buildActionBar('trappen', trinId, data.navn, svar.beskrivelse);

    html += '</div>';

    // Insert into inline expand area
    var expandMap = { groen: 'trinExpandGroen', gul: 'trinExpandGul', roed: 'trinExpandRoed' };
    var expandEl = document.getElementById(expandMap[trinId]);
    if (expandEl) {
      expandEl.innerHTML = html;
      bindActionBars(expandEl);
    }
  }

  // ── Temaer ──
  function renderTemaer() {
    var html = '';
    var temaKeys = Object.keys(D_TEMA_INDHOLD());
    temaKeys.forEach(function(key) {
      var tema = D_TEMA_INDHOLD()[key];
      // Count related exercises
      var oevelseCount = 0;
      D_OEVELSER().forEach(function(o) {
        if (o.temaer && o.temaer.indexOf(key) !== -1) oevelseCount++;
      });

      html += '<button class="tema-card" data-tema="' + key + '">';
      html += '<div class="tema-card-header tema-card-header-' + key + '">';
      html += '<span class="tema-ikon">' + (tema.ikon || '') + '</span>';
      html += '<h3>' + tema.titel + '</h3>';
      html += '</div>';
      html += '<div class="tema-card-body">';
      html += '<p class="tema-card-question">' + (tema.spoergsmaal || tema[getDataPerspektiv()].intro.substring(0, 60) + '...') + '</p>';
      if (oevelseCount > 0) {
        var exPlural = oevelseCount > 1 ? (isEn() ? 's' : 'r') : '';
        html += '<span class="tema-card-count">' + t('exerciseCount').replace('{count}', oevelseCount).replace('{plural}', exPlural) + '</span>';
      }
      html += '</div>';
      html += '</button>';
    });
    temaGrid.innerHTML = html;

    // Bind clicks
    temaGrid.querySelectorAll('.tema-card').forEach(function(card) {
      card.addEventListener('click', function() {
        var temaId = this.dataset.tema;

        if (aktivTema === temaId) {
          // Toggle off
          this.classList.remove('active');
          aktivTema = null;
          temaExpanded.classList.remove('visible');
          return;
        }

        temaGrid.querySelectorAll('.tema-card').forEach(function(c) { c.classList.remove('active'); });
        this.classList.add('active');
        aktivTema = temaId;
        visTemaDetalje(temaId);
      });
    });
  }

  function visTemaDetalje(temaId) {
    var data = D_TEMA_INDHOLD()[temaId];
    if (!data) return;

    var perspektiv = data[getDataPerspektiv()];

    var html = '<div class="tema-detail-card">';
    html += '<h3>' + data.titel + '</h3>';
    html += '<p class="tema-intro">' + perspektiv.intro + '</p>';
    html += '<p class="tema-tekst">' + perspektiv.tekst + '</p>';

    // Related exercises
    var relOevelser = [];
    D_OEVELSER().forEach(function(o, idx) {
      if (o.temaer && o.temaer.indexOf(temaId) !== -1) {
        relOevelser.push({ oevelse: o, index: idx });
      }
    });

    if (relOevelser.length > 0) {
      html += '<div class="tema-detail-oevelser">';
      html += '<span class="tema-detail-oevelser-label">' + t('exercisesForTheme') + '</span>';
      relOevelser.forEach(function(item) {
        html += '<button class="tema-detail-oevelse-link" data-oevelse-idx="' + item.index + '">';
        html += '<span class="oevelse-link-tid">' + item.oevelse.tid + '</span>';
        html += '<span class="oevelse-link-titel">' + item.oevelse.titel + '</span>';
        html += '</button>';
      });
      html += '</div>';
    }

    if (perspektiv.relateredeCirkler && perspektiv.relateredeCirkler.length) {
      html += '<div class="tema-relaterede">';
      perspektiv.relateredeCirkler.forEach(function(cirkelId) {
        if (D_CIRKLER()[cirkelId]) {
          html += '<span class="tag" data-cirkel="' + cirkelId + '">' + D_CIRKLER()[cirkelId].titel + '</span>';
        }
      });
      html += '</div>';
    }

    html += buildActionBar('tema', temaId, data.titel, perspektiv.intro + '\n\n' + perspektiv.tekst);

    html += '</div>';

    temaExpanded.innerHTML = html;
    temaExpanded.classList.add('visible');
    bindActionBars(temaExpanded);

    // Bind relaterede cirkel-tags
    temaExpanded.querySelectorAll('.tag[data-cirkel]').forEach(function(tag) {
      tag.addEventListener('click', function() {
        var cirkelId = this.dataset.cirkel;
        aktivCirkel = cirkelId;
        renderCirkelDetail(cirkelId);
        navigateTo('cirkel/' + cirkelId);
      });
    });

    // Bind exercise links
    temaExpanded.querySelectorAll('.tema-detail-oevelse-link').forEach(function(link) {
      link.addEventListener('click', function(e) {
        e.stopPropagation();
        var idx = parseInt(this.dataset.oevelseIdx);
        navigateTo('oevelser');
        setTimeout(function() {
          var cards = oevelserGrid.querySelectorAll('.oevelse-card');
          if (cards[idx]) {
            // Collapse all, expand target
            cards.forEach(function(c) {
              c.classList.remove('expanded');
              var btn = c.querySelector('.oevelse-toggle');
              if (btn) btn.textContent = ''+t('showExercise')+'';
            });
            cards[idx].classList.add('expanded');
            var toggleBtn = cards[idx].querySelector('.oevelse-toggle');
            if (toggleBtn) toggleBtn.textContent = ''+t('hideExercise')+'';
            cards[idx].scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 150);
      });
    });

    temaExpanded.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  // ── Øvelser ──
  // Filter category mapping
  var OEVELSE_FILTER_MAP = {
    krop: ['krop'],
    aandedraet: ['aandedraet'],
    regulering: ['centrum', 'tilstande', 'resiliens'],
    team: ['ledelse', 'samarbejde']
  };

  var aktivFilter = 'alle';

  // ── Proces-tracking (localStorage) ──
  function getProces() {
    try { return JSON.parse(localStorage.getItem('cf_proces') || '{"oevelser":[],"refleksioner":[],"journal":[]}'); }
    catch (e) { return { oevelser: [], refleksioner: [], journal: [] }; }
  }
  function saveProces(p) { localStorage.setItem('cf_proces', JSON.stringify(p)); }

  function markerOevelseGennemfoert(titel) {
    var p = getProces();
    p.oevelser.push({ titel: titel, dato: new Date().toISOString().slice(0, 10), tid: new Date().toLocaleTimeString('da-DK', { hour: '2-digit', minute: '2-digit' }) });
    saveProces(p);
  }

  function gemRefleksionSvar(id, titel, svar) {
    var p = getProces();
    p.refleksioner.push({ id: id, titel: titel, svar: svar, dato: new Date().toISOString().slice(0, 10) });
    saveProces(p);
  }

  function gemJournalNotat(tekst) {
    var p = getProces();
    p.journal.push({ tekst: tekst, dato: new Date().toISOString().slice(0, 10), tid: new Date().toLocaleTimeString('da-DK', { hour: '2-digit', minute: '2-digit' }) });
    saveProces(p);
  }

  function renderOevelser() {
    var html = '';
    D_OEVELSER().forEach(function(o, i) {
      html += '<div class="oevelse-card" data-index="' + i + '" data-cirkel="' + o.cirkel + '">';
      html += '<div class="oevelse-card-inner">';
      html += '<div class="oevelse-card-top">';
      html += '<h3>' + o.titel + '</h3>';
      html += '<span class="oevelse-tid-badge">' + o.tid + '</span>';
      html += '</div>';
      html += '<div class="oevelse-meta">';
      html += '<span>' + o.sted + '</span>';
      if (D_CIRKLER()[o.cirkel]) {
        html += '<span>' + D_CIRKLER()[o.cirkel].titel + '</span>';
      }
      html += '</div>';
      html += '<p class="oevelse-intro">' + o.intro + '</p>';
      html += '<ol class="oevelse-steps" data-total="' + o.steps.length + '">';
      o.steps.forEach(function(step, idx) {
        html += '<li data-step="' + (idx + 1) + '">' + step + '</li>';
      });
      html += '</ol>';

      // Embedded refleksion
      if (o.refleksion) {
        html += '<div class="oevelse-refleksion">';
        html += '<div class="oevelse-refleksion-header">' + t('reflectionAfter') + '</div>';
        html += '<p class="oevelse-refleksion-tekst">' + o.refleksion + '</p>';
        html += '</div>';
      }

      html += '<div class="oevelse-guide-controls">';
      html += '<button class="oevelse-guide-btn btn-secondary oevelse-guide-start">Start øvelse</button>';
      html += '<div class="oevelse-guide-progress"><div class="oevelse-guide-progress-bar"></div></div>';
      html += '<button class="oevelse-guide-btn oevelse-guide-next" style="display:none;">Næste trin</button>';
      html += '</div>';
      html += buildActionBar('oevelse', o.titel, o.titel, o.intro + '\n\n' + o.steps.join('\n'));
      html += '<button class="oevelse-toggle">'+t('showExercise')+'</button>';
      html += '</div>';
      html += '</div>';
    });

    oevelserGrid.innerHTML = html;

    bindActionBars(oevelserGrid);

    // Bind expand/collapse
    oevelserGrid.querySelectorAll('.oevelse-card').forEach(function(card) {
      card.addEventListener('click', function(e) {
        if (e.target.closest('.oevelse-guide-controls')) return;
        if (e.target.closest('.action-bar')) return;

        var isExpanded = this.classList.contains('expanded');

        oevelserGrid.querySelectorAll('.oevelse-card').forEach(function(c) {
          c.classList.remove('expanded');
          var btn = c.querySelector('.oevelse-toggle');
          if (btn) btn.textContent = ''+t('showExercise')+'';
          resetGuide(c);
        });

        if (!isExpanded) {
          this.classList.add('expanded');
          var toggleBtn = this.querySelector('.oevelse-toggle');
          if (toggleBtn) toggleBtn.textContent = ''+t('hideExercise')+'';
        }
      });
    });

    // Bind guided mode
    oevelserGrid.querySelectorAll('.oevelse-guide-start').forEach(function(btn) {
      btn.addEventListener('click', function(e) {
        e.stopPropagation();
        var card = this.closest('.oevelse-card');
        startGuide(card);
      });
    });

    oevelserGrid.querySelectorAll('.oevelse-guide-next').forEach(function(btn) {
      btn.addEventListener('click', function(e) {
        e.stopPropagation();
        var card = this.closest('.oevelse-card');
        advanceGuide(card);
      });
    });

    applyFilter(aktivFilter);
  }

  // ── Refleksioner (Del 2) ──
  function renderRefleksioner() {
    var container = document.getElementById('refleksionerGrid');
    if (!container) return;
    var html = '';

    D_REFLEKSIONER().forEach(function(r) {
      html += '<div class="refleksion-card refleksion-card-' + r.farve + '" data-ref-id="' + r.id + '">';
      html += '<div class="refleksion-card-header">';
      html += '<span class="refleksion-card-ikon">' + r.ikon + '</span>';
      html += '<h3 class="refleksion-card-titel">' + r.titel + '</h3>';
      html += '</div>';
      html += '<p class="refleksion-card-spoergsmaal">' + r.spoergsmaal + '</p>';
      html += '<div class="refleksion-card-body">';
      html += '<p class="refleksion-card-uddybning">' + r.uddybning + '</p>';
      html += '<textarea class="refleksion-card-input" placeholder="' + t('reflectionPlaceholder') + '" rows="3"></textarea>';
      html += '<div class="refleksion-card-actions">';
      html += '<button class="refleksion-gem-btn" data-ref-id="' + r.id + '" data-ref-titel="' + escapeAttr(r.titel) + '">' + t('saveReflection') + '</button>';
      html += '</div>';
      html += '</div>';
      html += '</div>';
    });

    container.innerHTML = html;

    // Bind card expand
    container.querySelectorAll('.refleksion-card').forEach(function(card) {
      card.addEventListener('click', function(e) {
        if (e.target.closest('.refleksion-card-input')) return;
        if (e.target.closest('.refleksion-gem-btn')) return;
        var wasActive = this.classList.contains('active');
        container.querySelectorAll('.refleksion-card').forEach(function(c) { c.classList.remove('active'); });
        if (!wasActive) this.classList.add('active');
      });
    });

    // Bind gem buttons
    container.querySelectorAll('.refleksion-gem-btn').forEach(function(btn) {
      btn.addEventListener('click', function(e) {
        e.stopPropagation();
        var card = this.closest('.refleksion-card');
        var textarea = card.querySelector('.refleksion-card-input');
        var svar = textarea.value.trim();
        if (!svar) {
          textarea.focus();
          textarea.style.borderColor = 'var(--rose)';
          setTimeout(function() { textarea.style.borderColor = ''; }, 2000);
          return;
        }
        var id = this.dataset.refId;
        var titel = this.dataset.refTitel;
        gemRefleksionSvar(id, titel, svar);
        this.textContent = t('saved');
        this.style.background = 'var(--sage)';
        var self = this;
        setTimeout(function() {
          self.textContent = t('saveReflection');
          self.style.background = '';
          textarea.value = '';
          renderDinProces();
        }, 1500);
      });
    });
  }

  // ── Din proces (Del 3) ──
  function renderDinProces() {
    var container = document.getElementById('dinProcesContainer');
    if (!container) return;
    var p = getProces();
    var html = '';

    // Stats overview
    var totalOev = p.oevelser.length;
    var totalRef = p.refleksioner.length;
    var totalJournal = p.journal.length;
    var unikkeOev = [];
    p.oevelser.forEach(function(o) { if (unikkeOev.indexOf(o.titel) === -1) unikkeOev.push(o.titel); });

    html += '<div class="proces-stats">';
    html += '<div class="proces-stat">';
    html += '<span class="proces-stat-tal">' + totalOev + '</span>';
    html += '<span class="proces-stat-label">' + t('exercisesCompleted') + '</span>';
    html += '</div>';
    html += '<div class="proces-stat">';
    html += '<span class="proces-stat-tal">' + unikkeOev.length + '</span>';
    html += '<span class="proces-stat-label">' + t('differentExercises') + '</span>';
    html += '</div>';
    html += '<div class="proces-stat">';
    html += '<span class="proces-stat-tal">' + totalRef + '</span>';
    html += '<span class="proces-stat-label">' + t('reflectionsWritten') + '</span>';
    html += '</div>';
    html += '<div class="proces-stat">';
    html += '<span class="proces-stat-tal">' + totalJournal + '</span>';
    html += '<span class="proces-stat-label">' + t('journalNotes') + '</span>';
    html += '</div>';
    html += '</div>';

    // Journal input
    html += '<div class="proces-journal">';
    html += '<h4 class="proces-journal-title">' + t('journalTitle') + '</h4>';
    html += '<p class="proces-journal-hint">' + t('journalHint') + '</p>';
    html += '<textarea class="proces-journal-input" id="procesJournalInput" placeholder="' + t('journalPlaceholder') + '" rows="3"></textarea>';
    html += '<button class="proces-journal-gem" id="procesJournalGem">' + t('saveNote') + '</button>';
    html += '</div>';

    // Timeline
    var allEntries = [];
    p.oevelser.forEach(function(o) { allEntries.push({ type: 'oevelse', titel: o.titel, dato: o.dato, tid: o.tid || '' }); });
    p.refleksioner.forEach(function(r) { allEntries.push({ type: 'refleksion', titel: r.titel, dato: r.dato, svar: r.svar }); });
    p.journal.forEach(function(j) { allEntries.push({ type: 'journal', tekst: j.tekst, dato: j.dato, tid: j.tid || '' }); });

    // Sort newest first
    allEntries.sort(function(a, b) { return b.dato.localeCompare(a.dato); });

    if (allEntries.length > 0) {
      html += '<div class="proces-tidslinje">';
      html += '<h4 class="proces-tidslinje-title">' + t('yourTimeline') + '</h4>';

      var shown = Math.min(allEntries.length, 20);
      for (var i = 0; i < shown; i++) {
        var entry = allEntries[i];
        html += '<div class="proces-entry proces-entry-' + entry.type + '">';
        html += '<div class="proces-entry-dot"></div>';
        html += '<div class="proces-entry-content">';
        if (entry.type === 'oevelse') {
          html += '<div class="proces-entry-label">' + t('exerciseCompleted') + '</div>';
          html += '<div class="proces-entry-titel">' + entry.titel + '</div>';
        } else if (entry.type === 'refleksion') {
          html += '<div class="proces-entry-label">' + t('reflection') + '</div>';
          html += '<div class="proces-entry-titel">' + entry.titel + '</div>';
          html += '<div class="proces-entry-svar">' + entry.svar + '</div>';
        } else if (entry.type === 'journal') {
          html += '<div class="proces-entry-label">' + t('journalNote') + '</div>';
          html += '<div class="proces-entry-svar">' + entry.tekst + '</div>';
        }
        html += '<div class="proces-entry-dato">' + entry.dato + (entry.tid ? ' ' + t('atTime') + ' ' + entry.tid : '') + '</div>';
        html += '</div>';
        html += '</div>';
      }

      if (allEntries.length > 20) {
        html += '<div class="proces-mere">+ ' + (allEntries.length - 20) + ' ' + t('earlier') + '</div>';
      }

      html += '</div>';
    } else {
      html += '<div class="proces-tom">';
      html += '<p>' + t('processEmpty') + '</p>';
      html += '<p class="proces-tom-hint">' + t('processEmptyHint') + '</p>';
      html += '</div>';
    }

    container.innerHTML = html;

    // Bind journal gem
    var gemBtn = document.getElementById('procesJournalGem');
    var journalInput = document.getElementById('procesJournalInput');
    if (gemBtn && journalInput) {
      gemBtn.addEventListener('click', function() {
        var tekst = journalInput.value.trim();
        if (!tekst) {
          journalInput.focus();
          journalInput.style.borderColor = 'var(--rose)';
          setTimeout(function() { journalInput.style.borderColor = ''; }, 2000);
          return;
        }
        gemJournalNotat(tekst);
        journalInput.value = '';
        gemBtn.textContent = t('saved');
        gemBtn.style.background = 'var(--sage)';
        setTimeout(function() {
          gemBtn.textContent = t('saveNote');
          gemBtn.style.background = '';
          renderDinProces();
        }, 1200);
      });
    }
  }

  function resetGuide(card) {
    var steps = card.querySelector('.oevelse-steps');
    if (!steps) return;
    steps.classList.remove('guided');
    var lis = steps.querySelectorAll('li');
    lis.forEach(function(li) { li.classList.remove('step-active', 'step-done'); });
    var startBtn = card.querySelector('.oevelse-guide-start');
    var nextBtn = card.querySelector('.oevelse-guide-next');
    var progressBar = card.querySelector('.oevelse-guide-progress-bar');
    if (startBtn) { startBtn.style.display = ''; startBtn.textContent = t('startGuided'); }
    if (nextBtn) nextBtn.style.display = 'none';
    if (progressBar) progressBar.style.width = '0%';
    card.removeAttribute('data-guide-step');
  }

  function startGuide(card) {
    var steps = card.querySelector('.oevelse-steps');
    if (!steps) return;
    steps.classList.add('guided');
    var lis = steps.querySelectorAll('li');
    lis.forEach(function(li) { li.classList.remove('step-active', 'step-done'); });
    if (lis[0]) lis[0].classList.add('step-active');
    card.setAttribute('data-guide-step', '0');

    var startBtn = card.querySelector('.oevelse-guide-start');
    var nextBtn = card.querySelector('.oevelse-guide-next');
    var progressBar = card.querySelector('.oevelse-guide-progress-bar');
    if (startBtn) startBtn.style.display = 'none';
    if (nextBtn) { nextBtn.style.display = ''; nextBtn.textContent = t('nextStep'); }
    var total = parseInt(steps.dataset.total) || lis.length;
    if (progressBar) progressBar.style.width = (1 / total * 100) + '%';
  }

  function advanceGuide(card) {
    var steps = card.querySelector('.oevelse-steps');
    if (!steps) return;
    var lis = steps.querySelectorAll('li');
    var current = parseInt(card.getAttribute('data-guide-step')) || 0;
    var total = lis.length;

    // Mark current as done
    if (lis[current]) {
      lis[current].classList.remove('step-active');
      lis[current].classList.add('step-done');
    }

    var next = current + 1;
    if (next < total) {
      lis[next].classList.add('step-active');
      card.setAttribute('data-guide-step', next);
      lis[next].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    var progressBar = card.querySelector('.oevelse-guide-progress-bar');
    if (progressBar) progressBar.style.width = ((next + 1) / total * 100) + '%';

    // Last step
    if (next >= total - 1) {
      var nextBtn = card.querySelector('.oevelse-guide-next');
      if (nextBtn) nextBtn.textContent = t('finish');
    }

    // Done
    if (next >= total) {
      var startBtn = card.querySelector('.oevelse-guide-start');
      var nextBtn2 = card.querySelector('.oevelse-guide-next');
      if (startBtn) { startBtn.style.display = ''; startBtn.textContent = t('startAgain'); }
      if (nextBtn2) nextBtn2.style.display = 'none';
      // Mark all done
      lis.forEach(function(li) { li.classList.remove('step-active'); li.classList.add('step-done'); });
      // Track completion
      var idx = parseInt(card.getAttribute('data-index'));
      if (D_OEVELSER()[idx]) {
        markerOevelseGennemfoert(D_OEVELSER()[idx].titel);
        renderDinProces();
      }
    }
  }

  function applyFilter(filter) {
    aktivFilter = filter;
    var cards = oevelserGrid.querySelectorAll('.oevelse-card');
    cards.forEach(function(card) {
      var cirkel = card.dataset.cirkel;
      if (filter === 'alle') {
        card.classList.remove('hidden-by-filter');
      } else {
        var categories = OEVELSE_FILTER_MAP[filter];
        if (categories && categories.indexOf(cirkel) !== -1) {
          card.classList.remove('hidden-by-filter');
        } else {
          card.classList.add('hidden-by-filter');
        }
      }
    });
  }

  function bindFilterEvents() {
    var filterContainer = document.getElementById('oevelserFilter');
    if (!filterContainer) return;
    filterContainer.querySelectorAll('.oevelser-filter-btn').forEach(function(btn) {
      btn.addEventListener('click', function() {
        filterContainer.querySelectorAll('.oevelser-filter-btn').forEach(function(b) { b.classList.remove('active'); });
        this.classList.add('active');
        applyFilter(this.dataset.filter);
      });
    });
  }

  // ── Dynamik side ──
  function renderDynamik() {
    var container = document.getElementById('dynamikContent');
    if (!container) return;

    var perspektiv = getDataPerspektiv();
    var erLeder = perspektiv === 'leder';

    // Circle labels for SVG
    var cLabels;
    if (isEn()) {
      cLabels = [
        { l1: 'Stress regulation', l2: '' },
        { l1: 'Three states', l2: erLeder ? 'in your team' : 'in your workday' },
        { l1: erLeder ? 'Your leadership' : 'Your leader', l2: erLeder ? '& the culture' : '& your wellbeing' },
        { l1: erLeder ? 'Team' : 'Your', l2: erLeder ? 'collaboration' : 'collaboration', l3: erLeder ? '' : 'patterns' },
        { l1: erLeder ? 'Movement' : 'Your body', l2: erLeder ? 'in the team' : 'in daily life' },
        { l1: erLeder ? 'Shared breaks' : 'Your breathing', l2: erLeder ? '& breathing' : '& breaks' },
        { l1: erLeder ? "Team's" : 'Your mental', l2: erLeder ? 'resilience' : 'resilience' }
      ];
    } else {
      cLabels = [
        { l1: 'Stressregulering', l2: '' },
        { l1: 'Tre tilstande', l2: 'i arbejdsdagen' },
        { l1: erLeder ? 'Dit lederskab' : 'Din leder', l2: erLeder ? '& kulturen' : '& din trivsel' },
        { l1: 'Samarbejds-', l2: 'mønstre' },
        { l1: erLeder ? 'Bevægelse' : 'Din krop', l2: erLeder ? 'i teamet' : 'i hverdagen' },
        { l1: erLeder ? 'Fælles pauser' : 'Dit åndedræt', l2: erLeder ? '& åndedræt' : '& pauser' },
        { l1: erLeder ? 'Teamets' : 'Dit mentale', l2: erLeder ? 'resiliens' : 'overskud' }
      ];
    }

    var html = '';

    // Intro
    if (isEn()) {
      html += '<p class="dynamik-lead">The circle model is not just an illustration. It is a mirror of how ' + (erLeder ? 'your team' : 'your workday') + ' actually functions — as one interconnected system where no area stands alone. Once you understand this dynamic, you also understand why change requires more than a single isolated effort.</p>';
    } else {
      html += '<p class="dynamik-lead">Cirkelmodellen er ikke bare en illustration. Den er et spejl af den måde ' + (erLeder ? 'dit team' : 'din arbejdsdag') + ' faktisk fungerer — som ét sammenhængende system, hvor intet område står alene. Forstår du denne dynamik, forstår du også hvorfor forandring kræver mere end én isoleret indsats.</p>';
    }

    // === SECTION 1: Balance ===
    html += '<div class="dynamik-section">';
    html += '<h3 class="dynamik-section-title">' + t('balanceTitle') + '</h3>';

    // SVG balanced
    html += '<div class="dynamik-svg-wrap">';
    html += '<svg viewBox="0 0 520 520" class="dynamik-svg">';
    // Connection lines
    html += '<g opacity="0.35">';
    var balPos = {c:[260,260],r:[260,110],p:[390,185],f:[390,335],b:[260,410],a:[130,335],i:[130,185]};
    var keys = ['r','p','f','b','a','i'];
    keys.forEach(function(k){
      html += '<line x1="'+balPos.c[0]+'" y1="'+balPos.c[1]+'" x2="'+balPos[k][0]+'" y2="'+balPos[k][1]+'" stroke="var(--primary)" stroke-width="1" stroke-dasharray="4,4"/>';
    });
    for(var x=0;x<keys.length;x++){
      for(var y=x+1;y<keys.length;y++){
        html += '<line x1="'+balPos[keys[x]][0]+'" y1="'+balPos[keys[x]][1]+'" x2="'+balPos[keys[y]][0]+'" y2="'+balPos[keys[y]][1]+'" stroke="var(--primary)" stroke-width="0.5" stroke-dasharray="3,5"/>';
      }
    }
    html += '</g>';
    html += '<circle cx="260" cy="260" r="72" fill="#fff"/>';
    html += '<circle cx="260" cy="260" r="72" fill="var(--primary)" stroke="var(--primary)" stroke-width="2"/>';
    html += '<text x="260" y="255" fill="#fff" font-family="Georgia,serif" font-size="14" text-anchor="middle" font-weight="600">' + cLabels[0].l1 + '</text>';
    html += '<text x="260" y="273" fill="#fff" font-family="Georgia,serif" font-size="12" text-anchor="middle">' + cLabels[0].l2 + '</text>';
    var balCircles = [
      {x:260,y:110,idx:1},{x:390,y:185,idx:2},{x:390,y:335,idx:3},
      {x:260,y:410,idx:4},{x:130,y:335,idx:5},{x:130,y:185,idx:6}
    ];
    balCircles.forEach(function(c){
      html += '<circle cx="'+c.x+'" cy="'+c.y+'" r="56" fill="#fff"/>';
      html += '<circle cx="'+c.x+'" cy="'+c.y+'" r="56" fill="var(--primary-light)" stroke="var(--primary)" stroke-width="1.5" opacity="0.88"/>';
      var yOff = cLabels[c.idx].l3 ? -12 : -6;
      html += '<text x="'+c.x+'" y="'+(c.y+yOff)+'" fill="#fff" font-family="Georgia,serif" font-size="12" text-anchor="middle">'+cLabels[c.idx].l1+'</text>';
      html += '<text x="'+c.x+'" y="'+(c.y+yOff+16)+'" fill="#fff" font-family="Georgia,serif" font-size="12" text-anchor="middle">'+cLabels[c.idx].l2+'</text>';
      if (cLabels[c.idx].l3) html += '<text x="'+c.x+'" y="'+(c.y+yOff+32)+'" fill="#fff" font-family="Georgia,serif" font-size="12" text-anchor="middle">'+cLabels[c.idx].l3+'</text>';
    });
    html += '</svg>';
    html += '<p class="dynamik-svg-caption">' + t('balanceCaption') + '</p>';
    html += '</div>';

    if (erLeder) {
      if (isEn()) {
        html += '<p class="dynamik-text">When your team is functioning well, all seven dimensions work together in a mutual interplay. Stress regulation supports the culture. Breathing and breaks create space for recovery. Leadership creates safety. Collaboration patterns are flexible enough to hold conflict without breaking down.</p>';
        html += '<p class="dynamik-text">In this state, the team\'s nervous systems are regulated. There is room for creativity, honesty and innovation. Conflicts are handled constructively. People have the energy for each other — and for themselves. This is the state that creates psychological safety.</p>';
      } else {
        html += '<p class="dynamik-text">Når dit team fungerer, arbejder alle syv dimensioner sammen i en gensidig vekselvirkning. Stressregulering bærer kulturen. Åndedræt og pauser giver plads til recovery. Lederskabet skaber tryghed. Samarbejdsmønstre er fleksible nok til at rumme konflikter uden at bryde ned.</p>';
        html += '<p class="dynamik-text">I denne tilstand er teamets nervesystemer regulerede. Der er plads til kreativitet, ærlighed og innovation. Konflikter håndteres konstruktivt. Folk har overskud til hinanden — og til sig selv. Det er denne tilstand, der skaber psykologisk tryghed.</p>';
      }
    } else {
      if (isEn()) {
        html += '<p class="dynamik-text">When your workday is functioning well, all seven dimensions work together in a mutual interplay. Stress regulation sustains your daily life. Breathing and breaks create space for recovery. Your relationship with leadership and colleagues feels safe. And your collaboration patterns are flexible enough to hold conflict without collapsing.</p>';
        html += '<p class="dynamik-text">In this state, your nervous system is regulated. You have access to creativity, empathy and perspective. Your body is relaxed yet energized, your breathing is deep and calm, and you feel present. This is the state that makes good work possible.</p>';
      } else {
        html += '<p class="dynamik-text">Når din arbejdsdag fungerer, arbejder alle syv dimensioner sammen i en gensidig vekselvirkning. Stressregulering bærer hverdagen. Åndedræt og pauser giver plads til genopladning. Din relation til ledelse og kolleger er tryg. Og dine samarbejdsmønstre er fleksible nok til at rumme konflikter uden at bryde sammen.</p>';
        html += '<p class="dynamik-text">I denne tilstand er dit nervesystem reguleret. Du har adgang til kreativitet, empati og overblik. Kroppen er afslappet men energisk, åndedrættet er dybt og roligt, og du føler dig tilstede. Det er denne tilstand, der gør godt arbejde muligt.</p>';
      }
    }
    if (isEn()) {
      html += '<p class="dynamik-text">Notice the figure. The symmetry. The even distances. The connection lines distributed evenly. You can see it immediately — something here is working.</p>';
    } else {
      html += '<p class="dynamik-text">Læg mærke til figuren. Symmetrien. De lige afstande. Forbindelseslinjerne der fordeler sig jævnt. Du kan se det med det samme — her er noget der fungerer.</p>';
    }
    html += '</div>';

    // === SECTION 2: Under pressure ===
    html += '<div class="dynamik-section">';
    html += '<h3 class="dynamik-section-title">' + t('pressureTitle') + '</h3>';

    html += '<div class="dynamik-svg-wrap">';
    html += '<svg viewBox="0 0 520 520" class="dynamik-svg">';
    var presPos = {c:[270,255],r:[240,100],p:[405,165],f:[380,355],b:[280,420],a:[115,310],i:[145,200]};
    html += '<g opacity="0.35">';
    var pk = ['r','p','f','b','a','i'];
    pk.forEach(function(k){
      html += '<line x1="'+presPos.c[0]+'" y1="'+presPos.c[1]+'" x2="'+presPos[k][0]+'" y2="'+presPos[k][1]+'" stroke="var(--primary)" stroke-width="1" stroke-dasharray="4,4"/>';
    });
    for(var x2=0;x2<pk.length;x2++){
      for(var y2=x2+1;y2<pk.length;y2++){
        html += '<line x1="'+presPos[pk[x2]][0]+'" y1="'+presPos[pk[x2]][1]+'" x2="'+presPos[pk[y2]][0]+'" y2="'+presPos[pk[y2]][1]+'" stroke="var(--primary)" stroke-width="0.5" stroke-dasharray="3,5"/>';
      }
    }
    html += '</g>';
    html += '<circle cx="270" cy="255" r="68" fill="#fff"/>';
    html += '<circle cx="270" cy="255" r="68" fill="var(--primary)" stroke="var(--primary)" stroke-width="2"/>';
    html += '<text x="270" y="250" fill="#fff" font-family="Georgia,serif" font-size="13" text-anchor="middle" font-weight="600">' + cLabels[0].l1 + '</text>';
    html += '<text x="270" y="266" fill="#fff" font-family="Georgia,serif" font-size="11" text-anchor="middle">' + cLabels[0].l2 + '</text>';
    var presCircles = [
      {x:240,y:100,r:48,idx:1,op:'0.7'},{x:405,y:165,r:44,idx:2,op:'0.65'},
      {x:380,y:355,r:62,idx:3,op:'0.9'},{x:280,y:420,r:50,idx:4,op:'0.75'},
      {x:115,y:310,r:58,idx:5,op:'0.85'},{x:145,y:200,r:42,idx:6,op:'0.6'}
    ];
    presCircles.forEach(function(c){
      html += '<circle cx="'+c.x+'" cy="'+c.y+'" r="'+c.r+'" fill="#fff"/>';
      html += '<circle cx="'+c.x+'" cy="'+c.y+'" r="'+c.r+'" fill="var(--primary-light)" stroke="var(--primary)" stroke-width="1.5" opacity="'+c.op+'"/>';
      var yOff2 = cLabels[c.idx].l3 ? -11 : -5;
      html += '<text x="'+c.x+'" y="'+(c.y+yOff2)+'" fill="#fff" font-family="Georgia,serif" font-size="11" text-anchor="middle">'+cLabels[c.idx].l1+'</text>';
      html += '<text x="'+c.x+'" y="'+(c.y+yOff2+14)+'" fill="#fff" font-family="Georgia,serif" font-size="11" text-anchor="middle">'+cLabels[c.idx].l2+'</text>';
      if (cLabels[c.idx].l3) html += '<text x="'+c.x+'" y="'+(c.y+yOff2+28)+'" fill="#fff" font-family="Georgia,serif" font-size="11" text-anchor="middle">'+cLabels[c.idx].l3+'</text>';
    });
    html += '</svg>';
    html += '<p class="dynamik-svg-caption">' + t('pressureCaption') + '</p>';
    html += '</div>';

    if (erLeder) {
      if (isEn()) {
        html += '<p class="dynamik-text">But the workday doesn\'t always look like that. Restructuring, deadlines, conflicts, staff shortages, poor leadership from above — all of this pulls the team out of balance. And it doesn\'t happen in isolation. When one area is strained, all the others feel it.</p>';
        html += '<p class="dynamik-text">Look at the figure. Compare it with the previous one. The symmetry is broken. Some circles are drawn closer together, others pushed apart. This is exactly how it feels in a team under pressure — something is off, but it\'s hard to pinpoint what.</p>';
      } else {
        html += '<p class="dynamik-text">Men arbejdsdagen ser ikke altid sådan ud. Omstruktureringer, deadlines, konflikter, personalemangel, dårlig ledelse ovenfra — alt dette trækker teamet ud af balance. Og det sker ikke isoleret. Når ét område belastes, mærker alle de andre det.</p>';
        html += '<p class="dynamik-text">Se på figuren. Sammenlign den med den forrige. Symmetrien er brudt. Nogle cirkler er trukket tættere sammen, andre skubbet fra hinanden. Det er præcis sådan det føles i et team under pres — noget er skævt, men det er svært at sætte fingeren på hvad.</p>';
      }
    } else {
      if (isEn()) {
        html += '<p class="dynamik-text">But the workday doesn\'t always look like that. Deadlines, conflicts, constant interruptions, poor leadership, too many tasks — all of this pulls you out of balance. And it doesn\'t happen in isolation. When one area is strained, all the others feel it.</p>';
        html += '<p class="dynamik-text">Look at the figure. Compare it with the previous one. The symmetry is broken. Some circles are drawn closer together, others pushed apart. The circles have changed size — this is exactly how it feels when you\'re under pressure. Something is off, but it\'s hard to pinpoint what it really is.</p>';
      } else {
        html += '<p class="dynamik-text">Men arbejdsdagen ser ikke altid sådan ud. Deadlines, konflikter, konstante afbrydelser, dårlig ledelse, for mange opgaver — alt dette trækker dig ud af balance. Og det sker ikke isoleret. Når ét område belastes, mærker alle de andre det.</p>';
        html += '<p class="dynamik-text">Se på figuren. Sammenlign den med den forrige. Symmetrien er brudt. Nogle cirkler er trukket tættere sammen, andre skubbet fra hinanden. Cirklerne har ændret størrelse — det er præcis sådan det føles når du er presset. Noget er skævt, men det er svært at sætte fingeren på hvad det egentlig er.</p>';
      }
    }
    if (isEn()) {
      html += '<p class="dynamik-text">And that\'s because it isn\'t one single problem. It\'s the entire system pulled out of its natural balance.</p>';
    } else {
      html += '<p class="dynamik-text">Og det er fordi det ikke er ét enkelt problem. Det er hele systemet der er trukket ud af sin naturlige balance.</p>';
    }
    html += '</div>';

    // === SECTION 3: One area dominates ===
    html += '<div class="dynamik-section">';
    html += '<h3 class="dynamik-section-title">' + t('dominanceTitle') + '</h3>';

    html += '<div class="dynamik-svg-wrap">';
    html += '<svg viewBox="0 0 520 520" class="dynamik-svg">';
    var domPos = {c:[280,260],r:[255,115],p:[395,200],f:[370,350],b:[260,415],a:[120,320],i:[100,165]};
    html += '<g opacity="0.35">';
    var dk = ['r','p','f','b','a','i'];
    dk.forEach(function(k){
      html += '<line x1="'+domPos.c[0]+'" y1="'+domPos.c[1]+'" x2="'+domPos[k][0]+'" y2="'+domPos[k][1]+'" stroke="var(--primary)" stroke-width="1" stroke-dasharray="4,4"/>';
    });
    for(var x3=0;x3<dk.length;x3++){
      for(var y3=x3+1;y3<dk.length;y3++){
        html += '<line x1="'+domPos[dk[x3]][0]+'" y1="'+domPos[dk[x3]][1]+'" x2="'+domPos[dk[y3]][0]+'" y2="'+domPos[dk[y3]][1]+'" stroke="var(--primary)" stroke-width="0.5" stroke-dasharray="3,5"/>';
      }
    }
    html += '</g>';
    html += '<circle cx="280" cy="260" r="65" fill="#fff"/>';
    html += '<circle cx="280" cy="260" r="65" fill="var(--primary)" stroke="var(--primary)" stroke-width="2"/>';
    html += '<text x="280" y="255" fill="#fff" font-family="Georgia,serif" font-size="13" text-anchor="middle" font-weight="600">' + cLabels[0].l1 + '</text>';
    html += '<text x="280" y="271" fill="#fff" font-family="Georgia,serif" font-size="11" text-anchor="middle">' + cLabels[0].l2 + '</text>';
    // Big dominant circle — "Uadresseret stress" / "Kulturelt pres"
    var domLabel = erLeder ? {l1:t('culturalPressure')[0],l2:t('culturalPressure')[1]} : {l1:t('unaddressedStress')[0],l2:t('unaddressedStress')[1]};
    html += '<circle cx="100" cy="165" r="78" fill="#fff"/>';
    html += '<circle cx="100" cy="165" r="78" fill="var(--rose)" stroke="var(--rose)" stroke-width="2" opacity="0.85"/>';
    html += '<text x="100" y="158" fill="#fff" font-family="Georgia,serif" font-size="14" text-anchor="middle" font-weight="600">'+domLabel.l1+'</text>';
    html += '<text x="100" y="178" fill="#fff" font-family="Georgia,serif" font-size="14" text-anchor="middle" font-weight="600">'+domLabel.l2+'</text>';
    var domCircles = [
      {x:255,y:115,r:42,idx:1,op:'0.6'},{x:395,y:200,r:40,idx:2,op:'0.55'},
      {x:370,y:350,r:48,idx:3,op:'0.7'},{x:260,y:415,r:44,idx:4,op:'0.65'},
      {x:120,y:320,r:46,idx:5,op:'0.7'}
    ];
    domCircles.forEach(function(c){
      html += '<circle cx="'+c.x+'" cy="'+c.y+'" r="'+c.r+'" fill="#fff"/>';
      html += '<circle cx="'+c.x+'" cy="'+c.y+'" r="'+c.r+'" fill="var(--primary-light)" stroke="var(--primary)" stroke-width="1.5" opacity="'+c.op+'"/>';
      var yOff3 = cLabels[c.idx].l3 ? -10 : -5;
      html += '<text x="'+c.x+'" y="'+(c.y+yOff3)+'" fill="#fff" font-family="Georgia,serif" font-size="10" text-anchor="middle">'+cLabels[c.idx].l1+'</text>';
      html += '<text x="'+c.x+'" y="'+(c.y+yOff3+13)+'" fill="#fff" font-family="Georgia,serif" font-size="10" text-anchor="middle">'+cLabels[c.idx].l2+'</text>';
      if (cLabels[c.idx].l3) html += '<text x="'+c.x+'" y="'+(c.y+yOff3+26)+'" fill="#fff" font-family="Georgia,serif" font-size="10" text-anchor="middle">'+cLabels[c.idx].l3+'</text>';
    });
    html += '</svg>';
    html += '<p class="dynamik-svg-caption">' + (erLeder ? (isEn() ? 'Cultural pressure pulls the entire team system toward itself' : 'Kulturelt pres trækker hele teamets system mod sig') : (isEn() ? 'Unaddressed stress pulls your entire system out of balance' : 'Uadresseret stress trækker hele dit system ud af balance')) + '</p>';
    html += '</div>';

    if (erLeder) {
      if (isEn()) {
        html += '<p class="dynamik-text">Let\'s look more closely at what happens when one specific area is under pressure — for example, cultural pressure from the organization: unrealistic expectations, insufficient resources, or leadership that pushes without listening.</p>';
        html += '<p class="dynamik-text">The pressure doesn\'t stay in its own circle. It expands. It takes up more space. And as it grows, it pulls all other areas out of their natural position:</p>';
        html += '<ul class="dynamik-list">';
        html += '<li><strong>Three states:</strong> The team shifts from green to sustained yellow alert. People run on adrenaline. Mistakes increase. Irritation replaces collaboration.</li>';
        html += '<li><strong>Leadership & culture:</strong> Your leadership becomes reactive instead of strategic. You fight fires instead of building. Your own regulation drops, and the team feels it immediately.</li>';
        html += '<li><strong>Collaboration patterns:</strong> Collaboration stiffens. People retreat into silos. Conflicts aren\'t addressed — they\'re parked and left to simmer.</li>';
        html += '<li><strong>Body & movement:</strong> Breaks disappear. People eat at their screens. Shoulders sit up by the ears all day. Sick leave quietly rises.</li>';
        html += '<li><strong>Breathing & breaks:</strong> Nobody takes breaks. Breathing is shallow. The nervous system is stuck in activation — and it spreads from leader to employee.</li>';
        html += '</ul>';
      } else {
        html += '<p class="dynamik-text">Lad os se nærmere på hvad der sker, når ét specifikt område er under pres — for eksempel kulturelt pres fra organisationen: urealistiske forventninger, manglende ressourcer, eller en ledelse der presser uden at lytte.</p>';
        html += '<p class="dynamik-text">Presset bliver ikke i sin egen cirkel. Det udvider sig. Det fylder mere. Og i takt med at det vokser, trækker det alle andre områder ud af deres naturlige position:</p>';
        html += '<ul class="dynamik-list">';
        html += '<li><strong>Tre tilstande:</strong> Teamet skifter fra grøn til vedvarende gul alarm. Folk kører på adrenalin. Fejlene stiger. Irritation erstatter samarbejde.</li>';
        html += '<li><strong>Lederskab & kultur:</strong> Din ledelse bliver reaktiv i stedet for strategisk. Du slukker brande i stedet for at bygge. Din regulering falder, og teamet mærker det øjeblikkeligt.</li>';
        html += '<li><strong>Samarbejdsmønstre:</strong> Samarbejdet stivner. Folk trækker sig ind i siloer. Konflikter håndteres ikke — de parkeres og ulmer.</li>';
        html += '<li><strong>Krop & bevægelse:</strong> Pauser forsvinder. Folk spiser ved skærmen. Skuldrene sidder oppe ved ørerne hele dagen. Sygefraværet stiger stille og roligt.</li>';
        html += '<li><strong>Åndedræt & pauser:</strong> Ingen tager pauser. Åndedrættet er overfladisk. Nervesystemet sidder fast i aktivering — og det smitter fra leder til medarbejder.</li>';
        html += '</ul>';
      }
    } else {
      if (isEn()) {
        html += '<p class="dynamik-text">Let\'s look more closely at what happens when one specific area is under pressure — for example, unaddressed stress that never gets the space to be regulated.</p>';
        html += '<p class="dynamik-text">The stress doesn\'t stay in its own circle. It expands. It takes up more space. And as it grows, it pulls all other areas out of their natural position:</p>';
        html += '<ul class="dynamik-list">';
        html += '<li><strong>Three states:</strong> You\'re stuck in yellow alert or red shutdown. Shifting to green happens less often and lasts shorter. Your nervous system gradually forgets what calm feels like.</li>';
        html += '<li><strong>Your leader & your wellbeing:</strong> Your experience of leadership is colored by your stress state. A leader who normally feels supportive starts to feel demanding. Communication deteriorates.</li>';
        html += '<li><strong>Collaboration patterns:</strong> Your collaboration patterns stiffen. You withdraw, over-adapt or escalate — depending on your attachment pattern. Relationships that normally hold start to creak.</li>';
        html += '<li><strong>Your body:</strong> The body carries it all. Tension headaches, poor sleep, stiffness in neck and shoulders, an inner restlessness that won\'t let go.</li>';
        html += '<li><strong>Your breathing:</strong> Breathing becomes shallow and rapid. Breaks disappear. The nervous system loses its natural ability to shift between activation and rest.</li>';
        html += '</ul>';
      } else {
        html += '<p class="dynamik-text">Lad os se nærmere på hvad der sker, når ét specifikt område er under pres — for eksempel uadresseret stress der aldrig får plads til at blive reguleret.</p>';
        html += '<p class="dynamik-text">Stressen bliver ikke i sin egen cirkel. Den udvider sig. Den fylder mere. Og i takt med at den vokser, trækker den alle andre områder ud af deres naturlige position:</p>';
        html += '<ul class="dynamik-list">';
        html += '<li><strong>Tre tilstande:</strong> Du sidder fast i gul alarm eller rød nedlukning. Skiftet til grøn tilstand sker sjældnere og varer kortere. Dit nervesystem glemmer gradvist, hvordan ro føles.</li>';
        html += '<li><strong>Din leder & din trivsel:</strong> Din oplevelse af ledelse farves af din stresstilstand. En leder der normalt føles støttende, begynder at føles krævende. Kommunikationen forværres.</li>';
        html += '<li><strong>Samarbejdsmønstre:</strong> Dine samarbejdsmønstre stivner. Du trækker dig, overtilpasser eller eskalerer — afhængigt af dit tilknytningsmønster. Relationer der normalt bærer, begynder at knirke.</li>';
        html += '<li><strong>Din krop:</strong> Kroppen bærer det hele. Spændingshovedpine, dårlig søvn, stivhed i nakke og skuldre, indre uro der ikke vil slippe.</li>';
        html += '<li><strong>Dit åndedræt:</strong> Åndedrættet bliver overfladisk og hurtigt. Pauserne forsvinder. Nervesystemet mister sin naturlige evne til at skifte mellem aktivering og hvile.</li>';
        html += '</ul>';
      }
    }
    if (isEn()) {
      html += '<p class="dynamik-text">This is not weakness. It is the nervous system\'s attempt to cope. But the cost is that the entire system\'s balance is lost.</p>';
    } else {
      html += '<p class="dynamik-text">Det er ikke svaghed. Det er nervesystemets forsøg på at klare sig. Men prisen er, at hele systemets balance går tabt.</p>';
    }
    html += '</div>';

    // === SECTION 4: Multiple areas ===
    html += '<div class="dynamik-section">';
    html += '<h3 class="dynamik-section-title">' + t('multipleTitle') + '</h3>';

    html += '<div class="dynamik-svg-wrap">';
    html += '<svg viewBox="0 0 520 520" class="dynamik-svg">';
    var mulPos = {c:[265,265],r:[220,95],p:[410,175],f:[395,360],b:[240,430],a:[100,340],i:[110,170]};
    html += '<g opacity="0.35">';
    var mk = ['r','p','f','b','a','i'];
    mk.forEach(function(k){
      html += '<line x1="'+mulPos.c[0]+'" y1="'+mulPos.c[1]+'" x2="'+mulPos[k][0]+'" y2="'+mulPos[k][1]+'" stroke="var(--primary)" stroke-width="1" stroke-dasharray="4,4"/>';
    });
    for(var x4=0;x4<mk.length;x4++){
      for(var y4=x4+1;y4<mk.length;y4++){
        html += '<line x1="'+mulPos[mk[x4]][0]+'" y1="'+mulPos[mk[x4]][1]+'" x2="'+mulPos[mk[y4]][0]+'" y2="'+mulPos[mk[y4]][1]+'" stroke="var(--primary)" stroke-width="0.5" stroke-dasharray="3,5"/>';
      }
    }
    html += '</g>';
    html += '<circle cx="265" cy="265" r="62" fill="#fff"/>';
    html += '<circle cx="265" cy="265" r="62" fill="var(--primary)" stroke="var(--primary)" stroke-width="2"/>';
    html += '<text x="265" y="260" fill="#fff" font-family="Georgia,serif" font-size="12" text-anchor="middle" font-weight="600">' + cLabels[0].l1 + '</text>';
    html += '<text x="265" y="276" fill="#fff" font-family="Georgia,serif" font-size="10" text-anchor="middle">' + cLabels[0].l2 + '</text>';
    var mulCircles = [
      {x:220,y:95,r:52,idx:1,fill:'var(--amber)',stroke:'var(--amber)',op:'0.85'},
      {x:410,y:175,r:42,idx:2,fill:'var(--primary-light)',stroke:'var(--primary)',op:'0.55'},
      {x:395,y:360,r:68,idx:3,fill:'var(--rose)',stroke:'var(--rose)',op:'0.85'},
      {x:240,y:430,r:38,idx:4,fill:'var(--primary-light)',stroke:'var(--primary)',op:'0.5'},
      {x:100,y:340,r:60,idx:5,fill:'var(--amber)',stroke:'var(--amber)',op:'0.8'},
      {x:110,y:170,r:70,idx:6,fill:'var(--rose)',stroke:'var(--rose)',op:'0.85'}
    ];
    mulCircles.forEach(function(c){
      html += '<circle cx="'+c.x+'" cy="'+c.y+'" r="'+c.r+'" fill="#fff"/>';
      html += '<circle cx="'+c.x+'" cy="'+c.y+'" r="'+c.r+'" fill="'+c.fill+'" stroke="'+c.stroke+'" stroke-width="1.5" opacity="'+c.op+'"/>';
      var yOff4 = cLabels[c.idx].l3 ? -10 : -5;
      html += '<text x="'+c.x+'" y="'+(c.y+yOff4)+'" fill="#fff" font-family="Georgia,serif" font-size="10" text-anchor="middle">'+cLabels[c.idx].l1+'</text>';
      html += '<text x="'+c.x+'" y="'+(c.y+yOff4+13)+'" fill="#fff" font-family="Georgia,serif" font-size="10" text-anchor="middle">'+cLabels[c.idx].l2+'</text>';
      if (cLabels[c.idx].l3) html += '<text x="'+c.x+'" y="'+(c.y+yOff4+26)+'" fill="#fff" font-family="Georgia,serif" font-size="10" text-anchor="middle">'+cLabels[c.idx].l3+'</text>';
    });
    html += '</svg>';
    html += '<p class="dynamik-svg-caption">' + t('multipleCaption') + '</p>';
    html += '</div>';

    if (erLeder) {
      if (isEn()) {
        html += '<p class="dynamik-text">In reality, it\'s rarely just one area that\'s strained. A team with cultural pressure often also has poor collaboration patterns AND burned-out employees AND absence of breaks AND a leader who is dysregulated themselves. Each strained area amplifies the others.</p>';
        html += '<p class="dynamik-text">That\'s why isolated initiatives often hit a ceiling. Introducing a mindfulness app without addressing the workload. Sending employees on stress management courses without changing the culture. Talking about psychological safety without modeling it. Each initiative has value — but none of them alone can restore balance in a system being pulled in multiple directions at once.</p>';
      } else {
        html += '<p class="dynamik-text">I virkeligheden er det sjældent kun ét område, der er belastet. Et team med kulturelt pres har ofte også dårlige samarbejdsmønstre OG udbrændte medarbejdere OG fravær af pauser OG en leder der selv er dysreguleret. Hvert presset område forstærker de andre.</p>';
        html += '<p class="dynamik-text">Det er derfor isolerede tiltag ofte rammer et loft. At indføre mindfulness-app uden at adressere arbejdsbyrden. At sende medarbejdere på stresshåndteringskursus uden at ændre kulturen. At tale om psykologisk tryghed uden at modellere den. Hvert tiltag kan noget — men ingen af dem alene kan genskabe balancen i et system, der trækkes i flere retninger samtidig.</p>';
      }
    } else {
      if (isEn()) {
        html += '<p class="dynamik-text">In reality, it\'s rarely just one area that\'s strained. An employee with chronic stress often also has disrupted sleep AND a tense body AND collaboration problems AND a leader who doesn\'t see it. Each strained area amplifies the others.</p>';
        html += '<p class="dynamik-text">That\'s why isolated solutions often hit a ceiling. Taking a yoga class without addressing the work pressure. Learning breathing exercises without actually taking breaks. Talking about stress without changing what creates it. Each approach has value — but none of them alone can restore balance in a system being pulled in multiple directions.</p>';
      } else {
        html += '<p class="dynamik-text">I virkeligheden er det sjældent kun ét område, der er belastet. En medarbejder med kronisk stress har ofte også forstyrret søvn OG spændt krop OG samarbejdsproblemer OG en leder der ikke ser det. Hvert presset område forstærker de andre.</p>';
        html += '<p class="dynamik-text">Det er derfor isolerede løsninger ofte rammer et loft. At tage en yogaklasse uden at adressere arbejdspresset. At lære åndedrætøvelser uden at tage pauserne. At tale om stress uden at ændre det der skaber det. Hver tilgang kan noget — men ingen af dem alene kan genskabe balancen i et system, der trækkes i flere retninger.</p>';
      }
    }
    html += '</div>';

    // === SECTION 5: Why wholeness matters ===
    html += '<div class="dynamik-section">';
    html += '<h3 class="dynamik-section-title">' + t('wholenessTitle') + '</h3>';
    if (erLeder) {
      if (isEn()) {
        html += '<p class="dynamik-text">The circle model is not just a map — it is a leadership philosophy. When we understand that everything affects everything in a team, it changes the way we approach wellbeing. We don\'t address symptoms. We address the system.</p>';
        html += '<p class="dynamik-text">That\'s why Clement\'s approach integrates nervous system understanding with leadership development, team dynamics and somatic awareness. Not because complexity is the goal, but because the workplace itself is an integrated whole. Balance returns when we meet the team with care, with structure, and with the understanding that change in one person creates movement throughout the entire system.</p>';
      } else {
        html += '<p class="dynamik-text">Cirkelmodellen er ikke bare et kort — den er en ledelsesfilosofi. Når vi forstår, at alt påvirker alt i et team, ændrer det måden vi arbejder med trivsel på. Vi adresserer ikke symptomer. Vi adresserer systemet.</p>';
        html += '<p class="dynamik-text">Det er derfor Clements tilgang integrerer nervesystemsforståelse med ledelsesudvikling, teamdynamik og kropslig bevidsthed. Ikke fordi kompleksitet er målet, men fordi arbejdspladsen selv er en integreret helhed. Balance vender tilbage, når vi møder teamet med omsorg, med struktur, og med forståelse for at forandring i ét menneske skaber bevægelse i hele systemet.</p>';
      }
    } else {
      if (isEn()) {
        html += '<p class="dynamik-text">The circle model is not just a map — it is a philosophy for your working life. When you understand that everything affects everything in your workday, it changes how you approach your own wellbeing. You don\'t just address symptoms. You address the system.</p>';
        html += '<p class="dynamik-text">That\'s why Clement\'s approach integrates nervous system understanding with somatic awareness, breathwork and relational intelligence. Not because complexity is the goal, but because your workday itself is an integrated whole. Balance returns when you give yourself permission to work with the entire system — one exercise, one break, one boundary at a time.</p>';
      } else {
        html += '<p class="dynamik-text">Cirkelmodellen er ikke bare et kort — den er en livsfilosofi for dit arbejdsliv. Når du forstår, at alt påvirker alt i din arbejdsdag, ændrer det måden du arbejder med din egen trivsel. Du adresserer ikke bare symptomer. Du adresserer systemet.</p>';
        html += '<p class="dynamik-text">Det er derfor Clements tilgang integrerer nervesystemsforståelse med kropslig bevidsthed, åndedrætsarbejde og relationel intelligens. Ikke fordi kompleksitet er målet, men fordi din arbejdsdag selv er en integreret helhed. Balance vender tilbage, når du giver dig selv lov til at arbejde med hele systemet — en øvelse, en pause, en grænse ad gangen.</p>';
      }
    }
    html += '</div>';

    // === Callout: For dig ===
    html += '<div class="dynamik-callout">';
    if (erLeder) {
      html += '<h3 class="dynamik-callout-title">' + t('forYouLeader') + '</h3>';
      if (isEn()) {
        html += '<p class="dynamik-text">When you see the skewed figure, you may recognize your own team. That feeling of everything being slightly off — of working hard but not being able to reach each other. Of energy leaking somewhere you can\'t see.</p>';
        html += '<p class="dynamik-text">Know that it\'s not permanent. Your team has the capacity for balance — it just needs the right conditions to find its way back. And those conditions start with you: your own regulation, your ability to set boundaries, your willingness to prioritize wellbeing over speed.</p>';
        html += '<p class="dynamik-text">Explore the circles above. Start where you feel the most pressure. And know that wherever you begin, you\'re working with the entire system.</p>';
      } else {
        html += '<p class="dynamik-text">Når du ser den skæve figur, genkender du måske dit eget team. Den fornemmelse af at alt er lidt forskudt — at I arbejder hårdt, men ikke kan nå hinanden. At energien lækker et sted, du ikke kan se.</p>';
        html += '<p class="dynamik-text">Vid at det ikke er permanent. Dit team har kapaciteten til balance — det har bare brug for de rette betingelser for at finde tilbage. Og de betingelser starter med dig: din egen regulering, din evne til at sætte grænser, din vilje til at prioritere trivsel over tempo.</p>';
        html += '<p class="dynamik-text">Udforsk cirklerne ovenfor. Start der, hvor du mærker mest pres. Og vid, at uanset hvor du begynder, arbejder du med hele systemet.</p>';
      }
    } else {
      html += '<h3 class="dynamik-callout-title">' + t('forYou') + '</h3>';
      if (isEn()) {
        html += '<p class="dynamik-text">When you see the skewed figure, you may recognize your own daily life. That feeling of everything being slightly off — of doing your best but still feeling exhausted, disconnected or out of balance.</p>';
        html += '<p class="dynamik-text">Know that it\'s not your fault. Your nervous system is responding rationally to the conditions it meets. And know that change is possible — not all at once, but one area at a time. One exercise. One break. One boundary. Each small movement sends ripples through the entire system.</p>';
        html += '<p class="dynamik-text">Explore the circles above. Start where you feel the most. And know that wherever you begin, you\'re working with your entire system.</p>';
      } else {
        html += '<p class="dynamik-text">Når du ser den skæve figur, genkender du måske din egen hverdag. Den fornemmelse af at alt er lidt forskudt — at du gør dit bedste, men alligevel føler dig udmattet, afkoblet eller ude af balance.</p>';
        html += '<p class="dynamik-text">Vid at det ikke er din skyld. Dit nervesystem reagerer rationelt på de betingelser, det møder. Og vid at forandring er mulig — ikke alt på én gang, men ét område ad gangen. Én øvelse. Én pause. Én grænse. Hver lille bevægelse sender bølger gennem hele systemet.</p>';
        html += '<p class="dynamik-text">Udforsk cirklerne ovenfor. Start der, hvor du mærker mest. Og vid, at uanset hvor du begynder, arbejder du med hele dit system.</p>';
      }
    }
    html += '</div>';

    // Assessment CTA
    html += '<div class="dynamik-assessment-cta">';
    html += '<div class="dynamik-assessment-cta-inner">';
    html += '<h3 class="dynamik-assessment-cta-title">Kortlæg dit eget billede</h3>';
    html += '<p class="dynamik-assessment-cta-desc">Nu forstår du dynamikken. Næste skridt er at se, hvor du selv er — og hvor du kan skabe størst forandring.</p>';
    html += '<button class="assess-btn assess-btn-next" id="dynamikStartAssessment">Start din personlige vurdering</button>';
    var hist = getAssessmentHistorik();
    if (hist.length > 0) {
      html += '<button class="assess-btn assess-btn-back" id="dynamikVisHistorik" style="margin-top:8px">Se din udvikling over tid (' + hist.length + ' vurdering' + (hist.length > 1 ? 'er' : '') + ')</button>';
    }
    html += '</div>';
    html += '</div>';

    // Back to top
    html += '<button class="dynamik-to-top" onclick="window.scrollTo({top:0,behavior:\'smooth\'})">' + t('backToTop') + '</button>';

    container.innerHTML = html;

    // Bind assessment CTA
    var startBtn = document.getElementById('dynamikStartAssessment');
    if (startBtn) startBtn.addEventListener('click', startAssessment);
    var histBtn = document.getElementById('dynamikVisHistorik');
    if (histBtn) histBtn.addEventListener('click', function() { renderHistorik(); navigateTo('historik'); });
  }

  function showDynamik() {
    renderDynamik();
    navigateTo('dynamik');
  }

  // ── Assessment: Personlig vurdering ──
  var assessmentScores = {};
  var assessmentTrin = 0;
  var ASSESSMENT_KEYS = ['centrum', 'tilstande', 'ledelse', 'samarbejde', 'krop', 'aandedraet', 'resiliens'];

  function getAssessmentHistorik() {
    try { return JSON.parse(localStorage.getItem('cf_assessment_historik') || '[]'); } catch(e) { return []; }
  }
  function saveAssessmentHistorik(data) { localStorage.setItem('cf_assessment_historik', JSON.stringify(data)); }

  function startAssessment() {
    assessmentScores = {};
    assessmentTrin = 0;
    ASSESSMENT_KEYS.forEach(function(k) {
      assessmentScores[k] = { generelt: 5, vinkler: [5,5,5,5,5,5] };
    });
    renderAssessmentTrin();
    navigateTo('vurdering');
  }

  function renderAssessmentProgress() {
    var container = document.getElementById('vurderingProgress');
    if (!container) return;
    var total = ASSESSMENT_KEYS.length;
    var html = '<div class="assess-progress-bar">';
    for (var i = 0; i < total; i++) {
      var cls = i < assessmentTrin ? 'done' : (i === assessmentTrin ? 'active' : '');
      html += '<div class="assess-progress-step ' + cls + '">' +
        '<span class="assess-progress-dot"></span>' +
        '<span class="assess-progress-label">' + ASSESSMENT_DATA[ASSESSMENT_KEYS[i]].ikon + '</span>' +
        '</div>';
    }
    html += '</div>';
    html += '<p class="assess-progress-text">Trin ' + (assessmentTrin + 1) + ' af ' + total + '</p>';
    container.innerHTML = html;
  }

  function renderAssessmentTrin() {
    var container = document.getElementById('vurderingContent');
    if (!container) return;
    renderAssessmentProgress();

    var key = ASSESSMENT_KEYS[assessmentTrin];
    var dim = ASSESSMENT_DATA[key];
    var perspektiv = getDataPerspektiv();
    var scores = assessmentScores[key];

    var html = '';
    html += '<div class="assess-dimension">';
    html += '<div class="assess-dim-header">';
    html += '<span class="assess-dim-ikon">' + dim.ikon + '</span>';
    html += '<h2 class="assess-dim-titel">' + dim.titel + '</h2>';
    html += '</div>';

    // Generel score
    html += '<div class="assess-generelt">';
    html += '<p class="assess-question">' + dim.generelt[perspektiv] + '</p>';
    html += '<div class="assess-slider-wrap">';
    html += '<input type="range" min="1" max="10" value="' + scores.generelt + '" class="assess-slider" id="assessGenSlider">';
    html += '<div class="assess-slider-labels"><span>1</span><span>5</span><span>10</span></div>';
    html += '<div class="assess-slider-value" id="assessGenValue">' + scores.generelt + '</div>';
    html += '</div>';
    html += '</div>';

    // 6 vinkler
    html += '<div class="assess-vinkler">';
    html += '<h3 class="assess-vinkler-titel">Uddyb din oplevelse</h3>';
    for (var i = 0; i < dim.vinkler.length; i++) {
      var v = dim.vinkler[i];
      html += '<div class="assess-vinkel">';
      html += '<p class="assess-vinkel-label">' + v.titel + '</p>';
      html += '<p class="assess-vinkel-question">' + v[perspektiv] + '</p>';
      html += '<div class="assess-slider-wrap assess-slider-small">';
      html += '<input type="range" min="1" max="10" value="' + scores.vinkler[i] + '" class="assess-slider" data-vinkel="' + i + '">';
      html += '<span class="assess-vinkel-value">' + scores.vinkler[i] + '</span>';
      html += '</div>';
      html += '</div>';
    }
    html += '</div>';

    // Mini-opsummering SVG
    html += '<div class="assess-mini-summary" id="assessMiniSummary"></div>';

    // Navigation
    html += '<div class="assess-nav">';
    if (assessmentTrin > 0) {
      html += '<button class="assess-btn assess-btn-back" id="assessPrev">← Forrige</button>';
    }
    if (assessmentTrin < ASSESSMENT_KEYS.length - 1) {
      html += '<button class="assess-btn assess-btn-next" id="assessNext">Næste →</button>';
    } else {
      html += '<button class="assess-btn assess-btn-finish" id="assessFinish">Se din samlede vurdering</button>';
    }
    html += '</div>';

    html += '</div>';
    container.innerHTML = html;

    // Bind slider events
    var genSlider = document.getElementById('assessGenSlider');
    var genValue = document.getElementById('assessGenValue');
    genSlider.addEventListener('input', function() {
      scores.generelt = parseInt(this.value);
      genValue.textContent = this.value;
      updateMiniSummary(key);
    });

    container.querySelectorAll('.assess-slider[data-vinkel]').forEach(function(slider) {
      slider.addEventListener('input', function() {
        var idx = parseInt(this.dataset.vinkel);
        scores.vinkler[idx] = parseInt(this.value);
        this.parentNode.querySelector('.assess-vinkel-value').textContent = this.value;
        updateMiniSummary(key);
      });
    });

    var prevBtn = document.getElementById('assessPrev');
    var nextBtn = document.getElementById('assessNext');
    var finishBtn = document.getElementById('assessFinish');

    if (prevBtn) prevBtn.addEventListener('click', function() {
      assessmentTrin--;
      renderAssessmentTrin();
      window.scrollTo(0, 0);
    });
    if (nextBtn) nextBtn.addEventListener('click', function() {
      assessmentTrin++;
      renderAssessmentTrin();
      window.scrollTo(0, 0);
    });
    if (finishBtn) finishBtn.addEventListener('click', function() {
      saveAssessmentResult();
      renderResultat();
      navigateTo('resultat');
    });

    updateMiniSummary(key);
  }

  function updateMiniSummary(key) {
    var el = document.getElementById('assessMiniSummary');
    if (!el) return;
    var scores = assessmentScores[key];
    var dim = ASSESSMENT_DATA[key];
    var avg = scores.generelt;
    var vinkelAvg = 0;
    for (var i = 0; i < scores.vinkler.length; i++) vinkelAvg += scores.vinkler[i];
    vinkelAvg = Math.round(vinkelAvg / scores.vinkler.length * 10) / 10;
    var samlet = Math.round((avg + vinkelAvg) / 2 * 10) / 10;
    var niveau = getNiveau(samlet);

    var html = '<div class="assess-mini-card">';
    html += '<div class="assess-mini-bar-wrap">';
    html += '<div class="assess-mini-bar" style="width:' + (samlet * 10) + '%;background:' + niveau.farve + '"></div>';
    html += '</div>';
    html += '<span class="assess-mini-score">' + samlet + '/10</span>';
    html += '<span class="assess-mini-niveau" style="color:' + niveau.farve + '">' + niveau.label + '</span>';
    html += '</div>';
    el.innerHTML = html;
  }

  function beregnDimScore(key) {
    var s = assessmentScores[key];
    var vinkelAvg = 0;
    for (var i = 0; i < s.vinkler.length; i++) vinkelAvg += s.vinkler[i];
    vinkelAvg = vinkelAvg / s.vinkler.length;
    return Math.round((s.generelt + vinkelAvg) / 2 * 10) / 10;
  }

  function saveAssessmentResult() {
    var result = { dato: new Date().toISOString(), scores: {} };
    ASSESSMENT_KEYS.forEach(function(key) {
      result.scores[key] = {
        generelt: assessmentScores[key].generelt,
        vinkler: assessmentScores[key].vinkler.slice(),
        samlet: beregnDimScore(key)
      };
    });
    var historik = getAssessmentHistorik();
    historik.push(result);
    saveAssessmentHistorik(historik);
  }

  // ── Resultat-side med radar-chart og analyse ──
  function renderResultat() {
    var container = document.getElementById('resultatContent');
    if (!container) return;
    var perspektiv = getDataPerspektiv();

    // Beregn scores
    var dimScores = [];
    ASSESSMENT_KEYS.forEach(function(key) {
      dimScores.push({ key: key, score: beregnDimScore(key), data: ASSESSMENT_DATA[key] });
    });

    var html = '';

    // ── Radar-chart SVG ──
    html += '<div class="resultat-radar-wrap">';
    html += buildRadarChart(dimScores);
    html += '</div>';

    // ── Sorteret bar-chart ──
    var sorted = dimScores.slice().sort(function(a, b) { return a.score - b.score; });

    html += '<div class="resultat-bars">';
    html += '<h3 class="resultat-section-title">Dine 7 dimensioner</h3>';
    sorted.forEach(function(d) {
      var niveau = getNiveau(d.score);
      html += '<div class="resultat-bar-item">';
      html += '<div class="resultat-bar-header">';
      html += '<span class="resultat-bar-ikon">' + d.data.ikon + '</span>';
      html += '<span class="resultat-bar-name">' + d.data.titel + '</span>';
      html += '<span class="resultat-bar-score" style="color:' + niveau.farve + '">' + d.score + '</span>';
      html += '</div>';
      html += '<div class="resultat-bar-track"><div class="resultat-bar-fill" style="width:' + (d.score * 10) + '%;background:' + niveau.farve + '"></div></div>';
      html += '</div>';
    });
    html += '</div>';

    // ── Analyse: Top udfordringer og sammenhænge ──
    var top3 = sorted.slice(0, 3);
    html += '<div class="resultat-analyse">';
    html += '<h3 class="resultat-section-title">Analyse af dine udfordringer</h3>';
    html += '<p class="resultat-analyse-intro">Baseret på dine svar ser vi de stærkeste udfordringer her — og hvordan de påvirker hinanden:</p>';

    top3.forEach(function(d) {
      var niveau = getNiveau(d.score);
      var anbefaling = ASSESSMENT_ANBEFALINGER[d.key];
      var niveauKey = d.score <= 4 ? 'lav' : (d.score <= 7 ? 'middel' : 'hoej');

      html += '<div class="resultat-analyse-card">';
      html += '<div class="resultat-analyse-header" style="border-left: 4px solid ' + niveau.farve + '">';
      html += '<span class="resultat-analyse-ikon">' + d.data.ikon + '</span>';
      html += '<div><strong>' + d.data.titel + '</strong><span class="resultat-analyse-score" style="color:' + niveau.farve + '"> — ' + d.score + '/10 (' + niveau.label + ')</span></div>';
      html += '</div>';
      html += '<p class="resultat-analyse-tekst">' + anbefaling[niveauKey] + '</p>';

      // Vis sammenhænge med andre lave scores
      var sammenhaenge = findRelevanteSammenhaenge(d.key, top3, perspektiv);
      if (sammenhaenge.length > 0) {
        html += '<div class="resultat-sammenhaeng">';
        html += '<p class="resultat-sammenhaeng-label">↔ Sammenhæng med dine andre udfordringer:</p>';
        sammenhaenge.forEach(function(s) {
          html += '<p class="resultat-sammenhaeng-tekst">' + s + '</p>';
        });
        html += '</div>';
      }
      html += '</div>';
    });
    html += '</div>';

    // ── Prioriteret handlingsplan ──
    html += '<div class="resultat-handlingsplan">';
    html += '<h3 class="resultat-section-title">Din prioriterede handlingsplan</h3>';
    html += '<p class="resultat-handlingsplan-intro">Start her — det vil have størst effekt på tværs af hele dit billede:</p>';

    var topKey = top3[0].key;
    html += '<div class="resultat-prioritet">';
    html += '<span class="resultat-prioritet-nr">1</span>';
    html += '<div class="resultat-prioritet-tekst">';
    html += '<strong>' + top3[0].data.titel + '</strong> — dette område trækker mest ned i dit samlede billede.';
    // Link til relevante øvelser
    var relevanteOevelser = findRelevanteOevelser(topKey);
    if (relevanteOevelser.length > 0) {
      html += '<div class="resultat-oevelser-links">';
      html += '<span>Prøv: </span>';
      relevanteOevelser.forEach(function(o, idx) {
        html += '<button class="resultat-oevelse-link" data-goto-oevelse="' + idx + '">' + o + '</button>';
      });
      html += '</div>';
    }
    html += '</div></div>';

    if (top3.length > 1) {
      html += '<div class="resultat-prioritet">';
      html += '<span class="resultat-prioritet-nr">2</span>';
      html += '<div class="resultat-prioritet-tekst">';
      html += '<strong>' + top3[1].data.titel + '</strong> — styrk dette område for at løfte flere dimensioner samtidig.';
      html += '</div></div>';
    }
    html += '</div>';

    // ── Samlet score circle ──
    var totalAvg = 0;
    dimScores.forEach(function(d) { totalAvg += d.score; });
    totalAvg = Math.round(totalAvg / dimScores.length * 10) / 10;
    var totalNiveau = getNiveau(totalAvg);

    html += '<div class="resultat-samlet">';
    html += '<div class="resultat-samlet-circle" style="border-color:' + totalNiveau.farve + '">';
    html += '<span class="resultat-samlet-score">' + totalAvg + '</span>';
    html += '<span class="resultat-samlet-label">/ 10</span>';
    html += '</div>';
    html += '<p class="resultat-samlet-niveau" style="color:' + totalNiveau.farve + '">' + totalNiveau.label + '</p>';
    html += '<p class="resultat-samlet-tekst">Dit samlede billede</p>';
    html += '</div>';

    // ── Knapper ──
    html += '<div class="resultat-actions">';
    var historik = getAssessmentHistorik();
    if (historik.length > 1) {
      html += '<button class="assess-btn assess-btn-next" id="resultatHistorik">Se din udvikling over tid</button>';
    }
    html += '<button class="assess-btn assess-btn-back" id="resultatTilbage">Tilbage til forsiden</button>';
    html += '</div>';

    container.innerHTML = html;

    // Bind events
    var histBtn = document.getElementById('resultatHistorik');
    if (histBtn) histBtn.addEventListener('click', function() {
      renderHistorik();
      navigateTo('historik');
    });
    var tilbageBtn = document.getElementById('resultatTilbage');
    if (tilbageBtn) tilbageBtn.addEventListener('click', function() { navigateTo('hjem'); });
  }

  function buildRadarChart(dimScores) {
    var cx = 200, cy = 200, r = 150;
    var n = dimScores.length;
    var svg = '<svg viewBox="0 0 400 400" class="resultat-radar-svg">';

    // Baggrundscirkler
    for (var ring = 2; ring <= 10; ring += 2) {
      var rr = r * ring / 10;
      svg += '<circle cx="' + cx + '" cy="' + cy + '" r="' + rr + '" fill="none" stroke="var(--primary)" opacity="0.1" stroke-width="1"/>';
    }

    // Akser + labels
    var points = [];
    for (var i = 0; i < n; i++) {
      var angle = -Math.PI / 2 + (2 * Math.PI * i / n);
      var px = cx + r * Math.cos(angle);
      var py = cy + r * Math.sin(angle);
      points.push({ x: px, y: py, angle: angle });
      svg += '<line x1="' + cx + '" y1="' + cy + '" x2="' + px + '" y2="' + py + '" stroke="var(--primary)" opacity="0.15" stroke-width="1"/>';

      // Label
      var lx = cx + (r + 28) * Math.cos(angle);
      var ly = cy + (r + 28) * Math.sin(angle);
      svg += '<text x="' + lx + '" y="' + (ly + 4) + '" text-anchor="middle" font-size="11" font-family="Georgia,serif" fill="var(--primary)">' + dimScores[i].data.ikon + '</text>';
    }

    // Data-polygon
    var dataPoints = [];
    for (var j = 0; j < n; j++) {
      var val = dimScores[j].score / 10;
      var a2 = -Math.PI / 2 + (2 * Math.PI * j / n);
      dataPoints.push((cx + r * val * Math.cos(a2)) + ',' + (cy + r * val * Math.sin(a2)));
    }
    svg += '<polygon points="' + dataPoints.join(' ') + '" fill="var(--primary)" fill-opacity="0.15" stroke="var(--primary)" stroke-width="2"/>';

    // Data-punkter med farve
    for (var k = 0; k < n; k++) {
      var val2 = dimScores[k].score / 10;
      var a3 = -Math.PI / 2 + (2 * Math.PI * k / n);
      var dpx = cx + r * val2 * Math.cos(a3);
      var dpy = cy + r * val2 * Math.sin(a3);
      var niv = getNiveau(dimScores[k].score);
      svg += '<circle cx="' + dpx + '" cy="' + dpy + '" r="6" fill="' + niv.farve + '" stroke="#fff" stroke-width="2"/>';
    }

    svg += '</svg>';
    return svg;
  }

  function findRelevanteSammenhaenge(key, top3, perspektiv) {
    var result = [];
    var sammenhaenge = D_SAMMENHAENGE();
    top3.forEach(function(d) {
      if (d.key === key) return;
      var pairKey = key + '-' + d.key;
      var pairKeyAlt = d.key + '-' + key;
      var tekst = sammenhaenge[pairKey] || sammenhaenge[pairKeyAlt];
      if (tekst && tekst[perspektiv]) {
        // Tag kun de første 2 sætninger
        var sætninger = tekst[perspektiv].split('. ');
        result.push(sætninger.slice(0, 2).join('. ') + '.');
      }
    });
    return result;
  }

  function findRelevanteOevelser(key) {
    var oevelser = D_OEVELSER();
    var result = [];
    for (var i = 0; i < oevelser.length && result.length < 3; i++) {
      if (oevelser[i].cirkel === key) {
        result.push(oevelser[i].titel);
      }
    }
    return result;
  }

  // ── Historik / tidslinje ──
  function renderHistorik() {
    var container = document.getElementById('historikContent');
    if (!container) return;
    var historik = getAssessmentHistorik();
    if (historik.length === 0) {
      container.innerHTML = '<p class="historik-empty">Du har ikke lavet nogen vurderinger endnu.</p>';
      return;
    }

    var html = '';

    // Udviklingsgraf (simpel linjegraf med SVG)
    if (historik.length > 1) {
      html += '<div class="historik-graf-wrap">';
      html += '<h3 class="resultat-section-title">Udvikling over tid</h3>';
      html += buildHistorikGraf(historik);
      html += '<div class="historik-graf-legend">';
      ASSESSMENT_KEYS.forEach(function(key) {
        html += '<span class="historik-legend-item">' + ASSESSMENT_DATA[key].ikon + ' ' + ASSESSMENT_DATA[key].titel + '</span>';
      });
      html += '</div>';
      html += '</div>';

      // Ændringer siden sidst
      var seneste = historik[historik.length - 1];
      var forrige = historik[historik.length - 2];
      html += '<div class="historik-aendringer">';
      html += '<h3 class="resultat-section-title">Ændringer siden sidst</h3>';
      ASSESSMENT_KEYS.forEach(function(key) {
        var nu = seneste.scores[key].samlet;
        var foer = forrige.scores[key].samlet;
        var diff = Math.round((nu - foer) * 10) / 10;
        if (diff === 0) return;
        var cls = diff > 0 ? 'historik-change-pos' : 'historik-change-neg';
        var arrow = diff > 0 ? '↑' : '↓';
        html += '<div class="historik-change-item ' + cls + '">';
        html += '<span>' + ASSESSMENT_DATA[key].ikon + ' ' + ASSESSMENT_DATA[key].titel + '</span>';
        html += '<span>' + foer + ' → ' + nu + ' <strong>' + arrow + ' ' + Math.abs(diff) + '</strong></span>';
        html += '</div>';
      });
      html += '</div>';
    }

    // Tidligere vurderinger
    html += '<div class="historik-entries">';
    html += '<h3 class="resultat-section-title">Dine vurderinger</h3>';
    for (var i = historik.length - 1; i >= 0; i--) {
      var entry = historik[i];
      var dato = new Date(entry.dato);
      var datoStr = dato.getDate() + '/' + (dato.getMonth() + 1) + '-' + dato.getFullYear();
      var samletAvg = 0;
      ASSESSMENT_KEYS.forEach(function(key) { samletAvg += entry.scores[key].samlet; });
      samletAvg = Math.round(samletAvg / ASSESSMENT_KEYS.length * 10) / 10;
      var niveau = getNiveau(samletAvg);

      html += '<div class="historik-entry">';
      html += '<div class="historik-entry-header">';
      html += '<span class="historik-entry-dato">' + datoStr + '</span>';
      html += '<span class="historik-entry-score" style="color:' + niveau.farve + '">' + samletAvg + '/10</span>';
      html += '</div>';
      html += '<div class="historik-entry-bars">';
      ASSESSMENT_KEYS.forEach(function(key) {
        var s = entry.scores[key].samlet;
        var n = getNiveau(s);
        html += '<div class="historik-mini-bar" title="' + ASSESSMENT_DATA[key].titel + ': ' + s + '">';
        html += '<div class="historik-mini-fill" style="width:' + (s * 10) + '%;background:' + n.farve + '"></div>';
        html += '</div>';
      });
      html += '</div>';
      html += '</div>';
    }
    html += '</div>';

    // Ny vurdering knap
    html += '<div class="resultat-actions">';
    html += '<button class="assess-btn assess-btn-next" id="historikNyVurdering">Tag ny vurdering</button>';
    html += '<button class="assess-btn assess-btn-back" id="historikTilbage">Tilbage til forsiden</button>';
    html += '</div>';

    container.innerHTML = html;

    document.getElementById('historikNyVurdering').addEventListener('click', startAssessment);
    document.getElementById('historikTilbage').addEventListener('click', function() { navigateTo('hjem'); });
  }

  function buildHistorikGraf(historik) {
    var w = 360, h = 200, pad = 30;
    var n = historik.length;
    var colors = ['var(--primary)', 'var(--sage)', 'var(--amber)', 'var(--rose)', '#8B6B4B', '#5B7B8B', '#6B5B8B'];

    var svg = '<svg viewBox="0 0 ' + w + ' ' + h + '" class="historik-graf-svg">';

    // Y-akse linjer
    for (var y = 0; y <= 10; y += 2) {
      var yy = pad + (h - 2 * pad) * (1 - y / 10);
      svg += '<line x1="' + pad + '" y1="' + yy + '" x2="' + (w - pad) + '" y2="' + yy + '" stroke="#ddd" stroke-width="0.5"/>';
      svg += '<text x="' + (pad - 8) + '" y="' + (yy + 4) + '" font-size="9" fill="#999" text-anchor="end">' + y + '</text>';
    }

    // En linje per dimension
    ASSESSMENT_KEYS.forEach(function(key, ki) {
      var pathD = '';
      for (var i = 0; i < n; i++) {
        var x = pad + (w - 2 * pad) * i / Math.max(n - 1, 1);
        var val = historik[i].scores[key].samlet;
        var yPos = pad + (h - 2 * pad) * (1 - val / 10);
        pathD += (i === 0 ? 'M' : 'L') + x + ',' + yPos;
      }
      svg += '<path d="' + pathD + '" fill="none" stroke="' + colors[ki] + '" stroke-width="2" opacity="0.7"/>';
      // Dots
      for (var j = 0; j < n; j++) {
        var dx = pad + (w - 2 * pad) * j / Math.max(n - 1, 1);
        var dval = historik[j].scores[key].samlet;
        var dy = pad + (h - 2 * pad) * (1 - dval / 10);
        svg += '<circle cx="' + dx + '" cy="' + dy + '" r="3" fill="' + colors[ki] + '"/>';
      }
    });

    svg += '</svg>';
    return svg;
  }

  // ── Gave (Gift) view ──
  var GAVE_SVG = [
    // 1: Rodfæstet træ — grounding, fundament
    '<svg viewBox="0 0 200 140" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M100 120 C100 120 100 60 100 45" stroke="#6B2D5B" stroke-width="2.5" stroke-linecap="round"/><path d="M100 75 C85 60 65 55 55 60" stroke="#6B2D5B" stroke-width="2" stroke-linecap="round"/><path d="M100 60 C115 48 130 50 135 58" stroke="#6B2D5B" stroke-width="2" stroke-linecap="round"/><path d="M100 45 C90 30 80 20 85 12" stroke="#6B2D5B" stroke-width="1.5" stroke-linecap="round"/><path d="M100 45 C110 32 120 25 118 15" stroke="#6B2D5B" stroke-width="1.5" stroke-linecap="round"/><circle cx="85" cy="12" r="8" fill="#f3e8ef" stroke="#6B2D5B" stroke-width="1.2"/><circle cx="118" cy="15" r="6" fill="#f3e8ef" stroke="#6B2D5B" stroke-width="1.2"/><circle cx="55" cy="58" r="10" fill="#f3e8ef" stroke="#6B2D5B" stroke-width="1.2"/><circle cx="135" cy="56" r="7" fill="#f3e8ef" stroke="#6B2D5B" stroke-width="1.2"/><path d="M100 120 C95 130 80 135 70 132" stroke="#D4A373" stroke-width="1.5" stroke-linecap="round" opacity="0.6"/><path d="M100 120 C105 128 115 133 125 130" stroke="#D4A373" stroke-width="1.5" stroke-linecap="round" opacity="0.6"/><path d="M100 120 C98 132 100 138 100 140" stroke="#D4A373" stroke-width="1.5" stroke-linecap="round" opacity="0.6"/></svg>',
    // 2: Bølger — nervesystemets rytme
    '<svg viewBox="0 0 200 100" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10 50 C30 30 50 30 70 50 C90 70 110 70 130 50 C150 30 170 30 190 50" stroke="#6B2D5B" stroke-width="2.5" stroke-linecap="round" fill="none"/><path d="M10 50 C30 38 50 38 70 50 C90 62 110 62 130 50 C150 38 170 38 190 50" stroke="#D4A373" stroke-width="1.5" stroke-linecap="round" fill="none" opacity="0.5"/><circle cx="70" cy="50" r="3" fill="#6B2D5B" opacity="0.4"/><circle cx="130" cy="50" r="3" fill="#6B2D5B" opacity="0.4"/></svg>',
    // 3: Hænder / forbindelse — relation
    '<svg viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M50 80 C50 60 65 45 85 45 C95 45 100 50 100 50" stroke="#6B2D5B" stroke-width="2" stroke-linecap="round"/><path d="M150 80 C150 60 135 45 115 45 C105 45 100 50 100 50" stroke="#6B2D5B" stroke-width="2" stroke-linecap="round"/><circle cx="100" cy="50" r="4" fill="#f3e8ef" stroke="#6B2D5B" stroke-width="1.5"/><path d="M70 80 C70 65 80 55 90 58" stroke="#D4A373" stroke-width="1.2" stroke-linecap="round" opacity="0.6"/><path d="M130 80 C130 65 120 55 110 58" stroke="#D4A373" stroke-width="1.2" stroke-linecap="round" opacity="0.6"/><circle cx="85" cy="45" r="2" fill="#6B2D5B" opacity="0.3"/><circle cx="115" cy="45" r="2" fill="#6B2D5B" opacity="0.3"/></svg>',
    // 4: Kompas — retning, formål
    '<svg viewBox="0 0 200 140" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="100" cy="70" r="40" stroke="#6B2D5B" stroke-width="2"/><circle cx="100" cy="70" r="3" fill="#6B2D5B"/><path d="M100 70 L100 38" stroke="#6B2D5B" stroke-width="2.5" stroke-linecap="round"/><path d="M100 70 L120 85" stroke="#D4A373" stroke-width="2" stroke-linecap="round" opacity="0.7"/><circle cx="100" cy="30" r="2" fill="#6B2D5B" opacity="0.4"/><circle cx="100" cy="110" r="2" fill="#6B2D5B" opacity="0.4"/><circle cx="60" cy="70" r="2" fill="#6B2D5B" opacity="0.4"/><circle cx="140" cy="70" r="2" fill="#6B2D5B" opacity="0.4"/></svg>',
    // 5: Spirende frø — vækst, potentiale
    '<svg viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M100 100 C100 100 100 65 100 55" stroke="#6B2D5B" stroke-width="2" stroke-linecap="round"/><path d="M100 55 C90 40 80 30 85 20" stroke="#6B2D5B" stroke-width="1.8" stroke-linecap="round"/><path d="M100 55 C110 42 115 30 110 22" stroke="#6B2D5B" stroke-width="1.8" stroke-linecap="round"/><ellipse cx="85" cy="18" rx="8" ry="5" transform="rotate(-20 85 18)" fill="#f3e8ef" stroke="#6B2D5B" stroke-width="1.2"/><ellipse cx="110" cy="20" rx="7" ry="4.5" transform="rotate(15 110 20)" fill="#f3e8ef" stroke="#6B2D5B" stroke-width="1.2"/><ellipse cx="100" cy="102" rx="12" ry="5" fill="none" stroke="#D4A373" stroke-width="1.2" opacity="0.5"/></svg>'
  ];

  function getGaveData() {
    var persp = aktivPerspektiv;
    if (isEn()) {
      if (persp === 'leder') {
        return {
          tag: 'Your gift',
          title: 'The Quiet Foundation',
          author: 'A letter from Anne Marie Clement',
          sections: [
            {
              heading: 'What No One Told You About Leadership',
              text: '<p>There is something no leadership course prepared you for. Not the strategy meetings, not the difficult conversations, not even the loneliness that sometimes comes with responsibility. It is something much more fundamental: the way your own nervous system sets the tone for everyone around you.</p><p>I have worked with leaders for over twenty years. Not as a management consultant with frameworks and models, but as a psychotherapist who sees what happens beneath the surface. And what I see, again and again, is this: you carry more than you realize. Not just tasks and deadlines, but an invisible emotional weight — your team\'s uncertainty, the organization\'s expectations, the gap between what is said and what is felt.</p><p>This letter is not advice. It is an invitation to pause and look at something you may have been too busy to notice. Something that could change not just how you lead — but how you feel while doing it.</p>'
            },
            {
              heading: 'Your Body Already Knows',
              text: '<p>Before any conflict becomes visible, your body registers it. The slight tension in your shoulders before a tough meeting. The shallow breathing when you open yet another email that demands something. The tiredness that no weekend quite resolves.</p><p>These are not signs of weakness. They are your nervous system doing exactly what it was designed to do: reading your environment and responding. The question is not whether you react — every human does. The question is whether you notice the reaction early enough to choose your response.</p><p>Most leaders I work with have spent years overriding these signals. Pushing through. Being strong. And the cost is subtle but real: decisions made from tension rather than clarity. Conversations had from depletion rather than presence. A slow erosion of the very energy that makes you effective.</p>'
            },
            {
              heading: 'The Ripple You Cannot See',
              text: '<p>Here is what fascinates me about nervous systems in organizations: they are contagious. When you walk into a room regulated — grounded, present, breathing — something shifts in the people around you. Not because you said the right thing, but because their nervous systems co-regulate with yours.</p><p>The reverse is also true. When you lead from activation — rushed, tense, survival mode — your team absorbs that frequency. Not consciously. Not willingly. But inevitably. Children do it with parents. Employees do it with leaders. It is one of the most powerful and least discussed aspects of leadership.</p><p>This is not about being calm all the time. That would be neither possible nor honest. It is about knowing where you are on your own inner ladder — and having ways to shift when you need to. Not for performance. For genuine presence.</p>'
            },
            {
              heading: 'The Permission You Might Need',
              text: '<p>In my experience, what leaders need most is not another tool. It is permission. Permission to acknowledge that this work is hard in ways that are rarely named. Permission to take care of the instrument — yourself — that everything else depends on.</p><p>I have watched leaders transform their teams not by changing strategy but by changing their own relationship with stress. By learning to recognize when they have left their window of tolerance. By practicing, quietly and without fanfare, the art of returning to themselves.</p><p>It is not dramatic work. It does not make headlines. But it is the kind of work that changes the temperature of a room. That makes people feel safe enough to be honest. That creates the conditions where real collaboration — not just polite agreement — becomes possible.</p>'
            },
            {
              heading: 'An Invitation, Not an Instruction',
              text: '<p>I did not write this as a program or a method. I wrote it because I believe you deserve to hear something that the leadership world rarely says: your wellbeing is not separate from your leadership. It is the foundation of it.</p><p>The exercises and reflections in this app are built from that belief. They are not about fixing something broken. They are about remembering something that was always there: your body\'s intelligence, your nervous system\'s wisdom, your capacity to lead from a place that is steady rather than simply strong.</p><p>Start where you are. Start with one breath before a meeting. One moment of noticing your feet on the floor. One honest check-in with yourself before you check in with your team. These small moments are not small at all. They are the quiet foundation of everything you build.</p><p>With warmth,<br><em>Anne Marie Clement</em></p>'
            }
          ]
        };
      } else {
        return {
          tag: 'Your gift',
          title: 'The Quiet Foundation',
          author: 'A letter from Anne Marie Clement',
          sections: [
            {
              heading: 'Something You Were Never Taught',
              text: '<p>Somewhere along the way, you learned how to work. How to meet deadlines, answer emails, navigate office politics, and show up even on the days when everything in you wanted to stay home. You learned how to function.</p><p>But no one ever taught you how to be well while doing it. Not just "not sick" — genuinely well. Present in your body. Connected to your own signals. Able to notice when something is off before it becomes a crisis.</p><p>I have spent over twenty years working with people\'s nervous systems. Not in a clinical, distant way — but sitting with real people in real situations. People who carry more than they show. People who have forgotten what rest actually feels like. People whose bodies keep score of every pushed-through afternoon, every swallowed frustration, every too-short lunch break.</p><p>This letter is for you. Not as advice, but as a different kind of conversation — one that starts from the inside.</p>'
            },
            {
              heading: 'Your Body Is Always Listening',
              text: '<p>Right now, as you read this, your nervous system is doing thousands of things you will never notice. Regulating your heartbeat. Scanning for safety. Processing the emotional temperature of your last interaction. It does not take breaks. It does not wait for weekends.</p><p>And it remembers everything. Not in the way your mind remembers — with stories and explanations — but in patterns. Tension patterns. Breathing patterns. The way your shoulders creep upward during certain kinds of meetings. The way your jaw tightens when a particular name appears in your inbox.</p><p>These patterns are not problems. They are information. Your body telling you something that your busy mind might be too occupied to hear. And the beautiful thing is: you do not need to fix them. You just need to start noticing them.</p>'
            },
            {
              heading: 'The Space Between Stimulus and Response',
              text: '<p>Viktor Frankl wrote that between stimulus and response, there is a space — and in that space lies our freedom. I think about this often in my work, because what I see, over and over, is how small that space becomes when we are dysregulated.</p><p>When your nervous system is activated — when you are in what I call the amber or red zone — that space nearly disappears. You react instead of respond. You say the thing you regret. You agree to something you do not have capacity for. You snap at the person who least deserves it.</p><p>This is not a character flaw. It is physiology. And the remarkable thing about physiology is that it can be worked with. Not through willpower, but through gentle, repeated practice. Through learning to recognize where you are before you act from where you are.</p>'
            },
            {
              heading: 'Why This Matters More Than You Think',
              text: '<p>We live in a culture that celebrates pushing through. That admires people who can "handle it." That treats exhaustion as a badge of honor and boundaries as a sign of not being committed enough.</p><p>But here is what I know after two decades of working with human nervous systems: the cost is real. It shows up in your sleep. In your relationships. In that vague feeling that something is missing even when everything looks fine from the outside. In the Sunday evening dread that has become so familiar you have stopped questioning it.</p><p>Your nervous system is not asking for a revolution. It is asking for attention. For small moments of care woven into your ordinary day. For the dignity of being listened to by the person it belongs to — you.</p>'
            },
            {
              heading: 'Where You Begin Is Where You Are',
              text: '<p>I built this app from the same place I write this letter: from a belief that your body holds wisdom that deserves to be heard. The exercises here are not about performance or optimization. They are about reconnection. About building a relationship with the part of you that has been carrying everything without being asked how it is doing.</p><p>You do not need to start big. One breath taken consciously. One moment where you notice your feet on the floor. One pause between finishing one task and starting the next. These are not small things. In the language of the nervous system, they are profound.</p><p>You have already taken a step by being here. That matters more than you might think. Not because this app will change your life overnight, but because it means something in you is ready to listen.</p><p>With warmth,<br><em>Anne Marie Clement</em></p>'
            }
          ]
        };
      }
    } else {
      if (persp === 'leder') {
        return {
          tag: 'Din gave',
          title: 'Det stille fundament',
          author: 'Et brev fra Anne Marie Clement',
          sections: [
            {
              heading: 'Det ingen fortalte dig om ledelse',
              text: '<p>Der er noget, intet ledelseskursus forberedte dig på. Ikke strategimøderne, ikke de svære samtaler, ikke engang den ensomhed, der nogle gange følger med ansvaret. Det er noget langt mere grundlæggende: den måde dit eget nervesystem sætter tonen for alle omkring dig.</p><p>Jeg har arbejdet med ledere i over tyve år. Ikke som managementkonsulent med rammer og modeller, men som psykoterapeut, der ser hvad der sker under overfladen. Og det jeg ser, igen og igen, er dette: du bærer mere, end du er klar over. Ikke bare opgaver og deadlines, men en usynlig følelsesmæssig vægt — dit teams usikkerhed, organisationens forventninger, afstanden mellem det der siges og det der mærkes.</p><p>Dette brev er ikke rådgivning. Det er en invitation til at stoppe op og se på noget, du måske har været for travl til at lægge mærke til. Noget der kan forandre ikke bare hvordan du leder — men hvordan du har det, mens du gør det.</p>'
            },
            {
              heading: 'Din krop ved det allerede',
              text: '<p>Før nogen konflikt bliver synlig, registrerer din krop den. Den lille spænding i skuldrene inden et svært møde. Den overfladiske vejrtrækning, når du åbner endnu en mail, der kræver noget. Den træthed, som ingen weekend helt løser.</p><p>Det er ikke tegn på svaghed. Det er dit nervesystem, der gør præcis det, det er designet til: aflæser dit miljø og reagerer. Spørgsmålet er ikke om du reagerer — det gør ethvert menneske. Spørgsmålet er, om du opdager reaktionen tidligt nok til at vælge dit svar.</p><p>De fleste ledere, jeg arbejder med, har brugt år på at tilsidesætte disse signaler. Presse igennem. Være stærke. Og prisen er subtil men reel: beslutninger truffet fra spænding i stedet for klarhed. Samtaler ført fra udmattelse i stedet for nærvær. En langsom erosion af netop den energi, der gør dig effektiv.</p>'
            },
            {
              heading: 'Den krusning du ikke kan se',
              text: '<p>Her er det, der fascinerer mig ved nervesystemer i organisationer: de smitter. Når du træder ind i et lokale reguleret — rodfæstet, nærværende, åndende — sker der noget med menneskene omkring dig. Ikke fordi du sagde det rigtige, men fordi deres nervesystemer co-regulerer med dit.</p><p>Det modsatte er også sandt. Når du leder fra aktivering — forhastet, anspændt, i overlevelsestilstand — absorberer dit team den frekvens. Ikke bevidst. Ikke frivilligt. Men uundgåeligt. Børn gør det med forældre. Medarbejdere gør det med ledere. Det er et af de mest kraftfulde og mindst omtalte aspekter af ledelse.</p><p>Det handler ikke om at være rolig hele tiden. Det ville hverken være muligt eller ærligt. Det handler om at vide, hvor du er på din egen indre trappe — og have måder at skifte, når du har brug for det. Ikke for præstation. For ægte nærvær.</p>'
            },
            {
              heading: 'Den tilladelse du måske har brug for',
              text: '<p>I min erfaring er det, ledere har mest brug for, ikke endnu et redskab. Det er tilladelse. Tilladelse til at anerkende, at dette arbejde er svært på måder, der sjældent bliver benævnt. Tilladelse til at passe på instrumentet — dig selv — som alt andet afhænger af.</p><p>Jeg har set ledere transformere deres teams, ikke ved at ændre strategi, men ved at ændre deres eget forhold til stress. Ved at lære at genkende, hvornår de har forladt deres tolerancevindue. Ved at praktisere, stille og uden fanfare, kunsten at vende tilbage til sig selv.</p><p>Det er ikke dramatisk arbejde. Det skaber ikke overskrifter. Men det er den slags arbejde, der ændrer temperaturen i et rum. Der får mennesker til at føle sig trygge nok til at være ærlige. Der skaber betingelserne, hvor ægte samarbejde — ikke bare høflig enighed — bliver muligt.</p>'
            },
            {
              heading: 'En invitation, ikke en instruktion',
              text: '<p>Jeg har ikke skrevet dette som et program eller en metode. Jeg skrev det, fordi jeg tror, du fortjener at høre noget, som ledelsesverdenen sjældent siger: din trivsel er ikke adskilt fra dit lederskab. Den er fundamentet for det.</p><p>Øvelserne og refleksionerne i denne app er bygget på den overbevisning. De handler ikke om at fikse noget, der er i stykker. De handler om at huske noget, der altid har været der: din krops intelligens, dit nervesystems visdom, din evne til at lede fra et sted, der er støt snarere end blot stærkt.</p><p>Begynd hvor du er. Begynd med ét åndedrag før et møde. Ét øjeblik, hvor du mærker dine fødder mod gulvet. Ét ærligt tjek ind med dig selv, før du tjekker ind med dit team. De små øjeblikke er slet ikke små. De er det stille fundament under alt det, du bygger.</p><p>Med varme,<br><em>Anne Marie Clement</em></p>'
            }
          ]
        };
      } else {
        return {
          tag: 'Din gave',
          title: 'Det stille fundament',
          author: 'Et brev fra Anne Marie Clement',
          sections: [
            {
              heading: 'Noget du aldrig blev undervist i',
              text: '<p>Et sted undervejs lærte du at arbejde. At overholde deadlines, besvare mails, navigere kontorpolitik og møde op selv på de dage, hvor alt i dig havde lyst til at blive hjemme. Du lærte at fungere.</p><p>Men ingen lærte dig nogensinde, hvordan du kan have det godt, mens du gør det. Ikke bare "ikke syg" — oprigtigt vel. Til stede i din krop. Forbundet med dine egne signaler. I stand til at mærke, når noget er galt, før det bliver en krise.</p><p>Jeg har brugt over tyve år på at arbejde med menneskers nervesystemer. Ikke på en klinisk, distanceret måde — men siddende med rigtige mennesker i rigtige situationer. Mennesker, der bærer mere, end de viser. Mennesker, der har glemt, hvordan hvile egentlig føles. Mennesker, hvis kroppe holder regnskab med hver gennemtvunget eftermiddag, hver slugt frustration, hver for-kort frokostpause.</p><p>Dette brev er til dig. Ikke som råd, men som en anden slags samtale — en der begynder indefra.</p>'
            },
            {
              heading: 'Din krop lytter altid',
              text: '<p>Lige nu, mens du læser dette, udfører dit nervesystem tusindvis af ting, du aldrig vil bemærke. Regulerer din hjerterytme. Scanner for sikkerhed. Bearbejder den følelsesmæssige temperatur fra din seneste interaktion. Det holder ikke pauser. Det venter ikke på weekender.</p><p>Og det husker alt. Ikke på den måde din bevidste hjerne husker — med historier og forklaringer — men i mønstre. Spændingsmønstre. Vejrtrækningsmønstre. Den måde dine skuldre kryber opad under bestemte slags møder. Den måde din kæbe strammer, når et bestemt navn dukker op i din indbakke.</p><p>Disse mønstre er ikke problemer. De er information. Din krop, der fortæller dig noget, som din travle bevidsthed måske er for optaget til at høre. Og det smukke er: du behøver ikke at fixe dem. Du skal bare begynde at lægge mærke til dem.</p>'
            },
            {
              heading: 'Rummet mellem stimulus og respons',
              text: '<p>Viktor Frankl skrev, at mellem stimulus og respons er der et rum — og i det rum ligger vores frihed. Jeg tænker ofte på dette i mit arbejde, for det jeg ser, igen og igen, er hvor lille det rum bliver, når vi er dysregulerede.</p><p>Når dit nervesystem er aktiveret — når du er i det, jeg kalder den gule eller røde zone — forsvinder det rum næsten. Du reagerer i stedet for at svare. Du siger det, du fortryder. Du siger ja til noget, du ikke har kapacitet til. Du snapper af den person, der mindst fortjener det.</p><p>Det er ikke en karakterbrist. Det er fysiologi. Og det bemærkelsesværdige ved fysiologi er, at der kan arbejdes med den. Ikke gennem viljestyrke, men gennem blid, gentaget praksis. Gennem at lære at genkende, hvor du er, før du handler fra hvor du er.</p>'
            },
            {
              heading: 'Hvorfor det betyder mere end du tror',
              text: '<p>Vi lever i en kultur, der hylder det at presse igennem. Der beundrer mennesker, der kan "klare det." Der behandler udmattelse som et æresbevis og grænser som tegn på manglende engagement.</p><p>Men her er hvad jeg ved efter to årtiers arbejde med menneskers nervesystemer: prisen er reel. Den viser sig i din søvn. I dine relationer. I den vage fornemmelse af, at noget mangler, selv når alt ser fint ud udefra. I den søndagsaftens-uro, der er blevet så velkendt, at du er holdt op med at stille spørgsmål ved den.</p><p>Dit nervesystem beder ikke om en revolution. Det beder om opmærksomhed. Om små øjeblikke af omsorg vævet ind i din almindelige dag. Om værdigheden i at blive lyttet til af det menneske, det tilhører — dig.</p>'
            },
            {
              heading: 'Hvor du begynder er hvor du er',
              text: '<p>Jeg har bygget denne app fra samme sted, som jeg skriver dette brev: fra en overbevisning om, at din krop rummer en visdom, der fortjener at blive hørt. Øvelserne her handler ikke om præstation eller optimering. De handler om genforbindelse. Om at opbygge et forhold til den del af dig, der har båret alting uden at blive spurgt, hvordan den har det.</p><p>Du behøver ikke starte stort. Ét åndedrag taget bevidst. Ét øjeblik, hvor du mærker dine fødder mod gulvet. Én pause mellem at afslutte én opgave og begynde den næste. Det er ikke små ting. I nervesystemets sprog er de dybsindige.</p><p>Du har allerede taget et skridt ved at være her. Det betyder mere, end du måske tror. Ikke fordi denne app vil forandre dit liv fra den ene dag til den anden, men fordi det betyder, at noget i dig er klar til at lytte.</p><p>Med varme,<br><em>Anne Marie Clement</em></p>'
            }
          ]
        };
      }
    }
  }

  function renderGave() {
    var container = document.getElementById('gaveContent');
    if (!container) return;
    var data = getGaveData();
    var html = '';

    html += '<div class="gave-header">';
    html += '<span class="gave-tag">' + data.tag + '</span>';
    html += '<h1 class="gave-title">' + data.title + '</h1>';
    html += '<p class="gave-author">' + data.author + '</p>';
    html += '</div>';

    for (var i = 0; i < data.sections.length; i++) {
      html += '<div class="gave-illustration">' + GAVE_SVG[i] + '</div>';
      html += '<div class="gave-section">';
      html += '<h2 class="gave-heading">' + data.sections[i].heading + '</h2>';
      html += data.sections[i].text;
      html += '</div>';
    }

    container.innerHTML = html;
  }

  function showGave() {
    renderGave();
    navigateTo('gave');
  }

  // ── Favoritter view ──
  function renderFavoritter() {
    var container = document.getElementById('favoritterContent');
    if (!container) return;
    var fav = getFavoritter();

    if (fav.length === 0) {
      container.innerHTML = '<div class="favoritter-empty">' +
        '<div class="favoritter-empty-icon">' + IKONER.bookmark(32) + '</div>' +
        '<p>' + t('favEmpty') + '</p>' +
        '<p class="favoritter-empty-hint">' + t('favEmptyHint').replace('{icon}', IKONER.bookmark(14)) + '</p>' +
        '</div>';
      return;
    }

    var typeLabels = { oevelse: t('favTypeExercise'), fordybelse: t('favTypeDeepDive'), trappen: t('favTypeLadder'), tema: t('favTypeTheme') };
    var typeIcons = { oevelse: '◎', fordybelse: '◉', trappen: '☰', tema: '◈' };

    var groups = {};
    fav.forEach(function(f) {
      if (!groups[f.type]) groups[f.type] = [];
      groups[f.type].push(f);
    });

    var html = '';
    Object.keys(groups).forEach(function(type) {
      html += '<div class="favoritter-group">';
      html += '<div class="favoritter-group-title"><span class="favoritter-group-icon">' + (typeIcons[type] || '') + '</span> ' + (typeLabels[type] || type).toUpperCase() + '</div>';
      groups[type].forEach(function(f) {
        html += '<div class="favoritter-item" data-fav-type="' + f.type + '" data-fav-id="' + escapeAttr(f.id) + '">' +
          '<div class="favoritter-item-info">' +
          '<div class="favoritter-item-titel">' + f.titel + '</div>' +
          '<div class="favoritter-item-dato">' + t('favSaved') + ' ' + f.dato + '</div>' +
          '</div>' +
          '<button class="favoritter-item-remove" data-fav-type="' + f.type + '" data-fav-id="' + escapeAttr(f.id) + '" title="Fjern">&times;</button>' +
          '</div>';
      });
      html += '</div>';
    });

    container.innerHTML = html;

    // Bind clicks to navigate
    container.querySelectorAll('.favoritter-item').forEach(function(item) {
      item.addEventListener('click', function(e) {
        if (e.target.closest('.favoritter-item-remove')) return;
        var type = this.getAttribute('data-fav-type');
        var id = this.getAttribute('data-fav-id');
        if (type === 'oevelse') { navigateTo('oevelser'); }
        else if (type === 'fordybelse') {
          aktivCirkel = id;
          renderCirkelDetail(id);
          navigateTo('cirkel/' + id);
          setTimeout(function() {
            tabs.forEach(function(t) { t.classList.toggle('active', t.dataset.tab === 'dybde'); });
            tabPanels.forEach(function(p) { p.classList.toggle('active', p.dataset.panel === 'dybde'); });
          }, 100);
        }
        else if (type === 'trappen') { navigateTo('trappen'); }
        else if (type === 'tema') {
          navigateTo('temaer');
          setTimeout(function() { aktivTema = id; visTemaDetalje(id); }, 100);
        }
      });
    });

    // Bind remove buttons
    container.querySelectorAll('.favoritter-item-remove').forEach(function(btn) {
      btn.addEventListener('click', function(e) {
        e.stopPropagation();
        var type = this.getAttribute('data-fav-type');
        var id = this.getAttribute('data-fav-id');
        toggleFavorit(type, id, '');
        renderFavoritter();
        updateFavoritBadge();
      });
    });
  }

  function showFavoritter() {
    renderFavoritter();
    navigateTo('favoritter');
    navItems.forEach(function(item) { item.classList.remove('active'); });
  }

  // ── Hero visibility (for white top-bar icons) ──
  function updateHeroVisibility() {
    var hash = window.location.hash.slice(1) || 'hjem';
    if (hash === 'hjem' || hash === '') {
      document.body.classList.add('hero-visible');
    } else {
      document.body.classList.remove('hero-visible');
    }
  }

  // ── Menu ──
  function renderMenuContent() {
    var rolleText = aktivPerspektiv === 'leder' ? t('roleLeader') : (aktivPerspektiv === 'virksomhed' ? t('roleCompany') : t('roleEmployee'));
    var rolleIcon = aktivPerspektiv === 'leder' ? '◈' : (aktivPerspektiv === 'virksomhed' ? '◆' : '◉');
    var html = '';

    // ── Dit perspektiv ──
    html += '<div class="menu-section">';
    html += '<div class="menu-section-title">' + t('perspectiveTitle') + '</div>';
    html += '<div class="menu-perspektiv">';
    html += '<span class="menu-perspektiv-icon">' + rolleIcon + '</span>';
    html += '<span class="menu-perspektiv-label">' + rolleText.charAt(0).toUpperCase() + rolleText.slice(1) + '</span>';
    html += '</div>';
    html += '<button class="menu-rolle-btn" id="menuRolleSkift">' + t('switchPerspective') + '</button>';
    html += '</div>';

    html += '<div class="menu-divider"></div>';

    // ── Om Anne Marie Clement ──
    html += '<div class="menu-section menu-about-section">';
    html += '<div class="menu-section-title">' + t('aboutTitle') + '</div>';
    html += '<div class="menu-about-photo-wrap"><img src="assets/images/hero.png" alt="Anne Marie Clement" class="menu-about-photo"></div>';
    html += '<p class="menu-about-bio">' + t('aboutBio') + '</p>';
    html += '</div>';

    html += '<div class="menu-divider"></div>';

    // ── Navigation ──
    html += '<div class="menu-section">';
    html += '<div class="menu-section-title">' + t('menuNavTitle') + '</div>';
    html += '<button class="menu-item" data-nav="hjem"><span class="menu-item-icon">◉</span>' + t('menuHome') + '</button>';
    html += '<button class="menu-item" data-nav="trappen"><span class="menu-item-icon">☰</span>' + t('menuLadder') + '</button>';
    html += '<button class="menu-item" data-nav="temaer"><span class="menu-item-icon">◈</span>' + t('menuThemes') + '</button>';
    html += '<button class="menu-item" data-nav="oevelser"><span class="menu-item-icon">◎</span>' + t('menuExercises') + '</button>';
    html += '<button class="menu-item" data-nav="dynamik"><span class="menu-item-icon">⬡</span>' + t('menuDynamik') + '</button>';
    html += '<button class="menu-item menu-item-virksomhed" data-nav="virksomhed"><span class="menu-item-icon">◆</span>' + t('menuCompany') + '</button>';
    var favCount = getFavoritter().length;
    html += '<button class="menu-item menu-item-favoritter" id="menuFavoritter"><span class="menu-item-icon">' + IKONER.bookmark(15) + '</span>' + t('menuFavorites') + ' <span class="menu-favorit-badge" id="favoritBadge" style="' + (favCount > 0 ? '' : 'display:none') + '">' + favCount + '</span></button>';
    html += '</div>';

    html += '<div class="menu-divider"></div>';

    // ── Kontakt ──
    html += '<div class="menu-section">';
    html += '<div class="menu-section-title">' + t('contactTitle') + '</div>';
    html += '<a class="menu-contact-item" href="tel:+4522544542"><span class="menu-contact-icon">✆</span>+45 2254 4542</a>';
    html += '<a class="menu-contact-item" href="mailto:annemarie@annemarieclement.dk"><span class="menu-contact-icon">✉</span>annemarie@annemarieclement.dk</a>';
    html += '<a class="menu-contact-item" href="https://www.linkedin.com/in/annemarie-clement-ba703731" target="_blank" rel="noopener"><span class="menu-contact-icon">in</span>LinkedIn</a>';
    html += '<a class="menu-contact-item" href="https://www.instagram.com/annemarieclement/" target="_blank" rel="noopener"><span class="menu-contact-icon">✦</span>Instagram</a>';
    html += '<a class="menu-contact-item" href="https://annemarieclement.dk" target="_blank" rel="noopener"><span class="menu-contact-icon">⊕</span>' + t('website') + '</a>';
    html += '</div>';

    html += '<div class="menu-divider"></div>';

    // ── Indstillinger ──
    html += '<div class="menu-section">';
    html += '<div class="menu-section-title">' + t('settingsTitle') + '</div>';

    html += '<div class="menu-setting">';
    html += '<div class="menu-setting-row">';
    html += '<div class="menu-setting-info"><span class="menu-setting-name">' + t('settingReminder') + '</span>';
    html += '<span class="menu-setting-desc">' + t('settingReminderDesc') + '</span></div>';
    html += '<label class="menu-toggle"><input type="checkbox" checked data-setting="daglig"><span class="toggle-track"><span class="toggle-thumb"></span></span></label>';
    html += '</div>';
    html += '</div>';

    html += '<div class="menu-setting">';
    html += '<div class="menu-setting-row">';
    html += '<div class="menu-setting-info"><span class="menu-setting-name">' + t('settingMorning') + '</span>';
    html += '<span class="menu-setting-desc">' + t('settingMorningDesc') + '</span></div>';
    html += '<label class="menu-toggle"><input type="checkbox" checked data-setting="morgen"><span class="toggle-track"><span class="toggle-thumb"></span></span></label>';
    html += '</div>';
    html += '</div>';

    html += '<div class="menu-setting">';
    html += '<div class="menu-setting-row">';
    html += '<div class="menu-setting-info"><span class="menu-setting-name">' + t('settingWeekly') + '</span>';
    html += '<span class="menu-setting-desc">' + t('settingWeeklyDesc') + '</span></div>';
    html += '<label class="menu-toggle"><input type="checkbox" checked data-setting="ugentlig"><span class="toggle-track"><span class="toggle-thumb"></span></span></label>';
    html += '</div>';
    html += '</div>';

    html += '</div>';

    html += '<div class="menu-divider"></div>';

    // ── Language ──
    html += '<div class="menu-section">';
    html += '<div class="menu-section-title">' + t('language') + '</div>';
    html += '<div class="menu-lang-toggle">';
    html += '<button class="menu-lang-btn' + (getLang() === 'da' ? ' active' : '') + '" data-lang="da">' + t('langDanish') + '</button>';
    html += '<button class="menu-lang-btn' + (getLang() === 'en' ? ' active' : '') + '" data-lang="en">' + t('langEnglish') + '</button>';
    html += '</div>';
    html += '</div>';
    html += '<div class="menu-divider"></div>';

    // ── Nyt indhold / notifikationer ──
    var notifEnabled = localStorage.getItem('cf_notif_enabled') === 'true';
    var notifEmail = localStorage.getItem('cf_notif_email') || '';
    html += '<div class="menu-section">';
    html += '<div class="menu-section-title">' + t('notifTitle') + '</div>';
    html += '<p class="menu-notif-desc">' + t('notifDesc') + '</p>';
    html += '<div class="menu-setting">';
    html += '<div class="menu-setting-row">';
    html += '<div class="menu-setting-info"><span class="menu-setting-name">' + t('notifToggle') + '</span></div>';
    html += '<label class="menu-toggle"><input type="checkbox" ' + (notifEnabled ? 'checked' : '') + ' id="notifToggle"><span class="toggle-track"><span class="toggle-thumb"></span></span></label>';
    html += '</div>';
    html += '</div>';
    html += '<div class="menu-notif-email-wrap" id="notifEmailWrap" style="' + (notifEnabled ? '' : 'display:none;') + '">';
    html += '<input type="email" class="menu-notif-email" id="notifEmail" placeholder="' + t('notifEmailPlaceholder') + '" value="' + notifEmail + '">';
    html += '<button class="menu-notif-save" id="notifSave">' + t('notifSave') + '</button>';
    html += '<p class="menu-notif-saved" id="notifSavedMsg" style="display:none;">' + t('notifSaved') + '</p>';
    html += '</div>';
    html += '</div>';
    html += '<div class="menu-divider"></div>';

    // ── Privatliv & data ──
    html += '<div class="menu-section">';
    html += '<div class="menu-section-title">' + t('privacyTitle') + '</div>';
    html += '<p class="menu-privacy-text">' + t('privacyText') + '</p>';

    html += '<button class="menu-text-btn menu-text-btn-share" data-action="share">' + t('shareApp') + '</button>';
    html += '<button class="menu-text-btn menu-text-btn-delete" data-action="sletdata">' + t('resetData') + '</button>';
    html += '</div>';

    html += '<div class="menu-divider"></div>';

    // ── Om appen ──
    html += '<div class="menu-section menu-section-footer">';
    html += '<p class="menu-footer-version">' + t('appVersion') + '</p>';
    html += '</div>';

    menuContent.innerHTML = html;

    // Bind menu navigation
    menuContent.querySelectorAll('.menu-item[data-nav]').forEach(function(item) {
      item.addEventListener('click', function() {
        closeMenu();
        var nav = this.dataset.nav;
        if (nav === 'virksomhed') renderVirksomhed();
        if (nav === 'dynamik') renderDynamik();
        navigateTo(nav);
      });
    });

    // Bind favoritter link
    var favLink = document.getElementById('menuFavoritter');
    if (favLink) {
      favLink.addEventListener('click', function() {
        closeMenu();
        showFavoritter();
      });
    }

    // Bind rolle skift in menu
    var menuRolleBtn = document.getElementById('menuRolleSkift');
    if (menuRolleBtn) {
      menuRolleBtn.addEventListener('click', function() {
        skiftRolle();
        renderMenuContent();
      });
    }

    // Bind share button
    var shareBtn = menuContent.querySelector('[data-action="share"]');
    if (shareBtn) {
      shareBtn.addEventListener('click', function() {
        var shareData = {
          title: 'Clement WellbeingAtWork',
          text: t('heroSub'),
          url: window.location.href
        };
        if (navigator.share) {
          navigator.share(shareData).catch(function() {});
        } else {
          navigator.clipboard.writeText(shareData.url).then(function() {
            shareBtn.textContent = t('linkCopied');
            setTimeout(function() { shareBtn.textContent = t('shareApp'); }, 2000);
          }).catch(function() {});
        }
      });
    }

    // Bind delete data button
    var deleteBtn = menuContent.querySelector('[data-action="sletdata"]');
    if (deleteBtn) {
      deleteBtn.addEventListener('click', function() {
        if (confirm(t('resetConfirm'))) {
          localStorage.removeItem('cf_favoritter');
          localStorage.removeItem('cf_proces');
          localStorage.removeItem('cf_trappen_checkins');
          localStorage.removeItem('clementRolle');
          closeMenu();
          location.reload();
        }
      });
    }

    // Bind toggle switches (visual only for demo)
    menuContent.querySelectorAll('.menu-toggle input').forEach(function(input) {
      input.addEventListener('change', function(e) {
        e.stopPropagation();
      });
    });

    // Bind notification toggle and save
    var notifToggleEl = document.getElementById('notifToggle');
    var notifEmailWrap = document.getElementById('notifEmailWrap');
    var notifSaveBtn = document.getElementById('notifSave');
    var notifSavedMsg = document.getElementById('notifSavedMsg');
    if (notifToggleEl) {
      notifToggleEl.addEventListener('change', function() {
        localStorage.setItem('cf_notif_enabled', this.checked);
        if (notifEmailWrap) notifEmailWrap.style.display = this.checked ? '' : 'none';
        if (!this.checked) {
          localStorage.removeItem('cf_notif_email');
          var emailInput = document.getElementById('notifEmail');
          if (emailInput) emailInput.value = '';
        }
      });
    }
    if (notifSaveBtn) {
      notifSaveBtn.addEventListener('click', function() {
        var emailInput = document.getElementById('notifEmail');
        if (emailInput && emailInput.value.trim()) {
          localStorage.setItem('cf_notif_email', emailInput.value.trim());
          if (notifSavedMsg) {
            notifSavedMsg.style.display = '';
          }
          // Show gift after a short moment
          setTimeout(function() {
            closeMenu();
            setTimeout(function() { showGave(); }, 350);
          }, 1200);
        }
      });
    }

    // Bind language toggle
    menuContent.querySelectorAll('.menu-lang-btn').forEach(function(btn) {
      btn.addEventListener('click', function() {
        var newLang = this.dataset.lang;
        if (newLang !== getLang()) {
          setLang(newLang);
          location.reload();
        }
      });
    });
  }

  function openMenu() {
    menuOverlay.classList.add('visible');
    menuPanel.classList.add('open');
  }

  function closeMenu() {
    menuOverlay.classList.remove('visible');
    menuPanel.classList.remove('open');
  }

  function bindMenuEvents() {
    menuBtn.addEventListener('click', openMenu);
    menuClose.addEventListener('click', closeMenu);
    menuOverlay.addEventListener('click', closeMenu);
  }

  // ── Search ──
  function getSearchTags() { return t('searchTags'); }

  function renderSearchTags() {
    var html = '';
    getSearchTags().forEach(function(tag) {
      html += '<button class="search-tag" data-tag="' + tag + '">' + tag + '</button>';
    });
    searchTags.innerHTML = html;

    searchTags.querySelectorAll('.search-tag').forEach(function(btn) {
      btn.addEventListener('click', function() {
        var tag = this.dataset.tag;
        searchInput.value = tag;
        searchClear.classList.add('visible');
        // Highlight active tag
        searchTags.querySelectorAll('.search-tag').forEach(function(t) { t.classList.remove('active'); });
        this.classList.add('active');
        performSearch(tag);
      });
    });
  }

  function openSearch() {
    searchOverlay.classList.add('visible');
    searchInput.value = '';
    searchClear.classList.remove('visible');
    searchResults.innerHTML = '<div class="search-empty">' + t('searchEmpty') + '</div>';
    searchTags.querySelectorAll('.search-tag').forEach(function(t) { t.classList.remove('active'); });
    setTimeout(function() { searchInput.focus(); }, 100);
  }

  function closeSearch() {
    searchOverlay.classList.remove('visible');
    searchInput.blur();
  }

  function performSearch(query) {
    if (!query || query.trim().length === 0) {
      searchResults.innerHTML = '<div class="search-empty">' + t('searchEmpty') + '</div>';
      return;
    }

    var q = query.toLowerCase().trim();
    var results = [];

    // Search CIRKLER
    var cirkelKeys = Object.keys(D_CIRKLER());
    cirkelKeys.forEach(function(key) {
      var c = D_CIRKLER()[key];
      var indhold = c[getDataPerspektiv()];
      var match = false;
      var snippet = '';

      if (c.titel.toLowerCase().indexOf(q) !== -1) { match = true; snippet = indhold.overblik.beskrivelse; }
      if (!match && indhold.overblik.beskrivelse.toLowerCase().indexOf(q) !== -1) { match = true; snippet = indhold.overblik.beskrivelse; }
      if (!match) {
        for (var i = 0; i < indhold.overblik.punkter.length; i++) {
          if (indhold.overblik.punkter[i].toLowerCase().indexOf(q) !== -1) { match = true; snippet = indhold.overblik.punkter[i]; break; }
        }
      }
      if (!match) {
        for (var i = 0; i < indhold.dybde.length; i++) {
          if (indhold.dybde[i].toLowerCase().indexOf(q) !== -1) { match = true; snippet = indhold.dybde[i]; break; }
        }
      }

      if (match) {
        results.push({
          type: t('searchTypeCircle'),
          title: c.titel,
          snippet: snippet.substring(0, 120) + (snippet.length > 120 ? '...' : ''),
          action: function() { navigateTo('cirkel/' + key); aktivCirkel = key; renderCirkelDetail(key); }
        });
      }
    });

    // Search TEMA_INDHOLD
    var temaKeys = Object.keys(D_TEMA_INDHOLD());
    temaKeys.forEach(function(key) {
      var ti = D_TEMA_INDHOLD()[key];
      var indhold = ti[getDataPerspektiv()];
      var match = false;
      var snippet = '';

      if (ti.titel.toLowerCase().indexOf(q) !== -1) { match = true; snippet = indhold.intro; }
      if (!match && indhold.intro.toLowerCase().indexOf(q) !== -1) { match = true; snippet = indhold.intro; }
      if (!match && indhold.tekst.toLowerCase().indexOf(q) !== -1) { match = true; snippet = indhold.tekst; }

      if (match) {
        results.push({
          type: t('searchTypeTheme'),
          title: ti.titel,
          snippet: snippet.substring(0, 120) + (snippet.length > 120 ? '...' : ''),
          action: function() { navigateTo('temaer'); setTimeout(function() { aktivTema = key; visTemaDetalje(key); }, 100); }
        });
      }
    });

    // Search TRAPPEN
    var trinKeys = Object.keys(D_TRAPPEN());
    trinKeys.forEach(function(key) {
      var tr = D_TRAPPEN()[key];
      var indhold = tr[getDataPerspektiv()];
      var match = false;
      var snippet = '';

      if (tr.navn.toLowerCase().indexOf(q) !== -1) { match = true; snippet = indhold.beskrivelse; }
      if (!match && indhold.beskrivelse.toLowerCase().indexOf(q) !== -1) { match = true; snippet = indhold.beskrivelse; }
      if (!match && indhold.handlinger) {
        var handlStr = indhold.handlinger.join(' ');
        if (handlStr.toLowerCase().indexOf(q) !== -1) { match = true; snippet = indhold.handlinger[0]; }
      }

      if (match) {
        results.push({
          type: t('searchTypeLadder'),
          title: tr.navn,
          snippet: snippet.substring(0, 120) + (snippet.length > 120 ? '...' : ''),
          action: function() { navigateTo('trappen'); setTimeout(function() { aktivTrin = key; visTrappenSvar(key); }, 100); }
        });
      }
    });

    // Search SAMMENHAENGE
    var sammKeys = Object.keys(D_SAMMENHAENGE());
    sammKeys.forEach(function(key) {
      var s = D_SAMMENHAENGE()[key];
      var tekst = s[getDataPerspektiv()];
      if (tekst && tekst.toLowerCase().indexOf(q) !== -1) {
        var parts = key.split('-');
        var c1 = D_CIRKEL_NAVNE()[parts[0]] || parts[0];
        var c2 = D_CIRKEL_NAVNE()[parts[1]] || parts[1];
        results.push({
          type: t('searchTypeConnection'),
          title: c1 + ' ↔ ' + c2,
          snippet: tekst.substring(0, 120) + '...',
          action: (function(cId) {
            return function() {
              navigateTo('cirkel/' + cId);
              aktivCirkel = cId;
              renderCirkelDetail(cId);
              // Switch to dybde tab
              setTimeout(function() {
                tabs.forEach(function(t) { t.classList.toggle('active', t.dataset.tab === 'dybde'); });
                tabPanels.forEach(function(p) { p.classList.toggle('active', p.dataset.panel === 'dybde'); });
              }, 100);
            };
          })(parts[0])
        });
      }
    });

    // Search OEVELSER
    D_OEVELSER().forEach(function(o, idx) {
      var match = false;
      var snippet = '';

      if (o.titel.toLowerCase().indexOf(q) !== -1) { match = true; snippet = o.intro; }
      if (!match && o.intro.toLowerCase().indexOf(q) !== -1) { match = true; snippet = o.intro; }
      if (!match) {
        for (var i = 0; i < o.steps.length; i++) {
          if (o.steps[i].toLowerCase().indexOf(q) !== -1) { match = true; snippet = o.steps[i]; break; }
        }
      }

      if (match) {
        results.push({
          type: t('searchTypeExercise'),
          title: o.titel,
          snippet: snippet.substring(0, 120) + (snippet.length > 120 ? '...' : ''),
          action: function() { navigateTo('oevelser'); }
        });
      }
    });

    // Render results
    if (results.length === 0) {
      searchResults.innerHTML = '<div class="search-empty">' + t('noResults').replace('{query}', query) + '</div>';
      return;
    }

    var html = '';
    results.forEach(function(r, i) {
      html += '<button class="search-result-item" data-idx="' + i + '">';
      html += '<div class="search-result-type">' + r.type + '</div>';
      html += '<div class="search-result-title">' + r.title + '</div>';
      html += '<div class="search-result-snippet">' + r.snippet + '</div>';
      html += '</button>';
    });
    searchResults.innerHTML = html;

    // Bind result clicks
    searchResults.querySelectorAll('.search-result-item').forEach(function(item) {
      item.addEventListener('click', function() {
        var idx = parseInt(this.dataset.idx);
        closeSearch();
        results[idx].action();
      });
    });
  }

  function bindSearchEvents() {
    searchBtn.addEventListener('click', openSearch);
    searchClose.addEventListener('click', closeSearch);

    searchClear.addEventListener('click', function() {
      searchInput.value = '';
      searchClear.classList.remove('visible');
      searchTags.querySelectorAll('.search-tag').forEach(function(t) { t.classList.remove('active'); });
      searchResults.innerHTML = '<div class="search-empty">' + t('searchEmpty') + '</div>';
      searchInput.focus();
    });

    searchInput.addEventListener('input', function() {
      var val = this.value;
      searchClear.classList.toggle('visible', val.length > 0);
      searchTags.querySelectorAll('.search-tag').forEach(function(t) { t.classList.remove('active'); });
      performSearch(val);
    });
  }

  // ── Velkommen (first visit) ──
  function showVelkommen() {
    if (!velkommenSection || !velkommenTitel || !velkommenTekst) return;

    if (aktivPerspektiv === 'leder') {
      velkommenTitel.textContent = t('welcomeTitleLeader');
      velkommenTekst.textContent = t('welcomeTextLeader');
    } else {
      velkommenTitel.textContent = t('welcomeTitleEmployee');
      velkommenTekst.textContent = t('welcomeTextEmployee');
    }

    // Show with a slight delay for the transition
    setTimeout(function() {
      velkommenSection.classList.add('visible');
    }, 300);

    // Auto-hide after 20 seconds (or user can scroll past)
    setTimeout(function() {
      velkommenSection.classList.remove('visible');
      velkommenSection.classList.add('hiding');
    }, 25000);
  }

  function animateCircles() {
    var connections = document.querySelector('.connections');
    var nodes = document.querySelectorAll('.cirkel-node');

    // Set initial state
    if (connections) {
      connections.classList.add('entrance');
    }
    nodes.forEach(function(node) {
      node.classList.add('entrance');
    });

    // Animate center first, then outer circles with stagger
    var order = ['centrum', 'tilstande', 'ledelse', 'samarbejde', 'krop', 'aandedraet', 'resiliens'];
    var baseDelay = 600; // ms after page loads

    order.forEach(function(id, i) {
      var node = document.querySelector('.cirkel-node[data-cirkel="' + id + '"]');
      if (node) {
        var delay = baseDelay + (i === 0 ? 0 : 200 + (i * 120));
        setTimeout(function() {
          node.classList.remove('entrance');
          node.classList.add('animate-in');
        }, delay);
      }
    });

    // Animate connections after circles
    if (connections) {
      setTimeout(function() {
        connections.classList.remove('entrance');
        connections.classList.add('animate-in');
      }, baseDelay + 200 + (6 * 120));
    }
  }

  // ── Virksomhed Page ──
  function renderVirksomhed() {
    var container = document.getElementById('virksomhedContent');
    if (!container) return;

    // Inline SVG helpers
    var svgBuilding = '<svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="2" width="16" height="20" rx="2"/><line x1="9" y1="6" x2="9" y2="6.01"/><line x1="15" y1="6" x2="15" y2="6.01"/><line x1="9" y1="10" x2="9" y2="10.01"/><line x1="15" y1="10" x2="15" y2="10.01"/><line x1="9" y1="14" x2="9" y2="14.01"/><line x1="15" y1="14" x2="15" y2="14.01"/><line x1="9" y1="18" x2="15" y2="18"/></svg>';
    var svgChevDown = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="6 9 12 15 18 9"/></svg>';
    var svgMail = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><polyline points="22,6 12,13 2,6"/></svg>';
    var svgPhone = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>';
    var svgLinkedIn = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>';

    var html = '';

    // ===== Velkomst =====
    html += '<div class="virksomhed-welcome">';
    html += '<div class="virksomhed-welcome-inner">';
    html += '<div class="virksomhed-welcome-medallion">';
    html += '<div class="virksomhed-welcome-circle">' + svgBuilding + '</div>';
    html += '</div>';
    html += '<h2 class="virksomhed-welcome-title">' + (isEn() ? 'Wellbeing that reaches deep — throughout the entire organization' : 'Trivsel der mærkes — hele vejen ind i organisationen') + '</h2>';
    html += '<p class="virksomhed-welcome-subtitle">' + (isEn() ? 'For you, considering a collaboration with Anne Marie Clement' : 'Til dig, der overvejer et samarbejde med Anne Marie Clement') + '</p>';
    html += '<p class="virksomhed-welcome-text">' + (isEn() ? 'This page is written for you — the person responsible for people in an organization — who senses that wellbeing requires more than fruit baskets and stress courses.' : 'Denne side er skrevet til dig, der har ansvar for mennesker i en organisation — og som mærker, at trivsel kræver mere end frugtordninger og stresskurser.') + '</p>';
    html += '<p class="virksomhed-welcome-text">' + (isEn() ? 'Anne Marie Clement works with the nervous system as the gateway to wellbeing, leadership and collaboration. It is an approach that reaches deeper than most — because it is about biology, not just attitudes.' : 'Anne Marie Clement arbejder med nervesystemet som indgang til trivsel, ledelse og samarbejde. Det er en tilgang, der rammer dybere end de fleste — fordi den handler om biologi, ikke bare holdninger.') + '</p>';
    html += '<div class="virksomhed-welcome-scroll">';
    html += '<button class="virksomhed-welcome-scroll-btn" id="virksomhedScrollDown">' + svgChevDown + ' ' + (isEn() ? 'Read more' : 'Læs mere') + '</button>';
    html += '</div>';
    html += '</div>';
    html += '</div>';

    // ===== Hovedindhold =====
    html += '<div class="virksomhed-faglig" id="virksomhedFaglig">';

    // --- Problemet I kender ---
    html += '<div class="virksomhed-section">';
    html += '<h3 class="virksomhed-section-title">' + (isEn() ? 'The problem you know' : 'Problemet I kender') + '</h3>';
    html += '<p class="virksomhed-text">' + (isEn() ? 'Most organizations experience the same pattern: employees running too fast, leaders carrying too much, and a culture where stress is normalized. You measure wellbeing, but the numbers don\'t shift. You offer courses, but the effect fades after three weeks.' : 'De fleste organisationer oplever det samme mønster: medarbejdere der kører for hurtigt, ledere der bærer for meget, og en kultur hvor stress er normaliseret. I måler trivslen, men tallene flytter sig ikke. I tilbyder kurser, men effekten forsvinder efter tre uger.') + '</p>';
    html += '<p class="virksomhed-text">' + (isEn() ? 'The reason is that most approaches address the symptoms — not what drives them. The nervous system is the invisible engine behind most of what you experience: conflicts that escalate, meetings that don\'t work, leaders who lose perspective under pressure, and employees who slowly withdraw.' : 'Det skyldes, at de fleste tilgange arbejder med symptomerne — ikke med det, der driver dem. Nervesystemet er den usynlige motor bag det meste af det, I oplever: konflikter der eskalerer, møder der ikke virker, ledere der mister overblikket under pres, og medarbejdere der langsomt trækker sig.') + '</p>';
    html += '</div>';

    // --- Anne Maries tilgang ---
    html += '<div class="virksomhed-section">';
    html += '<h3 class="virksomhed-section-title">' + (isEn() ? 'A different entry point' : 'En anden indgang') + '</h3>';
    html += '<p class="virksomhed-text">' + (isEn() ? 'For over 20 years, Anne Marie Clement has worked with the nervous system as the key to wellbeing and performance. As a psychotherapist, body therapist and educator, she has helped leaders, teams and individuals understand what actually drives stress, conflict and disconnection — and what creates real, lasting change.' : 'Anne Marie Clement har i over 20 år arbejdet med nervesystemet som nøgle til trivsel og performance. Som psykoterapeut, kropsterapeut og underviser har hun hjulpet ledere, teams og individer med at forstå, hvad der reelt driver stress, konflikter og mistrivsel — og hvad der skaber ægte, varig forandring.') + '</p>';
    html += '<p class="virksomhed-text">' + (isEn() ? 'Her approach draws on polyvagal theory and attachment research — translated into language and practices that make sense in a busy workday. This is not about discussing feelings in the conference room. It is about giving people a concrete understanding of what happens in their body under pressure — and practical tools to regulate themselves and each other. Discreetly, quickly, in the middle of everyday life.' : 'Hendes tilgang bygger på polyvagal teori og tilknytningsforskning — oversat til et sprog og en praksis, der giver mening i en travl arbejdsdag. Det handler ikke om at tale om følelser i mødelokalet. Det handler om at give mennesker en konkret forståelse af, hvad der sker i deres krop under pres — og praktiske redskaber til at regulere sig selv og hinanden. Diskret, hurtigt, midt i hverdagen.') + '</p>';

    html += '<div class="virksomhed-kernepunkter">';

    html += '<div class="virksomhed-kernepunkt">';
    html += '<div class="virksomhed-kernepunkt-dot virksomhed-dot-sage"></div>';
    html += '<div class="virksomhed-kernepunkt-tekst">';
    html += '<strong>' + (isEn() ? 'For the employee' : 'For medarbejderen') + '</strong>';
    html += '<p>' + (isEn() ? 'Practical 2-minute exercises you can use at your desk. Grounding, breathing and sensory regulation — without anyone needing to know.' : 'Konkrete 2-minutters øvelser der kan bruges ved skrivebordet. Grounding, åndedræt og sensorisk regulering — uden at nogen behøver vide det.') + '</p>';
    html += '</div>';
    html += '</div>';

    html += '<div class="virksomhed-kernepunkt">';
    html += '<div class="virksomhed-kernepunkt-dot virksomhed-dot-amber"></div>';
    html += '<div class="virksomhed-kernepunkt-tekst">';
    html += '<strong>' + (isEn() ? 'For the leader' : 'For lederen') + '</strong>';
    html += '<p>' + (isEn() ? 'Understanding how your own nervous system influences the team — and tools to be the regulating force in the room, even when the pressure is high.' : 'Forståelse af, hvordan dit eget nervesystem smitter teamet — og redskaber til at være den regulerende kraft i rummet, også når presset er højt.') + '</p>';
    html += '</div>';
    html += '</div>';

    html += '<div class="virksomhed-kernepunkt">';
    html += '<div class="virksomhed-kernepunkt-dot virksomhed-dot-primary"></div>';
    html += '<div class="virksomhed-kernepunkt-tekst">';
    html += '<strong>' + (isEn() ? 'For the organization' : 'For organisationen') + '</strong>';
    html += '<p>' + (isEn() ? 'A shared language for wellbeing that doesn\'t require a therapy background. When everyone understands the nervous system\'s three states, conversations change — and with them, the culture.' : 'Et fælles sprog for trivsel, der ikke kræver terapi-baggrund. Når alle forstår nervesystemets tre tilstande, ændrer samtalerne sig — og dermed kulturen.') + '</p>';
    html += '</div>';
    html += '</div>';

    html += '</div>'; // end kernepunkter
    html += '</div>';

    // --- Samarbejdsformer ---
    html += '<div class="virksomhed-section">';
    html += '<h3 class="virksomhed-section-title">' + (isEn() ? 'What a collaboration can look like' : 'Hvad et samarbejde kan se ud') + '</h3>';

    html += '<div class="virksomhed-forloeb">';

    html += '<div class="virksomhed-forloeb-item">';
    html += '<div class="virksomhed-forloeb-header">';
    html += '<span class="virksomhed-forloeb-tag">Keynote</span>';
    html += '<h4>' + (isEn() ? 'Talks' : 'Foredrag') + '</h4>';
    html += '</div>';
    html += '<p>' + (isEn() ? 'Anne Marie delivers talks that give participants a bodily experience — not just information. Participants leave with a new understanding of their own stress responses and concrete tools they can use immediately. Well suited for kick-offs, leadership gatherings or as the starting point for a wellbeing initiative.' : 'Anne Marie holder foredrag, der giver deltagerne en kropslig erfaring — ikke bare information. Deltagerne går derfra med en ny forståelse af deres egne stressreaktioner og konkrete redskaber de kan bruge med det samme. Velegnet til kick-offs, ledersamlinger eller som afsæt for et trivselsinitiativ.') + '</p>';
    html += '<div class="virksomhed-forloeb-detaljer">';
    html += '<span>' + (isEn() ? '60-90 minutes' : '60-90 minutter') + '</span><span>' + (isEn() ? 'Up to 500 participants' : 'Op til 500 deltagere') + '</span>';
    html += '</div>';
    html += '</div>';

    html += '<div class="virksomhed-forloeb-item">';
    html += '<div class="virksomhed-forloeb-header">';
    html += '<span class="virksomhed-forloeb-tag">Workshop</span>';
    html += '<h4>' + (isEn() ? 'Team workshops' : 'Teamworkshops') + '</h4>';
    html += '</div>';
    html += '<p>' + (isEn() ? 'Half or full-day workshops where teams learn to recognize their own and each other\'s nervous system states — and gain practical tools to regulate themselves and support one another. Combines theory, reflection and bodily exercises in a format that feels relevant, not clinical.' : 'Halv- eller heldags workshops, hvor teams lærer at genkende egne og hinandens nervesystemtilstande — og får praktiske redskaber til at regulere sig selv og støtte hinanden. Kombinerer teori, refleksion og kropslige øvelser i et format der føles relevant, ikke klinisk.') + '</p>';
    html += '<div class="virksomhed-forloeb-detaljer">';
    html += '<span>' + (isEn() ? '3-7 hours' : '3-7 timer') + '</span><span>' + (isEn() ? '8-30 participants' : '8-30 deltagere') + '</span>';
    html += '</div>';
    html += '</div>';

    html += '<div class="virksomhed-forloeb-item">';
    html += '<div class="virksomhed-forloeb-header">';
    html += '<span class="virksomhed-forloeb-tag virksomhed-forloeb-tag-alt">Forløb</span>';
    html += '<h4>' + (isEn() ? 'Leadership development' : 'Lederudvikling') + '</h4>';
    html += '</div>';
    html += '<p>' + (isEn() ? 'A leadership program with the nervous system at its core. For leaders who want to understand how their own regulation sets the tone for the entire team — and learn to be the calming presence in the room, even when the pressure is high. Theory, reflection and practice over multiple sessions.' : 'Et lederudviklingsforløb med nervesystemet i centrum. For ledere der vil forstå, hvordan deres egen regulering sætter tonen for hele teamet — og lære at være den beroligende tilstedeværelse i rummet, også når presset er højt. Teori, refleksion og praksis over flere sessioner.') + '</p>';
    html += '<div class="virksomhed-forloeb-detaljer">';
    html += '<span>' + (isEn() ? '4-8 sessions' : '4-8 sessioner') + '</span><span>' + (isEn() ? 'Individual coaching included' : 'Individuel sparring inkluderet') + '</span>';
    html += '</div>';
    html += '</div>';

    html += '<div class="virksomhed-forloeb-item">';
    html += '<div class="virksomhed-forloeb-header">';
    html += '<span class="virksomhed-forloeb-tag virksomhed-forloeb-tag-alt">App</span>';
    html += '<h4>' + (isEn() ? 'This app as a daily tool' : 'Denne app som dagligt redskab') + '</h4>';
    html += '</div>';
    html += '<p>' + (isEn() ? 'Clement WellbeingAtWork can be made available to your employees as a quiet, daily companion. Exercises, check-ins and knowledge — right in their pocket, without needing a workshop first.' : 'Clement WellbeingAtWork kan stilles til rådighed for jeres medarbejdere som et stille, dagligt supplement. Øvelser, check-ins og viden — direkte i lommen, uden at det kræver en workshop først.') + '</p>';
    html += '<div class="virksomhed-forloeb-detaljer">';
    html += '<span>' + (isEn() ? 'Can be used independently or as part of a program' : 'Kan bruges selvstændigt eller som del af et forløb') + '</span>';
    html += '</div>';
    html += '</div>';

    html += '</div>'; // end forloeb
    html += '</div>';

    // --- Hvad gør det relevant for jer? ---
    html += '<div class="virksomhed-section">';
    html += '<h3 class="virksomhed-section-title">' + (isEn() ? 'When does it make sense?' : 'Hvornår giver det mening?') + '</h3>';
    html += '<p class="virksomhed-text">' + (isEn() ? 'A collaboration with Anne Marie is relevant if you recognize any of this:' : 'Et samarbejde med Anne Marie er relevant, hvis I genkender noget af dette:') + '</p>';
    html += '<ul class="virksomhed-list">';
    html += '<li>' + (isEn() ? 'Stress levels are high, but nobody talks about it directly' : 'Stressniveauet er højt, men ingen taler om det direkte') + '</li>';
    html += '<li>' + (isEn() ? 'Team conflicts that don\'t resolve despite good intentions' : 'Konflikter i teams, der ikke løser sig trods gode intentioner') + '</li>';
    html += '<li>' + (isEn() ? 'Leaders who are under pressure themselves and unconsciously pass it on' : 'Ledere der selv er under pres og ubevidst viderefører det') + '</li>';
    html += '<li>' + (isEn() ? 'Employees who withdraw, lose motivation or resign' : 'Medarbejdere der trækker sig, mister motivation eller siger op') + '</li>';
    html += '<li>' + (isEn() ? 'Wellbeing surveys that don\'t lead to real change' : 'Trivselsundersøgelser, der ikke fører til reel forandring') + '</li>';
    html += '<li>' + (isEn() ? 'A desire to do something different — with depth and respect' : 'Et ønske om at gøre noget anderledes — med dybde og respekt') + '</li>';
    html += '</ul>';
    html += '</div>';

    // --- Udforsk appen ---
    html += '<div class="virksomhed-section">';
    html += '<h3 class="virksomhed-section-title">' + (isEn() ? 'See what your employees can get' : 'Se hvad jeres medarbejdere kan få') + '</h3>';
    html += '<p class="virksomhed-text">' + (isEn() ? 'This app is an example of what Anne Marie builds for organizations. Use it yourself — try the exercises, check in on the ladder, read the themes. It gives better insight than any presentation.' : 'Denne app er et eksempel på, hvad Anne Marie bygger til organisationer. Brug den selv — prøv øvelserne, tjek ind på trappen, læs temaerne. Det giver et bedre indblik end enhver præsentation.') + '</p>';
    html += '<div class="virksomhed-appnav-grid">';
    html += '<button class="virksomhed-appnav-btn" data-goto="trappen"><span>' + (isEn() ? 'The nervous system ladder' : 'Nervesystemets trappe') + '</span></button>';
    html += '<button class="virksomhed-appnav-btn" data-goto="temaer"><span>' + (isEn() ? 'Themes' : 'Temaer') + '</span></button>';
    html += '<button class="virksomhed-appnav-btn" data-goto="oevelser"><span>' + (isEn() ? 'Exercises' : 'Øvelser') + '</span></button>';
    html += '<button class="virksomhed-appnav-btn" data-goto="dynamik"><span>' + (isEn() ? 'The dynamics behind the model' : 'Dynamikken bag modellen') + '</span></button>';
    html += '</div>';
    html += '</div>';

    html += '</div>'; // end .virksomhed-faglig

    // ===== Kontakt =====
    html += '<div class="virksomhed-cta">';
    html += '<h3 class="virksomhed-cta-title">' + (isEn() ? 'Let\'s talk' : 'Lad os tale sammen') + '</h3>';
    html += '<p class="virksomhed-cta-text">' + (isEn() ? 'Anne Marie is happy to have an informal conversation about what makes sense for your organization. No sales pitch — just an honest talk about where you are and what might help.' : 'Anne Marie tager gerne en uforpligtende samtale om, hvad der giver mening for jeres organisation. Ingen salgstale — bare en ærlig snak om, hvor I er, og hvad der kunne hjælpe.') + '</p>';
    html += '<div class="virksomhed-cta-info">';
    html += '<a href="mailto:annemarie@annemarieclement.dk" class="virksomhed-cta-btn virksomhed-cta-btn-primary">' + svgMail + ' annemarie@annemarieclement.dk</a>';
    html += '<a href="tel:+4522544542" class="virksomhed-cta-btn virksomhed-cta-btn-secondary">' + svgPhone + ' +45 2254 4542</a>';
    html += '<a href="https://www.linkedin.com/in/annemarie-clement-ba703731" target="_blank" rel="noopener" class="virksomhed-cta-btn virksomhed-cta-btn-linkedin">' + svgLinkedIn + ' LinkedIn</a>';
    html += '</div>';
    html += '</div>';

    container.innerHTML = html;

    // Bind: scroll-down button
    var scrollBtn = document.getElementById('virksomhedScrollDown');
    if (scrollBtn) {
      scrollBtn.addEventListener('click', function () {
        var target = document.getElementById('virksomhedFaglig');
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }

    // Bind: all data-goto buttons
    container.querySelectorAll('[data-goto]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var dest = this.getAttribute('data-goto');
        if (dest === 'dynamik') renderDynamik();
        navigateTo(dest);
      });
    });
  }

  // ── Start ──
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
