'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const index = require('./index-aff25ac1.js');
const store = require('./store-92939be1.js');

const postMetaNavigationCss = "*,:host,*::before,*::after{-webkit-box-sizing:border-box;box-sizing:border-box}button{font:inherit;padding:0}img,svg{max-width:100%;max-height:100%}@media (forced-colors: active){svg{color:white}}.meta-list,.no-list{list-style:none;padding-left:0;margin-top:0;margin-bottom:0}.btn-blank{background-color:transparent;border:none;border-radius:0;padding:0}.meta-link,.nav-link{text-decoration:none;color:rgba(0, 0, 0, 0.8);-webkit-transition:color 200ms;transition:color 200ms;background-color:transparent;border-radius:0;-webkit-box-shadow:none;box-shadow:none;border:0;margin:0;display:-ms-flexbox;display:flex;-ms-flex-align:center;align-items:center;gap:0.5rem}.meta-link:hover,.nav-link:hover,.meta-link:focus,.nav-link:focus{color:black}.meta-link>svg,.nav-link>svg{width:1.4em;height:1.4em;-ms-flex-negative:0;flex-shrink:0}.meta-link>span,.nav-link>span{-ms-flex-negative:1;flex-shrink:1}.box>*:first-child{margin-top:0}.box>*:last-child{margin-bottom:0}.mirrored{-webkit-transform:scaleX(-1);transform:scaleX(-1)}.rotate-270{-webkit-transform:rotate(270deg);transform:rotate(270deg)}.bold{font-weight:700}.light{font-weight:300}.d-flex{display:-ms-flexbox;display:flex}.d-inline-flex{display:-ms-inline-flexbox;display:inline-flex}.align-items-center{-ms-flex-align:center;align-items:center}@media (min-width: 1441px){.wide-container{margin:0 auto;max-width:1440px}}@media (max-width: 599.98px){.container{padding-right:16px;padding-left:16px}}@media (min-width: 600px) and (max-width: 1023.98px){.container{padding-right:32px;padding-left:32px}}@media (min-width: 1024px){.container{padding-right:40px;padding-left:40px}}.visually-hidden{position:absolute;width:1px;height:1px;border:0;padding:0;margin:-1px;overflow:hidden;clip:rect(0 0 0 0)}@media (max-width: -0.02px){.hidden-xs{display:none}}@media (max-width: 399.98px){.hidden-sm{display:none}}@media (max-width: 599.98px){.hidden-rg{display:none}}@media (max-width: 779.98px){.hidden-md{display:none}}@media (max-width: 1023.98px){.hidden-lg{display:none}}@media (max-width: 1279.98px){.hidden-xl{display:none}}@media (max-width: 1440.98px){.hidden-xxl{display:none}}:host{display:block;background:#faf9f8;font-size:0.875rem}.meta-container{display:-ms-flexbox;display:flex;-ms-flex-pack:end;justify-content:flex-end;-ms-flex-align:center;align-items:center;min-height:3rem}@media (min-width: 1441px){.meta-container:not(.full-width){margin:0 auto;max-width:1440px}}.meta-container.vertical{-ms-flex-direction:column;flex-direction:column;-ms-flex-align:start;align-items:flex-start;padding-top:2.5rem;padding-bottom:2.5rem}@media (max-width: 599.98px){.meta-container.vertical{padding-right:16px;padding-left:16px}}@media (min-width: 600px) and (max-width: 1023.98px){.meta-container.vertical{padding-right:32px;padding-left:32px}}@media (min-width: 1024px){.meta-container.vertical{padding-right:40px;padding-left:40px}}@media (min-width: 1024px){.meta-container.vertical{display:none}}.meta-container.horizontal ::slotted(*){--separator-display:block;--separator-height:2.125rem}.horizontal .meta-navigation{padding-right:1rem}.meta-list{display:-ms-flexbox;display:flex}.vertical .meta-list{-ms-flex-direction:column;flex-direction:column;-ms-flex-align:start;align-items:flex-start}.meta-link{font-size:0.875rem;display:-ms-flexbox;display:flex;-ms-flex-align:center;align-items:center;padding:0 0.5rem;min-height:2.125rem;border-radius:3px}.meta-link.active{background:#fc0;color:black}.vertical .meta-link{color:black;padding:0}.vertical .meta-link.active{padding:0 0.5rem;margin-left:-0.5rem}";

const PostMetaNavigation = class {
  constructor(hostRef) {
    index.registerInstance(this, hostRef);
    this.orientation = undefined;
    this.fullWidth = false;
  }
  render() {
    var _a;
    if (((_a = store.state.localizedConfig) === null || _a === void 0 ? void 0 : _a.header.navMeta) === undefined)
      return;
    const { navMeta } = store.state.localizedConfig.header;
    return (index.h(index.Host, null, index.h("div", { class: `meta-container ${this.orientation}${this.fullWidth ? ' full-width' : ''}` }, index.h("nav", { class: "meta-navigation" }, index.h("ul", { class: "meta-list" }, navMeta === null || navMeta === void 0 ? void 0 : navMeta.filter(meta => !meta.isHomeLink).map(meta => (index.h("li", { key: meta.url }, index.h("a", { class: { 'active': meta.isActive, 'meta-link': true }, target: meta.target, href: meta.url }, index.h("span", { "aria-hidden": "true" }, meta.text))))))), index.h("slot", null))));
  }
};
PostMetaNavigation.style = postMetaNavigationCss;

exports.post_meta_navigation = PostMetaNavigation;

//# sourceMappingURL=post-meta-navigation.cjs.entry.js.map