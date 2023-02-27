export declare const getUserLang: (supportedLanguages: string[], implementorPreferredLanguage?: string, localStorageKey?: string, cookieKey?: string) => string | undefined;
/**
 * Persist chosen language to local storage
 * @param lang Currently chose language, two char string
 */
export declare const persistLanguageChoice: (lang: string, cookieKey?: string, localStorageKey?: string) => void;
/**
 * Read a cookie by name
 * https://stackoverflow.com/questions/5639346/what-is-the-shortest-function-for-reading-a-cookie-by-name-in-javascript?rq=1
 * @param name Cookie name
 * @returns Cookie value or an empty string
 */
export declare const getCookie: (name: string) => string;
/**
 * Write a new cookie
 * https://developer.mozilla.org/en-US/docs/Web/API/document/cookie#A_little_framework.3A_a_complete_cookies_reader.2Fwriter_with_full_unicode_support
 * @param key
 * @param value
 */
export declare const setCookie: (key: string, value: string) => void;
/**
 * Simple translate function for general header UI strings
 *
 * @param key Translation key
 * @param lang Force a language
 * @param translationObject Optionally provide translations
 * @returns Translated string or the key
 */
export declare const translate: (key: string, lang?: string, translationObject?: {
  'Close overlay': {
    de: string;
    fr: string;
    it: string;
  };
  'Current language is English': {
    de: string;
    fr: string;
    it: string;
  };
  'Change language': {
    de: string;
    fr: string;
    it: string;
  };
  'Go to main content': {
    de: string;
    fr: string;
    it: string;
  };
  'Go to search': {
    de: string;
    fr: string;
    it: string;
  };
  'Go to login': {
    de: string;
    fr: string;
    it: string;
  };
  'Open menu': {
    de: string;
    fr: string;
    it: string;
  };
  'Navigate on post.ch': {
    de: string;
    fr: string;
    it: string;
  };
}) => any;
