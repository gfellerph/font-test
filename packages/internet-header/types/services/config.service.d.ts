import { Environment, IPortalConfig, ILocalizedConfig, ICustomConfig, ILocalizedCustomConfig, LocalizedConfigParameters } from '../models/general.model';
import { NavMainEntity } from '../models/header.model';
/**
 * Get a localized config object
 *
 * @param projectId String identifying the project
 * @param language [optional] Preferred language
 * @returns Localized config object
 */
export declare const getLocalizedConfig: ({ projectId, environment, language, cookieKey, localStorageKey, activeRouteProp, localizedCustomConfig, osFlyoutOverrides, }: LocalizedConfigParameters) => Promise<ILocalizedConfig>;
/**
 * Merge portal config with custom os flyout overrides
 * @param config Localized config
 * @param osFlyoutOverrides Overrides for the flyout
 * @returns Merged localized config
 */
export declare const mergeOsFlyoutOverrides: (config: ILocalizedConfig, osFlyoutOverrides: NavMainEntity) => NavMainEntity[];
/**
 * Fetch the general config based on project id
 *
 * @returns Promise for Post Portal general config
 */
export declare const fetchConfig: (projectId: string, environment: Environment) => Promise<IPortalConfig>;
/**
 * Generate an URL with all necessary query params to get the configuration.
 * Project id "test" will return a test configuration
 * @param projectId string
 * @param environment int01, int02 or prod
 * @returns URL pointing to the project config
 */
export declare const generateConfigUrl: (projectId: string, environment: Environment) => string;
/**
 * Check if project id contains only URL safe characters
 *
 * @param projectId Project Id string
 * @returns The valid project id
 */
export declare const isValidProjectId: (projectId: string) => boolean;
/**
 * Get the localized config object from a custom config
 *
 * @param config String or json object of the custom config
 * @param language Specific language
 * @returns Localized custom config object
 */
export declare const getLocalizedCustomConfig: (config: string | ICustomConfig, language: string) => ILocalizedCustomConfig | undefined;
/**
 * Check if mobile header styles are applied or not
 * @returns True if browser is smaller than 1024px
 */
export declare const isMobile: () => boolean;
/**
 * Set unique ID's on main navigation entities but conserve flyout_os to be able to
 * identify the online-service flyout, which can be configured by osFlyoutOverrides
 */
export declare const setMainNavigationIds: (navMainEntities: NavMainEntity[]) => void;
