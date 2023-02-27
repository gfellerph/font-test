import { h } from '@stencil/core';
import { SvgIcon } from '../../../utils/svg-icon.component';
import { MiddleLinks } from './middle-links.component';
import { translate } from '../../../services/language.service';
export const MiddleDropdown = (props) => {
  return (h("div", { class: "middle-dropdown-container" }, h("button", { class: "middle-dropdown-button btn btn-blank", type: "button", onClick: event => props.clickHandler(event), tabindex: props.focusable === false ? '-1' : undefined }, h("span", { class: "visually-hidden" }, translate('Open menu')), h("span", { "aria-hidden": "true" }, "...")), h(SvgIcon, { name: "pi-arrow-down", classNames: "rotate-270" }), props.dropdownOpen ? (h("nav", { class: "middle-dropdown" }, h("ul", { class: "no-list" }, h(MiddleLinks, { items: props.items, icons: false, focusable: props.focusable })))) : null));
};
//# sourceMappingURL=middle-dropdown.component.js.map
