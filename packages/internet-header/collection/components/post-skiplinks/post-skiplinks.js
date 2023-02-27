import { Host, h } from '@stencil/core';
import { state } from '../../data/store';
import { translate } from '../../services/language.service';
import { SvgIcon } from '../../utils/svg-icon.component';
export class PostSkiplinks {
  getMainId() {
    var _a;
    return (_a = document.querySelector('main[id]')) === null || _a === void 0 ? void 0 : _a.getAttribute('id');
  }
  setFocus(tagname) {
    const rootHost = this.host.closest('.post-internet-header');
    if (!rootHost) {
      return;
    }
    const focusable = rootHost.querySelector(tagname);
    if (focusable) {
      focusable.setFocus();
    }
  }
  focusMain() {
    this.setFocus('post-main-navigation');
  }
  focusSearch() {
    this.setFocus('post-search');
  }
  focusLogin() {
    this.setFocus('post-klp-login-widget');
  }
  render() {
    var _a;
    const config = (_a = state.localizedConfig) === null || _a === void 0 ? void 0 : _a.header;
    const mainId = this.getMainId();
    if (config === undefined) {
      return;
    }
    return (h(Host, null, h("div", { class: "skiplinks" }, h("h1", { class: "visually-hidden" }, translate('Navigate on post.ch')), h("ul", { class: "no-list" }, h("li", null, h("a", { class: "nav-link", href: config.logo.logoLink, accessKey: "0", title: "[ALT + 0]" }, h("span", null, config.logo.logoLinkTitle), h(SvgIcon, { name: "pi-pointy-arrow-right" }))), h("li", null, h("a", { class: "nav-link", href: "#post-internet-header-main-navigation", accessKey: "1", title: "[ALT + 1]", onClick: () => this.focusMain() }, h("span", null, config.translations.navMainAriaLabel), h(SvgIcon, { name: "pi-pointy-arrow-right" }))), mainId ? (h("li", null, h("a", { class: "nav-link", href: `#${mainId}`, accessKey: "2", title: "[ALT + 2]" }, h("span", null, translate('Go to main content')), h(SvgIcon, { name: "pi-pointy-arrow-right" })))) : null, state.search ? (h("li", null, h("a", { class: "nav-link", href: "#post-internet-header-search-button", accessKey: "3", title: "[ALT + 3]", onClick: () => this.focusSearch() }, h("span", null, translate('Go to search')), h(SvgIcon, { name: "pi-pointy-arrow-right" })))) : null, state.login ? (h("li", null, h("a", { class: "nav-link", href: "#post-klp-login-widget", accessKey: "4", title: "[ALT + 4]", onClick: () => this.focusLogin() }, h("span", null, translate('Go to login')), h(SvgIcon, { name: "pi-pointy-arrow-right" })))) : null))));
  }
  static get is() { return "post-skiplinks"; }
  static get originalStyleUrls() {
    return {
      "$": ["post-skiplinks.scss"]
    };
  }
  static get styleUrls() {
    return {
      "$": ["post-skiplinks.css"]
    };
  }
  static get elementRef() { return "host"; }
}
//# sourceMappingURL=post-skiplinks.js.map
