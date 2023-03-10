'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const index = require('./index-aff25ac1.js');
const index$1 = require('./index-3216e4c8.js');
const bodyScrollLock_esm = require('./bodyScrollLock.esm-59f17217.js');
const store = require('./store-92939be1.js');
const ui_service = require('./ui.service-db4a8252.js');
const svgSprite_component = require('./svg-sprite.component-34d2b125.js');
const svgIcon_component = require('./svg-icon.component-359b7caa.js');
const if_component = require('./if.component-313f59b8.js');

// https://www.post.ch/api/trackandtrace?id=99.00.306600.01004883
// Track and trace URL
const getTrackAndTraceApiUrl = (id) => {
  const lang = store.state.currentLanguage;
  return `https://www.post.ch/${lang}/api/trackandtrace?id=${encodeURIComponent(id)}`;
};
// Get the redire
const getTrackAndTraceRedirectUrl = (query, { packageTrackingRedirectUrl }) => {
  return packageTrackingRedirectUrl.replace('{trackingNumber}', encodeURIComponent(query));
};
/**
 * Check whether a query is a tracking id
 *
 * @param query User query
 * @returns Boolean
 */
const isParcel = async (query, searchConfig) => {
  const parcelInfo = await getParcelInfo(query, searchConfig);
  return parcelInfo.ok;
};
/**
 * Try to get parcel info from a query that is possibly a tracking id.
 * This is mainly used to check if a search should redirect to track&trace instead of the regular search.
 *
 * @param query User query that is possibly a tracking number
 * @returns Track and trace info
 */
const getParcelInfo = async (query, { redirectPattern }) => {
  const trackingNrPattern = new RegExp(redirectPattern);
  if (trackingNrPattern.test(query)) {
    try {
      const trackAndTraceReqest = await fetch(getTrackAndTraceApiUrl(query));
      const trackAndTraceResult = await trackAndTraceReqest.json();
      return Object.assign(Object.assign({}, trackAndTraceResult), { ok: trackAndTraceResult.ok === 'true' });
    }
    catch (error) {
      console.warn(`Could not check track and trace API due to error: ${error.message}`);
    }
  }
  return { ok: false, timestamp: new Date().toDateString() };
};
/**
 * Get parcel info if query is a parcel or null
 *
 * @param query Parcel id
 * @returns Parcel info and a redirect url or null if not a parcel
 */
const getParcelSuggestion = async (query, searchConfig) => {
  const parcelInfo = await getParcelInfo(query, searchConfig);
  return parcelInfo.ok
    ? Object.assign(Object.assign({}, parcelInfo), { url: getTrackAndTraceRedirectUrl(query, searchConfig) }) : null;
};

/**
 * Construct a search page url from a query
 *
 * @param query Search term
 * @returns
 */
const getSearchRedirectUrl = async (query, searchConfig) => {
  const isTrackTraceId = await isParcel(query, searchConfig);
  return isTrackTraceId
    ? getTrackAndTraceRedirectUrl(query, searchConfig)
    : getSearchPageUrl(query);
};
/**
 * Stitch toghether the search page URL
 *
 * @param query Search term
 * @returns Search page URL
 */
const getSearchPageUrl = (query) => {
  var _a;
  if (((_a = store.state.localizedConfig) === null || _a === void 0 ? void 0 : _a.header.search) === undefined) {
    return;
  }
  const { searchPageUrl } = store.state.localizedConfig.header.search;
  const searchParam = `#q=${encodeURIComponent(query)}`;
  return `${searchPageUrl}${searchParam}&t=AllTab`;
};
/**
 * Equalize the length of two arrays while filling up empty slots up to max. length
 *
 * @param arrayA First array
 * @param arrayB Second array
 * @param maxLength Max. length of result array
 * @returns Array with two resulting arrays
 */
const equalizeArrays = (arrayA, arrayB, maxLength = 8) => {
  const coveoSliced = arrayA.slice(0, Math.max(maxLength / 2, maxLength - arrayB.length));
  return [coveoSliced, arrayB.slice(0, maxLength - coveoSliced.length)];
};

// Coveo constants
const coveo = {
  url: 'https://platform-eu.cloud.coveo.com/rest/search/v2/querySuggest',
  environment: {
    prod: {
      organisation: 'postchagprod6ef4sbet',
      token: 'xx5b629890-23b9-4fbe-b601-0e8719186969',
    },
    int01: {
      organisation: 'postchagnonprods5sq57qt',
      token: 'xx7c0e52ab-3de2-4fbd-b9a7-6ca6abd532b4',
    },
    int02: {
      organisation: 'postchagnonprods5sq57qt',
      token: 'xx7c0e52ab-3de2-4fbd-b9a7-6ca6abd532b4',
    },
    dev01: {
      organisation: 'postchagnonprods5sq57qt',
      token: 'xx7c0e52ab-3de2-4fbd-b9a7-6ca6abd532b4',
    },
    dev02: {
      organisation: 'postchagnonprods5sq57qt',
      token: 'xx7c0e52ab-3de2-4fbd-b9a7-6ca6abd532b4',
    },
    devs1: {
      organisation: 'postchagnonprods5sq57qt',
      token: 'xx7c0e52ab-3de2-4fbd-b9a7-6ca6abd532b4',
    },
    test: {
      organisation: 'postchagnonprods5sq57qt',
      token: 'xx7c0e52ab-3de2-4fbd-b9a7-6ca6abd532b4',
    },
  },
};

/**
 * Get suggestions from coveo
 * https://docs.coveo.com/en/1459/build-a-search-ui/get-query-suggestions#context-object
 *
 * @param query Search term
 * @returns
 */
const getCoveoSuggestions = async (query) => {
  var _a, _b;
  if (((_b = (_a = store.state.localizedConfig) === null || _a === void 0 ? void 0 : _a.header) === null || _b === void 0 ? void 0 : _b.search) === undefined)
    return [];
  const config = store.state.localizedConfig.header.search;
  const { token, organisation } = coveo.environment[store.state.environment];
  const url = `${coveo.url}?q=${query}&locale=${store.state.currentLanguage}&searchHub=${config.searchHubName}&pipeline=${config.searchPipelineName}&organizationId=${organisation}`;
  let coveoCompletions;
  try {
    const coveoResponse = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const coveoJSON = (await coveoResponse.json());
    coveoCompletions = coveoJSON.completions.map(completion => (Object.assign(Object.assign({}, completion), { redirectUrl: getSearchPageUrl(completion.expression) })));
  }
  catch (error) {
    console.error('Connection to coveo failed. Did you add "*.coveo.com" to your connect-src content security policy and tried turning off your adblocker?');
  }
  return coveoCompletions === undefined ? [] : coveoCompletions;
};

// Implement some TOPOS logic into the header search
const gisAPIUrl = 'https://places.post.ch/StandortSuche/StaoCacheService';
const placesUrl = 'https://places.post.ch';
const pois = [
  '001PST',
  '001MP24',
  '001AG-PICK',
  '001PFFIL',
  '001PFST',
  '001BZ',
  '001LZB',
  '001PZ',
  '001LZP',
  '001AL',
];

/**
 * Transform to lowercase, extract accents to separate unicode chars,
 * replace all accent unicode chars so only standard latin chars remain
 * https://stackoverflow.com/questions/990904/remove-accents-diacritics-in-a-string-in-javascript/37511463#37511463
 *
 * @param str Input string
 * @returns
 */
const hardNormalize = (str) => str
  .toLowerCase()
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '');

// Never load types twice
let typesCache = null;
/**
 * Convert Post POI ids to stao cache ids
 * @returns
 */
const convertTypes = async () => {
  if (typesCache === null) {
    try {
      const typesResponse = await fetch(`${gisAPIUrl}/Types?lang=${store.state.currentLanguage}`);
      const typesJSON = (await typesResponse.json());
      typesCache = encodeURIComponent(pois
        .map(poi => {
        const foundType = typesJSON.types.find(type => type.id === poi);
        return foundType === null || foundType === void 0 ? void 0 : foundType.tag;
      })
        .filter(poi => poi !== undefined)
        .join(','));
    }
    catch (error) {
      console.error('Fetching places failed. Did you add "places.post.ch" to your connect-src content security policy?');
      throw error;
    }
  }
  return typesCache;
};
/**
 * Query the Gis API for locations and localities (pois)
 *
 * @param query User input string
 * @returns
 */
const queryPlaces = async (query) => {
  if (query.length === 0) {
    return [];
  }
  const limit = 8;
  const excludeTypes = ['address', 'locality', 'region'];
  const types = await convertTypes();
  const geocoderUrl = `${gisAPIUrl}/Geocode?query=${encodeURIComponent(query)}&lang=${store.state.currentLanguage}&pois=${types}&limit=33`;
  try {
    const geocodeResponse = await fetch(geocoderUrl);
    const geocodeJSON = (await geocodeResponse.json());
    if (!geocodeJSON.ok) {
      throw new Error(geocodeJSON.info);
    }
    return geocodeJSON.locations
      .filter(location => !excludeTypes.includes(location.type))
      .slice(0, limit);
  }
  catch (error) {
    console.error('Fetching places failed. Did you add "places.post.ch" to your connect-src content security policy?');
    throw error;
  }
};
/**
 * Try to highlight place suggestions
 * Limitation: accented chars are not handled by this basic function
 *
 * @param query Search term
 * @param place Name of the suggested place
 * @returns
 */
const highlightPlacesString = (query, place) => {
  if (query === undefined)
    return place;
  // Strip accents from the string
  const reference = hardNormalize(place);
  const q = hardNormalize(query);
  const indexOfQuery = reference.indexOf(q);
  if (indexOfQuery < 0) {
    return place;
  }
  return `${place.substring(0, indexOfQuery)}{${place.substring(indexOfQuery, indexOfQuery + query.length)}}${place.substring(indexOfQuery + query.length, place.length)}`;
};
/**
 * Get the deeplink to any location found via geocoder
 *
 * @param location A location from the Gis API Geocode endpoint
 * @returns
 */
const getPlacesUrl = (location) => {
  let url;
  if (location.id) {
    url = `${placesUrl}/${store.state.currentLanguage}/${location.id}/detail`;
  }
  else {
    url = `${placesUrl}?preselecttext=${encodeURIComponent(location.name)}`;
  }
  return url;
};

const HighlightedText = (props) => {
  var _a;
  const highlightClass = (_a = props.highlightClass) !== null && _a !== void 0 ? _a : 'bold';
  const highlightedString = props.text
    .replace(/{/g, `<span class=${highlightClass}>`)
    .replace(/}/g, '</span>')
    .replace(/[\[\]]/g, '');
  return index.h("span", { innerHTML: highlightedString });
};

const postSearchCss = "@charset \"UTF-8\";/*!\n * Bootstrap Utilities v5.1.3 (https://getbootstrap.com/)\n * Copyright 2011-2021 The Bootstrap Authors\n * Copyright 2011-2021 Twitter, Inc.\n * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)\n\n * The MIT License (MIT)\n\n * Copyright (c) 2011-2020 Twitter, Inc.\n * Copyright (c) 2011-2020 The Bootstrap Authors\n\n * Permission is hereby granted, free of charge, to any person obtaining a copy\n * of this software and associated documentation files (the \"Software\"), to deal\n * in the Software without restriction, including without limitation the rights\n * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell\n * copies of the Software, and to permit persons to whom the Software is\n * furnished to do so, subject to the following conditions:\n\n * The above copyright notice and this permission notice shall be included in\n * all copies or substantial portions of the Software.\n\n * THE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\n * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,\n * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE\n * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER\n * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,\n * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN\n * THE SOFTWARE.\n */.form-label{margin-bottom:0.5rem;color:rgba(var(--post-contrast-color-rgb), 0.8)}.col-form-label{padding-top:calc(0.875rem + 2px);padding-bottom:calc(0.875rem + 2px);margin-bottom:0;font-size:inherit;line-height:1.4;color:rgba(var(--post-contrast-color-rgb), 0.8)}.col-form-label-lg{padding-top:calc(1.25rem + 2px);padding-bottom:calc(1.25rem + 2px);font-size:1.25rem}.col-form-label-sm{padding-top:calc(0.375rem + 2px);padding-bottom:calc(0.375rem + 2px);font-size:0.875rem}.form-text{margin-top:0.25rem;font-size:0.8125rem;color:var(--post-contrast-color)}.form-control{display:block;width:100%;padding:0.875rem 1.125rem;font-size:1rem;font-weight:400;line-height:1.4;color:#000;background-color:#fff;background-clip:padding-box;border:2px solid #666666;-webkit-appearance:none;-moz-appearance:none;appearance:none;border-radius:0;-webkit-transition:border-color 0.15s ease-in-out, -webkit-box-shadow 0.15s ease-in-out;transition:border-color 0.15s ease-in-out, -webkit-box-shadow 0.15s ease-in-out;transition:border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;transition:border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out, -webkit-box-shadow 0.15s ease-in-out}@media (prefers-reduced-motion: reduce){.form-control{-webkit-transition:none;transition:none}}.form-control[type=file]{overflow:hidden}.form-control[type=file]:not(:disabled):not([readonly]){cursor:pointer}.form-control:focus{color:#000;background-color:#fff;border-color:#000;outline:0;-webkit-box-shadow:0 0 0 0.125rem rgba(51, 51, 51, 0.25);box-shadow:0 0 0 0.125rem rgba(51, 51, 51, 0.25)}.form-control::-webkit-date-and-time-value{height:1.4em}.form-control::-webkit-input-placeholder{color:#666666;opacity:1}.form-control::-moz-placeholder{color:#666666;opacity:1}.form-control:-ms-input-placeholder{color:#666666;opacity:1}.form-control::-ms-input-placeholder{color:#666666;opacity:1}.form-control::placeholder{color:#666666;opacity:1}.form-control:disabled{color:#666666;background-color:rgba(var(--post-contrast-color-inverted-rgb), 0.6);border-color:#cccccc;opacity:1}.form-control::-webkit-file-upload-button{padding:0.875rem 1.125rem;margin:-0.875rem -1.125rem;-webkit-margin-end:1.125rem;margin-inline-end:1.125rem;color:#000;background-color:rgba(var(--post-contrast-color-inverted-rgb), 0.6);pointer-events:none;border-color:inherit;border-style:solid;border-width:0;border-inline-end-width:2px;border-radius:0;-webkit-transition:all 250ms cubic-bezier(0.4, 0, 0.2, 1);transition:all 250ms cubic-bezier(0.4, 0, 0.2, 1)}.form-control::file-selector-button{padding:0.875rem 1.125rem;margin:-0.875rem -1.125rem;-webkit-margin-end:1.125rem;margin-inline-end:1.125rem;color:#000;background-color:rgba(var(--post-contrast-color-inverted-rgb), 0.6);pointer-events:none;border-color:inherit;border-style:solid;border-width:0;border-inline-end-width:2px;border-radius:0;-webkit-transition:all 250ms cubic-bezier(0.4, 0, 0.2, 1);transition:all 250ms cubic-bezier(0.4, 0, 0.2, 1)}@media (prefers-reduced-motion: reduce){.form-control::-webkit-file-upload-button{-webkit-transition:none;transition:none}.form-control::file-selector-button{-webkit-transition:none;transition:none}}.form-control:hover:not(:disabled):not([readonly])::-webkit-file-upload-button{background-color:#fff}.form-control:hover:not(:disabled):not([readonly])::file-selector-button{background-color:#fff}.form-control-plaintext{display:block;width:100%;padding:0.875rem 0;margin-bottom:0;line-height:1.4;color:var(--post-contrast-color);background-color:transparent;border:solid transparent;border-width:2px 0}.form-control-plaintext:focus{outline:0}.form-control-plaintext.form-control-sm,.form-control-plaintext.form-control-lg,.form-floating>.form-control-plaintext.form-control,.form-floating>.form-control-plaintext.form-select{padding-right:0;padding-left:0}.form-control-sm{min-height:calc(1.8875rem + 4px);padding:0.375rem 0.875rem;font-size:0.875rem;border-radius:0}.form-control-sm::-webkit-file-upload-button{padding:0.375rem 0.875rem;margin:-0.375rem -0.875rem;-webkit-margin-end:0.875rem;margin-inline-end:0.875rem}.form-control-sm::file-selector-button{padding:0.375rem 0.875rem;margin:-0.375rem -0.875rem;-webkit-margin-end:0.875rem;margin-inline-end:0.875rem}.form-control-lg,.form-floating>.form-control,.form-floating>.form-select{min-height:calc(4.25rem + 4px);padding:1.25rem 1.375rem;font-size:1.25rem;border-radius:0}.form-control-lg::-webkit-file-upload-button,.form-floating>.form-control::-webkit-file-upload-button,.form-floating>.form-select::-webkit-file-upload-button{padding:1.25rem 1.375rem;margin:-1.25rem -1.375rem;-webkit-margin-end:1.375rem;margin-inline-end:1.375rem}.form-control-lg::file-selector-button,.form-floating>.form-control::file-selector-button,.form-floating>.form-select::file-selector-button{padding:1.25rem 1.375rem;margin:-1.25rem -1.375rem;-webkit-margin-end:1.375rem;margin-inline-end:1.375rem}textarea.form-control{min-height:calc(3.15rem + 4px)}textarea.form-control-sm{min-height:calc(1.8875rem + 4px)}textarea.form-control-lg,.form-floating>textarea.form-control,.form-floating>textarea.form-select{min-height:calc(4.25rem + 4px)}.form-control-color{width:3rem;height:calc(3.15rem + 4px);padding:0.875rem}.form-control-color:not(:disabled):not([readonly]){cursor:pointer}.form-control-color::-moz-color-swatch{border:0 !important;border-radius:0}.form-control-color::-webkit-color-swatch{border-radius:0}.form-control-color.form-control-sm{height:calc(1.8875rem + 4px)}.form-control-color.form-control-lg,.form-floating>.form-control-color.form-control,.form-floating>.form-control-color.form-select{height:calc(4.25rem + 4px)}.form-select{display:block;width:100%;padding:0.875rem 3.375rem 0.875rem 1.125rem;-moz-padding-start:calc(1.125rem - 3px);font-size:1rem;font-weight:400;line-height:1.4;color:#000;background-color:#fff;background-image:url(\"data:image/svg+xml,%3Csvg version='1.1' xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32'%3E%3Cpath opacity='1' fill='%23000000' d='M27.6 10.667l-11.6 11.6-11.467-11.6-1.067 1.067 12.533 12.4 12.533-12.4z'%3E%3C/path%3E%3C/svg%3E\");background-repeat:no-repeat;background-position:right 1.125rem center;background-size:14px 14px;border:2px solid #666666;border-radius:0;-webkit-transition:border-color 0.15s ease-in-out, -webkit-box-shadow 0.15s ease-in-out;transition:border-color 0.15s ease-in-out, -webkit-box-shadow 0.15s ease-in-out;transition:border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;transition:border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out, -webkit-box-shadow 0.15s ease-in-out;-webkit-appearance:none;-moz-appearance:none;appearance:none}@media (prefers-reduced-motion: reduce){.form-select{-webkit-transition:none;transition:none}}.form-select:focus{border-color:#000;outline:0;-webkit-box-shadow:0 0 0 0.125rem rgba(51, 51, 51, 0.25);box-shadow:0 0 0 0.125rem rgba(51, 51, 51, 0.25)}.form-select[multiple],.form-select[size]:not([size=\"1\"]){padding-right:1.125rem;background-image:none}.form-select:disabled{color:#666666;background-color:rgba(var(--post-contrast-color-inverted-rgb), 0.6);border-color:#cccccc}.form-select:-moz-focusring{color:transparent;text-shadow:0 0 0 #000}.form-select-sm{padding-top:0.375rem;padding-bottom:0.375rem;padding-left:0.875rem;font-size:0.875rem;border-radius:0}.form-select-lg{padding-top:1.25rem;padding-bottom:1.25rem;padding-left:1.375rem;font-size:1.25rem;border-radius:0}.form-check{display:block;min-height:1.5rem;padding-left:0;margin-bottom:1rem}.form-check .form-check-input{float:left;margin-left:0}.form-check-reverse{padding-right:0;padding-left:0;text-align:right}.form-check-reverse .form-check-input{float:right;margin-right:0;margin-left:0}.form-check-input{width:1.5rem;height:1.5rem;margin-top:-0.05rem;vertical-align:top;background-color:transparent;background-repeat:no-repeat;background-position:center;background-size:contain;border:2px solid #666666;-webkit-appearance:none;-moz-appearance:none;appearance:none;-webkit-print-color-adjust:exact;print-color-adjust:exact}.form-check-input[type=checkbox]{border-radius:0}.form-check-input[type=radio]{border-radius:50%}.form-check-input:active{-webkit-filter:none;filter:none}.form-check-input:focus{border-color:#000;outline:0;-webkit-box-shadow:0 0 0 0.125rem rgba(0, 0, 0, 0.25);box-shadow:0 0 0 0.125rem rgba(0, 0, 0, 0.25)}.form-check-input:checked{background-color:transparent;border-color:#000}.form-check-input:checked[type=checkbox]{background-image:url(\"data:image/svg+xml,%3Csvg version='1.1' xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32'%3E%3Cpath opacity='1' fill='%23000000' d='M12.667 23.6l-7.2-7.067 1.067-1.067 6.133 6.267 12.8-12.933 1.067 1.067z'%3E%3C/path%3E%3C/svg%3E\")}.form-check-input:checked[type=radio]{background-image:url(\"data:image/svg+xml,%3Csvg version='1.1' xmlns='http://www.w3.org/2000/svg' viewBox='-3 -3 6 6'%3E%3Ccircle opacity='1' fill='%23000000' r='2'%3E%3C/circle%3E%3C/svg%3E\")}.form-check-input[type=checkbox]:indeterminate{background-color:transparent;border-color:#000;background-image:url(\"data:image/svg+xml,%3Csvg version='1.1' xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32'%3E%3Cpath opacity='1' fill='%23000000' d='M5.333 16.010l20-0.021 0.001 1.333-20 0.021-0.001-1.333z'%3E%3C/path%3E%3C/svg%3E\")}.form-check-input:disabled{pointer-events:none;-webkit-filter:none;filter:none;opacity:0.5}.form-check-input[disabled]~.form-check-label,.form-check-input:disabled~.form-check-label{cursor:default;opacity:0.5}.form-check-label{color:rgba(var(--post-contrast-color-rgb), 0.8);cursor:pointer}.form-switch{padding-left:0}.form-switch .form-check-input{width:4rem;margin-left:0;background-image:url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='-16 -16 32 32'%3e%3ccircle r='15' stroke='%23666666' stroke-width='2' fill='%23fff'/%3e%3c/svg%3e\");background-position:left center;border-radius:4rem;-webkit-transition:background-position 250ms cubic-bezier(0.4, 0, 0.2, 1), background-color 250ms;transition:background-position 250ms cubic-bezier(0.4, 0, 0.2, 1), background-color 250ms}@media (prefers-reduced-motion: reduce){.form-switch .form-check-input{-webkit-transition:none;transition:none}}.form-switch .form-check-input:focus{background-image:url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='-16 -16 32 32'%3e%3ccircle r='15' stroke='%23000' stroke-width='2' fill='%23fff'/%3e%3c/svg%3e\")}.form-switch .form-check-input:checked{background-position:right center;background-image:url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='-16 -16 32 32'%3e%3ccircle r='15' stroke='%23000' stroke-width='2' fill='%23fff'/%3e%3c/svg%3e\")}.form-switch.form-check-reverse{padding-right:0;padding-left:0}.form-switch.form-check-reverse .form-check-input{margin-right:0;margin-left:0}.form-check-inline{display:inline-block;margin-right:1.5rem}.btn-check{position:absolute;clip:rect(0, 0, 0, 0);pointer-events:none}.btn-check[disabled]+.btn,.btn-check:disabled+.btn{pointer-events:none;-webkit-filter:none;filter:none;opacity:0.4}.form-range{width:100%;height:2.4rem;padding:0;background-color:transparent;-webkit-appearance:none;-moz-appearance:none;appearance:none}.form-range:focus{outline:0}.form-range:focus::-webkit-slider-thumb{-webkit-box-shadow:0 0 0 1px #000, 0 0 0 0.2rem rgba(51, 51, 51, 0.25);box-shadow:0 0 0 1px #000, 0 0 0 0.2rem rgba(51, 51, 51, 0.25)}.form-range:focus::-moz-range-thumb{box-shadow:0 0 0 1px #000, 0 0 0 0.2rem rgba(51, 51, 51, 0.25)}.form-range::-moz-focus-outer{border:0}.form-range::-webkit-slider-thumb{width:2rem;height:2rem;margin-top:-0.9rem;background-color:#fff;border:2px solid #000;border-radius:1rem;-webkit-transition:background-color 0.15s ease-in-out, border-color 0.15s ease-in-out, -webkit-box-shadow 0.15s ease-in-out;transition:background-color 0.15s ease-in-out, border-color 0.15s ease-in-out, -webkit-box-shadow 0.15s ease-in-out;transition:background-color 0.15s ease-in-out, border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;transition:background-color 0.15s ease-in-out, border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out, -webkit-box-shadow 0.15s ease-in-out;-webkit-appearance:none;appearance:none}@media (prefers-reduced-motion: reduce){.form-range::-webkit-slider-thumb{-webkit-transition:none;transition:none}}.form-range::-webkit-slider-thumb:active{background-color:#fff}.form-range::-webkit-slider-runnable-track{width:100%;height:0.2rem;color:transparent;cursor:pointer;background-color:#cccccc;border-color:transparent;border-radius:1rem}.form-range::-moz-range-thumb{width:2rem;height:2rem;background-color:#fff;border:2px solid #000;border-radius:1rem;-moz-transition:background-color 0.15s ease-in-out, border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;transition:background-color 0.15s ease-in-out, border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;-moz-appearance:none;appearance:none}@media (prefers-reduced-motion: reduce){.form-range::-moz-range-thumb{-moz-transition:none;transition:none}}.form-range::-moz-range-thumb:active{background-color:#fff}.form-range::-moz-range-track{width:100%;height:0.2rem;color:transparent;cursor:pointer;background-color:#cccccc;border-color:transparent;border-radius:1rem}.form-range:disabled{pointer-events:none}.form-range:disabled::-webkit-slider-thumb{background-color:#fff}.form-range:disabled::-moz-range-thumb{background-color:#fff}.form-floating{position:relative}.form-floating>.form-control,.form-floating>.form-control-plaintext,.form-floating>.form-select{height:calc(4.25rem + 4px);line-height:1.4}.form-floating>label{position:absolute;top:0;left:0;width:100%;height:100%;padding:1.25rem 1.375rem;overflow:hidden;text-align:start;text-overflow:ellipsis;white-space:nowrap;pointer-events:none;border:2px solid transparent;-webkit-transform-origin:0 0;transform-origin:0 0;-webkit-transition:all 250ms cubic-bezier(0.4, 0, 0.2, 1);transition:all 250ms cubic-bezier(0.4, 0, 0.2, 1)}@media (prefers-reduced-motion: reduce){.form-floating>label{-webkit-transition:none;transition:none}}.form-floating>.form-control,.form-floating>.form-control-plaintext{padding:1.25rem 1.375rem}.form-floating>.form-control::-webkit-input-placeholder,.form-floating>.form-control-plaintext::-webkit-input-placeholder{color:transparent}.form-floating>.form-control::-moz-placeholder,.form-floating>.form-control-plaintext::-moz-placeholder{color:transparent}.form-floating>.form-control:-ms-input-placeholder,.form-floating>.form-control-plaintext:-ms-input-placeholder{color:transparent}.form-floating>.form-control::-ms-input-placeholder,.form-floating>.form-control-plaintext::-ms-input-placeholder{color:transparent}.form-floating>.form-control::placeholder,.form-floating>.form-control-plaintext::placeholder{color:transparent}.form-floating>.form-control:not(:-moz-placeholder-shown),.form-floating>.form-control-plaintext:not(:-moz-placeholder-shown){padding-top:1.5rem;padding-bottom:0}.form-floating>.form-control:not(:-ms-input-placeholder),.form-floating>.form-control-plaintext:not(:-ms-input-placeholder){padding-top:1.5rem;padding-bottom:0}.form-floating>.form-control:focus,.form-floating>.form-control:not(:placeholder-shown),.form-floating>.form-control-plaintext:focus,.form-floating>.form-control-plaintext:not(:placeholder-shown){padding-top:1.5rem;padding-bottom:0}.form-floating>.form-control:-webkit-autofill,.form-floating>.form-control-plaintext:-webkit-autofill{padding-top:1.5rem;padding-bottom:0}.form-floating>.form-select{padding-top:1.5rem;padding-bottom:0}.form-floating>.form-control:not(:-moz-placeholder-shown)~label{opacity:1;transform:scale(0.7647058824)}.form-floating>.form-control:not(:-ms-input-placeholder)~label{opacity:1;transform:scale(0.7647058824)}.form-floating>.form-control:focus~label,.form-floating>.form-control:not(:placeholder-shown)~label,.form-floating>.form-control-plaintext~label,.form-floating>.form-select~label{opacity:1;-webkit-transform:scale(0.7647058824);transform:scale(0.7647058824)}.form-floating>.form-control:-webkit-autofill~label{opacity:1;-webkit-transform:scale(0.7647058824);transform:scale(0.7647058824)}.form-floating>.form-control-plaintext~label{border-width:2px 0}.input-group{position:relative;display:-ms-flexbox;display:flex;-ms-flex-wrap:wrap;flex-wrap:wrap;-ms-flex-align:stretch;align-items:stretch;width:100%}.input-group>.form-control,.input-group>.form-select,.input-group>.form-floating{position:relative;-ms-flex:1 1 auto;flex:1 1 auto;width:1%;min-width:0}.input-group>.form-control:focus,.input-group>.form-select:focus,.input-group>.form-floating:focus-within{z-index:5}.input-group .btn{position:relative;z-index:2}.input-group .btn:focus{z-index:5}.input-group-text{display:-ms-flexbox;display:flex;-ms-flex-align:center;align-items:center;padding:0.875rem 1.125rem;font-size:1rem;font-weight:400;line-height:1.4;color:#000;text-align:center;white-space:nowrap;background-color:rgba(var(--post-contrast-color-inverted-rgb), 0.6);border:2px solid #666666;border-radius:0}.input-group-lg>.form-control,.input-group-lg>.form-select,.input-group-lg>.input-group-text,.input-group-lg>.btn{padding:1.25rem 1.375rem;font-size:1.25rem;border-radius:0}.input-group-sm>.form-control,.input-group-sm>.form-select,.input-group-sm>.input-group-text,.input-group-sm>.btn{padding:0.375rem 0.875rem;font-size:0.875rem;border-radius:0}.input-group-lg>.form-select,.input-group-sm>.form-select{padding-right:4.5rem}.input-group:not(.has-validation)>:not(:last-child):not(.dropdown-toggle):not(.dropdown-menu):not(.form-floating),.input-group:not(.has-validation)>.dropdown-toggle:nth-last-child(n+3),.input-group:not(.has-validation)>.form-floating:not(:last-child)>.form-control,.input-group:not(.has-validation)>.form-floating:not(:last-child)>.form-select{border-top-right-radius:0;border-bottom-right-radius:0}.input-group.has-validation>:nth-last-child(n+3):not(.dropdown-toggle):not(.dropdown-menu):not(.form-floating),.input-group.has-validation>.dropdown-toggle:nth-last-child(n+4),.input-group.has-validation>.form-floating:nth-last-child(n+3)>.form-control,.input-group.has-validation>.form-floating:nth-last-child(n+3)>.form-select{border-top-right-radius:0;border-bottom-right-radius:0}.input-group>:not(:first-child):not(.dropdown-menu):not(.valid-tooltip):not(.valid-feedback):not(.invalid-tooltip):not(.invalid-feedback){margin-left:-2px;border-top-left-radius:0;border-bottom-left-radius:0}.input-group>.form-floating:not(:first-child)>.form-control,.input-group>.form-floating:not(:first-child)>.form-select{border-top-left-radius:0;border-bottom-left-radius:0}.valid-feedback{display:none;width:100%;margin-top:0;font-size:1rem;color:#666666}.valid-tooltip{position:absolute;top:100%;z-index:5;display:none;max-width:100%;padding:0.25rem 0.5rem;margin-top:0.1rem;font-size:1rem;color:#fff;background-color:#666666;border-radius:0}.was-validated :valid~.valid-feedback,.was-validated :valid~.valid-tooltip,.is-valid~.valid-feedback,.is-valid~.valid-tooltip{display:block}.was-validated .form-control:valid,.form-control.is-valid{border-color:#666666;padding-right:3.15rem;background-image:url(\"data:image/svg+xml,%3C%3Fxml version='1.0' encoding='UTF-8'%3F%3E%3Csvg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' width='24pt' height='24pt' viewBox='0 0 24 24' version='1.1'%3E%3Cg id='surface1'%3E%3Cpath style=' stroke:none;fill-rule:nonzero;fill:rgb%280%25,50.588235%25,22.745098%25%29;fill-opacity:1;' d='M 9.5 18.398438 L 3.800781 12.699219 L 5.199219 11.300781 L 9.5 15.597656 L 18.800781 6.300781 L 20.199219 7.699219 Z M 9.5 18.398438 '/%3E%3C/g%3E%3C/svg%3E%0A\");background-repeat:no-repeat;background-position:right calc(0.35em + 0.4375rem) center;background-size:calc(0.7em + 0.875rem) calc(0.7em + 0.875rem)}.was-validated .form-control:valid:focus,.form-control.is-valid:focus{border-color:#666666;-webkit-box-shadow:0 0 0 0.125rem rgba(102, 102, 102, 0.25);box-shadow:0 0 0 0.125rem rgba(102, 102, 102, 0.25)}.was-validated textarea.form-control:valid,textarea.form-control.is-valid{padding-right:3.15rem;background-position:top calc(0.35em + 0.4375rem) right calc(0.35em + 0.4375rem)}.was-validated .form-select:valid,.form-select.is-valid{border-color:#666666}.was-validated .form-select:valid:not([multiple]):not([size]),.was-validated .form-select:valid:not([multiple])[size=\"1\"],.form-select.is-valid:not([multiple]):not([size]),.form-select.is-valid:not([multiple])[size=\"1\"]{padding-right:6.1875rem;background-image:url(\"data:image/svg+xml,%3Csvg version='1.1' xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32'%3E%3Cpath opacity='1' fill='%23000000' d='M27.6 10.667l-11.6 11.6-11.467-11.6-1.067 1.067 12.533 12.4 12.533-12.4z'%3E%3C/path%3E%3C/svg%3E\"), url(\"data:image/svg+xml,%3C%3Fxml version='1.0' encoding='UTF-8'%3F%3E%3Csvg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' width='24pt' height='24pt' viewBox='0 0 24 24' version='1.1'%3E%3Cg id='surface1'%3E%3Cpath style=' stroke:none;fill-rule:nonzero;fill:rgb%280%25,50.588235%25,22.745098%25%29;fill-opacity:1;' d='M 9.5 18.398438 L 3.800781 12.699219 L 5.199219 11.300781 L 9.5 15.597656 L 18.800781 6.300781 L 20.199219 7.699219 Z M 9.5 18.398438 '/%3E%3C/g%3E%3C/svg%3E%0A\");background-position:right 1.125rem center, center right 3.375rem;background-size:14px 14px, calc(0.7em + 0.875rem) calc(0.7em + 0.875rem)}.was-validated .form-select:valid:focus,.form-select.is-valid:focus{border-color:#666666;-webkit-box-shadow:0 0 0 0.125rem rgba(102, 102, 102, 0.25);box-shadow:0 0 0 0.125rem rgba(102, 102, 102, 0.25)}.was-validated .form-control-color:valid,.form-control-color.is-valid{width:6.15rem}.was-validated .form-check-input:valid,.form-check-input.is-valid{border-color:#666666}.was-validated .form-check-input:valid:checked,.form-check-input.is-valid:checked{background-color:#666666}.was-validated .form-check-input:valid:focus,.form-check-input.is-valid:focus{-webkit-box-shadow:0 0 0 0.125rem rgba(102, 102, 102, 0.25);box-shadow:0 0 0 0.125rem rgba(102, 102, 102, 0.25)}.was-validated .form-check-input:valid~.form-check-label,.form-check-input.is-valid~.form-check-label{color:#666666}.form-check-inline .form-check-input~.valid-feedback{margin-left:0.5em}.was-validated .input-group>.form-control:not(:focus):valid,.input-group>.form-control:not(:focus).is-valid,.was-validated .input-group>.form-select:not(:focus):valid,.input-group>.form-select:not(:focus).is-valid,.was-validated .input-group>.form-floating:not(:focus-within):valid,.input-group>.form-floating:not(:focus-within).is-valid{z-index:3}.invalid-feedback{display:none;width:100%;margin-top:0;font-size:1rem;color:#a51728}.invalid-tooltip{position:absolute;top:100%;z-index:5;display:none;max-width:100%;padding:0.25rem 0.5rem;margin-top:0.1rem;font-size:1rem;color:#fff;background-color:#a51728;border-radius:0}.was-validated :invalid~.invalid-feedback,.was-validated :invalid~.invalid-tooltip,.is-invalid~.invalid-feedback,.is-invalid~.invalid-tooltip{display:block}.was-validated .form-control:invalid,.form-control.is-invalid{border-color:#a51728;padding-right:3.15rem;background-image:url(\"data:image/svg+xml,%3C%3Fxml version='1.0' encoding='UTF-8'%3F%3E%3Csvg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' width='24pt' height='24pt' viewBox='0 0 24 24' version='1.1'%3E%3Cg id='surface1'%3E%3Cpath style=' stroke:none;fill-rule:nonzero;fill:rgb%2864.705882%25,9.019608%25,15.686275%25%29;fill-opacity:1;' d='M 11 3 L 13 3 L 13 17 L 11 17 Z M 11 3 '/%3E%3Cpath style=' stroke:none;fill-rule:nonzero;fill:rgb%2864.705882%25,9.019608%25,15.686275%25%29;fill-opacity:1;' d='M 11 19 L 13 19 L 13 21 L 11 21 Z M 11 19 '/%3E%3C/g%3E%3C/svg%3E%0A\");background-repeat:no-repeat;background-position:right calc(0.35em + 0.4375rem) center;background-size:calc(0.7em + 0.875rem) calc(0.7em + 0.875rem)}.was-validated .form-control:invalid:focus,.form-control.is-invalid:focus{border-color:#a51728;-webkit-box-shadow:0 0 0 0.125rem rgba(165, 23, 40, 0.25);box-shadow:0 0 0 0.125rem rgba(165, 23, 40, 0.25)}.was-validated textarea.form-control:invalid,textarea.form-control.is-invalid{padding-right:3.15rem;background-position:top calc(0.35em + 0.4375rem) right calc(0.35em + 0.4375rem)}.was-validated .form-select:invalid,.form-select.is-invalid{border-color:#a51728}.was-validated .form-select:invalid:not([multiple]):not([size]),.was-validated .form-select:invalid:not([multiple])[size=\"1\"],.form-select.is-invalid:not([multiple]):not([size]),.form-select.is-invalid:not([multiple])[size=\"1\"]{padding-right:6.1875rem;background-image:url(\"data:image/svg+xml,%3Csvg version='1.1' xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32'%3E%3Cpath opacity='1' fill='%23000000' d='M27.6 10.667l-11.6 11.6-11.467-11.6-1.067 1.067 12.533 12.4 12.533-12.4z'%3E%3C/path%3E%3C/svg%3E\"), url(\"data:image/svg+xml,%3C%3Fxml version='1.0' encoding='UTF-8'%3F%3E%3Csvg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' width='24pt' height='24pt' viewBox='0 0 24 24' version='1.1'%3E%3Cg id='surface1'%3E%3Cpath style=' stroke:none;fill-rule:nonzero;fill:rgb%2864.705882%25,9.019608%25,15.686275%25%29;fill-opacity:1;' d='M 11 3 L 13 3 L 13 17 L 11 17 Z M 11 3 '/%3E%3Cpath style=' stroke:none;fill-rule:nonzero;fill:rgb%2864.705882%25,9.019608%25,15.686275%25%29;fill-opacity:1;' d='M 11 19 L 13 19 L 13 21 L 11 21 Z M 11 19 '/%3E%3C/g%3E%3C/svg%3E%0A\");background-position:right 1.125rem center, center right 3.375rem;background-size:14px 14px, calc(0.7em + 0.875rem) calc(0.7em + 0.875rem)}.was-validated .form-select:invalid:focus,.form-select.is-invalid:focus{border-color:#a51728;-webkit-box-shadow:0 0 0 0.125rem rgba(165, 23, 40, 0.25);box-shadow:0 0 0 0.125rem rgba(165, 23, 40, 0.25)}.was-validated .form-control-color:invalid,.form-control-color.is-invalid{width:6.15rem}.was-validated .form-check-input:invalid,.form-check-input.is-invalid{border-color:#a51728}.was-validated .form-check-input:invalid:checked,.form-check-input.is-invalid:checked{background-color:#a51728}.was-validated .form-check-input:invalid:focus,.form-check-input.is-invalid:focus{-webkit-box-shadow:0 0 0 0.125rem rgba(165, 23, 40, 0.25);box-shadow:0 0 0 0.125rem rgba(165, 23, 40, 0.25)}.was-validated .form-check-input:invalid~.form-check-label,.form-check-input.is-invalid~.form-check-label{color:#a51728}.form-check-inline .form-check-input~.invalid-feedback{margin-left:0.5em}.was-validated .input-group>.form-control:not(:focus):invalid,.input-group>.form-control:not(:focus).is-invalid,.was-validated .input-group>.form-select:not(:focus):invalid,.input-group>.form-select:not(:focus).is-invalid,.was-validated .input-group>.form-floating:not(:focus-within):invalid,.input-group>.form-floating:not(:focus-within).is-invalid{z-index:4}.form-control-rg{height:calc(2.65rem + 4px);padding:0.625rem 0.875rem;font-size:1rem;line-height:1.4}select.form-control-rg:not([size]):not([multiple]){height:calc(2.65rem + 4px)}.form-control{position:relative}.form-control:disabled{color:#666666}.form-control[readonly]:not(:disabled){border-color:#666666;background-color:#fff}.form-control[type=file]{min-height:calc(3.15rem + 4px)}.form-control[type=file]::-webkit-file-upload-button{-webkit-margin-start:0;margin-inline-start:0;-webkit-margin-end:0;margin-inline-end:0;padding-left:0;padding-right:0;width:0;border:0 none}.form-control[type=file]::file-selector-button{-webkit-margin-start:0;margin-inline-start:0;-webkit-margin-end:0;margin-inline-end:0;padding-left:0;padding-right:0;width:0;border:0 none}.form-control[type=file]::after{display:-ms-flexbox;display:flex;-ms-flex-align:center;align-items:center;content:\"Choose File\";position:absolute;top:0;bottom:0;right:0;z-index:2;padding-left:inherit;padding-right:inherit;background-color:inherit;border-left:inherit;text-align:center}[lang=de] .form-control[type=file]::after{content:\"Datei ausw??hlen\"}[lang=fr] .form-control[type=file]::after{content:\"Choisir un fichier\"}[lang=it] .form-control[type=file]::after{content:\"Scegli file\"}.form-control[type=file].form-control-sm{min-height:calc(2.15rem + 4px)}.form-control[type=file].form-control-rg{min-height:calc(2.65rem + 4px)}.form-control[type=file].form-control-lg{min-height:calc(3.9rem + 4px)}@media (forced-colors: active), (-ms-high-contrast: active), (-ms-high-contrast: white-on-black){.form-control:hover,.form-control:focus{border-color:Highlight}.form-control:hover[type=file]::after,.form-control:focus[type=file]::after{border-color:Highlight}}.form-floating>label{display:block;top:2px;left:2px;margin:0;padding-inline:1.375rem;padding-block:calc(\n      2px + 2.125rem - 0.74375rem\n    );height:4.25rem;border:0;color:#666666;font-size:1.0625rem;max-width:calc(100% - 4px);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;-webkit-transform-origin:1.375rem 0;transform-origin:1.375rem 0;-webkit-transition:all 250ms cubic-bezier(0.4, 0, 0.2, 1), width 0ms linear;transition:all 250ms cubic-bezier(0.4, 0, 0.2, 1), width 0ms linear}.form-floating>.form-control{}.form-floating>.form-control[type=file]::-webkit-file-upload-button{padding-top:1.7rem}.form-floating>.form-control[type=file]::file-selector-button{padding-top:1.7rem}.form-floating>.form-control:not(:-moz-placeholder-shown){padding-top:1.5rem;padding-bottom:0}.form-floating>.form-control:not(:-ms-input-placeholder){padding-top:1.5rem;padding-bottom:0}.form-floating>.form-control:focus,.form-floating>.form-control:not(:placeholder-shown){padding-top:1.5rem;padding-bottom:0}.form-floating>.form-control:not(:-moz-placeholder-shown)[type=file]::file-selector-button{padding-top:1.7rem}.form-floating>.form-control:not(:-ms-input-placeholder)[type=file]::file-selector-button{padding-top:1.7rem}.form-floating>.form-control:focus[type=file]::-webkit-file-upload-button,.form-floating>.form-control:not(:placeholder-shown)[type=file]::-webkit-file-upload-button{padding-top:1.7rem}.form-floating>.form-control:focus[type=file]::file-selector-button,.form-floating>.form-control:not(:placeholder-shown)[type=file]::file-selector-button{padding-top:1.7rem}.form-floating>.form-control:not(:-moz-placeholder-shown)~label{padding-top:0.7rem;max-width:calc(130.7692307692% - 0.8461538462rem - 5.2307692308px);-moz-transition:all 250ms cubic-bezier(0.4, 0, 0.2, 1), width 0ms 250ms cubic-bezier(0.4, 0, 0.2, 1);transition:all 250ms cubic-bezier(0.4, 0, 0.2, 1), width 0ms 250ms cubic-bezier(0.4, 0, 0.2, 1)}.form-floating>.form-control:not(:-ms-input-placeholder)~label{padding-top:0.7rem;max-width:calc(130.7692307692% - 0.8461538462rem - 5.2307692308px);-ms-transition:all 250ms cubic-bezier(0.4, 0, 0.2, 1), width 0ms 250ms cubic-bezier(0.4, 0, 0.2, 1);transition:all 250ms cubic-bezier(0.4, 0, 0.2, 1), width 0ms 250ms cubic-bezier(0.4, 0, 0.2, 1)}.form-floating>.form-control:focus~label,.form-floating>.form-control:not(:placeholder-shown)~label{padding-top:0.7rem;max-width:calc(130.7692307692% - 0.8461538462rem - 5.2307692308px);-webkit-transition:all 250ms cubic-bezier(0.4, 0, 0.2, 1), width 0ms 250ms cubic-bezier(0.4, 0, 0.2, 1);transition:all 250ms cubic-bezier(0.4, 0, 0.2, 1), width 0ms 250ms cubic-bezier(0.4, 0, 0.2, 1)}.form-floating>.form-select{padding-top:1.5rem;padding-bottom:0}.form-floating>.form-select~label{padding-top:0.7rem;max-width:calc(130.7692307692% - 0.8461538462rem - 5.2307692308px);-webkit-transition:all 250ms cubic-bezier(0.4, 0, 0.2, 1), width 0ms 250ms cubic-bezier(0.4, 0, 0.2, 1);transition:all 250ms cubic-bezier(0.4, 0, 0.2, 1), width 0ms 250ms cubic-bezier(0.4, 0, 0.2, 1)}.form-floating>.form-select:empty{padding-top:1.5rem;padding-bottom:0}.form-floating>.form-select:empty~label{padding-top:1.25rem;max-width:calc(100% - 4px);-webkit-transform:none;transform:none}.form-floating>.form-select[multiple]{padding-top:2.25rem;padding-bottom:0;height:auto}.form-floating>.form-select[multiple] option{height:1.4em}.form-floating>.form-select[multiple]~label{padding-top:0.9558823529rem;padding-bottom:0;width:calc(130.7692307692% - 0.8461538462rem - 5.2307692308px - 1.7980769231rem);height:auto;background:#fff}.form-floating>.form-select[multiple]:empty~label{padding-top:1.25rem;padding-bottom:1.25rem;width:calc(100% - 4px - 1.375rem);height:4.25rem}.form-floating>textarea.form-control{padding-top:1.875rem;padding-bottom:1.25rem;height:auto}.form-floating>textarea.form-control~label{padding-bottom:0;width:calc(100% - 4px);max-width:none;height:unset}.form-floating>textarea.form-control:not(:-moz-placeholder-shown){padding-top:1.875rem;padding-bottom:1.25rem}.form-floating>textarea.form-control:not(:-ms-input-placeholder){padding-top:1.875rem;padding-bottom:1.25rem}.form-floating>textarea.form-control:focus,.form-floating>textarea.form-control:not(:placeholder-shown){padding-top:1.875rem;padding-bottom:1.25rem}.form-floating>textarea.form-control:not(:-moz-placeholder-shown)~label{padding-top:0.9558823529rem;width:calc(130.7692307692% - 0.8461538462rem - 5.2307692308px - 1.7980769231rem);max-width:none;background:#fff}.form-floating>textarea.form-control:not(:-ms-input-placeholder)~label{padding-top:0.9558823529rem;width:calc(130.7692307692% - 0.8461538462rem - 5.2307692308px - 1.7980769231rem);max-width:none;background:#fff}.form-floating>textarea.form-control:focus~label,.form-floating>textarea.form-control:not(:placeholder-shown)~label{padding-top:0.9558823529rem;width:calc(130.7692307692% - 0.8461538462rem - 5.2307692308px - 1.7980769231rem);max-width:none;background:#fff}.form-floating>textarea.form-control:is(.is-valid,.is-invalid)~label{width:calc(100% - 4px - 1.375rem - 0.5rem - 2rem)}.form-floating>textarea.form-control:is(.is-valid,.is-invalid):not(:-moz-placeholder-shown)~label{width:calc(130.7692307692% - 0.8461538462rem - 5.2307692308px - 1.7980769231rem - 0.6538461538rem - 2.6153846154rem)}.form-floating>textarea.form-control:is(.is-valid,.is-invalid):not(:-ms-input-placeholder)~label{width:calc(130.7692307692% - 0.8461538462rem - 5.2307692308px - 1.7980769231rem - 0.6538461538rem - 2.6153846154rem)}.form-floating>textarea.form-control:is(.is-valid,.is-invalid):focus~label,.form-floating>textarea.form-control:is(.is-valid,.is-invalid):not(:placeholder-shown)~label{width:calc(130.7692307692% - 0.8461538462rem - 5.2307692308px - 1.7980769231rem - 0.6538461538rem - 2.6153846154rem)}@media (forced-colors: active), (-ms-high-contrast: active), (-ms-high-contrast: white-on-black){.form-floating>input,.form-floating>textarea{}.form-floating>input::-webkit-input-placeholder,.form-floating>textarea::-webkit-input-placeholder{opacity:0}.form-floating>input::-moz-placeholder,.form-floating>textarea::-moz-placeholder{opacity:0}.form-floating>input:-ms-input-placeholder,.form-floating>textarea:-ms-input-placeholder{opacity:0}.form-floating>input::-ms-input-placeholder,.form-floating>textarea::-ms-input-placeholder{opacity:0}.form-floating>input::placeholder,.form-floating>textarea::placeholder{opacity:0}.form-floating>input::input-placeholder,.form-floating>textarea::input-placeholder{opacity:0}}.row{--bs-gutter-x:30px;--bs-gutter-y:0;display:-ms-flexbox;display:flex;-ms-flex-wrap:wrap;flex-wrap:wrap;margin-top:calc(-1 * var(--bs-gutter-y));margin-right:calc(-0.5 * var(--bs-gutter-x));margin-left:calc(-0.5 * var(--bs-gutter-x))}.row>*{-ms-flex-negative:0;flex-shrink:0;width:100%;max-width:100%;padding-right:calc(var(--bs-gutter-x) * 0.5);padding-left:calc(var(--bs-gutter-x) * 0.5);margin-top:var(--bs-gutter-y)}.col{-ms-flex:1 0 0%;flex:1 0 0%}.row-cols-auto>*{-ms-flex:0 0 auto;flex:0 0 auto;width:auto}.row-cols-1>*{-ms-flex:0 0 auto;flex:0 0 auto;width:100%}.row-cols-2>*{-ms-flex:0 0 auto;flex:0 0 auto;width:50%}.row-cols-3>*{-ms-flex:0 0 auto;flex:0 0 auto;width:33.3333333333%}.row-cols-4>*{-ms-flex:0 0 auto;flex:0 0 auto;width:25%}.row-cols-5>*{-ms-flex:0 0 auto;flex:0 0 auto;width:20%}.row-cols-6>*{-ms-flex:0 0 auto;flex:0 0 auto;width:16.6666666667%}.col-auto{-ms-flex:0 0 auto;flex:0 0 auto;width:auto}.col-1{-ms-flex:0 0 auto;flex:0 0 auto;width:8.33333333%}.col-2{-ms-flex:0 0 auto;flex:0 0 auto;width:16.66666667%}.col-3{-ms-flex:0 0 auto;flex:0 0 auto;width:25%}.col-4{-ms-flex:0 0 auto;flex:0 0 auto;width:33.33333333%}.col-5{-ms-flex:0 0 auto;flex:0 0 auto;width:41.66666667%}.col-6{-ms-flex:0 0 auto;flex:0 0 auto;width:50%}.col-7{-ms-flex:0 0 auto;flex:0 0 auto;width:58.33333333%}.col-8{-ms-flex:0 0 auto;flex:0 0 auto;width:66.66666667%}.col-9{-ms-flex:0 0 auto;flex:0 0 auto;width:75%}.col-10{-ms-flex:0 0 auto;flex:0 0 auto;width:83.33333333%}.col-11{-ms-flex:0 0 auto;flex:0 0 auto;width:91.66666667%}.col-12{-ms-flex:0 0 auto;flex:0 0 auto;width:100%}.offset-1{margin-left:8.33333333%}.offset-2{margin-left:16.66666667%}.offset-3{margin-left:25%}.offset-4{margin-left:33.33333333%}.offset-5{margin-left:41.66666667%}.offset-6{margin-left:50%}.offset-7{margin-left:58.33333333%}.offset-8{margin-left:66.66666667%}.offset-9{margin-left:75%}.offset-10{margin-left:83.33333333%}.offset-11{margin-left:91.66666667%}.g-0,.gx-0{--bs-gutter-x:0}.g-0,.gy-0{--bs-gutter-y:0}.g-1,.gx-1{--bs-gutter-x:0.25rem}.g-1,.gy-1{--bs-gutter-y:0.25rem}.g-2,.gx-2{--bs-gutter-x:0.5rem}.g-2,.gy-2{--bs-gutter-y:0.5rem}.g-3,.gx-3{--bs-gutter-x:1rem}.g-3,.gy-3{--bs-gutter-y:1rem}.g-4,.gx-4{--bs-gutter-x:1.5rem}.g-4,.gy-4{--bs-gutter-y:1.5rem}.g-5,.gx-5{--bs-gutter-x:3rem}.g-5,.gy-5{--bs-gutter-y:3rem}@media (min-width: 400px){.col-sm{-ms-flex:1 0 0%;flex:1 0 0%}.row-cols-sm-auto>*{-ms-flex:0 0 auto;flex:0 0 auto;width:auto}.row-cols-sm-1>*{-ms-flex:0 0 auto;flex:0 0 auto;width:100%}.row-cols-sm-2>*{-ms-flex:0 0 auto;flex:0 0 auto;width:50%}.row-cols-sm-3>*{-ms-flex:0 0 auto;flex:0 0 auto;width:33.3333333333%}.row-cols-sm-4>*{-ms-flex:0 0 auto;flex:0 0 auto;width:25%}.row-cols-sm-5>*{-ms-flex:0 0 auto;flex:0 0 auto;width:20%}.row-cols-sm-6>*{-ms-flex:0 0 auto;flex:0 0 auto;width:16.6666666667%}.col-sm-auto{-ms-flex:0 0 auto;flex:0 0 auto;width:auto}.col-sm-1{-ms-flex:0 0 auto;flex:0 0 auto;width:8.33333333%}.col-sm-2{-ms-flex:0 0 auto;flex:0 0 auto;width:16.66666667%}.col-sm-3{-ms-flex:0 0 auto;flex:0 0 auto;width:25%}.col-sm-4{-ms-flex:0 0 auto;flex:0 0 auto;width:33.33333333%}.col-sm-5{-ms-flex:0 0 auto;flex:0 0 auto;width:41.66666667%}.col-sm-6{-ms-flex:0 0 auto;flex:0 0 auto;width:50%}.col-sm-7{-ms-flex:0 0 auto;flex:0 0 auto;width:58.33333333%}.col-sm-8{-ms-flex:0 0 auto;flex:0 0 auto;width:66.66666667%}.col-sm-9{-ms-flex:0 0 auto;flex:0 0 auto;width:75%}.col-sm-10{-ms-flex:0 0 auto;flex:0 0 auto;width:83.33333333%}.col-sm-11{-ms-flex:0 0 auto;flex:0 0 auto;width:91.66666667%}.col-sm-12{-ms-flex:0 0 auto;flex:0 0 auto;width:100%}.offset-sm-0{margin-left:0}.offset-sm-1{margin-left:8.33333333%}.offset-sm-2{margin-left:16.66666667%}.offset-sm-3{margin-left:25%}.offset-sm-4{margin-left:33.33333333%}.offset-sm-5{margin-left:41.66666667%}.offset-sm-6{margin-left:50%}.offset-sm-7{margin-left:58.33333333%}.offset-sm-8{margin-left:66.66666667%}.offset-sm-9{margin-left:75%}.offset-sm-10{margin-left:83.33333333%}.offset-sm-11{margin-left:91.66666667%}.g-sm-0,.gx-sm-0{--bs-gutter-x:0}.g-sm-0,.gy-sm-0{--bs-gutter-y:0}.g-sm-1,.gx-sm-1{--bs-gutter-x:0.25rem}.g-sm-1,.gy-sm-1{--bs-gutter-y:0.25rem}.g-sm-2,.gx-sm-2{--bs-gutter-x:0.5rem}.g-sm-2,.gy-sm-2{--bs-gutter-y:0.5rem}.g-sm-3,.gx-sm-3{--bs-gutter-x:1rem}.g-sm-3,.gy-sm-3{--bs-gutter-y:1rem}.g-sm-4,.gx-sm-4{--bs-gutter-x:1.5rem}.g-sm-4,.gy-sm-4{--bs-gutter-y:1.5rem}.g-sm-5,.gx-sm-5{--bs-gutter-x:3rem}.g-sm-5,.gy-sm-5{--bs-gutter-y:3rem}}@media (min-width: 600px){.col-rg{-ms-flex:1 0 0%;flex:1 0 0%}.row-cols-rg-auto>*{-ms-flex:0 0 auto;flex:0 0 auto;width:auto}.row-cols-rg-1>*{-ms-flex:0 0 auto;flex:0 0 auto;width:100%}.row-cols-rg-2>*{-ms-flex:0 0 auto;flex:0 0 auto;width:50%}.row-cols-rg-3>*{-ms-flex:0 0 auto;flex:0 0 auto;width:33.3333333333%}.row-cols-rg-4>*{-ms-flex:0 0 auto;flex:0 0 auto;width:25%}.row-cols-rg-5>*{-ms-flex:0 0 auto;flex:0 0 auto;width:20%}.row-cols-rg-6>*{-ms-flex:0 0 auto;flex:0 0 auto;width:16.6666666667%}.col-rg-auto{-ms-flex:0 0 auto;flex:0 0 auto;width:auto}.col-rg-1{-ms-flex:0 0 auto;flex:0 0 auto;width:8.33333333%}.col-rg-2{-ms-flex:0 0 auto;flex:0 0 auto;width:16.66666667%}.col-rg-3{-ms-flex:0 0 auto;flex:0 0 auto;width:25%}.col-rg-4{-ms-flex:0 0 auto;flex:0 0 auto;width:33.33333333%}.col-rg-5{-ms-flex:0 0 auto;flex:0 0 auto;width:41.66666667%}.col-rg-6{-ms-flex:0 0 auto;flex:0 0 auto;width:50%}.col-rg-7{-ms-flex:0 0 auto;flex:0 0 auto;width:58.33333333%}.col-rg-8{-ms-flex:0 0 auto;flex:0 0 auto;width:66.66666667%}.col-rg-9{-ms-flex:0 0 auto;flex:0 0 auto;width:75%}.col-rg-10{-ms-flex:0 0 auto;flex:0 0 auto;width:83.33333333%}.col-rg-11{-ms-flex:0 0 auto;flex:0 0 auto;width:91.66666667%}.col-rg-12{-ms-flex:0 0 auto;flex:0 0 auto;width:100%}.offset-rg-0{margin-left:0}.offset-rg-1{margin-left:8.33333333%}.offset-rg-2{margin-left:16.66666667%}.offset-rg-3{margin-left:25%}.offset-rg-4{margin-left:33.33333333%}.offset-rg-5{margin-left:41.66666667%}.offset-rg-6{margin-left:50%}.offset-rg-7{margin-left:58.33333333%}.offset-rg-8{margin-left:66.66666667%}.offset-rg-9{margin-left:75%}.offset-rg-10{margin-left:83.33333333%}.offset-rg-11{margin-left:91.66666667%}.g-rg-0,.gx-rg-0{--bs-gutter-x:0}.g-rg-0,.gy-rg-0{--bs-gutter-y:0}.g-rg-1,.gx-rg-1{--bs-gutter-x:0.25rem}.g-rg-1,.gy-rg-1{--bs-gutter-y:0.25rem}.g-rg-2,.gx-rg-2{--bs-gutter-x:0.5rem}.g-rg-2,.gy-rg-2{--bs-gutter-y:0.5rem}.g-rg-3,.gx-rg-3{--bs-gutter-x:1rem}.g-rg-3,.gy-rg-3{--bs-gutter-y:1rem}.g-rg-4,.gx-rg-4{--bs-gutter-x:1.5rem}.g-rg-4,.gy-rg-4{--bs-gutter-y:1.5rem}.g-rg-5,.gx-rg-5{--bs-gutter-x:3rem}.g-rg-5,.gy-rg-5{--bs-gutter-y:3rem}}@media (min-width: 780px){.col-md{-ms-flex:1 0 0%;flex:1 0 0%}.row-cols-md-auto>*{-ms-flex:0 0 auto;flex:0 0 auto;width:auto}.row-cols-md-1>*{-ms-flex:0 0 auto;flex:0 0 auto;width:100%}.row-cols-md-2>*{-ms-flex:0 0 auto;flex:0 0 auto;width:50%}.row-cols-md-3>*{-ms-flex:0 0 auto;flex:0 0 auto;width:33.3333333333%}.row-cols-md-4>*{-ms-flex:0 0 auto;flex:0 0 auto;width:25%}.row-cols-md-5>*{-ms-flex:0 0 auto;flex:0 0 auto;width:20%}.row-cols-md-6>*{-ms-flex:0 0 auto;flex:0 0 auto;width:16.6666666667%}.col-md-auto{-ms-flex:0 0 auto;flex:0 0 auto;width:auto}.col-md-1{-ms-flex:0 0 auto;flex:0 0 auto;width:8.33333333%}.col-md-2{-ms-flex:0 0 auto;flex:0 0 auto;width:16.66666667%}.col-md-3{-ms-flex:0 0 auto;flex:0 0 auto;width:25%}.col-md-4{-ms-flex:0 0 auto;flex:0 0 auto;width:33.33333333%}.col-md-5{-ms-flex:0 0 auto;flex:0 0 auto;width:41.66666667%}.col-md-6{-ms-flex:0 0 auto;flex:0 0 auto;width:50%}.col-md-7{-ms-flex:0 0 auto;flex:0 0 auto;width:58.33333333%}.col-md-8{-ms-flex:0 0 auto;flex:0 0 auto;width:66.66666667%}.col-md-9{-ms-flex:0 0 auto;flex:0 0 auto;width:75%}.col-md-10{-ms-flex:0 0 auto;flex:0 0 auto;width:83.33333333%}.col-md-11{-ms-flex:0 0 auto;flex:0 0 auto;width:91.66666667%}.col-md-12{-ms-flex:0 0 auto;flex:0 0 auto;width:100%}.offset-md-0{margin-left:0}.offset-md-1{margin-left:8.33333333%}.offset-md-2{margin-left:16.66666667%}.offset-md-3{margin-left:25%}.offset-md-4{margin-left:33.33333333%}.offset-md-5{margin-left:41.66666667%}.offset-md-6{margin-left:50%}.offset-md-7{margin-left:58.33333333%}.offset-md-8{margin-left:66.66666667%}.offset-md-9{margin-left:75%}.offset-md-10{margin-left:83.33333333%}.offset-md-11{margin-left:91.66666667%}.g-md-0,.gx-md-0{--bs-gutter-x:0}.g-md-0,.gy-md-0{--bs-gutter-y:0}.g-md-1,.gx-md-1{--bs-gutter-x:0.25rem}.g-md-1,.gy-md-1{--bs-gutter-y:0.25rem}.g-md-2,.gx-md-2{--bs-gutter-x:0.5rem}.g-md-2,.gy-md-2{--bs-gutter-y:0.5rem}.g-md-3,.gx-md-3{--bs-gutter-x:1rem}.g-md-3,.gy-md-3{--bs-gutter-y:1rem}.g-md-4,.gx-md-4{--bs-gutter-x:1.5rem}.g-md-4,.gy-md-4{--bs-gutter-y:1.5rem}.g-md-5,.gx-md-5{--bs-gutter-x:3rem}.g-md-5,.gy-md-5{--bs-gutter-y:3rem}}@media (min-width: 1024px){.col-lg{-ms-flex:1 0 0%;flex:1 0 0%}.row-cols-lg-auto>*{-ms-flex:0 0 auto;flex:0 0 auto;width:auto}.row-cols-lg-1>*{-ms-flex:0 0 auto;flex:0 0 auto;width:100%}.row-cols-lg-2>*{-ms-flex:0 0 auto;flex:0 0 auto;width:50%}.row-cols-lg-3>*{-ms-flex:0 0 auto;flex:0 0 auto;width:33.3333333333%}.row-cols-lg-4>*{-ms-flex:0 0 auto;flex:0 0 auto;width:25%}.row-cols-lg-5>*{-ms-flex:0 0 auto;flex:0 0 auto;width:20%}.row-cols-lg-6>*{-ms-flex:0 0 auto;flex:0 0 auto;width:16.6666666667%}.col-lg-auto{-ms-flex:0 0 auto;flex:0 0 auto;width:auto}.col-lg-1{-ms-flex:0 0 auto;flex:0 0 auto;width:8.33333333%}.col-lg-2{-ms-flex:0 0 auto;flex:0 0 auto;width:16.66666667%}.col-lg-3{-ms-flex:0 0 auto;flex:0 0 auto;width:25%}.col-lg-4{-ms-flex:0 0 auto;flex:0 0 auto;width:33.33333333%}.col-lg-5{-ms-flex:0 0 auto;flex:0 0 auto;width:41.66666667%}.col-lg-6{-ms-flex:0 0 auto;flex:0 0 auto;width:50%}.col-lg-7{-ms-flex:0 0 auto;flex:0 0 auto;width:58.33333333%}.col-lg-8{-ms-flex:0 0 auto;flex:0 0 auto;width:66.66666667%}.col-lg-9{-ms-flex:0 0 auto;flex:0 0 auto;width:75%}.col-lg-10{-ms-flex:0 0 auto;flex:0 0 auto;width:83.33333333%}.col-lg-11{-ms-flex:0 0 auto;flex:0 0 auto;width:91.66666667%}.col-lg-12{-ms-flex:0 0 auto;flex:0 0 auto;width:100%}.offset-lg-0{margin-left:0}.offset-lg-1{margin-left:8.33333333%}.offset-lg-2{margin-left:16.66666667%}.offset-lg-3{margin-left:25%}.offset-lg-4{margin-left:33.33333333%}.offset-lg-5{margin-left:41.66666667%}.offset-lg-6{margin-left:50%}.offset-lg-7{margin-left:58.33333333%}.offset-lg-8{margin-left:66.66666667%}.offset-lg-9{margin-left:75%}.offset-lg-10{margin-left:83.33333333%}.offset-lg-11{margin-left:91.66666667%}.g-lg-0,.gx-lg-0{--bs-gutter-x:0}.g-lg-0,.gy-lg-0{--bs-gutter-y:0}.g-lg-1,.gx-lg-1{--bs-gutter-x:0.25rem}.g-lg-1,.gy-lg-1{--bs-gutter-y:0.25rem}.g-lg-2,.gx-lg-2{--bs-gutter-x:0.5rem}.g-lg-2,.gy-lg-2{--bs-gutter-y:0.5rem}.g-lg-3,.gx-lg-3{--bs-gutter-x:1rem}.g-lg-3,.gy-lg-3{--bs-gutter-y:1rem}.g-lg-4,.gx-lg-4{--bs-gutter-x:1.5rem}.g-lg-4,.gy-lg-4{--bs-gutter-y:1.5rem}.g-lg-5,.gx-lg-5{--bs-gutter-x:3rem}.g-lg-5,.gy-lg-5{--bs-gutter-y:3rem}}@media (min-width: 1280px){.col-xl{-ms-flex:1 0 0%;flex:1 0 0%}.row-cols-xl-auto>*{-ms-flex:0 0 auto;flex:0 0 auto;width:auto}.row-cols-xl-1>*{-ms-flex:0 0 auto;flex:0 0 auto;width:100%}.row-cols-xl-2>*{-ms-flex:0 0 auto;flex:0 0 auto;width:50%}.row-cols-xl-3>*{-ms-flex:0 0 auto;flex:0 0 auto;width:33.3333333333%}.row-cols-xl-4>*{-ms-flex:0 0 auto;flex:0 0 auto;width:25%}.row-cols-xl-5>*{-ms-flex:0 0 auto;flex:0 0 auto;width:20%}.row-cols-xl-6>*{-ms-flex:0 0 auto;flex:0 0 auto;width:16.6666666667%}.col-xl-auto{-ms-flex:0 0 auto;flex:0 0 auto;width:auto}.col-xl-1{-ms-flex:0 0 auto;flex:0 0 auto;width:8.33333333%}.col-xl-2{-ms-flex:0 0 auto;flex:0 0 auto;width:16.66666667%}.col-xl-3{-ms-flex:0 0 auto;flex:0 0 auto;width:25%}.col-xl-4{-ms-flex:0 0 auto;flex:0 0 auto;width:33.33333333%}.col-xl-5{-ms-flex:0 0 auto;flex:0 0 auto;width:41.66666667%}.col-xl-6{-ms-flex:0 0 auto;flex:0 0 auto;width:50%}.col-xl-7{-ms-flex:0 0 auto;flex:0 0 auto;width:58.33333333%}.col-xl-8{-ms-flex:0 0 auto;flex:0 0 auto;width:66.66666667%}.col-xl-9{-ms-flex:0 0 auto;flex:0 0 auto;width:75%}.col-xl-10{-ms-flex:0 0 auto;flex:0 0 auto;width:83.33333333%}.col-xl-11{-ms-flex:0 0 auto;flex:0 0 auto;width:91.66666667%}.col-xl-12{-ms-flex:0 0 auto;flex:0 0 auto;width:100%}.offset-xl-0{margin-left:0}.offset-xl-1{margin-left:8.33333333%}.offset-xl-2{margin-left:16.66666667%}.offset-xl-3{margin-left:25%}.offset-xl-4{margin-left:33.33333333%}.offset-xl-5{margin-left:41.66666667%}.offset-xl-6{margin-left:50%}.offset-xl-7{margin-left:58.33333333%}.offset-xl-8{margin-left:66.66666667%}.offset-xl-9{margin-left:75%}.offset-xl-10{margin-left:83.33333333%}.offset-xl-11{margin-left:91.66666667%}.g-xl-0,.gx-xl-0{--bs-gutter-x:0}.g-xl-0,.gy-xl-0{--bs-gutter-y:0}.g-xl-1,.gx-xl-1{--bs-gutter-x:0.25rem}.g-xl-1,.gy-xl-1{--bs-gutter-y:0.25rem}.g-xl-2,.gx-xl-2{--bs-gutter-x:0.5rem}.g-xl-2,.gy-xl-2{--bs-gutter-y:0.5rem}.g-xl-3,.gx-xl-3{--bs-gutter-x:1rem}.g-xl-3,.gy-xl-3{--bs-gutter-y:1rem}.g-xl-4,.gx-xl-4{--bs-gutter-x:1.5rem}.g-xl-4,.gy-xl-4{--bs-gutter-y:1.5rem}.g-xl-5,.gx-xl-5{--bs-gutter-x:3rem}.g-xl-5,.gy-xl-5{--bs-gutter-y:3rem}}@media (min-width: 1441px){.col-xxl{-ms-flex:1 0 0%;flex:1 0 0%}.row-cols-xxl-auto>*{-ms-flex:0 0 auto;flex:0 0 auto;width:auto}.row-cols-xxl-1>*{-ms-flex:0 0 auto;flex:0 0 auto;width:100%}.row-cols-xxl-2>*{-ms-flex:0 0 auto;flex:0 0 auto;width:50%}.row-cols-xxl-3>*{-ms-flex:0 0 auto;flex:0 0 auto;width:33.3333333333%}.row-cols-xxl-4>*{-ms-flex:0 0 auto;flex:0 0 auto;width:25%}.row-cols-xxl-5>*{-ms-flex:0 0 auto;flex:0 0 auto;width:20%}.row-cols-xxl-6>*{-ms-flex:0 0 auto;flex:0 0 auto;width:16.6666666667%}.col-xxl-auto{-ms-flex:0 0 auto;flex:0 0 auto;width:auto}.col-xxl-1{-ms-flex:0 0 auto;flex:0 0 auto;width:8.33333333%}.col-xxl-2{-ms-flex:0 0 auto;flex:0 0 auto;width:16.66666667%}.col-xxl-3{-ms-flex:0 0 auto;flex:0 0 auto;width:25%}.col-xxl-4{-ms-flex:0 0 auto;flex:0 0 auto;width:33.33333333%}.col-xxl-5{-ms-flex:0 0 auto;flex:0 0 auto;width:41.66666667%}.col-xxl-6{-ms-flex:0 0 auto;flex:0 0 auto;width:50%}.col-xxl-7{-ms-flex:0 0 auto;flex:0 0 auto;width:58.33333333%}.col-xxl-8{-ms-flex:0 0 auto;flex:0 0 auto;width:66.66666667%}.col-xxl-9{-ms-flex:0 0 auto;flex:0 0 auto;width:75%}.col-xxl-10{-ms-flex:0 0 auto;flex:0 0 auto;width:83.33333333%}.col-xxl-11{-ms-flex:0 0 auto;flex:0 0 auto;width:91.66666667%}.col-xxl-12{-ms-flex:0 0 auto;flex:0 0 auto;width:100%}.offset-xxl-0{margin-left:0}.offset-xxl-1{margin-left:8.33333333%}.offset-xxl-2{margin-left:16.66666667%}.offset-xxl-3{margin-left:25%}.offset-xxl-4{margin-left:33.33333333%}.offset-xxl-5{margin-left:41.66666667%}.offset-xxl-6{margin-left:50%}.offset-xxl-7{margin-left:58.33333333%}.offset-xxl-8{margin-left:66.66666667%}.offset-xxl-9{margin-left:75%}.offset-xxl-10{margin-left:83.33333333%}.offset-xxl-11{margin-left:91.66666667%}.g-xxl-0,.gx-xxl-0{--bs-gutter-x:0}.g-xxl-0,.gy-xxl-0{--bs-gutter-y:0}.g-xxl-1,.gx-xxl-1{--bs-gutter-x:0.25rem}.g-xxl-1,.gy-xxl-1{--bs-gutter-y:0.25rem}.g-xxl-2,.gx-xxl-2{--bs-gutter-x:0.5rem}.g-xxl-2,.gy-xxl-2{--bs-gutter-y:0.5rem}.g-xxl-3,.gx-xxl-3{--bs-gutter-x:1rem}.g-xxl-3,.gy-xxl-3{--bs-gutter-y:1rem}.g-xxl-4,.gx-xxl-4{--bs-gutter-x:1.5rem}.g-xxl-4,.gy-xxl-4{--bs-gutter-y:1.5rem}.g-xxl-5,.gx-xxl-5{--bs-gutter-x:3rem}.g-xxl-5,.gy-xxl-5{--bs-gutter-y:3rem}}.container,.container-fluid,.container-xs{--bs-gutter-x:30px;--bs-gutter-y:0;width:100%;padding-right:calc(var(--bs-gutter-x) * 0.5);padding-left:calc(var(--bs-gutter-x) * 0.5);margin-right:auto;margin-left:auto}.container{max-width:1440px}.vertical-gutters{margin-bottom:-30px}.vertical-gutters>.col,.vertical-gutters>[class*=col-]{padding-bottom:30px}.row.border-gutters{margin-right:-1px;margin-bottom:-1px;margin-left:0}.row.border-gutters>.col,.row.border-gutters>[class*=col-]{padding-right:1px;padding-bottom:1px;padding-left:0}.container{padding-right:12px;padding-left:12px}.container-reset{margin-right:-12px;margin-left:-12px}.container-reset-left{margin-left:-12px}.container-reset-right{margin-right:-12px}@media (max-width: 399.98px){.container-fluid-xs{padding-right:1rem;padding-left:1rem}}@media (min-width: 400px){.container{padding-right:16px;padding-left:16px}}@media (min-width: 400px){.container-reset{margin-right:-16px;margin-left:-16px}}@media (min-width: 400px){.container-reset-left{margin-left:-16px}}@media (min-width: 400px){.container-reset-right{margin-right:-16px}}@media (min-width: 400px) and (max-width: 599.98px){.container-fluid-sm{padding-right:1rem;padding-left:1rem}}@media (min-width: 600px){.container{padding-right:32px;padding-left:32px}}@media (min-width: 600px){.container-reset{margin-right:-32px;margin-left:-32px}}@media (min-width: 600px){.container-reset-left{margin-left:-32px}}@media (min-width: 600px){.container-reset-right{margin-right:-32px}}@media (min-width: 600px) and (max-width: 779.98px){.container-fluid-rg{padding-right:1rem;padding-left:1rem}}@media (min-width: 780px) and (max-width: 1023.98px){.container-fluid-md{padding-right:1rem;padding-left:1rem}}@media (min-width: 1024px){.container{padding-right:40px;padding-left:40px}}@media (min-width: 1024px){.container-reset{margin-right:-40px;margin-left:-40px}}@media (min-width: 1024px){.container-reset-left{margin-left:-40px}}@media (min-width: 1024px){.container-reset-right{margin-right:-40px}}@media (min-width: 1024px) and (max-width: 1279.98px){.container-fluid-lg{padding-right:1rem;padding-left:1rem}}@media (min-width: 1280px){.container{padding-right:128px;padding-left:128px}}@media (min-width: 1280px){.container-reset{margin-right:-128px;margin-left:-128px}}@media (min-width: 1280px){.container-reset-left{margin-left:-128px}}@media (min-width: 1280px){.container-reset-right{margin-right:-128px}}@media (min-width: 1280px) and (max-width: 1440.98px){.container-fluid-xl{padding-right:1rem;padding-left:1rem}}@media (min-width: 1441px){.container-fluid-xxl{padding-right:1rem;padding-left:1rem}}*,:host,*::before,*::after{-webkit-box-sizing:border-box;box-sizing:border-box}button{font:inherit;padding:0}img,svg{max-width:100%;max-height:100%}@media (forced-colors: active){svg{color:white}}.no-list{list-style:none;padding-left:0;margin-top:0;margin-bottom:0}.btn-blank{background-color:transparent;border:none;border-radius:0;padding:0}.search-button,.nav-link{text-decoration:none;color:rgba(0, 0, 0, 0.8);-webkit-transition:color 200ms;transition:color 200ms;background-color:transparent;border-radius:0;-webkit-box-shadow:none;box-shadow:none;border:0;margin:0;display:-ms-flexbox;display:flex;-ms-flex-align:center;align-items:center;gap:0.5rem}.search-button:hover,.nav-link:hover,.search-button:focus,.nav-link:focus{color:black}.search-button>svg,.nav-link>svg{width:1.4em;height:1.4em;-ms-flex-negative:0;flex-shrink:0}.search-button>span,.nav-link>span{-ms-flex-negative:1;flex-shrink:1}.box>*:first-child{margin-top:0}.box>*:last-child{margin-bottom:0}.mirrored{-webkit-transform:scaleX(-1);transform:scaleX(-1)}.rotate-270{-webkit-transform:rotate(270deg);transform:rotate(270deg)}.bold{font-weight:700}.light{font-weight:300}.d-flex{display:-ms-flexbox;display:flex}.d-inline-flex{display:-ms-inline-flexbox;display:inline-flex}.align-items-center{-ms-flex-align:center;align-items:center}@media (min-width: 1441px){.wide-container{margin:0 auto;max-width:1440px}}@media (max-width: 599.98px){.container{padding-right:16px;padding-left:16px}}@media (min-width: 600px) and (max-width: 1023.98px){.container{padding-right:32px;padding-left:32px}}@media (min-width: 1024px){.container{padding-right:40px;padding-left:40px}}.visually-hidden{position:absolute;width:1px;height:1px;border:0;padding:0;margin:-1px;overflow:hidden;clip:rect(0 0 0 0)}@media (max-width: -0.02px){.hidden-xs{display:none}}@media (max-width: 399.98px){.hidden-sm{display:none}}@media (max-width: 599.98px){.hidden-rg{display:none}}@media (max-width: 779.98px){.hidden-md{display:none}}@media (max-width: 1023.98px){.hidden-lg{display:none}}@media (max-width: 1279.98px){.hidden-xl{display:none}}@media (max-width: 1440.98px){.hidden-xxl{display:none}}:host{display:block}.search,:host{height:100%}.search-button{height:100%;display:-ms-flexbox;display:flex;-ms-flex-align:center;align-items:center;cursor:pointer;padding-right:calc(1rem - 1px);padding-left:calc(1rem - 1px)}@media (min-width: 1024px){.search-button{padding:0 calc(1.125rem - 1px)}}@media (min-width: 1280px){.search-button{padding:0 calc(1.5rem - 1px)}}.search-button svg{width:1.5rem;height:1.5rem}@media (min-width: 600px) and (max-width: 1023.98px){.search-button .visually-hidden{position:static;width:auto;height:auto;margin:auto;overflow:visible;clip:auto;visibility:visible;font-weight:300;margin-right:0.5rem;cursor:pointer}}.flyout{position:absolute;top:100%;left:0;width:100%;background:white;overflow:auto;-ms-scroll-chaining:none;overscroll-behavior:contain;padding-top:3.25rem;padding-bottom:3.25rem;z-index:-1;-webkit-transform:translateY(-100%);transform:translateY(-100%);-webkit-transition:-webkit-transform 0.35s, -webkit-box-shadow 0.35s;transition:-webkit-transform 0.35s, -webkit-box-shadow 0.35s;transition:transform 0.35s, box-shadow 0.35s;transition:transform 0.35s, box-shadow 0.35s, -webkit-transform 0.35s, -webkit-box-shadow 0.35s}@media (prefers-reduced-motion: reduce){.flyout{-webkit-transition:none;transition:none}}@media (min-width: 1024px){.flyout{max-height:calc(100vh - var(--header-height) - var(--meta-header-height) - 1px);-webkit-box-shadow:0 0 1px 0 rgba(0, 0, 0, 0.4);box-shadow:0 0 1px 0 rgba(0, 0, 0, 0.4)}.flyout.open{-webkit-box-shadow:0 0 8px 0 rgba(0, 0, 0, 0.4);box-shadow:0 0 8px 0 rgba(0, 0, 0, 0.4)}}@media (max-width: 1023.98px){.flyout{height:calc(100vh - var(--header-height) - 1px)}}.flyout.open{-webkit-transform:translateY(0);transform:translateY(0)}.start-search-button{position:absolute;top:0;right:0;height:100%;padding-right:1rem;padding-left:1rem;display:-ms-flexbox;display:flex;-ms-flex-align:center;align-items:center;cursor:pointer}.start-search-button svg{width:1.5rem;height:1.5rem}.suggestions{margin:1.5rem 0}.suggestions a{padding:0.75rem 1rem}.suggestions a:hover,.suggestions a:focus,.suggestions a.selected{background:#f4f3f1}.suggestions a.parcel-suggestion{-ms-flex-wrap:wrap;flex-wrap:wrap}.search-recommendation__icon{height:1.5em;width:1.5em}";

const PostSearch = class {
  constructor(hostRef) {
    index.registerInstance(this, hostRef);
    this.dropdownToggled = index.createEvent(this, "dropdownToggled", 7);
    this.searchDropdownOpen = false;
    this.coveoSuggestions = [];
    this.placeSuggestions = [];
    this.parcelSuggestion = null;
  }
  connectedCallback() {
    this.throttledResize = index$1.throttle(300, () => this.handleResize());
    window.addEventListener('resize', this.throttledResize, { passive: true });
  }
  disconnectedCallback() {
    window.removeEventListener('resize', this.throttledResize);
    bodyScrollLock_esm.clearAllBodyScrollLocks();
  }
  componentWillUpdate() {
    // Check if search flyout got set to close
    if (this.searchFlyout && !this.searchDropdownOpen) {
      this.searchFlyout.classList.remove('open');
      // Check if element has transition applied and whether user prefers to see animations or not
      if (ui_service.elementHasTransition(this.searchFlyout, 'transform') && !ui_service.userPrefersReducedMotion()) {
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
      bodyScrollLock_esm.disableBodyScroll(this.searchFlyout);
    }
    else {
      bodyScrollLock_esm.enableBodyScroll(this.searchFlyout);
    }
  }
  /**
   * Fetch suggestions from all available sources
   */
  async handleSearchInput() {
    var _a;
    if (this.searchBox === undefined || ((_a = store.state.localizedConfig) === null || _a === void 0 ? void 0 : _a.header.search) === undefined) {
      return;
    }
    const query = this.searchBox.value.trim();
    const [placeSuggestions, coveoSuggestions, trackAndTraceInfo] = await Promise.all([
      queryPlaces(query),
      getCoveoSuggestions(query),
      getParcelSuggestion(query, store.state.localizedConfig.header.search),
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
    if (this.searchBox && ((_a = store.state.localizedConfig) === null || _a === void 0 ? void 0 : _a.header.search)) {
      const redirectUrl = await getSearchRedirectUrl(this.searchBox.value.trim(), store.state.localizedConfig.header.search);
      if (!redirectUrl)
        return;
      window.location.href = redirectUrl;
    }
  }
  render() {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p;
    if (((_a = store.state.localizedConfig) === null || _a === void 0 ? void 0 : _a.header) === undefined) {
      return;
    }
    const { translations, search } = store.state.localizedConfig.header;
    const showPortalRecommendations = ((_b = this.searchBox) === null || _b === void 0 ? void 0 : _b.value) === '' && ((_c = search.searchRecommendations) === null || _c === void 0 ? void 0 : _c.links.length) > 0;
    return (index.h(index.Host, null, index.h(svgSprite_component.SvgSprite, null), index.h("div", { class: "search" }, index.h("button", { id: "post-internet-header-search-button", class: "search-button", type: "button", "aria-expanded": `${this.searchDropdownOpen}`, onClick: e => this.toggleDropdown(e) }, index.h("span", { class: "visually-hidden" }, this.searchDropdownOpen
      ? translations.searchToggleExpanded
      : translations.searchToggle), index.h(svgIcon_component.SvgIcon, { name: this.searchDropdownOpen ? 'pi-close' : 'pi-search' })), index.h(if_component.If, { condition: this.searchDropdownOpen }, index.h("div", { class: "flyout", ref: e => (this.searchFlyout = e) }, index.h("div", { class: "container box" }, index.h("div", { class: "row" }, index.h("div", { class: "col-xs-12 col-md-10 col-lg-8" }, index.h("div", { class: "form-group form-floating" }, index.h("input", { type: "text", id: "searchBox", class: "form-control form-control-lg", placeholder: translations.flyoutSearchBoxFloatingLabel, autocomplete: "off", ref: el => (this.searchBox = el), onInput: () => this.handleSearchInput(), onKeyDown: e => this.handleKeyDown(e) }), index.h("label", { htmlFor: "searchBox" }, translations.flyoutSearchBoxFloatingLabel), index.h("button", { onClick: () => this.startSearch(), class: "nav-link start-search-button" }, index.h("span", { class: "visually-hidden" }, translations.searchSubmit), index.h(svgIcon_component.SvgIcon, { name: "pi-search" }))), showPortalRecommendations && (index.h("h2", { class: "bold" }, search.searchRecommendations.title)), index.h("ul", { class: "suggestions no-list", onMouseLeave: () => this.handleMouseLeaveSuggestions() }, showPortalRecommendations &&
      search.searchRecommendations.links.map(recommendation => (index.h("li", { key: recommendation.href }, index.h("a", { class: "nav-link search-recommendation", href: new URL(recommendation.href, 'https://post.ch').href, "data-suggestion-text": recommendation.label, onMouseEnter: e => this.handleMouseEnterSuggestion(e) }, index.h("span", { class: "search-recommendation__icon", innerHTML: recommendation.inlineSvg }), index.h("span", null, recommendation.label))))), this.parcelSuggestion && this.parcelSuggestion.ok && (index.h("li", null, index.h("a", { class: "nav-link parcel-suggestion", href: this.parcelSuggestion.url, "data-suggestion-text": (_d = this.searchBox) === null || _d === void 0 ? void 0 : _d.value, onMouseEnter: e => this.handleMouseEnterSuggestion(e) }, index.h(svgIcon_component.SvgIcon, { name: "pi-letter-parcel" }), index.h("span", { class: "bold" }, (_f = (_e = this.parcelSuggestion) === null || _e === void 0 ? void 0 : _e.sending) === null || _f === void 0 ? void 0 :
      _f.id, ":\u00A0"), index.h("span", null, (_h = (_g = this.parcelSuggestion) === null || _g === void 0 ? void 0 : _g.sending) === null || _h === void 0 ? void 0 :
      _h.product, ",", ' ', (_k = (_j = this.parcelSuggestion) === null || _j === void 0 ? void 0 : _j.sending) === null || _k === void 0 ? void 0 :
      _k.recipient.zipcode, ' ', (_m = (_l = this.parcelSuggestion) === null || _l === void 0 ? void 0 : _l.sending) === null || _m === void 0 ? void 0 :
      _m.recipient.city, ",", ' ', (_p = (_o = this.parcelSuggestion) === null || _o === void 0 ? void 0 : _o.sending) === null || _p === void 0 ? void 0 :
      _p.state)))), !showPortalRecommendations &&
      this.coveoSuggestions &&
      this.coveoSuggestions.map(suggestion => (index.h("li", { key: suggestion.objectId }, index.h("a", { class: "nav-link", href: suggestion.redirectUrl, "data-suggestion-text": suggestion.expression, onMouseEnter: e => this.handleMouseEnterSuggestion(e) }, index.h(svgIcon_component.SvgIcon, { name: "pi-search" }), index.h(HighlightedText, { text: suggestion.highlighted }))))), !showPortalRecommendations &&
      this.placeSuggestions &&
      this.placeSuggestions.map(suggestion => {
        var _a, _b;
        return (index.h("li", { key: suggestion.id }, index.h("a", { class: "nav-link", href: getPlacesUrl(suggestion), "data-suggestion-text": suggestion.name, onMouseEnter: e => this.handleMouseEnterSuggestion(e) }, index.h(svgIcon_component.SvgIcon, { name: "pi-place" }), index.h(HighlightedText, { text: highlightPlacesString((_b = (_a = this.searchBox) === null || _a === void 0 ? void 0 : _a.value) === null || _b === void 0 ? void 0 : _b.trim(), suggestion.name) }))));
      }))))))))));
  }
  get host() { return index.getElement(this); }
};
PostSearch.style = postSearchCss;

exports.post_search = PostSearch;

//# sourceMappingURL=post-search.cjs.entry.js.map