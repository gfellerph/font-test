import { Host, h } from '@stencil/core';
import { throttle } from 'throttle-debounce';
import { disableBodyScroll, enableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock';
import { state } from '../../data/store';
import { getSearchRedirectUrl, equalizeArrays } from '../../services/search/search.service';
import { getCoveoSuggestions } from '../../services/search/coveo.service';
import { getPlacesUrl, highlightPlacesString, queryPlaces, } from '../../services/search/places.service';
import { userPrefersReducedMotion, elementHasTransition } from '../../services/ui.service';
import { HighlightedText } from '../../utils/highlighted.component';
import { SvgSprite } from '../../utils/svg-sprite.component';
import { SvgIcon } from '../../utils/svg-icon.component';
import { getParcelSuggestion } from '../../services/search/parcel.service';
import { If } from '../../utils/if.component';
export class PostSearch {
  constructor() {
    this.searchDropdownOpen = false;
    this.coveoSuggestions = [];
    this.placeSuggestions = [];
    this.parcelSuggestion = null;
  }
  connectedCallback() {
    this.throttledResize = throttle(300, () => this.handleResize());
    window.addEventListener('resize', this.throttledResize, { passive: true });
  }
  disconnectedCallback() {
    window.removeEventListener('resize', this.throttledResize);
    clearAllBodyScrollLocks();
  }
  componentWillUpdate() {
    // Check if search flyout got set to close
    if (this.searchFlyout && !this.searchDropdownOpen) {
      this.searchFlyout.classList.remove('open');
      // Check if element has transition applied and whether user prefers to see animations or not
      if (elementHasTransition(this.searchFlyout, 'transform') && !userPrefersReducedMotion()) {
        // Wait for CSS transition 'transform' to end before continuing
        return new Promise(resolve => {
          if (this.searchFlyout === undefined) {
            return resolve(true);
          }
          this.searchFlyout.addEventListener('transitionend', event => {
            if (event.propertyName === 'transform') {
              resolve(true);
            }
          });
        });
      }
    }
  }
  componentDidUpdate() {
    // Search flyout got set to open
    if (this.searchFlyout && this.searchDropdownOpen) {
      // Force browser to redraw/refresh DOM before adding 'open' class
      this.searchFlyout.getBoundingClientRect();
      this.searchFlyout.classList.add('open');
    }
    // Focus on the searchBox whenever the dropdown is opened
    if (this.searchDropdownOpen && this.searchBox) {
      this.searchBox.focus({ preventScroll: true });
    }
  }
  /**
   * Toggle the dropdown and optionally force an open/closed state
   * @param force Boolean to force open/closed state
   * @returns Boolean indicating open state of the component
   */
  async toggleDropdown(force) {
    this.searchDropdownOpen =
      force === undefined || typeof force !== 'boolean' ? !this.searchDropdownOpen : force;
    this.dropdownToggled.emit({ open: this.searchDropdownOpen, element: this.host });
    if (!this.searchDropdownOpen) {
      // Reset suggestions when dropdown closes
      this.coveoSuggestions = [];
      this.placeSuggestions = [];
      if (this.searchBox)
        this.searchBox.value = '';
      this.setFocus();
    }
    else {
      // Get basic suggestions when dropdown opens
      try {
        this.coveoSuggestions = await getCoveoSuggestions('');
      }
      catch (_a) { }
    }
    this.setBodyScroll();
    return this.searchDropdownOpen;
  }
  /**
   * Sets the focus on the search button
   */
  async setFocus() {
    const shadowRoot = this.host.shadowRoot;
    if (shadowRoot === null) {
      return;
    }
    const toggleButton = shadowRoot.querySelector('.search-button');
    if (toggleButton) {
      toggleButton.focus();
    }
  }
  handleResize() {
    // Only enable/disable body scroll on resize if the search dropdown is open, otherwise this could lead to side effects in other controls
    if (this.searchDropdownOpen) {
      this.setBodyScroll();
    }
  }
  /**
   * Disable or re-enable body scrolling, depending on whether search dropdown is open or closed in mobile view (width < 1024px)
   */
  setBodyScroll() {
    if (this.searchDropdownOpen && window.innerWidth < 1024) {
      disableBodyScroll(this.searchFlyout);
    }
    else {
      enableBodyScroll(this.searchFlyout);
    }
  }
  /**
   * Fetch suggestions from all available sources
   */
  async handleSearchInput() {
    var _a;
    if (this.searchBox === undefined || ((_a = state.localizedConfig) === null || _a === void 0 ? void 0 : _a.header.search) === undefined) {
      return;
    }
    const query = this.searchBox.value.trim();
    const [placeSuggestions, coveoSuggestions, trackAndTraceInfo] = await Promise.all([
      queryPlaces(query),
      getCoveoSuggestions(query),
      getParcelSuggestion(query, state.localizedConfig.header.search),
    ]);
    // Parcel suggestion is more important than any other
    if (trackAndTraceInfo) {
      this.parcelSuggestion = trackAndTraceInfo;
      this.placeSuggestions = [];
      this.coveoSuggestions = [];
    }
    else {
      [this.coveoSuggestions, this.placeSuggestions] = equalizeArrays(coveoSuggestions, placeSuggestions, 8);
    }
    this.deselectSuggestion();
  }
  /**
   * Start search on enter
   * @param event
   */
  handleKeyDown(event) {
    var _a, _b, _c, _d;
    if (this.searchFlyout === undefined) {
      return;
    }
    let selectedSuggestion = this.searchFlyout.querySelector('.suggestions > li > a.selected');
    switch (event.key.toLowerCase()) {
      case 'enter':
        if (selectedSuggestion) {
          const selectedHref = selectedSuggestion.getAttribute('href');
          if (selectedHref !== null) {
            window.location.href = selectedHref;
          }
        }
        else {
          this.startSearch();
        }
        break;
      case 'arrowdown':
      case 'arrowup':
        const suggestions = this.searchFlyout.querySelectorAll('.suggestions > li > a');
        this.deselectSuggestion();
        if (event.key.toLowerCase() === 'arrowdown') {
          if ((_b = (_a = selectedSuggestion === null || selectedSuggestion === void 0 ? void 0 : selectedSuggestion.parentElement) === null || _a === void 0 ? void 0 : _a.nextElementSibling) === null || _b === void 0 ? void 0 : _b.firstElementChild) {
            // Select next suggestion if there's any, otherwise none will be selected
            selectedSuggestion.parentElement.nextElementSibling.firstElementChild.classList.add('selected');
          }
          else {
            // If there are any suggestions, select first suggestion in list
            if (suggestions.length > 0) {
              suggestions[0].classList.add('selected');
            }
          }
        }
        else if (event.key.toLowerCase() === 'arrowup') {
          if ((_d = (_c = selectedSuggestion === null || selectedSuggestion === void 0 ? void 0 : selectedSuggestion.parentElement) === null || _c === void 0 ? void 0 : _c.previousElementSibling) === null || _d === void 0 ? void 0 : _d.firstElementChild) {
            // Select previous suggestion if there's any, otherwise none will be selected
            selectedSuggestion.parentElement.previousElementSibling.firstElementChild.classList.add('selected');
          }
          else {
            // If there are any suggestions, select last suggestion in list
            if (suggestions.length > 0) {
              suggestions[suggestions.length - 1].classList.add('selected');
            }
          }
        }
        // Get the newly selected suggestion
        selectedSuggestion = this.searchFlyout.querySelector('.suggestions > li > a.selected');
        const suggestedText = selectedSuggestion === null || selectedSuggestion === void 0 ? void 0 : selectedSuggestion.dataset.suggestionText;
        // Update search box value with selected suggestion text
        if (suggestedText !== undefined && this.searchBox) {
          this.searchBox.value = suggestedText;
        }
        break;
    }
  }
  /**
   * Set selected suggestion on mouse enter
   * @param event
   */
  handleMouseEnterSuggestion(event) {
    this.deselectSuggestion();
    // Set hovered suggestion element as selected
    event.target.classList.add('selected');
  }
  /**
   * Set selected suggestion on mouse enter
   * @param event
   */
  handleMouseLeaveSuggestions() {
    this.deselectSuggestion();
  }
  /**
   * Deselect any previously selected suggestion
   */
  deselectSuggestion() {
    if (this.searchFlyout === undefined)
      return;
    const selectedSuggestion = this.searchFlyout.querySelector('.suggestions .selected');
    if (selectedSuggestion) {
      selectedSuggestion.classList.remove('selected');
    }
  }
  /**
   * Redirect to the post search page
   */
  async startSearch() {
    var _a;
    if (this.searchBox && ((_a = state.localizedConfig) === null || _a === void 0 ? void 0 : _a.header.search)) {
      const redirectUrl = await getSearchRedirectUrl(this.searchBox.value.trim(), state.localizedConfig.header.search);
      if (!redirectUrl)
        return;
      window.location.href = redirectUrl;
    }
  }
  render() {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p;
    if (((_a = state.localizedConfig) === null || _a === void 0 ? void 0 : _a.header) === undefined) {
      return;
    }
    const { translations, search } = state.localizedConfig.header;
    const showPortalRecommendations = ((_b = this.searchBox) === null || _b === void 0 ? void 0 : _b.value) === '' && ((_c = search.searchRecommendations) === null || _c === void 0 ? void 0 : _c.links.length) > 0;
    return (h(Host, null, h(SvgSprite, null), h("div", { class: "search" }, h("button", { id: "post-internet-header-search-button", class: "search-button", type: "button", "aria-expanded": `${this.searchDropdownOpen}`, onClick: e => this.toggleDropdown(e) }, h("span", { class: "visually-hidden" }, this.searchDropdownOpen
      ? translations.searchToggleExpanded
      : translations.searchToggle), h(SvgIcon, { name: this.searchDropdownOpen ? 'pi-close' : 'pi-search' })), h(If, { condition: this.searchDropdownOpen }, h("div", { class: "flyout", ref: e => (this.searchFlyout = e) }, h("div", { class: "container box" }, h("div", { class: "row" }, h("div", { class: "col-xs-12 col-md-10 col-lg-8" }, h("div", { class: "form-group form-floating" }, h("input", { type: "text", id: "searchBox", class: "form-control form-control-lg", placeholder: translations.flyoutSearchBoxFloatingLabel, autocomplete: "off", ref: el => (this.searchBox = el), onInput: () => this.handleSearchInput(), onKeyDown: e => this.handleKeyDown(e) }), h("label", { htmlFor: "searchBox" }, translations.flyoutSearchBoxFloatingLabel), h("button", { onClick: () => this.startSearch(), class: "nav-link start-search-button" }, h("span", { class: "visually-hidden" }, translations.searchSubmit), h(SvgIcon, { name: "pi-search" }))), showPortalRecommendations && (h("h2", { class: "bold" }, search.searchRecommendations.title)), h("ul", { class: "suggestions no-list", onMouseLeave: () => this.handleMouseLeaveSuggestions() }, showPortalRecommendations &&
      search.searchRecommendations.links.map(recommendation => (h("li", { key: recommendation.href }, h("a", { class: "nav-link search-recommendation", href: new URL(recommendation.href, 'https://post.ch').href, "data-suggestion-text": recommendation.label, onMouseEnter: e => this.handleMouseEnterSuggestion(e) }, h("span", { class: "search-recommendation__icon", innerHTML: recommendation.inlineSvg }), h("span", null, recommendation.label))))), this.parcelSuggestion && this.parcelSuggestion.ok && (h("li", null, h("a", { class: "nav-link parcel-suggestion", href: this.parcelSuggestion.url, "data-suggestion-text": (_d = this.searchBox) === null || _d === void 0 ? void 0 : _d.value, onMouseEnter: e => this.handleMouseEnterSuggestion(e) }, h(SvgIcon, { name: "pi-letter-parcel" }), h("span", { class: "bold" }, (_f = (_e = this.parcelSuggestion) === null || _e === void 0 ? void 0 : _e.sending) === null || _f === void 0 ? void 0 :
      _f.id, ":\u00A0"), h("span", null, (_h = (_g = this.parcelSuggestion) === null || _g === void 0 ? void 0 : _g.sending) === null || _h === void 0 ? void 0 :
      _h.product, ",", ' ', (_k = (_j = this.parcelSuggestion) === null || _j === void 0 ? void 0 : _j.sending) === null || _k === void 0 ? void 0 :
      _k.recipient.zipcode, ' ', (_m = (_l = this.parcelSuggestion) === null || _l === void 0 ? void 0 : _l.sending) === null || _m === void 0 ? void 0 :
      _m.recipient.city, ",", ' ', (_p = (_o = this.parcelSuggestion) === null || _o === void 0 ? void 0 : _o.sending) === null || _p === void 0 ? void 0 :
      _p.state)))), !showPortalRecommendations &&
      this.coveoSuggestions &&
      this.coveoSuggestions.map(suggestion => (h("li", { key: suggestion.objectId }, h("a", { class: "nav-link", href: suggestion.redirectUrl, "data-suggestion-text": suggestion.expression, onMouseEnter: e => this.handleMouseEnterSuggestion(e) }, h(SvgIcon, { name: "pi-search" }), h(HighlightedText, { text: suggestion.highlighted }))))), !showPortalRecommendations &&
      this.placeSuggestions &&
      this.placeSuggestions.map(suggestion => {
        var _a, _b;
        return (h("li", { key: suggestion.id }, h("a", { class: "nav-link", href: getPlacesUrl(suggestion), "data-suggestion-text": suggestion.name, onMouseEnter: e => this.handleMouseEnterSuggestion(e) }, h(SvgIcon, { name: "pi-place" }), h(HighlightedText, { text: highlightPlacesString((_b = (_a = this.searchBox) === null || _a === void 0 ? void 0 : _a.value) === null || _b === void 0 ? void 0 : _b.trim(), suggestion.name) }))));
      }))))))))));
  }
  static get is() { return "post-search"; }
  static get encapsulation() { return "shadow"; }
  static get originalStyleUrls() {
    return {
      "$": ["post-search.scss"]
    };
  }
  static get styleUrls() {
    return {
      "$": ["post-search.css"]
    };
  }
  static get states() {
    return {
      "searchDropdownOpen": {},
      "coveoSuggestions": {},
      "placeSuggestions": {},
      "parcelSuggestion": {}
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
      }];
  }
  static get methods() {
    return {
      "toggleDropdown": {
        "complexType": {
          "signature": "(force?: unknown) => Promise<boolean>",
          "parameters": [{
              "tags": [{
                  "name": "param",
                  "text": "force Boolean to force open/closed state"
                }],
              "text": "Boolean to force open/closed state"
            }],
          "references": {
            "Promise": {
              "location": "global"
            }
          },
          "return": "Promise<boolean>"
        },
        "docs": {
          "text": "Toggle the dropdown and optionally force an open/closed state",
          "tags": [{
              "name": "param",
              "text": "force Boolean to force open/closed state"
            }, {
              "name": "returns",
              "text": "Boolean indicating open state of the component"
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
          "text": "Sets the focus on the search button",
          "tags": []
        }
      }
    };
  }
  static get elementRef() { return "host"; }
}
//# sourceMappingURL=post-search.js.map
