/* ═══════════════════════════════════════════
   Clement Firma — App Logic
   ═══════════════════════════════════════════ */

(function() {
  'use strict';

  // ── State ──
  let aktivPerspektiv = 'medarbejder';
  let aktivCirkel = null;
  let aktivTema = null;

  // ── DOM refs ──
  const perspektivBtns = document.querySelectorAll('.perspektiv-btn');
  const perspektivHint = document.getElementById('perspektivHint');
  const cirkelNodes = document.querySelectorAll('.cirkel-node');
  const indholdPanel = document.getElementById('indholdPanel');
  const panelInner = document.getElementById('panelInner');
  const panelClose = document.getElementById('panelClose');
  const zoneBtns = document.querySelectorAll('.zone-btn');
  const zoneResponse = document.getElementById('zoneResponse');
  const temaCards = document.querySelectorAll('.tema-card');
  const oevelserGrid = document.getElementById('oevelserGrid');

  // ── Init ──
  function init() {
    renderOevelser();
    bindEvents();
  }

  // ── Events ──
  function bindEvents() {
    // Perspektiv toggle
    perspektivBtns.forEach(function(btn) {
      btn.addEventListener('click', function() {
        aktivPerspektiv = this.dataset.perspektiv;
        perspektivBtns.forEach(function(b) { b.classList.remove('active'); });
        this.classList.add('active');
        perspektivHint.innerHTML = 'Du ser indholdet som <strong>' + aktivPerspektiv + '</strong>';

        // Opdater åbent panel
        if (aktivCirkel) {
          visCirckelIndhold(aktivCirkel);
        }

        // Opdater zone-svar
        var selectedZone = document.querySelector('.zone-btn.selected');
        if (selectedZone) {
          visZoneSvar(selectedZone.dataset.zone);
        }

        // Opdater tema
        if (aktivTema) {
          visTemaIndhold(aktivTema);
        }
      });
    });

    // Cirkel-klik
    cirkelNodes.forEach(function(node) {
      node.addEventListener('click', function() {
        var cirkelId = this.dataset.cirkel;
        cirkelNodes.forEach(function(n) { n.classList.remove('active'); });
        this.classList.add('active');
        aktivCirkel = cirkelId;
        visCirckelIndhold(cirkelId);
      });

      node.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.click();
        }
      });
    });

    // Panel close
    panelClose.addEventListener('click', function() {
      indholdPanel.classList.remove('open');
      cirkelNodes.forEach(function(n) { n.classList.remove('active'); });
      aktivCirkel = null;
    });

    // Zone-knapper
    zoneBtns.forEach(function(btn) {
      btn.addEventListener('click', function() {
        zoneBtns.forEach(function(b) { b.classList.remove('selected'); });
        this.classList.add('selected');
        visZoneSvar(this.dataset.zone);
      });
    });

    // Tema-kort
    temaCards.forEach(function(card) {
      card.addEventListener('click', function() {
        var temaId = this.dataset.tema;
        if (aktivTema === temaId) {
          // Toggle off
          this.classList.remove('active');
          aktivTema = null;
          filterOevelser(null);
          return;
        }
        temaCards.forEach(function(c) { c.classList.remove('active'); });
        this.classList.add('active');
        aktivTema = temaId;
        visTemaIndhold(temaId);
        filterOevelser(temaId);
      });
    });
  }

  // ── Vis cirkel-indhold ──
  function visCirckelIndhold(cirkelId) {
    var data = CIRKLER[cirkelId];
    if (!data) return;

    var indhold = data[aktivPerspektiv];

    var html = '<h3>' + data.titel + '</h3>';
    html += '<p style="color:var(--text-light); margin-bottom:16px;">' + indhold.beskrivelse + '</p>';
    html += '<ul class="panel-bullets">';
    indhold.punkter.forEach(function(p) {
      html += '<li>' + p + '</li>';
    });
    html += '</ul>';
    html += '<div class="panel-tip">' + indhold.tip + '</div>';

    panelInner.innerHTML = html;
    indholdPanel.classList.add('open');

    // Scroll til panel
    indholdPanel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  // ── Vis zone-svar ──
  function visZoneSvar(zone) {
    var data = ZONE_SVAR[zone];
    if (!data) return;

    var svar = data[aktivPerspektiv];
    var html = '<h4>' + svar.titel + '</h4>';
    html += '<p>' + svar.tekst + '</p>';
    html += '<div class="zone-exercise">' + svar.oevelse + '</div>';

    zoneResponse.innerHTML = html;
    zoneResponse.classList.add('visible');
  }

  // ── Vis tema-indhold ──
  function visTemaIndhold(temaId) {
    var data = TEMA_INDHOLD[temaId];
    if (!data) return;

    // Scroll til øvelser der matcher
    var section = document.getElementById('oevelserSection');
    if (section) {
      setTimeout(function() {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 200);
    }
  }

  // ── Render øvelser ──
  function renderOevelser(filterTema) {
    var oevelser = OEVELSER;

    if (filterTema) {
      oevelser = oevelser.filter(function(o) {
        return o.temaer.indexOf(filterTema) !== -1;
      });
    }

    if (oevelser.length === 0) {
      oevelserGrid.innerHTML = '<p style="text-align:center; color:var(--text-light); padding:20px;">Ingen øvelser matcher dette tema endnu.</p>';
      return;
    }

    var html = '';
    oevelser.forEach(function(o, i) {
      html += '<div class="oevelse-card" data-index="' + i + '">';
      html += '<h3>' + o.titel + '</h3>';
      html += '<div class="oevelse-meta">';
      html += '<span>' + o.tid + '</span>';
      html += '<span>' + o.sted + '</span>';
      html += '<span>' + CIRKLER[o.cirkel].titel + '</span>';
      html += '</div>';
      html += '<blockquote>' + o.instruktion + '</blockquote>';
      html += '<button class="oevelse-toggle">Vis øvelse</button>';
      html += '</div>';
    });

    oevelserGrid.innerHTML = html;

    // Bind expand/collapse
    oevelserGrid.querySelectorAll('.oevelse-card').forEach(function(card) {
      card.addEventListener('click', function() {
        var isExpanded = this.classList.contains('expanded');
        // Collapse alle
        oevelserGrid.querySelectorAll('.oevelse-card').forEach(function(c) {
          c.classList.remove('expanded');
          var btn = c.querySelector('.oevelse-toggle');
          if (btn) btn.textContent = 'Vis øvelse';
        });
        // Toggle denne
        if (!isExpanded) {
          this.classList.add('expanded');
          var toggleBtn = this.querySelector('.oevelse-toggle');
          if (toggleBtn) toggleBtn.textContent = 'Skjul øvelse';
        }
      });
    });
  }

  // ── Filtrer øvelser ──
  function filterOevelser(temaId) {
    renderOevelser(temaId);
  }

  // ── Start ──
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
