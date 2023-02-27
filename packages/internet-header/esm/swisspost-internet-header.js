import { p as promiseResolve, b as bootstrapLazy } from './index-9351b1b6.js';
export { s as setNonce } from './index-9351b1b6.js';

/*
 Stencil Client Patch Browser v3.0.1 | MIT Licensed | https://stenciljs.com
 */
const patchBrowser = () => {
    const importMeta = import.meta.url;
    const opts = {};
    // TODO(STENCIL-663): Remove code related to deprecated `safari10` field.
    if (importMeta !== '') {
        opts.resourcesUrl = new URL('.', importMeta).href;
        // TODO(STENCIL-661): Remove code related to the dynamic import shim
        // TODO(STENCIL-663): Remove code related to deprecated `safari10` field.
    }
    return promiseResolve(opts);
};

patchBrowser().then(options => {
  return bootstrapLazy([["swisspost-internet-header",[[1,"swisspost-internet-header",{"project":[1],"stickyness":[1],"language":[1],"meta":[4],"login":[4],"search":[4],"skiplinks":[4],"configProxy":[1,"config-proxy"],"environment":[1],"languageSwitchOverrides":[1,"language-switch-overrides"],"customConfig":[1,"custom-config"],"languageCookieKey":[1,"language-cookie-key"],"languageLocalStorageKey":[1,"language-local-storage-key"],"activeRoute":[8,"active-route"],"osFlyoutOverrides":[1,"os-flyout-overrides"],"fullWidth":[4,"full-width"],"activeFlyout":[32],"activeDropdownElement":[32],"getCurrentLanguage":[64]},[[0,"languageChanged","handleLanguageChangeEvent"]]]]],["swisspost-internet-breadcrumbs",[[1,"swisspost-internet-breadcrumbs",{"customItems":[1,"custom-items"],"customBreadcrumbItems":[32],"overlayVisible":[32],"isConcatenated":[32],"dropdownOpen":[32],"refsReady":[32]}]]],["swisspost-internet-footer",[[1,"swisspost-internet-footer",{"liveSupportEnabled":[32]}]]],["post-klp-login-widget",[[1,"post-klp-login-widget",{"setFocus":[64]}]]],["post-language-switch",[[1,"post-language-switch",{"mode":[1],"langSwitchOpen":[32],"toggleDropdown":[64]}]]],["post-logo",[[1,"post-logo",{"showFaviconLogo":[32]}]]],["post-main-navigation",[[1,"post-main-navigation",{"activeFlyout":[32],"mobileMenuOpen":[32],"toggleDropdown":[64],"setFocus":[64],"setActiveFlyout":[64]}]]],["post-meta-navigation",[[1,"post-meta-navigation",{"orientation":[1],"fullWidth":[4,"full-width"]}]]],["post-search",[[1,"post-search",{"searchDropdownOpen":[32],"coveoSuggestions":[32],"placeSuggestions":[32],"parcelSuggestion":[32],"toggleDropdown":[64],"setFocus":[64]}]]],["post-skiplinks",[[0,"post-skiplinks"]]]], options);
});

//# sourceMappingURL=swisspost-internet-header.js.map