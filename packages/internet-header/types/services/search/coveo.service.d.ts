import { CoveoCompletion } from '../../models/coveo.model';
/**
 * Get suggestions from coveo
 * https://docs.coveo.com/en/1459/build-a-search-ui/get-query-suggestions#context-object
 *
 * @param query Search term
 * @returns
 */
export declare const getCoveoSuggestions: (query: string) => Promise<CoveoCompletion[]>;
