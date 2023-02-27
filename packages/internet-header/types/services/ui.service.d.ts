/**
 * Check if an element with `text-overflow: ellipsis;` is fully displayed or concatenated
 * https://stackoverflow.com/questions/7738117/html-text-overflow-ellipsis-detection
 *
 * @param element Element to check. This is the element with the `text-overflow: ellipsis;` style
 * @returns
 */
export declare const isConcatenated: (element: HTMLElement) => boolean;
/**
 * Check if user preferes reduced motion
 * Windows 10: `Windows Settings` > `Ease of Access` > `Display` > `Simplify and Personalize Windows` > `Show animations in Windows`
 *
 * @returns
 */
export declare const userPrefersReducedMotion: () => boolean;
/**
 * Check if an element has a transition applied
 *
 * @param element Element to check. This is the element with the `transition` style
 * @param transition Specific transition to check for (e.g. `translate`)
 * @returns
 */
export declare const elementHasTransition: (element: HTMLElement, transition: string) => boolean;
