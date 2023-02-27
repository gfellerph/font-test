import type { Components, JSX } from "../types/components";

interface PostKlpLoginWidget extends Components.PostKlpLoginWidget, HTMLElement {}
export const PostKlpLoginWidget: {
  prototype: PostKlpLoginWidget;
  new (): PostKlpLoginWidget;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
