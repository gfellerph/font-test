import { IBreadcrumbItem } from '../../../models/breadcrumbs.model';
export declare const BreadcrumbList: (props: {
  items: IBreadcrumbItem[];
  dropdownOpen?: boolean | undefined;
  isConcatenated?: boolean | undefined;
  clickHandler: (event?: MouseEvent) => void;
  lastItemRef?: ((element: HTMLElement | undefined) => void) | undefined;
  focusable?: boolean | undefined;
}) => any;
