import { ISearchConfig } from '../../models/header.model';
/**
 * Construct a search page url from a query
 *
 * @param query Search term
 * @returns
 */
export declare const getSearchRedirectUrl: (query: string, searchConfig: ISearchConfig) => Promise<string | undefined>;
/**
 * Stitch toghether the search page URL
 *
 * @param query Search term
 * @returns Search page URL
 */
export declare const getSearchPageUrl: (query: string) => string | undefined;
/**
 * Equalize the length of two arrays while filling up empty slots up to max. length
 *
 * @param arrayA First array
 * @param arrayB Second array
 * @param maxLength Max. length of result array
 * @returns Array with two resulting arrays
 */
export declare const equalizeArrays: <A, B>(arrayA: A[], arrayB: B[], maxLength?: number) => [A[], B[]];
