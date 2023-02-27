import { Host, h } from '@stencil/core';
import { debounce } from 'throttle-debounce';
import { disableBodyScroll, enableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock';
import { SvgIcon } from '../../utils/svg-icon.component';
import { state } from '../../data/store';
import { OverlayComponent } from './components/overlay.component';
import { iframeResizer } from 'iframe-resizer';
import { SvgSprite } from '../../utils/svg-sprite.component';
import { BreadcrumbList } from './components/breadcrumb-list.component';
import { prefersReducedMotion } from '../../utils/utils';
export class PostInternetBreadcrumbs {
  constructor() {
    this.customItems = undefined;
    this.customBreadcrumbItems = undefined;
    this.overlayVisible = undefined;
    this.isConcatenated = undefined;
    this.dropdownOpen = false;
    this.refsReady = false;
  }
  connectedCallback() {
    this.debouncedResize = debounce(200, this.handleResize.bind(this));
    window.addEventListener('resize', this.debouncedResize, { passive: true });
  }
  disconnectedCallback() {
    window.removeEventListener('resize', this.debouncedResize);
    window.removeEventListener('click', this.handleWindowClick);
    clearAllBodyScrollLocks();
  }
  async componentWillLoad() {
    // Wait for the config to arrive, then render the header
    try {
      this.customBreadcrumbItems =
        typeof this.customItems === 'string' ? JSON.parse(this.customItems) : this.customItems;
    }
    catch (error) {
      console.error(error);
    }
  }
  componentDidLoad() {
    // Initially check if breadcrumb items are concatenated
    window.requestAnimationFrame(() => {
      this.handleResize();
    });
  }
  handleCustomConfigChage(newValue) {
    try {
      this.customBreadcrumbItems = typeof newValue === 'string' ? JSON.parse(newValue) : newValue;
    }
    catch (error) {
      console.error(error);
    }
  }
  handleResize() {
    // Catch and exclude vertical resize events, e.g. scrolling in iPhone
    if (window.innerWidth === this.lastWindowWidth) {
      return;
    }
    this.lastWindowWidth = window.innerWidth;
    this.checkConcatenation();
  }
  checkConcatenation() {
    if (this.controlNavRef && this.visibleNavRef) {
      this.refsReady = true;
      // Delay the check
      window.requestAnimationFrame(() => {
        if (this.controlNavRef && this.visibleNavRef) {
          this.isConcatenated = this.controlNavRef.clientWidth > this.visibleNavRef.clientWidth;
        }
      });
    }
  }
  toggleOverlay(overlay, force) {
    var _a;
    const newVisibility = force !== null && force !== void 0 ? force : !this.overlayVisible;
    if (newVisibility) {
      // Will trigger overlayRef() once the HTLM is rendered
      this.overlayVisible = newVisibility;
      this.currentOverlay = overlay;
      this.setBodyScroll(overlay);
    }
    else {
      const activeToggler = (_a = this.host.shadowRoot) === null || _a === void 0 ? void 0 : _a.querySelector('.breadcrumb-buttons [aria-expanded="true"]');
      if (this.openAnimation && this.loadedAnimation) {
        this.openAnimation.reverse();
        this.loadedAnimation.reverse();
        // Delay hiding overlay until after the animation finishes
        Promise.all([this.openAnimation.finished, this.loadedAnimation.finished]).then(() => {
          if (activeToggler) {
            activeToggler.focus();
          }
          this.overlayVisible = newVisibility;
          this.setBodyScroll(overlay);
        });
      }
    }
  }
  /**
   * Disable or re-enable body scrolling, depending on whether overlay is visible or not
   */
  setBodyScroll(overlay) {
    if (this.overlayVisible) {
      disableBodyScroll(overlay, { reserveScrollBarGap: true });
    }
    else {
      enableBodyScroll(overlay);
    }
  }
  toggleDropdown(force) {
    this.dropdownOpen = force !== null && force !== void 0 ? force : !this.dropdownOpen;
    if (this.dropdownOpen) {
      requestAnimationFrame(() => {
        document.addEventListener('click', this.handleWindowClick.bind(this), { once: true });
      });
    }
  }
  handleWindowClick() {
    this.toggleDropdown(false);
  }
  registerIFrameResizer(iFrame) {
    if (!iFrame) {
      return;
    }
    iFrame.addEventListener('load', () => {
      var _a, _b, _c;
      iframeResizer({
        heightCalculationMethod: 'taggedElement',
        scrolling: true,
        checkOrigin: false,
      }, iFrame);
      const duration = prefersReducedMotion ? 0 : 300;
      this.loadedAnimation = (_a = iFrame.parentElement) === null || _a === void 0 ? void 0 : _a.animate([{ opacity: 1, visibility: 'visible', transform: 'translateY(0px)' }], { duration, fill: 'forwards' });
      (_b = iFrame.parentElement) === null || _b === void 0 ? void 0 : _b.classList.add('loaded');
      (_c = this.loadedAnimation) === null || _c === void 0 ? void 0 : _c.finished.then(() => {
        var _a;
        (_a = iFrame.parentElement) === null || _a === void 0 ? void 0 : _a.focus();
      });
    });
  }
  /**
   * Reference function for the overlay element got called. It is either null (overlay closed)
   * or contains the overlay element as parameter.
   * @param e Overlay element or null
   * @returns void
   */
  overlayRef(e) {
    if (!e) {
      return;
    }
    const duration = prefersReducedMotion ? 0 : 500;
    this.openAnimation = e.animate([{ opacity: 1, visibility: 'visible' }], {
      duration,
      fill: 'forwards',
    });
  }
  handleKeyDown(event) {
    if (event.key.toLowerCase() === 'escape') {
      this.toggleOverlay(this.currentOverlay, false);
    }
  }
  handleToggleDropdown() {
    this.toggleDropdown();
  }
  handleToggleOverlay() {
    this.toggleOverlay(this.currentOverlay, false);
  }
  handleControlNavRef(element) {
    this.controlNavRef = element;
    this.checkConcatenation();
  }
  handleVisibleNavRef(element) {
    this.visibleNavRef = element;
    this.checkConcatenation();
  }
  render() {
    // There is something wrong entirely
    if (!state) {
      console.warn(`Internet Breadcrumbs: Could not load config. Please make sure that you included the <swisspost-internet-header></swisspost-internet-header> component.`);
      return null;
    }
    // Config is not loaded yet
    if (!state.localizedConfig) {
      return null;
    }
    // Config has loaded but there is no breadcrumbs config
    if (!state.localizedConfig.breadcrumb) {
      console.warn(`Internet Header: Current project "${state.projectId}" does not include a breadcrumb config. The breadcrumbs will not be rendered. Remove `, document.querySelector('swisspost-internet-breadcrumbs'), `from your markup or configure the breadcrumbs in your portal config to stop seeing this warning.`);
      return null;
    }
    const breadcrumbConfig = state.localizedConfig.breadcrumb;
    const items = this.customBreadcrumbItems !== undefined
      ? [...breadcrumbConfig.items, ...this.customBreadcrumbItems]
      : breadcrumbConfig.items;
    return (h(Host, null, h(SvgSprite, null), h("div", { class: "breadcrumbs" }, h("div", { class: "hidden-control-breadcrumbs", "aria-hidden": "true", tabindex: "-1" }, h("nav", { class: "breadcrumbs-nav", ref: e => e !== undefined && this.handleControlNavRef(e) }, h(BreadcrumbList, { items: items, focusable: false, clickHandler: () => { } }))), h("h2", { class: "visually-hidden" }, breadcrumbConfig.a11yLabel), h("nav", { ref: e => e !== undefined && this.handleVisibleNavRef(e), class: {
        'breadcrumbs-nav': true,
        'visually-hidden': !this.refsReady,
      } }, h(BreadcrumbList, { items: items, dropdownOpen: this.dropdownOpen, isConcatenated: this.isConcatenated, clickHandler: () => this.handleToggleDropdown() })), h("div", { class: "breadcrumb-buttons" }, breadcrumbConfig.buttons.map(button => (h("button", { class: "btn btn-secondary btn-icon", key: button.text, "aria-expanded": `${!!this.overlayVisible && this.currentOverlay === button.overlay}`, onClick: () => this.toggleOverlay(button.overlay, true) }, h(SvgIcon, { name: button.svgIcon.name }), h("span", { class: "visually-hidden" }, button.text))))), this.overlayVisible && (h(OverlayComponent, { overlayRef: e => e !== undefined && this.overlayRef(e), iFrameRef: e => e !== undefined && this.registerIFrameResizer(e), overlay: this.currentOverlay, onClick: () => this.handleToggleOverlay(), onKeyDown: (e) => this.handleKeyDown(e), closeButtonText: state.localizedConfig.header.translations.closeButtonText }))), h("slot", null)));
  }
  static get is() { return "swisspost-internet-breadcrumbs"; }
  static get encapsulation() { return "shadow"; }
  static get originalStyleUrls() {
    return {
      "$": ["post-internet-breadcrumbs.scss"]
    };
  }
  static get styleUrls() {
    return {
      "$": ["post-internet-breadcrumbs.css"]
    };
  }
  static get properties() {
    return {
      "customItems": {
        "type": "string",
        "mutable": false,
        "complexType": {
          "original": "string | IBreadcrumbItem[]",
          "resolved": "IBreadcrumbItem[] | string | undefined",
          "references": {
            "IBreadcrumbItem": {
              "location": "import",
              "path": "../../models/breadcrumbs.model"
            }
          }
        },
        "required": false,
        "optional": true,
        "docs": {
          "tags": [],
          "text": ""
        },
        "attribute": "custom-items",
        "reflect": false
      }
    };
  }
  static get states() {
    return {
      "customBreadcrumbItems": {},
      "overlayVisible": {},
      "isConcatenated": {},
      "dropdownOpen": {},
      "refsReady": {}
    };
  }
  static get elementRef() { return "host"; }
  static get watchers() {
    return [{
        "propName": "customItems",
        "methodName": "handleCustomConfigChage"
      }];
  }
}
//# sourceMappingURL=post-internet-breadcrumbs.js.map
