import { h } from '@stencil/core';
import { PostFooterBlockSocials } from './post-footer-block-socials.component';
export const PostFooterBlockAddress = (props) => {
  return (h("div", { class: "block-address" }, h("h3", null, props.block.title), props.block.content &&
    props.block.content
      .filter(content => content.address)
      .map(content => (h("address", { class: "vcard", key: content.address }, h("span", { class: "adr", innerHTML: content.address })))), props.block.content &&
    props.block.content
      .filter(content => content.links && content.links.length)
      .map(content => h(PostFooterBlockSocials, { key: content.name, content: content }))));
};
//# sourceMappingURL=post-footer-block-address.component.js.map
