import { ActiveRouteProp } from '../models/general.model';
import { NavMainEntity, MainNavScoreList } from '../models/header.model';
/**
 * Activate the current route based on the config and the match mode
 * @param config Main Navigation Config
 * @param activeRouteProp Match mode
 * @returns Modified Main Navigation Config
 */
export declare const markActiveRoute: (config: NavMainEntity[], activeRouteProp: ActiveRouteProp) => NavMainEntity[];
/**
 * Check if the portal config set any active route
 * @param config Main navigation config
 * @returns True if portal set any route as active
 */
export declare const hasActivePortalRoute: (config: NavMainEntity[]) => boolean;
export declare const resetActiveStateToPortalConfig: (config: NavMainEntity[]) => NavMainEntity[];
/**
 * Compile a list of scores based on the map mode, sorted in descending order
 * @param config Main Nav Config
 * @param compareUrl Current Browser URL or a custom URL
 * @param activeRouteProp Match mode
 * @returns A list of scored URLs if any matched
 */
export declare const compileScoreList: (config: NavMainEntity[], compareUrl: URL, activeRouteProp: ActiveRouteProp) => MainNavScoreList;
/**
 * Compare two URLs for similarity based on a match mode
 * @param baseUrl Browser URL
 * @param compareUrl Navigatgion URL
 * @param matchMode exact or auto matching
 * @returns Score
 */
export declare const compareRoutes: (baseUrl: URL, compareUrl: URL, matchMode?: 'auto' | 'exact') => number;
/**
 * Check how many items in an array match
 * @param a Base array
 * @param b Compare array
 * @returns Score
 */
export declare const getSimilarityScore: (a: string[], b: string[]) => number;
