import { FunctionalComponent } from '../../../stencil-public-runtime';
/**
 * Trap the focus inside a specific container by prepending/appending two focus trap
 * input boxes who return the focus into the container.
 *
 * @param props active: activate or deactivate the focus trap
 * @param children Child nodes
 * @returns
 */
export declare const FocusTrap: FunctionalComponent<{
  active?: boolean;
}>;
