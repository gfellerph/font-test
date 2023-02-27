'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const index = require('./index-aff25ac1.js');
const store = require('./store-92939be1.js');
const language_service = require('./language.service-df3821ea.js');
const svgIcon_component = require('./svg-icon.component-359b7caa.js');

const postSkiplinksCss = ":host{display:block}.skiplinks a{position:absolute;top:0.5rem;left:0.5rem;clip:rect(0 0 0 0);width:1px;overflow:hidden;display:-ms-flexbox;display:flex;-ms-flex-align:center;align-items:center;padding:0.25rem;background:white}.skiplinks a:focus-visible{clip:unset;width:auto}";

const PostSkiplinks = class {
  constructor(hostRef) {
    index.registerInstance(this, hostRef);
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
    const config = (_a = store.state.localizedConfig) === null || _a === void 0 ? void 0 : _a.header;
    const mainId = this.getMainId();
    if (config === undefined) {
      return;
    }
    return (index.h(index.Host, null, index.h("div", { class: "skiplinks" }, index.h("h1", { class: "visually-hidden" }, language_service.translate('Navigate on post.ch')), index.h("ul", { class: "no-list" }, index.h("li", null, index.h("a", { class: "nav-link", href: config.logo.logoLink, accessKey: "0", title: "[ALT + 0]" }, index.h("span", null, config.logo.logoLinkTitle), index.h(svgIcon_component.SvgIcon, { name: "pi-pointy-arrow-right" }))), index.h("li", null, index.h("a", { class: "nav-link", href: "#post-internet-header-main-navigation", accessKey: "1", title: "[ALT + 1]", onClick: () => this.focusMain() }, index.h("span", null, config.translations.navMainAriaLabel), index.h(svgIcon_component.SvgIcon, { name: "pi-pointy-arrow-right" }))), mainId ? (index.h("li", null, index.h("a", { class: "nav-link", href: `#${mainId}`, accessKey: "2", title: "[ALT + 2]" }, index.h("span", null, language_service.translate('Go to main content')), index.h(svgIcon_component.SvgIcon, { name: "pi-pointy-arrow-right" })))) : null, store.state.search ? (index.h("li", null, index.h("a", { class: "nav-link", href: "#post-internet-header-search-button", accessKey: "3", title: "[ALT + 3]", onClick: () => this.focusSearch() }, index.h("span", null, language_service.translate('Go to search')), index.h(svgIcon_component.SvgIcon, { name: "pi-pointy-arrow-right" })))) : null, store.state.login ? (index.h("li", null, index.h("a", { class: "nav-link", href: "#post-klp-login-widget", accessKey: "4", title: "[ALT + 4]", onClick: () => this.focusLogin() }, index.h("span", null, language_service.translate('Go to login')), index.h(svgIcon_component.SvgIcon, { name: "pi-pointy-arrow-right" })))) : null))));
  }
  get host() { return index.getElement(this); }
};
PostSkiplinks.style = postSkiplinksCss;

exports.post_skiplinks = PostSkiplinks;

//# sourceMappingURL=post-skiplinks.cjs.entry.js.map