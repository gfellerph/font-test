import type { Components, JSX } from "../types/components";

interface PostLogo extends Components.PostLogo, HTMLElement {}
export const PostLogo: {
  prototype: PostLogo;
  new (): PostLogo;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
