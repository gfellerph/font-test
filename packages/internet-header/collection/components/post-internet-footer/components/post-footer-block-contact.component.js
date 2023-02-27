import { h } from '@stencil/core';
const getContentHours = (hours) => hours.replace(/<[^>]*>?/gm, '');
const callUnblu = () => {
  if (typeof window['unbluLSLoad'] === 'function') {
    window['unbluLSLoad']();
  }
  else {
    console.error('swisspost-internet-footer: The function "unbluLSLoad" could not be called because it is not available in the global scope. Did you include the unblu live chat script on your page?');
  }
};
const LiveSupport = (props) => (h("button", { class: "hours btn btn-link", id: "liveSupport", type: "button", onClick: callUnblu, innerHTML: getContentHours(props.hours) }));
export const PostFooterBlockContact = (props) => {
  return (h("div", { class: "block-contact" }, h("h3", null, props.block.title), props.block.content &&
    props.block.content.map((content, index) => {
      const isLiveSupport = index === props.block.content.length - 1 && content.text === 'Live Support';
      if (isLiveSupport && !props.liveSupportEnabled) {
        return null;
      }
      return (h("div", { class: "content-row", key: content.name }, content.number ? h("p", { class: "number" }, content.number) : null, content.text ? h("p", { class: "text" }, content.text) : null, content.hours && isLiveSupport && h(LiveSupport, { hours: content.hours }), content.hours && !isLiveSupport && (
      // Some values arrive in the form of <p>8&emdash;12</p> and without replace and innerHTML, tags get rendered as text (project="klp" language="en" environment="int02")
      h("p", { class: "hours", innerHTML: getContentHours(content.hours) })), content.describe ? h("p", { class: "describe" }, content.describe) : null));
    })));
};
//# sourceMappingURL=post-footer-block-contact.component.js.map
