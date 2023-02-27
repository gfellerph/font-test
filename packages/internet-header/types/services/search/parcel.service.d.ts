import { ISearchConfig } from '../../models/header.model';
import { TrackAndTraceInfo } from '../../models/track-and-trace.model';
export declare const getTrackAndTraceApiUrl: (id: string) => string;
export declare const getTrackAndTraceRedirectUrl: (query: string, { packageTrackingRedirectUrl }: ISearchConfig) => string;
/**
 * Check whether a query is a tracking id
 *
 * @param query User query
 * @returns Boolean
 */
export declare const isParcel: (query: string, searchConfig: ISearchConfig) => Promise<boolean>;
/**
 * Try to get parcel info from a query that is possibly a tracking id.
 * This is mainly used to check if a search should redirect to track&trace instead of the regular search.
 *
 * @param query User query that is possibly a tracking number
 * @returns Track and trace info
 */
export declare const getParcelInfo: (query: string, { redirectPattern }: ISearchConfig) => Promise<TrackAndTraceInfo>;
/**
 * Get parcel info if query is a parcel or null
 *
 * @param query Parcel id
 * @returns Parcel info and a redirect url or null if not a parcel
 */
export declare const getParcelSuggestion: (query: string, searchConfig: ISearchConfig) => Promise<(TrackAndTraceInfo & {
  url: string;
}) | null>;
