'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const index = require('./index-aff25ac1.js');

/*
 Stencil Client Patch Browser v3.0.1 | MIT Licensed | https://stenciljs.com
 */
const patchBrowser = () => {
    const importMeta = (typeof document === 'undefined' ? new (require('u' + 'rl').URL)('file:' + __filename).href : (document.currentScript && document.currentScript.src || new URL('swisspost-internet-header.cjs.js', document.baseURI).href));
    const opts = {};
    // TODO(STENCIL-663): Remove code related to deprecated `safari10` field.
    if (importMeta !== '') {
        opts.resourcesUrl = new URL('.', importMeta).href;
        // TODO(STENCIL-661): Remove code related to the dynamic import shim
        // TODO(STENCIL-663): Remove code related to deprecated `safari10` field.
    }
    return index.promiseResolve(opts);
};

patchBrowser().then(options => {
  return index.bootstrapLazy([["swisspost-internet-header.cjs",[[1,"swisspost-internet-header",{"project":[1],"stickyness":[1],"language":[1],"meta":[4],"login":[4],"search":[4],"skiplinks":[4],"configProxy":[1,"config-proxy"],"environment":[1],"languageSwitchOverrides":[1,"language-switch-overrides"],"customConfig":[1,"custom-config"],"languageCookieKey":[1,"language-cookie-key"],"languageLocalStorageKey":[1,"language-local-storage-key"],"activeRoute":[8,"active-route"],"osFlyoutOverrides":[1,"os-flyout-overrides"],"fullWidth":[4,"full-width"],"activeFlyout":[32],"activeDropdownElement":[32],"getCurrentLanguage":[64]},[[0,"languageChanged","handleLanguageChangeEvent"]]]]],["swisspost-internet-breadcrumbs.cjs",[[1,"swisspost-internet-breadcrumbs",{"customItems":[1,"custom-items"],"customBreadcrumbItems":[32],"overlayVisible":[32],"isConcatenated":[32],"dropdownOpen":[32],"refsReady":[32]}]]],["swisspost-internet-footer.cjs",[[1,"swisspost-internet-footer",{"liveSupportEnabled":[32]}]]],["post-klp-login-widget.cjs",[[1,"post-klp-login-widget",{"setFocus":[64]}]]],["post-language-switch.cjs",[[1,"post-language-switch",{"mode":[1],"langSwitchOpen":[32],"toggleDropdown":[64]}]]],["post-logo.cjs",[[1,"post-logo",{"showFaviconLogo":[32]}]]],["post-main-navigation.cjs",[[1,"post-main-navigation",{"activeFlyout":[32],"mobileMenuOpen":[32],"toggleDropdown":[64],"setFocus":[64],"setActiveFlyout":[64]}]]],["post-meta-navigation.cjs",[[1,"post-meta-navigation",{"orientation":[1],"fullWidth":[4,"full-width"]}]]],["post-search.cjs",[[1,"post-search",{"searchDropdownOpen":[32],"coveoSuggestions":[32],"placeSuggestions":[32],"parcelSuggestion":[32],"toggleDropdown":[64],"setFocus":[64]}]]],["post-skiplinks.cjs",[[0,"post-skiplinks"]]]], options);
});

exports.setNonce = index.setNonce;

//# sourceMappingURL=swisspost-internet-header.cjs.js.map