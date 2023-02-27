import { h } from '@stencil/core/internal/client';

const SvgIcon = (props) => (h("svg", { viewBox: "0 0 32 32", "aria-hidden": "true", class: props.classNames },
  h("use", { href: `#${props.name}` })));

export { SvgIcon as S };

//# sourceMappingURL=svg-icon.component.js.map