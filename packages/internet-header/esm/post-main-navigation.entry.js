import { h, r as registerInstance, c as createEvent, H as Host, g as getElement } from './index-9351b1b6.js';
import { t as throttle } from './index-d2256e06.js';
import { c as clearAllBodyScrollLocks, d as disableBodyScroll, e as enableBodyScroll } from './bodyScrollLock.esm-afcc00e3.js';
import { s as state } from './store-0dceecec.js';
import { u as userPrefersReducedMotion } from './ui.service-1d9b0f51.js';
import { S as SvgSprite } from './svg-sprite.component-ee66c88a.js';
import { S as SvgIcon } from './svg-icon.component-256596ec.js';

const LevelOneAction = (props) => {
  var _a, _b, _c;
  const TagName = props.level.url ? 'a' : 'button';
  return (h(TagName, { class: {
      'main-link': true,
      'active': !!props.level.isActiveOverride,
      'focus': props.isOpen,
    }, href: props.level.url, title: ((_a = props.level.title) === null || _a === void 0 ? void 0 : _a.trim()) && ((_b = props.level.title) === null || _b === void 0 ? void 0 : _b.trim()) !== ((_c = props.level.text) === null || _c === void 0 ? void 0 : _c.trim())
      ? props.level.title
      : undefined, tabindex: props.level.url ? undefined : 0, "aria-haspopup": !props.level.noFlyout + '', "aria-expanded": props.level.noFlyout ? null : props.isOpen + '', onTouchEnd: e => props.onTouchEnd(e), onKeyDown: e => props.onKeyDown(e), onClick: e => props.onClick(e) },
    h("span", null, props.level.text),
    h("svg", { "aria-hidden": "true" },
      h("use", { href: "#pi-pointy-arrow-right" }))));
};

const postMainNavigationCss = ".flyout-nav,.flyout-column h3{font-size:0.9375rem;line-height:1.4}@media (min-width: 600px){.flyout-nav,.flyout-column h3{font-size:1rem}}@media (min-width: 1024px){.flyout-nav,.flyout-column h3{font-size:1.0625rem}}.flyout-title{font-size:1.0625rem;line-height:1.4}@media (min-width: 600px){.flyout-title{font-size:1.25rem}}@media (min-width: 1024px){.flyout-title{font-size:1.5rem;line-height:1.1}}*,:host,*::before,*::after{-webkit-box-sizing:border-box;box-sizing:border-box}button{font:inherit;padding:0}img,svg{max-width:100%;max-height:100%}@media (forced-colors: active){svg{color:white}}.main-container,.flyout-linklist,.no-list{list-style:none;padding-left:0;margin-top:0;margin-bottom:0}.btn-blank{background-color:transparent;border:none;border-radius:0;padding:0}.main-link,.flyout-close-button,.flyout-link,.nav-link{text-decoration:none;color:rgba(0, 0, 0, 0.8);-webkit-transition:color 200ms;transition:color 200ms;background-color:transparent;border-radius:0;-webkit-box-shadow:none;box-shadow:none;border:0;margin:0;display:-ms-flexbox;display:flex;-ms-flex-align:center;align-items:center;gap:0.5rem}.main-link:hover,.flyout-close-button:hover,.flyout-link:hover,.nav-link:hover,.main-link:focus,.flyout-close-button:focus,.flyout-link:focus,.nav-link:focus{color:black}.main-link>svg,.flyout-close-button>svg,.flyout-link>svg,.nav-link>svg{width:1.4em;height:1.4em;-ms-flex-negative:0;flex-shrink:0}.main-link>span,.flyout-close-button>span,.flyout-link>span,.nav-link>span{-ms-flex-negative:1;flex-shrink:1}.box>*:first-child{margin-top:0}.box>*:last-child{margin-bottom:0}.mirrored{-webkit-transform:scaleX(-1);transform:scaleX(-1)}.rotate-270{-webkit-transform:rotate(270deg);transform:rotate(270deg)}.bold{font-weight:700}.light{font-weight:300}.d-flex{display:-ms-flexbox;display:flex}.d-inline-flex{display:-ms-inline-flexbox;display:inline-flex}.align-items-center{-ms-flex-align:center;align-items:center}@media (min-width: 1441px){.wide-container{margin:0 auto;max-width:1440px}}@media (max-width: 599.98px){.container{padding-right:16px;padding-left:16px}}@media (min-width: 600px) and (max-width: 1023.98px){.container{padding-right:32px;padding-left:32px}}@media (min-width: 1024px){.container{padding-right:40px;padding-left:40px}}.visually-hidden{position:absolute;width:1px;height:1px;border:0;padding:0;margin:-1px;overflow:hidden;clip:rect(0 0 0 0)}@media (max-width: -0.02px){.hidden-xs{display:none}}@media (max-width: 399.98px){.hidden-sm{display:none}}@media (max-width: 599.98px){.hidden-rg{display:none}}@media (max-width: 779.98px){.hidden-md{display:none}}@media (max-width: 1023.98px){.hidden-lg{display:none}}@media (max-width: 1279.98px){.hidden-xl{display:none}}@media (max-width: 1440.98px){.hidden-xxl{display:none}}:host{--host-window-height:var(--window-height, 100vh);--calculated-header-height:calc(var(--header-height) + 1px);display:block;min-width:0;height:var(--header-height)}:host(.no-animation) *{-webkit-animation:none !important;animation:none !important;-webkit-transition:none !important;transition:none !important}@media (min-width: 1024px){.main-navigation,.main-container,.main-container li,.main-link{height:100%}}.main-navigation{font-size:1.125rem}@media (min-width: 1024px){.main-navigation{font-size:1rem;margin:0 0.75rem}}@media (min-width: 1280px){.main-navigation{font-size:1.125rem}}@media (min-width: 1441px){.main-navigation{font-size:1.25rem}}@media (max-width: 1023.98px){.main-navigation{position:absolute;top:var(--calculated-header-height);left:0;background:white;height:calc(var(--host-window-height) - var(--calculated-header-height));width:100%;margin:0;overflow:hidden scroll;-webkit-overflow-scrolling:touch;-ms-scroll-chaining:none;overscroll-behavior:contain;display:-ms-flexbox;display:flex;-ms-flex-direction:column;flex-direction:column;-ms-flex-pack:justify;justify-content:space-between;z-index:-1;visibility:hidden;-webkit-transform:translateY(-100%);transform:translateY(-100%);-webkit-transition:visibility 0.35s, -webkit-transform 0.35s;transition:visibility 0.35s, -webkit-transform 0.35s;transition:transform 0.35s, visibility 0.35s;transition:transform 0.35s, visibility 0.35s, -webkit-transform 0.35s}}@media (max-width: 1023.98px) and (prefers-reduced-motion: reduce){.main-navigation{-webkit-transition:none;transition:none}}@media (max-width: 1023.98px){.main-navigation.open{-webkit-transform:translateY(0);transform:translateY(0);visibility:visible}}.main-container{display:-ms-flexbox;display:flex;-ms-flex-align:center;align-items:center;-ms-flex-pack:start;justify-content:flex-start}@media (max-width: 1023.98px){.main-container{-ms-flex-direction:column;flex-direction:column;-ms-flex-align:stretch;align-items:stretch;-ms-flex-pack:start;justify-content:flex-start;padding-top:2.5rem;padding-bottom:2.5rem}.main-container>li+li{border-top:1px solid #e6e6e6}}@media (min-width: 1024px){.main-container{padding-right:0;padding-left:0}}.main-container>li{-ms-flex:0 1 auto;flex:0 1 auto;min-width:0}.main-link{display:-ms-flexbox;display:flex;-ms-flex-align:center;align-items:center;padding-right:0.75rem;padding-left:0.75rem;text-align:left;cursor:pointer;width:100%}@media (min-width: 1024px){.main-link svg{display:none}}@media (max-width: 1023.98px){.main-link{display:-ms-flexbox;display:flex;-ms-flex-pack:justify;justify-content:space-between;-ms-flex-align:center;align-items:center;font-weight:300;padding:0.625rem 0;width:100%;text-align:left}.main-link svg{width:1.5rem;height:1.5rem}}.main-link span{overflow:hidden;text-overflow:ellipsis}.main-link,.flyout-link{position:relative;color:black}.main-link::after,.flyout-link::after{content:\"\";position:absolute;bottom:-1px;left:0;width:100%;height:4px;background-color:transparent;opacity:0;-webkit-transform:scaleX(0.8);transform:scaleX(0.8);-webkit-transition:opacity 0.25s cubic-bezier(0.4, 0, 0.2, 1), -webkit-transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);transition:opacity 0.25s cubic-bezier(0.4, 0, 0.2, 1), -webkit-transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);transition:opacity 0.25s cubic-bezier(0.4, 0, 0.2, 1), transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);transition:opacity 0.25s cubic-bezier(0.4, 0, 0.2, 1), transform 0.25s cubic-bezier(0.4, 0, 0.2, 1), -webkit-transform 0.25s cubic-bezier(0.4, 0, 0.2, 1)}@media (prefers-reduced-motion: reduce){.main-link::after,.flyout-link::after{-webkit-transition:none;transition:none}}.main-link:hover::after,.main-link.focus::after,.flyout-link:hover::after,.flyout-link.focus::after{background-color:#cccccc;opacity:1;-webkit-transform:scale(1);transform:scale(1)}.main-link.active,.flyout-link.active{font-weight:700}.main-link.active::after,.flyout-link.active::after{background-color:#fc0;opacity:1;-webkit-transform:scale(1);transform:scale(1)}.flyout{left:0;width:100%;background:white;padding-bottom:3rem;overflow:auto;-ms-scroll-chaining:none;overscroll-behavior:contain;visibility:hidden}@media (min-width: 1024px){.flyout{position:absolute;top:100%;max-height:calc(100vh - var(--header-height) - var(--meta-header-height) - 1px);z-index:-1;-webkit-box-shadow:0 0 1px 0 rgba(0, 0, 0, 0.4);box-shadow:0 0 1px 0 rgba(0, 0, 0, 0.4);-webkit-transform:translateY(-100%);transform:translateY(-100%)}.flyout.open{-webkit-box-shadow:0 0 8px 0 rgba(0, 0, 0, 0.4);box-shadow:0 0 8px 0 rgba(0, 0, 0, 0.4);-webkit-transform:translateY(0);transform:translateY(0)}}@media (max-width: 1023.98px){.flyout{position:fixed;top:0;height:100%;z-index:1;-webkit-transform:translateX(100%);transform:translateX(100%)}.flyout.open{-webkit-transform:translateX(0);transform:translateX(0)}}.flyout.open{visibility:visible}.flyout.animate{-webkit-transition:visibility 0.35s, -webkit-transform 0.35s, -webkit-box-shadow 0.35s;transition:visibility 0.35s, -webkit-transform 0.35s, -webkit-box-shadow 0.35s;transition:transform 0.35s, visibility 0.35s, box-shadow 0.35s;transition:transform 0.35s, visibility 0.35s, box-shadow 0.35s, -webkit-transform 0.35s, -webkit-box-shadow 0.35s}@media (prefers-reduced-motion: reduce){.flyout.animate{-webkit-transition:none;transition:none}}.flyout-nav{display:-ms-flexbox;display:flex;-ms-flex-pack:justify;justify-content:space-between;min-height:3.5rem;-webkit-box-sizing:content-box;box-sizing:content-box}.flyout-row{display:-ms-flexbox;display:flex;gap:1.5rem}@media (max-width: 1023.98px){.flyout-row{display:grid;grid-template-columns:1fr 1fr}}@media (max-width: 599.98px){.flyout-row{grid-template-columns:1fr}}.flyout-column{-ms-flex:1;flex:1;max-width:25%}@media (max-width: 1023.98px){.flyout-column{max-width:none}}.flyout-column h3{margin-top:0}.flyout-back-button{display:-ms-flexbox;display:flex;-ms-flex-align:center;align-items:center;font-size:1rem;font-weight:400;cursor:pointer}@media (max-width: 599.98px){.flyout-back-button{padding-right:16px;padding-left:16px}}@media (min-width: 600px) and (max-width: 1023.98px){.flyout-back-button{padding-right:32px;padding-left:32px}}@media (min-width: 1024px){.flyout-back-button{padding-right:40px;padding-left:40px}}.flyout-back-button svg{width:1.5rem;height:1.5rem}@media (min-width: 1024px){.flyout-back-button{display:none}}.flyout-close-button{display:-ms-flexbox;display:flex;-ms-flex-align:center;align-items:center;margin-left:auto;padding:0 1.5rem;cursor:pointer}.flyout-close-button svg{width:1.5rem;height:1.5rem}@media (max-width: 1023.98px){.flyout-close-button{display:none}}.flyout-linklist li{border-top:1px solid #e6e6e6}.flyout-linklist:first-child>li{border-top-color:transparent}.flyout-link{display:block;padding:0.75rem 0}.flyout-title{margin:2.5rem 0 1.5rem 0}@media (min-width: 1024px){.flyout-title{display:none}}";

const PostMainNavigation = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
    this.dropdownToggled = createEvent(this, "dropdownToggled", 7);
    this.flyoutToggled = createEvent(this, "flyoutToggled", 7);
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
  get host() { return getElement(this); }
};
PostMainNavigation.style = postMainNavigationCss;

export { PostMainNavigation as post_main_navigation };

//# sourceMappingURL=post-main-navigation.entry.js.map