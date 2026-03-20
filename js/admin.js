/* ═══════════════════════════════════════════
   Clement WellbeingAtWork — Admin Panel Logic
   ═══════════════════════════════════════════ */

(function() {
  'use strict';

  var B = window.ClementBackend;
  if (!B) {
    document.body.innerHTML = '<div style="padding:40px;text-align:center;color:#C25B56;"><h2>Fejl</h2><p>supabase.js mangler. Sørg for at den er inkluderet før admin.js.</p></div>';
    return;
  }

  // ── State ──
  var exercises = [];
  var reflections = [];
  var subscribers = [];

  // ── DOM refs ──
  var loginView = document.getElementById('loginView');
  var adminView = document.getElementById('adminView');
  var statusBar = document.getElementById('statusBar');

  // ── Status messages ──
  function showStatus(msg, type) {
    statusBar.textContent = msg;
    statusBar.className = 'status-bar visible ' + (type || '');
    if (type !== 'error') {
      setTimeout(function() { statusBar.className = 'status-bar'; }, 3000);
    }
  }

  // ── Auth ──
  function checkAuth() {
    if (B.isAdminLoggedIn()) {
      showAdmin();
    } else {
      loginView.style.display = '';
      adminView.style.display = 'none';
    }
  }

  function showAdmin() {
    loginView.style.display = 'none';
    adminView.style.display = '';

    var user = localStorage.getItem('cf_admin_user');
    if (user) {
      try {
        var u = JSON.parse(user);
        document.getElementById('adminUser').textContent = u.email || '';
      } catch (e) {}
    }

    if (!B.isConfigured()) {
      showStatus('Supabase er ikke konfigureret. Tilføj meta tags med supabase-url og supabase-key i admin.html.', 'error');
      return;
    }

    loadAllData();
  }

  // ── Login ──
  document.getElementById('loginBtn').addEventListener('click', function() {
    var email = document.getElementById('loginEmail').value.trim();
    var pass = document.getElementById('loginPassword').value;
    var errorEl = document.getElementById('loginError');

    if (!email || !pass) {
      errorEl.textContent = 'Udfyld begge felter.';
      errorEl.style.display = '';
      return;
    }

    if (!B.isConfigured()) {
      errorEl.textContent = 'Supabase er ikke konfigureret. Tilføj meta tags med URL og key.';
      errorEl.style.display = '';
      return;
    }

    errorEl.style.display = 'none';
    this.disabled = true;
    this.textContent = 'Logger ind...';

    B.login(email, pass).then(function() {
      showAdmin();
    }).catch(function(err) {
      errorEl.textContent = 'Login fejlede. Tjek email og adgangskode.';
      errorEl.style.display = '';
    }).then(function() {
      var btn = document.getElementById('loginBtn');
      btn.disabled = false;
      btn.textContent = 'Log ind';
    });
  });

  // Enter key on password field
  document.getElementById('loginPassword').addEventListener('keydown', function(e) {
    if (e.key === 'Enter') document.getElementById('loginBtn').click();
  });

  // ── Logout ──
  document.getElementById('logoutBtn').addEventListener('click', function() {
    B.logout();
    loginView.style.display = '';
    adminView.style.display = 'none';
  });

  // ── Tabs ──
  document.querySelectorAll('.admin-tab').forEach(function(tab) {
    tab.addEventListener('click', function() {
      document.querySelectorAll('.admin-tab').forEach(function(t) { t.classList.remove('active'); });
      document.querySelectorAll('.admin-panel').forEach(function(p) { p.classList.remove('active'); });
      this.classList.add('active');
      var panel = document.querySelector('[data-panel="' + this.dataset.tab + '"]');
      if (panel) panel.classList.add('active');
    });
  });

  // ── Load all data ──
  function loadAllData() {
    showStatus('Henter data...', '');

    Promise.all([
      B.admin.fetchAll('exercises').catch(function() { return []; }),
      B.admin.fetchAll('reflections').catch(function() { return []; }),
      B.admin.fetchSubscribers().catch(function() { return []; })
    ]).then(function(results) {
      exercises = results[0] || [];
      reflections = results[1] || [];
      subscribers = results[2] || [];
      renderStats();
      renderExercisesTable();
      renderReflectionsTable();
      renderSubscribersTable();
      statusBar.className = 'status-bar';
    }).catch(function(err) {
      showStatus('Fejl ved indlæsning: ' + err.message, 'error');
    });
  }

  // ── Stats ──
  function renderStats() {
    var grid = document.getElementById('statsGrid');
    grid.innerHTML =
      '<div class="stat-card"><div class="stat-value">' + exercises.length + '</div><div class="stat-label">Øvelser</div></div>' +
      '<div class="stat-card"><div class="stat-value">' + reflections.length + '</div><div class="stat-label">Refleksioner</div></div>' +
      '<div class="stat-card"><div class="stat-value">' + subscribers.filter(function(s) { return s.subscribed; }).length + '</div><div class="stat-label">Aktive tilmeldte</div></div>' +
      '<div class="stat-card"><div class="stat-value">' + subscribers.length + '</div><div class="stat-label">Tilmeldinger i alt</div></div>';
  }

  // ── Exercises Table ──
  function renderExercisesTable() {
    var container = document.getElementById('exercisesTable');
    if (!exercises.length) {
      container.innerHTML = '<div class="empty-state"><p>Ingen øvelser endnu.</p><button class="btn btn-sage" id="addExerciseEmpty">+ Tilføj den første øvelse</button></div>';
      var emptyBtn = document.getElementById('addExerciseEmpty');
      if (emptyBtn) emptyBtn.addEventListener('click', function() { openExerciseModal(); });
      return;
    }

    var html = '<table class="admin-table">';
    html += '<thead><tr><th>Titel</th><th>Cirkel</th><th>Tid</th><th>Temaer</th><th>Status</th><th>Handlinger</th></tr></thead>';
    html += '<tbody>';
    exercises.forEach(function(ex) {
      html += '<tr>';
      html += '<td><strong>' + esc(ex.titel) + '</strong></td>';
      html += '<td>' + esc(ex.cirkel) + '</td>';
      html += '<td>' + esc(ex.tid) + '</td>';
      html += '<td>' + (ex.temaer || []).join(', ') + '</td>';
      html += '<td><span class="badge ' + (ex.active ? 'badge-active' : 'badge-inactive') + '">' + (ex.active ? 'Aktiv' : 'Inaktiv') + '</span></td>';
      html += '<td><button class="btn btn-outline btn-sm edit-exercise" data-id="' + ex.id + '">Redigér</button></td>';
      html += '</tr>';
    });
    html += '</tbody></table>';
    container.innerHTML = html;

    container.querySelectorAll('.edit-exercise').forEach(function(btn) {
      btn.addEventListener('click', function() {
        var ex = exercises.find(function(e) { return e.id === btn.dataset.id; });
        if (ex) openExerciseModal(ex);
      });
    });
  }

  // ── Reflections Table ──
  function renderReflectionsTable() {
    var container = document.getElementById('reflectionsTable');
    if (!reflections.length) {
      container.innerHTML = '<div class="empty-state"><p>Ingen refleksioner endnu.</p><button class="btn btn-sage" id="addReflectionEmpty">+ Tilføj den første refleksion</button></div>';
      var emptyBtn = document.getElementById('addReflectionEmpty');
      if (emptyBtn) emptyBtn.addEventListener('click', function() { openReflectionModal(); });
      return;
    }

    var html = '<table class="admin-table">';
    html += '<thead><tr><th>Titel</th><th>Ikon</th><th>Farve</th><th>Spørgsmål</th><th>Status</th><th>Handlinger</th></tr></thead>';
    html += '<tbody>';
    reflections.forEach(function(ref) {
      html += '<tr>';
      html += '<td><strong>' + esc(ref.titel) + '</strong></td>';
      html += '<td>' + esc(ref.ikon) + '</td>';
      html += '<td>' + esc(ref.farve) + '</td>';
      html += '<td class="text-ellipsis">' + esc(ref.spoergsmaal) + '</td>';
      html += '<td><span class="badge ' + (ref.active ? 'badge-active' : 'badge-inactive') + '">' + (ref.active ? 'Aktiv' : 'Inaktiv') + '</span></td>';
      html += '<td><button class="btn btn-outline btn-sm edit-reflection" data-id="' + ref.id + '">Redigér</button></td>';
      html += '</tr>';
    });
    html += '</tbody></table>';
    container.innerHTML = html;

    container.querySelectorAll('.edit-reflection').forEach(function(btn) {
      btn.addEventListener('click', function() {
        var ref = reflections.find(function(r) { return r.id === btn.dataset.id; });
        if (ref) openReflectionModal(ref);
      });
    });
  }

  // ── Subscribers Table ──
  function renderSubscribersTable() {
    var container = document.getElementById('subscribersTable');
    if (!subscribers.length) {
      container.innerHTML = '<div class="empty-state"><p>Ingen tilmeldinger endnu.</p></div>';
      return;
    }

    var html = '<table class="admin-table">';
    html += '<thead><tr><th>Email</th><th>Rolle</th><th>Sprog</th><th>Status</th><th>Tilmeldt</th></tr></thead>';
    html += '<tbody>';
    subscribers.forEach(function(sub) {
      var date = sub.created_at ? new Date(sub.created_at).toLocaleDateString('da-DK') : '-';
      html += '<tr>';
      html += '<td>' + esc(sub.email) + '</td>';
      html += '<td>' + esc(sub.rolle) + '</td>';
      html += '<td>' + esc(sub.lang) + '</td>';
      html += '<td><span class="badge ' + (sub.subscribed ? 'badge-active' : 'badge-inactive') + '">' + (sub.subscribed ? 'Aktiv' : 'Afmeldt') + '</span></td>';
      html += '<td>' + date + '</td>';
      html += '</tr>';
    });
    html += '</tbody></table>';
    container.innerHTML = html;
  }

  // ── Export subscribers CSV ──
  document.getElementById('exportSubscribers').addEventListener('click', function() {
    if (!subscribers.length) return;
    var csv = 'Email,Rolle,Sprog,Status,Tilmeldt\n';
    subscribers.forEach(function(sub) {
      csv += '"' + sub.email + '","' + sub.rolle + '","' + sub.lang + '","' + (sub.subscribed ? 'Aktiv' : 'Afmeldt') + '","' + (sub.created_at || '') + '"\n';
    });
    var blob = new Blob([csv], { type: 'text/csv' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = 'clement-tilmeldinger-' + new Date().toISOString().slice(0, 10) + '.csv';
    a.click();
    URL.revokeObjectURL(url);
  });

  // ── Exercise Modal ──
  function openExerciseModal(ex) {
    document.getElementById('exerciseModalTitle').textContent = ex ? 'Redigér øvelse' : 'Ny øvelse';
    document.getElementById('exerciseId').value = ex ? ex.id : '';
    document.getElementById('exTitel').value = ex ? ex.titel : '';
    document.getElementById('exTitelEn').value = ex ? (ex.titel_en || '') : '';
    document.getElementById('exTid').value = ex ? ex.tid : '';
    document.getElementById('exSted').value = ex ? ex.sted : '';
    document.getElementById('exStedEn').value = ex ? (ex.sted_en || '') : '';
    document.getElementById('exCirkel').value = ex ? ex.cirkel : 'centrum';
    document.getElementById('exTemaer').value = ex ? (ex.temaer || []).join(', ') : '';
    document.getElementById('exIntro').value = ex ? ex.intro : '';
    document.getElementById('exIntroEn').value = ex ? (ex.intro_en || '') : '';
    document.getElementById('exSteps').value = ex ? (ex.steps || []).join('\n') : '';
    document.getElementById('exStepsEn').value = ex ? (ex.steps_en || []).join('\n') : '';
    document.getElementById('exRefleksion').value = ex ? (ex.refleksion || '') : '';
    document.getElementById('exRefleksionEn').value = ex ? (ex.refleksion_en || '') : '';
    document.getElementById('exSortOrder').value = ex ? (ex.sort_order || 0) : exercises.length;
    document.getElementById('exActive').value = ex ? String(ex.active) : 'true';
    document.getElementById('exerciseModal').classList.add('visible');
  }

  document.getElementById('exerciseCancel').addEventListener('click', function() {
    document.getElementById('exerciseModal').classList.remove('visible');
  });

  document.getElementById('exerciseSave').addEventListener('click', function() {
    var id = document.getElementById('exerciseId').value;
    var titel = document.getElementById('exTitel').value.trim();
    if (!titel) { document.getElementById('exTitel').style.borderColor = 'var(--rose)'; return; }

    var data = {
      titel: titel,
      titel_en: document.getElementById('exTitelEn').value.trim() || null,
      tid: document.getElementById('exTid').value.trim(),
      sted: document.getElementById('exSted').value.trim(),
      sted_en: document.getElementById('exStedEn').value.trim() || null,
      cirkel: document.getElementById('exCirkel').value,
      temaer: document.getElementById('exTemaer').value.split(',').map(function(s) { return s.trim(); }).filter(Boolean),
      intro: document.getElementById('exIntro').value.trim(),
      intro_en: document.getElementById('exIntroEn').value.trim() || null,
      steps: document.getElementById('exSteps').value.split('\n').filter(function(s) { return s.trim(); }),
      steps_en: document.getElementById('exStepsEn').value.split('\n').filter(function(s) { return s.trim(); }),
      refleksion: document.getElementById('exRefleksion').value.trim() || null,
      refleksion_en: document.getElementById('exRefleksionEn').value.trim() || null,
      sort_order: parseInt(document.getElementById('exSortOrder').value) || 0,
      active: document.getElementById('exActive').value === 'true'
    };

    if (id) data.id = id;

    this.disabled = true;
    this.textContent = 'Gemmer...';

    var btn = this;
    B.admin.upsert('exercises', data).then(function() {
      document.getElementById('exerciseModal').classList.remove('visible');
      showStatus('Øvelse gemt!', 'success');
      B.invalidateCache('exercises');
      loadAllData();
    }).catch(function(err) {
      showStatus('Fejl: ' + err.message, 'error');
    }).then(function() {
      btn.disabled = false;
      btn.textContent = 'Gem øvelse';
    });
  });

  document.getElementById('addExercise').addEventListener('click', function() { openExerciseModal(); });

  // ── Reflection Modal ──
  function openReflectionModal(ref) {
    document.getElementById('reflectionModalTitle').textContent = ref ? 'Redigér refleksion' : 'Ny refleksion';
    document.getElementById('reflectionId').value = ref ? ref.id : '';
    document.getElementById('refId').value = ref ? ref.id : '';
    document.getElementById('refId').disabled = !!ref;
    document.getElementById('refTitel').value = ref ? ref.titel : '';
    document.getElementById('refTitelEn').value = ref ? (ref.titel_en || '') : '';
    document.getElementById('refIkon').value = ref ? ref.ikon : '◎';
    document.getElementById('refFarve').value = ref ? ref.farve : 'sage';
    document.getElementById('refSpoergsmaal').value = ref ? ref.spoergsmaal : '';
    document.getElementById('refSpoergsmaalEn').value = ref ? (ref.spoergsmaal_en || '') : '';
    document.getElementById('refUddybning').value = ref ? ref.uddybning : '';
    document.getElementById('refUddybningEn').value = ref ? (ref.uddybning_en || '') : '';
    document.getElementById('refSortOrder').value = ref ? (ref.sort_order || 0) : reflections.length;
    document.getElementById('refActive').value = ref ? String(ref.active) : 'true';
    document.getElementById('reflectionModal').classList.add('visible');
  }

  document.getElementById('reflectionCancel').addEventListener('click', function() {
    document.getElementById('reflectionModal').classList.remove('visible');
  });

  document.getElementById('reflectionSave').addEventListener('click', function() {
    var id = document.getElementById('refId').value.trim();
    var titel = document.getElementById('refTitel').value.trim();
    if (!id || !titel) {
      if (!id) document.getElementById('refId').style.borderColor = 'var(--rose)';
      if (!titel) document.getElementById('refTitel').style.borderColor = 'var(--rose)';
      return;
    }

    var data = {
      id: id,
      titel: titel,
      titel_en: document.getElementById('refTitelEn').value.trim() || null,
      ikon: document.getElementById('refIkon').value.trim() || '◎',
      farve: document.getElementById('refFarve').value,
      spoergsmaal: document.getElementById('refSpoergsmaal').value.trim(),
      spoergsmaal_en: document.getElementById('refSpoergsmaalEn').value.trim() || null,
      uddybning: document.getElementById('refUddybning').value.trim(),
      uddybning_en: document.getElementById('refUddybningEn').value.trim() || null,
      sort_order: parseInt(document.getElementById('refSortOrder').value) || 0,
      active: document.getElementById('refActive').value === 'true'
    };

    this.disabled = true;
    this.textContent = 'Gemmer...';

    var btn = this;
    B.admin.upsert('reflections', data).then(function() {
      document.getElementById('reflectionModal').classList.remove('visible');
      showStatus('Refleksion gemt!', 'success');
      B.invalidateCache('reflections');
      loadAllData();
    }).catch(function(err) {
      showStatus('Fejl: ' + err.message, 'error');
    }).then(function() {
      btn.disabled = false;
      btn.textContent = 'Gem refleksion';
    });
  });

  document.getElementById('addReflection').addEventListener('click', function() { openReflectionModal(); });

  // ── Close modals on overlay click ──
  document.querySelectorAll('.modal-overlay').forEach(function(overlay) {
    overlay.addEventListener('click', function(e) {
      if (e.target === overlay) overlay.classList.remove('visible');
    });
  });

  // ── Escape key closes modals ──
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-overlay.visible').forEach(function(m) {
        m.classList.remove('visible');
      });
    }
  });

  // ── Helper ──
  function esc(str) {
    if (!str) return '';
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  // ── Init ──
  checkAuth();

})();
