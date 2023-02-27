'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const index = require('./index-aff25ac1.js');
const index$1 = require('./index-3216e4c8.js');
const bodyScrollLock_esm = require('./bodyScrollLock.esm-59f17217.js');
const svgIcon_component = require('./svg-icon.component-359b7caa.js');
const store = require('./store-92939be1.js');
const _commonjsHelpers = require('./_commonjsHelpers-537d719a.js');
const svgSprite_component = require('./svg-sprite.component-34d2b125.js');
const language_service = require('./language.service-df3821ea.js');
const utils = require('./utils-b6014257.js');

/*!
* tabbable 6.1.1
* @license MIT, https://github.com/focus-trap/tabbable/blob/master/LICENSE
*/
// NOTE: separate `:not()` selectors has broader browser support than the newer
//  `:not([inert], [inert] *)` (Feb 2023)
// CAREFUL: JSDom does not support `:not([inert] *)` as a selector; using it causes
//  the entire query to fail, resulting in no nodes found, which will break a lot
//  of things... so we have to rely on JS to identify nodes inside an inert container
var candidateSelectors = ['input:not([inert])', 'select:not([inert])', 'textarea:not([inert])', 'a[href]:not([inert])', 'button:not([inert])', '[tabindex]:not(slot):not([inert])', 'audio[controls]:not([inert])', 'video[controls]:not([inert])', '[contenteditable]:not([contenteditable="false"]):not([inert])', 'details>summary:first-of-type:not([inert])', 'details:not([inert])'];
var candidateSelector = /* #__PURE__ */candidateSelectors.join(',');
var NoElement = typeof Element === 'undefined';
var matches = NoElement ? function () {} : Element.prototype.matches || Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;
var getRootNode = !NoElement && Element.prototype.getRootNode ? function (element) {
  var _element$getRootNode;
  return element === null || element === void 0 ? void 0 : (_element$getRootNode = element.getRootNode) === null || _element$getRootNode === void 0 ? void 0 : _element$getRootNode.call(element);
} : function (element) {
  return element === null || element === void 0 ? void 0 : element.ownerDocument;
};

/**
 * Determines if a node is inert or in an inert ancestor.
 * @param {Element} [node]
 * @param {boolean} [lookUp] If true and `node` is not inert, looks up at ancestors to
 *  see if any of them are inert. If false, only `node` itself is considered.
 * @returns {boolean} True if inert itself or by way of being in an inert ancestor.
 *  False if `node` is falsy.
 */
var isInert = function isInert(node, lookUp) {
  var _node$getAttribute;
  if (lookUp === void 0) {
    lookUp = true;
  }
  // CAREFUL: JSDom does not support inert at all, so we can't use the `HTMLElement.inert`
  //  JS API property; we have to check the attribute, which can either be empty or 'true';
  //  if it's `null` (not specified) or 'false', it's an active element
  var inertAtt = node === null || node === void 0 ? void 0 : (_node$getAttribute = node.getAttribute) === null || _node$getAttribute === void 0 ? void 0 : _node$getAttribute.call(node, 'inert');
  var inert = inertAtt === '' || inertAtt === 'true';

  // NOTE: this could also be handled with `node.matches('[inert], :is([inert] *)')`
  //  if it weren't for `matches()` not being a function on shadow roots; the following
  //  code works for any kind of node
  // CAREFUL: JSDom does not appear to support certain selectors like `:not([inert] *)`
  //  so it likely would not support `:is([inert] *)` either...
  var result = inert || lookUp && node && isInert(node.parentNode); // recursive

  return result;
};

/**
 * Determines if a node's content is editable.
 * @param {Element} [node]
 * @returns True if it's content-editable; false if it's not or `node` is falsy.
 */
var isContentEditable = function isContentEditable(node) {
  var _node$getAttribute2;
  // CAREFUL: JSDom does not support the `HTMLElement.isContentEditable` API so we have
  //  to use the attribute directly to check for this, which can either be empty or 'true';
  //  if it's `null` (not specified) or 'false', it's a non-editable element
  var attValue = node === null || node === void 0 ? void 0 : (_node$getAttribute2 = node.getAttribute) === null || _node$getAttribute2 === void 0 ? void 0 : _node$getAttribute2.call(node, 'contenteditable');
  return attValue === '' || attValue === 'true';
};

/**
 * @param {Element} el container to check in
 * @param {boolean} includeContainer add container to check
 * @param {(node: Element) => boolean} filter filter candidates
 * @returns {Element[]}
 */
var getCandidates = function getCandidates(el, includeContainer, filter) {
  // even if `includeContainer=false`, we still have to check it for inertness because
  //  if it's inert, all its children are inert
  if (isInert(el)) {
    return [];
  }
  var candidates = Array.prototype.slice.apply(el.querySelectorAll(candidateSelector));
  if (includeContainer && matches.call(el, candidateSelector)) {
    candidates.unshift(el);
  }
  candidates = candidates.filter(filter);
  return candidates;
};

/**
 * @callback GetShadowRoot
 * @param {Element} element to check for shadow root
 * @returns {ShadowRoot|boolean} ShadowRoot if available or boolean indicating if a shadowRoot is attached but not available.
 */

/**
 * @callback ShadowRootFilter
 * @param {Element} shadowHostNode the element which contains shadow content
 * @returns {boolean} true if a shadow root could potentially contain valid candidates.
 */

/**
 * @typedef {Object} CandidateScope
 * @property {Element} scopeParent contains inner candidates
 * @property {Element[]} candidates list of candidates found in the scope parent
 */

/**
 * @typedef {Object} IterativeOptions
 * @property {GetShadowRoot|boolean} getShadowRoot true if shadow support is enabled; falsy if not;
 *  if a function, implies shadow support is enabled and either returns the shadow root of an element
 *  or a boolean stating if it has an undisclosed shadow root
 * @property {(node: Element) => boolean} filter filter candidates
 * @property {boolean} flatten if true then result will flatten any CandidateScope into the returned list
 * @property {ShadowRootFilter} shadowRootFilter filter shadow roots;
 */

/**
 * @param {Element[]} elements list of element containers to match candidates from
 * @param {boolean} includeContainer add container list to check
 * @param {IterativeOptions} options
 * @returns {Array.<Element|CandidateScope>}
 */
var getCandidatesIteratively = function getCandidatesIteratively(elements, includeContainer, options) {
  var candidates = [];
  var elementsToCheck = Array.from(elements);
  while (elementsToCheck.length) {
    var element = elementsToCheck.shift();
    if (isInert(element, false)) {
      // no need to look up since we're drilling down
      // anything inside this container will also be inert
      continue;
    }
    if (element.tagName === 'SLOT') {
      // add shadow dom slot scope (slot itself cannot be focusable)
      var assigned = element.assignedElements();
      var content = assigned.length ? assigned : element.children;
      var nestedCandidates = getCandidatesIteratively(content, true, options);
      if (options.flatten) {
        candidates.push.apply(candidates, nestedCandidates);
      } else {
        candidates.push({
          scopeParent: element,
          candidates: nestedCandidates
        });
      }
    } else {
      // check candidate element
      var validCandidate = matches.call(element, candidateSelector);
      if (validCandidate && options.filter(element) && (includeContainer || !elements.includes(element))) {
        candidates.push(element);
      }

      // iterate over shadow content if possible
      var shadowRoot = element.shadowRoot ||
      // check for an undisclosed shadow
      typeof options.getShadowRoot === 'function' && options.getShadowRoot(element);

      // no inert look up because we're already drilling down and checking for inertness
      //  on the way down, so all containers to this root node should have already been
      //  vetted as non-inert
      var validShadowRoot = !isInert(shadowRoot, false) && (!options.shadowRootFilter || options.shadowRootFilter(element));
      if (shadowRoot && validShadowRoot) {
        // add shadow dom scope IIF a shadow root node was given; otherwise, an undisclosed
        //  shadow exists, so look at light dom children as fallback BUT create a scope for any
        //  child candidates found because they're likely slotted elements (elements that are
        //  children of the web component element (which has the shadow), in the light dom, but
        //  slotted somewhere _inside_ the undisclosed shadow) -- the scope is created below,
        //  _after_ we return from this recursive call
        var _nestedCandidates = getCandidatesIteratively(shadowRoot === true ? element.children : shadowRoot.children, true, options);
        if (options.flatten) {
          candidates.push.apply(candidates, _nestedCandidates);
        } else {
          candidates.push({
            scopeParent: element,
            candidates: _nestedCandidates
          });
        }
      } else {
        // there's not shadow so just dig into the element's (light dom) children
        //  __without__ giving the element special scope treatment
        elementsToCheck.unshift.apply(elementsToCheck, element.children);
      }
    }
  }
  return candidates;
};
var getTabindex = function getTabindex(node, isScope) {
  if (node.tabIndex < 0) {
    // in Chrome, <details/>, <audio controls/> and <video controls/> elements get a default
    // `tabIndex` of -1 when the 'tabindex' attribute isn't specified in the DOM,
    // yet they are still part of the regular tab order; in FF, they get a default
    // `tabIndex` of 0; since Chrome still puts those elements in the regular tab
    // order, consider their tab index to be 0.
    // Also browsers do not return `tabIndex` correctly for contentEditable nodes;
    // so if they don't have a tabindex attribute specifically set, assume it's 0.
    //
    // isScope is positive for custom element with shadow root or slot that by default
    // have tabIndex -1, but need to be sorted by document order in order for their
    // content to be inserted in the correct position
    if ((isScope || /^(AUDIO|VIDEO|DETAILS)$/.test(node.tagName) || isContentEditable(node)) && isNaN(parseInt(node.getAttribute('tabindex'), 10))) {
      return 0;
    }
  }
  return node.tabIndex;
};
var sortOrderedTabbables = function sortOrderedTabbables(a, b) {
  return a.tabIndex === b.tabIndex ? a.documentOrder - b.documentOrder : a.tabIndex - b.tabIndex;
};
var isInput = function isInput(node) {
  return node.tagName === 'INPUT';
};
var isHiddenInput = function isHiddenInput(node) {
  return isInput(node) && node.type === 'hidden';
};
var isDetailsWithSummary = function isDetailsWithSummary(node) {
  var r = node.tagName === 'DETAILS' && Array.prototype.slice.apply(node.children).some(function (child) {
    return child.tagName === 'SUMMARY';
  });
  return r;
};
var getCheckedRadio = function getCheckedRadio(nodes, form) {
  for (var i = 0; i < nodes.length; i++) {
    if (nodes[i].checked && nodes[i].form === form) {
      return nodes[i];
    }
  }
};
var isTabbableRadio = function isTabbableRadio(node) {
  if (!node.name) {
    return true;
  }
  var radioScope = node.form || getRootNode(node);
  var queryRadios = function queryRadios(name) {
    return radioScope.querySelectorAll('input[type="radio"][name="' + name + '"]');
  };
  var radioSet;
  if (typeof window !== 'undefined' && typeof window.CSS !== 'undefined' && typeof window.CSS.escape === 'function') {
    radioSet = queryRadios(window.CSS.escape(node.name));
  } else {
    try {
      radioSet = queryRadios(node.name);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Looks like you have a radio button with a name attribute containing invalid CSS selector characters and need the CSS.escape polyfill: %s', err.message);
      return false;
    }
  }
  var checked = getCheckedRadio(radioSet, node.form);
  return !checked || checked === node;
};
var isRadio = function isRadio(node) {
  return isInput(node) && node.type === 'radio';
};
var isNonTabbableRadio = function isNonTabbableRadio(node) {
  return isRadio(node) && !isTabbableRadio(node);
};

// determines if a node is ultimately attached to the window's document
var isNodeAttached = function isNodeAttached(node) {
  var _nodeRoot;
  // The root node is the shadow root if the node is in a shadow DOM; some document otherwise
  //  (but NOT _the_ document; see second 'If' comment below for more).
  // If rootNode is shadow root, it'll have a host, which is the element to which the shadow
  //  is attached, and the one we need to check if it's in the document or not (because the
  //  shadow, and all nodes it contains, is never considered in the document since shadows
  //  behave like self-contained DOMs; but if the shadow's HOST, which is part of the document,
  //  is hidden, or is not in the document itself but is detached, it will affect the shadow's
  //  visibility, including all the nodes it contains). The host could be any normal node,
  //  or a custom element (i.e. web component). Either way, that's the one that is considered
  //  part of the document, not the shadow root, nor any of its children (i.e. the node being
  //  tested).
  // To further complicate things, we have to look all the way up until we find a shadow HOST
  //  that is attached (or find none) because the node might be in nested shadows...
  // If rootNode is not a shadow root, it won't have a host, and so rootNode should be the
  //  document (per the docs) and while it's a Document-type object, that document does not
  //  appear to be the same as the node's `ownerDocument` for some reason, so it's safer
  //  to ignore the rootNode at this point, and use `node.ownerDocument`. Otherwise,
  //  using `rootNode.contains(node)` will _always_ be true we'll get false-positives when
  //  node is actually detached.
  // NOTE: If `nodeRootHost` or `node` happens to be the `document` itself (which is possible
  //  if a tabbable/focusable node was quickly added to the DOM, focused, and then removed
  //  from the DOM as in https://github.com/focus-trap/focus-trap-react/issues/905), then
  //  `ownerDocument` will be `null`, hence the optional chaining on it.
  var nodeRoot = node && getRootNode(node);
  var nodeRootHost = (_nodeRoot = nodeRoot) === null || _nodeRoot === void 0 ? void 0 : _nodeRoot.host;

  // in some cases, a detached node will return itself as the root instead of a document or
  //  shadow root object, in which case, we shouldn't try to look further up the host chain
  var attached = false;
  if (nodeRoot && nodeRoot !== node) {
    var _nodeRootHost, _nodeRootHost$ownerDo, _node$ownerDocument;
    attached = !!((_nodeRootHost = nodeRootHost) !== null && _nodeRootHost !== void 0 && (_nodeRootHost$ownerDo = _nodeRootHost.ownerDocument) !== null && _nodeRootHost$ownerDo !== void 0 && _nodeRootHost$ownerDo.contains(nodeRootHost) || node !== null && node !== void 0 && (_node$ownerDocument = node.ownerDocument) !== null && _node$ownerDocument !== void 0 && _node$ownerDocument.contains(node));
    while (!attached && nodeRootHost) {
      var _nodeRoot2, _nodeRootHost2, _nodeRootHost2$ownerD;
      // since it's not attached and we have a root host, the node MUST be in a nested shadow DOM,
      //  which means we need to get the host's host and check if that parent host is contained
      //  in (i.e. attached to) the document
      nodeRoot = getRootNode(nodeRootHost);
      nodeRootHost = (_nodeRoot2 = nodeRoot) === null || _nodeRoot2 === void 0 ? void 0 : _nodeRoot2.host;
      attached = !!((_nodeRootHost2 = nodeRootHost) !== null && _nodeRootHost2 !== void 0 && (_nodeRootHost2$ownerD = _nodeRootHost2.ownerDocument) !== null && _nodeRootHost2$ownerD !== void 0 && _nodeRootHost2$ownerD.contains(nodeRootHost));
    }
  }
  return attached;
};
var isZeroArea = function isZeroArea(node) {
  var _node$getBoundingClie = node.getBoundingClientRect(),
    width = _node$getBoundingClie.width,
    height = _node$getBoundingClie.height;
  return width === 0 && height === 0;
};
var isHidden = function isHidden(node, _ref) {
  var displayCheck = _ref.displayCheck,
    getShadowRoot = _ref.getShadowRoot;
  // NOTE: visibility will be `undefined` if node is detached from the document
  //  (see notes about this further down), which means we will consider it visible
  //  (this is legacy behavior from a very long way back)
  // NOTE: we check this regardless of `displayCheck="none"` because this is a
  //  _visibility_ check, not a _display_ check
  if (getComputedStyle(node).visibility === 'hidden') {
    return true;
  }
  var isDirectSummary = matches.call(node, 'details>summary:first-of-type');
  var nodeUnderDetails = isDirectSummary ? node.parentElement : node;
  if (matches.call(nodeUnderDetails, 'details:not([open]) *')) {
    return true;
  }
  if (!displayCheck || displayCheck === 'full' || displayCheck === 'legacy-full') {
    if (typeof getShadowRoot === 'function') {
      // figure out if we should consider the node to be in an undisclosed shadow and use the
      //  'non-zero-area' fallback
      var originalNode = node;
      while (node) {
        var parentElement = node.parentElement;
        var rootNode = getRootNode(node);
        if (parentElement && !parentElement.shadowRoot && getShadowRoot(parentElement) === true // check if there's an undisclosed shadow
        ) {
          // node has an undisclosed shadow which means we can only treat it as a black box, so we
          //  fall back to a non-zero-area test
          return isZeroArea(node);
        } else if (node.assignedSlot) {
          // iterate up slot
          node = node.assignedSlot;
        } else if (!parentElement && rootNode !== node.ownerDocument) {
          // cross shadow boundary
          node = rootNode.host;
        } else {
          // iterate up normal dom
          node = parentElement;
        }
      }
      node = originalNode;
    }
    // else, `getShadowRoot` might be true, but all that does is enable shadow DOM support
    //  (i.e. it does not also presume that all nodes might have undisclosed shadows); or
    //  it might be a falsy value, which means shadow DOM support is disabled

    // Since we didn't find it sitting in an undisclosed shadow (or shadows are disabled)
    //  now we can just test to see if it would normally be visible or not, provided it's
    //  attached to the main document.
    // NOTE: We must consider case where node is inside a shadow DOM and given directly to
    //  `isTabbable()` or `isFocusable()` -- regardless of `getShadowRoot` option setting.

    if (isNodeAttached(node)) {
      // this works wherever the node is: if there's at least one client rect, it's
      //  somehow displayed; it also covers the CSS 'display: contents' case where the
      //  node itself is hidden in place of its contents; and there's no need to search
      //  up the hierarchy either
      return !node.getClientRects().length;
    }

    // Else, the node isn't attached to the document, which means the `getClientRects()`
    //  API will __always__ return zero rects (this can happen, for example, if React
    //  is used to render nodes onto a detached tree, as confirmed in this thread:
    //  https://github.com/facebook/react/issues/9117#issuecomment-284228870)
    //
    // It also means that even window.getComputedStyle(node).display will return `undefined`
    //  because styles are only computed for nodes that are in the document.
    //
    // NOTE: THIS HAS BEEN THE CASE FOR YEARS. It is not new, nor is it caused by tabbable
    //  somehow. Though it was never stated officially, anyone who has ever used tabbable
    //  APIs on nodes in detached containers has actually implicitly used tabbable in what
    //  was later (as of v5.2.0 on Apr 9, 2021) called `displayCheck="none"` mode -- essentially
    //  considering __everything__ to be visible because of the innability to determine styles.
    //
    // v6.0.0: As of this major release, the default 'full' option __no longer treats detached
    //  nodes as visible with the 'none' fallback.__
    if (displayCheck !== 'legacy-full') {
      return true; // hidden
    }
    // else, fallback to 'none' mode and consider the node visible
  } else if (displayCheck === 'non-zero-area') {
    // NOTE: Even though this tests that the node's client rect is non-zero to determine
    //  whether it's displayed, and that a detached node will __always__ have a zero-area
    //  client rect, we don't special-case for whether the node is attached or not. In
    //  this mode, we do want to consider nodes that have a zero area to be hidden at all
    //  times, and that includes attached or not.
    return isZeroArea(node);
  }

  // visible, as far as we can tell, or per current `displayCheck=none` mode, we assume
  //  it's visible
  return false;
};

// form fields (nested) inside a disabled fieldset are not focusable/tabbable
//  unless they are in the _first_ <legend> element of the top-most disabled
//  fieldset
var isDisabledFromFieldset = function isDisabledFromFieldset(node) {
  if (/^(INPUT|BUTTON|SELECT|TEXTAREA)$/.test(node.tagName)) {
    var parentNode = node.parentElement;
    // check if `node` is contained in a disabled <fieldset>
    while (parentNode) {
      if (parentNode.tagName === 'FIELDSET' && parentNode.disabled) {
        // look for the first <legend> among the children of the disabled <fieldset>
        for (var i = 0; i < parentNode.children.length; i++) {
          var child = parentNode.children.item(i);
          // when the first <legend> (in document order) is found
          if (child.tagName === 'LEGEND') {
            // if its parent <fieldset> is not nested in another disabled <fieldset>,
            // return whether `node` is a descendant of its first <legend>
            return matches.call(parentNode, 'fieldset[disabled] *') ? true : !child.contains(node);
          }
        }
        // the disabled <fieldset> containing `node` has no <legend>
        return true;
      }
      parentNode = parentNode.parentElement;
    }
  }

  // else, node's tabbable/focusable state should not be affected by a fieldset's
  //  enabled/disabled state
  return false;
};
var isNodeMatchingSelectorFocusable = function isNodeMatchingSelectorFocusable(options, node) {
  if (node.disabled ||
  // we must do an inert look up to filter out any elements inside an inert ancestor
  //  because we're limited in the type of selectors we can use in JSDom (see related
  //  note related to `candidateSelectors`)
  isInert(node) || isHiddenInput(node) || isHidden(node, options) ||
  // For a details element with a summary, the summary element gets the focus
  isDetailsWithSummary(node) || isDisabledFromFieldset(node)) {
    return false;
  }
  return true;
};
var isNodeMatchingSelectorTabbable = function isNodeMatchingSelectorTabbable(options, node) {
  if (isNonTabbableRadio(node) || getTabindex(node) < 0 || !isNodeMatchingSelectorFocusable(options, node)) {
    return false;
  }
  return true;
};
var isValidShadowRootTabbable = function isValidShadowRootTabbable(shadowHostNode) {
  var tabIndex = parseInt(shadowHostNode.getAttribute('tabindex'), 10);
  if (isNaN(tabIndex) || tabIndex >= 0) {
    return true;
  }
  // If a custom element has an explicit negative tabindex,
  // browsers will not allow tab targeting said element's children.
  return false;
};

/**
 * @param {Array.<Element|CandidateScope>} candidates
 * @returns Element[]
 */
var sortByOrder = function sortByOrder(candidates) {
  var regularTabbables = [];
  var orderedTabbables = [];
  candidates.forEach(function (item, i) {
    var isScope = !!item.scopeParent;
    var element = isScope ? item.scopeParent : item;
    var candidateTabindex = getTabindex(element, isScope);
    var elements = isScope ? sortByOrder(item.candidates) : element;
    if (candidateTabindex === 0) {
      isScope ? regularTabbables.push.apply(regularTabbables, elements) : regularTabbables.push(element);
    } else {
      orderedTabbables.push({
        documentOrder: i,
        tabIndex: candidateTabindex,
        item: item,
        isScope: isScope,
        content: elements
      });
    }
  });
  return orderedTabbables.sort(sortOrderedTabbables).reduce(function (acc, sortable) {
    sortable.isScope ? acc.push.apply(acc, sortable.content) : acc.push(sortable.content);
    return acc;
  }, []).concat(regularTabbables);
};
var tabbable = function tabbable(el, options) {
  options = options || {};
  var candidates;
  if (options.getShadowRoot) {
    candidates = getCandidatesIteratively([el], options.includeContainer, {
      filter: isNodeMatchingSelectorTabbable.bind(null, options),
      flatten: false,
      getShadowRoot: options.getShadowRoot,
      shadowRootFilter: isValidShadowRootTabbable
    });
  } else {
    candidates = getCandidates(el, options.includeContainer, isNodeMatchingSelectorTabbable.bind(null, options));
  }
  return sortByOrder(candidates);
};

let key = 0;
/**
 * Trap the focus inside a specific container by prepending/appending two focus trap
 * input boxes who return the focus into the container.
 *
 * @param props active: activate or deactivate the focus trap
 * @param children Child nodes
 * @returns
 */
const FocusTrap = (props, children) => {
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
    index.h("input", { type: "text", "aria-hidden": "true", class: "visually-hidden", key: `focus-trap-before-${key}`, onFocusin: e => active && handleFocusIn(e, 'last') }),
    children,
    index.h("input", { type: "text", "aria-hidden": "true", class: "visually-hidden", key: `focus-trap-after-${key}`, onFocusin: e => active && handleFocusIn(e, 'first') }),
  ];
};

/**
 * Overlay implementation with focus trap according to
 * https://www.accessibility-developer-guide.com/examples/widgets/dialog/#modal-dialog
 *
 * @param props
 * @returns
 */
const OverlayComponent = (props) => (index.h("div", { class: "overlay", onClick: () => props.onClick(), onKeyDown: e => props.onKeyDown !== undefined && props.onKeyDown(e), ref: e => e !== undefined && props.overlayRef(e) },
  index.h("div", { class: "container", role: "dialog" },
    index.h(FocusTrap, null,
      index.h("div", { class: "overlay-container", tabindex: "-1" /* For initial focus */, role: "document", onClick: e => e.stopPropagation() },
        index.h("button", { class: `overlay-close btn-blank d-inline-flex align-items-center nav-link ${props.overlay.id}`, onClick: () => props.onClick() },
          index.h("span", { class: "visually-hidden" }, props.closeButtonText),
          index.h(svgIcon_component.SvgIcon, { name: "pi-close" })),
        index.h("iframe", { src: props.overlay.target, frameborder: "0", class: "frame", ref: e => e !== undefined && props.iFrameRef(e) }))),
    index.h("div", { class: "loader-wrapper" },
      index.h("div", { class: "loader" })))));

var iframeResizer$2 = _commonjsHelpers.createCommonjsModule(function (module) {
(function (undefined$1) {
  if (typeof window === 'undefined') return // don't run for server side render

  var count = 0,
    logEnabled = false,
    hiddenCheckEnabled = false,
    msgHeader = 'message',
    msgHeaderLen = msgHeader.length,
    msgId = '[iFrameSizer]', // Must match iframe msg ID
    msgIdLen = msgId.length,
    pagePosition = null,
    requestAnimationFrame = window.requestAnimationFrame,
    resetRequiredMethods = Object.freeze({
      max: 1,
      scroll: 1,
      bodyScroll: 1,
      documentElementScroll: 1
    }),
    settings = {},
    timer = null,
    defaults = Object.freeze({
      autoResize: true,
      bodyBackground: null,
      bodyMargin: null,
      bodyMarginV1: 8,
      bodyPadding: null,
      checkOrigin: true,
      inPageLinks: false,
      enablePublicMethods: true,
      heightCalculationMethod: 'bodyOffset',
      id: 'iFrameResizer',
      interval: 32,
      log: false,
      maxHeight: Infinity,
      maxWidth: Infinity,
      minHeight: 0,
      minWidth: 0,
      mouseEvents: true,
      resizeFrom: 'parent',
      scrolling: false,
      sizeHeight: true,
      sizeWidth: false,
      warningTimeout: 5000,
      tolerance: 0,
      widthCalculationMethod: 'scroll',
      onClose: function () {
        return true
      },
      onClosed: function () {},
      onInit: function () {},
      onMessage: function () {
        warn('onMessage function not defined');
      },
      onMouseEnter: function () {},
      onMouseLeave: function () {},
      onResized: function () {},
      onScroll: function () {
        return true
      }
    });

  function getMutationObserver() {
    return (
      window.MutationObserver ||
      window.WebKitMutationObserver ||
      window.MozMutationObserver
    )
  }

  function addEventListener(el, evt, func) {
    el.addEventListener(evt, func, false);
  }

  function removeEventListener(el, evt, func) {
    el.removeEventListener(evt, func, false);
  }

  function setupRequestAnimationFrame() {
    var vendors = ['moz', 'webkit', 'o', 'ms'];
    var x;

    // Remove vendor prefixing if prefixed and break early if not
    for (x = 0; x < vendors.length && !requestAnimationFrame; x += 1) {
      requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
    }

    if (requestAnimationFrame) {
      // Firefox extension content-scripts have a globalThis object that is not the same as window.
      // Binding `requestAnimationFrame` to window allows the function to work and prevents errors
      // being thrown when run in that context, and should be a no-op in every other context.
      requestAnimationFrame = requestAnimationFrame.bind(window);
    } else {
      log('setup', 'RequestAnimationFrame not supported');
    }
  }

  function getMyID(iframeId) {
    var retStr = 'Host page: ' + iframeId;

    if (window.top !== window.self) {
      retStr =
        window.parentIFrame && window.parentIFrame.getId
          ? window.parentIFrame.getId() + ': ' + iframeId
          : 'Nested host page: ' + iframeId;
    }

    return retStr
  }

  function formatLogHeader(iframeId) {
    return msgId + '[' + getMyID(iframeId) + ']'
  }

  function isLogEnabled(iframeId) {
    return settings[iframeId] ? settings[iframeId].log : logEnabled
  }

  function log(iframeId, msg) {
    output('log', iframeId, msg, isLogEnabled(iframeId));
  }

  function info(iframeId, msg) {
    output('info', iframeId, msg, isLogEnabled(iframeId));
  }

  function warn(iframeId, msg) {
    output('warn', iframeId, msg, true);
  }

  function output(type, iframeId, msg, enabled) {
    if (true === enabled && 'object' === typeof window.console) {
      // eslint-disable-next-line no-console
      console[type](formatLogHeader(iframeId), msg);
    }
  }

  function iFrameListener(event) {
    function resizeIFrame() {
      function resize() {
        setSize(messageData);
        setPagePosition(iframeId);
        on('onResized', messageData);
      }

      ensureInRange('Height');
      ensureInRange('Width');

      syncResize(resize, messageData, 'init');
    }

    function processMsg() {
      var data = msg.slice(msgIdLen).split(':');
      var height = data[1] ? parseInt(data[1], 10) : 0;
      var iframe = settings[data[0]] && settings[data[0]].iframe;
      var compStyle = getComputedStyle(iframe);

      return {
        iframe: iframe,
        id: data[0],
        height: height + getPaddingEnds(compStyle) + getBorderEnds(compStyle),
        width: data[2],
        type: data[3]
      }
    }

    function getPaddingEnds(compStyle) {
      if (compStyle.boxSizing !== 'border-box') {
        return 0
      }
      var top = compStyle.paddingTop ? parseInt(compStyle.paddingTop, 10) : 0;
      var bot = compStyle.paddingBottom
        ? parseInt(compStyle.paddingBottom, 10)
        : 0;
      return top + bot
    }

    function getBorderEnds(compStyle) {
      if (compStyle.boxSizing !== 'border-box') {
        return 0
      }
      var top = compStyle.borderTopWidth
        ? parseInt(compStyle.borderTopWidth, 10)
        : 0;
      var bot = compStyle.borderBottomWidth
        ? parseInt(compStyle.borderBottomWidth, 10)
        : 0;
      return top + bot
    }

    function ensureInRange(Dimension) {
      var max = Number(settings[iframeId]['max' + Dimension]),
        min = Number(settings[iframeId]['min' + Dimension]),
        dimension = Dimension.toLowerCase(),
        size = Number(messageData[dimension]);

      log(iframeId, 'Checking ' + dimension + ' is in range ' + min + '-' + max);

      if (size < min) {
        size = min;
        log(iframeId, 'Set ' + dimension + ' to min value');
      }

      if (size > max) {
        size = max;
        log(iframeId, 'Set ' + dimension + ' to max value');
      }

      messageData[dimension] = '' + size;
    }

    function isMessageFromIFrame() {
      function checkAllowedOrigin() {
        function checkList() {
          var i = 0,
            retCode = false;

          log(
            iframeId,
            'Checking connection is from allowed list of origins: ' +
              checkOrigin
          );

          for (; i < checkOrigin.length; i++) {
            if (checkOrigin[i] === origin) {
              retCode = true;
              break
            }
          }
          return retCode
        }

        function checkSingle() {
          var remoteHost = settings[iframeId] && settings[iframeId].remoteHost;
          log(iframeId, 'Checking connection is from: ' + remoteHost);
          return origin === remoteHost
        }

        return checkOrigin.constructor === Array ? checkList() : checkSingle()
      }

      var origin = event.origin,
        checkOrigin = settings[iframeId] && settings[iframeId].checkOrigin;

      if (checkOrigin && '' + origin !== 'null' && !checkAllowedOrigin()) {
        throw new Error(
          'Unexpected message received from: ' +
            origin +
            ' for ' +
            messageData.iframe.id +
            '. Message was: ' +
            event.data +
            '. This error can be disabled by setting the checkOrigin: false option or by providing of array of trusted domains.'
        )
      }

      return true
    }

    function isMessageForUs() {
      return (
        msgId === ('' + msg).slice(0, msgIdLen) &&
        msg.slice(msgIdLen).split(':')[0] in settings
      ) // ''+Protects against non-string msg
    }

    function isMessageFromMetaParent() {
      // Test if this message is from a parent above us. This is an ugly test, however, updating
      // the message format would break backwards compatibility.
      var retCode = messageData.type in { true: 1, false: 1, undefined: 1 };

      if (retCode) {
        log(iframeId, 'Ignoring init message from meta parent page');
      }

      return retCode
    }

    function getMsgBody(offset) {
      return msg.slice(msg.indexOf(':') + msgHeaderLen + offset)
    }

    function forwardMsgFromIFrame(msgBody) {
      log(
        iframeId,
        'onMessage passed: {iframe: ' +
          messageData.iframe.id +
          ', message: ' +
          msgBody +
          '}'
      );

      on('onMessage', {
        iframe: messageData.iframe,
        message: JSON.parse(msgBody)
      });

      log(iframeId, '--');
    }

    function getPageInfo() {
      var bodyPosition = document.body.getBoundingClientRect(),
        iFramePosition = messageData.iframe.getBoundingClientRect();

      return JSON.stringify({
        iframeHeight: iFramePosition.height,
        iframeWidth: iFramePosition.width,
        clientHeight: Math.max(
          document.documentElement.clientHeight,
          window.innerHeight || 0
        ),
        clientWidth: Math.max(
          document.documentElement.clientWidth,
          window.innerWidth || 0
        ),
        offsetTop: parseInt(iFramePosition.top - bodyPosition.top, 10),
        offsetLeft: parseInt(iFramePosition.left - bodyPosition.left, 10),
        scrollTop: window.pageYOffset,
        scrollLeft: window.pageXOffset,
        documentHeight: document.documentElement.clientHeight,
        documentWidth: document.documentElement.clientWidth,
        windowHeight: window.innerHeight,
        windowWidth: window.innerWidth
      })
    }

    function sendPageInfoToIframe(iframe, iframeId) {
      function debouncedTrigger() {
        trigger('Send Page Info', 'pageInfo:' + getPageInfo(), iframe, iframeId);
      }
      debounceFrameEvents(debouncedTrigger, 32, iframeId);
    }

    function startPageInfoMonitor() {
      function setListener(type, func) {
        function sendPageInfo() {
          if (settings[id]) {
            sendPageInfoToIframe(settings[id].iframe, id);
          } else {
            stop();
          }
        }
['scroll', 'resize'].forEach(function (evt) {
          log(id, type + evt + ' listener for sendPageInfo');
          func(window, evt, sendPageInfo);
        });
      }

      function stop() {
        setListener('Remove ', removeEventListener);
      }

      function start() {
        setListener('Add ', addEventListener);
      }

      var id = iframeId; // Create locally scoped copy of iFrame ID

      start();

      if (settings[id]) {
        settings[id].stopPageInfo = stop;
      }
    }

    function stopPageInfoMonitor() {
      if (settings[iframeId] && settings[iframeId].stopPageInfo) {
        settings[iframeId].stopPageInfo();
        delete settings[iframeId].stopPageInfo;
      }
    }

    function checkIFrameExists() {
      var retBool = true;

      if (null === messageData.iframe) {
        warn(iframeId, 'IFrame (' + messageData.id + ') not found');
        retBool = false;
      }
      return retBool
    }

    function getElementPosition(target) {
      var iFramePosition = target.getBoundingClientRect();

      getPagePosition(iframeId);

      return {
        x: Math.floor(Number(iFramePosition.left) + Number(pagePosition.x)),
        y: Math.floor(Number(iFramePosition.top) + Number(pagePosition.y))
      }
    }

    function scrollRequestFromChild(addOffset) {
      /* istanbul ignore next */ // Not testable in Karma
      function reposition() {
        pagePosition = newPosition;
        scrollTo();
        log(iframeId, '--');
      }

      function calcOffset() {
        return {
          x: Number(messageData.width) + offset.x,
          y: Number(messageData.height) + offset.y
        }
      }

      function scrollParent() {
        if (window.parentIFrame) {
          window.parentIFrame['scrollTo' + (addOffset ? 'Offset' : '')](
            newPosition.x,
            newPosition.y
          );
        } else {
          warn(
            iframeId,
            'Unable to scroll to requested position, window.parentIFrame not found'
          );
        }
      }

      var offset = addOffset
          ? getElementPosition(messageData.iframe)
          : { x: 0, y: 0 },
        newPosition = calcOffset();

      log(
        iframeId,
        'Reposition requested from iFrame (offset x:' +
          offset.x +
          ' y:' +
          offset.y +
          ')'
      );

      if (window.top === window.self) {
        reposition();
      } else {
        scrollParent();
      }
    }

    function scrollTo() {
      if (false === on('onScroll', pagePosition)) {
        unsetPagePosition();
      } else {
        setPagePosition(iframeId);
      }
    }

    function findTarget(location) {
      function jumpToTarget() {
        var jumpPosition = getElementPosition(target);

        log(
          iframeId,
          'Moving to in page link (#' +
            hash +
            ') at x: ' +
            jumpPosition.x +
            ' y: ' +
            jumpPosition.y
        );
        pagePosition = {
          x: jumpPosition.x,
          y: jumpPosition.y
        };

        scrollTo();
        log(iframeId, '--');
      }

      function jumpToParent() {
        if (window.parentIFrame) {
          window.parentIFrame.moveToAnchor(hash);
        } else {
          log(
            iframeId,
            'In page link #' +
              hash +
              ' not found and window.parentIFrame not found'
          );
        }
      }

      var hash = location.split('#')[1] || '',
        hashData = decodeURIComponent(hash),
        target =
          document.getElementById(hashData) ||
          document.getElementsByName(hashData)[0];

      if (target) {
        jumpToTarget();
      } else if (window.top === window.self) {
        log(iframeId, 'In page link #' + hash + ' not found');
      } else {
        jumpToParent();
      }
    }

    function onMouse(event) {
      var mousePos = {};

      if (Number(messageData.width) === 0 && Number(messageData.height) === 0) {
        var data = getMsgBody(9).split(':');
        mousePos = {
          x: data[1],
          y: data[0]
        };
      } else {
        mousePos = {
          x: messageData.width,
          y: messageData.height
        };
      }

      on(event, {
        iframe: messageData.iframe,
        screenX: Number(mousePos.x),
        screenY: Number(mousePos.y),
        type: messageData.type
      });
    }

    function on(funcName, val) {
      return chkEvent(iframeId, funcName, val)
    }

    function actionMsg() {
      if (settings[iframeId] && settings[iframeId].firstRun) firstRun();

      switch (messageData.type) {
        case 'close': {
          closeIFrame(messageData.iframe);
          break
        }

        case 'message': {
          forwardMsgFromIFrame(getMsgBody(6));
          break
        }

        case 'mouseenter': {
          onMouse('onMouseEnter');
          break
        }

        case 'mouseleave': {
          onMouse('onMouseLeave');
          break
        }

        case 'autoResize': {
          settings[iframeId].autoResize = JSON.parse(getMsgBody(9));
          break
        }

        case 'scrollTo': {
          scrollRequestFromChild(false);
          break
        }

        case 'scrollToOffset': {
          scrollRequestFromChild(true);
          break
        }

        case 'pageInfo': {
          sendPageInfoToIframe(
            settings[iframeId] && settings[iframeId].iframe,
            iframeId
          );
          startPageInfoMonitor();
          break
        }

        case 'pageInfoStop': {
          stopPageInfoMonitor();
          break
        }

        case 'inPageLink': {
          findTarget(getMsgBody(9));
          break
        }

        case 'reset': {
          resetIFrame(messageData);
          break
        }

        case 'init': {
          resizeIFrame();
          on('onInit', messageData.iframe);
          break
        }

        default: {
          if (
            Number(messageData.width) === 0 &&
            Number(messageData.height) === 0
          ) {
            warn(
              'Unsupported message received (' +
                messageData.type +
                '), this is likely due to the iframe containing a later ' +
                'version of iframe-resizer than the parent page'
            );
          } else {
            resizeIFrame();
          }
        }
      }
    }

    function hasSettings(iframeId) {
      var retBool = true;

      if (!settings[iframeId]) {
        retBool = false;
        warn(
          messageData.type +
            ' No settings for ' +
            iframeId +
            '. Message was: ' +
            msg
        );
      }

      return retBool
    }

    function iFrameReadyMsgReceived() {
      // eslint-disable-next-line no-restricted-syntax, guard-for-in
      for (var iframeId in settings) {
        trigger(
          'iFrame requested init',
          createOutgoingMsg(iframeId),
          settings[iframeId].iframe,
          iframeId
        );
      }
    }

    function firstRun() {
      if (settings[iframeId]) {
        settings[iframeId].firstRun = false;
      }
    }

    var msg = event.data,
      messageData = {},
      iframeId = null;

    if ('[iFrameResizerChild]Ready' === msg) {
      iFrameReadyMsgReceived();
    } else if (isMessageForUs()) {
      messageData = processMsg();
      iframeId = messageData.id;
      if (settings[iframeId]) {
        settings[iframeId].loaded = true;
      }

      if (!isMessageFromMetaParent() && hasSettings(iframeId)) {
        log(iframeId, 'Received: ' + msg);

        if (checkIFrameExists() && isMessageFromIFrame()) {
          actionMsg();
        }
      }
    } else {
      info(iframeId, 'Ignored: ' + msg);
    }
  }

  function chkEvent(iframeId, funcName, val) {
    var func = null,
      retVal = null;

    if (settings[iframeId]) {
      func = settings[iframeId][funcName];

      if ('function' === typeof func) {
        retVal = func(val);
      } else {
        throw new TypeError(
          funcName + ' on iFrame[' + iframeId + '] is not a function'
        )
      }
    }

    return retVal
  }

  function removeIframeListeners(iframe) {
    var iframeId = iframe.id;
    delete settings[iframeId];
  }

  function closeIFrame(iframe) {
    var iframeId = iframe.id;
    if (chkEvent(iframeId, 'onClose', iframeId) === false) {
      log(iframeId, 'Close iframe cancelled by onClose event');
      return
    }
    log(iframeId, 'Removing iFrame: ' + iframeId);

    try {
      // Catch race condition error with React
      if (iframe.parentNode) {
        iframe.parentNode.removeChild(iframe);
      }
    } catch (error) {
      warn(error);
    }

    chkEvent(iframeId, 'onClosed', iframeId);
    log(iframeId, '--');
    removeIframeListeners(iframe);
  }

  function getPagePosition(iframeId) {
    if (null === pagePosition) {
      pagePosition = {
        x:
          window.pageXOffset === undefined$1
            ? document.documentElement.scrollLeft
            : window.pageXOffset,
        y:
          window.pageYOffset === undefined$1
            ? document.documentElement.scrollTop
            : window.pageYOffset
      };
      log(
        iframeId,
        'Get page position: ' + pagePosition.x + ',' + pagePosition.y
      );
    }
  }

  function setPagePosition(iframeId) {
    if (null !== pagePosition) {
      window.scrollTo(pagePosition.x, pagePosition.y);
      log(
        iframeId,
        'Set page position: ' + pagePosition.x + ',' + pagePosition.y
      );
      unsetPagePosition();
    }
  }

  function unsetPagePosition() {
    pagePosition = null;
  }

  function resetIFrame(messageData) {
    function reset() {
      setSize(messageData);
      trigger('reset', 'reset', messageData.iframe, messageData.id);
    }

    log(
      messageData.id,
      'Size reset requested by ' +
        ('init' === messageData.type ? 'host page' : 'iFrame')
    );
    getPagePosition(messageData.id);
    syncResize(reset, messageData, 'reset');
  }

  function setSize(messageData) {
    function setDimension(dimension) {
      if (!messageData.id) {
        log('undefined', 'messageData id not set');
        return
      }
      messageData.iframe.style[dimension] = messageData[dimension] + 'px';
      log(
        messageData.id,
        'IFrame (' +
          iframeId +
          ') ' +
          dimension +
          ' set to ' +
          messageData[dimension] +
          'px'
      );
    }

    function chkZero(dimension) {
      // FireFox sets dimension of hidden iFrames to zero.
      // So if we detect that set up an event to check for
      // when iFrame becomes visible.

      /* istanbul ignore next */ // Not testable in PhantomJS
      if (!hiddenCheckEnabled && '0' === messageData[dimension]) {
        hiddenCheckEnabled = true;
        log(iframeId, 'Hidden iFrame detected, creating visibility listener');
        fixHiddenIFrames();
      }
    }

    function processDimension(dimension) {
      setDimension(dimension);
      chkZero(dimension);
    }

    var iframeId = messageData.iframe.id;

    if (settings[iframeId]) {
      if (settings[iframeId].sizeHeight) {
        processDimension('height');
      }
      if (settings[iframeId].sizeWidth) {
        processDimension('width');
      }
    }
  }

  function syncResize(func, messageData, doNotSync) {
    /* istanbul ignore if */ // Not testable in PhantomJS
    if (
      doNotSync !== messageData.type &&
      requestAnimationFrame &&
      // including check for jasmine because had trouble getting spy to work in unit test using requestAnimationFrame
      !window.jasmine
    ) {
      log(messageData.id, 'Requesting animation frame');
      requestAnimationFrame(func);
    } else {
      func();
    }
  }

  function trigger(calleeMsg, msg, iframe, id, noResponseWarning) {
    function postMessageToIFrame() {
      var target = settings[id] && settings[id].targetOrigin;
      log(
        id,
        '[' +
          calleeMsg +
          '] Sending msg to iframe[' +
          id +
          '] (' +
          msg +
          ') targetOrigin: ' +
          target
      );
      iframe.contentWindow.postMessage(msgId + msg, target);
    }

    function iFrameNotFound() {
      warn(id, '[' + calleeMsg + '] IFrame(' + id + ') not found');
    }

    function chkAndSend() {
      if (
        iframe &&
        'contentWindow' in iframe &&
        null !== iframe.contentWindow
      ) {
        // Null test for PhantomJS
        postMessageToIFrame();
      } else {
        iFrameNotFound();
      }
    }

    function warnOnNoResponse() {
      function warning() {
        if (settings[id] && !settings[id].loaded && !errorShown) {
          errorShown = true;
          warn(
            id,
            'IFrame has not responded within ' +
              settings[id].warningTimeout / 1000 +
              ' seconds. Check iFrameResizer.contentWindow.js has been loaded in iFrame. This message can be ignored if everything is working, or you can set the warningTimeout option to a higher value or zero to suppress this warning.'
          );
        }
      }

      if (
        !!noResponseWarning &&
        settings[id] &&
        !!settings[id].warningTimeout
      ) {
        settings[id].msgTimeout = setTimeout(
          warning,
          settings[id].warningTimeout
        );
      }
    }

    var errorShown = false;

    id = id || iframe.id;

    if (settings[id]) {
      chkAndSend();
      warnOnNoResponse();
    }
  }

  function createOutgoingMsg(iframeId) {
    return (
      iframeId +
      ':' +
      settings[iframeId].bodyMarginV1 +
      ':' +
      settings[iframeId].sizeWidth +
      ':' +
      settings[iframeId].log +
      ':' +
      settings[iframeId].interval +
      ':' +
      settings[iframeId].enablePublicMethods +
      ':' +
      settings[iframeId].autoResize +
      ':' +
      settings[iframeId].bodyMargin +
      ':' +
      settings[iframeId].heightCalculationMethod +
      ':' +
      settings[iframeId].bodyBackground +
      ':' +
      settings[iframeId].bodyPadding +
      ':' +
      settings[iframeId].tolerance +
      ':' +
      settings[iframeId].inPageLinks +
      ':' +
      settings[iframeId].resizeFrom +
      ':' +
      settings[iframeId].widthCalculationMethod +
      ':' +
      settings[iframeId].mouseEvents
    )
  }

  function isNumber(value) {
    return typeof value === 'number'
  }

  function setupIFrame(iframe, options) {
    function setLimits() {
      function addStyle(style) {
        var styleValue = settings[iframeId][style];
        if (Infinity !== styleValue && 0 !== styleValue) {
          iframe.style[style] = isNumber(styleValue)
            ? styleValue + 'px'
            : styleValue;
          log(iframeId, 'Set ' + style + ' = ' + iframe.style[style]);
        }
      }

      function chkMinMax(dimension) {
        if (
          settings[iframeId]['min' + dimension] >
          settings[iframeId]['max' + dimension]
        ) {
          throw new Error(
            'Value for min' +
              dimension +
              ' can not be greater than max' +
              dimension
          )
        }
      }

      chkMinMax('Height');
      chkMinMax('Width');

      addStyle('maxHeight');
      addStyle('minHeight');
      addStyle('maxWidth');
      addStyle('minWidth');
    }

    function newId() {
      var id = (options && options.id) || defaults.id + count++;
      if (null !== document.getElementById(id)) {
        id += count++;
      }
      return id
    }

    function ensureHasId(iframeId) {
      if (typeof iframeId !== 'string') {
        throw new TypeError('Invaild id for iFrame. Expected String')
      }

      if ('' === iframeId) {
        // eslint-disable-next-line no-multi-assign
        iframe.id = iframeId = newId();
        logEnabled = (options || {}).log;
        log(
          iframeId,
          'Added missing iframe ID: ' + iframeId + ' (' + iframe.src + ')'
        );
      }

      return iframeId
    }

    function setScrolling() {
      log(
        iframeId,
        'IFrame scrolling ' +
          (settings[iframeId] && settings[iframeId].scrolling
            ? 'enabled'
            : 'disabled') +
          ' for ' +
          iframeId
      );
      iframe.style.overflow =
        false === (settings[iframeId] && settings[iframeId].scrolling)
          ? 'hidden'
          : 'auto';
      switch (settings[iframeId] && settings[iframeId].scrolling) {
        case 'omit': {
          break
        }

        case true: {
          iframe.scrolling = 'yes';
          break
        }

        case false: {
          iframe.scrolling = 'no';
          break
        }

        default: {
          iframe.scrolling = settings[iframeId]
            ? settings[iframeId].scrolling
            : 'no';
        }
      }
    }

    // The V1 iFrame script expects an int, where as in V2 expects a CSS
    // string value such as '1px 3em', so if we have an int for V2, set V1=V2
    // and then convert V2 to a string PX value.
    function setupBodyMarginValues() {
      if (
        'number' ===
          typeof (settings[iframeId] && settings[iframeId].bodyMargin) ||
        '0' === (settings[iframeId] && settings[iframeId].bodyMargin)
      ) {
        settings[iframeId].bodyMarginV1 = settings[iframeId].bodyMargin;
        settings[iframeId].bodyMargin =
          '' + settings[iframeId].bodyMargin + 'px';
      }
    }

    function checkReset() {
      // Reduce scope of firstRun to function, because IE8's JS execution
      // context stack is borked and this value gets externally
      // changed midway through running this function!!!
      var firstRun = settings[iframeId] && settings[iframeId].firstRun,
        resetRequertMethod =
          settings[iframeId] &&
          settings[iframeId].heightCalculationMethod in resetRequiredMethods;

      if (!firstRun && resetRequertMethod) {
        resetIFrame({ iframe: iframe, height: 0, width: 0, type: 'init' });
      }
    }

    function setupIFrameObject() {
      if (settings[iframeId]) {
        settings[iframeId].iframe.iFrameResizer = {
          close: closeIFrame.bind(null, settings[iframeId].iframe),

          removeListeners: removeIframeListeners.bind(
            null,
            settings[iframeId].iframe
          ),

          resize: trigger.bind(
            null,
            'Window resize',
            'resize',
            settings[iframeId].iframe
          ),

          moveToAnchor: function (anchor) {
            trigger(
              'Move to anchor',
              'moveToAnchor:' + anchor,
              settings[iframeId].iframe,
              iframeId
            );
          },

          sendMessage: function (message) {
            message = JSON.stringify(message);
            trigger(
              'Send Message',
              'message:' + message,
              settings[iframeId].iframe,
              iframeId
            );
          }
        };
      }
    }

    // We have to call trigger twice, as we can not be sure if all
    // iframes have completed loading when this code runs. The
    // event listener also catches the page changing in the iFrame.
    function init(msg) {
      function iFrameLoaded() {
        trigger('iFrame.onload', msg, iframe, undefined$1, true);
        checkReset();
      }

      function createDestroyObserver(MutationObserver) {
        if (!iframe.parentNode) {
          return
        }

        var destroyObserver = new MutationObserver(function (mutations) {
          mutations.forEach(function (mutation) {
            var removedNodes = Array.prototype.slice.call(mutation.removedNodes); // Transform NodeList into an Array
            removedNodes.forEach(function (removedNode) {
              if (removedNode === iframe) {
                closeIFrame(iframe);
              }
            });
          });
        });
        destroyObserver.observe(iframe.parentNode, {
          childList: true
        });
      }

      var MutationObserver = getMutationObserver();
      if (MutationObserver) {
        createDestroyObserver(MutationObserver);
      }

      addEventListener(iframe, 'load', iFrameLoaded);
      trigger('init', msg, iframe, undefined$1, true);
    }

    function checkOptions(options) {
      if ('object' !== typeof options) {
        throw new TypeError('Options is not an object')
      }
    }

    function copyOptions(options) {
      // eslint-disable-next-line no-restricted-syntax
      for (var option in defaults) {
        if (Object.prototype.hasOwnProperty.call(defaults, option)) {
          settings[iframeId][option] = Object.prototype.hasOwnProperty.call(
            options,
            option
          )
            ? options[option]
            : defaults[option];
        }
      }
    }

    function getTargetOrigin(remoteHost) {
      return '' === remoteHost ||
        null !== remoteHost.match(/^(about:blank|javascript:|file:\/\/)/)
        ? '*'
        : remoteHost
    }

    function depricate(key) {
      var splitName = key.split('Callback');

      if (splitName.length === 2) {
        var name =
          'on' + splitName[0].charAt(0).toUpperCase() + splitName[0].slice(1);
        this[name] = this[key];
        delete this[key];
        warn(
          iframeId,
          "Deprecated: '" +
            key +
            "' has been renamed '" +
            name +
            "'. The old method will be removed in the next major version."
        );
      }
    }

    function processOptions(options) {
      options = options || {};

      settings[iframeId] = Object.create(null); // Protect against prototype attacks
      settings[iframeId].iframe = iframe;
      settings[iframeId].firstRun = true;
      settings[iframeId].remoteHost = iframe.src && iframe.src.split('/').slice(0, 3).join('/');

      checkOptions(options);
      Object.keys(options).forEach(depricate, options);
      copyOptions(options);

      if (settings[iframeId]) {
        settings[iframeId].targetOrigin =
          true === settings[iframeId].checkOrigin
            ? getTargetOrigin(settings[iframeId].remoteHost)
            : '*';
      }
    }

    function beenHere() {
      return iframeId in settings && 'iFrameResizer' in iframe
    }

    var iframeId = ensureHasId(iframe.id);

    if (beenHere()) {
      warn(iframeId, 'Ignored iFrame, already setup.');
    } else {
      processOptions(options);
      setScrolling();
      setLimits();
      setupBodyMarginValues();
      init(createOutgoingMsg(iframeId));
      setupIFrameObject();
    }
  }

  function debouce(fn, time) {
    if (null === timer) {
      timer = setTimeout(function () {
        timer = null;
        fn();
      }, time);
    }
  }

  var frameTimer = {};
  function debounceFrameEvents(fn, time, frameId) {
    if (!frameTimer[frameId]) {
      frameTimer[frameId] = setTimeout(function () {
        frameTimer[frameId] = null;
        fn();
      }, time);
    }
  }

  // Not testable in PhantomJS
  /* istanbul ignore next */

  function fixHiddenIFrames() {
    function checkIFrames() {
      function checkIFrame(settingId) {
        function chkDimension(dimension) {
          return (
            '0px' ===
            (settings[settingId] && settings[settingId].iframe.style[dimension])
          )
        }

        function isVisible(el) {
          return null !== el.offsetParent
        }

        if (
          settings[settingId] &&
          isVisible(settings[settingId].iframe) &&
          (chkDimension('height') || chkDimension('width'))
        ) {
          trigger(
            'Visibility change',
            'resize',
            settings[settingId].iframe,
            settingId
          );
        }
      }

      Object.keys(settings).forEach(function (key) {
        checkIFrame(key);
      });
    }

    function mutationObserved(mutations) {
      log(
        'window',
        'Mutation observed: ' + mutations[0].target + ' ' + mutations[0].type
      );
      debouce(checkIFrames, 16);
    }

    function createMutationObserver() {
      var target = document.querySelector('body'),
        config = {
          attributes: true,
          attributeOldValue: false,
          characterData: true,
          characterDataOldValue: false,
          childList: true,
          subtree: true
        },
        observer = new MutationObserver(mutationObserved);

      observer.observe(target, config);
    }

    var MutationObserver = getMutationObserver();
    if (MutationObserver) {
      createMutationObserver();
    }
  }

  function resizeIFrames(event) {
    function resize() {
      sendTriggerMsg('Window ' + event, 'resize');
    }

    log('window', 'Trigger event: ' + event);
    debouce(resize, 16);
  }

  // Not testable in PhantomJS
  /* istanbul ignore next */
  function tabVisible() {
    function resize() {
      sendTriggerMsg('Tab Visible', 'resize');
    }

    if ('hidden' !== document.visibilityState) {
      log('document', 'Trigger event: Visibility change');
      debouce(resize, 16);
    }
  }

  function sendTriggerMsg(eventName, event) {
    function isIFrameResizeEnabled(iframeId) {
      return (
        settings[iframeId] &&
        'parent' === settings[iframeId].resizeFrom &&
        settings[iframeId].autoResize &&
        !settings[iframeId].firstRun
      )
    }

    Object.keys(settings).forEach(function (iframeId) {
      if (isIFrameResizeEnabled(iframeId)) {
        trigger(eventName, event, settings[iframeId].iframe, iframeId);
      }
    });
  }

  function setupEventListeners() {
    addEventListener(window, 'message', iFrameListener);

    addEventListener(window, 'resize', function () {
      resizeIFrames('resize');
    });

    addEventListener(document, 'visibilitychange', tabVisible);

    addEventListener(document, '-webkit-visibilitychange', tabVisible);
  }

  function factory() {
    function init(options, element) {
      function chkType() {
        if (!element.tagName) {
          throw new TypeError('Object is not a valid DOM element')
        } else if ('IFRAME' !== element.tagName.toUpperCase()) {
          throw new TypeError(
            'Expected <IFRAME> tag, found <' + element.tagName + '>'
          )
        }
      }

      if (element) {
        chkType();
        setupIFrame(element, options);
        iFrames.push(element);
      }
    }

    function warnDeprecatedOptions(options) {
      if (options && options.enablePublicMethods) {
        warn(
          'enablePublicMethods option has been removed, public methods are now always available in the iFrame'
        );
      }
    }

    var iFrames;

    setupRequestAnimationFrame();
    setupEventListeners();

    return function iFrameResizeF(options, target) {
      iFrames = []; // Only return iFrames past in on this call

      warnDeprecatedOptions(options);

      switch (typeof target) {
        case 'undefined':
        case 'string': {
          Array.prototype.forEach.call(
            document.querySelectorAll(target || 'iframe'),
            init.bind(undefined$1, options)
          );
          break
        }

        case 'object': {
          init(options, target);
          break
        }

        default: {
          throw new TypeError('Unexpected data type (' + typeof target + ')')
        }
      }

      return iFrames
    }
  }

  function createJQueryPublicMethod($) {
    if (!$.fn) {
      info('', 'Unable to bind to jQuery, it is not fully loaded.');
    } else if (!$.fn.iFrameResize) {
      $.fn.iFrameResize = function $iFrameResizeF(options) {
        function init(index, element) {
          setupIFrame(element, options);
        }

        return this.filter('iframe').each(init).end()
      };
    }
  }

  if (window.jQuery !== undefined$1) {
    createJQueryPublicMethod(window.jQuery);
  }

  if (typeof undefined$1 === 'function' && undefined$1.amd) {
    undefined$1([], factory);
  } else {
    // Node for browserfy
    module.exports = factory();
  }
  window.iFrameResize = window.iFrameResize || factory();
})();
});

var iframeResizer_contentWindow = _commonjsHelpers.createCommonjsModule(function (module) {
 (function (undefined$1) {
  if (typeof window === 'undefined') return // don't run for server side render

  var autoResize = true,
    base = 10,
    bodyBackground = '',
    bodyMargin = 0,
    bodyMarginStr = '',
    bodyObserver = null,
    bodyPadding = '',
    calculateWidth = false,
    doubleEventList = { resize: 1, click: 1 },
    eventCancelTimer = 128,
    firstRun = true,
    height = 1,
    heightCalcModeDefault = 'bodyOffset',
    heightCalcMode = heightCalcModeDefault,
    initLock = true,
    initMsg = '',
    inPageLinks = {},
    interval = 32,
    intervalTimer = null,
    logging = false,
    mouseEvents = false,
    msgID = '[iFrameSizer]', // Must match host page msg ID
    msgIdLen = msgID.length,
    myID = '',
    resetRequiredMethods = {
      max: 1,
      min: 1,
      bodyScroll: 1,
      documentElementScroll: 1
    },
    resizeFrom = 'child',
    target = window.parent,
    targetOriginDefault = '*',
    tolerance = 0,
    triggerLocked = false,
    triggerLockedTimer = null,
    throttledTimer = 16,
    width = 1,
    widthCalcModeDefault = 'scroll',
    widthCalcMode = widthCalcModeDefault,
    win = window,
    onMessage = function () {
      warn('onMessage function not defined');
    },
    onReady = function () { },
    onPageInfo = function () { },
    customCalcMethods = {
      height: function () {
        warn('Custom height calculation function not defined');
        return document.documentElement.offsetHeight
      },
      width: function () {
        warn('Custom width calculation function not defined');
        return document.body.scrollWidth
      }
    },
    eventHandlersByName = {},
    passiveSupported = false;

  function noop() { }

  try {
    var options = Object.create(
      {},
      {
        passive: {
          get: function () { // eslint-disable-line getter-return
            passiveSupported = true;
          }
        }
      }
    );
    window.addEventListener('test', noop, options);
    window.removeEventListener('test', noop, options);
  } catch (error) {
    /* */
  }

  function addEventListener(el, evt, func, options) {
    el.addEventListener(evt, func, passiveSupported ? options || {} : false);
  }

  function removeEventListener(el, evt, func) {
    el.removeEventListener(evt, func, false);
  }

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1)
  }

  // Based on underscore.js
  function throttle(func) {
    var context,
      args,
      result,
      timeout = null,
      previous = 0,
      later = function () {
        previous = Date.now();
        timeout = null;
        result = func.apply(context, args);
        if (!timeout) {
          // eslint-disable-next-line no-multi-assign
          context = args = null;
        }
      };

    return function () {
      var now = Date.now();

      if (!previous) {
        previous = now;
      }

      var remaining = throttledTimer - (now - previous);

      context = this;
      args = arguments;

      if (remaining <= 0 || remaining > throttledTimer) {
        if (timeout) {
          clearTimeout(timeout);
          timeout = null;
        }

        previous = now;
        result = func.apply(context, args);

        if (!timeout) {
          // eslint-disable-next-line no-multi-assign
          context = args = null;
        }
      } else if (!timeout) {
        timeout = setTimeout(later, remaining);
      }

      return result
    }
  }

  function formatLogMsg(msg) {
    return msgID + '[' + myID + '] ' + msg
  }

  function log(msg) {
    if (logging && 'object' === typeof window.console) {
      // eslint-disable-next-line no-console
      console.log(formatLogMsg(msg));
    }
  }

  function warn(msg) {
    if ('object' === typeof window.console) {
      // eslint-disable-next-line no-console
      console.warn(formatLogMsg(msg));
    }
  }

  function init() {
    readDataFromParent();
    log('Initialising iFrame (' + window.location.href + ')');
    readDataFromPage();
    setMargin();
    setBodyStyle('background', bodyBackground);
    setBodyStyle('padding', bodyPadding);
    injectClearFixIntoBodyElement();
    checkHeightMode();
    checkWidthMode();
    stopInfiniteResizingOfIFrame();
    setupPublicMethods();
    setupMouseEvents();
    startEventListeners();
    inPageLinks = setupInPageLinks();
    sendSize('init', 'Init message from host page');
    onReady();
  }

  function readDataFromParent() {
    function strBool(str) {
      return 'true' === str
    }

    var data = initMsg.slice(msgIdLen).split(':');

    myID = data[0];
    bodyMargin = undefined$1 === data[1] ? bodyMargin : Number(data[1]); // For V1 compatibility
    calculateWidth = undefined$1 === data[2] ? calculateWidth : strBool(data[2]);
    logging = undefined$1 === data[3] ? logging : strBool(data[3]);
    interval = undefined$1 === data[4] ? interval : Number(data[4]);
    autoResize = undefined$1 === data[6] ? autoResize : strBool(data[6]);
    bodyMarginStr = data[7];
    heightCalcMode = undefined$1 === data[8] ? heightCalcMode : data[8];
    bodyBackground = data[9];
    bodyPadding = data[10];
    tolerance = undefined$1 === data[11] ? tolerance : Number(data[11]);
    inPageLinks.enable = undefined$1 === data[12] ? false : strBool(data[12]);
    resizeFrom = undefined$1 === data[13] ? resizeFrom : data[13];
    widthCalcMode = undefined$1 === data[14] ? widthCalcMode : data[14];
    mouseEvents = undefined$1 === data[15] ? mouseEvents : strBool(data[15]);
  }

  function depricate(key) {
    var splitName = key.split('Callback');

    if (splitName.length === 2) {
      var name =
        'on' + splitName[0].charAt(0).toUpperCase() + splitName[0].slice(1);
      this[name] = this[key];
      delete this[key];
      warn(
        "Deprecated: '" +
        key +
        "' has been renamed '" +
        name +
        "'. The old method will be removed in the next major version."
      );
    }
  }

  function readDataFromPage() {
    function readData() {
      var data = window.iFrameResizer;

      log('Reading data from page: ' + JSON.stringify(data));
      Object.keys(data).forEach(depricate, data);

      onMessage = 'onMessage' in data ? data.onMessage : onMessage;
      onReady = 'onReady' in data ? data.onReady : onReady;
      targetOriginDefault =
        'targetOrigin' in data ? data.targetOrigin : targetOriginDefault;
      heightCalcMode =
        'heightCalculationMethod' in data
          ? data.heightCalculationMethod
          : heightCalcMode;
      widthCalcMode =
        'widthCalculationMethod' in data
          ? data.widthCalculationMethod
          : widthCalcMode;
    }

    function setupCustomCalcMethods(calcMode, calcFunc) {
      if ('function' === typeof calcMode) {
        log('Setup custom ' + calcFunc + 'CalcMethod');
        customCalcMethods[calcFunc] = calcMode;
        calcMode = 'custom';
      }

      return calcMode
    }

    if (
      'iFrameResizer' in window &&
      Object === window.iFrameResizer.constructor
    ) {
      readData();
      heightCalcMode = setupCustomCalcMethods(heightCalcMode, 'height');
      widthCalcMode = setupCustomCalcMethods(widthCalcMode, 'width');
    }

    log('TargetOrigin for parent set to: ' + targetOriginDefault);
  }

  function chkCSS(attr, value) {
    if (-1 !== value.indexOf('-')) {
      warn('Negative CSS value ignored for ' + attr);
      value = '';
    }
    return value
  }

  function setBodyStyle(attr, value) {
    if (undefined$1 !== value && '' !== value && 'null' !== value) {
      document.body.style[attr] = value;
      log('Body ' + attr + ' set to "' + value + '"');
    }
  }

  function setMargin() {
    // If called via V1 script, convert bodyMargin from int to str
    if (undefined$1 === bodyMarginStr) {
      bodyMarginStr = bodyMargin + 'px';
    }

    setBodyStyle('margin', chkCSS('margin', bodyMarginStr));
  }

  function stopInfiniteResizingOfIFrame() {
    document.documentElement.style.height = '';
    document.body.style.height = '';
    log('HTML & body height set to "auto"');
  }

  function manageTriggerEvent(options) {
    var listener = {
      add: function (eventName) {
        function handleEvent() {
          sendSize(options.eventName, options.eventType);
        }

        eventHandlersByName[eventName] = handleEvent;

        addEventListener(window, eventName, handleEvent, { passive: true });
      },
      remove: function (eventName) {
        var handleEvent = eventHandlersByName[eventName];
        delete eventHandlersByName[eventName];

        removeEventListener(window, eventName, handleEvent);
      }
    };

    if (options.eventNames && Array.prototype.map) {
      options.eventName = options.eventNames[0];
      options.eventNames.map(listener[options.method]);
    } else {
      listener[options.method](options.eventName);
    }

    log(
      capitalizeFirstLetter(options.method) +
      ' event listener: ' +
      options.eventType
    );
  }

  function manageEventListeners(method) {
    manageTriggerEvent({
      method: method,
      eventType: 'Animation Start',
      eventNames: ['animationstart', 'webkitAnimationStart']
    });
    manageTriggerEvent({
      method: method,
      eventType: 'Animation Iteration',
      eventNames: ['animationiteration', 'webkitAnimationIteration']
    });
    manageTriggerEvent({
      method: method,
      eventType: 'Animation End',
      eventNames: ['animationend', 'webkitAnimationEnd']
    });
    manageTriggerEvent({
      method: method,
      eventType: 'Input',
      eventName: 'input'
    });
    manageTriggerEvent({
      method: method,
      eventType: 'Mouse Up',
      eventName: 'mouseup'
    });
    manageTriggerEvent({
      method: method,
      eventType: 'Mouse Down',
      eventName: 'mousedown'
    });
    manageTriggerEvent({
      method: method,
      eventType: 'Orientation Change',
      eventName: 'orientationchange'
    });
    manageTriggerEvent({
      method: method,
      eventType: 'Print',
      eventNames: ['afterprint', 'beforeprint']
    });
    manageTriggerEvent({
      method: method,
      eventType: 'Ready State Change',
      eventName: 'readystatechange'
    });
    manageTriggerEvent({
      method: method,
      eventType: 'Touch Start',
      eventName: 'touchstart'
    });
    manageTriggerEvent({
      method: method,
      eventType: 'Touch End',
      eventName: 'touchend'
    });
    manageTriggerEvent({
      method: method,
      eventType: 'Touch Cancel',
      eventName: 'touchcancel'
    });
    manageTriggerEvent({
      method: method,
      eventType: 'Transition Start',
      eventNames: [
        'transitionstart',
        'webkitTransitionStart',
        'MSTransitionStart',
        'oTransitionStart',
        'otransitionstart'
      ]
    });
    manageTriggerEvent({
      method: method,
      eventType: 'Transition Iteration',
      eventNames: [
        'transitioniteration',
        'webkitTransitionIteration',
        'MSTransitionIteration',
        'oTransitionIteration',
        'otransitioniteration'
      ]
    });
    manageTriggerEvent({
      method: method,
      eventType: 'Transition End',
      eventNames: [
        'transitionend',
        'webkitTransitionEnd',
        'MSTransitionEnd',
        'oTransitionEnd',
        'otransitionend'
      ]
    });
    if ('child' === resizeFrom) {
      manageTriggerEvent({
        method: method,
        eventType: 'IFrame Resized',
        eventName: 'resize'
      });
    }
  }

  function checkCalcMode(calcMode, calcModeDefault, modes, type) {
    if (calcModeDefault !== calcMode) {
      if (!(calcMode in modes)) {
        warn(
          calcMode + ' is not a valid option for ' + type + 'CalculationMethod.'
        );
        calcMode = calcModeDefault;
      }
      log(type + ' calculation method set to "' + calcMode + '"');
    }

    return calcMode
  }

  function checkHeightMode() {
    heightCalcMode = checkCalcMode(
      heightCalcMode,
      heightCalcModeDefault,
      getHeight,
      'height'
    );
  }

  function checkWidthMode() {
    widthCalcMode = checkCalcMode(
      widthCalcMode,
      widthCalcModeDefault,
      getWidth,
      'width'
    );
  }

  function startEventListeners() {
    if (true === autoResize) {
      manageEventListeners('add');
      setupMutationObserver();
    } else {
      log('Auto Resize disabled');
    }
  }

  //   function stopMsgsToParent() {
  //     log('Disable outgoing messages')
  //     sendPermit = false
  //   }

  //   function removeMsgListener() {
  //     log('Remove event listener: Message')
  //     removeEventListener(window, 'message', receiver)
  //   }

  function disconnectMutationObserver() {
    if (null !== bodyObserver) {
      /* istanbul ignore next */ // Not testable in PhantonJS
      bodyObserver.disconnect();
    }
  }

  function stopEventListeners() {
    manageEventListeners('remove');
    disconnectMutationObserver();
    clearInterval(intervalTimer);
  }

  //   function teardown() {
  //     stopMsgsToParent()
  //     removeMsgListener()
  //     if (true === autoResize) stopEventListeners()
  //   }

  function injectClearFixIntoBodyElement() {
    var clearFix = document.createElement('div');
    clearFix.style.clear = 'both';
    // Guard against the following having been globally redefined in CSS.
    clearFix.style.display = 'block';
    clearFix.style.height = '0';
    document.body.appendChild(clearFix);
  }

  function setupInPageLinks() {
    function getPagePosition() {
      return {
        x:
          window.pageXOffset === undefined$1
            ? document.documentElement.scrollLeft
            : window.pageXOffset,
        y:
          window.pageYOffset === undefined$1
            ? document.documentElement.scrollTop
            : window.pageYOffset
      }
    }

    function getElementPosition(el) {
      var elPosition = el.getBoundingClientRect(),
        pagePosition = getPagePosition();

      return {
        x: parseInt(elPosition.left, 10) + parseInt(pagePosition.x, 10),
        y: parseInt(elPosition.top, 10) + parseInt(pagePosition.y, 10)
      }
    }

    function findTarget(location) {
      function jumpToTarget(target) {
        var jumpPosition = getElementPosition(target);

        log(
          'Moving to in page link (#' +
          hash +
          ') at x: ' +
          jumpPosition.x +
          ' y: ' +
          jumpPosition.y
        );
        sendMsg(jumpPosition.y, jumpPosition.x, 'scrollToOffset'); // X&Y reversed at sendMsg uses height/width
      }

      var hash = location.split('#')[1] || location, // Remove # if present
        hashData = decodeURIComponent(hash),
        target =
          document.getElementById(hashData) ||
          document.getElementsByName(hashData)[0];

      if (undefined$1 === target) {
        log(
          'In page link (#' +
          hash +
          ') not found in iFrame, so sending to parent'
        );
        sendMsg(0, 0, 'inPageLink', '#' + hash);
      } else {
        jumpToTarget(target);
      }
    }

    function checkLocationHash() {
      var hash = window.location.hash;
      var href = window.location.href;

      if ('' !== hash && '#' !== hash) {
        findTarget(href);
      }
    }

    function bindAnchors() {
      function setupLink(el) {
        function linkClicked(e) {
          e.preventDefault();

          /* jshint validthis:true */
          findTarget(this.getAttribute('href'));
        }

        if ('#' !== el.getAttribute('href')) {
          addEventListener(el, 'click', linkClicked);
        }
      }

      Array.prototype.forEach.call(
        document.querySelectorAll('a[href^="#"]'),
        setupLink
      );
    }

    function bindLocationHash() {
      addEventListener(window, 'hashchange', checkLocationHash);
    }

    function initCheck() {
      // Check if page loaded with location hash after init resize
      setTimeout(checkLocationHash, eventCancelTimer);
    }

    function enableInPageLinks() {
      /* istanbul ignore else */ // Not testable in phantonJS
      if (Array.prototype.forEach && document.querySelectorAll) {
        log('Setting up location.hash handlers');
        bindAnchors();
        bindLocationHash();
        initCheck();
      } else {
        warn(
          'In page linking not fully supported in this browser! (See README.md for IE8 workaround)'
        );
      }
    }

    if (inPageLinks.enable) {
      enableInPageLinks();
    } else {
      log('In page linking not enabled');
    }

    return {
      findTarget: findTarget
    }
  }

  function setupMouseEvents() {
    if (mouseEvents !== true) return

    function sendMouse(e) {
      sendMsg(0, 0, e.type, e.screenY + ':' + e.screenX);
    }

    function addMouseListener(evt, name) {
      log('Add event listener: ' + name);
      addEventListener(window.document, evt, sendMouse);
    }

    addMouseListener('mouseenter', 'Mouse Enter');
    addMouseListener('mouseleave', 'Mouse Leave');
  }

  function setupPublicMethods() {
    log('Enable public methods');

    win.parentIFrame = {
      autoResize: function autoResizeF(resize) {
        if (true === resize && false === autoResize) {
          autoResize = true;
          startEventListeners();
        } else if (false === resize && true === autoResize) {
          autoResize = false;
          stopEventListeners();
        }
        sendMsg(0, 0, 'autoResize', JSON.stringify(autoResize));
        return autoResize
      },

      close: function closeF() {
        sendMsg(0, 0, 'close');
        // teardown()
      },

      getId: function getIdF() {
        return myID
      },

      getPageInfo: function getPageInfoF(callback) {
        if ('function' === typeof callback) {
          onPageInfo = callback;
          sendMsg(0, 0, 'pageInfo');
        } else {
          onPageInfo = function () { };
          sendMsg(0, 0, 'pageInfoStop');
        }
      },

      moveToAnchor: function moveToAnchorF(hash) {
        inPageLinks.findTarget(hash);
      },

      reset: function resetF() {
        resetIFrame('parentIFrame.reset');
      },

      scrollTo: function scrollToF(x, y) {
        sendMsg(y, x, 'scrollTo'); // X&Y reversed at sendMsg uses height/width
      },

      scrollToOffset: function scrollToF(x, y) {
        sendMsg(y, x, 'scrollToOffset'); // X&Y reversed at sendMsg uses height/width
      },

      sendMessage: function sendMessageF(msg, targetOrigin) {
        sendMsg(0, 0, 'message', JSON.stringify(msg), targetOrigin);
      },

      setHeightCalculationMethod: function setHeightCalculationMethodF(
        heightCalculationMethod
      ) {
        heightCalcMode = heightCalculationMethod;
        checkHeightMode();
      },

      setWidthCalculationMethod: function setWidthCalculationMethodF(
        widthCalculationMethod
      ) {
        widthCalcMode = widthCalculationMethod;
        checkWidthMode();
      },

      setTargetOrigin: function setTargetOriginF(targetOrigin) {
        log('Set targetOrigin: ' + targetOrigin);
        targetOriginDefault = targetOrigin;
      },

      size: function sizeF(customHeight, customWidth) {
        var valString =
          '' + (customHeight || '') + (customWidth ? ',' + customWidth : '');
        sendSize(
          'size',
          'parentIFrame.size(' + valString + ')',
          customHeight,
          customWidth
        );
      }
    };
  }

  function initInterval() {
    if (0 !== interval) {
      log('setInterval: ' + interval + 'ms');
      intervalTimer = setInterval(function () {
        sendSize('interval', 'setInterval: ' + interval);
      }, Math.abs(interval));
    }
  }

  // Not testable in PhantomJS
  /* istanbul ignore next */
  function setupBodyMutationObserver() {
    function addImageLoadListners(mutation) {
      function addImageLoadListener(element) {
        if (false === element.complete) {
          log('Attach listeners to ' + element.src);
          element.addEventListener('load', imageLoaded, false);
          element.addEventListener('error', imageError, false);
          elements.push(element);
        }
      }

      if (mutation.type === 'attributes' && mutation.attributeName === 'src') {
        addImageLoadListener(mutation.target);
      } else if (mutation.type === 'childList') {
        Array.prototype.forEach.call(
          mutation.target.querySelectorAll('img'),
          addImageLoadListener
        );
      }
    }

    function removeFromArray(element) {
      elements.splice(elements.indexOf(element), 1);
    }

    function removeImageLoadListener(element) {
      log('Remove listeners from ' + element.src);
      element.removeEventListener('load', imageLoaded, false);
      element.removeEventListener('error', imageError, false);
      removeFromArray(element);
    }

    function imageEventTriggered(event, type, typeDesc) {
      removeImageLoadListener(event.target);
      sendSize(type, typeDesc + ': ' + event.target.src);
    }

    function imageLoaded(event) {
      imageEventTriggered(event, 'imageLoad', 'Image loaded');
    }

    function imageError(event) {
      imageEventTriggered(event, 'imageLoadFailed', 'Image load failed');
    }

    function mutationObserved(mutations) {
      sendSize(
        'mutationObserver',
        'mutationObserver: ' + mutations[0].target + ' ' + mutations[0].type
      );

      // Deal with WebKit / Blink asyncing image loading when tags are injected into the page
      mutations.forEach(addImageLoadListners);
    }

    function createMutationObserver() {
      var target = document.querySelector('body'),
        config = {
          attributes: true,
          attributeOldValue: false,
          characterData: true,
          characterDataOldValue: false,
          childList: true,
          subtree: true
        };

      observer = new MutationObserver(mutationObserved);

      log('Create body MutationObserver');
      observer.observe(target, config);

      return observer
    }

    var elements = [],
      MutationObserver =
        window.MutationObserver || window.WebKitMutationObserver,
      observer = createMutationObserver();

    return {
      disconnect: function () {
        if ('disconnect' in observer) {
          log('Disconnect body MutationObserver');
          observer.disconnect();
          elements.forEach(removeImageLoadListener);
        }
      }
    }
  }

  function setupMutationObserver() {
    var forceIntervalTimer = 0 > interval;

    // Not testable in PhantomJS
    /* istanbul ignore if */ if (
      window.MutationObserver ||
      window.WebKitMutationObserver
    ) {
      if (forceIntervalTimer) {
        initInterval();
      } else {
        bodyObserver = setupBodyMutationObserver();
      }
    } else {
      log('MutationObserver not supported in this browser!');
      initInterval();
    }
  }

  // document.documentElement.offsetHeight is not reliable, so
  // we have to jump through hoops to get a better value.
  function getComputedStyle(prop, el) {
    var retVal = 0;
    el = el || document.body; // Not testable in phantonJS

    retVal = document.defaultView.getComputedStyle(el, null);
    retVal = null === retVal ? 0 : retVal[prop];

    return parseInt(retVal, base)
  }

  function chkEventThottle(timer) {
    if (timer > throttledTimer / 2) {
      throttledTimer = 2 * timer;
      log('Event throttle increased to ' + throttledTimer + 'ms');
    }
  }

  // Idea from https://github.com/guardian/iframe-messenger
  function getMaxElement(side, elements) {
    var elementsLength = elements.length,
      elVal = 0,
      maxVal = 0,
      Side = capitalizeFirstLetter(side),
      timer = Date.now();

    for (var i = 0; i < elementsLength; i++) {
      elVal =
        elements[i].getBoundingClientRect()[side] +
        getComputedStyle('margin' + Side, elements[i]);
      if (elVal > maxVal) {
        maxVal = elVal;
      }
    }

    timer = Date.now() - timer;

    log('Parsed ' + elementsLength + ' HTML elements');
    log('Element position calculated in ' + timer + 'ms');

    chkEventThottle(timer);

    return maxVal
  }

  function getAllMeasurements(dimensions) {
    return [
      dimensions.bodyOffset(),
      dimensions.bodyScroll(),
      dimensions.documentElementOffset(),
      dimensions.documentElementScroll()
    ]
  }

  function getTaggedElements(side, tag) {
    function noTaggedElementsFound() {
      warn('No tagged elements (' + tag + ') found on page');
      return document.querySelectorAll('body *')
    }

    var elements = document.querySelectorAll('[' + tag + ']');

    if (elements.length === 0) noTaggedElementsFound();

    return getMaxElement(side, elements)
  }

  function getAllElements() {
    return document.querySelectorAll('body *')
  }

  var getHeight = {
    bodyOffset: function getBodyOffsetHeight() {
      return (
        document.body.offsetHeight +
        getComputedStyle('marginTop') +
        getComputedStyle('marginBottom')
      )
    },

    offset: function () {
      return getHeight.bodyOffset() // Backwards compatibility
    },

    bodyScroll: function getBodyScrollHeight() {
      return document.body.scrollHeight
    },

    custom: function getCustomWidth() {
      return customCalcMethods.height()
    },

    documentElementOffset: function getDEOffsetHeight() {
      return document.documentElement.offsetHeight
    },

    documentElementScroll: function getDEScrollHeight() {
      return document.documentElement.scrollHeight
    },

    max: function getMaxHeight() {
      return Math.max.apply(null, getAllMeasurements(getHeight))
    },

    min: function getMinHeight() {
      return Math.min.apply(null, getAllMeasurements(getHeight))
    },

    grow: function growHeight() {
      return getHeight.max() // Run max without the forced downsizing
    },

    lowestElement: function getBestHeight() {
      return Math.max(
        getHeight.bodyOffset() || getHeight.documentElementOffset(),
        getMaxElement('bottom', getAllElements())
      )
    },

    taggedElement: function getTaggedElementsHeight() {
      return getTaggedElements('bottom', 'data-iframe-height')
    }
  },
    getWidth = {
      bodyScroll: function getBodyScrollWidth() {
        return document.body.scrollWidth
      },

      bodyOffset: function getBodyOffsetWidth() {
        return document.body.offsetWidth
      },

      custom: function getCustomWidth() {
        return customCalcMethods.width()
      },

      documentElementScroll: function getDEScrollWidth() {
        return document.documentElement.scrollWidth
      },

      documentElementOffset: function getDEOffsetWidth() {
        return document.documentElement.offsetWidth
      },

      scroll: function getMaxWidth() {
        return Math.max(getWidth.bodyScroll(), getWidth.documentElementScroll())
      },

      max: function getMaxWidth() {
        return Math.max.apply(null, getAllMeasurements(getWidth))
      },

      min: function getMinWidth() {
        return Math.min.apply(null, getAllMeasurements(getWidth))
      },

      rightMostElement: function rightMostElement() {
        return getMaxElement('right', getAllElements())
      },

      taggedElement: function getTaggedElementsWidth() {
        return getTaggedElements('right', 'data-iframe-width')
      }
    };

  function sizeIFrame(
    triggerEvent,
    triggerEventDesc,
    customHeight,
    customWidth
  ) {
    function resizeIFrame() {
      height = currentHeight;
      width = currentWidth;

      sendMsg(height, width, triggerEvent);
    }

    function isSizeChangeDetected() {
      function checkTolarance(a, b) {
        var retVal = Math.abs(a - b) <= tolerance;
        return !retVal
      }

      currentHeight =
        undefined$1 === customHeight ? getHeight[heightCalcMode]() : customHeight;
      currentWidth =
        undefined$1 === customWidth ? getWidth[widthCalcMode]() : customWidth;

      return (
        checkTolarance(height, currentHeight) ||
        (calculateWidth && checkTolarance(width, currentWidth))
      )
    }

    function isForceResizableEvent() {
      return !(triggerEvent in { init: 1, interval: 1, size: 1 })
    }

    function isForceResizableCalcMode() {
      return (
        heightCalcMode in resetRequiredMethods ||
        (calculateWidth && widthCalcMode in resetRequiredMethods)
      )
    }

    function logIgnored() {
      log('No change in size detected');
    }

    function checkDownSizing() {
      if (isForceResizableEvent() && isForceResizableCalcMode()) {
        resetIFrame(triggerEventDesc);
      } else if (!(triggerEvent in { interval: 1 })) {
        logIgnored();
      }
    }

    var currentHeight, currentWidth;

    if (isSizeChangeDetected() || 'init' === triggerEvent) {
      lockTrigger();
      resizeIFrame();
    } else {
      checkDownSizing();
    }
  }

  var sizeIFrameThrottled = throttle(sizeIFrame);

  function sendSize(triggerEvent, triggerEventDesc, customHeight, customWidth) {
    function recordTrigger() {
      if (!(triggerEvent in { reset: 1, resetPage: 1, init: 1 })) {
        log('Trigger event: ' + triggerEventDesc);
      }
    }

    function isDoubleFiredEvent() {
      return triggerLocked && triggerEvent in doubleEventList
    }

    if (isDoubleFiredEvent()) {
      log('Trigger event cancelled: ' + triggerEvent);
    } else {
      recordTrigger();
      if (triggerEvent === 'init') {
        sizeIFrame(triggerEvent, triggerEventDesc, customHeight, customWidth);
      } else {
        sizeIFrameThrottled(
          triggerEvent,
          triggerEventDesc,
          customHeight,
          customWidth
        );
      }
    }
  }

  function lockTrigger() {
    if (!triggerLocked) {
      triggerLocked = true;
      log('Trigger event lock on');
    }
    clearTimeout(triggerLockedTimer);
    triggerLockedTimer = setTimeout(function () {
      triggerLocked = false;
      log('Trigger event lock off');
      log('--');
    }, eventCancelTimer);
  }

  function triggerReset(triggerEvent) {
    height = getHeight[heightCalcMode]();
    width = getWidth[widthCalcMode]();

    sendMsg(height, width, triggerEvent);
  }

  function resetIFrame(triggerEventDesc) {
    var hcm = heightCalcMode;
    heightCalcMode = heightCalcModeDefault;

    log('Reset trigger event: ' + triggerEventDesc);
    lockTrigger();
    triggerReset('reset');

    heightCalcMode = hcm;
  }

  function sendMsg(height, width, triggerEvent, msg, targetOrigin) {
    function setTargetOrigin() {
      if (undefined$1 === targetOrigin) {
        targetOrigin = targetOriginDefault;
      } else {
        log('Message targetOrigin: ' + targetOrigin);
      }
    }

    function sendToParent() {
      var size = height + ':' + width,
        message =
          myID +
          ':' +
          size +
          ':' +
          triggerEvent +
          (undefined$1 === msg ? '' : ':' + msg);

      log('Sending message to host page (' + message + ')');
      target.postMessage(msgID + message, targetOrigin);
    }

    {
      setTargetOrigin();
      sendToParent();
    }
  }

  function receiver(event) {
    var processRequestFromParent = {
      init: function initFromParent() {
        initMsg = event.data;
        target = event.source;

        init();
        firstRun = false;
        setTimeout(function () {
          initLock = false;
        }, eventCancelTimer);
      },

      reset: function resetFromParent() {
        if (initLock) {
          log('Page reset ignored by init');
        } else {
          log('Page size reset by host page');
          triggerReset('resetPage');
        }
      },

      resize: function resizeFromParent() {
        sendSize('resizeParent', 'Parent window requested size check');
      },

      moveToAnchor: function moveToAnchorF() {
        inPageLinks.findTarget(getData());
      },
      inPageLink: function inPageLinkF() {
        this.moveToAnchor();
      }, // Backward compatibility

      pageInfo: function pageInfoFromParent() {
        var msgBody = getData();
        log('PageInfoFromParent called from parent: ' + msgBody);
        onPageInfo(JSON.parse(msgBody));
        log(' --');
      },

      message: function messageFromParent() {
        var msgBody = getData();

        log('onMessage called from parent: ' + msgBody);
        // eslint-disable-next-line sonarjs/no-extra-arguments
        onMessage(JSON.parse(msgBody));
        log(' --');
      }
    };

    function isMessageForUs() {
      return msgID === ('' + event.data).slice(0, msgIdLen) // ''+ Protects against non-string messages
    }

    function getMessageType() {
      return event.data.split(']')[1].split(':')[0]
    }

    function getData() {
      return event.data.slice(event.data.indexOf(':') + 1)
    }

    function isMiddleTier() {
      return (
        (!(module.exports) &&
          'iFrameResize' in window) ||
        (window.jQuery !== undefined$1 && 'iFrameResize' in window.jQuery.prototype)
      )
    }

    function isInitMsg() {
      // Test if this message is from a child below us. This is an ugly test, however, updating
      // the message format would break backwards compatibility.
      return event.data.split(':')[2] in { true: 1, false: 1 }
    }

    function callFromParent() {
      var messageType = getMessageType();

      if (messageType in processRequestFromParent) {
        processRequestFromParent[messageType]();
      } else if (!isMiddleTier() && !isInitMsg()) {
        warn('Unexpected message (' + event.data + ')');
      }
    }

    function processMessage() {
      if (false === firstRun) {
        callFromParent();
      } else if (isInitMsg()) {
        processRequestFromParent.init();
      } else {
        log(
          'Ignored message of type "' +
          getMessageType() +
          '". Received before initialization.'
        );
      }
    }

    if (isMessageForUs()) {
      processMessage();
    }
  }

  // Normally the parent kicks things off when it detects the iFrame has loaded.
  // If this script is async-loaded, then tell parent page to retry init.
  function chkLateLoaded() {
    if ('loading' !== document.readyState) {
      window.parent.postMessage('[iFrameResizerChild]Ready', '*');
    }
  }

  addEventListener(window, 'message', receiver);
  addEventListener(window, 'readystatechange', chkLateLoaded);
  chkLateLoaded();

  
})();
});

var iframeResize_1 = iframeResizer$2;
var iframeResizer$1 = iframeResizer$2; // Backwards compatibility
var iframeResizerContentWindow = iframeResizer_contentWindow;

var js = {
	iframeResize: iframeResize_1,
	iframeResizer: iframeResizer$1,
	iframeResizerContentWindow: iframeResizerContentWindow
};

var iframeResizer = js;

const MiddleLinks = (props) => {
  return props.items.slice(1, -1).map(item => (index.h("li", { key: item.url },
    index.h("a", { href: item.url, class: "nav-link", tabindex: props.focusable === false ? '-1' : undefined },
      index.h("span", null, item.text)),
    props.icons ? index.h(svgIcon_component.SvgIcon, { name: "pi-arrow-down", classNames: "rotate-270" }) : null)));
};

const MiddleDropdown = (props) => {
  return (index.h("div", { class: "middle-dropdown-container" },
    index.h("button", { class: "middle-dropdown-button btn btn-blank", type: "button", onClick: event => props.clickHandler(event), tabindex: props.focusable === false ? '-1' : undefined },
      index.h("span", { class: "visually-hidden" }, language_service.translate('Open menu')),
      index.h("span", { "aria-hidden": "true" }, "...")),
    index.h(svgIcon_component.SvgIcon, { name: "pi-arrow-down", classNames: "rotate-270" }),
    props.dropdownOpen ? (index.h("nav", { class: "middle-dropdown" },
      index.h("ul", { class: "no-list" },
        index.h(MiddleLinks, { items: props.items, icons: false, focusable: props.focusable })))) : null));
};

const BreadcrumbList = (props) => {
  var _a;
  const homeItem = props.items[0];
  const lastItem = props.items[props.items.length - 1];
  return (index.h("ol", { class: "no-list breadcrumbs-list" },
    index.h("li", null,
      index.h("a", { class: "home-link nav-link", href: homeItem.url, tabindex: props.focusable === false ? '-1' : undefined },
        index.h("span", { class: "visually-hidden" }, homeItem.text),
        index.h(svgIcon_component.SvgIcon, { name: "pi-home" })),
      index.h(svgIcon_component.SvgIcon, { name: "pi-arrow-down", classNames: "rotate-270" })),
    props.isConcatenated ? (index.h("li", null,
      index.h(MiddleDropdown, { items: props.items, dropdownOpen: (_a = props.dropdownOpen) !== null && _a !== void 0 ? _a : false, clickHandler: e => props.clickHandler(e), focusable: props.focusable }))) : (index.h(MiddleLinks, { items: props.items, icons: true, focusable: props.focusable })),
    index.h("li", null,
      index.h("a", { class: "last-link nav-link", href: lastItem.url, tabindex: props.focusable === false ? '-1' : undefined, ref: el => (props.lastItemRef !== undefined ? props.lastItemRef(el) : null) }, lastItem.text))));
};

const postInternetBreadcrumbsCss = "/*!\n * Bootstrap Utilities v5.1.3 (https://getbootstrap.com/)\n * Copyright 2011-2021 The Bootstrap Authors\n * Copyright 2011-2021 Twitter, Inc.\n * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)\n\n * The MIT License (MIT)\n\n * Copyright (c) 2011-2020 Twitter, Inc.\n * Copyright (c) 2011-2020 The Bootstrap Authors\n\n * Permission is hereby granted, free of charge, to any person obtaining a copy\n * of this software and associated documentation files (the \"Software\"), to deal\n * in the Software without restriction, including without limitation the rights\n * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell\n * copies of the Software, and to permit persons to whom the Software is\n * furnished to do so, subject to the following conditions:\n\n * The above copyright notice and this permission notice shall be included in\n * all copies or substantial portions of the Software.\n\n * THE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\n * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,\n * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE\n * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER\n * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,\n * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN\n * THE SOFTWARE.\n */.btn-close{-webkit-box-sizing:content-box;box-sizing:content-box;width:1.5rem;height:1.5rem;padding:1rem 1rem;color:#000;background:transparent url(\"data:image/svg+xml,%3Csvg version='1.1' xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32'%3E%3Cpath opacity='1' fill='%23000000' d='M16.267 16.667l6.667-6.533-0.933-1.067-6.667 6.667-6.667-6.667-0.933 1.067 6.667 6.533-6.667 6.667 1.067 0.933 6.533-6.667 6.667 6.667 0.933-1.067z'%3E%3C/path%3E%3C/svg%3E\") center/1.5rem auto no-repeat;border:0;border-radius:3px;opacity:0.5}.btn-close:hover{color:#000;text-decoration:none;opacity:0.75}.btn-close:focus{outline:0;-webkit-box-shadow:0 0 0 0.125rem rgba(51, 51, 51, 0.25);box-shadow:0 0 0 0.125rem rgba(51, 51, 51, 0.25);opacity:1}.btn-close:disabled,.btn-close.disabled{pointer-events:none;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;opacity:0.25}.btn-close-white{-webkit-filter:invert(1) grayscale(100%) brightness(200%);filter:invert(1) grayscale(100%) brightness(200%)}.btn-close{height:unset;min-height:1.5rem}@media (forced-colors: active), (-ms-high-contrast: active), (-ms-high-contrast: white-on-black){.btn-close{opacity:1;background:transparent url(\"data:image/svg+xml,%3Csvg version='1.1' xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32'%3E%3Cpath opacity='1' fill='%23ffffff' d='M16.267 16.667l6.667-6.533-0.933-1.067-6.667 6.667-6.667-6.667-0.933 1.067 6.667 6.533-6.667 6.667 1.067 0.933 6.533-6.667 6.667 6.667 0.933-1.067z'%3E%3C/path%3E%3C/svg%3E\") center/1.5rem auto no-repeat}}.btn-close:focus{outline:2px solid var(--post-contrast-color);-webkit-box-shadow:none;box-shadow:none}.btn-close:focus:not(:focus-visible){outline:0}@media (forced-colors: active), (-ms-high-contrast: active), (-ms-high-contrast: white-on-black){.btn-close-white{-webkit-filter:none;filter:none}}.btn-default,.btn-secondary{border:2px solid rgba(var(--post-contrast-color-rgb), 0.2)}.btn-default:focus,.btn-secondary:focus,.btn-default:not(:disabled):hover,.btn-secondary:not(:disabled):hover,.pretend-hover.btn-default,.pretend-hover.btn-secondary{border-color:var(--post-contrast-color);color:var(--post-contrast-color)}:is(.bg-dark,.bg-primary,.bg-black,.bg-danger,.bg-nightblue,.bg-nightblue-bright,.bg-petrol,.bg-coral,.bg-olive,.bg-purple,.bg-purple-bright,.bg-aubergine,.bg-aubergine-bright) .btn-default,:is(.bg-dark,.bg-primary,.bg-black,.bg-danger,.bg-nightblue,.bg-nightblue-bright,.bg-petrol,.bg-coral,.bg-olive,.bg-purple,.bg-purple-bright,.bg-aubergine,.bg-aubergine-bright) .btn-secondary{border-color:var(--post-contrast-color)}:is(.bg-dark,.bg-primary,.bg-black,.bg-danger,.bg-nightblue,.bg-nightblue-bright,.bg-petrol,.bg-coral,.bg-olive,.bg-purple,.bg-purple-bright,.bg-aubergine,.bg-aubergine-bright) .btn-default:focus,:is(.bg-dark,.bg-primary,.bg-black,.bg-danger,.bg-nightblue,.bg-nightblue-bright,.bg-petrol,.bg-coral,.bg-olive,.bg-purple,.bg-purple-bright,.bg-aubergine,.bg-aubergine-bright) .btn-secondary:focus,:is(.bg-dark,.bg-primary,.bg-black,.bg-danger,.bg-nightblue,.bg-nightblue-bright,.bg-petrol,.bg-coral,.bg-olive,.bg-purple,.bg-purple-bright,.bg-aubergine,.bg-aubergine-bright) .btn-default:not(:disabled):hover,:is(.bg-dark,.bg-primary,.bg-black,.bg-danger,.bg-nightblue,.bg-nightblue-bright,.bg-petrol,.bg-coral,.bg-olive,.bg-purple,.bg-purple-bright,.bg-aubergine,.bg-aubergine-bright) .btn-secondary:not(:disabled):hover,:is(.bg-dark,.bg-primary,.bg-black,.bg-danger,.bg-nightblue,.bg-nightblue-bright,.bg-petrol,.bg-coral,.bg-olive,.bg-purple,.bg-purple-bright,.bg-aubergine,.bg-aubergine-bright) .pretend-hover.btn-default,:is(.bg-dark,.bg-primary,.bg-black,.bg-danger,.bg-nightblue,.bg-nightblue-bright,.bg-petrol,.bg-coral,.bg-olive,.bg-purple,.bg-purple-bright,.bg-aubergine,.bg-aubergine-bright) .pretend-hover.btn-secondary{border-color:rgba(var(--post-contrast-color-rgb), 0.4)}.btn-default:disabled,.btn-secondary:disabled{border-color:rgba(var(--post-contrast-color-rgb), 0.4);color:rgba(var(--post-contrast-color-rgb), 0.6)}.btn{min-height:3rem;padding:0 2rem;font-size:1rem;gap:1rem;outline:none;outline-offset:2px;display:-ms-inline-flexbox;display:inline-flex;position:relative;-ms-flex-align:center;align-items:center;-ms-flex-pack:center;justify-content:center;max-width:100%;overflow:hidden;-webkit-transition:opacity 250ms, border-color 250ms, background-color 250ms, color 250ms;transition:opacity 250ms, border-color 250ms, background-color 250ms, color 250ms;border-width:2px;border-style:solid;border-radius:3px;background-color:transparent;-webkit-box-shadow:none;box-shadow:none;color:var(--post-contrast-color);font-family:inherit;font-weight:400;line-height:inherit;text-decoration:none !important;white-space:nowrap}.btn>.pi{width:1.25rem;height:1.25rem}.btn:is(:focus-visible,:focus-within,.pretend-focus){outline:2px solid var(--post-contrast-color)}.btn-primary{border-color:transparent;background-color:rgba(var(--post-contrast-color-rgb), 0.8);color:var(--post-contrast-color-inverted)}.btn-primary:focus,.btn-primary:not(:disabled):hover,.btn-primary.pretend-hover{background-color:var(--post-contrast-color);color:var(--post-contrast-color-inverted)}:is(.bg-dark,.bg-primary,.bg-black,.bg-danger,.bg-nightblue,.bg-nightblue-bright,.bg-petrol,.bg-coral,.bg-olive,.bg-purple,.bg-purple-bright,.bg-aubergine,.bg-aubergine-bright) .btn-primary{background-color:var(--post-contrast-color)}:is(.bg-dark,.bg-primary,.bg-black,.bg-danger,.bg-nightblue,.bg-nightblue-bright,.bg-petrol,.bg-coral,.bg-olive,.bg-purple,.bg-purple-bright,.bg-aubergine,.bg-aubergine-bright) .btn-primary:focus,:is(.bg-dark,.bg-primary,.bg-black,.bg-danger,.bg-nightblue,.bg-nightblue-bright,.bg-petrol,.bg-coral,.bg-olive,.bg-purple,.bg-purple-bright,.bg-aubergine,.bg-aubergine-bright) .btn-primary:not(:disabled):hover,:is(.bg-dark,.bg-primary,.bg-black,.bg-danger,.bg-nightblue,.bg-nightblue-bright,.bg-petrol,.bg-coral,.bg-olive,.bg-purple,.bg-purple-bright,.bg-aubergine,.bg-aubergine-bright) .btn-primary.pretend-hover{background-color:rgba(var(--post-contrast-color-rgb), 0.8)}:is(.bg-dark,.bg-primary,.bg-black,.bg-danger,.bg-nightblue,.bg-nightblue-bright,.bg-petrol,.bg-coral,.bg-olive,.bg-purple,.bg-purple-bright,.bg-aubergine,.bg-aubergine-bright) .btn-primary .pi{-webkit-filter:invert(0);filter:invert(0)}@media (forced-colors: active), (-ms-high-contrast: active), (-ms-high-contrast: white-on-black){.btn-primary{border-color:var(--post-contrast-color);background-color:ButtonFace}.btn-primary:not(:disabled,.disabled):hover,.btn-primary:not(:disabled,.disabled):focus-visible{border-color:highlight}.btn-primary .pi{-webkit-filter:invert(1) !important;filter:invert(1) !important}}.btn-primary:disabled{background-color:rgba(var(--post-contrast-color-rgb), 0.4)}.btn-primary .pi{-webkit-filter:invert(1);filter:invert(1);forced-color-adjust:none}:is(.bg-dark,.bg-primary,.bg-black,.bg-danger,.bg-nightblue,.bg-nightblue-bright,.bg-petrol,.bg-coral,.bg-olive,.bg-purple,.bg-purple-bright,.bg-aubergine,.bg-aubergine-bright) .btn-default .pi,:is(.bg-dark,.bg-primary,.bg-black,.bg-danger,.bg-nightblue,.bg-nightblue-bright,.bg-petrol,.bg-coral,.bg-olive,.bg-purple,.bg-purple-bright,.bg-aubergine,.bg-aubergine-bright) .btn-secondary .pi{-webkit-filter:invert(1);filter:invert(1)}.btn-link,.btn-tertiary{border:0;padding-right:0.375rem;padding-left:0.375rem}.btn-link:focus,.btn-link:not(:disabled):hover,.btn-link.pretend-hover,.btn-tertiary:focus,.btn-tertiary:not(:disabled):hover,.btn-tertiary.pretend-hover{color:rgba(var(--post-contrast-color-rgb), 0.8)}.btn-link:disabled,.btn-tertiary:disabled{color:rgba(var(--post-contrast-color-rgb), 0.6)}@media (forced-colors: active), (-ms-high-contrast: active), (-ms-high-contrast: white-on-black){.btn-link,.btn-tertiary{color:linktext;text-decoration:underline !important}}.btn-icon{min-width:3rem;padding-right:0.75rem;padding-left:0.75rem}.btn-icon.btn-sm{min-width:2rem;padding-right:0.375rem;padding-left:0.375rem}.btn-icon.btn-rg{min-width:2.5rem;padding-right:0.5625rem;padding-left:0.5625rem}.btn-icon.btn-lg{min-width:3.5rem;padding-right:0.875rem;padding-left:0.875rem}.btn-animated:not(.btn-link,.btn-tertiary)::after{content:\"\";position:absolute;right:1.25rem;width:0.625em;height:0.625em;-webkit-transform:rotateZ(315deg) translate(-2px, -2px);transform:rotateZ(315deg) translate(-2px, -2px);-webkit-transform-origin:center center;transform-origin:center center;-webkit-transition:opacity 250ms, -webkit-transform 250ms;transition:opacity 250ms, -webkit-transform 250ms;transition:opacity 250ms, transform 250ms;transition:opacity 250ms, transform 250ms, -webkit-transform 250ms;border-right:2px solid currentColor;border-bottom:2px solid currentColor;opacity:0}.btn-animated:not(.btn-link,.btn-tertiary).btn-sm::after{right:0.5rem}.btn-animated:not(.btn-link,.btn-tertiary).btn-rg::after{right:0.875rem}.btn-animated:not(.btn-link,.btn-tertiary).btn-lg::after{right:1.5rem}.btn-animated:not(.btn-link,.btn-tertiary)>span{-webkit-transition:-webkit-transform 250ms;transition:-webkit-transform 250ms;transition:transform 250ms;transition:transform 250ms, -webkit-transform 250ms}@media (prefers-reduced-motion: no-preference){.btn-animated:not(.btn-link,.btn-tertiary):focus>span,.btn-animated:not(.btn-link,.btn-tertiary):not(:disabled):hover>span,.btn-animated:not(.btn-link,.btn-tertiary).pretend-hover>span{-webkit-transform:translateX(-0.75rem);transform:translateX(-0.75rem)}.btn-animated:not(.btn-link,.btn-tertiary):focus.btn-sm>span,.btn-animated:not(.btn-link,.btn-tertiary):not(:disabled):hover.btn-sm>span,.btn-animated:not(.btn-link,.btn-tertiary).pretend-hover.btn-sm>span{-webkit-transform:translateX(-0.5rem);transform:translateX(-0.5rem)}.btn-animated:not(.btn-link,.btn-tertiary):focus.btn-rg>span,.btn-animated:not(.btn-link,.btn-tertiary):not(:disabled):hover.btn-rg>span,.btn-animated:not(.btn-link,.btn-tertiary).pretend-hover.btn-rg>span{-webkit-transform:translateX(-0.625rem);transform:translateX(-0.625rem)}.btn-animated:not(.btn-link,.btn-tertiary):focus.btn-lg>span,.btn-animated:not(.btn-link,.btn-tertiary):not(:disabled):hover.btn-lg>span,.btn-animated:not(.btn-link,.btn-tertiary).pretend-hover.btn-lg>span{-webkit-transform:translateX(-1rem);transform:translateX(-1rem)}.btn-animated:not(.btn-link,.btn-tertiary):focus::after,.btn-animated:not(.btn-link,.btn-tertiary):not(:disabled):hover::after,.btn-animated:not(.btn-link,.btn-tertiary).pretend-hover::after{-webkit-transform:rotateZ(315deg) translate(0, 0);transform:rotateZ(315deg) translate(0, 0);opacity:1}.btn-animated:not(.btn-link,.btn-tertiary)>span{-webkit-transform:translateX(0);transform:translateX(0)}}.btn-sm{min-height:2rem;padding:0 1rem;font-size:0.8125rem;gap:0.5rem}.btn-sm>.pi{width:1rem;height:1rem}.btn-rg{min-height:2.5rem;padding:0 1.5rem;font-size:1rem;gap:0.75rem}.btn-rg>.pi{width:1.125rem;height:1.125rem}.btn-lg{min-height:3.5rem;padding:0 2.5rem;font-size:1.0625rem;gap:1.25rem}.btn-lg>.pi{width:1.5rem;height:1.5rem}.btn-nightblue{border-color:transparent;background-color:#004976;color:#fff}.btn-nightblue:focus,.btn-nightblue:not(:disabled):hover,.btn-nightblue.pretend-hover{background-color:#002943;color:#fff}.btn-nightblue-bright{border-color:transparent;background-color:#0076a8;color:#fff}.btn-nightblue-bright:focus,.btn-nightblue-bright:not(:disabled):hover,.btn-nightblue-bright.pretend-hover{background-color:#005275;color:#fff}.btn-petrol{border-color:transparent;background-color:#006d68;color:#fff}.btn-petrol:focus,.btn-petrol:not(:disabled):hover,.btn-petrol.pretend-hover{background-color:#003a37;color:#fff}.btn-petrol-bright{border-color:transparent;background-color:#00968f;color:#000}.btn-petrol-bright:focus,.btn-petrol-bright:not(:disabled):hover,.btn-petrol-bright.pretend-hover{background-color:#00635e;color:#fff}.btn-coral{border-color:transparent;background-color:#9e2a2f;color:#fff}.btn-coral:focus,.btn-coral:not(:disabled):hover,.btn-coral.pretend-hover{background-color:#761f23;color:#fff}.btn-coral-bright{border-color:transparent;background-color:#e03c31;color:#000}.btn-coral-bright:focus,.btn-coral-bright:not(:disabled):hover,.btn-coral-bright.pretend-hover{background-color:#c1271d;color:#fff}.btn-olive{border-color:transparent;background-color:#716135;color:#fff}.btn-olive:focus,.btn-olive:not(:disabled):hover,.btn-olive.pretend-hover{background-color:#4e4325;color:#fff}.btn-olive-bright{border-color:transparent;background-color:#aa9d2e;color:#000}.btn-olive-bright:focus,.btn-olive-bright:not(:disabled):hover,.btn-olive-bright.pretend-hover{background-color:#827823;color:#000}.btn-purple{border-color:transparent;background-color:#80276c;color:#fff}.btn-purple:focus,.btn-purple:not(:disabled):hover,.btn-purple.pretend-hover{background-color:#591b4b;color:#fff}.btn-purple-bright{border-color:transparent;background-color:#c5299b;color:#fff}.btn-purple-bright:focus,.btn-purple-bright:not(:disabled):hover,.btn-purple-bright.pretend-hover{background-color:#9b207a;color:#fff}.btn-aubergine{border-color:transparent;background-color:#523178;color:#fff}.btn-aubergine:focus,.btn-aubergine:not(:disabled):hover,.btn-aubergine.pretend-hover{background-color:#392254;color:#fff}.btn-aubergine-bright{border-color:transparent;background-color:#7566a0;color:#fff}.btn-aubergine-bright:focus,.btn-aubergine-bright:not(:disabled):hover,.btn-aubergine-bright.pretend-hover{background-color:#5e5182;color:#fff}.btn-success{border-color:transparent;background-color:#2c911c;color:#000}.btn-success:focus,.btn-success:not(:disabled):hover,.btn-success.pretend-hover{background-color:#1f6614;color:#fff}.btn-info{border-color:transparent;background-color:#fc0;color:#000}.btn-info:focus,.btn-info:not(:disabled):hover,.btn-info.pretend-hover{background-color:#cca300;color:#000}.btn-warning{border-color:transparent;background-color:#f49e00;color:#000}.btn-warning:focus,.btn-warning:not(:disabled):hover,.btn-warning.pretend-hover{background-color:#c17d00;color:#000}.btn-danger{border-color:transparent;background-color:#a51728;color:#fff}.btn-danger:focus,.btn-danger:not(:disabled):hover,.btn-danger.pretend-hover{background-color:#78111d;color:#fff}.row{--bs-gutter-x:30px;--bs-gutter-y:0;display:-ms-flexbox;display:flex;-ms-flex-wrap:wrap;flex-wrap:wrap;margin-top:calc(-1 * var(--bs-gutter-y));margin-right:calc(-0.5 * var(--bs-gutter-x));margin-left:calc(-0.5 * var(--bs-gutter-x))}.row>*{-ms-flex-negative:0;flex-shrink:0;width:100%;max-width:100%;padding-right:calc(var(--bs-gutter-x) * 0.5);padding-left:calc(var(--bs-gutter-x) * 0.5);margin-top:var(--bs-gutter-y)}.col{-ms-flex:1 0 0%;flex:1 0 0%}.row-cols-auto>*{-ms-flex:0 0 auto;flex:0 0 auto;width:auto}.row-cols-1>*{-ms-flex:0 0 auto;flex:0 0 auto;width:100%}.row-cols-2>*{-ms-flex:0 0 auto;flex:0 0 auto;width:50%}.row-cols-3>*{-ms-flex:0 0 auto;flex:0 0 auto;width:33.3333333333%}.row-cols-4>*{-ms-flex:0 0 auto;flex:0 0 auto;width:25%}.row-cols-5>*{-ms-flex:0 0 auto;flex:0 0 auto;width:20%}.row-cols-6>*{-ms-flex:0 0 auto;flex:0 0 auto;width:16.6666666667%}.col-auto{-ms-flex:0 0 auto;flex:0 0 auto;width:auto}.col-1{-ms-flex:0 0 auto;flex:0 0 auto;width:8.33333333%}.col-2{-ms-flex:0 0 auto;flex:0 0 auto;width:16.66666667%}.col-3{-ms-flex:0 0 auto;flex:0 0 auto;width:25%}.col-4{-ms-flex:0 0 auto;flex:0 0 auto;width:33.33333333%}.col-5{-ms-flex:0 0 auto;flex:0 0 auto;width:41.66666667%}.col-6{-ms-flex:0 0 auto;flex:0 0 auto;width:50%}.col-7{-ms-flex:0 0 auto;flex:0 0 auto;width:58.33333333%}.col-8{-ms-flex:0 0 auto;flex:0 0 auto;width:66.66666667%}.col-9{-ms-flex:0 0 auto;flex:0 0 auto;width:75%}.col-10{-ms-flex:0 0 auto;flex:0 0 auto;width:83.33333333%}.col-11{-ms-flex:0 0 auto;flex:0 0 auto;width:91.66666667%}.col-12{-ms-flex:0 0 auto;flex:0 0 auto;width:100%}.offset-1{margin-left:8.33333333%}.offset-2{margin-left:16.66666667%}.offset-3{margin-left:25%}.offset-4{margin-left:33.33333333%}.offset-5{margin-left:41.66666667%}.offset-6{margin-left:50%}.offset-7{margin-left:58.33333333%}.offset-8{margin-left:66.66666667%}.offset-9{margin-left:75%}.offset-10{margin-left:83.33333333%}.offset-11{margin-left:91.66666667%}.g-0,.gx-0{--bs-gutter-x:0}.g-0,.gy-0{--bs-gutter-y:0}.g-1,.gx-1{--bs-gutter-x:0.25rem}.g-1,.gy-1{--bs-gutter-y:0.25rem}.g-2,.gx-2{--bs-gutter-x:0.5rem}.g-2,.gy-2{--bs-gutter-y:0.5rem}.g-3,.gx-3{--bs-gutter-x:1rem}.g-3,.gy-3{--bs-gutter-y:1rem}.g-4,.gx-4{--bs-gutter-x:1.5rem}.g-4,.gy-4{--bs-gutter-y:1.5rem}.g-5,.gx-5{--bs-gutter-x:3rem}.g-5,.gy-5{--bs-gutter-y:3rem}@media (min-width: 400px){.col-sm{-ms-flex:1 0 0%;flex:1 0 0%}.row-cols-sm-auto>*{-ms-flex:0 0 auto;flex:0 0 auto;width:auto}.row-cols-sm-1>*{-ms-flex:0 0 auto;flex:0 0 auto;width:100%}.row-cols-sm-2>*{-ms-flex:0 0 auto;flex:0 0 auto;width:50%}.row-cols-sm-3>*{-ms-flex:0 0 auto;flex:0 0 auto;width:33.3333333333%}.row-cols-sm-4>*{-ms-flex:0 0 auto;flex:0 0 auto;width:25%}.row-cols-sm-5>*{-ms-flex:0 0 auto;flex:0 0 auto;width:20%}.row-cols-sm-6>*{-ms-flex:0 0 auto;flex:0 0 auto;width:16.6666666667%}.col-sm-auto{-ms-flex:0 0 auto;flex:0 0 auto;width:auto}.col-sm-1{-ms-flex:0 0 auto;flex:0 0 auto;width:8.33333333%}.col-sm-2{-ms-flex:0 0 auto;flex:0 0 auto;width:16.66666667%}.col-sm-3{-ms-flex:0 0 auto;flex:0 0 auto;width:25%}.col-sm-4{-ms-flex:0 0 auto;flex:0 0 auto;width:33.33333333%}.col-sm-5{-ms-flex:0 0 auto;flex:0 0 auto;width:41.66666667%}.col-sm-6{-ms-flex:0 0 auto;flex:0 0 auto;width:50%}.col-sm-7{-ms-flex:0 0 auto;flex:0 0 auto;width:58.33333333%}.col-sm-8{-ms-flex:0 0 auto;flex:0 0 auto;width:66.66666667%}.col-sm-9{-ms-flex:0 0 auto;flex:0 0 auto;width:75%}.col-sm-10{-ms-flex:0 0 auto;flex:0 0 auto;width:83.33333333%}.col-sm-11{-ms-flex:0 0 auto;flex:0 0 auto;width:91.66666667%}.col-sm-12{-ms-flex:0 0 auto;flex:0 0 auto;width:100%}.offset-sm-0{margin-left:0}.offset-sm-1{margin-left:8.33333333%}.offset-sm-2{margin-left:16.66666667%}.offset-sm-3{margin-left:25%}.offset-sm-4{margin-left:33.33333333%}.offset-sm-5{margin-left:41.66666667%}.offset-sm-6{margin-left:50%}.offset-sm-7{margin-left:58.33333333%}.offset-sm-8{margin-left:66.66666667%}.offset-sm-9{margin-left:75%}.offset-sm-10{margin-left:83.33333333%}.offset-sm-11{margin-left:91.66666667%}.g-sm-0,.gx-sm-0{--bs-gutter-x:0}.g-sm-0,.gy-sm-0{--bs-gutter-y:0}.g-sm-1,.gx-sm-1{--bs-gutter-x:0.25rem}.g-sm-1,.gy-sm-1{--bs-gutter-y:0.25rem}.g-sm-2,.gx-sm-2{--bs-gutter-x:0.5rem}.g-sm-2,.gy-sm-2{--bs-gutter-y:0.5rem}.g-sm-3,.gx-sm-3{--bs-gutter-x:1rem}.g-sm-3,.gy-sm-3{--bs-gutter-y:1rem}.g-sm-4,.gx-sm-4{--bs-gutter-x:1.5rem}.g-sm-4,.gy-sm-4{--bs-gutter-y:1.5rem}.g-sm-5,.gx-sm-5{--bs-gutter-x:3rem}.g-sm-5,.gy-sm-5{--bs-gutter-y:3rem}}@media (min-width: 600px){.col-rg{-ms-flex:1 0 0%;flex:1 0 0%}.row-cols-rg-auto>*{-ms-flex:0 0 auto;flex:0 0 auto;width:auto}.row-cols-rg-1>*{-ms-flex:0 0 auto;flex:0 0 auto;width:100%}.row-cols-rg-2>*{-ms-flex:0 0 auto;flex:0 0 auto;width:50%}.row-cols-rg-3>*{-ms-flex:0 0 auto;flex:0 0 auto;width:33.3333333333%}.row-cols-rg-4>*{-ms-flex:0 0 auto;flex:0 0 auto;width:25%}.row-cols-rg-5>*{-ms-flex:0 0 auto;flex:0 0 auto;width:20%}.row-cols-rg-6>*{-ms-flex:0 0 auto;flex:0 0 auto;width:16.6666666667%}.col-rg-auto{-ms-flex:0 0 auto;flex:0 0 auto;width:auto}.col-rg-1{-ms-flex:0 0 auto;flex:0 0 auto;width:8.33333333%}.col-rg-2{-ms-flex:0 0 auto;flex:0 0 auto;width:16.66666667%}.col-rg-3{-ms-flex:0 0 auto;flex:0 0 auto;width:25%}.col-rg-4{-ms-flex:0 0 auto;flex:0 0 auto;width:33.33333333%}.col-rg-5{-ms-flex:0 0 auto;flex:0 0 auto;width:41.66666667%}.col-rg-6{-ms-flex:0 0 auto;flex:0 0 auto;width:50%}.col-rg-7{-ms-flex:0 0 auto;flex:0 0 auto;width:58.33333333%}.col-rg-8{-ms-flex:0 0 auto;flex:0 0 auto;width:66.66666667%}.col-rg-9{-ms-flex:0 0 auto;flex:0 0 auto;width:75%}.col-rg-10{-ms-flex:0 0 auto;flex:0 0 auto;width:83.33333333%}.col-rg-11{-ms-flex:0 0 auto;flex:0 0 auto;width:91.66666667%}.col-rg-12{-ms-flex:0 0 auto;flex:0 0 auto;width:100%}.offset-rg-0{margin-left:0}.offset-rg-1{margin-left:8.33333333%}.offset-rg-2{margin-left:16.66666667%}.offset-rg-3{margin-left:25%}.offset-rg-4{margin-left:33.33333333%}.offset-rg-5{margin-left:41.66666667%}.offset-rg-6{margin-left:50%}.offset-rg-7{margin-left:58.33333333%}.offset-rg-8{margin-left:66.66666667%}.offset-rg-9{margin-left:75%}.offset-rg-10{margin-left:83.33333333%}.offset-rg-11{margin-left:91.66666667%}.g-rg-0,.gx-rg-0{--bs-gutter-x:0}.g-rg-0,.gy-rg-0{--bs-gutter-y:0}.g-rg-1,.gx-rg-1{--bs-gutter-x:0.25rem}.g-rg-1,.gy-rg-1{--bs-gutter-y:0.25rem}.g-rg-2,.gx-rg-2{--bs-gutter-x:0.5rem}.g-rg-2,.gy-rg-2{--bs-gutter-y:0.5rem}.g-rg-3,.gx-rg-3{--bs-gutter-x:1rem}.g-rg-3,.gy-rg-3{--bs-gutter-y:1rem}.g-rg-4,.gx-rg-4{--bs-gutter-x:1.5rem}.g-rg-4,.gy-rg-4{--bs-gutter-y:1.5rem}.g-rg-5,.gx-rg-5{--bs-gutter-x:3rem}.g-rg-5,.gy-rg-5{--bs-gutter-y:3rem}}@media (min-width: 780px){.col-md{-ms-flex:1 0 0%;flex:1 0 0%}.row-cols-md-auto>*{-ms-flex:0 0 auto;flex:0 0 auto;width:auto}.row-cols-md-1>*{-ms-flex:0 0 auto;flex:0 0 auto;width:100%}.row-cols-md-2>*{-ms-flex:0 0 auto;flex:0 0 auto;width:50%}.row-cols-md-3>*{-ms-flex:0 0 auto;flex:0 0 auto;width:33.3333333333%}.row-cols-md-4>*{-ms-flex:0 0 auto;flex:0 0 auto;width:25%}.row-cols-md-5>*{-ms-flex:0 0 auto;flex:0 0 auto;width:20%}.row-cols-md-6>*{-ms-flex:0 0 auto;flex:0 0 auto;width:16.6666666667%}.col-md-auto{-ms-flex:0 0 auto;flex:0 0 auto;width:auto}.col-md-1{-ms-flex:0 0 auto;flex:0 0 auto;width:8.33333333%}.col-md-2{-ms-flex:0 0 auto;flex:0 0 auto;width:16.66666667%}.col-md-3{-ms-flex:0 0 auto;flex:0 0 auto;width:25%}.col-md-4{-ms-flex:0 0 auto;flex:0 0 auto;width:33.33333333%}.col-md-5{-ms-flex:0 0 auto;flex:0 0 auto;width:41.66666667%}.col-md-6{-ms-flex:0 0 auto;flex:0 0 auto;width:50%}.col-md-7{-ms-flex:0 0 auto;flex:0 0 auto;width:58.33333333%}.col-md-8{-ms-flex:0 0 auto;flex:0 0 auto;width:66.66666667%}.col-md-9{-ms-flex:0 0 auto;flex:0 0 auto;width:75%}.col-md-10{-ms-flex:0 0 auto;flex:0 0 auto;width:83.33333333%}.col-md-11{-ms-flex:0 0 auto;flex:0 0 auto;width:91.66666667%}.col-md-12{-ms-flex:0 0 auto;flex:0 0 auto;width:100%}.offset-md-0{margin-left:0}.offset-md-1{margin-left:8.33333333%}.offset-md-2{margin-left:16.66666667%}.offset-md-3{margin-left:25%}.offset-md-4{margin-left:33.33333333%}.offset-md-5{margin-left:41.66666667%}.offset-md-6{margin-left:50%}.offset-md-7{margin-left:58.33333333%}.offset-md-8{margin-left:66.66666667%}.offset-md-9{margin-left:75%}.offset-md-10{margin-left:83.33333333%}.offset-md-11{margin-left:91.66666667%}.g-md-0,.gx-md-0{--bs-gutter-x:0}.g-md-0,.gy-md-0{--bs-gutter-y:0}.g-md-1,.gx-md-1{--bs-gutter-x:0.25rem}.g-md-1,.gy-md-1{--bs-gutter-y:0.25rem}.g-md-2,.gx-md-2{--bs-gutter-x:0.5rem}.g-md-2,.gy-md-2{--bs-gutter-y:0.5rem}.g-md-3,.gx-md-3{--bs-gutter-x:1rem}.g-md-3,.gy-md-3{--bs-gutter-y:1rem}.g-md-4,.gx-md-4{--bs-gutter-x:1.5rem}.g-md-4,.gy-md-4{--bs-gutter-y:1.5rem}.g-md-5,.gx-md-5{--bs-gutter-x:3rem}.g-md-5,.gy-md-5{--bs-gutter-y:3rem}}@media (min-width: 1024px){.col-lg{-ms-flex:1 0 0%;flex:1 0 0%}.row-cols-lg-auto>*{-ms-flex:0 0 auto;flex:0 0 auto;width:auto}.row-cols-lg-1>*{-ms-flex:0 0 auto;flex:0 0 auto;width:100%}.row-cols-lg-2>*{-ms-flex:0 0 auto;flex:0 0 auto;width:50%}.row-cols-lg-3>*{-ms-flex:0 0 auto;flex:0 0 auto;width:33.3333333333%}.row-cols-lg-4>*{-ms-flex:0 0 auto;flex:0 0 auto;width:25%}.row-cols-lg-5>*{-ms-flex:0 0 auto;flex:0 0 auto;width:20%}.row-cols-lg-6>*{-ms-flex:0 0 auto;flex:0 0 auto;width:16.6666666667%}.col-lg-auto{-ms-flex:0 0 auto;flex:0 0 auto;width:auto}.col-lg-1{-ms-flex:0 0 auto;flex:0 0 auto;width:8.33333333%}.col-lg-2{-ms-flex:0 0 auto;flex:0 0 auto;width:16.66666667%}.col-lg-3{-ms-flex:0 0 auto;flex:0 0 auto;width:25%}.col-lg-4{-ms-flex:0 0 auto;flex:0 0 auto;width:33.33333333%}.col-lg-5{-ms-flex:0 0 auto;flex:0 0 auto;width:41.66666667%}.col-lg-6{-ms-flex:0 0 auto;flex:0 0 auto;width:50%}.col-lg-7{-ms-flex:0 0 auto;flex:0 0 auto;width:58.33333333%}.col-lg-8{-ms-flex:0 0 auto;flex:0 0 auto;width:66.66666667%}.col-lg-9{-ms-flex:0 0 auto;flex:0 0 auto;width:75%}.col-lg-10{-ms-flex:0 0 auto;flex:0 0 auto;width:83.33333333%}.col-lg-11{-ms-flex:0 0 auto;flex:0 0 auto;width:91.66666667%}.col-lg-12{-ms-flex:0 0 auto;flex:0 0 auto;width:100%}.offset-lg-0{margin-left:0}.offset-lg-1{margin-left:8.33333333%}.offset-lg-2{margin-left:16.66666667%}.offset-lg-3{margin-left:25%}.offset-lg-4{margin-left:33.33333333%}.offset-lg-5{margin-left:41.66666667%}.offset-lg-6{margin-left:50%}.offset-lg-7{margin-left:58.33333333%}.offset-lg-8{margin-left:66.66666667%}.offset-lg-9{margin-left:75%}.offset-lg-10{margin-left:83.33333333%}.offset-lg-11{margin-left:91.66666667%}.g-lg-0,.gx-lg-0{--bs-gutter-x:0}.g-lg-0,.gy-lg-0{--bs-gutter-y:0}.g-lg-1,.gx-lg-1{--bs-gutter-x:0.25rem}.g-lg-1,.gy-lg-1{--bs-gutter-y:0.25rem}.g-lg-2,.gx-lg-2{--bs-gutter-x:0.5rem}.g-lg-2,.gy-lg-2{--bs-gutter-y:0.5rem}.g-lg-3,.gx-lg-3{--bs-gutter-x:1rem}.g-lg-3,.gy-lg-3{--bs-gutter-y:1rem}.g-lg-4,.gx-lg-4{--bs-gutter-x:1.5rem}.g-lg-4,.gy-lg-4{--bs-gutter-y:1.5rem}.g-lg-5,.gx-lg-5{--bs-gutter-x:3rem}.g-lg-5,.gy-lg-5{--bs-gutter-y:3rem}}@media (min-width: 1280px){.col-xl{-ms-flex:1 0 0%;flex:1 0 0%}.row-cols-xl-auto>*{-ms-flex:0 0 auto;flex:0 0 auto;width:auto}.row-cols-xl-1>*{-ms-flex:0 0 auto;flex:0 0 auto;width:100%}.row-cols-xl-2>*{-ms-flex:0 0 auto;flex:0 0 auto;width:50%}.row-cols-xl-3>*{-ms-flex:0 0 auto;flex:0 0 auto;width:33.3333333333%}.row-cols-xl-4>*{-ms-flex:0 0 auto;flex:0 0 auto;width:25%}.row-cols-xl-5>*{-ms-flex:0 0 auto;flex:0 0 auto;width:20%}.row-cols-xl-6>*{-ms-flex:0 0 auto;flex:0 0 auto;width:16.6666666667%}.col-xl-auto{-ms-flex:0 0 auto;flex:0 0 auto;width:auto}.col-xl-1{-ms-flex:0 0 auto;flex:0 0 auto;width:8.33333333%}.col-xl-2{-ms-flex:0 0 auto;flex:0 0 auto;width:16.66666667%}.col-xl-3{-ms-flex:0 0 auto;flex:0 0 auto;width:25%}.col-xl-4{-ms-flex:0 0 auto;flex:0 0 auto;width:33.33333333%}.col-xl-5{-ms-flex:0 0 auto;flex:0 0 auto;width:41.66666667%}.col-xl-6{-ms-flex:0 0 auto;flex:0 0 auto;width:50%}.col-xl-7{-ms-flex:0 0 auto;flex:0 0 auto;width:58.33333333%}.col-xl-8{-ms-flex:0 0 auto;flex:0 0 auto;width:66.66666667%}.col-xl-9{-ms-flex:0 0 auto;flex:0 0 auto;width:75%}.col-xl-10{-ms-flex:0 0 auto;flex:0 0 auto;width:83.33333333%}.col-xl-11{-ms-flex:0 0 auto;flex:0 0 auto;width:91.66666667%}.col-xl-12{-ms-flex:0 0 auto;flex:0 0 auto;width:100%}.offset-xl-0{margin-left:0}.offset-xl-1{margin-left:8.33333333%}.offset-xl-2{margin-left:16.66666667%}.offset-xl-3{margin-left:25%}.offset-xl-4{margin-left:33.33333333%}.offset-xl-5{margin-left:41.66666667%}.offset-xl-6{margin-left:50%}.offset-xl-7{margin-left:58.33333333%}.offset-xl-8{margin-left:66.66666667%}.offset-xl-9{margin-left:75%}.offset-xl-10{margin-left:83.33333333%}.offset-xl-11{margin-left:91.66666667%}.g-xl-0,.gx-xl-0{--bs-gutter-x:0}.g-xl-0,.gy-xl-0{--bs-gutter-y:0}.g-xl-1,.gx-xl-1{--bs-gutter-x:0.25rem}.g-xl-1,.gy-xl-1{--bs-gutter-y:0.25rem}.g-xl-2,.gx-xl-2{--bs-gutter-x:0.5rem}.g-xl-2,.gy-xl-2{--bs-gutter-y:0.5rem}.g-xl-3,.gx-xl-3{--bs-gutter-x:1rem}.g-xl-3,.gy-xl-3{--bs-gutter-y:1rem}.g-xl-4,.gx-xl-4{--bs-gutter-x:1.5rem}.g-xl-4,.gy-xl-4{--bs-gutter-y:1.5rem}.g-xl-5,.gx-xl-5{--bs-gutter-x:3rem}.g-xl-5,.gy-xl-5{--bs-gutter-y:3rem}}@media (min-width: 1441px){.col-xxl{-ms-flex:1 0 0%;flex:1 0 0%}.row-cols-xxl-auto>*{-ms-flex:0 0 auto;flex:0 0 auto;width:auto}.row-cols-xxl-1>*{-ms-flex:0 0 auto;flex:0 0 auto;width:100%}.row-cols-xxl-2>*{-ms-flex:0 0 auto;flex:0 0 auto;width:50%}.row-cols-xxl-3>*{-ms-flex:0 0 auto;flex:0 0 auto;width:33.3333333333%}.row-cols-xxl-4>*{-ms-flex:0 0 auto;flex:0 0 auto;width:25%}.row-cols-xxl-5>*{-ms-flex:0 0 auto;flex:0 0 auto;width:20%}.row-cols-xxl-6>*{-ms-flex:0 0 auto;flex:0 0 auto;width:16.6666666667%}.col-xxl-auto{-ms-flex:0 0 auto;flex:0 0 auto;width:auto}.col-xxl-1{-ms-flex:0 0 auto;flex:0 0 auto;width:8.33333333%}.col-xxl-2{-ms-flex:0 0 auto;flex:0 0 auto;width:16.66666667%}.col-xxl-3{-ms-flex:0 0 auto;flex:0 0 auto;width:25%}.col-xxl-4{-ms-flex:0 0 auto;flex:0 0 auto;width:33.33333333%}.col-xxl-5{-ms-flex:0 0 auto;flex:0 0 auto;width:41.66666667%}.col-xxl-6{-ms-flex:0 0 auto;flex:0 0 auto;width:50%}.col-xxl-7{-ms-flex:0 0 auto;flex:0 0 auto;width:58.33333333%}.col-xxl-8{-ms-flex:0 0 auto;flex:0 0 auto;width:66.66666667%}.col-xxl-9{-ms-flex:0 0 auto;flex:0 0 auto;width:75%}.col-xxl-10{-ms-flex:0 0 auto;flex:0 0 auto;width:83.33333333%}.col-xxl-11{-ms-flex:0 0 auto;flex:0 0 auto;width:91.66666667%}.col-xxl-12{-ms-flex:0 0 auto;flex:0 0 auto;width:100%}.offset-xxl-0{margin-left:0}.offset-xxl-1{margin-left:8.33333333%}.offset-xxl-2{margin-left:16.66666667%}.offset-xxl-3{margin-left:25%}.offset-xxl-4{margin-left:33.33333333%}.offset-xxl-5{margin-left:41.66666667%}.offset-xxl-6{margin-left:50%}.offset-xxl-7{margin-left:58.33333333%}.offset-xxl-8{margin-left:66.66666667%}.offset-xxl-9{margin-left:75%}.offset-xxl-10{margin-left:83.33333333%}.offset-xxl-11{margin-left:91.66666667%}.g-xxl-0,.gx-xxl-0{--bs-gutter-x:0}.g-xxl-0,.gy-xxl-0{--bs-gutter-y:0}.g-xxl-1,.gx-xxl-1{--bs-gutter-x:0.25rem}.g-xxl-1,.gy-xxl-1{--bs-gutter-y:0.25rem}.g-xxl-2,.gx-xxl-2{--bs-gutter-x:0.5rem}.g-xxl-2,.gy-xxl-2{--bs-gutter-y:0.5rem}.g-xxl-3,.gx-xxl-3{--bs-gutter-x:1rem}.g-xxl-3,.gy-xxl-3{--bs-gutter-y:1rem}.g-xxl-4,.gx-xxl-4{--bs-gutter-x:1.5rem}.g-xxl-4,.gy-xxl-4{--bs-gutter-y:1.5rem}.g-xxl-5,.gx-xxl-5{--bs-gutter-x:3rem}.g-xxl-5,.gy-xxl-5{--bs-gutter-y:3rem}}.container,.container-fluid,.container-xs{--bs-gutter-x:30px;--bs-gutter-y:0;width:100%;padding-right:calc(var(--bs-gutter-x) * 0.5);padding-left:calc(var(--bs-gutter-x) * 0.5);margin-right:auto;margin-left:auto}.container{max-width:1440px}.vertical-gutters{margin-bottom:-30px}.vertical-gutters>.col,.vertical-gutters>[class*=col-]{padding-bottom:30px}.row.border-gutters{margin-right:-1px;margin-bottom:-1px;margin-left:0}.row.border-gutters>.col,.row.border-gutters>[class*=col-]{padding-right:1px;padding-bottom:1px;padding-left:0}.container{padding-right:12px;padding-left:12px}.container-reset{margin-right:-12px;margin-left:-12px}.container-reset-left{margin-left:-12px}.container-reset-right{margin-right:-12px}@media (max-width: 399.98px){.container-fluid-xs{padding-right:1rem;padding-left:1rem}}@media (min-width: 400px){.container{padding-right:16px;padding-left:16px}}@media (min-width: 400px){.container-reset{margin-right:-16px;margin-left:-16px}}@media (min-width: 400px){.container-reset-left{margin-left:-16px}}@media (min-width: 400px){.container-reset-right{margin-right:-16px}}@media (min-width: 400px) and (max-width: 599.98px){.container-fluid-sm{padding-right:1rem;padding-left:1rem}}@media (min-width: 600px){.container{padding-right:32px;padding-left:32px}}@media (min-width: 600px){.container-reset{margin-right:-32px;margin-left:-32px}}@media (min-width: 600px){.container-reset-left{margin-left:-32px}}@media (min-width: 600px){.container-reset-right{margin-right:-32px}}@media (min-width: 600px) and (max-width: 779.98px){.container-fluid-rg{padding-right:1rem;padding-left:1rem}}@media (min-width: 780px) and (max-width: 1023.98px){.container-fluid-md{padding-right:1rem;padding-left:1rem}}@media (min-width: 1024px){.container{padding-right:40px;padding-left:40px}}@media (min-width: 1024px){.container-reset{margin-right:-40px;margin-left:-40px}}@media (min-width: 1024px){.container-reset-left{margin-left:-40px}}@media (min-width: 1024px){.container-reset-right{margin-right:-40px}}@media (min-width: 1024px) and (max-width: 1279.98px){.container-fluid-lg{padding-right:1rem;padding-left:1rem}}@media (min-width: 1280px){.container{padding-right:128px;padding-left:128px}}@media (min-width: 1280px){.container-reset{margin-right:-128px;margin-left:-128px}}@media (min-width: 1280px){.container-reset-left{margin-left:-128px}}@media (min-width: 1280px){.container-reset-right{margin-right:-128px}}@media (min-width: 1280px) and (max-width: 1440.98px){.container-fluid-xl{padding-right:1rem;padding-left:1rem}}@media (min-width: 1441px){.container-fluid-xxl{padding-right:1rem;padding-left:1rem}}@-webkit-keyframes progress-bar-stripes{0%{background-position-x:1rem}}@keyframes progress-bar-stripes{0%{background-position-x:1rem}}.progress{--bs-progress-height:1rem;--bs-progress-font-size:0.75rem;--bs-progress-bg:#cccccc;--bs-progress-border-radius:3px;--bs-progress-box-shadow:inset 0 0.1rem 0.1rem rgba(0, 0, 0, 0.1);--bs-progress-bar-color:#fff;--bs-progress-bar-bg:#333333;--bs-progress-bar-transition:width 0.6s ease;display:-ms-flexbox;display:flex;height:var(--bs-progress-height);overflow:hidden;font-size:var(--bs-progress-font-size);background-color:var(--bs-progress-bg);border-radius:var(--bs-progress-border-radius)}.progress-bar{display:-ms-flexbox;display:flex;-ms-flex-direction:column;flex-direction:column;-ms-flex-pack:center;justify-content:center;overflow:hidden;color:var(--bs-progress-bar-color);text-align:center;white-space:nowrap;background-color:var(--bs-progress-bar-bg);-webkit-transition:var(--bs-progress-bar-transition);transition:var(--bs-progress-bar-transition)}@media (prefers-reduced-motion: reduce){.progress-bar{-webkit-transition:none;transition:none}}.progress-bar-striped{background-image:linear-gradient(45deg, rgba(255, 255, 255, 0.15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.15) 50%, rgba(255, 255, 255, 0.15) 75%, transparent 75%, transparent);background-size:var(--bs-progress-height) var(--bs-progress-height)}.progress-bar-animated{-webkit-animation:1s linear infinite progress-bar-stripes;animation:1s linear infinite progress-bar-stripes}@media (prefers-reduced-motion: reduce){.progress-bar-animated{-webkit-animation:none;animation:none}}@-webkit-keyframes spin{0%{-webkit-transform:rotate(0deg);transform:rotate(0deg)}100%{-webkit-transform:rotate(360deg);transform:rotate(360deg)}}@keyframes spin{0%{-webkit-transform:rotate(0deg);transform:rotate(0deg)}100%{-webkit-transform:rotate(360deg);transform:rotate(360deg)}}.spinner-bg{position:absolute;z-index:990;top:0;left:0;width:100%;height:100%}.loading-modal{display:-ms-inline-flexbox;display:inline-flex;position:absolute;z-index:990;top:0;right:0;bottom:0;left:0}.loader{width:3.5rem;height:3.5rem;-webkit-animation:spin 2s linear infinite;animation:spin 2s linear infinite;border:6px solid #fc0;border-radius:50%;border-right-color:transparent;border-bottom-color:#e6e6e6}.loader.loader-sm{width:2rem;height:2rem;border-width:0.25rem}.loader.loader-xs{width:0.75rem;height:0.75rem;border-width:2px}@media (forced-colors: active), (-ms-high-contrast: active), (-ms-high-contrast: white-on-black){.loader{border-color:Highlight;border-bottom-color:CanvasText;border-right-color:Canvas}@supports (forced-color-adjust: none){.loader{forced-color-adjust:none;border-right-color:transparent}}}*,:host,*::before,*::after{-webkit-box-sizing:border-box;box-sizing:border-box}button{font:inherit;padding:0}img,svg{max-width:100%;max-height:100%}@media (forced-colors: active){svg{color:white}}.no-list{list-style:none;padding-left:0;margin-top:0;margin-bottom:0}.btn-blank{background-color:transparent;border:none;border-radius:0;padding:0}.nav-link{text-decoration:none;color:rgba(0, 0, 0, 0.8);-webkit-transition:color 200ms;transition:color 200ms;background-color:transparent;border-radius:0;-webkit-box-shadow:none;box-shadow:none;border:0;margin:0;display:-ms-flexbox;display:flex;-ms-flex-align:center;align-items:center;gap:0.5rem}.nav-link:hover,.nav-link:focus{color:black}.nav-link>svg{width:1.4em;height:1.4em;-ms-flex-negative:0;flex-shrink:0}.nav-link>span{-ms-flex-negative:1;flex-shrink:1}.box>*:first-child{margin-top:0}.box>*:last-child{margin-bottom:0}.mirrored{-webkit-transform:scaleX(-1);transform:scaleX(-1)}.rotate-270{-webkit-transform:rotate(270deg);transform:rotate(270deg)}.bold{font-weight:700}.light{font-weight:300}.d-flex{display:-ms-flexbox;display:flex}.d-inline-flex{display:-ms-inline-flexbox;display:inline-flex}.align-items-center{-ms-flex-align:center;align-items:center}@media (min-width: 1441px){.wide-container{margin:0 auto;max-width:1440px}}@media (max-width: 599.98px){.container{padding-right:16px;padding-left:16px}}@media (min-width: 600px) and (max-width: 1023.98px){.container{padding-right:32px;padding-left:32px}}@media (min-width: 1024px){.container{padding-right:40px;padding-left:40px}}.visually-hidden{position:absolute;width:1px;height:1px;border:0;padding:0;margin:-1px;overflow:hidden;clip:rect(0 0 0 0)}@media (max-width: -0.02px){.hidden-xs{display:none}}@media (max-width: 399.98px){.hidden-sm{display:none}}@media (max-width: 599.98px){.hidden-rg{display:none}}@media (max-width: 779.98px){.hidden-md{display:none}}@media (max-width: 1023.98px){.hidden-lg{display:none}}@media (max-width: 1279.98px){.hidden-xl{display:none}}@media (max-width: 1440.98px){.hidden-xxl{display:none}}:host{display:block;position:relative}.breadcrumbs{font-size:1rem;display:-ms-flexbox;display:flex;-ms-flex-align:center;align-items:center;-ms-flex-pack:justify;justify-content:space-between;gap:1rem}@media (max-width: 599.98px){.breadcrumbs{font-size:0.875rem}}.breadcrumbs-nav{white-space:nowrap;-ms-flex-positive:1;flex-grow:1;-ms-flex-negative:1;flex-shrink:1;min-width:0}.breadcrumbs-list,.nav-link{display:-ms-flexbox;display:flex;-ms-flex-align:center;align-items:center}.breadcrumbs-list li{display:-ms-flexbox;display:flex;-ms-flex-negative:0;flex-shrink:0}.breadcrumbs-list li:last-child{-ms-flex-negative:2;flex-shrink:2;min-width:0;overflow:hidden;text-overflow:ellipsis}.breadcrumbs-list li:last-child a{border:2px solid transparent;outline-offset:0}.breadcrumbs-list svg{margin-left:0 !important;width:1.5em;height:1.5em;color:rgba(0, 0, 0, 0.6)}.breadcrumb-buttons{display:-ms-flexbox;display:flex;-ms-flex-pack:end;justify-content:flex-end;gap:1rem;-ms-flex-negative:0;flex-shrink:0}.breadcrumb-buttons .btn{cursor:pointer;gap:0.5rem;font-size:inherit}.breadcrumb-buttons .btn.btn-secondary>svg{width:1.5rem;height:1.5rem;margin:0}@media (min-width: 1024px){.breadcrumb-buttons .btn span{position:static;width:auto;height:auto;margin:auto;overflow:visible;clip:auto;visibility:visible}}.nav-link{gap:0;color:rgba(0, 0, 0, 0.6);font-weight:400}.middle-dropdown-container{position:relative;display:-ms-flexbox;display:flex;-ms-flex-align:center;align-items:center}.middle-dropdown{position:absolute;top:100%;left:0;background:white;border:1px solid #e6e6e6;padding:0.5rem 0;z-index:1}.middle-dropdown .nav-link{padding:0.5rem 1rem;-webkit-transition:color 200ms;transition:color 200ms}.middle-dropdown .nav-link:hover{background-color:#e6e6e6}.middle-dropdown-button{cursor:pointer;display:-ms-flexbox;display:flex;-ms-flex-align:center;align-items:center;gap:0.25rem;font-size:inherit;color:inherit}.middle-dropdown-button span{margin:0}.middle-dropdown-button svg{margin:0;-ms-flex-negative:0;flex-shrink:0;width:1.4em;height:1.4em}.overlay{display:-ms-flexbox;display:flex;-ms-flex-align:center;align-items:center;position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0, 0, 0, 0.6);z-index:calc(var(--header-z-index, 10) + 1);opacity:0;visibility:hidden;-webkit-transition:opacity 500ms, visibility 0s 500ms;transition:opacity 500ms, visibility 0s 500ms}.overlay.open{visibility:visible;opacity:1;-webkit-transition:opacity 500ms, visibility 0s 0s;transition:opacity 500ms, visibility 0s 0s}.overlay-container{position:relative;background:white;-webkit-box-shadow:0 0 40px rgba(0, 0, 0, 0.6);box-shadow:0 0 40px rgba(0, 0, 0, 0.6);visibility:hidden;-webkit-transform:translateY(3rem);transform:translateY(3rem);opacity:0;-webkit-transition:opacity 500ms, -webkit-transform 500ms;transition:opacity 500ms, -webkit-transform 500ms;transition:transform 500ms, opacity 500ms;transition:transform 500ms, opacity 500ms, -webkit-transform 500ms}iframe{display:block;width:1px;min-width:100%;overflow:auto;max-height:80vh}.overlay-close{position:absolute;top:1rem;right:1rem;cursor:pointer;padding:0.5rem;color:rgba(0, 0, 0, 0.8)}.overlay-close:hover,.overlay-close:focus{color:black}.overlay-close.phone{color:white}.overlay-close.phone:hover,.overlay-close.phone:focus{color:rgba(255, 255, 255, 0.8)}@media (min-width: 600px){.overlay-close span{position:static;width:auto;height:auto;margin:auto;overflow:visible;clip:auto;visibility:visible}}.loader-wrapper{position:absolute;display:grid;place-items:center;width:100%;height:100%;top:0;left:0}.loaded~.loader-wrapper{display:none}.hidden-control-breadcrumbs{position:absolute;top:100%;width:0;overflow:hidden;display:-ms-flexbox;display:flex;pointer-events:none}.hidden-control-breadcrumbs .breadcrumbs-nav{-ms-flex-negative:0;flex-shrink:0}.hidden-control-breadcrumbs .breadcrumbs-list li{-ms-flex-negative:0;flex-shrink:0}";

const PostInternetBreadcrumbs = class {
  constructor(hostRef) {
    index.registerInstance(this, hostRef);
    this.customItems = undefined;
    this.customBreadcrumbItems = undefined;
    this.overlayVisible = undefined;
    this.isConcatenated = undefined;
    this.dropdownOpen = false;
    this.refsReady = false;
  }
  connectedCallback() {
    this.debouncedResize = index$1.debounce(200, this.handleResize.bind(this));
    window.addEventListener('resize', this.debouncedResize, { passive: true });
  }
  disconnectedCallback() {
    window.removeEventListener('resize', this.debouncedResize);
    window.removeEventListener('click', this.handleWindowClick);
    bodyScrollLock_esm.clearAllBodyScrollLocks();
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
      bodyScrollLock_esm.disableBodyScroll(overlay, { reserveScrollBarGap: true });
    }
    else {
      bodyScrollLock_esm.enableBodyScroll(overlay);
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
      iframeResizer.iframeResizer({
        heightCalculationMethod: 'taggedElement',
        scrolling: true,
        checkOrigin: false,
      }, iFrame);
      const duration = utils.prefersReducedMotion ? 0 : 300;
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
    const duration = utils.prefersReducedMotion ? 0 : 500;
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
    if (!store.state) {
      console.warn(`Internet Breadcrumbs: Could not load config. Please make sure that you included the <swisspost-internet-header></swisspost-internet-header> component.`);
      return null;
    }
    // Config is not loaded yet
    if (!store.state.localizedConfig) {
      return null;
    }
    // Config has loaded but there is no breadcrumbs config
    if (!store.state.localizedConfig.breadcrumb) {
      console.warn(`Internet Header: Current project "${store.state.projectId}" does not include a breadcrumb config. The breadcrumbs will not be rendered. Remove `, document.querySelector('swisspost-internet-breadcrumbs'), `from your markup or configure the breadcrumbs in your portal config to stop seeing this warning.`);
      return null;
    }
    const breadcrumbConfig = store.state.localizedConfig.breadcrumb;
    const items = this.customBreadcrumbItems !== undefined
      ? [...breadcrumbConfig.items, ...this.customBreadcrumbItems]
      : breadcrumbConfig.items;
    return (index.h(index.Host, null, index.h(svgSprite_component.SvgSprite, null), index.h("div", { class: "breadcrumbs" }, index.h("div", { class: "hidden-control-breadcrumbs", "aria-hidden": "true", tabindex: "-1" }, index.h("nav", { class: "breadcrumbs-nav", ref: e => e !== undefined && this.handleControlNavRef(e) }, index.h(BreadcrumbList, { items: items, focusable: false, clickHandler: () => { } }))), index.h("h2", { class: "visually-hidden" }, breadcrumbConfig.a11yLabel), index.h("nav", { ref: e => e !== undefined && this.handleVisibleNavRef(e), class: {
        'breadcrumbs-nav': true,
        'visually-hidden': !this.refsReady,
      } }, index.h(BreadcrumbList, { items: items, dropdownOpen: this.dropdownOpen, isConcatenated: this.isConcatenated, clickHandler: () => this.handleToggleDropdown() })), index.h("div", { class: "breadcrumb-buttons" }, breadcrumbConfig.buttons.map(button => (index.h("button", { class: "btn btn-secondary btn-icon", key: button.text, "aria-expanded": `${!!this.overlayVisible && this.currentOverlay === button.overlay}`, onClick: () => this.toggleOverlay(button.overlay, true) }, index.h(svgIcon_component.SvgIcon, { name: button.svgIcon.name }), index.h("span", { class: "visually-hidden" }, button.text))))), this.overlayVisible && (index.h(OverlayComponent, { overlayRef: e => e !== undefined && this.overlayRef(e), iFrameRef: e => e !== undefined && this.registerIFrameResizer(e), overlay: this.currentOverlay, onClick: () => this.handleToggleOverlay(), onKeyDown: (e) => this.handleKeyDown(e), closeButtonText: store.state.localizedConfig.header.translations.closeButtonText }))), index.h("slot", null)));
  }
  get host() { return index.getElement(this); }
  static get watchers() { return {
    "customItems": ["handleCustomConfigChage"]
  }; }
};
PostInternetBreadcrumbs.style = postInternetBreadcrumbsCss;

exports.swisspost_internet_breadcrumbs = PostInternetBreadcrumbs;

//# sourceMappingURL=swisspost-internet-breadcrumbs.cjs.entry.js.map