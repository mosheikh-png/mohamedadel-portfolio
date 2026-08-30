(function (global) {
  "use strict";

  var DATA = global.PortfolioData;
  var I18N = global.PortfolioI18n;
  var SOUND = global.PortfolioSound;

  var routePage = document.getElementById("route-page");
  var transitionOverlay = document.getElementById("transition-overlay");
  var fabricSurface = document.querySelector(".fabric-surface");
  var globalStar = document.querySelector(".global-star");
  var globalTexture = document.querySelector(".global-texture");

  /* ---------- Icons (inline SVG helpers) ---------- */
  function icon(children, size) {
    size = size || 18;
    return '<svg width="' + size + '" height="' + size + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + children + '</svg>';
  }
  var ICONS = {
    arrowRight: function (s) { return icon('<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>', s); },
    arrowUpRight: function (s) { return icon('<path d="M7 17 17 7"/><path d="M7 7h10v10"/>', s); },
    arrowLeft: function (s) { return icon('<path d="M19 12H5"/><path d="m12 19-7-7 7-7"/>', s); },
    briefcase: function (s) { return icon('<path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/><rect width="20" height="14" x="2" y="6" rx="2"/>', s); },
    user: function (s) { return icon('<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>', s); },
    mail: function (s) { return icon('<rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>', s); },
    menu: function (s) { return icon('<line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="18" y2="18"/>', s); },
    close: function (s) { return icon('<path d="M18 6 6 18"/><path d="m6 6 12 12"/>', s); },
    moon: function (s) { return icon('<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>', s); },
    volume: function (s) { return icon('<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>', s); },
    mute: function (s) { return icon('<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="22" x2="16" y1="9" y2="15"/><line x1="16" x2="22" y1="9" y2="15"/>', s); },
    message: function (s) { return icon('<path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/>', s); },
    phone: function (s) { return icon('<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>', s); },
    home: function (s) { return icon('<path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>', s); },
    quote: function (s) { return icon('<path d="M25.9 7.2v-4.3-5.4h-5V7.2h-8.8v11.1h8.7c0 8.3-3.1 12-8.7 13v4.4c7.8-1.3 13.8-5.2 13.8-17.5z"/>', s); }
  };

  function contactIcon(type) {
    switch (type) {
      case "phone": return ICONS.phone(17);
      case "whatsapp": return ICONS.message(17);
      case "instagram": return ICONS.message(17);
      case "linkedin": return ICONS.message(17);
      case "behance": return ICONS.user(17);
      case "website": return ICONS.mail(17);
      default: return ICONS.arrowRight(17);
    }
  }

  function CONTACT_LINK_LABEL(type, lang) {
    var labels = {
      phone: { en: "Phone", ar: "هاتف" },
      whatsapp: { en: "WhatsApp", ar: "واتساب" },
      instagram: { en: "Instagram", ar: "إنستجرام" },
      linkedin: { en: "LinkedIn", ar: "لينكدإن" },
      behance: { en: "Behance", ar: "بيهانس" },
      facebook: { en: "Facebook", ar: "فيسبوك" },
      x: { en: "X", ar: "إكس" },
      website: { en: "Website", ar: "موقع إلكتروني" },
      other: { en: "Link", ar: "رابط" }
    };
    return labels[type] ? labels[type][lang] : "Link";
  }

  /* ---------- Header ---------- */
  function renderHeader(route) {
    var copy = I18N.getCopy();
    var lang = I18N.language;
    var navItems = [
      { label: copy.home, href: "#/" },
      { label: copy.work, href: "#/work" },
      { label: copy.about, href: "#/about" },
      { label: copy.contact, href: "#/contact" }
    ];
    var motion = getMotionState();

    var nav = navItems.map(function (item) {
      var active = route === item.href.slice(1) ? " is-active" : "";
      return '<a href="' + item.href + '" class="' + active + '">' + item.label + '</a>';
    }).join("");

    var soundIcon = SOUND.isEnabled() ? ICONS.volume(16) : ICONS.mute(16);

    return (
      '<header class="site-header-v2" role="banner">' +
        '<a class="site-brand-v2" href="#/"><span class="brand-monogram-v2">MA</span><span>' + (lang === "ar" ? "محمد عادل" : "MOHAMED ADEL") + '</span></a>' +
        '<nav class="site-nav-v2" aria-label="' + copy.portfolioNavigation + '">' + nav + '</nav>' +
        '<div class="site-header-actions-v2">' +
          '<div class="language-switcher" aria-label="Language selector">' +
            '<button type="button" data-lang="en" class="' + (lang === "en" ? "is-active" : "") + '">EN</button>' +
            '<button type="button" data-lang="ar" class="' + (lang === "ar" ? "is-active" : "") + '">ع</button>' +
          '</div>' +
          '<a class="contact-chip-v2" href="#/contact">' + copy.letsTalk + ' <span aria-hidden="true">&#8599;</span></a>' +
          '<button type="button" class="sound-toggle moon-chip-v2" data-sound-toggle aria-label="' + (SOUND.isEnabled() ? "Mute sounds" : "Enable sounds") + '">' + soundIcon + '</button>' +
          '<label class="' + (motion.animationsEnabled ? "moon-chip-v2 motion-preference-v2" : "moon-chip-v2 motion-preference-v2 is-motion-off") + '" title="' + (lang === "ar" ? "تفضيل الحركة" : "Motion preference") + '">' +
            ICONS.moon(17) +
            '<select aria-label="' + (lang === "ar" ? "تفضيل الحركة" : "Motion preference") + '" data-motion-select>' +
              '<option value="system" ' + (motion.preference === "system" ? "selected" : "") + '>' + (lang === "ar" ? "النظام" : "System") + '</option>' +
              '<option value="enabled" ' + (motion.preference === "enabled" ? "selected" : "") + '>' + (lang === "ar" ? "مفعّلة" : "Enabled") + '</option>' +
              '<option value="reduced" ' + (motion.preference === "reduced" ? "selected" : "") + '>' + (lang === "ar" ? "مخفّضة" : "Reduced") + '</option>' +
            '</select>' +
          '</label>' +
          '<button type="button" class="nav-toggle-v2" data-nav-toggle aria-expanded="false" aria-label="' + copy.portfolioNavigation + '">' + ICONS.menu(20) + '</button>' +
        '</div>' +
      '</header>'
    );
  }

  /* ---------- Pages ---------- */
  function renderHome() {
    var copy = I18N.getCopy();
    var content = I18N.getContent();
    var actions = [
      { title: copy.myWork, href: "#/work", icon: ICONS.briefcase(28) },
      { title: copy.aboutMe, href: "#/about", icon: ICONS.user(28) },
      { title: copy.contactMe, href: "#/contact", icon: ICONS.mail(28) }
    ];
    return (
      '<main class="portfolio-app home-app">' +
        '<section class="portfolio-shell home-shell">' +
          renderHeader("/") +
          '<section class="cover-hero">' +
            '<div class="cover-portrait"><img src="' + DATA.PORTFOLIO[0].heroPortrait + '" alt="Mohamed Adel" loading="eager" fetchpriority="high" decoding="async" /></div>' +
            '<div class="cover-years"><span>' + content.homeStartYear + '</span><i></i><span>' + content.homeEndYear + '</span></div>' +
            '<div class="cover-copy">' +
              '<p class="cover-kicker">' + content.homeKicker + '</p>' +
              '<h1>' + content.homeTitle + '</h1>' +
              '<p class="cover-name">' + content.homeName + '</p>' +
              '<p class="cover-role">' + content.homeRole + '</p>' +
              '<span class="cover-rule"></span>' +
              '<div class="rich-text-content cover-description">' + content.homeDescription + '</div>' +
            '</div>' +
            '<div class="cover-actions" aria-label="' + copy.portfolioNavigation + '">' +
              actions.map(function (a) {
                return '<a class="cover-action-card" href="' + a.href + '"><span class="liquid-orb">' + a.icon + '</span><strong>' + a.title + '</strong>' + ICONS.arrowRight(19) + '</a>';
              }).join("") +
            '</div>' +
          '</section>' +
          '<footer class="cover-footer"><span>&#169; ' + content.footerYear + ' ' + content.homeName + '</span><span>' + copy.graphicDesigner + '</span><a href="mailto:' + content.footerEmail + '">' + content.footerEmail + '</a></footer>' +
        '</section>' +
      '</main>'
    );
  }

  function renderWork() {
    var copy = I18N.getCopy();
    var content = I18N.getContent();
    var lang = I18N.language;
    var titleSplit = content.workTitle.split(/\s+(?=\S+$)/);
    var first = titleSplit[0] || "";
    var accent = titleSplit[1] || "";
    var cards = DATA.WORK_CATEGORIES.map(function (cat, index) {
      var label = I18N.labelFor(cat);
      return (
        '<a href="#/work/' + cat.slug + '" class="work-card work-category-card" aria-label="' + copy.exploreCategory + ': ' + label + '">' +
          '<div class="work-image"><img src="' + cat.image + '" alt="' + label + '" loading="' + (index < 2 ? "eager" : "lazy") + '" decoding="async" /><span>' + String(index + 1).padStart(2, "0") + '</span><div class="work-open">' + ICONS.arrowUpRight(18) + '</div></div>' +
          '<div class="work-meta"><div><p>' + copy.exploreCategory + '</p><h2>' + label + '</h2></div><span class="work-meta-open">' + ICONS.arrowUpRight(17) + '</span></div>' +
        '</a>'
      );
    }).join("");
    return (
      '<main class="portfolio-app inner-app">' +
        '<section class="portfolio-shell inner-shell">' +
          renderHeader("/work") +
          '<section class="page-intro"><p class="page-label">' + content.workLabel + '</p><h1>' + first + '<br />' + (accent ? "<em>" + accent + "</em>" : "") + '</h1><div class="rich-text-content">' + content.workDescription + '</div></section>' +
          '<section class="work-grid work-category-grid" aria-label="Portfolio categories">' + cards + '</section>' +
          '<footer class="inner-footer"><span>' + copy.moreProjects + '</span><span>' + content.homeName + ' — ' + copy.graphicDesigner + '</span></footer>' +
        '</section>' +
      '</main>'
    );
  }

  function renderWorkCategory(slug) {
    var copy = I18N.getCopy();
    var lang = I18N.language;
    var category = null;
    for (var i = 0; i < DATA.WORK_CATEGORIES.length; i++) {
      if (DATA.WORK_CATEGORIES[i].slug === slug) { category = DATA.WORK_CATEGORIES[i]; break; }
    }
    if (!category) {
      return (
        '<main class="portfolio-app inner-app"><section class="portfolio-shell inner-shell">' +
          renderHeader("/work/" + slug) +
          '<section class="work-filter-empty"><span>404</span><h2>' + copy.categoryMissing + '</h2><p>' + copy.categoryMissingDetail + '</p><a href="#/work" class="category-back-link">' + ICONS.arrowLeft(16) + copy.work + '</a></section>' +
        '</section></main>'
      );
    }
    var label = I18N.labelFor(category);
    var words = label.split(" ");
    var firstWord = words[0];
    var accentWords = words.slice(1).join(" ");
    var categoryProjects = DATA.PROJECTS.filter(function (p) { return p.category === category.title; });

    var body = "";
    if (categoryProjects.length) {
      var cards = categoryProjects.map(function (project, index) {
        var projLabel = lang === "ar" ? (project.titleAr || project.title) : project.title;
        return (
          '<article class="work-card">' +
            '<div class="work-image"><img src="' + project.image + '" alt="' + projLabel + '" loading="' + (index === 0 ? "eager" : "lazy") + '" decoding="async" /><span>' + String(index + 1).padStart(2, "0") + '</span><div class="work-open">' + ICONS.arrowUpRight(18) + '</div></div>' +
            '<div class="work-meta"><div><p>' + label + '</p><h2>' + projLabel + '</h2></div>' + (project.url ? '<a href="' + project.url + '" target="_blank" rel="noreferrer" aria-label="' + projLabel + '" class="work-meta-open">' + ICONS.arrowUpRight(17) + '</a>' : '<span class="work-meta-open">' + ICONS.arrowUpRight(17) + '</span>') + '</div>' +
          '</article>'
        );
      }).join("");
      body = '<section class="work-grid">' + cards + '</section>';
    } else {
      body = '<section class="work-filter-empty"><span>' + label + '</span><h2>' + copy.noProjects + '</h2><p>' + copy.noProjectsDetail + '</p></section>';
    }

    return (
      '<main class="portfolio-app inner-app">' +
        '<section class="portfolio-shell inner-shell">' +
          renderHeader("/work/" + slug) +
          '<section class="page-intro category-page-intro"><p class="page-label">02 / ' + label + '</p><h1>' + firstWord + '<br />' + (accentWords ? "<em>" + accentWords + "</em>" : "") + '</h1><p>' + (lang === "ar" ? "مجموعة مختارة من مشاريع " + label + " لمحمد عادل." : "A focused selection of " + category.title.toLowerCase() + " projects by Mohamed Adel.") + '</p><a href="#/work" class="category-back-link">' + ICONS.arrowLeft(16) + copy.allCategories + '</a></section>' +
          body +
          '<footer class="inner-footer"><span>' + copy.moreProjects + '</span><span>' + (lang === "ar" ? "محمد عادل" : "Mohamed Adel") + ' — ' + copy.graphicDesigner + '</span></footer>' +
        '</section>' +
      '</main>'
    );
  }

  function renderAbout() {
    var copy = I18N.getCopy();
    var content = I18N.getContent();
    var cv = getCv();
    var name = content.homeName || "Mohamed Adel";
    var toolCards = cv.software.map(function (t) { return '<div class="cv-tool"><span>' + t[0] + '</span><small>' + t[1] + '</small></div>'; }).join("");
    var skillList = cv.skills.map(function (s) { return '<li>' + s + '</li>'; }).join("");
    var langCards = cv.languages.map(function (item) {
      var dots = "";
      for (var i = 1; i <= 4; i++) { dots += '<i class="' + (i <= item.dots ? "is-filled" : "") + '"></i>'; }
      return '<article class="cv-language-card"><span class="cv-language-flag">' + item.flag + '</span><strong>' + item.name + '</strong><div class="cv-language-level"><small>' + item.level + '</small><span>' + dots + '</span></div></article>';
    }).join("");
    var timeline = cv.experience.map(function (item) {
      return '<article class="cv-timeline-item"><span class="cv-timeline-dot"></span><div><h3>' + item.title + '</h3><p>' + item.summary + '</p></div><time>' + item.date + '</time></article>';
    }).join("");

    return (
      '<main class="portfolio-app inner-app">' +
        '<section class="portfolio-shell inner-shell">' +
          renderHeader("/about") +
          '<section class="about-cv">' +
            '<aside class="about-cv-sidebar">' +
              '<section class="cv-panel"><h2 class="cv-section-heading">' + copy.software + '</h2><div class="cv-software-grid">' + toolCards + '</div></section>' +
              '<section class="cv-panel cv-skills-panel"><h2 class="cv-section-heading">' + copy.skills + '</h2><ul class="cv-skill-list">' + skillList + '</ul></section>' +
            '</aside>' +
            '<section class="about-cv-details">' +
              '<section class="cv-panel"><h2 class="cv-section-heading">' + copy.languages + '</h2><div class="cv-language-list">' + langCards + '</div></section>' +
              '<section class="cv-panel cv-experience-panel"><h2 class="cv-section-heading">' + copy.experience + '</h2><div class="cv-timeline">' + timeline + '</div></section>' +
              '<a class="cv-request-card" href="mailto:' + content.contactEmail + '?subject=CV%20request"><span class="cv-request-icon">' + ICONS.user(25) + '</span><span><strong>' + copy.requestCv + '</strong><small>' + copy.requestCvDetail + '</small></span>' + ICONS.arrowUpRight(23) + '</a>' +
            '</section>' +
            '<section class="about-cv-profile">' +
              '<header class="cv-profile-header"><h1>' + name + '</h1><p class="cv-profile-kicker">' + copy.curriculumVitae + '</p><p class="cv-profile-role">' + content.homeRole + '</p></header>' +
              '<article class="cv-quote-card">' +
                '<span class="cv-quote-mark cv-quote-mark-top" style="color:var(--cyan);opacity:.6;display:block;margin-bottom:18px">' + ICONS.quote(47) + '</span>' +
                '<div class="rich-text-content">' + content.aboutLead + '</div>' +
                '<div class="cv-quote-points"><span>' + content.aboutPointOne + '</span><span>' + content.aboutPointTwo + '</span><span>' + content.aboutPointThree + '</span></div>' +
              '</article>' +
              '<div class="cv-profile-facts"><span><small>' + copy.focus + '</small>' + content.aboutFocus + '</span><span><small>' + copy.basedIn + '</small>' + content.aboutLocation + '</span><span><small>' + copy.availableFor + '</small>' + content.aboutAvailability + '</span></div>' +
            '</section>' +
          '</section>' +
          '<footer class="inner-footer"><span>' + copy.curriculumVitae + ' — ' + content.homeRole + '</span><span>' + name + ' — ' + content.footerYear + '</span></footer>' +
        '</section>' +
      '</main>'
    );
  }

  function renderContact() {
    var copy = I18N.getCopy();
    var content = I18N.getContent();
    var lang = I18N.language;
    var titleSplit = content.contactTitle.split(/\s+(?=\S+$)/);
    var first = titleSplit[0] || "";
    var accent = titleSplit[1] || "";
    var links = DATA.CONTACT_LINKS.map(function (link) {
      var label = CONTACT_LINK_LABEL(link.type, lang);
      var target = link.type === "phone" ? "" : ' target="_blank" rel="noreferrer"';
      return '<a href="' + link.url + '"' + target + ' class="contact-link-card">' + contactIcon(link.type) + '<span>' + label + '</span>' + ICONS.arrowUpRight(15) + '</a>';
    }).join("");
    return (
      '<main class="portfolio-app inner-app">' +
        '<section class="portfolio-shell inner-shell contact-shell">' +
          renderHeader("/contact") +
          '<section class="contact-page">' +
            '<div class="contact-orbit" aria-hidden="true"><span></span><span></span><span></span></div>' +
            '<div class="contact-copy">' +
              '<p class="page-label">' + content.contactLabel + '</p>' +
              '<h1>' + first + '<br />' + (accent ? "<em>" + accent + "</em>" : "") + '</h1>' +
              '<div class="rich-text-content">' + content.contactDescription + '</div>' +
              '<a class="contact-email-large" href="mailto:' + content.contactEmail + '">' + ICONS.mail(21) + ' ' + content.contactEmail + ' ' + ICONS.arrowUpRight(20) + '</a>' +
              '<nav class="contact-links" aria-label="' + (lang === "ar" ? "قنوات تواصل إضافية" : "Additional contact channels") + '">' + links + '</nav>' +
            '</div>' +
            '<div class="contact-side-note"><span>' + copy.responseTime + '</span><strong>' + content.contactResponseTime + '</strong><span>' + copy.basedIn + '</span><strong>' + content.contactLocation + '</strong></div>' +
          '</section>' +
          '<footer class="inner-footer"><span>' + copy.availableProjects + '</span><span>' + content.homeName + ' — ' + content.homeTitle + '</span></footer>' +
        '</section>' +
      '</main>'
    );
  }

  function renderNotFound() {
    var lang = I18N.language;
    var isArabic = lang === "ar";
    return (
      '<main class="portfolio-app inner-app">' +
        '<section class="portfolio-shell inner-shell">' +
          renderHeader("404") +
          '<section class="notfound-page">' +
            '<h1 class="notfound-code">404</h1>' +
            '<h2 class="notfound-title">' + (isArabic ? "الصفحة غير موجودة" : "Page Not Found") + '</h2>' +
            '<p class="notfound-text">' + (isArabic ? "عذرًا، الصفحة التي تبحث عنها غير موجودة. قد تكون نُقلت أو حُذفت." : "Sorry, the page you are looking for doesn't exist. It may have been moved or deleted.") + '</p>' +
            '<a class="notfound-link" href="#/">' + ICONS.home(16) + (isArabic ? "العودة للرئيسية" : "Go Home") + '</a>' +
          '</section>' +
        '</section>' +
      '</main>'
    );
  }

  /* ---------- CV data ---------- */
  function getCv() {
    return DATA.CV[I18N.language];
  }

  /* ---------- Routing ---------- */
  var CURRENT_LOCATION = getRouteFromHash();
  var DISPLAY_LOCATION = CURRENT_LOCATION;
  var animating = false;

  function getRouteFromHash() {
    var hash = global.location.hash || "#/";
    hash = hash.replace(/^#/, "");
    if (!hash) hash = "/";
    return hash;
  }

  function matchRoute(route) {
    if (route === "/") return renderHome();
    if (route === "/work") return renderWork();
    if (route.indexOf("/work/") === 0) return renderWorkCategory(route.slice("/work/".length));
    if (route === "/about") return renderAbout();
    if (route === "/contact") return renderContact();
    return renderNotFound();
  }

  function render() {
    routePage.innerHTML = matchRoute(DISPLAY_LOCATION);
    updateStarPosition();
    bindPageEvents();
    global.scrollTo(0, 0);
  }

  function updateStarPosition() {
    document.documentElement.dataset.starPos = DISPLAY_LOCATION === "/" ? "home" : "other";
  }

  function getSliceCount() {
    return global.innerWidth <= 600 ? 2 : 2;
  }

  function runTransition(nextRoute) {
    if (!getMotionState().animationsEnabled) {
      SOUND.play("navigate");
      DISPLAY_LOCATION = nextRoute;
      render();
      return;
    }
    if (animating) return;
    animating = true;
    var sliceCount = getSliceCount();
    var slices = "";
    for (var i = 0; i < sliceCount; i++) {
      slices += '<div class="slice" style="--i:' + i + '"></div>';
    }
    transitionOverlay.innerHTML = slices;
    transitionOverlay.className = "transition-container covering";
    document.documentElement.classList.add("transitioning");
    SOUND.coverStart();

    var coverDuration = 350 + (sliceCount - 1) * 20;
    var revealDuration = 300 + (sliceCount - 1) * 20;

    setTimeout(function () {
      DISPLAY_LOCATION = nextRoute;
      render();
      transitionOverlay.className = "transition-container revealing";
    }, coverDuration);

    setTimeout(function () {
      transitionOverlay.className = "transition-container";
      transitionOverlay.innerHTML = "";
      animating = false;
      document.documentElement.classList.remove("transitioning");
    }, coverDuration + revealDuration);
  }

  function navigate(route) {
    if (route === CURRENT_LOCATION) return;
    runTransition(route);
    CURRENT_LOCATION = route;
  }

  /* ---------- Motion preference ---------- */
  var MOTION_STORAGE = "portfolio-motion-preference";
  var PREFERENCE = "enabled";
  var SYSTEM_REDUCED = false;

  function getSystemReduced() {
    return global.matchMedia && global.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  function getMotionPreference() {
    try {
      var stored = global.localStorage.getItem(MOTION_STORAGE);
      if (stored === "enabled" || stored === "reduced" || stored === "system") return stored;
      return stored === "disabled" ? "reduced" : "enabled";
    } catch (e) { return "enabled"; }
  }

  function animationsEnabledFor(pref) {
    return pref === "enabled" || (pref === "system" && !SYSTEM_REDUCED);
  }

  function getMotionState() {
    return { preference: PREFERENCE, animationsEnabled: animationsEnabledFor(PREFERENCE) };
  }

  function applyMotion() {
    var on = animationsEnabledFor(PREFERENCE);
    document.documentElement.dataset.motion = on ? "full" : "reduced";
    SOUND.setMotionEnabled(on);
    SOUND._setSoundOn(SOUND.isEnabled());
  }

  function setMotionPreference(pref) {
    PREFERENCE = pref;
    try { global.localStorage.setItem(MOTION_STORAGE, pref); } catch (e) { /* ignore */ }
    applyMotion();
    render();
  }

  /* ---------- Event binding (delegated) ---------- */
  function bindPageEvents() {
    /* language switcher */
    [].slice.call(routePage.querySelectorAll(".language-switcher button[data-lang]")).forEach(function (btn) {
      btn.addEventListener("click", function () {
        var next = btn.getAttribute("data-lang");
        if (next !== I18N.language) {
          SOUND.play("langSwitch");
          I18N.setLanguage(next);
          render();
        }
      });
    });

    /* sound toggle */
    [].slice.call(routePage.querySelectorAll("[data-sound-toggle]")).forEach(function (btn) {
      btn.addEventListener("click", function () {
        if (SOUND.isEnabled()) SOUND.play("click");
        SOUND.toggle();
        if (!SOUND.isEnabled()) { global.requestAnimationFrame(function () { SOUND.play("click"); }); }
        render();
      });
    });

    /* motion preference select */
    var sel = routePage.querySelector("[data-motion-select]");
    if (sel) {
      sel.addEventListener("change", function () { setMotionPreference(sel.value); });
    }

    /* mobile nav toggle */
    var nav = routePage.querySelector(".site-nav-v2");
    var toggle = routePage.querySelector("[data-nav-toggle]");
    if (nav && toggle) {
      toggle.addEventListener("click", function () {
        var open = nav.classList.toggle("is-open");
        toggle.setAttribute("aria-expanded", open ? "true" : "false");
        toggle.innerHTML = open ? ICONS.close(20) : ICONS.menu(20);
      });
      [].slice.call(nav.querySelectorAll("a")).forEach(function (a) {
        a.addEventListener("click", function () {
          nav.classList.remove("is-open");
          toggle.setAttribute("aria-expanded", "false");
          toggle.innerHTML = ICONS.menu(20);
        });
      });
    }
  }

  /* ---------- Global visual canvas (fabric surface follows pointer) ---------- */
  function initCanvas() {
    if (globalTexture) {
      globalTexture.style.backgroundImage = "url('" + DATA.PORTFOLIO[0].texture + "')";
    }
    if (!fabricSurface) return;
    if (!getMotionState().animationsEnabled) return;
    var fine = global.matchMedia && global.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!fine) return;
    var target = { x: global.innerWidth * 0.5, y: global.innerHeight * 0.5 };
    var current = { x: target.x, y: target.y };
    var raf = 0;
    function onMove(e) { target.x = e.clientX; target.y = e.clientY; }
    function frame() {
      current.x += (target.x - current.x) * 0.075;
      current.y += (target.y - current.y) * 0.075;
      var travel = Math.hypot(target.x - current.x, target.y - current.y);
      var x = (current.x / global.innerWidth) * 100;
      var y = (current.y / global.innerHeight) * 100;
      var opacity = Math.min(0.17, Math.max(0.018, travel / 780));
      fabricSurface.style.setProperty("--fabric-x", x.toFixed(3) + "%");
      fabricSurface.style.setProperty("--fabric-y", y.toFixed(3) + "%");
      fabricSurface.style.setProperty("--fabric-opacity", opacity.toFixed(3));
      raf = global.requestAnimationFrame(frame);
    }
    global.addEventListener("pointermove", onMove, { passive: true });
    raf = global.requestAnimationFrame(frame);
  }

  /* ---------- Init ---------- */
  function init() {
    PREFERENCE = getMotionPreference();
    SYSTEM_REDUCED = getSystemReduced();
    if (global.matchMedia) {
      var mq = global.matchMedia("(prefers-reduced-motion: reduce)");
      if (mq.addEventListener) {
        mq.addEventListener("change", function () {
          SYSTEM_REDUCED = mq.matches;
          applyMotion();
          render();
        });
      }
    }
    applyMotion();
    initCanvas();
    render();

    global.addEventListener("hashchange", function () {
      navigate(getRouteFromHash());
    });
  }

  init();
})(window);
