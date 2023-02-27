import { IsFocusable } from '../../models/header.model';
export declare class PostKlpLoginWidget implements IsFocusable {
  host: HTMLElement;
  componentDidLoad(): Promise<void>;
  /**
   * Sets the focus on the login button
   */
  setFocus(): Promise<void>;
  render(): any;
}
