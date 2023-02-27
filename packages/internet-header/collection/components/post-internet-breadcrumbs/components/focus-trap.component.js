import { h } from '@stencil/core';
import { tabbable } from 'tabbable';
let key = 0;
/**
 * Trap the focus inside a specific container by prepending/appending two focus trap
 * input boxes who return the focus into the container.
 *
 * @param props active: activate or deactivate the focus trap
 * @param children Child nodes
 * @returns
 */
export const FocusTrap = (props, children) => {
  var _a;
  // Default value for active is true
  const active = (_a = props.active) !== null && _a !== void 0 ? _a : false;
  const handleFocusIn = (event, mode) => {
    if (!children.length) {
      return;
    }
    // Try to get a list of tabbable elements
    const containerIndex = mode === 'first' ? 0 : children.length - 1;
    const container = children[containerIndex].$elm$;
    const focusable = tabbable(container);
    if (!focusable.length) {
      return;
    }
    // We can trap the focus, cancel the event
    event.preventDefault();
    event.stopPropagation();
    // Select the appropriate element from the list
    const focusIndex = mode === 'first' ? 0 : focusable.length - 1;
    let focusElement = focusable[focusIndex];
    focusElement.focus();
  };
  key++;
  return [
    h("input", { type: "text", "aria-hidden": "true", class: "visually-hidden", key: `focus-trap-before-${key}`, onFocusin: e => active && handleFocusIn(e, 'last') }),
    children,
    h("input", { type: "text", "aria-hidden": "true", class: "visually-hidden", key: `focus-trap-after-${key}`, onFocusin: e => active && handleFocusIn(e, 'first') }),
  ];
};
//# sourceMappingURL=focus-trap.component.js.map
