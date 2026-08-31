/* ==========================================================================
   Static Admin — local persistence layer (client-side only).
   This module is intentionally stateless: it reads/writes a small JSON
   document in localStorage that overrides the base data from js/data.js.
   It applies saved overrides onto the shared global.PortfolioData object so
   that the public pages reflect any edits made in the Admin dashboard.

   Design note: the original project's Admin uses a backend (tRPC + database)
   that does not exist in a pure static GitHub Pages deployment. In this
   static build the Admin runs entirely in the browser and persists to
   localStorage. No secrets, no API keys, no network calls.
   ========================================================================== */
(function (global) {
  "use strict";

  var STORAGE_KEY = "portfolio-admin-v1";
  var EMPTY_STORE = { content: {}, projects: null, contactLinks: null, categories: null };

  function read() {
    try {
      var raw = global.localStorage.getItem(STORAGE_KEY);
      if (!raw) return clone(EMPTY_STORE);
      var parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== "object") return clone(EMPTY_STORE);
      parsed.content = parsed.content || {};
      return parsed;
    } catch (e) {
      return clone(EMPTY_STORE);
    }
  }

  function write(store) {
    try {
      global.localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
    } catch (e) { /* quota / privacy mode — ignore */ }
  }

  function clone(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  /* ----- content field map (keys editable in Content Studio) ----- */
  var CONTENT_FIELDS = [
    "homeKicker", "homeTitle", "homeName", "homeRole", "homeDescription",
    "homeStartYear", "homeEndYear", "footerEmail", "footerYear",
    "aboutLabel", "aboutTitle", "aboutLead", "aboutPointOne", "aboutPointTwo",
    "aboutPointThree", "aboutFocus", "aboutLocation", "aboutAvailability",
    "contactLabel", "contactTitle", "contactDescription", "contactEmail",
    "contactResponseTime", "contactLocation",
    "workLabel", "workTitle", "workDescription"
  ];

  /* ----- apply saved overrides onto shared DATA (idempotent) ----- */
  function applyToData() {
    var DATA = global.PortfolioData;
    if (!DATA) return;
    var store = read();

    // content overrides (mutate DATA.CONTENT[lang][key])
    if (store.content && store._contentSeen !== "applied") {
      var langs = ["en", "ar"];
      for (var li = 0; li < langs.length; li++) {
        var lang = langs[li];
        var ov = store.content[lang];
        if (!ov || typeof ov !== "object") continue;
        var base = DATA.CONTENT[lang] = DATA.CONTENT[lang] || {};
        for (var i = 0; i < CONTENT_FIELDS.length; i++) {
          var key = CONTENT_FIELDS[i];
          if (typeof ov[key] === "string") base[key] = ov[key];
        }
      }
      store._contentSeen = "applied";
    }

    // categories overrides
    if (Array.isArray(store.categories) && store.categories.length) {
      DATA.WORK_CATEGORIES = store.categories;
    }

    // projects overrides
    if (Array.isArray(store.projects)) {
      DATA.PROJECTS = store.projects;
    }

    // contact links overrides
    if (Array.isArray(store.contactLinks)) {
      DATA.CONTACT_LINKS = store.contactLinks;
    }
  }

  /* ----- accessors used by the admin UI ----- */
  function getStore() {
    var s = read();
    if (!s.content.en) s.content.en = {};
    if (!s.content.ar) s.content.ar = {};
    return s;
  }

  function saveContent(lang, changes) {
    var s = getStore();
    s.content[lang] = s.content[lang] || {};
    for (var k in changes) {
      if (Object.prototype.hasOwnProperty.call(changes, k)) s.content[lang][k] = changes[k];
    }
    write(s);
    applyToData();
  }

  function saveCategories(cats) {
    var s = getStore();
    s.categories = cats;
    write(s);
    applyToData();
  }

  function saveProjects(projects) {
    var s = getStore();
    s.projects = projects;
    write(s);
    applyToData();
  }

  function saveContactLinks(links) {
    var s = getStore();
    s.contactLinks = links;
    write(s);
    applyToData();
  }

  function reset() {
    try {
      global.localStorage.removeItem(STORAGE_KEY);
    } catch (e) { /* ignore */ }
    // restore base references from the untouched originals
    if (global.PortfolioDataOriginal) {
      global.PortfolioData.CONTENT = global.PortfolioDataOriginal.CONTENT;
      global.PortfolioData.WORK_CATEGORIES = global.PortfolioDataOriginal.WORK_CATEGORIES;
      global.PortfolioData.PROJECTS = global.PortfolioDataOriginal.PROJECTS;
      global.PortfolioData.CONTACT_LINKS = global.PortfolioDataOriginal.CONTACT_LINKS;
    }
  }

  global.PortfolioAdminStore = {
    STORAGE_KEY: STORAGE_KEY,
    CONTENT_FIELDS: CONTENT_FIELDS,
    applyToData: applyToData,
    getStore: getStore,
    saveContent: saveContent,
    saveCategories: saveCategories,
    saveProjects: saveProjects,
    saveContactLinks: saveContactLinks,
    reset: reset
  };

  // snapshot the pristine base data once (used by reset + as the editor's
  // source of truth for unchanged fields)
  if (!global.PortfolioDataOriginal && global.PortfolioData) {
    global.PortfolioDataOriginal = {
      CONTENT: global.PortfolioData.CONTENT,
      WORK_CATEGORIES: global.PortfolioData.WORK_CATEGORIES,
      PROJECTS: global.PortfolioData.PROJECTS,
      CONTACT_LINKS: global.PortfolioData.CONTACT_LINKS
    };
  }

  // apply any previously saved overrides so public pages reflect admin edits
  applyToData();
})(window);
