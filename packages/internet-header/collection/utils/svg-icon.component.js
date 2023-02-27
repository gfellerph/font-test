import { h } from '@stencil/core';
export const SvgIcon = (props) => (h("svg", { viewBox: "0 0 32 32", "aria-hidden": "true", class: props.classNames }, h("use", { href: `#${props.name}` })));
//# sourceMappingURL=svg-icon.component.js.map
