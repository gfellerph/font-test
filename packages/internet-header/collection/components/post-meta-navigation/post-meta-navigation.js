import { Host, h } from '@stencil/core';
import { state } from '../../data/store';
export class PostMetaNavigation {
  constructor() {
    this.orientation = undefined;
    this.fullWidth = false;
  }
  render() {
    var _a;
    if (((_a = state.localizedConfig) === null || _a === void 0 ? void 0 : _a.header.navMeta) === undefined)
      return;
    const { navMeta } = state.localizedConfig.header;
    return (h(Host, null, h("div", { class: `meta-container ${this.orientation}${this.fullWidth ? ' full-width' : ''}` }, h("nav", { class: "meta-navigation" }, h("ul", { class: "meta-list" }, navMeta === null || navMeta === void 0 ? void 0 : navMeta.filter(meta => !meta.isHomeLink).map(meta => (h("li", { key: meta.url }, h("a", { class: { 'active': meta.isActive, 'meta-link': true }, target: meta.target, href: meta.url }, h("span", { "aria-hidden": "true" }, meta.text))))))), h("slot", null))));
  }
  static get is() { return "post-meta-navigation"; }
  static get encapsulation() { return "shadow"; }
  static get originalStyleUrls() {
    return {
      "$": ["post-meta-navigation.scss"]
    };
  }
  static get styleUrls() {
    return {
      "$": ["post-meta-navigation.css"]
    };
  }
  static get properties() {
    return {
      "orientation": {
        "type": "string",
        "mutable": false,
        "complexType": {
          "original": "'horizontal' | 'vertical'",
          "resolved": "\"horizontal\" | \"vertical\"",
          "references": {}
        },
        "required": false,
        "optional": false,
        "docs": {
          "tags": [],
          "text": ""
        },
        "attribute": "orientation",
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
          "text": ""
        },
        "attribute": "full-width",
        "reflect": false,
        "defaultValue": "false"
      }
    };
  }
}
//# sourceMappingURL=post-meta-navigation.js.map
