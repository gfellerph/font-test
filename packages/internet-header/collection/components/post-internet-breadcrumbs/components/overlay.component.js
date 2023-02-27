import { h } from '@stencil/core';
import { SvgIcon } from '../../../utils/svg-icon.component';
import { FocusTrap } from './focus-trap.component';
/**
 * Overlay implementation with focus trap according to
 * https://www.accessibility-developer-guide.com/examples/widgets/dialog/#modal-dialog
 *
 * @param props
 * @returns
 */
export const OverlayComponent = (props) => (h("div", { class: "overlay", onClick: () => props.onClick(), onKeyDown: e => props.onKeyDown !== undefined && props.onKeyDown(e), ref: e => e !== undefined && props.overlayRef(e) }, h("div", { class: "container", role: "dialog" }, h(FocusTrap, null, h("div", { class: "overlay-container", tabindex: "-1" /* For initial focus */, role: "document", onClick: e => e.stopPropagation() }, h("button", { class: `overlay-close btn-blank d-inline-flex align-items-center nav-link ${props.overlay.id}`, onClick: () => props.onClick() }, h("span", { class: "visually-hidden" }, props.closeButtonText), h(SvgIcon, { name: "pi-close" })), h("iframe", { src: props.overlay.target, frameborder: "0", class: "frame", ref: e => e !== undefined && props.iFrameRef(e) }))), h("div", { class: "loader-wrapper" }, h("div", { class: "loader" })))));
//# sourceMappingURL=overlay.component.js.map
