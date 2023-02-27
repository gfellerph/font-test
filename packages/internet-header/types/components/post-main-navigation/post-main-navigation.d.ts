import { EventEmitter } from '../../stencil-public-runtime';
import { DropdownElement, DropdownEvent, HasDropdown, IsFocusable, NavMainEntity } from '../../models/header.model';
export declare class PostMainNavigation implements HasDropdown, IsFocusable {
  activeFlyout: string | null;
  mobileMenuOpen: boolean;
  dropdownToggled: EventEmitter<DropdownEvent>;
  flyoutToggled: EventEmitter<string | null>;
  host: DropdownElement;
  private throttledResize;
  private resizeTimer;
  private mouseLeaveTimer;
  private mouseEnterTimer;
  private flyoutElement;
  connectedCallback(): void;
  disconnectedCallback(): void;
  handleResize(): void;
  setWindowHeight(): void;
  openFlyout(id: string): void;
  closeFlyout(id?: string): void;
  addFlyoutAnimation(flyout: HTMLElement): void;
  removeFlyoutAnimation(flyout: HTMLElement): void;
  isActiveFlyout(id?: string): boolean;
  handleMouseEnter(level: NavMainEntity): void;
  handleMouseLeave(level: NavMainEntity): void;
  handleTouchEnd(event: TouchEvent, level: NavMainEntity): void;
  handleKeyPress(event: KeyboardEvent, level: NavMainEntity): void;
  handleClick(event: MouseEvent, level: NavMainEntity): void;
  /**
   * Disable or re-enable body scrolling, depending on whether mobile menu is open or closed
   */
  setBodyScroll(): void;
  /**
   * Toggle the main navigation (only visible on mobile)
   * @param force Force a state
   * @returns Boolean indicating new state
   */
  toggleDropdown(force?: boolean): Promise<boolean>;
  /**
   * Focus the main navigation toggle button
   */
  setFocus(): Promise<void>;
  /**
   * Open a specific flyout
   * @param id Flyout ID
   */
  setActiveFlyout(id: string | null): Promise<void>;
  render(): any;
}
