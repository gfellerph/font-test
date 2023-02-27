import { Host, h, } from '@stencil/core';
import { debounce, throttle } from 'throttle-debounce';
import { getLocalizedConfig, getLocalizedCustomConfig, isValidProjectId, } from '../../services/config.service';
import { state, dispose } from '../../data/store';
import { SvgSprite } from '../../utils/svg-sprite.component';
import { SvgIcon } from '../../utils/svg-icon.component';
import { If } from '../../utils/if.component';
import packageJson from '../../../package.json';
export class PostInternetHeader {
  /**
   * Get the currently set language as a two letter string ("de", "fr" "it" or "en")
   * @returns string
   */
  async getCurrentLanguage() {
    var _a;
    return (_a = state.currentLanguage) !== null && _a !== void 0 ? _a : 'de';
  }
  constructor() {
    this.lastScrollTop = window.scrollY || document.documentElement.scrollTop;
    this.lastWindowWidth = window.innerWidth;
    this.handleClickOutsideBound = this.handleClickOutside.bind(this);
    this.project = undefined;
    this.stickyness = 'minimal';
    this.language = undefined;
    this.meta = true;
    this.login = true;
    this.search = true;
    this.skiplinks = true;
    this.configProxy = undefined;
    this.environment = 'prod';
    this.languageSwitchOverrides = undefined;
    this.customConfig = undefined;
    this.languageCookieKey = undefined;
    this.languageLocalStorageKey = 'swisspost-internet-header-language';
    this.activeRoute = 'auto';
    this.osFlyoutOverrides = undefined;
    this.fullWidth = false;
    this.activeFlyout = null;
    this.activeDropdownElement = null;
    if (this.project === undefined || this.project === '' || !isValidProjectId(this.project)) {
      throw new Error(`Internet Header project key is "${this.project}". Please provide a valid project key.`);
    }
  }
  connectedCallback() {
    this.throttledScroll = throttle(300, () => this.handleScrollEvent());
    this.debouncedResize = debounce(200, () => this.handleResize());
    window.addEventListener('scroll', this.throttledScroll, { passive: true });
    window.addEventListener('resize', this.debouncedResize, { passive: true });
  }
  disconnectedCallback() {
    window.removeEventListener('scroll', this.throttledScroll);
    window.removeEventListener('resize', this.debouncedResize);
    // Reset the store to its original state
    dispose();
  }
  async componentWillLoad() {
    // Wait for the config to arrive, then render the header
    try {
      state.projectId = this.project;
      state.environment = this.environment;
      if (this.language !== undefined)
        state.currentLanguage = this.language;
      state.languageSwitchOverrides =
        typeof this.languageSwitchOverrides === 'string'
          ? JSON.parse(this.languageSwitchOverrides)
          : this.languageSwitchOverrides;
      state.osFlyoutOverrides =
        typeof this.osFlyoutOverrides === 'string'
          ? JSON.parse(this.osFlyoutOverrides)
          : this.osFlyoutOverrides;
      if (this.customConfig !== undefined && state.currentLanguage !== null) {
        state.localizedCustomConfig = getLocalizedCustomConfig(this.customConfig, state.currentLanguage);
      }
      state.localizedConfig = await getLocalizedConfig({
        projectId: this.project,
        environment: this.environment,
        language: this.language,
        cookieKey: this.languageCookieKey,
        localStorageKey: this.languageLocalStorageKey,
        activeRouteProp: this.activeRoute,
        localizedCustomConfig: state.localizedCustomConfig,
        osFlyoutOverrides: state.osFlyoutOverrides,
      });
    }
    catch (error) {
      console.error(error);
    }
  }
  componentDidLoad() {
    window.requestAnimationFrame(() => {
      this.handleResize();
      this.headerLoaded.emit();
      this.host.classList.add('header-loaded');
    });
  }
  async handleLanguageChange(newValue) {
    state.currentLanguage = newValue;
    state.localizedConfig = await getLocalizedConfig({
      projectId: this.project,
      environment: this.environment,
      language: newValue,
      cookieKey: this.languageCookieKey,
      localStorageKey: this.languageLocalStorageKey,
      activeRouteProp: this.activeRoute,
      localizedCustomConfig: state.localizedCustomConfig,
      osFlyoutOverrides: state.osFlyoutOverrides,
    });
    if (this.customConfig)
      state.localizedCustomConfig = getLocalizedCustomConfig(this.customConfig, newValue);
  }
  handleAvailableLanguagesChage(newValue) {
    state.languageSwitchOverrides = typeof newValue === 'string' ? JSON.parse(newValue) : newValue;
  }
  async handleOsFlyoutOverrides(newValue) {
    state.osFlyoutOverrides = typeof newValue === 'string' ? JSON.parse(newValue) : newValue;
    state.localizedConfig = await getLocalizedConfig({
      projectId: this.project,
      environment: this.environment,
      language: this.language,
      cookieKey: this.languageCookieKey,
      localStorageKey: this.languageLocalStorageKey,
      activeRouteProp: this.activeRoute,
      localizedCustomConfig: state.localizedCustomConfig,
      osFlyoutOverrides: state.osFlyoutOverrides,
    });
  }
  async handleActiveRouteChange(newValue) {
    state.localizedConfig = await getLocalizedConfig({
      projectId: this.project,
      environment: this.environment,
      language: this.language,
      cookieKey: this.languageCookieKey,
      localStorageKey: this.languageLocalStorageKey,
      activeRouteProp: newValue,
      localizedCustomConfig: state.localizedCustomConfig,
      osFlyoutOverrides: state.osFlyoutOverrides,
    });
  }
  async handleCustomConfigChange(newValue) {
    if (this.language === undefined)
      return;
    const localizedCustomConfig = getLocalizedCustomConfig(newValue, this.language);
    state.localizedCustomConfig = localizedCustomConfig;
    state.localizedConfig = await getLocalizedConfig({
      projectId: this.project,
      environment: this.environment,
      language: this.language,
      cookieKey: this.languageCookieKey,
      localStorageKey: this.languageLocalStorageKey,
      activeRouteProp: this.activeRoute,
      localizedCustomConfig: localizedCustomConfig,
      osFlyoutOverrides: state.osFlyoutOverrides,
    });
  }
  handleSearchChange(newValue) {
    state.search = newValue;
  }
  handleLoginChange(newValue) {
    state.login = newValue;
  }
  handleMetaChange(newValue) {
    state.meta = newValue;
  }
  handleLanguageChangeEvent(event) {
    this.handleLanguageChange(event.detail);
  }
  handleClickOutside(event) {
    // Close active dropdown element on click outside of it
    if (this.activeDropdownElement && !event.composedPath().includes(this.activeDropdownElement)) {
      this.activeDropdownElement.toggleDropdown(false);
    }
  }
  handleKeyUp(event) {
    if (event.key === 'Escape') {
      if (this.activeDropdownElement) {
        this.activeDropdownElement.toggleDropdown(false);
      }
      if (this.activeFlyout !== null && this.mainNav) {
        this.mainNav.toggleDropdown(false);
      }
    }
  }
  handleScrollEvent() {
    // Credits: "https://github.com/qeremy/so/blob/master/so.dom.js#L426"
    const st = window.scrollY || document.documentElement.scrollTop;
    // Toggle class without re-rendering the component if stickyness is minimal
    // the other stickyness modes do not need the class
    if (this.stickyness === 'minimal') {
      this.host.classList.toggle('scrolling-up', st <= this.lastScrollTop);
    }
    // For Mobile or negative scrolling
    this.lastScrollTop = st <= 0 ? 0 : st;
  }
  handleResize() {
    var _a;
    // Close main navigation dropdown if size changed to bigger than 1024px (search dropdown will be kept open)
    if (this.isMainNavOpen() && this.lastWindowWidth < 1024 && window.innerWidth >= 1024) {
      (_a = this.activeDropdownElement) === null || _a === void 0 ? void 0 : _a.toggleDropdown(false);
    }
    this.lastWindowWidth = window.innerWidth;
  }
  /**
   * Close open dropdown menus if another is being opened
   *
   * @param event Dropdown toggled event
   * @returns void
   */
  handleDropdownToggled(event) {
    if (!event.detail.open && this.activeDropdownElement !== event.detail.element) {
      // Some dropdown got closed programmatically (possibly by this function). To prevent
      // a circle or an outdated state, we'll not handle this event
      return;
    }
    if (event.detail.open === true) {
      if (this.activeDropdownElement) {
        this.activeDropdownElement.toggleDropdown(false);
      }
      this.activeDropdownElement = event.detail.element;
      if (window.innerWidth >= 1024) {
        // Add event listener to close active dropdown element on click outsite of it
        // Also adds 10ms delay in case of an external interaction:
        //    Some button on the page calls toggleDropdown() -> dropdown opens
        //    Click event bubbles to the window, this.handleClickOutsideBound closes dropdown again
        window.setTimeout(() => {
          window.addEventListener('click', this.handleClickOutsideBound);
        }, 10);
      }
      if (this.activeFlyout !== null && this.mainNav) {
        this.mainNav.setActiveFlyout(null);
      }
    }
    else {
      this.activeDropdownElement = null;
      // Remove event listener as it is not needed if no dropdown element is active
      window.removeEventListener('click', this.handleClickOutsideBound);
    }
  }
  /**
   * Close open dropdowns if the flyout is being opened
   * @param event Flyout toggle event
   */
  handleFlyoutToggled(event) {
    this.activeFlyout = event.detail;
    if (this.activeDropdownElement && event.detail && !this.isMainNavOpen()) {
      this.activeDropdownElement.toggleDropdown(false);
    }
  }
  toggleMobileDropdown() {
    var _a;
    (_a = this.mainNav) === null || _a === void 0 ? void 0 : _a.toggleDropdown();
  }
  isMainNavOpen() {
    return (this.activeDropdownElement && this.activeDropdownElement.tagName === 'POST-MAIN-NAVIGATION');
  }
  render() {
    var _a, _b, _c;
    if (!((_a = state.localizedConfig) === null || _a === void 0 ? void 0 : _a.header)) {
      console.error(new Error('Internet Header: Config cannot be loaded'));
      return;
    }
    const config = state.localizedConfig;
    const renderMetaNavigation = this.meta &&
      config.header.navMeta !== undefined &&
      ((_b = config.header.navMeta) === null || _b === void 0 ? void 0 : _b.filter(meta => !meta.isHomeLink).length) > 0;
    const renderLogin = ((_c = this.login) !== null && _c !== void 0 ? _c : !config.header.isLoginWidgetHidden) && config.header.loginWidgetOptions;
    const renderLanguageSwitch = config.header.navLang.length > 1;
    return (h(Host, { class: `stickyness-${this.stickyness} ${this.activeDropdownElement || this.activeFlyout ? 'dropdown-open' : ''}`, "data-version": packageJson.version, onKeyup: (e) => this.handleKeyUp(e) }, h("header", { class: `post-internet-header${this.fullWidth ? ' full-width' : ''}` }, h(SvgSprite, null), h(If, { condition: this.skiplinks === true }, h("post-skiplinks", null)), h(If, { condition: renderMetaNavigation === true }, h("post-meta-navigation", { orientation: "horizontal", class: "hidden-lg", "full-width": this.fullWidth }, h(If, { condition: renderLanguageSwitch === true }, h("post-language-switch", { id: "post-language-switch-desktop", mode: "dropdown", onDropdownToggled: e => this.handleDropdownToggled(e) })))), h("div", { class: "main-navigation-container wide-container" }, h("post-logo", null), h("button", { class: "menu-button nav-link", onClick: () => this.toggleMobileDropdown() }, h("span", { class: "menu-button-text visually-hidden" }, config.header.mobileMenu.text), h(SvgIcon, { name: this.isMainNavOpen() ? 'pi-close' : 'pi-menu' })), h("post-main-navigation", { onDropdownToggled: e => this.handleDropdownToggled(e), onFlyoutToggled: e => this.handleFlyoutToggled(e), ref: el => (this.mainNav = el) }, h(If, { condition: renderMetaNavigation === true }, h("post-meta-navigation", { orientation: "vertical" }, h(If, { condition: renderLanguageSwitch === true }, h("post-language-switch", { id: "post-language-switch-mobile", mode: "list" }))))), h("div", { class: "main-navigation-controls" }, h(If, { condition: this.search !== false }, h("post-search", { onDropdownToggled: e => this.handleDropdownToggled(e) })), h(If, { condition: !!renderLogin }, h("post-klp-login-widget", null, h("slot", { name: "login-widget" }))), h(If, { condition: renderMetaNavigation === false && renderLanguageSwitch === true }, h("post-language-switch", { id: "post-language-switch-no-meta", onDropdownToggled: e => this.handleDropdownToggled(e), mode: "dropdown" })), h("slot", { name: "main" }))))));
  }
  static get is() { return "swisspost-internet-header"; }
  static get encapsulation() { return "shadow"; }
  static get originalStyleUrls() {
    return {
      "$": ["post-internet-header.scss"]
    };
  }
  static get styleUrls() {
    return {
      "$": ["post-internet-header.css"]
    };
  }
  static get properties() {
    return {
      "project": {
        "type": "string",
        "mutable": false,
        "complexType": {
          "original": "string",
          "resolved": "string",
          "references": {}
        },
        "required": false,
        "optional": false,
        "docs": {
          "tags": [],
          "text": "Your project id, previously passed as query string parameter serviceId."
        },
        "attribute": "project",
        "reflect": false
      },
      "stickyness": {
        "type": "string",
        "mutable": false,
        "complexType": {
          "original": "StickynessOptions",
          "resolved": "\"full\" | \"main\" | \"minimal\" | \"none\"",
          "references": {
            "StickynessOptions": {
              "location": "import",
              "path": "../../models/implementor.model"
            }
          }
        },
        "required": false,
        "optional": false,
        "docs": {
          "tags": [],
          "text": "Sticky behaviour of the header."
        },
        "attribute": "stickyness",
        "reflect": false,
        "defaultValue": "'minimal'"
      },
      "language": {
        "type": "string",
        "mutable": false,
        "complexType": {
          "original": "string",
          "resolved": "string | undefined",
          "references": {}
        },
        "required": false,
        "optional": true,
        "docs": {
          "tags": [],
          "text": "Initial language to be used. Overrides automatic language detection."
        },
        "attribute": "language",
        "reflect": false
      },
      "meta": {
        "type": "boolean",
        "mutable": false,
        "complexType": {
          "original": "boolean",
          "resolved": "boolean",
          "references": {}
        },
        "required": false,
        "optional": false,
        "docs": {
          "tags": [],
          "text": "Toggle the meta navigation."
        },
        "attribute": "meta",
        "reflect": false,
        "defaultValue": "true"
      },
      "login": {
        "type": "boolean",
        "mutable": false,
        "complexType": {
          "original": "boolean",
          "resolved": "boolean",
          "references": {}
        },
        "required": false,
        "optional": false,
        "docs": {
          "tags": [],
          "text": "Toggle the login link (when logged out) or the user widget (when logged in)."
        },
        "attribute": "login",
        "reflect": false,
        "defaultValue": "true"
      },
      "search": {
        "type": "boolean",
        "mutable": false,
        "complexType": {
          "original": "boolean",
          "resolved": "boolean",
          "references": {}
        },
        "required": false,
        "optional": false,
        "docs": {
          "tags": [],
          "text": "Toggle the search button."
        },
        "attribute": "search",
        "reflect": false,
        "defaultValue": "true"
      },
      "skiplinks": {
        "type": "boolean",
        "mutable": false,
        "complexType": {
          "original": "boolean",
          "resolved": "boolean",
          "references": {}
        },
        "required": false,
        "optional": false,
        "docs": {
          "tags": [],
          "text": "Toggle skiplinks. They help keyboard users to quickly jump to important sections of the page."
        },
        "attribute": "skiplinks",
        "reflect": false,
        "defaultValue": "true"
      },
      "configProxy": {
        "type": "string",
        "mutable": false,
        "complexType": {
          "original": "string",
          "resolved": "string | undefined",
          "references": {}
        },
        "required": false,
        "optional": true,
        "docs": {
          "tags": [],
          "text": "DEPRECATED!: Define a proxy URL for the config fetch request. Will be removed in the next major version"
        },
        "attribute": "config-proxy",
        "reflect": false
      },
      "environment": {
        "type": "string",
        "mutable": false,
        "complexType": {
          "original": "Environment",
          "resolved": "\"dev01\" | \"dev02\" | \"devs1\" | \"int01\" | \"int02\" | \"prod\" | \"test\"",
          "references": {
            "Environment": {
              "location": "import",
              "path": "../../models/general.model"
            }
          }
        },
        "required": false,
        "optional": false,
        "docs": {
          "tags": [],
          "text": "Target environment. Choose 'int01' for local testing."
        },
        "attribute": "environment",
        "reflect": false,
        "defaultValue": "'prod'"
      },
      "languageSwitchOverrides": {
        "type": "string",
        "mutable": false,
        "complexType": {
          "original": "string | IAvailableLanguage[]",
          "resolved": "IAvailableLanguage[] | string | undefined",
          "references": {
            "IAvailableLanguage": {
              "location": "import",
              "path": "../../models/language.model"
            }
          }
        },
        "required": false,
        "optional": true,
        "docs": {
          "tags": [],
          "text": "Override the language switch links with custom URLs. Helpful when your application contains sub-pages and you\r\nwould like to stay on subpages when the user changes language."
        },
        "attribute": "language-switch-overrides",
        "reflect": false
      },
      "customConfig": {
        "type": "string",
        "mutable": false,
        "complexType": {
          "original": "string | ICustomConfig",
          "resolved": "ICustomConfig | string | undefined",
          "references": {
            "ICustomConfig": {
              "location": "import",
              "path": "../../models/general.model"
            }
          }
        },
        "required": false,
        "optional": true,
        "docs": {
          "tags": [],
          "text": "Customize the header config loaded from the post portal."
        },
        "attribute": "custom-config",
        "reflect": false
      },
      "languageCookieKey": {
        "type": "string",
        "mutable": false,
        "complexType": {
          "original": "string",
          "resolved": "string | undefined",
          "references": {}
        },
        "required": false,
        "optional": true,
        "docs": {
          "tags": [],
          "text": "The header uses this cookie to set the language. Disables automatic language detection."
        },
        "attribute": "language-cookie-key",
        "reflect": false
      },
      "languageLocalStorageKey": {
        "type": "string",
        "mutable": false,
        "complexType": {
          "original": "string",
          "resolved": "string | undefined",
          "references": {}
        },
        "required": false,
        "optional": true,
        "docs": {
          "tags": [],
          "text": "The header uses this local storage key to set the language. Disables automatic language selection."
        },
        "attribute": "language-local-storage-key",
        "reflect": false,
        "defaultValue": "'swisspost-internet-header-language'"
      },
      "activeRoute": {
        "type": "any",
        "mutable": false,
        "complexType": {
          "original": "'auto' | false | string",
          "resolved": "boolean | string | undefined",
          "references": {}
        },
        "required": false,
        "optional": true,
        "docs": {
          "tags": [],
          "text": "Set the currently activated route. If there is a link matching this URL in the header, it will be highlighted.\r\nWill also highlight partly matching URLs. When set to auto, will use current location.href for comparison."
        },
        "attribute": "active-route",
        "reflect": false,
        "defaultValue": "'auto'"
      },
      "osFlyoutOverrides": {
        "type": "string",
        "mutable": false,
        "complexType": {
          "original": "string | NavMainEntity",
          "resolved": "NavMainEntity | string | undefined",
          "references": {
            "NavMainEntity": {
              "location": "import",
              "path": "../../models/header.model"
            }
          }
        },
        "required": false,
        "optional": true,
        "docs": {
          "tags": [],
          "text": "Online Services only: Add custom links to the special online service navigation entry"
        },
        "attribute": "os-flyout-overrides",
        "reflect": false
      },
      "fullWidth": {
        "type": "boolean",
        "mutable": false,
        "complexType": {
          "original": "boolean",
          "resolved": "boolean | undefined",
          "references": {}
        },
        "required": false,
        "optional": true,
        "docs": {
          "tags": [],
          "text": "Displays the header at full width for full-screen applications"
        },
        "attribute": "full-width",
        "reflect": false,
        "defaultValue": "false"
      }
    };
  }
  static get states() {
    return {
      "activeFlyout": {},
      "activeDropdownElement": {}
    };
  }
  static get events() {
    return [{
        "method": "headerLoaded",
        "name": "headerLoaded",
        "bubbles": true,
        "cancelable": true,
        "composed": true,
        "docs": {
          "tags": [],
          "text": "Fires when the header has been rendered to the page."
        },
        "complexType": {
          "original": "void",
          "resolved": "void",
          "references": {}
        }
      }];
  }
  static get methods() {
    return {
      "getCurrentLanguage": {
        "complexType": {
          "signature": "() => Promise<'de' | 'fr' | 'it' | 'en' | string>",
          "parameters": [],
          "references": {
            "Promise": {
              "location": "global"
            }
          },
          "return": "Promise<string>"
        },
        "docs": {
          "text": "Get the currently set language as a two letter string (\"de\", \"fr\" \"it\" or \"en\")",
          "tags": [{
              "name": "returns",
              "text": "string"
            }]
        }
      }
    };
  }
  static get elementRef() { return "host"; }
  static get watchers() {
    return [{
        "propName": "language",
        "methodName": "handleLanguageChange"
      }, {
        "propName": "languageSwitchOverrides",
        "methodName": "handleAvailableLanguagesChage"
      }, {
        "propName": "osFlyoutOverrides",
        "methodName": "handleOsFlyoutOverrides"
      }, {
        "propName": "activeRoute",
        "methodName": "handleActiveRouteChange"
      }, {
        "propName": "customConfig",
        "methodName": "handleCustomConfigChange"
      }, {
        "propName": "search",
        "methodName": "handleSearchChange"
      }, {
        "propName": "login",
        "methodName": "handleLoginChange"
      }, {
        "propName": "meta",
        "methodName": "handleMetaChange"
      }];
  }
  static get listeners() {
    return [{
        "name": "languageChanged",
        "method": "handleLanguageChangeEvent",
        "target": undefined,
        "capture": false,
        "passive": false
      }];
  }
}
//# sourceMappingURL=post-internet-header.js.map
