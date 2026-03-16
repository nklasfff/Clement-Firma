/* ═══════════════════════════════════════════
   Clement Firma — App Logic
   Multi-view SPA med routing, tabs og interaktioner
   ═══════════════════════════════════════════ */

(function() {
  'use strict';

  // ── State ──
  var aktivPerspektiv = 'medarbejder';
  var aktivCirkel = null;
  var aktivTema = null;
  var aktivTrin = null;

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
    renderMenuContent();
    renderSearchTags();
    bindEvents();
    bindMenuEvents();
    bindSearchEvents();

    if (firstVisit) {
      // Always go to hjem on first visit
      window.location.hash = 'hjem';
      navigateTo('hjem', false);
      showVelkommen();
      animateCircles();
    } else {
      handleHash();
    }
    updateHeroVisibility();
  }

  // ── Rolle ──
  function opdaterRolleLabel() {
    if (rolleLabel) {
      rolleLabel.innerHTML = 'Indhold tilpasset dig som <strong>' + aktivPerspektiv + '</strong>';
    }
  }

  function skiftRolle() {
    aktivPerspektiv = aktivPerspektiv === 'medarbejder' ? 'leder' : 'medarbejder';
    localStorage.setItem('clementRolle', aktivPerspektiv);
    opdaterRolleLabel();
    opdaterCirkelTekster();
    renderTemaer();
    if (aktivCirkel) renderCirkelDetail(aktivCirkel);
    if (aktivTrin) visTrappenSvar(aktivTrin);
    if (aktivTema) visTemaDetalje(aktivTema);
  }

  // ── Navigation ──
  function navigateTo(viewName, push) {
    if (push !== false) {
      window.location.hash = viewName;
    }

    views.forEach(function(v) {
      v.classList.remove('active', 'fade-in');
    });

    var target = document.querySelector('.view[data-view="' + viewName.split('/')[0] + '"]');
    if (target) {
      target.classList.add('active', 'fade-in');
      window.scrollTo(0, 0);
    }

    // Update nav
    navItems.forEach(function(item) {
      item.classList.toggle('active', item.dataset.view === viewName.split('/')[0]);
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
  function opdaterCirkelTekster() {
    cirkelNodes.forEach(function(node) {
      var cirkelId = node.dataset.cirkel;
      var tekster = CIRKEL_TEKSTER[cirkelId];
      if (!tekster) return;

      var perspektivTekst = tekster[aktivPerspektiv];
      node.querySelectorAll('.cirkel-tekst-1').forEach(function(el) { el.textContent = perspektivTekst[0]; });
      node.querySelectorAll('.cirkel-tekst-2').forEach(function(el) { el.textContent = perspektivTekst[1]; });
      node.querySelectorAll('.cirkel-tekst-3').forEach(function(el) { el.textContent = perspektivTekst[2] || ''; });
    });
  }

  // ── Cirkel Detail ──
  function renderCirkelDetail(cirkelId) {
    var data = CIRKLER[cirkelId];
    if (!data) return;

    var indhold = data[aktivPerspektiv];

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
        var tekst = s.data[aktivPerspektiv];
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
  function visTrappenSvar(trinId) {
    var data = TRAPPEN[trinId];
    if (!data) return;

    var svar = data[aktivPerspektiv];
    var farveClass = data.farve === 'sage' ? 'sage-border' : data.farve === 'amber' ? 'amber-border' : 'rose-border';

    var html = '<div class="trappen-card ' + farveClass + '">';
    html += '<h3>' + data.navn + '</h3>';
    html += '<p>' + svar.beskrivelse + '</p>';

    html += '<strong style="display:block; color:var(--primary); font-size:0.85rem; text-transform:uppercase; letter-spacing:0.05em; margin-bottom:8px;">Kropslige signaler</strong>';
    html += '<ul class="trappen-signaler">';
    svar.kropsSignaler.forEach(function(s) {
      html += '<li>' + s + '</li>';
    });
    html += '</ul>';

    html += '<div class="trappen-handling">';
    html += '<strong>Handling</strong>';
    html += '<p>' + svar.handling + '</p>';
    html += '</div>';

    html += '<div class="trappen-oevelse">';
    html += '<strong>Prøv nu</strong>';
    html += '<p>' + svar.oevelse + '</p>';
    html += '</div>';

    html += '</div>';

    trappenResponse.innerHTML = html;
    trappenResponse.classList.add('visible');
  }

  // ── Temaer ──
  function renderTemaer() {
    var html = '';
    var temaKeys = Object.keys(TEMA_INDHOLD);
    temaKeys.forEach(function(key) {
      var tema = TEMA_INDHOLD[key];
      html += '<button class="tema-card" data-tema="' + key + '">';
      html += '<span class="tema-ikon">' + (tema.ikon || '') + '</span>';
      html += '<h3>' + tema.titel + '</h3>';
      html += '<p>' + (tema[aktivPerspektiv].intro.substring(0, 60)) + '...</p>';
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

    var perspektiv = data[aktivPerspektiv];

    var html = '<div class="tema-detail-card">';
    html += '<h3>' + data.titel + '</h3>';
    html += '<p class="tema-intro">' + perspektiv.intro + '</p>';
    html += '<p class="tema-tekst">' + perspektiv.tekst + '</p>';

    if (perspektiv.relateredeCirkler && perspektiv.relateredeCirkler.length) {
      html += '<div class="tema-relaterede">';
      perspektiv.relateredeCirkler.forEach(function(cirkelId) {
        if (CIRKLER[cirkelId]) {
          html += '<span class="tag" data-cirkel="' + cirkelId + '">' + CIRKLER[cirkelId].titel + '</span>';
        }
      });
      html += '</div>';
    }

    html += '</div>';

    temaExpanded.innerHTML = html;
    temaExpanded.classList.add('visible');

    // Bind relaterede cirkel-tags
    temaExpanded.querySelectorAll('.tag[data-cirkel]').forEach(function(tag) {
      tag.addEventListener('click', function() {
        var cirkelId = this.dataset.cirkel;
        aktivCirkel = cirkelId;
        renderCirkelDetail(cirkelId);
        navigateTo('cirkel/' + cirkelId);
      });
    });

    temaExpanded.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  // ── Øvelser ──
  function renderOevelser() {
    var html = '';
    OEVELSER.forEach(function(o, i) {
      html += '<div class="oevelse-card" data-index="' + i + '">';
      html += '<h3>' + o.titel + '</h3>';
      html += '<div class="oevelse-meta">';
      html += '<span>' + o.tid + '</span>';
      html += '<span>' + o.sted + '</span>';
      if (CIRKLER[o.cirkel]) {
        html += '<span>' + CIRKLER[o.cirkel].titel + '</span>';
      }
      html += '</div>';
      html += '<p class="oevelse-intro">' + o.intro + '</p>';
      html += '<ol class="oevelse-steps">';
      o.steps.forEach(function(step, idx) {
        html += '<li data-step="' + (idx + 1) + '">' + step + '</li>';
      });
      html += '</ol>';
      html += '<button class="oevelse-toggle">Vis øvelse</button>';
      html += '</div>';
    });

    oevelserGrid.innerHTML = html;

    // Bind expand/collapse
    oevelserGrid.querySelectorAll('.oevelse-card').forEach(function(card) {
      card.addEventListener('click', function() {
        var isExpanded = this.classList.contains('expanded');

        // Collapse all
        oevelserGrid.querySelectorAll('.oevelse-card').forEach(function(c) {
          c.classList.remove('expanded');
          var btn = c.querySelector('.oevelse-toggle');
          if (btn) btn.textContent = 'Vis øvelse';
        });

        // Toggle this
        if (!isExpanded) {
          this.classList.add('expanded');
          var toggleBtn = this.querySelector('.oevelse-toggle');
          if (toggleBtn) toggleBtn.textContent = 'Skjul øvelse';
        }
      });
    });
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
        navigateTo(this.dataset.nav);
      });
    });

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
      var indhold = c[aktivPerspektiv];
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
      var indhold = t[aktivPerspektiv];
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
      var indhold = t[aktivPerspektiv];
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
      var tekst = s[aktivPerspektiv];
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

  // ── Start ──
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
