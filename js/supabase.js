/* ═══════════════════════════════════════════
   Clement WellbeingAtWork — Supabase Client
   Henter data fra Supabase med fallback til
   lokale JavaScript-filer (data.js / data-en.js)
   ═══════════════════════════════════════════ */

(function() {
  'use strict';

  // ── Konfiguration ──
  // Sæt disse værdier til dit Supabase-projekts URL og anon key.
  // Kan også sættes via <meta> tags i HTML:
  //   <meta name="supabase-url" content="https://xxx.supabase.co">
  //   <meta name="supabase-key" content="eyJ...">
  var SUPABASE_URL = '';
  var SUPABASE_KEY = '';

  // Læs fra meta tags hvis ikke hardcoded
  function getConfig() {
    if (!SUPABASE_URL) {
      var urlMeta = document.querySelector('meta[name="supabase-url"]');
      if (urlMeta) SUPABASE_URL = urlMeta.content;
    }
    if (!SUPABASE_KEY) {
      var keyMeta = document.querySelector('meta[name="supabase-key"]');
      if (keyMeta) SUPABASE_KEY = keyMeta.content;
    }
    return { url: SUPABASE_URL, key: SUPABASE_KEY };
  }

  function isConfigured() {
    var cfg = getConfig();
    return !!(cfg.url && cfg.key);
  }

  // ── Simple REST client (ingen SDK afhængighed) ──
  function supabaseRequest(table, options) {
    var cfg = getConfig();
    if (!cfg.url || !cfg.key) return Promise.reject(new Error('Supabase not configured'));

    var url = cfg.url + '/rest/v1/' + table;
    var params = [];

    if (options && options.select) params.push('select=' + encodeURIComponent(options.select));
    if (options && options.filter) {
      Object.keys(options.filter).forEach(function(key) {
        params.push(key + '=' + encodeURIComponent(options.filter[key]));
      });
    }
    if (options && options.order) params.push('order=' + encodeURIComponent(options.order));
    if (options && options.limit) params.push('limit=' + options.limit);

    if (params.length) url += '?' + params.join('&');

    var headers = {
      'apikey': cfg.key,
      'Authorization': 'Bearer ' + (options && options.token ? options.token : cfg.key),
      'Content-Type': 'application/json',
      'Prefer': 'return=representation'
    };

    var method = (options && options.method) || 'GET';
    var fetchOpts = { method: method, headers: headers };

    if (options && options.body) {
      fetchOpts.body = JSON.stringify(options.body);
    }

    return fetch(url, fetchOpts).then(function(res) {
      if (!res.ok) throw new Error('Supabase ' + res.status + ': ' + res.statusText);
      return res.json();
    });
  }

  // ── Auth helpers ──
  function supabaseLogin(email, password) {
    var cfg = getConfig();
    if (!cfg.url || !cfg.key) return Promise.reject(new Error('Supabase not configured'));

    return fetch(cfg.url + '/auth/v1/token?grant_type=password', {
      method: 'POST',
      headers: {
        'apikey': cfg.key,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email: email, password: password })
    }).then(function(res) {
      if (!res.ok) throw new Error('Login failed');
      return res.json();
    }).then(function(data) {
      localStorage.setItem('cf_admin_token', data.access_token);
      localStorage.setItem('cf_admin_refresh', data.refresh_token);
      localStorage.setItem('cf_admin_user', JSON.stringify(data.user));
      return data;
    });
  }

  function supabaseLogout() {
    localStorage.removeItem('cf_admin_token');
    localStorage.removeItem('cf_admin_refresh');
    localStorage.removeItem('cf_admin_user');
  }

  function getAdminToken() {
    return localStorage.getItem('cf_admin_token');
  }

  function isAdminLoggedIn() {
    return !!getAdminToken();
  }

  // ── Data fetching med cache ──
  var cache = {};
  var CACHE_TTL = 5 * 60 * 1000; // 5 minutter

  function getCached(key) {
    var entry = cache[key];
    if (entry && (Date.now() - entry.time) < CACHE_TTL) return entry.data;
    return null;
  }

  function setCache(key, data) {
    cache[key] = { data: data, time: Date.now() };
  }

  // ── Public data fetching functions ──

  // Hent øvelser fra Supabase, fallback til lokal data
  function fetchExercises() {
    if (!isConfigured()) return Promise.resolve(null);

    var cached = getCached('exercises');
    if (cached) return Promise.resolve(cached);

    return supabaseRequest('exercises', {
      filter: { active: 'eq.true' },
      order: 'sort_order.asc'
    }).then(function(rows) {
      // Konverter til app-format
      var result = rows.map(function(row) {
        return {
          titel: row.titel,
          titel_en: row.titel_en,
          tid: row.tid,
          sted: row.sted,
          sted_en: row.sted_en,
          cirkel: row.cirkel,
          temaer: row.temaer,
          intro: row.intro,
          intro_en: row.intro_en,
          steps: row.steps,
          steps_en: row.steps_en,
          refleksion: row.refleksion,
          refleksion_en: row.refleksion_en,
          _id: row.id
        };
      });
      setCache('exercises', result);
      return result;
    }).catch(function() {
      return null; // Fallback til lokal data
    });
  }

  function fetchReflections() {
    if (!isConfigured()) return Promise.resolve(null);

    var cached = getCached('reflections');
    if (cached) return Promise.resolve(cached);

    return supabaseRequest('reflections', {
      filter: { active: 'eq.true' },
      order: 'sort_order.asc'
    }).then(function(rows) {
      var result = rows.map(function(row) {
        return {
          id: row.id,
          titel: row.titel,
          titel_en: row.titel_en,
          ikon: row.ikon,
          farve: row.farve,
          spoergsmaal: row.spoergsmaal,
          spoergsmaal_en: row.spoergsmaal_en,
          uddybning: row.uddybning,
          uddybning_en: row.uddybning_en
        };
      });
      setCache('reflections', result);
      return result;
    }).catch(function() {
      return null;
    });
  }

  function fetchCircles() {
    if (!isConfigured()) return Promise.resolve(null);

    var cached = getCached('circles');
    if (cached) return Promise.resolve(cached);

    return supabaseRequest('circles', {
      filter: { active: 'eq.true' },
      order: 'sort_order.asc'
    }).then(function(rows) {
      var daResult = {};
      var enResult = {};
      rows.forEach(function(row) {
        daResult[row.id] = Object.assign({ titel: row.titel, ikon: row.ikon }, row.data_da);
        enResult[row.id] = Object.assign({ titel: row.titel_en || row.titel, ikon: row.ikon }, row.data_en);
      });
      var result = { da: daResult, en: enResult };
      setCache('circles', result);
      return result;
    }).catch(function() {
      return null;
    });
  }

  function fetchThemes() {
    if (!isConfigured()) return Promise.resolve(null);

    var cached = getCached('themes');
    if (cached) return Promise.resolve(cached);

    return supabaseRequest('themes', {
      filter: { active: 'eq.true' },
      order: 'sort_order.asc'
    }).then(function(rows) {
      var daResult = {};
      var enResult = {};
      rows.forEach(function(row) {
        daResult[row.id] = Object.assign({
          titel: row.titel,
          ikon: row.ikon,
          spoergsmaal: row.spoergsmaal
        }, row.data_da);
        enResult[row.id] = Object.assign({
          titel: row.titel_en || row.titel,
          ikon: row.ikon,
          spoergsmaal: row.spoergsmaal_en || row.spoergsmaal
        }, row.data_en);
      });
      var result = { da: daResult, en: enResult };
      setCache('themes', result);
      return result;
    }).catch(function() {
      return null;
    });
  }

  // ── Email signup ──
  function subscribeEmail(email, rolle, lang) {
    if (!isConfigured()) {
      return Promise.reject(new Error('Backend not configured'));
    }

    return supabaseRequest('email_subscribers', {
      method: 'POST',
      body: {
        email: email,
        rolle: rolle || 'medarbejder',
        lang: lang || 'da'
      }
    });
  }

  // ── Admin CRUD functions ──

  function adminFetchAll(table) {
    var token = getAdminToken();
    if (!token) return Promise.reject(new Error('Not authenticated'));

    return supabaseRequest(table, {
      token: token,
      order: 'sort_order.asc,created_at.asc'
    });
  }

  function adminUpsert(table, data) {
    var token = getAdminToken();
    if (!token) return Promise.reject(new Error('Not authenticated'));

    var cfg = getConfig();
    var url = cfg.url + '/rest/v1/' + table;

    return fetch(url, {
      method: 'POST',
      headers: {
        'apikey': cfg.key,
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
        'Prefer': 'resolution=merge-duplicates,return=representation'
      },
      body: JSON.stringify(data)
    }).then(function(res) {
      if (!res.ok) throw new Error('Upsert failed: ' + res.status);
      return res.json();
    });
  }

  function adminDelete(table, id) {
    var token = getAdminToken();
    if (!token) return Promise.reject(new Error('Not authenticated'));

    var cfg = getConfig();
    var url = cfg.url + '/rest/v1/' + table + '?id=eq.' + encodeURIComponent(id);

    return fetch(url, {
      method: 'DELETE',
      headers: {
        'apikey': cfg.key,
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json'
      }
    }).then(function(res) {
      if (!res.ok) throw new Error('Delete failed: ' + res.status);
      return true;
    });
  }

  function adminFetchSubscribers() {
    var token = getAdminToken();
    if (!token) return Promise.reject(new Error('Not authenticated'));

    return supabaseRequest('email_subscribers', {
      token: token,
      order: 'created_at.desc'
    });
  }

  // ── Invalidate cache ──
  function invalidateCache(key) {
    if (key) {
      delete cache[key];
    } else {
      cache = {};
    }
  }

  // ── Load all content (used by app.js on startup) ──
  function loadAllContent() {
    if (!isConfigured()) return Promise.resolve(null);

    return Promise.all([
      fetchExercises(),
      fetchReflections(),
      fetchCircles(),
      fetchThemes()
    ]).then(function(results) {
      return {
        exercises: results[0],
        reflections: results[1],
        circles: results[2],
        themes: results[3]
      };
    }).catch(function() {
      return null;
    });
  }

  // ── Expose globally ──
  window.ClémentBackend = {
    isConfigured: isConfigured,
    loadAllContent: loadAllContent,
    fetchExercises: fetchExercises,
    fetchReflections: fetchReflections,
    fetchCircles: fetchCircles,
    fetchThemes: fetchThemes,
    subscribeEmail: subscribeEmail,
    login: supabaseLogin,
    logout: supabaseLogout,
    isAdminLoggedIn: isAdminLoggedIn,
    getAdminToken: getAdminToken,
    admin: {
      fetchAll: adminFetchAll,
      upsert: adminUpsert,
      delete: adminDelete,
      fetchSubscribers: adminFetchSubscribers
    },
    invalidateCache: invalidateCache
  };

  // Also expose as ClementBackend for easier access (no special chars)
  window.ClementBackend = window.ClémentBackend;

})();
