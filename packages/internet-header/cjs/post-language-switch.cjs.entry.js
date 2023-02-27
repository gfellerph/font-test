'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const index = require('./index-aff25ac1.js');
const svgSprite_component = require('./svg-sprite.component-34d2b125.js');
const svgIcon_component = require('./svg-icon.component-359b7caa.js');
const store = require('./store-92939be1.js');
const ui_service = require('./ui.service-db4a8252.js');
const language_service = require('./language.service-df3821ea.js');

const PostLanguageSwitchList = (props) => (index.h("nav", { class: "language-switch-dropdown", ref: e => props.dropdownRef(e) },
  index.h("h3", { class: "visually-hidden" }, language_service.translate('Change language')),
  index.h("ul", null, props.navLang
    .filter(lang => !lang.isCurrent)
    .map(lang => {
    const TagName = lang.url === null ? 'button' : 'a';
    return (index.h("li", { key: lang.lang },
      index.h(TagName, { onClick: () => props.switchLanguage(lang), href: lang.url, lang: lang.lang, title: lang.title },
        index.h("span", { class: "visually-hidden" }, lang.title),
        index.h("span", { "aria-hidden": "true" }, lang.text))));
  }))));

const postLanguageSwitchCss = "*,:host,*::before,*::after{-webkit-box-sizing:border-box;box-sizing:border-box}button{font:inherit;padding:0}img,svg{max-width:100%;max-height:100%}@media (forced-colors: active){svg{color:white}}.language-switch-dropdown ul,.no-list{list-style:none;padding-left:0;margin-top:0;margin-bottom:0}.btn-blank{background-color:transparent;border:none;border-radius:0;padding:0}.language-switch-dropdown a,.language-switch-dropdown button,.nav-link{text-decoration:none;color:rgba(0, 0, 0, 0.8);-webkit-transition:color 200ms;transition:color 200ms;background-color:transparent;border-radius:0;-webkit-box-shadow:none;box-shadow:none;border:0;margin:0;display:-ms-flexbox;display:flex;-ms-flex-align:center;align-items:center;gap:0.5rem}.language-switch-dropdown a:hover,.language-switch-dropdown button:hover,.nav-link:hover,.language-switch-dropdown a:focus,.language-switch-dropdown button:focus,.nav-link:focus{color:black}.language-switch-dropdown a>svg,.language-switch-dropdown button>svg,.nav-link>svg{width:1.4em;height:1.4em;-ms-flex-negative:0;flex-shrink:0}.language-switch-dropdown a>span,.language-switch-dropdown button>span,.nav-link>span{-ms-flex-negative:1;flex-shrink:1}.box>*:first-child{margin-top:0}.box>*:last-child{margin-bottom:0}.mirrored{-webkit-transform:scaleX(-1);transform:scaleX(-1)}.rotate-270{-webkit-transform:rotate(270deg);transform:rotate(270deg)}.bold{font-weight:700}.light{font-weight:300}.d-flex{display:-ms-flexbox;display:flex}.d-inline-flex{display:-ms-inline-flexbox;display:inline-flex}.align-items-center{-ms-flex-align:center;align-items:center}@media (min-width: 1441px){.wide-container{margin:0 auto;max-width:1440px}}@media (max-width: 599.98px){.container{padding-right:16px;padding-left:16px}}@media (min-width: 600px) and (max-width: 1023.98px){.container{padding-right:32px;padding-left:32px}}@media (min-width: 1024px){.container{padding-right:40px;padding-left:40px}}.visually-hidden{position:absolute;width:1px;height:1px;border:0;padding:0;margin:-1px;overflow:hidden;clip:rect(0 0 0 0)}@media (max-width: -0.02px){.hidden-xs{display:none}}@media (max-width: 399.98px){.hidden-sm{display:none}}@media (max-width: 599.98px){.hidden-rg{display:none}}@media (max-width: 779.98px){.hidden-md{display:none}}@media (max-width: 1023.98px){.hidden-lg{display:none}}@media (max-width: 1279.98px){.hidden-xl{display:none}}@media (max-width: 1440.98px){.hidden-xxl{display:none}}:host{--separator-display:none;--separator-height:100%;display:-ms-flexbox;display:flex;-ms-flex-align:center;align-items:center;-ms-flex-item-align:stretch;align-self:stretch}:host::before{display:var(--separator-display);height:var(--separator-height);border-left:1px solid #e6e6e6;content:\"\"}.lang-btn{display:-ms-flexbox;display:flex;-ms-flex-align:center;align-items:center;height:100%;padding:0 1rem;border:none;-webkit-box-shadow:none;box-shadow:none;background:none;text-transform:uppercase;cursor:pointer;color:rgba(0, 0, 0, 0.8)}.lang-btn:hover,.lang-btn:focus{color:black}.lang-btn svg{width:1.5em;height:1.5em;-webkit-transition:-webkit-transform 250ms;transition:-webkit-transform 250ms;transition:transform 250ms;transition:transform 250ms, -webkit-transform 250ms}.lang-btn svg.rotated{-webkit-transform:rotate(180deg);transform:rotate(180deg)}.language-switch{position:relative;-ms-flex-item-align:stretch;align-self:stretch;height:100%}.language-switch.list{margin-top:1.5rem;display:-ms-flexbox;display:flex;-ms-flex-align:center;align-items:center}.current-language{text-transform:uppercase;border-right:1px solid #cccccc;padding:0.5rem 1rem 0.5rem 0}.dropdown .language-switch-dropdown{position:absolute;top:100%;width:100%;background:white;-webkit-box-shadow:0 1px 2px rgba(0, 0, 0, 0.2), 0 2px 6px 2px rgba(0, 0, 0, 0.1);box-shadow:0 1px 2px rgba(0, 0, 0, 0.2), 0 2px 6px 2px rgba(0, 0, 0, 0.1);z-index:1;-webkit-transform:scale(0.1);transform:scale(0.1);-webkit-transform-origin:center top;transform-origin:center top;-webkit-transition:-webkit-transform 0.1s;transition:-webkit-transform 0.1s;transition:transform 0.1s;transition:transform 0.1s, -webkit-transform 0.1s;margin-top:var(--language-dropdown-margin-top)}@media (prefers-reduced-motion: reduce){.dropdown .language-switch-dropdown{-webkit-transition:none;transition:none}}.dropdown .language-switch-dropdown.open{-webkit-transform:scale(1);transform:scale(1)}.list .language-switch-dropdown ul{display:-ms-flexbox;display:flex}.list .language-switch-dropdown ul>li+li{border-left:1px solid #cccccc}.language-switch-dropdown a,.language-switch-dropdown button{display:-ms-flexbox;display:flex;-ms-flex-align:center;align-items:center;-ms-flex-pack:center;justify-content:center;width:100%;height:3rem;padding:0 0.25rem;text-transform:uppercase;cursor:pointer;-webkit-transition:background-color 200ms, color 200ms;transition:background-color 200ms, color 200ms}.language-switch-dropdown a:hover,.language-switch-dropdown a:focus,.language-switch-dropdown button:hover,.language-switch-dropdown button:focus{background:#f4f3f1}.language-switch-dropdown a span,.language-switch-dropdown button span{overflow:hidden;white-space:nowrap;text-overflow:ellipsis}.list .language-switch-dropdown a,.list .language-switch-dropdown button{color:black;height:auto;padding:0.5rem 1rem}";

const PostLanguageSwitch = class {
  constructor(hostRef) {
    index.registerInstance(this, hostRef);
    this.dropdownToggled = index.createEvent(this, "dropdownToggled", 7);
    this.languageChanged = index.createEvent(this, "languageChanged", 7);
    this.mode = undefined;
    this.langSwitchOpen = false;
  }
  componentWillUpdate() {
    // Check if language switch got set to close and if mode is dropdown
    if (this.languageSwitchDropdown && !this.langSwitchOpen && this.mode == 'dropdown') {
      this.languageSwitchDropdown.classList.remove('open');
      // Check if element has transition applied and whether user prefers to see animations or not
      if (ui_service.elementHasTransition(this.languageSwitchDropdown, 'transform') &&
        !ui_service.userPrefersReducedMotion()) {
        // Wait for CSS transition 'transform' to end before continuing
        return new Promise(resolve => {
          var _a;
          (_a = this.languageSwitchDropdown) === null || _a === void 0 ? void 0 : _a.addEventListener('transitionend', event => {
            if (event.propertyName === 'transform') {
              resolve(true);
            }
          });
        });
      }
    }
  }
  componentDidUpdate() {
    // Language switch got set to open
    if (this.languageSwitchDropdown && this.langSwitchOpen) {
      // Force browser to redraw/refresh DOM before adding 'open' class
      this.languageSwitchDropdown.getBoundingClientRect();
      this.languageSwitchDropdown.classList.add('open');
    }
  }
  /**
   * Open or close the language switch programatically
   * @param force Boolean to force a state
   * @returns Boolean indicating new state
   */
  async toggleDropdown(force) {
    this.langSwitchOpen = force !== null && force !== void 0 ? force : !this.langSwitchOpen;
    this.dropdownToggled.emit({ open: this.langSwitchOpen, element: this.host });
    return this.langSwitchOpen;
  }
  /**
   * Emit a language change to the parent component
   *
   * @param newLang Config of the new language
   */
  switchLanguage(newLang) {
    this.languageChanged.emit(newLang.lang);
    this.toggleDropdown(false);
  }
  getMergedLanguageConfig(config, overrides) {
    if (overrides === undefined) {
      return config;
    }
    return config.map(langConfig => Object.assign({}, langConfig, overrides.find(l => l.lang === langConfig.lang)));
  }
  setDropdownRef(element) {
    this.languageSwitchDropdown = element;
  }
  render() {
    var _a;
    if (((_a = store.state.localizedConfig) === null || _a === void 0 ? void 0 : _a.header) === undefined)
      return;
    const config = store.state.localizedConfig.header;
    const mergedConfig = this.getMergedLanguageConfig(config.navLang, store.state.languageSwitchOverrides);
    return (index.h(index.Host, null, index.h("div", { class: `language-switch ${this.mode}` }, index.h(svgSprite_component.SvgSprite, null), this.mode === 'dropdown' ? (index.h("button", { class: "lang-btn", "aria-expanded": `${this.langSwitchOpen}`, "aria-haspopup": "listbox", onClick: () => this.toggleDropdown() }, index.h("span", { class: "visually-hidden" }, config.translations.navLangAriaLabel), index.h("span", { "aria-hidden": "true" }, store.state.currentLanguage), index.h(svgIcon_component.SvgIcon, { name: "pi-arrow-down", classNames: this.langSwitchOpen ? 'rotated' : '' }))) : (index.h("span", { class: "bold current-language" }, index.h("span", { class: "visually-hidden" }, language_service.translate('Current language is English')), index.h("span", null, store.state.currentLanguage))), this.langSwitchOpen || this.mode === 'list' ? (index.h(PostLanguageSwitchList, { navLang: mergedConfig, switchLanguage: e => this.switchLanguage(e), dropdownRef: e => e !== undefined && this.setDropdownRef(e) })) : null)));
  }
  get host() { return index.getElement(this); }
};
PostLanguageSwitch.style = postLanguageSwitchCss;

exports.post_language_switch = PostLanguageSwitch;

//# sourceMappingURL=post-language-switch.cjs.entry.js.map