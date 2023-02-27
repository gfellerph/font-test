import type { Components, JSX } from "../types/components";

interface PostMainNavigation extends Components.PostMainNavigation, HTMLElement {}
export const PostMainNavigation: {
  prototype: PostMainNavigation;
  new (): PostMainNavigation;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
