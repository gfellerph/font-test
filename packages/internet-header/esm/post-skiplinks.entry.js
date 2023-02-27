import { r as registerInstance, h, H as Host, g as getElement } from './index-9351b1b6.js';
import { s as state } from './store-0dceecec.js';
import { t as translate } from './language.service-c2fe2302.js';
import { S as SvgIcon } from './svg-icon.component-256596ec.js';

const postSkiplinksCss = ":host{display:block}.skiplinks a{position:absolute;top:0.5rem;left:0.5rem;clip:rect(0 0 0 0);width:1px;overflow:hidden;display:-ms-flexbox;display:flex;-ms-flex-align:center;align-items:center;padding:0.25rem;background:white}.skiplinks a:focus-visible{clip:unset;width:auto}";

const PostSkiplinks = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
  }
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
  get host() { return getElement(this); }
};
PostSkiplinks.style = postSkiplinksCss;

export { PostSkiplinks as post_skiplinks };

//# sourceMappingURL=post-skiplinks.entry.js.map