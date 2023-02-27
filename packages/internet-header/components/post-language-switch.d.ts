import type { Components, JSX } from "../types/components";

interface PostLanguageSwitch extends Components.PostLanguageSwitch, HTMLElement {}
export const PostLanguageSwitch: {
  prototype: PostLanguageSwitch;
  new (): PostLanguageSwitch;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
