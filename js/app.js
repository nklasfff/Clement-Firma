/* ═══════════════════════════════════════════
   Clement Firma — App Logic
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
    var labelHtml = saved ? 'Gemt' : 'Gem';
    return '<div class="action-bar" data-action-type="' + type + '" data-action-id="' + escapeAttr(id) + '" data-action-titel="' + escapeAttr(titel) + '" data-action-share="' + escapeAttr(shareText) + '">' +
      '<button class="action-btn action-btn-save" title="Gem som favorit">' + iconHtml + '<span>' + labelHtml + '</span></button>' +
      '<button class="action-btn action-btn-share" title="Del">' + IKONER.share(16) + '<span>Del</span></button>' +
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
          span.textContent = 'Gemt';
        } else {
          saveBtn.querySelector('svg').outerHTML = IKONER.bookmark(16);
          span.textContent = 'Gem';
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
            span.textContent = 'Kopieret!';
            setTimeout(function() { span.textContent = 'Del'; }, 2000);
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

  // ── Init ──
  function init() {
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
      var label = aktivPerspektiv === 'virksomhed' ? 'virksomhed' : aktivPerspektiv;
      rolleLabel.innerHTML = 'Indhold tilpasset dig som <strong>' + label + '</strong>';
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
    if (baseView !== 'trappen' && aktivTrin) {
      aktivTrin = null;
      trappeTrin.forEach(function(t) { t.classList.remove('selected'); });
      if (trappenResponse) {
        trappenResponse.innerHTML = '';
        trappenResponse.classList.remove('visible');
      }
      var checkinBekraeft = document.getElementById('trappenCheckinBekraeft');
      if (checkinBekraeft) { checkinBekraeft.innerHTML = ''; checkinBekraeft.style.display = 'none'; }
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
      if (CIRKLER[cirkelId]) {
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
        trappeTrin.forEach(function(t) { t.classList.remove('selected'); });
        this.classList.add('selected');
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
      var tekster = CIRKEL_TEKSTER[cirkelId];
      if (!tekster) return;

      var perspektivTekst = tekster[getDataPerspektiv()];
      node.querySelectorAll('.cirkel-tekst-1').forEach(function(el) { el.textContent = perspektivTekst[0]; });
      node.querySelectorAll('.cirkel-tekst-2').forEach(function(el) { el.textContent = perspektivTekst[1]; });
      node.querySelectorAll('.cirkel-tekst-3').forEach(function(el) { el.textContent = perspektivTekst[2] || ''; });
    });
  }

  // ── Cirkel Detail ──
  function renderCirkelDetail(cirkelId) {
    var data = CIRKLER[cirkelId];
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
    var sammenhaenge = hentSammenhaenge(cirkelId);
    if (sammenhaenge.length > 0) {
      html += '<div class="sammenhaenge-section">';
      html += '<div class="sammenhaenge-header">';
      html += '<div class="sammenhaenge-linje"></div>';
      html += '<span class="sammenhaenge-label">Dynamiske sammenhænge</span>';
      html += '<div class="sammenhaenge-linje"></div>';
      html += '</div>';
      html += '<p class="sammenhaenge-intro">Se hvordan ' + (CIRKEL_NAVNE[cirkelId] || cirkelId).toLowerCase() + ' dynamisk påvirker og påvirkes af de andre dimensioner i dit arbejdsliv.</p>';

      sammenhaenge.forEach(function(s) {
        var tekst = s.data[getDataPerspektiv()];
        var andenNavn = CIRKEL_NAVNE[s.id] || s.titel;
        var cirkelNavn = CIRKEL_NAVNE[cirkelId] || CIRKLER[cirkelId].titel;

        html += '<div class="sammenhaeng-item" data-cirkel="' + s.id + '">';
        html += '<button class="sammenhaeng-toggle">';
        html += '<span class="sammenhaeng-titel">' + cirkelNavn + ' <span class="sammenhaeng-pil">↔</span> ' + andenNavn + '</span>';
        html += '<span class="sammenhaeng-chevron">›</span>';
        html += '</button>';
        html += '<div class="sammenhaeng-indhold">';
        html += '<p>' + tekst + '</p>';
        html += '<button class="sammenhaeng-link" data-goto="' + s.id + '">Udforsk ' + andenNavn + ' →</button>';
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
    for (var i = 0; i < OEVELSER.length; i++) {
      if (OEVELSER[i].cirkel === cirkelId) {
        relOevelse = OEVELSER[i];
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
      html = '<p style="color:var(--text-light); padding:20px;">Ingen specifik øvelse til denne cirkel endnu.</p>';
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
    var data = TRAPPEN[trinId];
    if (!data) return;
    var tid = new Date().toLocaleTimeString('da-DK', { hour: '2-digit', minute: '2-digit' });
    var farveClass = data.farve;

    container.innerHTML = '<div class="checkin-bekraeft checkin-bekraeft-' + farveClass + '">' +
      '<span class="checkin-bekraeft-dot checkin-dot-' + farveClass + '"></span>' +
      '<span>Registreret &middot; ' + tid + '</span>' +
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
    html += '<h4>Dit mønster</h4>';
    html += '</div>';

    // Build 7-day calendar (current week Mon-Sun)
    var today = new Date();
    var dayOfWeek = today.getDay(); // 0=Sun, 1=Mon...
    var mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    var monday = new Date(today);
    monday.setDate(today.getDate() + mondayOffset);

    var dagNavne = ['Ma', 'Ti', 'On', 'To', 'Fr', 'Lø', 'Sø'];

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
        dotClass = 'moenster-dot-' + (TRAPPEN[lastCheckin.trin] ? TRAPPEN[lastCheckin.trin].farve : 'empty');
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
      html += '<p class="moenster-indsigt">Du har mærket ind ' + thisWeekCheckins.length + ' gang' + (thisWeekCheckins.length !== 1 ? 'e' : '') + ' denne uge. Det er helt okay — der er ingen krav her. Jo oftere du mærker ind, jo tydeligere bliver mønsteret.</p>';
    } else {
      // Count tilstande this week
      var groenCount = thisWeekCheckins.filter(function(c) { return c.trin === 'groen'; }).length;
      var gulCount = thisWeekCheckins.filter(function(c) { return c.trin === 'gul'; }).length;
      var roedCount = thisWeekCheckins.filter(function(c) { return c.trin === 'roed'; }).length;
      var dominant = groenCount >= gulCount && groenCount >= roedCount ? 'grøn' : gulCount >= roedCount ? 'gul' : 'rød';
      html += '<p class="moenster-indsigt">Denne uge har du oftest mærket dig i <strong>' + dominant + '</strong> tilstand. At se sit mønster er første skridt mod at ændre det.</p>';
    }

    html += '</div>';
    container.innerHTML = html;
    container.style.display = 'block';
  }

  function renderTrappenForstaaelse() {
    var container = document.getElementById('trappenForstaaelse');
    if (!container) return;
    var perspektiv = getDataPerspektiv();
    var tekster = TRAPPEN_FORSTAAELSE[perspektiv];
    if (!tekster) return;

    var rolleLabel = perspektiv === 'leder' ? 'leder' : 'medarbejder';
    var html = '<div class="forstaaelse-section">';
    html += '<div class="forstaaelse-divider"></div>';
    html += '<h3 class="forstaaelse-title">Forstå dit nervesystem som ' + rolleLabel + '</h3>';

    tekster.forEach(function(t) {
      html += '<div class="forstaaelse-card">';
      html += '<h4 class="forstaaelse-card-title">' + t.titel + '</h4>';
      html += '<p class="forstaaelse-card-tekst">' + t.tekst + '</p>';
      html += '</div>';
    });

    html += '</div>';
    container.innerHTML = html;
  }

  function visTrappenSvar(trinId) {
    var data = TRAPPEN[trinId];
    if (!data) return;

    // Register check-in
    saveTrappenCheckin(trinId);
    renderTrappenCheckinBekraeft(trinId);
    renderTrappenMoenster();

    var svar = data[getDataPerspektiv()];
    var farveClass = data.farve === 'sage' ? 'sage-border' : data.farve === 'amber' ? 'amber-border' : 'rose-border';

    var html = '<div class="trappen-card ' + farveClass + '">';
    html += '<h3>' + data.navn + '</h3>';
    html += '<p>' + svar.beskrivelse + '</p>';

    // Kropslige signaler
    html += '<div class="trappen-signaler-section">';
    html += '<strong>Kropslige signaler</strong>';
    html += '<ul class="trappen-signaler">';
    svar.kropsSignaler.forEach(function(s) {
      html += '<li>' + s + '</li>';
    });
    html += '</ul>';
    html += '</div>';

    // Handlinger (now bullet list)
    html += '<div class="trappen-handling">';
    html += '<strong>Handlinger</strong>';
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
      html += '<strong>Hvad mærker andre?</strong>';
      var andre = svar.hvadMaerkerAndre;
      var keys = Object.keys(andre);
      keys.forEach(function(key) {
        var label = key.charAt(0).toUpperCase() + key.slice(1);
        if (key === 'kolleger') label = 'Dine kolleger';
        if (key === 'teamet') label = 'Hele teamet';
        if (key === 'medarbejderne') label = 'Dine medarbejdere';
        if (key === 'organisationen') label = 'Organisationen';
        html += '<div class="trappen-andre-sub">';
        html += '<h5>' + label + '</h5>';
        html += '<p>' + andre[key] + '</p>';
        html += '</div>';
      });
      html += '</div>';
    }

    // Prøv nu
    html += '<div class="trappen-oevelse">';
    html += '<strong>Prøv nu</strong>';
    html += '<p>' + svar.oevelse + '</p>';
    html += '</div>';

    html += buildActionBar('trappen', trinId, data.navn, svar.beskrivelse);

    html += '</div>';

    trappenResponse.innerHTML = html;
    trappenResponse.classList.add('visible');
    bindActionBars(trappenResponse);
  }

  // ── Temaer ──
  function renderTemaer() {
    var html = '';
    var temaKeys = Object.keys(TEMA_INDHOLD);
    temaKeys.forEach(function(key) {
      var tema = TEMA_INDHOLD[key];
      // Count related exercises
      var oevelseCount = 0;
      OEVELSER.forEach(function(o) {
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
        html += '<span class="tema-card-count">' + oevelseCount + ' øvelse' + (oevelseCount > 1 ? 'r' : '') + '</span>';
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
    var data = TEMA_INDHOLD[temaId];
    if (!data) return;

    var perspektiv = data[getDataPerspektiv()];

    var html = '<div class="tema-detail-card">';
    html += '<h3>' + data.titel + '</h3>';
    html += '<p class="tema-intro">' + perspektiv.intro + '</p>';
    html += '<p class="tema-tekst">' + perspektiv.tekst + '</p>';

    // Related exercises
    var relOevelser = [];
    OEVELSER.forEach(function(o, idx) {
      if (o.temaer && o.temaer.indexOf(temaId) !== -1) {
        relOevelser.push({ oevelse: o, index: idx });
      }
    });

    if (relOevelser.length > 0) {
      html += '<div class="tema-detail-oevelser">';
      html += '<span class="tema-detail-oevelser-label">Øvelser til dette tema</span>';
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
        if (CIRKLER[cirkelId]) {
          html += '<span class="tag" data-cirkel="' + cirkelId + '">' + CIRKLER[cirkelId].titel + '</span>';
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
              if (btn) btn.textContent = 'Vis øvelse';
            });
            cards[idx].classList.add('expanded');
            var toggleBtn = cards[idx].querySelector('.oevelse-toggle');
            if (toggleBtn) toggleBtn.textContent = 'Skjul øvelse';
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
    OEVELSER.forEach(function(o, i) {
      html += '<div class="oevelse-card" data-index="' + i + '" data-cirkel="' + o.cirkel + '">';
      html += '<div class="oevelse-card-inner">';
      html += '<div class="oevelse-card-top">';
      html += '<h3>' + o.titel + '</h3>';
      html += '<span class="oevelse-tid-badge">' + o.tid + '</span>';
      html += '</div>';
      html += '<div class="oevelse-meta">';
      html += '<span>' + o.sted + '</span>';
      if (CIRKLER[o.cirkel]) {
        html += '<span>' + CIRKLER[o.cirkel].titel + '</span>';
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
        html += '<div class="oevelse-refleksion-header">Refleksion efter øvelsen</div>';
        html += '<p class="oevelse-refleksion-tekst">' + o.refleksion + '</p>';
        html += '</div>';
      }

      html += '<div class="oevelse-guide-controls">';
      html += '<button class="oevelse-guide-btn btn-secondary oevelse-guide-start">Start øvelse</button>';
      html += '<div class="oevelse-guide-progress"><div class="oevelse-guide-progress-bar"></div></div>';
      html += '<button class="oevelse-guide-btn oevelse-guide-next" style="display:none;">Næste trin</button>';
      html += '</div>';
      html += buildActionBar('oevelse', o.titel, o.titel, o.intro + '\n\n' + o.steps.join('\n'));
      html += '<button class="oevelse-toggle">Vis øvelse</button>';
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
          if (btn) btn.textContent = 'Vis øvelse';
          resetGuide(c);
        });

        if (!isExpanded) {
          this.classList.add('expanded');
          var toggleBtn = this.querySelector('.oevelse-toggle');
          if (toggleBtn) toggleBtn.textContent = 'Skjul øvelse';
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

    REFLEKSIONER.forEach(function(r) {
      html += '<div class="refleksion-card refleksion-card-' + r.farve + '" data-ref-id="' + r.id + '">';
      html += '<div class="refleksion-card-header">';
      html += '<span class="refleksion-card-ikon">' + r.ikon + '</span>';
      html += '<h3 class="refleksion-card-titel">' + r.titel + '</h3>';
      html += '</div>';
      html += '<p class="refleksion-card-spoergsmaal">' + r.spoergsmaal + '</p>';
      html += '<div class="refleksion-card-body">';
      html += '<p class="refleksion-card-uddybning">' + r.uddybning + '</p>';
      html += '<textarea class="refleksion-card-input" placeholder="Skriv dine tanker her..." rows="3"></textarea>';
      html += '<div class="refleksion-card-actions">';
      html += '<button class="refleksion-gem-btn" data-ref-id="' + r.id + '" data-ref-titel="' + escapeAttr(r.titel) + '">Gem refleksion</button>';
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
        this.textContent = 'Gemt!';
        this.style.background = 'var(--sage)';
        var self = this;
        setTimeout(function() {
          self.textContent = 'Gem refleksion';
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
    html += '<span class="proces-stat-label">Øvelser gennemført</span>';
    html += '</div>';
    html += '<div class="proces-stat">';
    html += '<span class="proces-stat-tal">' + unikkeOev.length + '</span>';
    html += '<span class="proces-stat-label">Forskellige øvelser</span>';
    html += '</div>';
    html += '<div class="proces-stat">';
    html += '<span class="proces-stat-tal">' + totalRef + '</span>';
    html += '<span class="proces-stat-label">Refleksioner skrevet</span>';
    html += '</div>';
    html += '<div class="proces-stat">';
    html += '<span class="proces-stat-tal">' + totalJournal + '</span>';
    html += '<span class="proces-stat-label">Journalnotater</span>';
    html += '</div>';
    html += '</div>';

    // Journal input
    html += '<div class="proces-journal">';
    html += '<h4 class="proces-journal-title">Skriv et notat til dig selv</h4>';
    html += '<p class="proces-journal-hint">Hvad fylder lige nu? En observation, en intention, en erkendelse. Det behøver ikke være perfekt.</p>';
    html += '<textarea class="proces-journal-input" id="procesJournalInput" placeholder="Skriv frit..." rows="3"></textarea>';
    html += '<button class="proces-journal-gem" id="procesJournalGem">Gem notat</button>';
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
      html += '<h4 class="proces-tidslinje-title">Din tidslinje</h4>';

      var shown = Math.min(allEntries.length, 20);
      for (var i = 0; i < shown; i++) {
        var entry = allEntries[i];
        html += '<div class="proces-entry proces-entry-' + entry.type + '">';
        html += '<div class="proces-entry-dot"></div>';
        html += '<div class="proces-entry-content">';
        if (entry.type === 'oevelse') {
          html += '<div class="proces-entry-label">Øvelse gennemført</div>';
          html += '<div class="proces-entry-titel">' + entry.titel + '</div>';
        } else if (entry.type === 'refleksion') {
          html += '<div class="proces-entry-label">Refleksion</div>';
          html += '<div class="proces-entry-titel">' + entry.titel + '</div>';
          html += '<div class="proces-entry-svar">' + entry.svar + '</div>';
        } else if (entry.type === 'journal') {
          html += '<div class="proces-entry-label">Journalnotat</div>';
          html += '<div class="proces-entry-svar">' + entry.tekst + '</div>';
        }
        html += '<div class="proces-entry-dato">' + entry.dato + (entry.tid ? ' kl. ' + entry.tid : '') + '</div>';
        html += '</div>';
        html += '</div>';
      }

      if (allEntries.length > 20) {
        html += '<div class="proces-mere">+ ' + (allEntries.length - 20) + ' tidligere</div>';
      }

      html += '</div>';
    } else {
      html += '<div class="proces-tom">';
      html += '<p>Du har ikke gennemført nogen øvelser eller skrevet refleksioner endnu.</p>';
      html += '<p class="proces-tom-hint">Start med en øvelse herover — din proces begynder med det første skridt.</p>';
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
        gemBtn.textContent = 'Gemt!';
        gemBtn.style.background = 'var(--sage)';
        setTimeout(function() {
          gemBtn.textContent = 'Gem notat';
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
    if (startBtn) { startBtn.style.display = ''; startBtn.textContent = 'Start guidet'; }
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
    if (nextBtn) { nextBtn.style.display = ''; nextBtn.textContent = 'Næste trin'; }
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
      if (nextBtn) nextBtn.textContent = 'Afslut';
    }

    // Done
    if (next >= total) {
      var startBtn = card.querySelector('.oevelse-guide-start');
      var nextBtn2 = card.querySelector('.oevelse-guide-next');
      if (startBtn) { startBtn.style.display = ''; startBtn.textContent = 'Start igen'; }
      if (nextBtn2) nextBtn2.style.display = 'none';
      // Mark all done
      lis.forEach(function(li) { li.classList.remove('step-active'); li.classList.add('step-done'); });
      // Track completion
      var idx = parseInt(card.getAttribute('data-index'));
      if (OEVELSER[idx]) {
        markerOevelseGennemfoert(OEVELSER[idx].titel);
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
    var cLabels = [
      { l1: 'Stressregulering', l2: '' },
      { l1: 'Tre tilstande', l2: 'i arbejdsdagen' },
      { l1: erLeder ? 'Dit lederskab' : 'Din leder', l2: erLeder ? '& kulturen' : '& din trivsel' },
      { l1: 'Samarbejds-', l2: 'mønstre' },
      { l1: erLeder ? 'Bevægelse' : 'Din krop', l2: erLeder ? 'i teamet' : 'i hverdagen' },
      { l1: erLeder ? 'Fælles pauser' : 'Dit åndedræt', l2: erLeder ? '& åndedræt' : '& pauser' },
      { l1: erLeder ? 'Teamets' : 'Dit mentale', l2: erLeder ? 'resiliens' : 'overskud' }
    ];

    var html = '';

    // Intro
    html += '<p class="dynamik-lead">Cirkelmodellen er ikke bare en illustration. Den er et spejl af den måde ' + (erLeder ? 'dit team' : 'din arbejdsdag') + ' faktisk fungerer — som ét sammenhængende system, hvor intet område står alene. Forstår du denne dynamik, forstår du også hvorfor forandring kræver mere end én isoleret indsats.</p>';

    // === SECTION 1: Balance ===
    html += '<div class="dynamik-section">';
    html += '<h3 class="dynamik-section-title">Når alt er i balance</h3>';

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
      html += '<text x="'+c.x+'" y="'+(c.y-6)+'" fill="#fff" font-family="Georgia,serif" font-size="12" text-anchor="middle">'+cLabels[c.idx].l1+'</text>';
      html += '<text x="'+c.x+'" y="'+(c.y+10)+'" fill="#fff" font-family="Georgia,serif" font-size="12" text-anchor="middle">'+cLabels[c.idx].l2+'</text>';
    });
    html += '</svg>';
    html += '<p class="dynamik-svg-caption">Systemet i balance — alle områder støtter hinanden</p>';
    html += '</div>';

    if (erLeder) {
      html += '<p class="dynamik-text">Når dit team fungerer, arbejder alle syv dimensioner sammen i en gensidig vekselvirkning. Stressregulering bærer kulturen. Åndedræt og pauser giver plads til recovery. Lederskabet skaber tryghed. Samarbejdsmønstre er fleksible nok til at rumme konflikter uden at bryde ned.</p>';
      html += '<p class="dynamik-text">I denne tilstand er teamets nervesystemer regulerede. Der er plads til kreativitet, ærlighed og innovation. Konflikter håndteres konstruktivt. Folk har overskud til hinanden — og til sig selv. Det er denne tilstand, der skaber psykologisk tryghed.</p>';
    } else {
      html += '<p class="dynamik-text">Når din arbejdsdag fungerer, arbejder alle syv dimensioner sammen i en gensidig vekselvirkning. Stressregulering bærer hverdagen. Åndedræt og pauser giver plads til genopladning. Din relation til ledelse og kolleger er tryg. Og dine samarbejdsmønstre er fleksible nok til at rumme konflikter uden at bryde sammen.</p>';
      html += '<p class="dynamik-text">I denne tilstand er dit nervesystem reguleret. Du har adgang til kreativitet, empati og overblik. Kroppen er afslappet men energisk, åndedrættet er dybt og roligt, og du føler dig tilstede. Det er denne tilstand, der gør godt arbejde muligt.</p>';
    }
    html += '<p class="dynamik-text">Læg mærke til figuren. Symmetrien. De lige afstande. Forbindelseslinjerne der fordeler sig jævnt. Du kan se det med det samme — her er noget der fungerer.</p>';
    html += '</div>';

    // === SECTION 2: Under pressure ===
    html += '<div class="dynamik-section">';
    html += '<h3 class="dynamik-section-title">Når systemet er under pres</h3>';

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
      html += '<text x="'+c.x+'" y="'+(c.y-5)+'" fill="#fff" font-family="Georgia,serif" font-size="11" text-anchor="middle">'+cLabels[c.idx].l1+'</text>';
      html += '<text x="'+c.x+'" y="'+(c.y+9)+'" fill="#fff" font-family="Georgia,serif" font-size="11" text-anchor="middle">'+cLabels[c.idx].l2+'</text>';
    });
    html += '</svg>';
    html += '<p class="dynamik-svg-caption">Systemet under pres — symmetrien er brudt</p>';
    html += '</div>';

    if (erLeder) {
      html += '<p class="dynamik-text">Men arbejdsdagen ser ikke altid sådan ud. Omstruktureringer, deadlines, konflikter, personalemangel, dårlig ledelse ovenfra — alt dette trækker teamet ud af balance. Og det sker ikke isoleret. Når ét område belastes, mærker alle de andre det.</p>';
      html += '<p class="dynamik-text">Se på figuren. Sammenlign den med den forrige. Symmetrien er brudt. Nogle cirkler er trukket tættere sammen, andre skubbet fra hinanden. Det er præcis sådan det føles i et team under pres — noget er skævt, men det er svært at sætte fingeren på hvad.</p>';
    } else {
      html += '<p class="dynamik-text">Men arbejdsdagen ser ikke altid sådan ud. Deadlines, konflikter, konstante afbrydelser, dårlig ledelse, for mange opgaver — alt dette trækker dig ud af balance. Og det sker ikke isoleret. Når ét område belastes, mærker alle de andre det.</p>';
      html += '<p class="dynamik-text">Se på figuren. Sammenlign den med den forrige. Symmetrien er brudt. Nogle cirkler er trukket tættere sammen, andre skubbet fra hinanden. Cirklerne har ændret størrelse — det er præcis sådan det føles når du er presset. Noget er skævt, men det er svært at sætte fingeren på hvad det egentlig er.</p>';
    }
    html += '<p class="dynamik-text">Og det er fordi det ikke er ét enkelt problem. Det er hele systemet der er trukket ud af sin naturlige balance.</p>';
    html += '</div>';

    // === SECTION 3: One area dominates ===
    html += '<div class="dynamik-section">';
    html += '<h3 class="dynamik-section-title">Når ét område dominerer</h3>';

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
    var domLabel = erLeder ? {l1:'Kulturelt',l2:'pres'} : {l1:'Uadresseret',l2:'stress'};
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
      html += '<text x="'+c.x+'" y="'+(c.y-5)+'" fill="#fff" font-family="Georgia,serif" font-size="10" text-anchor="middle">'+cLabels[c.idx].l1+'</text>';
      html += '<text x="'+c.x+'" y="'+(c.y+8)+'" fill="#fff" font-family="Georgia,serif" font-size="10" text-anchor="middle">'+cLabels[c.idx].l2+'</text>';
    });
    html += '</svg>';
    html += '<p class="dynamik-svg-caption">' + (erLeder ? 'Kulturelt pres trækker hele teamets system mod sig' : 'Uadresseret stress trækker hele dit system ud af balance') + '</p>';
    html += '</div>';

    if (erLeder) {
      html += '<p class="dynamik-text">Lad os se nærmere på hvad der sker, når ét specifikt område er under pres — for eksempel kulturelt pres fra organisationen: urealistiske forventninger, manglende ressourcer, eller en ledelse der presser uden at lytte.</p>';
      html += '<p class="dynamik-text">Presset bliver ikke i sin egen cirkel. Det udvider sig. Det fylder mere. Og i takt med at det vokser, trækker det alle andre områder ud af deres naturlige position:</p>';
      html += '<ul class="dynamik-list">';
      html += '<li><strong>Tre tilstande:</strong> Teamet skifter fra grøn til vedvarende gul alarm. Folk kører på adrenalin. Fejlene stiger. Irritation erstatter samarbejde.</li>';
      html += '<li><strong>Lederskab & kultur:</strong> Din ledelse bliver reaktiv i stedet for strategisk. Du slukker brande i stedet for at bygge. Din regulering falder, og teamet mærker det øjeblikkeligt.</li>';
      html += '<li><strong>Samarbejdsmønstre:</strong> Samarbejdet stivner. Folk trækker sig ind i siloer. Konflikter håndteres ikke — de parkeres og ulmer.</li>';
      html += '<li><strong>Krop & bevægelse:</strong> Pauser forsvinder. Folk spiser ved skærmen. Skuldrene sidder oppe ved ørerne hele dagen. Sygefraværet stiger stille og roligt.</li>';
      html += '<li><strong>Åndedræt & pauser:</strong> Ingen tager pauser. Åndedrættet er overfladisk. Nervesystemet sidder fast i aktivering — og det smitter fra leder til medarbejder.</li>';
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
    html += '<p class="dynamik-text">Det er ikke svaghed. Det er nervesystemets forsøg på at klare sig. Men prisen er, at hele systemets balance går tabt.</p>';
    html += '</div>';

    // === SECTION 4: Multiple areas ===
    html += '<div class="dynamik-section">';
    html += '<h3 class="dynamik-section-title">Når flere områder belastes samtidig</h3>';

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
      html += '<text x="'+c.x+'" y="'+(c.y-5)+'" fill="#fff" font-family="Georgia,serif" font-size="10" text-anchor="middle">'+cLabels[c.idx].l1+'</text>';
      html += '<text x="'+c.x+'" y="'+(c.y+8)+'" fill="#fff" font-family="Georgia,serif" font-size="10" text-anchor="middle">'+cLabels[c.idx].l2+'</text>';
    });
    html += '</svg>';
    html += '<p class="dynamik-svg-caption">Flere områder under pres — systemet trækkes i flere retninger</p>';
    html += '</div>';

    if (erLeder) {
      html += '<p class="dynamik-text">I virkeligheden er det sjældent kun ét område, der er belastet. Et team med kulturelt pres har ofte også dårlige samarbejdsmønstre OG udbrændte medarbejdere OG fravær af pauser OG en leder der selv er dysreguleret. Hvert presset område forstærker de andre.</p>';
      html += '<p class="dynamik-text">Det er derfor isolerede tiltag ofte rammer et loft. At indføre mindfulness-app uden at adressere arbejdsbyrden. At sende medarbejdere på stresshåndteringskursus uden at ændre kulturen. At tale om psykologisk tryghed uden at modellere den. Hvert tiltag kan noget — men ingen af dem alene kan genskabe balancen i et system, der trækkes i flere retninger samtidig.</p>';
    } else {
      html += '<p class="dynamik-text">I virkeligheden er det sjældent kun ét område, der er belastet. En medarbejder med kronisk stress har ofte også forstyrret søvn OG spændt krop OG samarbejdsproblemer OG en leder der ikke ser det. Hvert presset område forstærker de andre.</p>';
      html += '<p class="dynamik-text">Det er derfor isolerede løsninger ofte rammer et loft. At tage en yogaklasse uden at adressere arbejdspresset. At lære åndedrætøvelser uden at tage pauserne. At tale om stress uden at ændre det der skaber det. Hver tilgang kan noget — men ingen af dem alene kan genskabe balancen i et system, der trækkes i flere retninger.</p>';
    }
    html += '</div>';

    // === SECTION 5: Why wholeness matters ===
    html += '<div class="dynamik-section">';
    html += '<h3 class="dynamik-section-title">Hvorfor helheden er afgørende</h3>';
    if (erLeder) {
      html += '<p class="dynamik-text">Cirkelmodellen er ikke bare et kort — den er en ledelsesfilosofi. Når vi forstår, at alt påvirker alt i et team, ændrer det måden vi arbejder med trivsel på. Vi adresserer ikke symptomer. Vi adresserer systemet.</p>';
      html += '<p class="dynamik-text">Det er derfor Clements tilgang integrerer nervesystemsforståelse med ledelsesudvikling, teamdynamik og kropslig bevidsthed. Ikke fordi kompleksitet er målet, men fordi arbejdspladsen selv er en integreret helhed. Balance vender tilbage, når vi møder teamet med omsorg, med struktur, og med forståelse for at forandring i ét menneske skaber bevægelse i hele systemet.</p>';
    } else {
      html += '<p class="dynamik-text">Cirkelmodellen er ikke bare et kort — den er en livsfilosofi for dit arbejdsliv. Når du forstår, at alt påvirker alt i din arbejdsdag, ændrer det måden du arbejder med din egen trivsel. Du adresserer ikke bare symptomer. Du adresserer systemet.</p>';
      html += '<p class="dynamik-text">Det er derfor Clements tilgang integrerer nervesystemsforståelse med kropslig bevidsthed, åndedrætsarbejde og relationel intelligens. Ikke fordi kompleksitet er målet, men fordi din arbejdsdag selv er en integreret helhed. Balance vender tilbage, når du giver dig selv lov til at arbejde med hele systemet — en øvelse, en pause, en grænse ad gangen.</p>';
    }
    html += '</div>';

    // === Callout: For dig ===
    html += '<div class="dynamik-callout">';
    if (erLeder) {
      html += '<h3 class="dynamik-callout-title">For dig som leder</h3>';
      html += '<p class="dynamik-text">Når du ser den skæve figur, genkender du måske dit eget team. Den fornemmelse af at alt er lidt forskudt — at I arbejder hårdt, men ikke kan nå hinanden. At energien lækker et sted, du ikke kan se.</p>';
      html += '<p class="dynamik-text">Vid at det ikke er permanent. Dit team har kapaciteten til balance — det har bare brug for de rette betingelser for at finde tilbage. Og de betingelser starter med dig: din egen regulering, din evne til at sætte grænser, din vilje til at prioritere trivsel over tempo.</p>';
      html += '<p class="dynamik-text">Udforsk cirklerne ovenfor. Start der, hvor du mærker mest pres. Og vid, at uanset hvor du begynder, arbejder du med hele systemet.</p>';
    } else {
      html += '<h3 class="dynamik-callout-title">For dig</h3>';
      html += '<p class="dynamik-text">Når du ser den skæve figur, genkender du måske din egen hverdag. Den fornemmelse af at alt er lidt forskudt — at du gør dit bedste, men alligevel føler dig udmattet, afkoblet eller ude af balance.</p>';
      html += '<p class="dynamik-text">Vid at det ikke er din skyld. Dit nervesystem reagerer rationelt på de betingelser, det møder. Og vid at forandring er mulig — ikke alt på én gang, men ét område ad gangen. Én øvelse. Én pause. Én grænse. Hver lille bevægelse sender bølger gennem hele systemet.</p>';
      html += '<p class="dynamik-text">Udforsk cirklerne ovenfor. Start der, hvor du mærker mest. Og vid, at uanset hvor du begynder, arbejder du med hele dit system.</p>';
    }
    html += '</div>';

    // Back to top
    html += '<button class="dynamik-to-top" onclick="window.scrollTo({top:0,behavior:\'smooth\'})">↑ Tilbage til toppen</button>';

    container.innerHTML = html;
  }

  function showDynamik() {
    renderDynamik();
    navigateTo('dynamik');
  }

  // ── Favoritter view ──
  function renderFavoritter() {
    var container = document.getElementById('favoritterContent');
    if (!container) return;
    var fav = getFavoritter();

    if (fav.length === 0) {
      container.innerHTML = '<div class="favoritter-empty">' +
        '<div class="favoritter-empty-icon">' + IKONER.bookmark(32) + '</div>' +
        '<p>Du har ikke gemt noget endnu.</p>' +
        '<p class="favoritter-empty-hint">Tryk på ' + IKONER.bookmark(14) + ' Gem når du finder indhold, du vil vende tilbage til.</p>' +
        '</div>';
      return;
    }

    var typeLabels = { oevelse: 'Øvelse', fordybelse: 'Fordybelse', trappen: 'Nervesystemet', tema: 'Tema' };
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
          '<div class="favoritter-item-dato">Gemt ' + f.dato + '</div>' +
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
    var rolleText = aktivPerspektiv === 'leder' ? 'leder' : (aktivPerspektiv === 'virksomhed' ? 'virksomhed' : 'medarbejder');
    var rolleIcon = aktivPerspektiv === 'leder' ? '◈' : (aktivPerspektiv === 'virksomhed' ? '◆' : '◉');
    var html = '';

    // ── Dit perspektiv ──
    html += '<div class="menu-section">';
    html += '<div class="menu-section-title">Dit perspektiv</div>';
    html += '<div class="menu-perspektiv">';
    html += '<span class="menu-perspektiv-icon">' + rolleIcon + '</span>';
    html += '<span class="menu-perspektiv-label">' + rolleText.charAt(0).toUpperCase() + rolleText.slice(1) + '</span>';
    html += '</div>';
    html += '<button class="menu-rolle-btn" id="menuRolleSkift">→ Skift perspektiv</button>';
    html += '</div>';

    html += '<div class="menu-divider"></div>';

    // ── Om Anne Marie Clement ──
    html += '<div class="menu-section menu-about-section">';
    html += '<div class="menu-section-title">Om Anne Marie Clement</div>';
    html += '<div class="menu-about-photo-wrap"><img src="assets/images/hero.png" alt="Anne Marie Clement" class="menu-about-photo"></div>';
    html += '<p class="menu-about-bio">Anne Marie Clement er nervesystemsspecialist med over 20 års erfaring. ';
    html += 'Hun tilbyder foredrag, workshops og forløb for virksomheder — og individuel coaching for ledere og medarbejdere. ';
    html += 'Hendes tilgang bygger på polyvagal teori, tilknytningsforskning og kropslig bevidsthed — oversat til praktiske redskaber der virker i hverdagen.</p>';
    html += '</div>';

    html += '<div class="menu-divider"></div>';

    // ── Navigation ──
    html += '<div class="menu-section">';
    html += '<div class="menu-section-title">Navigation</div>';
    html += '<button class="menu-item" data-nav="hjem"><span class="menu-item-icon">◉</span>Hjem</button>';
    html += '<button class="menu-item" data-nav="trappen"><span class="menu-item-icon">☰</span>Nervesystemets trappe</button>';
    html += '<button class="menu-item" data-nav="temaer"><span class="menu-item-icon">◈</span>Temaer</button>';
    html += '<button class="menu-item" data-nav="oevelser"><span class="menu-item-icon">◎</span>Øvelser</button>';
    html += '<button class="menu-item" data-nav="dynamik"><span class="menu-item-icon">⬡</span>Dynamikken bag cirkelmodellen</button>';
    html += '<button class="menu-item menu-item-virksomhed" data-nav="virksomhed"><span class="menu-item-icon">◆</span>Samarbejde med virksomheder</button>';
    var favCount = getFavoritter().length;
    html += '<button class="menu-item menu-item-favoritter" id="menuFavoritter"><span class="menu-item-icon">' + IKONER.bookmark(15) + '</span>Mine favoritter <span class="menu-favorit-badge" id="favoritBadge" style="' + (favCount > 0 ? '' : 'display:none') + '">' + favCount + '</span></button>';
    html += '</div>';

    html += '<div class="menu-divider"></div>';

    // ── Kontakt ──
    html += '<div class="menu-section">';
    html += '<div class="menu-section-title">Kontakt</div>';
    html += '<a class="menu-contact-item" href="tel:+4540301085"><span class="menu-contact-icon">✆</span>+45 40 30 10 85</a>';
    html += '<a class="menu-contact-item" href="mailto:annemarie@clement.dk"><span class="menu-contact-icon">✉</span>annemarie@clement.dk</a>';
    html += '<a class="menu-contact-item" href="https://www.linkedin.com/in/annemarie-clement/" target="_blank" rel="noopener"><span class="menu-contact-icon">in</span>LinkedIn</a>';
    html += '<a class="menu-contact-item" href="https://www.instagram.com/annemarieclementt/" target="_blank" rel="noopener"><span class="menu-contact-icon">✦</span>Instagram</a>';
    html += '<a class="menu-contact-item" href="https://www.clement.dk" target="_blank" rel="noopener"><span class="menu-contact-icon">⊕</span>Hjemmeside</a>';
    html += '</div>';

    html += '<div class="menu-divider"></div>';

    // ── Indstillinger ──
    html += '<div class="menu-section">';
    html += '<div class="menu-section-title">Indstillinger</div>';

    html += '<div class="menu-setting">';
    html += '<div class="menu-setting-row">';
    html += '<div class="menu-setting-info"><span class="menu-setting-name">Daglig påmindelse</span>';
    html += '<span class="menu-setting-desc">En blid påmindelse om at tage en pause</span></div>';
    html += '<label class="menu-toggle"><input type="checkbox" checked data-setting="daglig"><span class="toggle-track"><span class="toggle-thumb"></span></span></label>';
    html += '</div>';
    html += '</div>';

    html += '<div class="menu-setting">';
    html += '<div class="menu-setting-row">';
    html += '<div class="menu-setting-info"><span class="menu-setting-name">Morgen check-in</span>';
    html += '<span class="menu-setting-desc">Start dagen med en kort reguleringsøvelse</span></div>';
    html += '<label class="menu-toggle"><input type="checkbox" checked data-setting="morgen"><span class="toggle-track"><span class="toggle-thumb"></span></span></label>';
    html += '</div>';
    html += '</div>';

    html += '<div class="menu-setting">';
    html += '<div class="menu-setting-row">';
    html += '<div class="menu-setting-info"><span class="menu-setting-name">Ugentlig opsummering</span>';
    html += '<span class="menu-setting-desc">Overblik over din uges trivsel og øvelser</span></div>';
    html += '<label class="menu-toggle"><input type="checkbox" checked data-setting="ugentlig"><span class="toggle-track"><span class="toggle-thumb"></span></span></label>';
    html += '</div>';
    html += '</div>';

    html += '</div>';

    html += '<div class="menu-divider"></div>';

    // ── Privatliv & data ──
    html += '<div class="menu-section">';
    html += '<div class="menu-section-title">Privatliv & data</div>';
    html += '<p class="menu-privacy-text">Denne app gemmer kun data lokalt på din enhed. Ingen sporing, ingen cookies, ingen tredjeparter.</p>';

    html += '<button class="menu-text-btn menu-text-btn-share" data-action="share">✦ Del Clement Firma</button>';
    html += '<button class="menu-text-btn menu-text-btn-delete" data-action="sletdata">✕ Nulstil alle data</button>';
    html += '</div>';

    html += '<div class="menu-divider"></div>';

    // ── Om appen ──
    html += '<div class="menu-section menu-section-footer">';
    html += '<p class="menu-footer-version">Clement Firma v1.0</p>';
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
          title: 'Clement Firma',
          text: 'Trivsel på arbejdspladsen — baseret på nervesystemets intelligens',
          url: window.location.href
        };
        if (navigator.share) {
          navigator.share(shareData).catch(function() {});
        } else {
          navigator.clipboard.writeText(shareData.url).then(function() {
            shareBtn.textContent = '✓ Link kopieret!';
            setTimeout(function() { shareBtn.textContent = '✦ Del Clement Firma'; }, 2000);
          }).catch(function() {});
        }
      });
    }

    // Bind delete data button
    var deleteBtn = menuContent.querySelector('[data-action="sletdata"]');
    if (deleteBtn) {
      deleteBtn.addEventListener('click', function() {
        if (confirm('Er du sikker? Dette sletter alle dine gemte data, favoritter og procesnotater.')) {
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
  var SEARCH_TAGS = [
    'Stress', 'Åndedræt', 'Nervesystem', 'Pauser',
    'Samarbejde', 'Ledelse', 'Resiliens', 'Krop',
    'Regulering', 'Tilknytning'
  ];

  function renderSearchTags() {
    var html = '';
    SEARCH_TAGS.forEach(function(tag) {
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
    searchResults.innerHTML = '<div class="search-empty">Søg efter et emne eller tryk på et tag</div>';
    searchTags.querySelectorAll('.search-tag').forEach(function(t) { t.classList.remove('active'); });
    setTimeout(function() { searchInput.focus(); }, 100);
  }

  function closeSearch() {
    searchOverlay.classList.remove('visible');
    searchInput.blur();
  }

  function performSearch(query) {
    if (!query || query.trim().length === 0) {
      searchResults.innerHTML = '<div class="search-empty">Søg efter et emne eller tryk på et tag</div>';
      return;
    }

    var q = query.toLowerCase().trim();
    var results = [];

    // Search CIRKLER
    var cirkelKeys = Object.keys(CIRKLER);
    cirkelKeys.forEach(function(key) {
      var c = CIRKLER[key];
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
          type: 'Cirkel',
          title: c.titel,
          snippet: snippet.substring(0, 120) + (snippet.length > 120 ? '...' : ''),
          action: function() { navigateTo('cirkel/' + key); aktivCirkel = key; renderCirkelDetail(key); }
        });
      }
    });

    // Search TEMA_INDHOLD
    var temaKeys = Object.keys(TEMA_INDHOLD);
    temaKeys.forEach(function(key) {
      var t = TEMA_INDHOLD[key];
      var indhold = t[getDataPerspektiv()];
      var match = false;
      var snippet = '';

      if (t.titel.toLowerCase().indexOf(q) !== -1) { match = true; snippet = indhold.intro; }
      if (!match && indhold.intro.toLowerCase().indexOf(q) !== -1) { match = true; snippet = indhold.intro; }
      if (!match && indhold.tekst.toLowerCase().indexOf(q) !== -1) { match = true; snippet = indhold.tekst; }

      if (match) {
        results.push({
          type: 'Tema',
          title: t.titel,
          snippet: snippet.substring(0, 120) + (snippet.length > 120 ? '...' : ''),
          action: function() { navigateTo('temaer'); setTimeout(function() { aktivTema = key; visTemaDetalje(key); }, 100); }
        });
      }
    });

    // Search TRAPPEN
    var trinKeys = Object.keys(TRAPPEN);
    trinKeys.forEach(function(key) {
      var t = TRAPPEN[key];
      var indhold = t[getDataPerspektiv()];
      var match = false;
      var snippet = '';

      if (t.navn.toLowerCase().indexOf(q) !== -1) { match = true; snippet = indhold.beskrivelse; }
      if (!match && indhold.beskrivelse.toLowerCase().indexOf(q) !== -1) { match = true; snippet = indhold.beskrivelse; }
      if (!match && indhold.handling.toLowerCase().indexOf(q) !== -1) { match = true; snippet = indhold.handling; }

      if (match) {
        results.push({
          type: 'Nervesystemstrappen',
          title: t.navn,
          snippet: snippet.substring(0, 120) + (snippet.length > 120 ? '...' : ''),
          action: function() { navigateTo('trappen'); setTimeout(function() { aktivTrin = key; visTrappenSvar(key); }, 100); }
        });
      }
    });

    // Search SAMMENHAENGE
    var sammKeys = Object.keys(SAMMENHAENGE);
    sammKeys.forEach(function(key) {
      var s = SAMMENHAENGE[key];
      var tekst = s[getDataPerspektiv()];
      if (tekst && tekst.toLowerCase().indexOf(q) !== -1) {
        var parts = key.split('-');
        var c1 = CIRKEL_NAVNE[parts[0]] || parts[0];
        var c2 = CIRKEL_NAVNE[parts[1]] || parts[1];
        results.push({
          type: 'Sammenhæng',
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
    OEVELSER.forEach(function(o, idx) {
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
          type: 'Øvelse',
          title: o.titel,
          snippet: snippet.substring(0, 120) + (snippet.length > 120 ? '...' : ''),
          action: function() { navigateTo('oevelser'); }
        });
      }
    });

    // Render results
    if (results.length === 0) {
      searchResults.innerHTML = '<div class="search-empty">Ingen resultater for "' + query + '"</div>';
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
      searchResults.innerHTML = '<div class="search-empty">Søg efter et emne eller tryk på et tag</div>';
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
      velkommenTitel.textContent = 'Velkommen. Dit nervesystem sætter tonen for hele dit team.';
      velkommenTekst.textContent = 'Denne app giver dig redskaber til at forstå og regulere dit eget nervesystem — og skabe de betingelser, der lader dine medarbejdere trives. Bygget på Anne Marie Clements 20 års erfaring med nervesystemet som nøgle til trivsel. Udforsk de syv dimensioner nedenfor.';
    } else {
      velkommenTitel.textContent = 'Velkommen. Din trivsel begynder i dit nervesystem.';
      velkommenTekst.textContent = 'Denne app er dit personlige rum for balance på arbejdspladsen — med øvelser, viden og redskaber baseret på Anne Marie Clements 20 års arbejde med nervesystemet. Syv dimensioner, der tilsammen skaber trivsel i din hverdag. Start hvor det føles rigtigt.';
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

    // Inline SVG helpers for this page
    var svgBuilding = '<svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="2" width="16" height="20" rx="2"/><line x1="9" y1="6" x2="9" y2="6.01"/><line x1="15" y1="6" x2="15" y2="6.01"/><line x1="9" y1="10" x2="9" y2="10.01"/><line x1="15" y1="10" x2="15" y2="10.01"/><line x1="9" y1="14" x2="9" y2="14.01"/><line x1="15" y1="14" x2="15" y2="14.01"/><line x1="9" y1="18" x2="15" y2="18"/></svg>';
    var svgChevDown = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="6 9 12 15 18 9"/></svg>';
    var svgLeaf = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66.95-2.3c.48.17.98.3 1.34.3C19 20 22 3 22 3c-1 2-8 2.25-13 3.25S2 11.5 2 13.5s1.75 3.75 1.75 3.75"/></svg>';
    var svgLightning = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>';
    var svgChat = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>';
    var svgWind = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2"/></svg>';
    var svgUsers = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>';
    var svgHeart = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>';
    var svgTarget = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>';
    var svgBrain = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a4 4 0 0 0-4 4c0 .74.2 1.43.56 2.03A4 4 0 0 0 6 12c0 .74.2 1.43.56 2.03A4 4 0 0 0 6 16a4 4 0 0 0 4 4h0a4 4 0 0 0 4-4c0-.74-.2-1.43-.56-2.03A4 4 0 0 0 14 12c0-.74-.2-1.43-.56-2.03A4 4 0 0 0 14 6a4 4 0 0 0-2-4z"/><path d="M12 2v20"/></svg>';
    var svgMail = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><polyline points="22,6 12,13 2,6"/></svg>';
    var svgPhone = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>';
    var svgLinkedIn = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>';

    var html = '';

    // ===== Welcome Landing =====
    html += '<div class="virksomhed-welcome">';
    html += '<div class="virksomhed-welcome-inner">';
    html += '<div class="virksomhed-welcome-medallion">';
    html += '<div class="virksomhed-welcome-circle">' + svgBuilding + '</div>';
    html += '</div>';
    html += '<h2 class="virksomhed-welcome-title">Trivsel der mærkes — hele vejen ind i organisationen</h2>';
    html += '<p class="virksomhed-welcome-subtitle">Til dig, der overvejer et samarbejde med Anne Marie Clement</p>';
    html += '<p class="virksomhed-welcome-text">Anne Marie Clement har i over 20 år arbejdet med nervesystemet som nøgle til trivsel, balance og bæredygtig performance. Hendes tilgang bygger på polyvagal teori, tilknytningsforskning og kropslig bevidsthed — oversat til redskaber, der virker i rigtige arbejdsliv.</p>';
    html += '<p class="virksomhed-welcome-text">Nedenfor kan du læse om samarbejdsformer, tilgang og erfaring. Du er også velkommen til at udforske hele appen — cirkelmodellen, temaer, øvelser og nervesystemets trappe — som giver et indblik i det faglige fundament bag arbejdet.</p>';
    html += '<div class="virksomhed-welcome-scroll">';
    html += '<button class="virksomhed-welcome-scroll-btn" id="virksomhedScrollDown">' + svgChevDown + ' Læs mere om samarbejdet</button>';
    html += '</div>';
    html += '</div>';
    html += '</div>';

    // ===== Quick-nav to rest of app =====
    html += '<div class="virksomhed-appnav">';
    html += '<p class="virksomhed-appnav-label">Udforsk det faglige fundament</p>';
    html += '<div class="virksomhed-appnav-grid">';
    html += '<button class="virksomhed-appnav-btn" data-goto="hjem">' + svgLeaf + '<span>Cirkelmodellen</span></button>';
    html += '<button class="virksomhed-appnav-btn" data-goto="trappen">' + svgLightning + '<span>Nervesystemets trappe</span></button>';
    html += '<button class="virksomhed-appnav-btn" data-goto="temaer">' + svgChat + '<span>Temaer</span></button>';
    html += '<button class="virksomhed-appnav-btn" data-goto="oevelser">' + svgWind + '<span>Øvelser</span></button>';
    html += '</div>';
    html += '</div>';

    // ===== Faglig præsentation =====
    html += '<div class="virksomhed-faglig" id="virksomhedFaglig">';

    // Section: Hvad Anne Marie tilbyder virksomheder
    html += '<div class="virksomhed-section">';
    html += '<h3 class="virksomhed-section-title">Hvad adskiller Anne Maries tilgang?</h3>';
    html += '<p class="virksomhed-text">De fleste trivselsforløb handler om at lære at håndtere stress. Anne Marie går et lag dybere — hun arbejder med nervesystemet som nøgle til både individuel trivsel og sund arbejdskultur.</p>';

    html += '<div class="virksomhed-cards">';
    html += '<div class="virksomhed-card virksomhed-card-primary">';
    html += '<div class="virksomhed-card-icon">' + svgBrain + '</div>';
    html += '<h4>Polyvagal forståelse</h4>';
    html += '<p>Porges\' polyvagale teori giver et præcist sprog for, hvorfor vi reagerer som vi gør under pres. Det flytter fokus fra skyld og viljestyring til nervesystem — og åbner for reel, varig forandring.</p>';
    html += '</div>';

    html += '<div class="virksomhed-card virksomhed-card-rose">';
    html += '<div class="virksomhed-card-icon">' + svgHeart + '</div>';
    html += '<h4>Kropslig bevidsthed</h4>';
    html += '<p>Mange medarbejdere lever med et nervesystem i konstant alarmberedskab uden at vide det. Anne Marie giver konkrete, diskrete redskaber til at regulere sig selv — midt i arbejdsdagen.</p>';
    html += '</div>';

    html += '<div class="virksomhed-card virksomhed-card-amber">';
    html += '<div class="virksomhed-card-icon">' + svgUsers + '</div>';
    html += '<h4>Relationel intelligens</h4>';
    html += '<p>Samarbejde handler om nervesystemer, der mødes. Anne Marie hjælper teams med at forstå, hvordan deres tilstande smitter — og hvordan de kan skabe psykologisk tryghed sammen.</p>';
    html += '</div>';

    html += '<div class="virksomhed-card virksomhed-card-sage">';
    html += '<div class="virksomhed-card-icon">' + svgTarget + '</div>';
    html += '<h4>Bæredygtig performance</h4>';
    html += '<p>Ægte produktivitet kommer ikke fra pres, men fra regulerede nervesystemer. Anne Marie arbejder med at skabe betingelser, hvor høj performance og trivsel ikke er modsætninger.</p>';
    html += '</div>';
    html += '</div>';
    html += '</div>';

    // Section: Samarbejdsformer
    html += '<div class="virksomhed-section">';
    html += '<h3 class="virksomhed-section-title">Konkrete samarbejdsformer</h3>';
    html += '<p class="virksomhed-text">Anne Marie tilbyder fleksible forløb, der kan tilpasses jeres organisations størrelse, behov og ambitionsniveau.</p>';

    html += '<div class="virksomhed-forloeb">';

    html += '<div class="virksomhed-forloeb-item">';
    html += '<div class="virksomhed-forloeb-header">';
    html += '<span class="virksomhed-forloeb-tag">Keynote</span>';
    html += '<h4>Foredrag & keynotes</h4>';
    html += '</div>';
    html += '<p>Anne Marie holder foredrag der bevæger — bogstaveligt. Deltagerne får ikke bare viden, men en kropslig erfaring af, hvad regulering betyder. Velegnet til kick-offs, ledersamlinger og trivselsarrangementer.</p>';
    html += '<div class="virksomhed-forloeb-detaljer">';
    html += '<span>60-90 minutter</span><span>Op til 500 deltagere</span><span>Interaktive elementer</span>';
    html += '</div>';
    html += '</div>';

    html += '<div class="virksomhed-forloeb-item">';
    html += '<div class="virksomhed-forloeb-header">';
    html += '<span class="virksomhed-forloeb-tag">Workshop</span>';
    html += '<h4>Teamworkshops</h4>';
    html += '</div>';
    html += '<p>Halv- eller heldagsworkshops hvor teams lærer at genkende egne og hinandens nervesystemtilstande — og får konkrete redskaber til at regulere sig selv og støtte hinanden i hverdagen.</p>';
    html += '<div class="virksomhed-forloeb-detaljer">';
    html += '<span>3-7 timer</span><span>8-30 deltagere</span><span>Skræddersyet indhold</span>';
    html += '</div>';
    html += '</div>';

    html += '<div class="virksomhed-forloeb-item">';
    html += '<div class="virksomhed-forloeb-header">';
    html += '<span class="virksomhed-forloeb-tag virksomhed-forloeb-tag-alt">Forløb</span>';
    html += '<h4>Lederudviklingsforløb</h4>';
    html += '</div>';
    html += '<p>Et sammenhængende forløb for ledere, der vil forstå, hvordan deres eget nervesystem sætter tonen for hele teamet. Kombinerer teori, personlig refleksion og praktiske redskaber.</p>';
    html += '<div class="virksomhed-forloeb-detaljer">';
    html += '<span>4-8 sessioner</span><span>Individuel sparring</span><span>Handlingsplaner</span>';
    html += '</div>';
    html += '</div>';

    html += '<div class="virksomhed-forloeb-item">';
    html += '<div class="virksomhed-forloeb-header">';
    html += '<span class="virksomhed-forloeb-tag virksomhed-forloeb-tag-alt">App</span>';
    html += '<h4>Denne app til jeres medarbejdere</h4>';
    html += '</div>';
    html += '<p>Clement Firma kan bruges som et supplerende redskab i et samarbejde — en app jeres medarbejdere kan bruge diskret i hverdagen til regulering, pauser og forståelse af eget nervesystem.</p>';
    html += '<div class="virksomhed-forloeb-detaljer">';
    html += '<span>Tilpasset jeres organisation</span><span>Selvstændigt eller som supplement</span>';
    html += '</div>';
    html += '</div>';

    html += '</div>';
    html += '</div>';

    // Section: Erfaring / kendte virksomheder
    html += '<div class="virksomhed-section">';
    html += '<h3 class="virksomhed-section-title">Erfaring med store organisationer</h3>';
    html += '<p class="virksomhed-text">Anne Marie har samarbejdet med nogle af Danmarks mest ambitiøse virksomheder om at skabe arbejdspladser, hvor mennesker trives og performer:</p>';

    html += '<div class="virksomhed-logoer">';
    html += '<div class="virksomhed-logo-item"><span class="virksomhed-logo-navn">Novo Nordisk</span></div>';
    html += '<div class="virksomhed-logo-item"><span class="virksomhed-logo-navn">Unilever</span></div>';
    html += '<div class="virksomhed-logo-item"><span class="virksomhed-logo-navn">PFA</span></div>';
    html += '<div class="virksomhed-logo-item"><span class="virksomhed-logo-navn">TV2</span></div>';
    html += '</div>';

    html += '<p class="virksomhed-text" style="margin-top: 16px;">Fælles for disse samarbejder er, at de gik ud over overfladen — og ind i det, der virkelig flytter: en grundlæggende forståelse af, hvordan nervesystemet påvirker alt fra beslutningsevne til samarbejde.</p>';
    html += '</div>';

    // Section: Hvem henvender det sig til
    html += '<div class="virksomhed-section">';
    html += '<h3 class="virksomhed-section-title">Hvem er det relevant for?</h3>';
    html += '<p class="virksomhed-text">Anne Maries tilgang er relevant for organisationer, der oplever:</p>';
    html += '<ul class="virksomhed-list">';
    html += '<li><strong>Højt stressniveau</strong> — medarbejdere der kører på autopilot uden at mærke signalerne</li>';
    html += '<li><strong>Konflikter i teams</strong> — samarbejdsmønstre der afspejler dysregulerede nervesystemer</li>';
    html += '<li><strong>Ledere under pres</strong> — der ubevidst smitter deres stress videre til teamet</li>';
    html += '<li><strong>Høj personaleudskiftning</strong> — hvor trivslen ikke holder folk fastholdt</li>';
    html += '<li><strong>Forandringstræthed</strong> — organisationer der har brug for en ny indgang til trivsel</li>';
    html += '<li><strong>Ambition om bæredygtig kultur</strong> — virksomheder der vil investere i mennesker, ikke kun processer</li>';
    html += '</ul>';
    html += '</div>';

    html += '</div>'; // end .virksomhed-faglig

    // ===== Bridge section =====
    html += '<div class="virksomhed-bridge">';
    html += '<div class="virksomhed-bridge-inner">';
    html += '<h3 class="virksomhed-bridge-title">Se det faglige fundament</h3>';
    html += '<p class="virksomhed-bridge-text">Denne app er det samme redskab, Anne Marie deler med deltagerne i sine forløb. Udforsk cirkelmodellen, nervesystemets trappe, temaer og øvelser — og se, hvad jeres medarbejdere kan få adgang til.</p>';
    html += '<div class="virksomhed-bridge-btns">';
    html += '<button class="virksomhed-bridge-btn" data-goto="hjem">' + svgLeaf + ' Cirkelmodellen</button>';
    html += '<button class="virksomhed-bridge-btn" data-goto="trappen">' + svgLightning + ' Trappen</button>';
    html += '<button class="virksomhed-bridge-btn" data-goto="temaer">' + svgChat + ' Temaer</button>';
    html += '<button class="virksomhed-bridge-btn" data-goto="oevelser">' + svgWind + ' Øvelser</button>';
    html += '</div>';
    html += '</div>';
    html += '</div>';

    // ===== Contact CTA =====
    html += '<div class="virksomhed-cta">';
    html += '<h3 class="virksomhed-cta-title">Klar til en samtale?</h3>';
    html += '<p class="virksomhed-cta-text">Anne Marie tager gerne en uforpligtende samtale om, hvordan et samarbejde kan se ud for jeres organisation.</p>';
    html += '<div class="virksomhed-cta-info">';
    html += '<a href="mailto:info@clementfirma.dk" class="virksomhed-cta-btn virksomhed-cta-btn-primary">' + svgMail + ' Skriv til Anne Marie</a>';
    html += '<a href="tel:+4500000000" class="virksomhed-cta-btn virksomhed-cta-btn-secondary">' + svgPhone + ' Ring for en samtale</a>';
    html += '<a href="https://linkedin.com" target="_blank" rel="noopener" class="virksomhed-cta-btn virksomhed-cta-btn-linkedin">' + svgLinkedIn + ' Se Anne Maries LinkedIn</a>';
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
        navigateTo(this.getAttribute('data-goto'));
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
