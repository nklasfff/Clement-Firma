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
    var rolleText = aktivPerspektiv === 'leder' ? 'leder' : 'medarbejder';
    var html = '';

    // Rolle info
    html += '<div class="menu-rolle-info">';
    html += '<p>Du bruger appen som <strong>' + rolleText + '</strong></p>';
    html += '<button class="menu-rolle-btn" id="menuRolleSkift">Skift rolle</button>';
    html += '</div>';

    // Om Anne Marie
    html += '<div class="menu-about">';
    html += '<div class="menu-section-title">Om Anne Marie Clement</div>';
    html += '<p>Anne Marie Clement har i over 20 år arbejdet med nervesystemet som nøgle til trivsel og balance. ';
    html += 'Hendes tilgang bygger på polyvagal teori, tilknytningsforskning og kropslig bevidsthed — ';
    html += 'oversat til praktiske redskaber der virker i hverdagen og på arbejdspladsen.</p>';
    html += '</div>';

    html += '<div class="menu-divider"></div>';

    // Navigation
    html += '<div class="menu-section">';
    html += '<div class="menu-section-title">Indhold</div>';
    html += '<button class="menu-item" data-nav="hjem"><span class="menu-item-icon">◉</span>Hjem</button>';
    html += '<button class="menu-item" data-nav="trappen"><span class="menu-item-icon">☰</span>Nervesystemstrappen</button>';
    html += '<button class="menu-item" data-nav="temaer"><span class="menu-item-icon">◈</span>Temaer</button>';
    html += '<button class="menu-item" data-nav="oevelser"><span class="menu-item-icon">◎</span>Øvelser</button>';
    html += '<button class="menu-item" data-nav="virksomhed"><span class="menu-item-icon">◆</span>Samarbejde med virksomheder</button>';
    var favCount = getFavoritter().length;
    html += '<button class="menu-item menu-item-favoritter" id="menuFavoritter"><span class="menu-item-icon">' + IKONER.bookmark(15) + '</span>Mine favoritter <span class="menu-favorit-badge" id="favoritBadge" style="' + (favCount > 0 ? '' : 'display:none') + '">' + favCount + '</span></button>';
    html += '</div>';

    html += '<div class="menu-divider"></div>';

    // Notifikationer
    html += '<div class="menu-section">';
    html += '<div class="menu-section-title">Notifikationer</div>';

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
    html += '<label class="menu-toggle"><input type="checkbox" data-setting="ugentlig"><span class="toggle-track"><span class="toggle-thumb"></span></span></label>';
    html += '</div>';
    html += '</div>';

    if (aktivPerspektiv === 'leder') {
      html += '<div class="menu-setting">';
      html += '<div class="menu-setting-row">';
      html += '<div class="menu-setting-info"><span class="menu-setting-name">Team check-in påmindelse</span>';
      html += '<span class="menu-setting-desc">Påmindelse om at tjekke ind med dit team</span></div>';
      html += '<label class="menu-toggle"><input type="checkbox" checked data-setting="teamcheckin"><span class="toggle-track"><span class="toggle-thumb"></span></span></label>';
      html += '</div>';
      html += '</div>';
    }

    html += '<div class="menu-setting-note">Påmindelser sendes diskret og kan altid slås fra</div>';
    html += '</div>';

    html += '<div class="menu-divider"></div>';

    // Daglige påmindelser / tidspunkter
    html += '<div class="menu-section">';
    html += '<div class="menu-section-title">Pausehjælp</div>';

    html += '<div class="menu-setting">';
    html += '<div class="menu-setting-row">';
    html += '<div class="menu-setting-info"><span class="menu-setting-name">Pause-påmindelser</span>';
    html += '<span class="menu-setting-desc">Blid notifikation hvert 45. minut i arbejdstiden</span></div>';
    html += '<label class="menu-toggle"><input type="checkbox" checked data-setting="pause"><span class="toggle-track"><span class="toggle-thumb"></span></span></label>';
    html += '</div>';
    html += '</div>';

    html += '<div class="menu-setting">';
    html += '<div class="menu-setting-row">';
    html += '<div class="menu-setting-info"><span class="menu-setting-name">Åndedrætspause</span>';
    html += '<span class="menu-setting-desc">En guidet vejrtrækning midt på dagen</span></div>';
    html += '<label class="menu-toggle"><input type="checkbox" data-setting="aandedraet"><span class="toggle-track"><span class="toggle-thumb"></span></span></label>';
    html += '</div>';
    html += '</div>';

    html += '<div class="menu-setting">';
    html += '<div class="menu-setting-row">';
    html += '<div class="menu-setting-info"><span class="menu-setting-name">Afslutningsritual</span>';
    html += '<span class="menu-setting-desc">Påmindelse om at lukke arbejdsdagen bevidst</span></div>';
    html += '<label class="menu-toggle"><input type="checkbox" checked data-setting="afslutning"><span class="toggle-track"><span class="toggle-thumb"></span></span></label>';
    html += '</div>';
    html += '</div>';

    html += '</div>';

    html += '<div class="menu-divider"></div>';

    // Indstillinger
    html += '<div class="menu-section">';
    html += '<div class="menu-section-title">Generelt</div>';

    html += '<div class="menu-setting">';
    html += '<div class="menu-setting-row">';
    html += '<div class="menu-setting-info"><span class="menu-setting-name">Mørk tilstand</span>';
    html += '<span class="menu-setting-desc">Dæmpet visning til aftenbrug</span></div>';
    html += '<label class="menu-toggle"><input type="checkbox" data-setting="dark"><span class="toggle-track"><span class="toggle-thumb"></span></span></label>';
    html += '</div>';
    html += '</div>';

    html += '<div class="menu-setting">';
    html += '<div class="menu-setting-row">';
    html += '<div class="menu-setting-info"><span class="menu-setting-name">Haptisk feedback</span>';
    html += '<span class="menu-setting-desc">Let vibration ved interaktioner</span></div>';
    html += '<label class="menu-toggle"><input type="checkbox" checked data-setting="haptic"><span class="toggle-track"><span class="toggle-thumb"></span></span></label>';
    html += '</div>';
    html += '</div>';

    html += '<div class="menu-setting">';
    html += '<div class="menu-setting-row">';
    html += '<div class="menu-setting-info"><span class="menu-setting-name">Lydeffekter</span>';
    html += '<span class="menu-setting-desc">Beroligende lyde ved åndedrætsøvelser</span></div>';
    html += '<label class="menu-toggle"><input type="checkbox" data-setting="lyd"><span class="toggle-track"><span class="toggle-thumb"></span></span></label>';
    html += '</div>';
    html += '</div>';

    html += '</div>';

    html += '<div class="menu-divider"></div>';

    // Privatliv & data
    html += '<div class="menu-section">';
    html += '<div class="menu-section-title">Privatliv & data</div>';
    html += '<p class="menu-privacy-text">Dine data opbevares kun lokalt på din enhed. Ingen personlige oplysninger deles med tredjepart. Appen kræver ingen login og indsamler ingen brugerdata.</p>';

    html += '<div class="menu-setting">';
    html += '<div class="menu-setting-row">';
    html += '<div class="menu-setting-info"><span class="menu-setting-name">Anonym brugsstatistik</span>';
    html += '<span class="menu-setting-desc">Hjælp os med at forbedre appen</span></div>';
    html += '<label class="menu-toggle"><input type="checkbox" data-setting="analytics"><span class="toggle-track"><span class="toggle-thumb"></span></span></label>';
    html += '</div>';
    html += '</div>';

    html += '<button class="menu-text-btn" data-action="sletdata">Slet alle lokale data</button>';
    html += '</div>';

    html += '<div class="menu-divider"></div>';

    // Om appen
    html += '<div class="menu-section">';
    html += '<div class="menu-section-title">Om appen</div>';
    html += '<div class="menu-about-app">';
    html += '<p><strong>Clement Firma</strong> v1.0</p>';
    html += '<p>Udviklet i samarbejde med Anne Marie Clement, baseret på over 20 års erfaring med nervesystemsarbejde, polyvagal teori og tilknytningsforskning.</p>';
    html += '<p class="menu-about-links">';
    html += '<span class="menu-about-link">Vilkår</span>';
    html += '<span class="menu-about-sep">·</span>';
    html += '<span class="menu-about-link">Privatlivspolitik</span>';
    html += '<span class="menu-about-sep">·</span>';
    html += '<span class="menu-about-link">Kontakt</span>';
    html += '</p>';
    html += '</div>';
    html += '</div>';

    menuContent.innerHTML = html;

    // Bind menu navigation
    menuContent.querySelectorAll('.menu-item[data-nav]').forEach(function(item) {
      item.addEventListener('click', function() {
        closeMenu();
        var nav = this.dataset.nav;
        if (nav === 'virksomhed') renderVirksomhed();
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
