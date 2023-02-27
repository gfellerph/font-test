import { h } from '@stencil/core';
export const PostFooterBlockList = (props) => {
  return (h("div", { class: "block-list" }, h("h3", null, props.block.title), h("ul", { class: "no-list box link-list" }, props.block.links &&
    props.block.links.map(link => (h("li", { key: link.url }, h("a", { class: "flyout-link", href: link.url, target: link.target }, link.text)))))));
};
//# sourceMappingURL=post-footer-block-list.component.js.map
