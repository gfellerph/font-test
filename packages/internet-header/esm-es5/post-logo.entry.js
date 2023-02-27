import{h,r as registerInstance,H as Host,g as getElement}from"./index-9351b1b6.js";import{t as throttle}from"./index-d2256e06.js";import{s as state}from"./store-0dceecec.js";var LogoSprite=function(){return h("svg",{"aria-hidden":"true",style:{display:"none"}},h("symbol",{id:"favicon",viewBox:"0 0 48 48"},h("g",{"clip-path":"url(#a)"},h("path",{fill:"#FC0",d:"M47.2 0H0v47.2h47.2V0Z"}),h("path",{fill:"#fff","fill-rule":"evenodd",d:"m18.68 35.91 1.48-7.02H6.42l-1.47 7.02h13.73Z","clip-rule":"evenodd"}),h("path",{fill:"#000","fill-rule":"evenodd",d:"M16.96 16.56c-.47-.07-.94-.1-1.42-.1H11.6L8.5 31.1h3.1l.95-4.47h1.8c.74.02 1.48-.07 2.18-.27a5.8 5.8 0 0 0 4-4.59c.49-2.73-.87-4.76-3.57-5.2Zm.47 5.06a2.63 2.63 0 0 1-2.06 2.22c-.33.06-.66.1-1 .1h-1.25l1-4.78h1.36c.31-.01.62.03.92.11.77.26 1.24 1.03 1.03 2.35","clip-rule":"evenodd"}),h("path",{fill:"red","fill-rule":"evenodd",d:"m34.5 16.43 1.86-8.84H24.63l-2.45 11.58h2.9l1.87-8.84h5.93L31 19.17h8.8l-1.17 5.53h-8.75l-1.75 8.28H21.5l-.57 2.78h9.54l1.75-8.3h8.72l2.34-11.03H34.5Z","clip-rule":"evenodd"})),h("defs",null,h("clipPath",{id:"a"},h("path",{fill:"#fff",d:"M0 0h47.2v47.2H0z"})))))};var FaviconSvg=function(e){return h("svg",{viewBox:"0 0 48 48",class:e.className,"aria-hidden":"true"},h("use",{href:"#favicon"}))};var postLogoCss="*,:host,*::before,*::after{-webkit-box-sizing:border-box;box-sizing:border-box}button{font:inherit;padding:0}img,svg{max-width:100%;max-height:100%}@media (forced-colors: active){svg{color:white}}.no-list{list-style:none;padding-left:0;margin-top:0;margin-bottom:0}.btn-blank{background-color:transparent;border:none;border-radius:0;padding:0}.nav-link{text-decoration:none;color:rgba(0, 0, 0, 0.8);-webkit-transition:color 200ms;transition:color 200ms;background-color:transparent;border-radius:0;-webkit-box-shadow:none;box-shadow:none;border:0;margin:0;display:-ms-flexbox;display:flex;-ms-flex-align:center;align-items:center;gap:0.5rem}.nav-link:hover,.nav-link:focus{color:black}.nav-link>svg{width:1.4em;height:1.4em;-ms-flex-negative:0;flex-shrink:0}.nav-link>span{-ms-flex-negative:1;flex-shrink:1}.box>*:first-child{margin-top:0}.box>*:last-child{margin-bottom:0}.mirrored{-webkit-transform:scaleX(-1);transform:scaleX(-1)}.rotate-270{-webkit-transform:rotate(270deg);transform:rotate(270deg)}.bold{font-weight:700}.light{font-weight:300}.d-flex{display:-ms-flexbox;display:flex}.d-inline-flex{display:-ms-inline-flexbox;display:inline-flex}.align-items-center{-ms-flex-align:center;align-items:center}@media (min-width: 1441px){.wide-container{margin:0 auto;max-width:1440px}}@media (max-width: 599.98px){.container{padding-right:16px;padding-left:16px}}@media (min-width: 600px) and (max-width: 1023.98px){.container{padding-right:32px;padding-left:32px}}@media (min-width: 1024px){.container{padding-right:40px;padding-left:40px}}.visually-hidden{position:absolute;width:1px;height:1px;border:0;padding:0;margin:-1px;overflow:hidden;clip:rect(0 0 0 0)}@media (max-width: -0.02px){.hidden-xs{display:none}}@media (max-width: 399.98px){.hidden-sm{display:none}}@media (max-width: 599.98px){.hidden-rg{display:none}}@media (max-width: 779.98px){.hidden-md{display:none}}@media (max-width: 1023.98px){.hidden-lg{display:none}}@media (max-width: 1279.98px){.hidden-xl{display:none}}@media (max-width: 1440.98px){.hidden-xxl{display:none}}:host{display:block}.logo{display:block;-ms-flex-align:center;align-items:center;background:#fc0}svg,.logo-svg{display:block;height:var(--header-height)}.square-logo{display:block}@media (min-width: 400px){.square-logo{display:none}}.full-logo{display:none}@media (min-width: 400px){.full-logo{display:block}}";var PostLogo=function(){function e(e){var i=this;registerInstance(this,e);this.showFaviconLogo=undefined;this.throttledResize=throttle(300,(function(){return i.handleResize()}));window.addEventListener("resize",this.throttledResize,{passive:true});this.resizeObserver=new ResizeObserver(this.handleResize.bind(this));this.handleResize()}e.prototype.componentDidLoad=function(){var e;var i=(e=this.host.parentElement)===null||e===void 0?void 0:e.querySelector(".main-navigation-controls");if(i){this.resizeObserver.observe(i)}};e.prototype.disconnectedCallback=function(){window.removeEventListener("resize",this.throttledResize);this.resizeObserver.disconnect()};e.prototype.handleResize=function(){var e,i;var o=(e=this.host.parentElement)===null||e===void 0?void 0:e.querySelector(".main-navigation-controls");var t=(i=this.host.parentElement)===null||i===void 0?void 0:i.querySelector(".menu-button");if(o&&t)this.showFaviconLogo=window.innerWidth-(150+o.clientWidth+t.clientWidth)<=0};e.prototype.render=function(){var e;if(((e=state.localizedConfig)===null||e===void 0?void 0:e.header.logo)===undefined)return;var i=state.localizedConfig.header.logo;return h(Host,null,h(LogoSprite,null),h("a",{href:i.logoLink,class:"logo"},h("span",{class:"visually-hidden"},i.logoLinkTitle),h(FaviconSvg,{className:"square-logo"}),h("img",{class:"logo-svg full-logo",src:i.logoSvg,alt:i.logoText})))};Object.defineProperty(e.prototype,"host",{get:function(){return getElement(this)},enumerable:false,configurable:true});return e}();PostLogo.style=postLogoCss;export{PostLogo as post_logo};
//# sourceMappingURL=post-logo.entry.js.map