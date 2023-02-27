import { IBreadcrumbOverlay, IBreadcrumbItem } from '../../models/breadcrumbs.model';
export declare class PostInternetBreadcrumbs {
  customItems?: string | IBreadcrumbItem[];
  customBreadcrumbItems?: IBreadcrumbItem[];
  overlayVisible: boolean;
  isConcatenated: boolean;
  dropdownOpen: boolean;
  refsReady: boolean;
  host: Element;
  private controlNavRef?;
  private visibleNavRef?;
  private currentOverlay;
  private debouncedResize;
  private lastWindowWidth;
  private openAnimation;
  private loadedAnimation;
  connectedCallback(): void;
  disconnectedCallback(): void;
  componentWillLoad(): Promise<void>;
  componentDidLoad(): void;
  handleCustomConfigChage(newValue: string | IBreadcrumbItem[]): void;
  handleResize(): void;
  checkConcatenation(): void;
  toggleOverlay(overlay: IBreadcrumbOverlay, force?: boolean): void;
  /**
   * Disable or re-enable body scrolling, depending on whether overlay is visible or not
   */
  setBodyScroll(overlay: IBreadcrumbOverlay): void;
  toggleDropdown(force?: boolean): void;
  handleWindowClick(): void;
  registerIFrameResizer(iFrame: HTMLIFrameElement): void;
  /**
   * Reference function for the overlay element got called. It is either null (overlay closed)
   * or contains the overlay element as parameter.
   * @param e Overlay element or null
   * @returns void
   */
  overlayRef(e: HTMLElement | undefined): void;
  private handleKeyDown;
  private handleToggleDropdown;
  private handleToggleOverlay;
  private handleControlNavRef;
  private handleVisibleNavRef;
  render(): any;
}
