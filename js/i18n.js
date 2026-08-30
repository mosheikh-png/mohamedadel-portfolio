(function (global) {
  "use strict";

  var STORAGE_KEY = "portfolio-language";

  function getInitialLanguage() {
    try {
      var params = new URLSearchParams(global.location.search);
      var requested = params.get("lang");
      if (requested === "ar" || requested === "en") return requested;
      var stored = global.localStorage.getItem(STORAGE_KEY);
      if (stored === "ar" || stored === "en") return stored;
    } catch (e) { /* ignore */ }
    return "en";
  }

  var language = getInitialLanguage();

  function setLanguage(next) {
    language = next === "ar" ? "ar" : "en";
    try { global.localStorage.setItem(STORAGE_KEY, language); } catch (e) { /* ignore */ }
    apply();
  }

  function apply() {
    var root = document.documentElement;
    root.lang = language;
    root.dir = language === "ar" ? "rtl" : "ltr";
  }

  function getCopy() {
    return global.PortfolioData.UI_COPY[language];
  }

  function getContent() {
    return global.PortfolioData.CONTENT[language];
  }

  function labelFor(category) {
    return language === "ar" ? category.titleAr : category.title;
  }

  global.PortfolioI18n = {
    language: language,
    get language() { return language; },
    setLanguage: setLanguage,
    apply: apply,
    getCopy: getCopy,
    getContent: getContent,
    labelFor: labelFor
  };

  apply();
})(window);
