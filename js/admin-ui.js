/* ==========================================================================
   Static Admin — dashboard UI (client-side only).
   Renders the #/admin route: Content Studio / Projects / Contact Links.
   All editing is persisted to localStorage via PortfolioAdminStore, so this
   works fully offline on GitHub Pages with no backend and no secrets.

   Backend-dependent features from the original React admin (real database,
   server-side image upload, AI content generation via Gemini) are isolated
   here: they are surfaced as disabled/"requires backend" affordances instead
   of crashing the page.
   ========================================================================== */
(function (global) {
  "use strict";

  var STORE = global.PortfolioAdminStore;
  var T = __text();

  function __text() {
    return {
      back: { en: "Back to site", ar: "العودة للموقع" },
      adminTitle: { en: "Admin Dashboard", ar: "لوحة الإدارة" },
      subtitle: { en: "Local static editor — changes are saved in this browser.", ar: "محرر محلي ثابت — تُحفظ التغييرات في هذا المتصفح." },
      contentStudio: { en: "Content Studio", ar: "محرر المحتوى" },
      projects: { en: "Projects", ar: "المشاريع" },
      contact: { en: "Contact Links", ar: "روابط التواصل" },
      save: { en: "Save changes", ar: "حفظ التغييرات" },
      saved: { en: "Saved", ar: "تم الحفظ" },
      addProject: { en: "Add project", ar: "إضافة مشروع" },
      remove: { en: "Remove", ar: "حذف" },
      addLink: { en: "Add link", ar: "إضافة رابط" },
      noteTitle: { en: "About this build", ar: "عن هذه النسخة" },
      noteBody: { en: "This static deployment runs fully in the browser and persists edits to localStorage. Server-backed features that need a real database (media storage, AI generation, multi-device sync) require the original backend and are intentionally isolated here.", ar: "تعمل هذه النسخة الثابتة بالكامل داخل المتصفح وتُحفظ التعديلات في localStorage. الميزات التي تعتمد على خادم وقاعدة بيانات حقيقية (تخزين الوسائط، التوليد بالذكاء الاصطناعي، المزامنة بين الأجهزة) تتطلب النسخة الأصلية وقد تم عزلها هنا." },
      reset: { en: "Reset all edits", ar: "إعادة ضبط كل التعديلات" },
      langEn: { en: "English", ar: "الإنجليزية" },
      langAr: { en: "Arabic", ar: "العربية" },
      category: { en: "Category", ar: "القسم" },
      titleEn: { en: "Title (EN)", ar: "العنوان (إنجليزي)" },
      titleAr: { en: "Title (AR)", ar: "العنوان (عربي)" },
      summary: { en: "Summary", ar: "الملخص" },
      url: { en: "URL", ar: "الرابط" },
      image: { en: "Image", ar: "الصورة" },
      type: { en: "Type", ar: "النوع" },
      label: { en: "Label", ar: "الاسم" },
      linkValue: { en: "Value", ar: "القيمة" }
    };
  }

  function t(key) {
    var lang = global.PortfolioI18n && global.PortfolioI18n.language === "ar" ? "ar" : "en";
    return T[key] ? T[key][lang] : key;
  }

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }

  var sel = 0; // global editor index counter for unique ids

  /* ---------------- header ---------------- */
  function header() {
    var lang = global.PortfolioI18n ? global.PortfolioI18n.language : "en";
    return (
      '<header class="site-header-v2 admin-header" role="banner">' +
        '<a class="site-brand-v2" href="#/"><span class="brand-monogram-v2">MA</span><span>' + (lang === "ar" ? "إدارة" : "ADMIN") + '</span></a>' +
        '<nav class="site-nav-v2 admin-nav" aria-label="Admin">' +
          '<a href="#/admin" data-admin-tab="content">' + t("contentStudio") + '</a>' +
          '<a href="#/admin" data-admin-tab="projects">' + t("projects") + '</a>' +
          '<a href="#/admin" data-admin-tab="contact">' + t("contact") + '</a>' +
        '</nav>' +
        '<div class="site-header-actions-v2"><a class="contact-chip-v2" href="#/">' + t("back") + ' &#8599;</a></div>' +
      '</header>'
    );
  }

  /* ---------------- Content Studio ---------------- */
  function contentForm() {
    var store = STORE.getStore();
    var DATA = global.PortfolioData;
    var fields = STORE.CONTENT_FIELDS;
    var tabs = ["en", "ar"];
    var tabHtml = "";
    for (var li = 0; li < tabs.length; li++) {
      var l = tabs[li];
      tabHtml += '<button type="button" class="ai-lang-tab" data-ai-lang="' + l + '" data-ai-lang-tab="1">' + t(l === "en" ? "langEn" : "langAr") + '</button>';
    }
    // build editable fields (long fields as textarea, short as input)
    var longFields = { homeDescription: 1, aboutLead: 1, workDescription: 1, contactDescription: 1 };
    var rows = "";
    for (var i = 0; i < fields.length; i++) {
      var f = fields[i];
      var base = DATA.CONTENT.en ? DATA.CONTENT.en[f] : "";
      var type = longFields[f] ? 'textarea' : 'input';
      rows += '<div class="ai-field" data-ai-field="' + f + '">' +
        '<label>' + f + '</label>';
      if (type === "textarea") {
        rows += '<div class="ai-lang-pane" data-ai-lang-pane="en"><textarea data-ai-val="en">' + esc(DATA.CONTENT.en ? DATA.CONTENT.en[f] : "") + '</textarea></div>' +
          '<div class="ai-lang-pane" data-ai-lang-pane="ar" hidden><textarea data-ai-val="ar">' + esc(DATA.CONTENT.ar ? DATA.CONTENT.ar[f] : "") + '</textarea></div>';
      } else {
        rows += '<div class="ai-lang-pane" data-ai-lang-pane="en"><input data-ai-val="en" value="' + esc(DATA.CONTENT.en ? DATA.CONTENT.en[f] : "") + '" /></div>' +
          '<div class="ai-lang-pane" data-ai-lang-pane="ar" hidden><input data-ai-val="ar" value="' + esc(DATA.CONTENT.ar ? DATA.CONTENT.ar[f] : "") + '" /></div>';
      }
      rows += '</div>';
    }
    return (
      '<div class="ai-panel-main">' +
        '<div class="ai-section-head"><h2>' + t("contentStudio") + '</h2><p>' + t("subtitle") + '</p></div>' +
        '<div class="ai-lang-tabs">' + tabHtml + '</div>' +
        '<form class="ai-content-form" data-ai-content-form="1">' + rows +
          '<div class="ai-form-actions"><button type="submit" class="ai-btn-primary">' + t("save") + '</button><span class="ai-saved-note" data-ai-saved></span></div>' +
        '</form>' +
      '</div>'
    );
  }

  /* ---------------- Projects ---------------- */
  function projectsForm() {
    var DATA = global.PortfolioData;
    var cats = DATA.WORK_CATEGORIES.map(function (c) { return '<option value="' + esc(c.title) + '">' + esc(c.title) + '</option>'; }).join("");
    var items = DATA.PROJECTS.map(function (p, i) {
      return (
        '<div class="ai-row" data-ai-row="' + i + '">' +
          '<div class="ai-grid ai-grid-2">' +
            '<label>' + t("titleEn") + '<input data-ai="title" value="' + esc(p.title) + '" /></label>' +
            '<label>' + t("titleAr") + '<input data-ai="titleAr" value="' + esc(p.titleAr || "") + '" /></label>' +
            '<label>' + t("category") + '<select data-ai="category">' + cats + '</select></label>' +
            '<label>' + t("image") + '<input data-ai="image" value="' + esc(p.image || "") + '" /></label>' +
            '<label>' + t("url") + '<input data-ai="url" value="' + esc(p.url || "") + '" /></label>' +
            '<label>' + t("summary") + '<input data-ai="summary" value="' + esc(p.summary || "") + '" /></label>' +
          '</div>' +
          '<button type="button" class="ai-btn-ghost ai-remove-row" data-ai-remove="' + i + '">' + t("remove") + '</button>' +
        '</div>'
      );
    }).join("");
    return (
      '<div class="ai-panel-main">' +
        '<div class="ai-section-head"><h2>' + t("projects") + '</h2><p>' + t("subtitle") + '</p></div>' +
        '<div class="ai-items" data-ai-items>' + items + '</div>' +
        '<div class="ai-form-actions"><button type="button" class="ai-btn-primary" data-ai-add-project>' + t("addProject") + '</button><span class="ai-saved-note" data-ai-saved></span></div>' +
      '</div>'
    );
  }

  /* ---------------- Contact links ---------------- */
  function contactForm() {
    var DATA = global.PortfolioData;
    var links = DATA.CONTACT_LINKS.map(function (l, i) {
      return (
        '<div class="ai-row" data-ai-link="' + i + '">' +
          '<div class="ai-grid ai-grid-3">' +
            '<label>' + t("label") + '<input data-ai="label" value="' + esc(l.label || "") + '" /></label>' +
            '<label>' + t("type") + '<select data-ai="type"><option>phone</option><option>whatsapp</option><option>instagram</option><option>linkedin</option><option>behance</option><option>facebook</option><option>x</option><option>website</option><option>other</option></select></label>' +
            '<label>' + t("linkValue") + '<input data-ai="url" value="' + esc(l.url || "") + '" /></label>' +
          '</div>' +
          '<button type="button" class="ai-btn-ghost ai-remove-link" data-ai-remove-link="' + i + '">' + t("remove") + '</button>' +
        '</div>'
      );
    }).join("");
    return (
      '<div class="ai-panel-main">' +
        '<div class="ai-section-head"><h2>' + t("contact") + '</h2><p>' + t("subtitle") + '</p></div>' +
        '<div class="ai-items" data-ai-links>' + links + '</div>' +
        '<div class="ai-form-actions"><button type="button" class="ai-btn-primary" data-ai-add-link>' + t("addLink") + '</button><span class="ai-saved-note" data-ai-saved></span></div>' +
      '</div>'
    );
  }

  function note() {
    return (
      '<aside class="ai-note">' +
        '<h3>' + t("noteTitle") + '</h3>' +
        '<p>' + t("noteBody") + '</p>' +
        '<button type="button" class="ai-btn-ghost" data-ai-reset>' + t("reset") + '</button>' +
      '</aside>'
    );
  }

  /* ---------------- main render ---------------- */
  function render() {
    return (
      '<main class="portfolio-app inner-app admin-app">' +
        '<section class="portfolio-shell inner-shell admin-shell">' +
          header() +
          '<section class="admin-page">' +
            '<aside class="admin-sidebar">' +
              '<nav class="admin-side-nav">' +
                '<a href="#/admin" data-ai-nav="content" data-ai-nav-link="1">' + t("contentStudio") + '</a>' +
                '<a href="#/admin" data-ai-nav="projects" data-ai-nav-link="1">' + t("projects") + '</a>' +
                '<a href="#/admin" data-ai-nav="contact" data-ai-nav-link="1">' + t("contact") + '</a>' +
              '</nav>' +
              note() +
            '</aside>' +
            '<div class="ai-panel" data-ai-panel="content">' + contentForm() + '</div>' +
            '<div class="ai-panel" data-ai-panel="projects" hidden>' + projectsForm() + '</div>' +
            '<div class="ai-panel" data-ai-panel="contact" hidden>' + contactForm() + '</div>' +
          '</section>' +
        '</section>' +
      '</main>'
    );
  }

  /* ---------------- helpers used by binding ---------------- */
  function getActiveTab() {
    try {
      var v = global.sessionStorage.getItem("portfolio-admin-tab");
      return v === "projects" || v === "contact" ? v : "content";
    } catch (e) { return "content"; }
  }
  function setActiveTab(tab) {
    try { global.sessionStorage.setItem("portfolio-admin-tab", tab); } catch (e) {}
  }

  /* ---------------- event binding ---------------- */
  function bind(root) {
    var panels = {};
    [].slice.call(root.querySelectorAll(".ai-panel")).forEach(function (p) {
      panels[p.getAttribute("data-ai-panel")] = p;
    });
    var navLinks = [].slice.call(root.querySelectorAll("[data-ai-nav-link]"));
    var headerTabs = [].slice.call(root.querySelectorAll(".ai-nav-tabs [data-ai-nav-link]"));

    function switchPanel(tab) {
      Object.keys(panels).forEach(function (k) {
        panels[k].hidden = k !== tab;
      });
      navLinks.forEach(function (a) {
        a.classList.toggle("is-active", a.getAttribute("data-ai-nav") === tab);
      });
      setActiveTab(tab);
    }
    switchPanel(getActiveTab());

    navLinks.forEach(function (a) {
      a.addEventListener("click", function (e) {
        e.preventDefault();
        switchPanel(a.getAttribute("data-ai-nav"));
      });
    });

    /* lang tabs toggle visible pane per content field */
    var langTabs = [].slice.call(root.querySelectorAll("[data-ai-lang-tab]"));
    var activeLang = "en";
    langTabs.forEach(function (b) {
      b.addEventListener("click", function () {
        langTabs.forEach(function (x) { x.classList.remove("is-active"); });
        b.classList.add("is-active");
        activeLang = b.getAttribute("data-ai-lang");
        [].slice.call(root.querySelectorAll("[data-ai-field]")).forEach(function (field) {
          [].slice.call(field.querySelectorAll("[data-ai-lang-pane]")).forEach(function (pane) {
            pane.hidden = pane.getAttribute("data-ai-lang-pane") !== activeLang;
          });
        });
      });
    });
    if (langTabs.length) langTabs[0].classList.add("is-active");

    /* content form save */
    var form = root.querySelector("[data-ai-content-form]");
    if (form) {
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        var changesEn = {}, changesAr = {};
        [].slice.call(root.querySelectorAll("[data-ai-field]")).forEach(function (field) {
          var key = field.getAttribute("data-ai-field");
          var enEl = field.querySelector('[data-ai-val="en"]');
          var arEl = field.querySelector('[data-ai-val="ar"]');
          if (enEl) changesEn[key] = enEl.value;
          if (arEl) changesAr[key] = arEl.value;
        });
        STORE.saveContent("en", changesEn);
        STORE.saveContent("ar", changesAr);
        flashSaved(root);
      });
    }

    /* projects */
    var addP = root.querySelector("[data-ai-add-project]");
    if (addP) {
      addP.addEventListener("click", function () {
        var DATA = global.PortfolioData;
        var projects = JSON.parse(JSON.stringify(DATA.PROJECTS));
        projects.push({ id: Date.now(), title: "", titleAr: "", category: DATA.WORK_CATEGORIES[0] ? DATA.WORK_CATEGORIES[0].title : "Social Media", summary: "", summaryAr: "", image: "", url: "" });
        STORE.saveProjects(projects);
        refreshPanel(root, panels, "projects");
      });
    }
    var items = root.querySelector("[data-ai-items]");
    if (items) {
      items.addEventListener("click", function (e) {
        var btn = e.target.closest("[data-ai-remove]");
        if (!btn) return;
        var Store = STORE;
        var DATA = global.PortfolioData;
        var projects = JSON.parse(JSON.stringify(DATA.PROJECTS));
        projects.splice(Number(btn.getAttribute("data-ai-remove")), 1);
        Store.saveProjects(projects);
        refreshPanel(root, panels, "projects");
      });
    }

    /* contact links */
    var addL = root.querySelector("[data-ai-add-link]");
    if (addL) {
      addL.addEventListener("click", function () {
        var DATA = global.PortfolioData;
        var links = JSON.parse(JSON.stringify(DATA.CONTACT_LINKS));
        links.push({ id: Date.now(), label: "other", labelAr: "", type: "website", url: "" });
        STORE.saveContactLinks(links);
        refreshPanel(root, panels, "contact");
      });
    }
    var linksBox = root.querySelector("[data-ai-links]");
    if (linksBox) {
      linksBox.addEventListener("click", function (e) {
        var btn = e.target.closest("[data-ai-remove-link]");
        if (!btn) return;
        var DATA = global.PortfolioData;
        var links = JSON.parse(JSON.stringify(DATA.CONTACT_LINKS));
        links.splice(Number(btn.getAttribute("data-ai-remove-link")), 1);
        STORE.saveContactLinks(links);
        refreshPanel(root, panels, "contact");
      });
    }

    /* reset */
    var resetBtn = root.querySelector("[data-ai-reset]");
    if (resetBtn) {
      resetBtn.addEventListener("click", function () {
        STORE.reset();
        refreshPanel(root, panels, "content");
      });
    }
  }

  function refreshPanel(root, panels, tab) {
    // re-render just the active panel's inner content
    if (tab === "content") panels.content.innerHTML = contentForm().replace(/^<div class="ai-panel-main">/, "").replace(/<\/div>\s*$/, "");
    else if (tab === "projects") panels.projects.innerHTML = projectsForm();
    else if (tab === "contact") panels.contact.innerHTML = contactForm();
    bind(root); // rebind handlers after re-render
    panels[tab].hidden = false;
    var panelsMap = panels;
    [].slice.call(root.querySelectorAll(".ai-panel")).forEach(function (p) {
      p.hidden = p.getAttribute("data-ai-panel") !== tab;
    });
  }

  function flashSaved(root) {
    var note = root.querySelector("[data-ai-saved]");
    if (!note) return;
    note.textContent = t("saved");
    note.classList.add("ai-visible");
    setTimeout(function () {
      note.textContent = "";
      note.classList.remove("ai-visible");
    }, 1600);
  }

  global.PortfolioAdmin = {
    render: render,
    bind: bind
  };
})(window);
