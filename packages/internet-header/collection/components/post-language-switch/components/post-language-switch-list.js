import { h } from '@stencil/core';
import { translate } from '../../../services/language.service';
export const PostLanguageSwitchList = (props) => (h("nav", { class: "language-switch-dropdown", ref: e => props.dropdownRef(e) }, h("h3", { class: "visually-hidden" }, translate('Change language')), h("ul", null, props.navLang
  .filter(lang => !lang.isCurrent)
  .map(lang => {
  const TagName = lang.url === null ? 'button' : 'a';
  return (h("li", { key: lang.lang }, h(TagName, { onClick: () => props.switchLanguage(lang), href: lang.url, lang: lang.lang, title: lang.title }, h("span", { class: "visually-hidden" }, lang.title), h("span", { "aria-hidden": "true" }, lang.text))));
}))));
//# sourceMappingURL=post-language-switch-list.js.map
