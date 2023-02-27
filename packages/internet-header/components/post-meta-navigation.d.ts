import type { Components, JSX } from "../types/components";

interface PostMetaNavigation extends Components.PostMetaNavigation, HTMLElement {}
export const PostMetaNavigation: {
  prototype: PostMetaNavigation;
  new (): PostMetaNavigation;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
