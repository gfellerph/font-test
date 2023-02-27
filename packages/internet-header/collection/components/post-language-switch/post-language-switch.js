import { Host, h, } from '@stencil/core';
import { SvgSprite } from '../../utils/svg-sprite.component';
import { SvgIcon } from '../../utils/svg-icon.component';
import { state } from '../../data/store';
import { userPrefersReducedMotion, elementHasTransition } from '../../services/ui.service';
import { translate } from '../../services/language.service';
import { PostLanguageSwitchList } from './components/post-language-switch-list';
export class PostLanguageSwitch {
  constructor() {
    this.mode = undefined;
    this.langSwitchOpen = false;
  }
  componentWillUpdate() {
    // Check if language switch got set to close and if mode is dropdown
    if (this.languageSwitchDropdown && !this.langSwitchOpen && this.mode == 'dropdown') {
      this.languageSwitchDropdown.classList.remove('open');
      // Check if element has transition applied and whether user prefers to see animations or not
      if (elementHasTransition(this.languageSwitchDropdown, 'transform') &&
        !userPrefersReducedMotion()) {
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
    if (((_a = state.localizedConfig) === null || _a === void 0 ? void 0 : _a.header) === undefined)
      return;
    const config = state.localizedConfig.header;
    const mergedConfig = this.getMergedLanguageConfig(config.navLang, state.languageSwitchOverrides);
    return (h(Host, null, h("div", { class: `language-switch ${this.mode}` }, h(SvgSprite, null), this.mode === 'dropdown' ? (h("button", { class: "lang-btn", "aria-expanded": `${this.langSwitchOpen}`, "aria-haspopup": "listbox", onClick: () => this.toggleDropdown() }, h("span", { class: "visually-hidden" }, config.translations.navLangAriaLabel), h("span", { "aria-hidden": "true" }, state.currentLanguage), h(SvgIcon, { name: "pi-arrow-down", classNames: this.langSwitchOpen ? 'rotated' : '' }))) : (h("span", { class: "bold current-language" }, h("span", { class: "visually-hidden" }, translate('Current language is English')), h("span", null, state.currentLanguage))), this.langSwitchOpen || this.mode === 'list' ? (h(PostLanguageSwitchList, { navLang: mergedConfig, switchLanguage: e => this.switchLanguage(e), dropdownRef: e => e !== undefined && this.setDropdownRef(e) })) : null)));
  }
  static get is() { return "post-language-switch"; }
  static get encapsulation() { return "shadow"; }
  static get originalStyleUrls() {
    return {
      "$": ["post-language-switch.scss"]
    };
  }
  static get styleUrls() {
    return {
      "$": ["post-language-switch.css"]
    };
  }
  static get properties() {
    return {
      "mode": {
        "type": "string",
        "mutable": false,
        "complexType": {
          "original": "'dropdown' | 'list'",
          "resolved": "\"dropdown\" | \"list\"",
          "references": {}
        },
        "required": false,
        "optional": false,
        "docs": {
          "tags": [],
          "text": ""
        },
        "attribute": "mode",
        "reflect": false
      }
    };
  }
  static get states() {
    return {
      "langSwitchOpen": {}
    };
  }
  static get events() {
    return [{
        "method": "dropdownToggled",
        "name": "dropdownToggled",
        "bubbles": true,
        "cancelable": true,
        "composed": true,
        "docs": {
          "tags": [],
          "text": ""
        },
        "complexType": {
          "original": "DropdownEvent",
          "resolved": "{ open: boolean; element: DropdownElement; }",
          "references": {
            "DropdownEvent": {
              "location": "import",
              "path": "../../models/header.model"
            }
          }
        }
      }, {
        "method": "languageChanged",
        "name": "languageChanged",
        "bubbles": true,
        "cancelable": true,
        "composed": true,
        "docs": {
          "tags": [],
          "text": ""
        },
        "complexType": {
          "original": "string",
          "resolved": "string",
          "references": {}
        }
      }];
  }
  static get methods() {
    return {
      "toggleDropdown": {
        "complexType": {
          "signature": "(force?: boolean) => Promise<boolean>",
          "parameters": [{
              "tags": [{
                  "name": "param",
                  "text": "force Boolean to force a state"
                }],
              "text": "Boolean to force a state"
            }],
          "references": {
            "Promise": {
              "location": "global"
            }
          },
          "return": "Promise<boolean>"
        },
        "docs": {
          "text": "Open or close the language switch programatically",
          "tags": [{
              "name": "param",
              "text": "force Boolean to force a state"
            }, {
              "name": "returns",
              "text": "Boolean indicating new state"
            }]
        }
      }
    };
  }
  static get elementRef() { return "host"; }
}
//# sourceMappingURL=post-language-switch.js.map
