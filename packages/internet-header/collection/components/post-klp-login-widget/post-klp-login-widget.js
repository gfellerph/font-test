import { Host, h } from '@stencil/core';
import { state } from '../../data/store';
import { SvgSprite } from '../../utils/svg-sprite.component';
export class PostKlpLoginWidget {
  async componentDidLoad() {
    var _a;
    const { initializeKLPLoginWidget } = await import('./klp-widget.controller');
    if (((_a = state.localizedConfig) === null || _a === void 0 ? void 0 : _a.header.loginWidgetOptions) === undefined)
      return;
    initializeKLPLoginWidget('post-klp-login-widget', Object.assign(Object.assign({}, state.localizedConfig.header.loginWidgetOptions), { environment: state.environment }));
  }
  /**
   * Sets the focus on the login button
   */
  async setFocus() {
    var _a;
    const loginButton = (_a = this.host.shadowRoot) === null || _a === void 0 ? void 0 : _a.querySelectorAll('.klp-widget-anonymous__wrapper a, .klp-widget-authenticated-session a');
    if (loginButton && loginButton.length) {
      loginButton[0].focus();
    }
  }
  render() {
    var _a, _b;
    if (!((_b = (_a = state === null || state === void 0 ? void 0 : state.localizedConfig) === null || _a === void 0 ? void 0 : _a.header) === null || _b === void 0 ? void 0 : _b.loginWidgetOptions)) {
      console.warn(`Internet Header: the login widget is not configured in your portal config. Use <swisspost-internet-header project="${state.projectId}" login="false"></swisspost-internet-header> to turn off the login widget or configure it via the portal config.`);
      return null;
    }
    return (h(Host, null, h(SvgSprite, null), h("div", { class: "widget-wrapper", "data-hj-suppress": true }, h("div", { id: "post-klp-login-widget" }))));
  }
  static get is() { return "post-klp-login-widget"; }
  static get encapsulation() { return "shadow"; }
  static get originalStyleUrls() {
    return {
      "$": ["post-klp-login-widget.scss"]
    };
  }
  static get styleUrls() {
    return {
      "$": ["post-klp-login-widget.css"]
    };
  }
  static get methods() {
    return {
      "setFocus": {
        "complexType": {
          "signature": "() => Promise<void>",
          "parameters": [],
          "references": {
            "Promise": {
              "location": "global"
            },
            "HTMLElement": {
              "location": "global"
            }
          },
          "return": "Promise<void>"
        },
        "docs": {
          "text": "Sets the focus on the login button",
          "tags": []
        }
      }
    };
  }
  static get elementRef() { return "host"; }
}
//# sourceMappingURL=post-klp-login-widget.js.map
