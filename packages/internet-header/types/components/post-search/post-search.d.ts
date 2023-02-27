import { EventEmitter } from '../../stencil-public-runtime';
import { CoveoCompletion } from '../../models/coveo.model';
import { GeocodeLocation } from '../../models/geocode.model';
import { DropdownElement, DropdownEvent, HasDropdown, IsFocusable } from '../../models/header.model';
import { TrackAndTraceInfo } from '../../models/track-and-trace.model';
export declare class PostSearch implements HasDropdown, IsFocusable {
  searchDropdownOpen: boolean;
  coveoSuggestions: CoveoCompletion[];
  placeSuggestions: GeocodeLocation[];
  parcelSuggestion: (TrackAndTraceInfo & {
    url: string;
  }) | null;
  dropdownToggled: EventEmitter<DropdownEvent>;
  host: DropdownElement;
  private searchBox?;
  private searchFlyout;
  private throttledResize;
  connectedCallback(): void;
  disconnectedCallback(): void;
  componentWillUpdate(): Promise<boolean> | undefined;
  componentDidUpdate(): void;
  toggleDropdown(event?: Event): Promise<boolean>;
  toggleDropdown(force?: boolean): Promise<boolean>;
  /**
   * Sets the focus on the search button
   */
  setFocus(): Promise<void>;
  private handleResize;
  /**
   * Disable or re-enable body scrolling, depending on whether search dropdown is open or closed in mobile view (width < 1024px)
   */
  private setBodyScroll;
  /**
   * Fetch suggestions from all available sources
   */
  private handleSearchInput;
  /**
   * Start search on enter
   * @param event
   */
  private handleKeyDown;
  /**
   * Set selected suggestion on mouse enter
   * @param event
   */
  private handleMouseEnterSuggestion;
  /**
   * Set selected suggestion on mouse enter
   * @param event
   */
  private handleMouseLeaveSuggestions;
  /**
   * Deselect any previously selected suggestion
   */
  private deselectSuggestion;
  /**
   * Redirect to the post search page
   */
  private startSearch;
  render(): any;
}
