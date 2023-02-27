import { h } from '@stencil/core';
import { SvgIcon } from '../../../utils/svg-icon.component';
import { MiddleDropdown } from './middle-dropdown.component';
import { MiddleLinks } from './middle-links.component';
export const BreadcrumbList = (props) => {
  var _a;
  const homeItem = props.items[0];
  const lastItem = props.items[props.items.length - 1];
  return (h("ol", { class: "no-list breadcrumbs-list" }, h("li", null, h("a", { class: "home-link nav-link", href: homeItem.url, tabindex: props.focusable === false ? '-1' : undefined }, h("span", { class: "visually-hidden" }, homeItem.text), h(SvgIcon, { name: "pi-home" })), h(SvgIcon, { name: "pi-arrow-down", classNames: "rotate-270" })), props.isConcatenated ? (h("li", null, h(MiddleDropdown, { items: props.items, dropdownOpen: (_a = props.dropdownOpen) !== null && _a !== void 0 ? _a : false, clickHandler: e => props.clickHandler(e), focusable: props.focusable }))) : (h(MiddleLinks, { items: props.items, icons: true, focusable: props.focusable })), h("li", null, h("a", { class: "last-link nav-link", href: lastItem.url, tabindex: props.focusable === false ? '-1' : undefined, ref: el => (props.lastItemRef !== undefined ? props.lastItemRef(el) : null) }, lastItem.text))));
};
//# sourceMappingURL=breadcrumb-list.component.js.map
