import { EventEmitter } from '../../stencil-public-runtime';
import { DropdownElement, NavMainEntity } from '../../models/header.model';
import { StickynessOptions } from '../../models/implementor.model';
import { ActiveRouteProp, Environment, ICustomConfig } from '../../models/general.model';
import { IAvailableLanguage } from '../../models/language.model';
export declare class PostInternetHeader {
  /**
   * Your project id, previously passed as query string parameter serviceId.
   */
  project: string;
  /**
   * Sticky behaviour of the header.
   */
  stickyness: StickynessOptions;
  /**
   * Initial language to be used. Overrides automatic language detection.
   */
  language?: string;
  /**
   * Toggle the meta navigation.
   */
  meta: boolean;
  /**
   * Toggle the login link (when logged out) or the user widget (when logged in).
   */
  login: boolean;
  /**
   * Toggle the search button.
   */
  search: boolean;
  /**
   * Toggle skiplinks. They help keyboard users to quickly jump to important sections of the page.
   */
  skiplinks: boolean;
  /**
   * DEPRECATED!: Define a proxy URL for the config fetch request. Will be removed in the next major version
   */
  configProxy?: string;
  /**
   * Target environment. Choose 'int01' for local testing.
   */
  environment: Environment;
  /**
   * Override the language switch links with custom URLs. Helpful when your application contains sub-pages and you
   * would like to stay on subpages when the user changes language.
   */
  languageSwitchOverrides?: string | IAvailableLanguage[];
  /**
   * Customize the header config loaded from the post portal.
   */
  customConfig?: string | ICustomConfig;
  /**
   * The header uses this cookie to set the language. Disables automatic language detection.
   */
  languageCookieKey?: string;
  /**
   * The header uses this local storage key to set the language. Disables automatic language selection.
   */
  languageLocalStorageKey?: string;
  /**
   * Set the currently activated route. If there is a link matching this URL in the header, it will be highlighted.
   * Will also highlight partly matching URLs. When set to auto, will use current location.href for comparison.
   */
  activeRoute?: 'auto' | false | string;
  /**
   * Online Services only: Add custom links to the special online service navigation entry
   */
  osFlyoutOverrides?: string | NavMainEntity;
  /**
   * Displays the header at full width for full-screen applications
   */
  fullWidth?: boolean;
  /**
   * Fires when the header has been rendered to the page.
   */
  headerLoaded: EventEmitter<void>;
  activeFlyout: string | null;
  activeDropdownElement: DropdownElement | null;
  host: HTMLElement;
  /**
   * Get the currently set language as a two letter string ("de", "fr" "it" or "en")
   * @returns string
   */
  getCurrentLanguage(): Promise<'de' | 'fr' | 'it' | 'en' | string>;
  private mainNav?;
  private lastScrollTop;
  private throttledScroll;
  private debouncedResize;
  private lastWindowWidth;
  constructor();
  connectedCallback(): void;
  disconnectedCallback(): void;
  componentWillLoad(): Promise<void>;
  componentDidLoad(): void;
  handleLanguageChange(newValue: string): Promise<void>;
  handleAvailableLanguagesChage(newValue: string | IAvailableLanguage[]): void;
  handleOsFlyoutOverrides(newValue: string | NavMainEntity): Promise<void>;
  handleActiveRouteChange(newValue: string | ActiveRouteProp): Promise<void>;
  handleCustomConfigChange(newValue: string | ICustomConfig): Promise<void>;
  handleSearchChange(newValue: boolean): void;
  handleLoginChange(newValue: boolean): void;
  handleMetaChange(newValue: boolean): void;
  handleLanguageChangeEvent(event: CustomEvent<string>): void;
  private handleClickOutsideBound;
  private handleClickOutside;
  private handleKeyUp;
  private handleScrollEvent;
  private handleResize;
  /**
   * Close open dropdown menus if another is being opened
   *
   * @param event Dropdown toggled event
   * @returns void
   */
  private handleDropdownToggled;
  /**
   * Close open dropdowns if the flyout is being opened
   * @param event Flyout toggle event
   */
  private handleFlyoutToggled;
  private toggleMobileDropdown;
  private isMainNavOpen;
  render(): any;
}
