/**
 * Transform to lowercase, extract accents to separate unicode chars,
 * replace all accent unicode chars so only standard latin chars remain
 * https://stackoverflow.com/questions/990904/remove-accents-diacritics-in-a-string-in-javascript/37511463#37511463
 *
 * @param str Input string
 * @returns
 */
export declare const hardNormalize: (str: string) => string;
