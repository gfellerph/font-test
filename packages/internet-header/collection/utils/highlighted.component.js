import { h } from '@stencil/core';
export const HighlightedText = (props) => {
  var _a;
  const highlightClass = (_a = props.highlightClass) !== null && _a !== void 0 ? _a : 'bold';
  const highlightedString = props.text
    .replace(/{/g, `<span class=${highlightClass}>`)
    .replace(/}/g, '</span>')
    .replace(/[\[\]]/g, '');
  return h("span", { innerHTML: highlightedString });
};
//# sourceMappingURL=highlighted.component.js.map
