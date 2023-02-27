import { GeocodeLocation } from '../../models/geocode.model';
/**
 * Query the Gis API for locations and localities (pois)
 *
 * @param query User input string
 * @returns
 */
export declare const queryPlaces: (query: string) => Promise<GeocodeLocation[]>;
/**
 * Try to highlight place suggestions
 * Limitation: accented chars are not handled by this basic function
 *
 * @param query Search term
 * @param place Name of the suggested place
 * @returns
 */
export declare const highlightPlacesString: (query: string | undefined, place: string) => string;
/**
 * Get the deeplink to any location found via geocoder
 *
 * @param location A location from the Gis API Geocode endpoint
 * @returns
 */
export declare const getPlacesUrl: (location: GeocodeLocation) => string;
