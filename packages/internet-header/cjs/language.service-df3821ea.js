'use strict';

const store = require('./store-92939be1.js');

const translations = {
  'Close overlay': {
    de: 'Overlay Schliessen',
    fr: 'Fermer la superposition',
    it: 'Chiudi sovrapposizione',
  },
  'Current language is English': {
    de: 'Die aktuelle Sprache ist Deutsch',
    fr: 'La langue actuelle est le français',
    it: "La lingua corrente è l'italiano",
  },
  'Change language': {
    de: 'Sprache wechseln',
    fr: 'Changer de langue',
    it: 'Cambia lingua',
  },
  'Go to main content': {
    de: 'Zum Hauptinhalt springen',
    fr: 'Aller au contenu principal',
    it: 'Vai al contenuto principale',
  },
  'Go to search': {
    de: 'Zur Suche springen',
    fr: 'Aller à la recherche',
    it: 'Vai alla ricerca',
  },
  'Go to login': {
    de: 'Zum Login springen',
    fr: 'Aller au login',
    it: 'Vai al login',
  },
  'Open menu': {
    de: 'Menü öffnen',
    fr: 'Ouvrir le menu',
    it: 'Apri il menu',
  },
  'Navigate on post.ch': {
    de: 'Navigieren auf post.ch',
    fr: 'Naviguer sur post.ch',
    it: 'Navigate su post.ch',
  },
};

const getUserLang = (supportedLanguages, implementorPreferredLanguage, localStorageKey, cookieKey) => {
  // If there are no supported languages, well...
  if (supportedLanguages.length === 0) {
    return undefined;
  }
  // If there is only one language in the config, use this
  if (supportedLanguages.length === 1) {
    return supportedLanguages[0];
  }
  const url = new URL(window.location.href);
  /**
   * Build array of possible language definitions in order of importance.
   * At the end is a filter function that will weed out any undefined or null entries.
   */
  let languagesSet = [
    // Check if implementor overrides lang config
    implementorPreferredLanguage,
    // Check query string param
    url.searchParams.get('lang'),
    // Check url pathname
    url.pathname.split('/').find(segment => supportedLanguages.includes(segment)),
    // Check local storage with the key provided
    localStorageKey !== undefined ? window.localStorage.getItem(localStorageKey) : null,
    // Check cookies
    getCookie('language'),
    getCookie('lang'),
    cookieKey !== undefined ? getCookie(cookieKey) : null,
    // Check document language
    document.documentElement.lang,
    // Check browser preferred language
    getPreferredLanguageFromBrowser(supportedLanguages),
    // Check the state
    store.state.currentLanguage,
  ].filter((lang) => !!lang);
  // Check the set of languages to see if it matches
  // any of the supported languages. Return the first
  // supported language if there is none set
  const lang = languagesSet.find(language => supportedLanguages.includes(language)) || supportedLanguages[0];
  if (!lang || lang.length !== 2) {
    throw new Error(`Current language could not be determined from settings or the language provided (${lang}) is not supported by the Header API.`);
  }
  return lang;
};
/**
 * Persist chosen language to local storage
 * @param lang Currently chose language, two char string
 */
const persistLanguageChoice = (lang, cookieKey, localStorageKey) => {
  if (localStorageKey !== undefined) {
    window.localStorage.setItem(localStorageKey, lang);
  }
  if (cookieKey !== undefined) {
    setCookie(cookieKey, lang);
  }
  store.state.currentLanguage = lang;
};
/**
 * Read a cookie by name
 * https://stackoverflow.com/questions/5639346/what-is-the-shortest-function-for-reading-a-cookie-by-name-in-javascript?rq=1
 * @param name Cookie name
 * @returns Cookie value or an empty string
 */
const getCookie = (name) => {
  var _a;
  return ((_a = document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)')) === null || _a === void 0 ? void 0 : _a.pop()) || '';
};
/**
 * Write a new cookie
 * https://developer.mozilla.org/en-US/docs/Web/API/document/cookie#A_little_framework.3A_a_complete_cookies_reader.2Fwriter_with_full_unicode_support
 * @param key
 * @param value
 */
const setCookie = (key, value) => {
  document.cookie = `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
};
const getPreferredLanguageFromBrowser = (supportedLanguages) => {
  // IE & Chrome
  if (navigator.language) {
    const lang = extractLanguage(navigator.language);
    if (supportedLanguages.indexOf(lang) !== -1) {
      return lang;
    }
  }
  // Chrome supports a list of preferred languages: if the preferred is not supported, we go down the list.
  if (navigator.languages) {
    for (const l of navigator.languages) {
      const lang = extractLanguage(l);
      if (supportedLanguages.indexOf(lang) !== -1) {
        return lang;
      }
    }
  }
  return null;
};
const extractLanguage = (language) => language.substring(0, 2).toLowerCase();
/**
 * Simple translate function for general header UI strings
 *
 * @param key Translation key
 * @param lang Force a language
 * @param translationObject Optionally provide translations
 * @returns Translated string or the key
 */
const translate = (key, lang, translationObject = translations) => { var _a, _b, _c; return (_c = (_a = translationObject[key]) === null || _a === void 0 ? void 0 : _a[(_b = lang !== null && lang !== void 0 ? lang : store.state.currentLanguage) !== null && _b !== void 0 ? _b : '']) !== null && _c !== void 0 ? _c : key; };

exports.getUserLang = getUserLang;
exports.persistLanguageChoice = persistLanguageChoice;
exports.translate = translate;

//# sourceMappingURL=language.service-df3821ea.js.map