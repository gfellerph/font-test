import { Host, h } from '@stencil/core';
import { throttle } from 'throttle-debounce';
import { disableBodyScroll, enableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock';
import { state } from '../../data/store';
import { userPrefersReducedMotion } from '../../services/ui.service';
import { SvgSprite } from '../../utils/svg-sprite.component';
import { SvgIcon } from '../../utils/svg-icon.component';
import { LevelOneAction } from './components/level-one-action.component';
export class PostMainNavigation {
  constructor() {
    this.resizeTimer = null;
    this.mouseLeaveTimer = null;
    this.mouseEnterTimer = null;
    this.activeFlyout = undefined;
    this.mobileMenuOpen = undefined;
  }
  connectedCallback() {
    this.throttledResize = throttle(300, () => this.handleResize());
    window.addEventListener('resize', this.throttledResize, { passive: true });
    this.setWindowHeight();
  }
  disconnectedCallback() {
    window.removeEventListener('resize', this.throttledResize);
    clearAllBodyScrollLocks();
    if (this.mouseEnterTimer !== null)
      window.clearTimeout(this.mouseEnterTimer);
    if (this.mouseLeaveTimer !== null)
      window.clearTimeout(this.mouseLeaveTimer);
  }
  handleResize() {
    // Suspend all animations and transitions on window resize
    this.host.classList.add('no-animation');
    if (this.resizeTimer !== null)
      window.clearTimeout(this.resizeTimer);
    this.resizeTimer = window.setTimeout(() => {
      this.host.classList.remove('no-animation');
    }, 300);
    this.setWindowHeight();
  }
  // Update window height var
  setWindowHeight() {
    if (!this.host) {
      return;
    }
    this.host.style.setProperty('--window-height', `${window.innerHeight}px`);
    // Safari might or might not show a blank bar at the bottom where the browser
    // controls should be. This timeout waits for this bar to appear before resetting the available height
    window.setTimeout(() => {
      this.host.style.setProperty('--window-height', `${window.innerHeight}px`);
    }, 100);
  }
  openFlyout(id) {
    var _a;
    const flyout = (_a = this.host.shadowRoot) === null || _a === void 0 ? void 0 : _a.getElementById(id);
    if (flyout && this.activeFlyout !== '') {
      // Add flyout animation if there's no flyout open
      this.addFlyoutAnimation(flyout);
    }
    this.activeFlyout = id;
    this.flyoutToggled.emit(id);
    this.setWindowHeight();
    if (this.mouseLeaveTimer !== null) {
      window.clearTimeout(this.mouseLeaveTimer);
      this.mouseLeaveTimer = null;
    }
  }
  closeFlyout(id) {
    var _a;
    if (id === undefined)
      return;
    const flyout = (_a = this.host.shadowRoot) === null || _a === void 0 ? void 0 : _a.getElementById(id);
    if (flyout) {
      // Add flyout animation for close action
      this.addFlyoutAnimation(flyout);
    }
    this.activeFlyout = null;
    this.flyoutToggled.emit();
  }
  addFlyoutAnimation(flyout) {
    // Check if user prefers to see animations or not
    if (!userPrefersReducedMotion()) {
      flyout.classList.add('animate');
      // Remove flyout animation after transition ended
      flyout.addEventListener('transitionend', () => this.removeFlyoutAnimation(flyout), {
        once: true,
      });
    }
  }
  removeFlyoutAnimation(flyout) {
    flyout.classList.remove('animate');
  }
  isActiveFlyout(id) {
    return id === this.activeFlyout;
  }
  handleMouseEnter(level) {
    // Cancel opening the flyout if there already is one scheduled to open
    if (this.mouseEnterTimer !== null) {
      window.clearTimeout(this.mouseEnterTimer);
      this.mouseEnterTimer = null;
    }
    // Cancel closing if we enter again
    if (this.mouseLeaveTimer && this.activeFlyout === level.id) {
      window.clearTimeout(this.mouseLeaveTimer);
      this.mouseLeaveTimer = null;
    }
    if (window.innerWidth >= 1024 && level.flyout.length > 0 && this.activeFlyout !== level.id) {
      // Delay opening the flyout for a moment to give users a chance to move the mouse over the navigation without triggering the flyout
      this.mouseEnterTimer = window.setTimeout(() => {
        this.mouseEnterTimer = null;
        if (level.id !== undefined)
          this.openFlyout(level.id);
      }, 200);
    }
  }
  handleMouseLeave(level) {
    // Cancel opening the flyout if a mouseleave event happens before the flyout opened
    if (this.mouseEnterTimer !== null) {
      window.clearTimeout(this.mouseEnterTimer);
    }
    // Don't close an open flyout if the mouseleave is from another mainnav entry
    if (this.activeFlyout && this.activeFlyout !== level.id) {
      return;
    }
    if (window.innerWidth >= 1024 && level.flyout.length > 0) {
      // Allow the pointer to shortly leave the flyout without closing it. This
      // allows for user mistakes and makes the experience less nervous
      this.mouseLeaveTimer = window.setTimeout(() => {
        this.closeFlyout(level.id);
      }, 300);
    }
  }
  handleTouchEnd(event, level) {
    if (!this.isActiveFlyout(level.id) && !level.noFlyout) {
      // It's the first touchstart and has a flyout, prevent link activation and open the flyout
      if (event.cancelable)
        event.preventDefault();
      if (level.id)
        this.openFlyout(level.id);
    }
  }
  handleKeyPress(event, level) {
    if (event.key === 'Enter' && !this.isActiveFlyout(level.id) && !level.noFlyout) {
      // It's the first enter keypress and has a flyout, prevent link activation and open the flyout
      event.preventDefault();
      if (level.id)
        this.openFlyout(level.id);
    }
  }
  handleClick(event, level) {
    if (!this.isActiveFlyout(level.id) && !level.noFlyout) {
      // It's the first click, always open the flyout, never the link
      // This is relevant for desktop with active screenreader which
      // translates an enter keypress to a click
      event.preventDefault();
      if (level.id)
        this.openFlyout(level.id);
    }
  }
  /**
   * Disable or re-enable body scrolling, depending on whether mobile menu is open or closed
   */
  setBodyScroll() {
    if (this.mobileMenuOpen) {
      disableBodyScroll(this.flyoutElement);
    }
    else {
      enableBodyScroll(this.flyoutElement);
    }
  }
  /**
   * Toggle the main navigation (only visible on mobile)
   * @param force Force a state
   * @returns Boolean indicating new state
   */
  async toggleDropdown(force) {
    this.mobileMenuOpen = force === undefined ? !this.mobileMenuOpen : force;
    this.dropdownToggled.emit({ open: this.mobileMenuOpen, element: this.host });
    if (force === false) {
      this.closeFlyout();
    }
    this.setBodyScroll();
    this.setWindowHeight();
    return this.mobileMenuOpen;
  }
  /**
   * Focus the main navigation toggle button
   */
  async setFocus() {
    var _a;
    const firstLink = (_a = this.host.shadowRoot) === null || _a === void 0 ? void 0 : _a.querySelector('.main-link');
    if (firstLink) {
      firstLink.focus();
    }
  }
  /**
   * Open a specific flyout
   * @param id Flyout ID
   */
  async setActiveFlyout(id) {
    this.activeFlyout = id;
    this.flyoutToggled.emit(this.activeFlyout);
  }
  render() {
    var _a;
    if (((_a = state.localizedConfig) === null || _a === void 0 ? void 0 : _a.header) === undefined)
      return;
    const headerConfig = state.localizedConfig.header;
    return (h(Host, null, h(SvgSprite, null), h("nav", { id: "post-internet-header-main-navigation", class: { 'main-navigation': true, 'open': this.mobileMenuOpen }, ref: el => (this.flyoutElement = el) }, h("h1", { class: "visually-hidden" }, headerConfig.translations.navMainAriaLabel), h("ul", { class: "main-container container" }, headerConfig.navMain.map(levelOne => (h("li", { key: levelOne.text, onMouseLeave: () => this.handleMouseLeave(levelOne), onMouseEnter: () => this.handleMouseEnter(levelOne) }, h(LevelOneAction, { level: levelOne, isOpen: this.isActiveFlyout(levelOne.id), onTouchEnd: e => this.handleTouchEnd(e, levelOne), onKeyDown: e => this.handleKeyPress(e, levelOne), onClick: e => this.handleClick(e, levelOne) }), !levelOne.noFlyout ? (h("div", { id: levelOne.id, class: { flyout: true, open: this.isActiveFlyout(levelOne.id) } }, h("div", { class: "wide-container" }, h("div", { class: "flyout-nav" }, h("button", { class: "nav-link flyout-back-button", onClick: () => this.closeFlyout(levelOne.id) }, h(SvgIcon, { name: "pi-pointy-arrow-right", classNames: "mirrored" }), h("span", null, headerConfig.translations.backButtonText)), h("button", { class: "flyout-close-button", onClick: () => this.closeFlyout(levelOne.id) }, h("span", { class: "visually-hidden" }, headerConfig.translations.mobileNavToggleClose), h(SvgIcon, { name: "pi-close" }))), h("h2", { class: "flyout-title container" }, h("a", { href: levelOne.url, class: "nav-link" }, levelOne.text)), h("div", { class: "flyout-row container" }, levelOne.flyout.map(flyout => (h("div", { key: flyout.title, class: "flyout-column" }, flyout.title ? h("h3", null, flyout.title) : null, h("ul", { class: "flyout-linklist" }, flyout.linkList.map(link => (h("li", { key: link.url }, h("a", { class: {
        'flyout-link': true,
        'active': !!(link === null || link === void 0 ? void 0 : link.isActiveOverride),
      }, href: link.url, target: link.target }, link.title)))))))))))) : null)))), h("slot", null))));
  }
  static get is() { return "post-main-navigation"; }
  static get encapsulation() { return "shadow"; }
  static get originalStyleUrls() {
    return {
      "$": ["post-main-navigation.scss"]
    };
  }
  static get styleUrls() {
    return {
      "$": ["post-main-navigation.css"]
    };
  }
  static get states() {
    return {
      "activeFlyout": {},
      "mobileMenuOpen": {}
    };
  }
  static get events() {
    return [{
        "method": "dropdownToggled",
        "name": "dropdownToggled",
        "bubbles": true,
        "cancelable": true,
        "composed": true,
        "docs": {
          "tags": [],
          "text": ""
        },
        "complexType": {
          "original": "DropdownEvent",
          "resolved": "{ open: boolean; element: DropdownElement; }",
          "references": {
            "DropdownEvent": {
              "location": "import",
              "path": "../../models/header.model"
            }
          }
        }
      }, {
        "method": "flyoutToggled",
        "name": "flyoutToggled",
        "bubbles": true,
        "cancelable": true,
        "composed": true,
        "docs": {
          "tags": [],
          "text": ""
        },
        "complexType": {
          "original": "string | null",
          "resolved": "null | string",
          "references": {}
        }
      }];
  }
  static get methods() {
    return {
      "toggleDropdown": {
        "complexType": {
          "signature": "(force?: boolean) => Promise<boolean>",
          "parameters": [{
              "tags": [{
                  "name": "param",
                  "text": "force Force a state"
                }],
              "text": "Force a state"
            }],
          "references": {
            "Promise": {
              "location": "global"
            }
          },
          "return": "Promise<boolean>"
        },
        "docs": {
          "text": "Toggle the main navigation (only visible on mobile)",
          "tags": [{
              "name": "param",
              "text": "force Force a state"
            }, {
              "name": "returns",
              "text": "Boolean indicating new state"
            }]
        }
      },
      "setFocus": {
        "complexType": {
          "signature": "() => Promise<void>",
          "parameters": [],
          "references": {
            "Promise": {
              "location": "global"
            },
            "HTMLElement": {
              "location": "global"
            }
          },
          "return": "Promise<void>"
        },
        "docs": {
          "text": "Focus the main navigation toggle button",
          "tags": []
        }
      },
      "setActiveFlyout": {
        "complexType": {
          "signature": "(id: string | null) => Promise<void>",
          "parameters": [{
              "tags": [{
                  "name": "param",
                  "text": "id Flyout ID"
                }],
              "text": "Flyout ID"
            }],
          "references": {
            "Promise": {
              "location": "global"
            }
          },
          "return": "Promise<void>"
        },
        "docs": {
          "text": "Open a specific flyout",
          "tags": [{
              "name": "param",
              "text": "id Flyout ID"
            }]
        }
      }
    };
  }
  static get elementRef() { return "host"; }
}
//# sourceMappingURL=post-main-navigation.js.map
