import { h } from '@stencil/core';
import { SvgIcon } from '../../../utils/svg-icon.component';
export const MiddleLinks = (props) => {
  return props.items.slice(1, -1).map(item => (h("li", { key: item.url }, h("a", { href: item.url, class: "nav-link", tabindex: props.focusable === false ? '-1' : undefined }, h("span", null, item.text)), props.icons ? h(SvgIcon, { name: "pi-arrow-down", classNames: "rotate-270" }) : null)));
};
//# sourceMappingURL=middle-links.component.js.map
