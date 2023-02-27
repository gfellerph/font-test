'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const index = require('./index-aff25ac1.js');
const index$1 = require('./index-3216e4c8.js');
const language_service = require('./language.service-df3821ea.js');
const utils = require('./utils-b6014257.js');
const store = require('./store-92939be1.js');
const svgSprite_component = require('./svg-sprite.component-34d2b125.js');
const svgIcon_component = require('./svg-icon.component-359b7caa.js');
const if_component = require('./if.component-313f59b8.js');

/**
 * Activate the current route based on the config and the match mode
 * @param config Main Navigation Config
 * @param activeRouteProp Match mode
 * @returns Modified Main Navigation Config
 */
const markActiveRoute = (config, activeRouteProp) => {
  // Don't highlight any route
  if (activeRouteProp === false) {
    return config;
  }
  // Set compare URL and check if activeRouteProp is valid
  let compareUrl;
  config = resetOverrideConfig(config);
  if (activeRouteProp === 'auto' || activeRouteProp === 'exact') {
    // Check if an active route is already configured, set override to that and return
    if (hasActivePortalRoute(config)) {
      return resetActiveStateToPortalConfig(config);
    }
    compareUrl = new URL(window.location.href);
  }
  else {
    try {
      compareUrl = new URL(activeRouteProp, document.location.origin);
    }
    catch (error) {
      console.warn(`Active Route: ${activeRouteProp} is not a valid URL. Navigation highlighting has been disabled.`);
      return config;
    }
  }
  const scoreList = compileScoreList(config, compareUrl, activeRouteProp);
  if (scoreList.length === 0) {
    // No match found or already active links defined
    return config;
  }
  const winnerPair = scoreList[0];
  winnerPair.main.isActiveOverride = true;
  if (winnerPair.sub)
    winnerPair.sub.isActiveOverride = true;
  return config;
};
/**
 * Check if the portal config set any active route
 * @param config Main navigation config
 * @returns True if portal set any route as active
 */
const hasActivePortalRoute = (config) => {
  return config.filter(nav => nav.isActive).length > 0;
};
const resetActiveStateToPortalConfig = (config) => {
  return config.map(nav => (Object.assign(Object.assign({}, nav), { isActiveOverride: nav.isActive, flyout: nav.flyout.map(flyout => (Object.assign(Object.assign({}, flyout), { linkList: flyout.linkList.map(link => (Object.assign(Object.assign({}, link), { isActiveOverride: link.isActive }))) }))) })));
};
const resetOverrideConfig = (config) => {
  return config.map(nav => (Object.assign(Object.assign({}, nav), { isActiveOverride: false, flyout: nav.flyout.map(flyout => (Object.assign(Object.assign({}, flyout), { linkList: flyout.linkList.map(link => (Object.assign(Object.assign({}, link), { isActiveOverride: false }))) }))) })));
};
/**
 * Compile a list of scores based on the map mode, sorted in descending order
 * @param config Main Nav Config
 * @param compareUrl Current Browser URL or a custom URL
 * @param activeRouteProp Match mode
 * @returns A list of scored URLs if any matched
 */
const compileScoreList = (config, compareUrl, activeRouteProp) => {
  // Flag to check if the Portal set any active links or if there are any exact matches
  let hadAnyActiveLink = false;
  const scoreList = [];
  config.forEach(mainNav => {
    if (hadAnyActiveLink || !mainNav) {
      return;
    }
    try {
      const score = compareRoutes(compareUrl, new URL(mainNav.url), activeRouteProp);
      if (score > 0) {
        if (score === Infinity)
          hadAnyActiveLink = true;
        scoreList.push({ main: mainNav, score });
      }
    }
    catch (_a) {
      // Not a valid url, continue
    }
    // Loop through flyout links 2nd level
    if (mainNav.flyout.length) {
      mainNav.flyout.forEach(flyout => {
        if (flyout.linkList) {
          flyout.linkList.forEach(linklist => {
            // Don't override if any link is already active
            if (linklist.isActive && (activeRouteProp === 'auto' || activeRouteProp === 'exact')) {
              hadAnyActiveLink = true;
              return;
            }
            try {
              const url = new URL(linklist.url);
              const score = compareRoutes(compareUrl, url, activeRouteProp);
              if (score > 0) {
                if (score === Infinity)
                  hadAnyActiveLink = true;
                // Push score
                scoreList.push({
                  main: mainNav,
                  sub: linklist,
                  score,
                });
              }
            }
            catch (_a) {
              // Not a valid URL, continue
            }
          });
        }
      });
    }
  });
  return scoreList.sort((a, b) => b.score - a.score);
};
/**
 * Compare two URLs for similarity based on a match mode
 * @param baseUrl Browser URL
 * @param compareUrl Navigatgion URL
 * @param matchMode exact or auto matching
 * @returns Score
 */
const compareRoutes = (baseUrl, compareUrl, matchMode) => {
  // One url is not defined or they don't share the same orign
  if (!baseUrl || !compareUrl || baseUrl.origin !== compareUrl.origin) {
    return 0;
  }
  // Exact match, origin and pathname are the same
  if (baseUrl.pathname === compareUrl.pathname) {
    return Infinity;
  }
  // The basepath is longer than the comparison, a match is impossible
  if (baseUrl.pathname.length < compareUrl.pathname.length) {
    return 0;
  }
  if (matchMode === 'auto') {
    const baseSegments = [baseUrl.origin, ...baseUrl.pathname.split('/').filter(x => !!x)];
    const compareSegments = [compareUrl.origin, ...compareUrl.pathname.split('/').filter(x => !!x)];
    const score = getSimilarityScore(baseSegments, compareSegments);
    // If only some segments match, but not the whole smaller array, it's not a match
    return Math.min(baseSegments.length, compareSegments.length) === score ? score : 0;
  }
  return 0;
};
/**
 * Check how many items in an array match
 * @param a Base array
 * @param b Compare array
 * @returns Score
 */
const getSimilarityScore = (a, b) => {
  if (!(a === null || a === void 0 ? void 0 : a.length) || !(b === null || b === void 0 ? void 0 : b.length)) {
    return 0;
  }
  let i = 0;
  for (; i < Math.min(a.length, b.length); i++) {
    if (a[i] !== b[i]) {
      return 0;
    }
  }
  return i;
};

// Prevent double requests
let request = null;
// Cache the original os flyout to use it for updates
let osFlyoutCache = null;
/**
 * Get a localized config object
 *
 * @param projectId String identifying the project
 * @param language [optional] Preferred language
 * @returns Localized config object
 */
const getLocalizedConfig = async ({ projectId, environment, language, cookieKey, localStorageKey, activeRouteProp, localizedCustomConfig, osFlyoutOverrides, }) => {
  var _a, _b;
  if (!request) {
    request = fetchConfig(projectId, environment);
  }
  const config = await request;
  const lang = language_service.getUserLang(Object.keys(config), language, localStorageKey, cookieKey);
  if (lang === undefined) {
    throw new Error('Internet Header: unable to determine current language');
  }
  // Clone config for more predictable state updates
  let localizedConfig = Object.assign({}, config[lang]);
  // Merge custom config with portal config
  if (localizedCustomConfig) {
    const header = ((_a = localizedCustomConfig === null || localizedCustomConfig === void 0 ? void 0 : localizedCustomConfig.header) === null || _a === void 0 ? void 0 : _a.navMain)
      ? Object.assign(Object.assign({}, localizedConfig.header), { navMain: [...localizedConfig.header.navMain, ...localizedCustomConfig.header.navMain] }) : localizedConfig.header;
    localizedConfig = Object.assign(Object.assign({}, localizedConfig), { header });
  }
  // Add entries to flyout_os
  if (osFlyoutOverrides)
    localizedConfig.header.navMain = mergeOsFlyoutOverrides(localizedConfig, osFlyoutOverrides);
  // Mark active route
  if (activeRouteProp)
    localizedConfig.header.navMain = markActiveRoute(localizedConfig.header.navMain, activeRouteProp);
  setMainNavigationIds((_b = localizedConfig === null || localizedConfig === void 0 ? void 0 : localizedConfig.header) === null || _b === void 0 ? void 0 : _b.navMain);
  // Set the new language choice
  language_service.persistLanguageChoice(lang, cookieKey, localStorageKey);
  return localizedConfig;
};
/**
 * Merge portal config with custom os flyout overrides
 * @param config Localized config
 * @param osFlyoutOverrides Overrides for the flyout
 * @returns Merged localized config
 */
const mergeOsFlyoutOverrides = (config, osFlyoutOverrides) => {
  if (!osFlyoutOverrides)
    return config.header.navMain;
  return config.header.navMain.map(mainNav => {
    var _a, _b;
    if (mainNav.id !== 'flyout_os')
      return mainNav;
    if (osFlyoutCache === null) {
      osFlyoutCache = JSON.parse(JSON.stringify(mainNav));
    }
    const mainNavText = (_a = osFlyoutOverrides.text) !== null && _a !== void 0 ? _a : osFlyoutCache.text;
    const mainNavTitle = (_b = osFlyoutOverrides.title) !== null && _b !== void 0 ? _b : osFlyoutCache.title;
    if (!osFlyoutCache.flyout ||
      osFlyoutCache.flyout.length === 0 ||
      !osFlyoutOverrides.flyout ||
      osFlyoutOverrides.flyout.length === 0)
      return Object.assign(Object.assign({}, mainNav), { title: mainNavTitle, text: mainNavText });
    // Add entries for os flyout columns without overriding existing config
    const mainNavFlyout = [
      ...osFlyoutCache.flyout.map((col, index) => {
        var _a;
        const overrides = osFlyoutOverrides.flyout[index];
        const title = (_a = overrides.title) !== null && _a !== void 0 ? _a : col.title;
        const linkList = overrides.linkList ? osFlyoutOverrides.flyout[index].linkList : [];
        return {
          title,
          linkList: [...col.linkList, ...linkList],
        };
      }),
      ...osFlyoutOverrides.flyout.slice(osFlyoutCache.flyout.length),
    ];
    return Object.assign(Object.assign({}, mainNav), { text: mainNavText, title: mainNavTitle, flyout: mainNavFlyout });
  });
};
/**
 * Fetch the general config based on project id
 *
 * @returns Promise for Post Portal general config
 */
const fetchConfig = async (projectId, environment) => {
  // Check if project id is sanitized
  if (!isValidProjectId(projectId)) {
    throw new Error(`Internet Header: invalid project id "${projectId}"`);
  }
  if (projectId === 'test') {
    environment = 'int01';
  }
  let url = generateConfigUrl(projectId, environment);
  // Get the config if cache is invalid
  try {
    const res = await fetch(url);
    return (await res.json());
  }
  catch (error) {
    throw new Error(`Internet Header: fetching config failed. ${error.message}`);
  }
};
/**
 * Generate an URL with all necessary query params to get the configuration.
 * Project id "test" will return a test configuration
 * @param projectId string
 * @param environment int01, int02 or prod
 * @returns URL pointing to the project config
 */
const generateConfigUrl = (projectId, environment) => {
  if (projectId === 'test')
    return 'assets/config/test-configuration.json';
  const parsedEnvironment = environment.toLowerCase();
  const isProd = parsedEnvironment === 'prod';
  const host = `https://${isProd ? 'www' : 'int'}.post.ch`;
  try {
    // Use URL to validate the generated URL
    return new URL(`${host}/api/headerjs/Json?serviceid=${encodeURIComponent(projectId)}${!isProd ? '&environment=' + parsedEnvironment : ''}`).toString();
  }
  catch (error) {
    throw new Error(`Internet Header: Config URL is invalid.`);
  }
};
/**
 * Check if project id contains only URL safe characters
 *
 * @param projectId Project Id string
 * @returns The valid project id
 */
const isValidProjectId = (projectId) => {
  return projectId !== '' && projectId.length > 0 && /^[a-zA-Z][\w-]*[a-zA-Z0-9]$/.test(projectId);
};
/**
 * Get the localized config object from a custom config
 *
 * @param config String or json object of the custom config
 * @param language Specific language
 * @returns Localized custom config object
 */
const getLocalizedCustomConfig = (config, language) => {
  var _a;
  let customConfig;
  try {
    customConfig = typeof config === 'string' ? JSON.parse(config) : config;
  }
  catch (error) {
    throw new Error(`Internet Header: Custom config is invalid. Make sure your custom config contains valid JSON syntax and matches the definition. `);
  }
  let localizedCustomConfig = customConfig[language];
  if ((_a = localizedCustomConfig === null || localizedCustomConfig === void 0 ? void 0 : localizedCustomConfig.header) === null || _a === void 0 ? void 0 : _a.navMain)
    setMainNavigationIds(localizedCustomConfig.header.navMain);
  return localizedCustomConfig;
};
/**
 * Set unique ID's on main navigation entities but conserve flyout_os to be able to
 * identify the online-service flyout, which can be configured by osFlyoutOverrides
 */
const setMainNavigationIds = (navMainEntities) => {
  navMainEntities.forEach(navMainEntity => {
    navMainEntity.id = navMainEntity.id === 'flyout_os' ? navMainEntity.id : utils.uniqueId('main-nav-');
  });
};

const name = "@swisspost/internet-header";
const version = "1.5.3";
const description = "The header for client facing applications.";
const author = "Swiss Post <oss@post.ch>";
const license = "Apache-2.0";
const repository = {
	type: "git",
	url: "https://github.com/swisspost/design-system.git"
};
const homepage = "https://next.design-system.post.ch";
const bugs = {
	url: "https://github.com/swisspost/design-system/issues"
};
const main = "loader/index.cjs.js";
const module$1 = "loader/index.js";
const es2015 = "loader/index.es2017.js";
const es2017 = "loader/index.es2017.js";
const types = "loader/index.d.ts";
const collection = "dist/collection/collection-manifest.json";
const unpkg = "loader/cdn.js";
const publishConfig = {
	access: "public"
};
const files = [
	"dist/",
	"loader/"
];
const scripts = {
	start: "stencil build --docs --watch",
	dev: "stencil build --watch --serve --docs --dev",
	build: "stencil build --docs",
	test: "npm run unit",
	unit: "jest",
	"unit:watch": "jest --watch",
	e2e: "cypress run",
	"e2e:watch": "cypress open",
	snapshots: "percy exec -- cypress run --browser chromium --config-file ./cypress.snapshot.config.js --record --key 0995e768-43ec-42bd-a127-ff944a2ad8c9",
	clean: "rimraf www dist loader storybook-static",
	lint: "eslint src/**/*{.ts,.tsx}",
	"lint:fix": "eslint src/**/*{.ts,.tsx} --fix",
	generate: "stencil generate"
};
const dependencies = {
	"@stencil/core": "3.0.1",
	"@stencil/store": "2.0.3",
	"body-scroll-lock": "4.0.0-beta.0",
	"iframe-resizer": "4.3.4",
	jquery: "3.6.3",
	tabbable: "6.1.1",
	"throttle-debounce": "5.0.0",
	"url-polyfill": "1.1.12"
};
const devDependencies = {
	"@babel/core": "7.21.0",
	"@percy/cli": "1.20.0",
	"@percy/cypress": "3.1.2",
	"@stencil/eslint-plugin": "0.4.0",
	"@stencil/sass": "2.0.3",
	"@swisspost/design-system-styles": "workspace:5.3.2",
	"@types/iframe-resizer": "3.5.9",
	"@types/jest": "26.0.24",
	"@types/jquery": "3.5.16",
	"@types/node": "18.14.0",
	"@types/throttle-debounce": "5.0.0",
	"babel-loader": "9.1.2",
	bootstrap: "5.2.3",
	cypress: "12.6.0",
	"cypress-each": "1.13.1",
	"cypress-storybook": "0.5.1",
	"eslint-plugin-react": "7.32.2",
	globby: "13.1.3",
	jest: "26.6.3",
	rimraf: "4.1.2",
	"rollup-plugin-node-polyfills": "0.2.1",
	"rollup-plugin-scss": "4.0.0",
	"rollup-plugin-visualizer": "5.9.0",
	sass: "1.58.3",
	"start-server-and-test": "1.15.4",
	"ts-jest": "26.5.6",
	typescript: "4.9.5"
};
const packageJson = {
	name: name,
	version: version,
	description: description,
	author: author,
	license: license,
	repository: repository,
	homepage: homepage,
	bugs: bugs,
	main: main,
	module: module$1,
	es2015: es2015,
	es2017: es2017,
	"jsnext:main": "loader/index.es2017.js",
	types: types,
	collection: collection,
	"collection:main": "dist/collection/index.js",
	unpkg: unpkg,
	publishConfig: publishConfig,
	files: files,
	scripts: scripts,
	dependencies: dependencies,
	devDependencies: devDependencies
};

const postInternetHeaderCss = "*,:host,*::before,*::after{-webkit-box-sizing:border-box;box-sizing:border-box}button{font:inherit;padding:0}img,svg{max-width:100%;max-height:100%}@media (forced-colors: active){svg{color:white}}.no-list{list-style:none;padding-left:0;margin-top:0;margin-bottom:0}.btn-blank{background-color:transparent;border:none;border-radius:0;padding:0}.nav-link{text-decoration:none;color:rgba(0, 0, 0, 0.8);-webkit-transition:color 200ms;transition:color 200ms;background-color:transparent;border-radius:0;-webkit-box-shadow:none;box-shadow:none;border:0;margin:0;display:-ms-flexbox;display:flex;-ms-flex-align:center;align-items:center;gap:0.5rem}.nav-link:hover,.nav-link:focus{color:black}.nav-link>svg{width:1.4em;height:1.4em;-ms-flex-negative:0;flex-shrink:0}.nav-link>span{-ms-flex-negative:1;flex-shrink:1}.box>*:first-child{margin-top:0}.box>*:last-child{margin-bottom:0}.mirrored{-webkit-transform:scaleX(-1);transform:scaleX(-1)}.rotate-270{-webkit-transform:rotate(270deg);transform:rotate(270deg)}.bold{font-weight:700}.light{font-weight:300}.d-flex{display:-ms-flexbox;display:flex}.d-inline-flex{display:-ms-inline-flexbox;display:inline-flex}.align-items-center{-ms-flex-align:center;align-items:center}@media (min-width: 1441px){.wide-container{margin:0 auto;max-width:1440px}}@media (max-width: 599.98px){.container{padding-right:16px;padding-left:16px}}@media (min-width: 600px) and (max-width: 1023.98px){.container{padding-right:32px;padding-left:32px}}@media (min-width: 1024px){.container{padding-right:40px;padding-left:40px}}.visually-hidden{position:absolute;width:1px;height:1px;border:0;padding:0;margin:-1px;overflow:hidden;clip:rect(0 0 0 0)}@media (max-width: -0.02px){.hidden-xs{display:none}}@media (max-width: 399.98px){.hidden-sm{display:none}}@media (max-width: 599.98px){.hidden-rg{display:none}}@media (max-width: 779.98px){.hidden-md{display:none}}@media (max-width: 1023.98px){.hidden-lg{display:none}}@media (max-width: 1279.98px){.hidden-xl{display:none}}@media (max-width: 1440.98px){.hidden-xxl{display:none}}:host{display:block;position:relative;font-size:1rem;font-weight:300;z-index:var(--header-z-index, 10);--header-height:3.5rem;--meta-header-height:0px;--language-dropdown-margin-top:0px}@media (min-width: 1024px){:host{--meta-header-height:3rem;--header-height:4rem}}@media (min-width: 1280px){:host{--header-height:4.5rem}}:host([meta=false]){--meta-header-height:0px;--language-dropdown-margin-top:1px}@supports ((position: -webkit-sticky) or (position: sticky)){:host(:not(.stickyness-none)){position:-webkit-sticky;position:sticky}:host(.stickyness-full){top:0}:host(.stickyness-main){top:calc(var(--meta-header-height, 0px) * -1)}:host(.stickyness-minimal){top:calc((var(--header-height, 0px) + var(--meta-header-height, 0px)) * -1);-webkit-transition:top 200ms ease-in;transition:top 200ms ease-in}:host(.stickyness-minimal.scrolling-up),:host(.stickyness-minimal.dropdown-open){top:calc(var(--meta-header-height, 0px) * -1);-webkit-transition:top 200ms ease-out;transition:top 200ms ease-out}}.post-internet-header{border-bottom:1px solid #e6e6e6;background-color:white}.main-navigation-container{display:-ms-flexbox;display:flex}.main-navigation-container>.main-navigation-controls{-ms-flex:0 0 auto;flex:0 0 auto}.main-navigation{display:-ms-flexbox;display:flex}.sub-navigation-container{position:absolute;top:100%;left:0;width:100%;display:-ms-flexbox;display:flex;background:white;visibility:hidden}.main-navigation-item:hover .sub-navigation-container{visibility:visible}.main-navigation-controls{display:-ms-flexbox;display:flex;margin-left:auto}@media (max-width: 1023.98px){.main-navigation-controls{font-weight:400}}@media (min-width: 1024px){.main-navigation-controls{font-size:1.0625rem}}.main-navigation-controls>*{border-left:1px solid #e6e6e6}.menu-button{display:-ms-flexbox;display:flex;-ms-flex-align:center;align-items:center;padding:0 calc(1rem - 1px);font-weight:300;cursor:pointer;border-left:1px solid #e6e6e6;-ms-flex-order:1;order:1;}@media (min-width: 1024px){.menu-button{display:none}}@media (min-width: 600px) and (max-width: 1023.98px){.menu-button .visually-hidden{position:static;width:auto;height:auto;margin:auto;overflow:visible;clip:auto;visibility:visible;margin-right:0.5rem}}.menu-button svg{width:1.5rem;height:1.5rem}.full-width .wide-container{max-width:none}";

const PostInternetHeader = class {
  /**
   * Get the currently set language as a two letter string ("de", "fr" "it" or "en")
   * @returns string
   */
  async getCurrentLanguage() {
    var _a;
    return (_a = store.state.currentLanguage) !== null && _a !== void 0 ? _a : 'de';
  }
  constructor(hostRef) {
    index.registerInstance(this, hostRef);
    this.headerLoaded = index.createEvent(this, "headerLoaded", 7);
    this.lastScrollTop = window.scrollY || document.documentElement.scrollTop;
    this.lastWindowWidth = window.innerWidth;
    this.handleClickOutsideBound = this.handleClickOutside.bind(this);
    this.project = undefined;
    this.stickyness = 'minimal';
    this.language = undefined;
    this.meta = true;
    this.login = true;
    this.search = true;
    this.skiplinks = true;
    this.configProxy = undefined;
    this.environment = 'prod';
    this.languageSwitchOverrides = undefined;
    this.customConfig = undefined;
    this.languageCookieKey = undefined;
    this.languageLocalStorageKey = 'swisspost-internet-header-language';
    this.activeRoute = 'auto';
    this.osFlyoutOverrides = undefined;
    this.fullWidth = false;
    this.activeFlyout = null;
    this.activeDropdownElement = null;
    if (this.project === undefined || this.project === '' || !isValidProjectId(this.project)) {
      throw new Error(`Internet Header project key is "${this.project}". Please provide a valid project key.`);
    }
  }
  connectedCallback() {
    this.throttledScroll = index$1.throttle(300, () => this.handleScrollEvent());
    this.debouncedResize = index$1.debounce(200, () => this.handleResize());
    window.addEventListener('scroll', this.throttledScroll, { passive: true });
    window.addEventListener('resize', this.debouncedResize, { passive: true });
  }
  disconnectedCallback() {
    window.removeEventListener('scroll', this.throttledScroll);
    window.removeEventListener('resize', this.debouncedResize);
    // Reset the store to its original state
    store.dispose();
  }
  async componentWillLoad() {
    // Wait for the config to arrive, then render the header
    try {
      store.state.projectId = this.project;
      store.state.environment = this.environment;
      if (this.language !== undefined)
        store.state.currentLanguage = this.language;
      store.state.languageSwitchOverrides =
        typeof this.languageSwitchOverrides === 'string'
          ? JSON.parse(this.languageSwitchOverrides)
          : this.languageSwitchOverrides;
      store.state.osFlyoutOverrides =
        typeof this.osFlyoutOverrides === 'string'
          ? JSON.parse(this.osFlyoutOverrides)
          : this.osFlyoutOverrides;
      if (this.customConfig !== undefined && store.state.currentLanguage !== null) {
        store.state.localizedCustomConfig = getLocalizedCustomConfig(this.customConfig, store.state.currentLanguage);
      }
      store.state.localizedConfig = await getLocalizedConfig({
        projectId: this.project,
        environment: this.environment,
        language: this.language,
        cookieKey: this.languageCookieKey,
        localStorageKey: this.languageLocalStorageKey,
        activeRouteProp: this.activeRoute,
        localizedCustomConfig: store.state.localizedCustomConfig,
        osFlyoutOverrides: store.state.osFlyoutOverrides,
      });
    }
    catch (error) {
      console.error(error);
    }
  }
  componentDidLoad() {
    window.requestAnimationFrame(() => {
      this.handleResize();
      this.headerLoaded.emit();
      this.host.classList.add('header-loaded');
    });
  }
  async handleLanguageChange(newValue) {
    store.state.currentLanguage = newValue;
    store.state.localizedConfig = await getLocalizedConfig({
      projectId: this.project,
      environment: this.environment,
      language: newValue,
      cookieKey: this.languageCookieKey,
      localStorageKey: this.languageLocalStorageKey,
      activeRouteProp: this.activeRoute,
      localizedCustomConfig: store.state.localizedCustomConfig,
      osFlyoutOverrides: store.state.osFlyoutOverrides,
    });
    if (this.customConfig)
      store.state.localizedCustomConfig = getLocalizedCustomConfig(this.customConfig, newValue);
  }
  handleAvailableLanguagesChage(newValue) {
    store.state.languageSwitchOverrides = typeof newValue === 'string' ? JSON.parse(newValue) : newValue;
  }
  async handleOsFlyoutOverrides(newValue) {
    store.state.osFlyoutOverrides = typeof newValue === 'string' ? JSON.parse(newValue) : newValue;
    store.state.localizedConfig = await getLocalizedConfig({
      projectId: this.project,
      environment: this.environment,
      language: this.language,
      cookieKey: this.languageCookieKey,
      localStorageKey: this.languageLocalStorageKey,
      activeRouteProp: this.activeRoute,
      localizedCustomConfig: store.state.localizedCustomConfig,
      osFlyoutOverrides: store.state.osFlyoutOverrides,
    });
  }
  async handleActiveRouteChange(newValue) {
    store.state.localizedConfig = await getLocalizedConfig({
      projectId: this.project,
      environment: this.environment,
      language: this.language,
      cookieKey: this.languageCookieKey,
      localStorageKey: this.languageLocalStorageKey,
      activeRouteProp: newValue,
      localizedCustomConfig: store.state.localizedCustomConfig,
      osFlyoutOverrides: store.state.osFlyoutOverrides,
    });
  }
  async handleCustomConfigChange(newValue) {
    if (this.language === undefined)
      return;
    const localizedCustomConfig = getLocalizedCustomConfig(newValue, this.language);
    store.state.localizedCustomConfig = localizedCustomConfig;
    store.state.localizedConfig = await getLocalizedConfig({
      projectId: this.project,
      environment: this.environment,
      language: this.language,
      cookieKey: this.languageCookieKey,
      localStorageKey: this.languageLocalStorageKey,
      activeRouteProp: this.activeRoute,
      localizedCustomConfig: localizedCustomConfig,
      osFlyoutOverrides: store.state.osFlyoutOverrides,
    });
  }
  handleSearchChange(newValue) {
    store.state.search = newValue;
  }
  handleLoginChange(newValue) {
    store.state.login = newValue;
  }
  handleMetaChange(newValue) {
    store.state.meta = newValue;
  }
  handleLanguageChangeEvent(event) {
    this.handleLanguageChange(event.detail);
  }
  handleClickOutside(event) {
    // Close active dropdown element on click outside of it
    if (this.activeDropdownElement && !event.composedPath().includes(this.activeDropdownElement)) {
      this.activeDropdownElement.toggleDropdown(false);
    }
  }
  handleKeyUp(event) {
    if (event.key === 'Escape') {
      if (this.activeDropdownElement) {
        this.activeDropdownElement.toggleDropdown(false);
      }
      if (this.activeFlyout !== null && this.mainNav) {
        this.mainNav.toggleDropdown(false);
      }
    }
  }
  handleScrollEvent() {
    // Credits: "https://github.com/qeremy/so/blob/master/so.dom.js#L426"
    const st = window.scrollY || document.documentElement.scrollTop;
    // Toggle class without re-rendering the component if stickyness is minimal
    // the other stickyness modes do not need the class
    if (this.stickyness === 'minimal') {
      this.host.classList.toggle('scrolling-up', st <= this.lastScrollTop);
    }
    // For Mobile or negative scrolling
    this.lastScrollTop = st <= 0 ? 0 : st;
  }
  handleResize() {
    var _a;
    // Close main navigation dropdown if size changed to bigger than 1024px (search dropdown will be kept open)
    if (this.isMainNavOpen() && this.lastWindowWidth < 1024 && window.innerWidth >= 1024) {
      (_a = this.activeDropdownElement) === null || _a === void 0 ? void 0 : _a.toggleDropdown(false);
    }
    this.lastWindowWidth = window.innerWidth;
  }
  /**
   * Close open dropdown menus if another is being opened
   *
   * @param event Dropdown toggled event
   * @returns void
   */
  handleDropdownToggled(event) {
    if (!event.detail.open && this.activeDropdownElement !== event.detail.element) {
      // Some dropdown got closed programmatically (possibly by this function). To prevent
      // a circle or an outdated state, we'll not handle this event
      return;
    }
    if (event.detail.open === true) {
      if (this.activeDropdownElement) {
        this.activeDropdownElement.toggleDropdown(false);
      }
      this.activeDropdownElement = event.detail.element;
      if (window.innerWidth >= 1024) {
        // Add event listener to close active dropdown element on click outsite of it
        // Also adds 10ms delay in case of an external interaction:
        //    Some button on the page calls toggleDropdown() -> dropdown opens
        //    Click event bubbles to the window, this.handleClickOutsideBound closes dropdown again
        window.setTimeout(() => {
          window.addEventListener('click', this.handleClickOutsideBound);
        }, 10);
      }
      if (this.activeFlyout !== null && this.mainNav) {
        this.mainNav.setActiveFlyout(null);
      }
    }
    else {
      this.activeDropdownElement = null;
      // Remove event listener as it is not needed if no dropdown element is active
      window.removeEventListener('click', this.handleClickOutsideBound);
    }
  }
  /**
   * Close open dropdowns if the flyout is being opened
   * @param event Flyout toggle event
   */
  handleFlyoutToggled(event) {
    this.activeFlyout = event.detail;
    if (this.activeDropdownElement && event.detail && !this.isMainNavOpen()) {
      this.activeDropdownElement.toggleDropdown(false);
    }
  }
  toggleMobileDropdown() {
    var _a;
    (_a = this.mainNav) === null || _a === void 0 ? void 0 : _a.toggleDropdown();
  }
  isMainNavOpen() {
    return (this.activeDropdownElement && this.activeDropdownElement.tagName === 'POST-MAIN-NAVIGATION');
  }
  render() {
    var _a, _b, _c;
    if (!((_a = store.state.localizedConfig) === null || _a === void 0 ? void 0 : _a.header)) {
      console.error(new Error('Internet Header: Config cannot be loaded'));
      return;
    }
    const config = store.state.localizedConfig;
    const renderMetaNavigation = this.meta &&
      config.header.navMeta !== undefined &&
      ((_b = config.header.navMeta) === null || _b === void 0 ? void 0 : _b.filter(meta => !meta.isHomeLink).length) > 0;
    const renderLogin = ((_c = this.login) !== null && _c !== void 0 ? _c : !config.header.isLoginWidgetHidden) && config.header.loginWidgetOptions;
    const renderLanguageSwitch = config.header.navLang.length > 1;
    return (index.h(index.Host, { class: `stickyness-${this.stickyness} ${this.activeDropdownElement || this.activeFlyout ? 'dropdown-open' : ''}`, "data-version": packageJson.version, onKeyup: (e) => this.handleKeyUp(e) }, index.h("header", { class: `post-internet-header${this.fullWidth ? ' full-width' : ''}` }, index.h(svgSprite_component.SvgSprite, null), index.h(if_component.If, { condition: this.skiplinks === true }, index.h("post-skiplinks", null)), index.h(if_component.If, { condition: renderMetaNavigation === true }, index.h("post-meta-navigation", { orientation: "horizontal", class: "hidden-lg", "full-width": this.fullWidth }, index.h(if_component.If, { condition: renderLanguageSwitch === true }, index.h("post-language-switch", { id: "post-language-switch-desktop", mode: "dropdown", onDropdownToggled: e => this.handleDropdownToggled(e) })))), index.h("div", { class: "main-navigation-container wide-container" }, index.h("post-logo", null), index.h("button", { class: "menu-button nav-link", onClick: () => this.toggleMobileDropdown() }, index.h("span", { class: "menu-button-text visually-hidden" }, config.header.mobileMenu.text), index.h(svgIcon_component.SvgIcon, { name: this.isMainNavOpen() ? 'pi-close' : 'pi-menu' })), index.h("post-main-navigation", { onDropdownToggled: e => this.handleDropdownToggled(e), onFlyoutToggled: e => this.handleFlyoutToggled(e), ref: el => (this.mainNav = el) }, index.h(if_component.If, { condition: renderMetaNavigation === true }, index.h("post-meta-navigation", { orientation: "vertical" }, index.h(if_component.If, { condition: renderLanguageSwitch === true }, index.h("post-language-switch", { id: "post-language-switch-mobile", mode: "list" }))))), index.h("div", { class: "main-navigation-controls" }, index.h(if_component.If, { condition: this.search !== false }, index.h("post-search", { onDropdownToggled: e => this.handleDropdownToggled(e) })), index.h(if_component.If, { condition: !!renderLogin }, index.h("post-klp-login-widget", null, index.h("slot", { name: "login-widget" }))), index.h(if_component.If, { condition: renderMetaNavigation === false && renderLanguageSwitch === true }, index.h("post-language-switch", { id: "post-language-switch-no-meta", onDropdownToggled: e => this.handleDropdownToggled(e), mode: "dropdown" })), index.h("slot", { name: "main" }))))));
  }
  get host() { return index.getElement(this); }
  static get watchers() { return {
    "language": ["handleLanguageChange"],
    "languageSwitchOverrides": ["handleAvailableLanguagesChage"],
    "osFlyoutOverrides": ["handleOsFlyoutOverrides"],
    "activeRoute": ["handleActiveRouteChange"],
    "customConfig": ["handleCustomConfigChange"],
    "search": ["handleSearchChange"],
    "login": ["handleLoginChange"],
    "meta": ["handleMetaChange"]
  }; }
};
PostInternetHeader.style = postInternetHeaderCss;

exports.swisspost_internet_header = PostInternetHeader;

//# sourceMappingURL=swisspost-internet-header.cjs.entry.js.map