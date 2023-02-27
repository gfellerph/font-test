import { Environment, ILocalizedConfig, ILocalizedCustomConfig } from '../models/general.model';
import { NavMainEntity } from '../models/header.model';
import { IAvailableLanguage } from '../models/language.model';
export interface HeaderState {
  localizedConfig: ILocalizedConfig | null;
  currentLanguage: string | null;
  projectId: string | null;
  environment: Environment;
  search: boolean;
  login: boolean;
  meta: boolean;
  languageSwitchOverrides?: IAvailableLanguage[];
  localizedCustomConfig?: ILocalizedCustomConfig;
  osFlyoutOverrides?: NavMainEntity;
}
export declare const state: HeaderState, reset: () => void, dispose: () => void;
