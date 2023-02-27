import { Host, h } from '@stencil/core';
import { throttle } from 'throttle-debounce';
import { state } from '../../data/store';
import { LogoSprite, FaviconSvg } from './logo-sprite.component';
export class PostLogo {
  constructor() {
    this.showFaviconLogo = undefined;
    // Register window resize event listener and a resize observer on the mainnav controls (they change size while controls are being loaded) to display an accurately sized logo
    this.throttledResize = throttle(300, () => this.handleResize());
    window.addEventListener('resize', this.throttledResize, { passive: true });
    this.resizeObserver = new ResizeObserver(this.handleResize.bind(this));
    // Initially call the resize handler
    this.handleResize();
  }
  componentDidLoad() {
    var _a;
    const mainNavControls = (_a = this.host.parentElement) === null || _a === void 0 ? void 0 : _a.querySelector('.main-navigation-controls');
    if (mainNavControls) {
      this.resizeObserver.observe(mainNavControls);
    }
  }
  disconnectedCallback() {
    window.removeEventListener('resize', this.throttledResize);
    this.resizeObserver.disconnect();
  }
  handleResize() {
    var _a, _b;
    const mainNavControls = (_a = this.host.parentElement) === null || _a === void 0 ? void 0 : _a.querySelector('.main-navigation-controls');
    const menuButton = (_b = this.host.parentElement) === null || _b === void 0 ? void 0 : _b.querySelector('.menu-button');
    if (mainNavControls && menuButton)
      this.showFaviconLogo =
        window.innerWidth - (150 + mainNavControls.clientWidth + menuButton.clientWidth) <= 0;
  }
  render() {
    var _a;
    if (((_a = state.localizedConfig) === null || _a === void 0 ? void 0 : _a.header.logo) === undefined)
      return;
    const config = state.localizedConfig.header.logo;
    return (h(Host, null, h(LogoSprite, null), h("a", { href: config.logoLink, class: "logo" }, h("span", { class: "visually-hidden" }, config.logoLinkTitle), h(FaviconSvg, { className: "square-logo" }), h("img", { class: "logo-svg full-logo", src: config.logoSvg, alt: config.logoText }))));
  }
  static get is() { return "post-logo"; }
  static get encapsulation() { return "shadow"; }
  static get originalStyleUrls() {
    return {
      "$": ["post-logo.scss"]
    };
  }
  static get styleUrls() {
    return {
      "$": ["post-logo.css"]
    };
  }
  static get states() {
    return {
      "showFaviconLogo": {}
    };
  }
  static get elementRef() { return "host"; }
}
//# sourceMappingURL=post-logo.js.map
