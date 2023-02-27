import { h } from '@stencil/core';
export const LevelOneAction = (props) => {
  var _a, _b, _c;
  const TagName = props.level.url ? 'a' : 'button';
  return (h(TagName, { class: {
      'main-link': true,
      'active': !!props.level.isActiveOverride,
      'focus': props.isOpen,
    }, href: props.level.url, title: ((_a = props.level.title) === null || _a === void 0 ? void 0 : _a.trim()) && ((_b = props.level.title) === null || _b === void 0 ? void 0 : _b.trim()) !== ((_c = props.level.text) === null || _c === void 0 ? void 0 : _c.trim())
      ? props.level.title
      : undefined, tabindex: props.level.url ? undefined : 0, "aria-haspopup": !props.level.noFlyout + '', "aria-expanded": props.level.noFlyout ? null : props.isOpen + '', onTouchEnd: e => props.onTouchEnd(e), onKeyDown: e => props.onKeyDown(e), onClick: e => props.onClick(e) }, h("span", null, props.level.text), h("svg", { "aria-hidden": "true" }, h("use", { href: "#pi-pointy-arrow-right" }))));
};
//# sourceMappingURL=level-one-action.component.js.map
