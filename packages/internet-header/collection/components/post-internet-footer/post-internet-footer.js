import { Host, h } from '@stencil/core';
import { state } from '../../data/store';
import { SvgSprite } from '../../utils/svg-sprite.component';
import { PostFooterBlockCustom } from './components/post-footer-block-custom.component';
import { PostFooterBlockList } from './components/post-footer-block-list.component';
import { PostFooterBlockAddress } from './components/post-footer-block-address.component';
import { PostFooterBlockContact } from './components/post-footer-block-contact.component';
export class PostInternetFooter {
  constructor() {
    this.liveSupportEnabled = false;
    this.liveSupportEnabled = this.unbluEnabled();
    /**
     * If the unblu script is not available, wait 5 seconds for it to load.
     * If it's still not there after 5 seconds, abandon efforts and don't
     * show the live support button.
     */
    if (!this.liveSupportEnabled) {
      let intervalId;
      let runs = 0;
      const checker = () => {
        const isEnabled = this.unbluEnabled();
        if (isEnabled) {
          this.liveSupportEnabled = true;
        }
        if (isEnabled || runs >= 5) {
          window.clearInterval(intervalId);
        }
        runs++;
      };
      intervalId = window.setInterval(checker, 1000);
    }
  }
  /**
   * Check if the unblu live support script is loaded
   * @returns Boolean
   */
  unbluEnabled() {
    return typeof window['unbluLSLoad'] === 'function';
  }
  render() {
    var _a;
    // There is something wrong entirely
    if (!state) {
      console.warn(`Internet Footer: Could not load config. Please make sure that you included the <swisspost-internet-header></swisspost-internet-header> component.`);
      return null;
    }
    // Config has not loaded yet
    if (!state.localizedConfig) {
      return null;
    }
    // There's no footer config
    if (!state.localizedConfig.footer) {
      console.warn(`Internet Footer: Current project "${state.projectId}" does not include a footer config. The footer will not be rendered. Remove `, document.querySelector('swisspost-internet-footer'), `from your markup or configure the footer in your portal config to stop seeing this warning.`);
      return null;
    }
    const footerConfig = state.localizedConfig.footer;
    const customFooterConfig = (_a = state.localizedCustomConfig) === null || _a === void 0 ? void 0 : _a.footer;
    return (h(Host, null, h(SvgSprite, null), h("footer", { class: "post-internet-footer light font-curve-regular" }, h("h2", { class: "visually-hidden" }, footerConfig.title), (customFooterConfig === null || customFooterConfig === void 0 ? void 0 : customFooterConfig.block) && h(PostFooterBlockCustom, { block: customFooterConfig === null || customFooterConfig === void 0 ? void 0 : customFooterConfig.block }), h("div", { class: "footer-container container" }, footerConfig.block
      .filter(block => block.columnType === 'list')
      .map(block => (h(PostFooterBlockList, { key: block.title, block: block }))), footerConfig.block
      .filter(block => block.columnType === 'contact')
      .map(block => (h(PostFooterBlockContact, { key: block.title, block: block, liveSupportEnabled: this.liveSupportEnabled }))), footerConfig.block
      .filter(block => block.columnType === 'address')
      .map(block => (h(PostFooterBlockAddress, { key: block.title, block: block })))), h("div", { class: "copyright container" }, h("span", { class: "bold" }, footerConfig.entry.text), h("ul", { class: "no-list footer-meta-links" }, footerConfig.links
      ? footerConfig.links.map(link => (h("li", { key: link.url }, h("a", { class: "nav-link", href: link.url, target: link.target }, link.text))))
      : null)))));
  }
  static get is() { return "swisspost-internet-footer"; }
  static get encapsulation() { return "shadow"; }
  static get originalStyleUrls() {
    return {
      "$": ["post-internet-footer.scss"]
    };
  }
  static get styleUrls() {
    return {
      "$": ["post-internet-footer.css"]
    };
  }
  static get states() {
    return {
      "liveSupportEnabled": {}
    };
  }
}
//# sourceMappingURL=post-internet-footer.js.map
