import { state } from '../../data/store';
// https://www.post.ch/api/trackandtrace?id=99.00.306600.01004883
// Track and trace URL
export const getTrackAndTraceApiUrl = (id) => {
  const lang = state.currentLanguage;
  return `https://www.post.ch/${lang}/api/trackandtrace?id=${encodeURIComponent(id)}`;
};
// Get the redire
export const getTrackAndTraceRedirectUrl = (query, { packageTrackingRedirectUrl }) => {
  return packageTrackingRedirectUrl.replace('{trackingNumber}', encodeURIComponent(query));
};
/**
 * Check whether a query is a tracking id
 *
 * @param query User query
 * @returns Boolean
 */
export const isParcel = async (query, searchConfig) => {
  const parcelInfo = await getParcelInfo(query, searchConfig);
  return parcelInfo.ok;
};
/**
 * Try to get parcel info from a query that is possibly a tracking id.
 * This is mainly used to check if a search should redirect to track&trace instead of the regular search.
 *
 * @param query User query that is possibly a tracking number
 * @returns Track and trace info
 */
export const getParcelInfo = async (query, { redirectPattern }) => {
  const trackingNrPattern = new RegExp(redirectPattern);
  if (trackingNrPattern.test(query)) {
    try {
      const trackAndTraceReqest = await fetch(getTrackAndTraceApiUrl(query));
      const trackAndTraceResult = await trackAndTraceReqest.json();
      return Object.assign(Object.assign({}, trackAndTraceResult), { ok: trackAndTraceResult.ok === 'true' });
    }
    catch (error) {
      console.warn(`Could not check track and trace API due to error: ${error.message}`);
    }
  }
  return { ok: false, timestamp: new Date().toDateString() };
};
/**
 * Get parcel info if query is a parcel or null
 *
 * @param query Parcel id
 * @returns Parcel info and a redirect url or null if not a parcel
 */
export const getParcelSuggestion = async (query, searchConfig) => {
  const parcelInfo = await getParcelInfo(query, searchConfig);
  return parcelInfo.ok
    ? Object.assign(Object.assign({}, parcelInfo), { url: getTrackAndTraceRedirectUrl(query, searchConfig) }) : null;
};
//# sourceMappingURL=parcel.service.js.map
