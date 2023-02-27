import { EventEmitter } from '../../stencil-public-runtime';
import { DropdownElement, DropdownEvent, HasDropdown, NavLangEntity } from '../../models/header.model';
export declare class PostLanguageSwitch implements HasDropdown {
  mode: 'dropdown' | 'list';
  langSwitchOpen: boolean;
  host: DropdownElement;
  dropdownToggled: EventEmitter<DropdownEvent>;
  languageChanged: EventEmitter<string>;
  private languageSwitchDropdown;
  componentWillUpdate(): Promise<boolean> | undefined;
  componentDidUpdate(): void;
  /**
   * Open or close the language switch programatically
   * @param force Boolean to force a state
   * @returns Boolean indicating new state
   */
  toggleDropdown(force?: boolean): Promise<boolean>;
  /**
   * Emit a language change to the parent component
   *
   * @param newLang Config of the new language
   */
  switchLanguage(newLang: NavLangEntity): void;
  private getMergedLanguageConfig;
  private setDropdownRef;
  render(): any;
}
