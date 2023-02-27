export declare class PostLogo {
  showFaviconLogo: boolean;
  host: HTMLPostLogoElement;
  private throttledResize;
  private resizeObserver;
  constructor();
  componentDidLoad(): void;
  disconnectedCallback(): void;
  handleResize(): void;
  render(): any;
}
