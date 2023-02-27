import { h } from '@stencil/core';
export const PostFooterBlockSocials = (props) => {
  return (h("div", { class: "block-socials" }, h("h3", null, props.content.title), h("ul", { class: "no-list socials" }, props.content.links.map(link => (h("li", { key: link.url }, h("a", { href: link.url, target: link.target }, h("span", { class: "visually-hidden" }, link.name), h("svg", { "aria-hidden": "true" }, h("use", { href: `#${link.icon}` })))))))));
};
//# sourceMappingURL=post-footer-block-socials.component.js.map
