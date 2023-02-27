import { IBreadcrumbOverlay } from '../../../models/breadcrumbs.model';
/**
 * Overlay implementation with focus trap according to
 * https://www.accessibility-developer-guide.com/examples/widgets/dialog/#modal-dialog
 *
 * @param props
 * @returns
 */
export declare const OverlayComponent: (props: {
  overlay: IBreadcrumbOverlay;
  onClick: () => void;
  onKeyDown?: ((event?: KeyboardEvent) => void) | undefined;
  iFrameRef: (element: HTMLIFrameElement) => void;
  overlayRef: (element: HTMLElement | undefined) => void;
  closeButtonText: string;
}) => any;
