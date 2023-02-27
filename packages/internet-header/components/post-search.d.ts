import type { Components, JSX } from "../types/components";

interface PostSearch extends Components.PostSearch, HTMLElement {}
export const PostSearch: {
  prototype: PostSearch;
  new (): PostSearch;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
