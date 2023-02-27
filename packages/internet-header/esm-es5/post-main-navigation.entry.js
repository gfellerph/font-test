var __awaiter=this&&this.__awaiter||function(t,i,e,n){function o(t){return t instanceof e?t:new e((function(i){i(t)}))}return new(e||(e=Promise))((function(e,a){function r(t){try{s(n.next(t))}catch(t){a(t)}}function l(t){try{s(n["throw"](t))}catch(t){a(t)}}function s(t){t.done?e(t.value):o(t.value).then(r,l)}s((n=n.apply(t,i||[])).next())}))};var __generator=this&&this.__generator||function(t,i){var e={label:0,sent:function(){if(a[0]&1)throw a[1];return a[1]},trys:[],ops:[]},n,o,a,r;return r={next:l(0),throw:l(1),return:l(2)},typeof Symbol==="function"&&(r[Symbol.iterator]=function(){return this}),r;function l(t){return function(i){return s([t,i])}}function s(l){if(n)throw new TypeError("Generator is already executing.");while(r&&(r=0,l[0]&&(e=0)),e)try{if(n=1,o&&(a=l[0]&2?o["return"]:l[0]?o["throw"]||((a=o["return"])&&a.call(o),0):o.next)&&!(a=a.call(o,l[1])).done)return a;if(o=0,a)l=[l[0]&2,a.value];switch(l[0]){case 0:case 1:a=l;break;case 4:e.label++;return{value:l[1],done:false};case 5:e.label++;o=l[1];l=[0];continue;case 7:l=e.ops.pop();e.trys.pop();continue;default:if(!(a=e.trys,a=a.length>0&&a[a.length-1])&&(l[0]===6||l[0]===2)){e=0;continue}if(l[0]===3&&(!a||l[1]>a[0]&&l[1]<a[3])){e.label=l[1];break}if(l[0]===6&&e.label<a[1]){e.label=a[1];a=l;break}if(a&&e.label<a[2]){e.label=a[2];e.ops.push(l);break}if(a[2])e.ops.pop();e.trys.pop();continue}l=i.call(t,e)}catch(t){l=[6,t];o=0}finally{n=a=0}if(l[0]&5)throw l[1];return{value:l[0]?l[1]:void 0,done:true}}};import{h,r as registerInstance,c as createEvent,H as Host,g as getElement}from"./index-9351b1b6.js";import{t as throttle}from"./index-d2256e06.js";import{c as clearAllBodyScrollLocks,d as disableBodyScroll,e as enableBodyScroll}from"./bodyScrollLock.esm-afcc00e3.js";import{s as state}from"./store-0dceecec.js";import{u as userPrefersReducedMotion}from"./ui.service-1d9b0f51.js";import{S as SvgSprite}from"./svg-sprite.component-ee66c88a.js";import{S as SvgIcon}from"./svg-icon.component-256596ec.js";var LevelOneAction=function(t){var i,e,n;var o=t.level.url?"a":"button";return h(o,{class:{"main-link":true,active:!!t.level.isActiveOverride,focus:t.isOpen},href:t.level.url,title:((i=t.level.title)===null||i===void 0?void 0:i.trim())&&((e=t.level.title)===null||e===void 0?void 0:e.trim())!==((n=t.level.text)===null||n===void 0?void 0:n.trim())?t.level.title:undefined,tabindex:t.level.url?undefined:0,"aria-haspopup":!t.level.noFlyout+"","aria-expanded":t.level.noFlyout?null:t.isOpen+"",onTouchEnd:function(i){return t.onTouchEnd(i)},onKeyDown:function(i){return t.onKeyDown(i)},onClick:function(i){return t.onClick(i)}},h("span",null,t.level.text),h("svg",{"aria-hidden":"true"},h("use",{href:"#pi-pointy-arrow-right"})))};var postMainNavigationCss='.flyout-nav,.flyout-column h3{font-size:0.9375rem;line-height:1.4}@media (min-width: 600px){.flyout-nav,.flyout-column h3{font-size:1rem}}@media (min-width: 1024px){.flyout-nav,.flyout-column h3{font-size:1.0625rem}}.flyout-title{font-size:1.0625rem;line-height:1.4}@media (min-width: 600px){.flyout-title{font-size:1.25rem}}@media (min-width: 1024px){.flyout-title{font-size:1.5rem;line-height:1.1}}*,:host,*::before,*::after{-webkit-box-sizing:border-box;box-sizing:border-box}button{font:inherit;padding:0}img,svg{max-width:100%;max-height:100%}@media (forced-colors: active){svg{color:white}}.main-container,.flyout-linklist,.no-list{list-style:none;padding-left:0;margin-top:0;margin-bottom:0}.btn-blank{background-color:transparent;border:none;border-radius:0;padding:0}.main-link,.flyout-close-button,.flyout-link,.nav-link{text-decoration:none;color:rgba(0, 0, 0, 0.8);-webkit-transition:color 200ms;transition:color 200ms;background-color:transparent;border-radius:0;-webkit-box-shadow:none;box-shadow:none;border:0;margin:0;display:-ms-flexbox;display:flex;-ms-flex-align:center;align-items:center;gap:0.5rem}.main-link:hover,.flyout-close-button:hover,.flyout-link:hover,.nav-link:hover,.main-link:focus,.flyout-close-button:focus,.flyout-link:focus,.nav-link:focus{color:black}.main-link>svg,.flyout-close-button>svg,.flyout-link>svg,.nav-link>svg{width:1.4em;height:1.4em;-ms-flex-negative:0;flex-shrink:0}.main-link>span,.flyout-close-button>span,.flyout-link>span,.nav-link>span{-ms-flex-negative:1;flex-shrink:1}.box>*:first-child{margin-top:0}.box>*:last-child{margin-bottom:0}.mirrored{-webkit-transform:scaleX(-1);transform:scaleX(-1)}.rotate-270{-webkit-transform:rotate(270deg);transform:rotate(270deg)}.bold{font-weight:700}.light{font-weight:300}.d-flex{display:-ms-flexbox;display:flex}.d-inline-flex{display:-ms-inline-flexbox;display:inline-flex}.align-items-center{-ms-flex-align:center;align-items:center}@media (min-width: 1441px){.wide-container{margin:0 auto;max-width:1440px}}@media (max-width: 599.98px){.container{padding-right:16px;padding-left:16px}}@media (min-width: 600px) and (max-width: 1023.98px){.container{padding-right:32px;padding-left:32px}}@media (min-width: 1024px){.container{padding-right:40px;padding-left:40px}}.visually-hidden{position:absolute;width:1px;height:1px;border:0;padding:0;margin:-1px;overflow:hidden;clip:rect(0 0 0 0)}@media (max-width: -0.02px){.hidden-xs{display:none}}@media (max-width: 399.98px){.hidden-sm{display:none}}@media (max-width: 599.98px){.hidden-rg{display:none}}@media (max-width: 779.98px){.hidden-md{display:none}}@media (max-width: 1023.98px){.hidden-lg{display:none}}@media (max-width: 1279.98px){.hidden-xl{display:none}}@media (max-width: 1440.98px){.hidden-xxl{display:none}}:host{--host-window-height:var(--window-height, 100vh);--calculated-header-height:calc(var(--header-height) + 1px);display:block;min-width:0;height:var(--header-height)}:host(.no-animation) *{-webkit-animation:none !important;animation:none !important;-webkit-transition:none !important;transition:none !important}@media (min-width: 1024px){.main-navigation,.main-container,.main-container li,.main-link{height:100%}}.main-navigation{font-size:1.125rem}@media (min-width: 1024px){.main-navigation{font-size:1rem;margin:0 0.75rem}}@media (min-width: 1280px){.main-navigation{font-size:1.125rem}}@media (min-width: 1441px){.main-navigation{font-size:1.25rem}}@media (max-width: 1023.98px){.main-navigation{position:absolute;top:var(--calculated-header-height);left:0;background:white;height:calc(var(--host-window-height) - var(--calculated-header-height));width:100%;margin:0;overflow:hidden scroll;-webkit-overflow-scrolling:touch;-ms-scroll-chaining:none;overscroll-behavior:contain;display:-ms-flexbox;display:flex;-ms-flex-direction:column;flex-direction:column;-ms-flex-pack:justify;justify-content:space-between;z-index:-1;visibility:hidden;-webkit-transform:translateY(-100%);transform:translateY(-100%);-webkit-transition:visibility 0.35s, -webkit-transform 0.35s;transition:visibility 0.35s, -webkit-transform 0.35s;transition:transform 0.35s, visibility 0.35s;transition:transform 0.35s, visibility 0.35s, -webkit-transform 0.35s}}@media (max-width: 1023.98px) and (prefers-reduced-motion: reduce){.main-navigation{-webkit-transition:none;transition:none}}@media (max-width: 1023.98px){.main-navigation.open{-webkit-transform:translateY(0);transform:translateY(0);visibility:visible}}.main-container{display:-ms-flexbox;display:flex;-ms-flex-align:center;align-items:center;-ms-flex-pack:start;justify-content:flex-start}@media (max-width: 1023.98px){.main-container{-ms-flex-direction:column;flex-direction:column;-ms-flex-align:stretch;align-items:stretch;-ms-flex-pack:start;justify-content:flex-start;padding-top:2.5rem;padding-bottom:2.5rem}.main-container>li+li{border-top:1px solid #e6e6e6}}@media (min-width: 1024px){.main-container{padding-right:0;padding-left:0}}.main-container>li{-ms-flex:0 1 auto;flex:0 1 auto;min-width:0}.main-link{display:-ms-flexbox;display:flex;-ms-flex-align:center;align-items:center;padding-right:0.75rem;padding-left:0.75rem;text-align:left;cursor:pointer;width:100%}@media (min-width: 1024px){.main-link svg{display:none}}@media (max-width: 1023.98px){.main-link{display:-ms-flexbox;display:flex;-ms-flex-pack:justify;justify-content:space-between;-ms-flex-align:center;align-items:center;font-weight:300;padding:0.625rem 0;width:100%;text-align:left}.main-link svg{width:1.5rem;height:1.5rem}}.main-link span{overflow:hidden;text-overflow:ellipsis}.main-link,.flyout-link{position:relative;color:black}.main-link::after,.flyout-link::after{content:"";position:absolute;bottom:-1px;left:0;width:100%;height:4px;background-color:transparent;opacity:0;-webkit-transform:scaleX(0.8);transform:scaleX(0.8);-webkit-transition:opacity 0.25s cubic-bezier(0.4, 0, 0.2, 1), -webkit-transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);transition:opacity 0.25s cubic-bezier(0.4, 0, 0.2, 1), -webkit-transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);transition:opacity 0.25s cubic-bezier(0.4, 0, 0.2, 1), transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);transition:opacity 0.25s cubic-bezier(0.4, 0, 0.2, 1), transform 0.25s cubic-bezier(0.4, 0, 0.2, 1), -webkit-transform 0.25s cubic-bezier(0.4, 0, 0.2, 1)}@media (prefers-reduced-motion: reduce){.main-link::after,.flyout-link::after{-webkit-transition:none;transition:none}}.main-link:hover::after,.main-link.focus::after,.flyout-link:hover::after,.flyout-link.focus::after{background-color:#cccccc;opacity:1;-webkit-transform:scale(1);transform:scale(1)}.main-link.active,.flyout-link.active{font-weight:700}.main-link.active::after,.flyout-link.active::after{background-color:#fc0;opacity:1;-webkit-transform:scale(1);transform:scale(1)}.flyout{left:0;width:100%;background:white;padding-bottom:3rem;overflow:auto;-ms-scroll-chaining:none;overscroll-behavior:contain;visibility:hidden}@media (min-width: 1024px){.flyout{position:absolute;top:100%;max-height:calc(100vh - var(--header-height) - var(--meta-header-height) - 1px);z-index:-1;-webkit-box-shadow:0 0 1px 0 rgba(0, 0, 0, 0.4);box-shadow:0 0 1px 0 rgba(0, 0, 0, 0.4);-webkit-transform:translateY(-100%);transform:translateY(-100%)}.flyout.open{-webkit-box-shadow:0 0 8px 0 rgba(0, 0, 0, 0.4);box-shadow:0 0 8px 0 rgba(0, 0, 0, 0.4);-webkit-transform:translateY(0);transform:translateY(0)}}@media (max-width: 1023.98px){.flyout{position:fixed;top:0;height:100%;z-index:1;-webkit-transform:translateX(100%);transform:translateX(100%)}.flyout.open{-webkit-transform:translateX(0);transform:translateX(0)}}.flyout.open{visibility:visible}.flyout.animate{-webkit-transition:visibility 0.35s, -webkit-transform 0.35s, -webkit-box-shadow 0.35s;transition:visibility 0.35s, -webkit-transform 0.35s, -webkit-box-shadow 0.35s;transition:transform 0.35s, visibility 0.35s, box-shadow 0.35s;transition:transform 0.35s, visibility 0.35s, box-shadow 0.35s, -webkit-transform 0.35s, -webkit-box-shadow 0.35s}@media (prefers-reduced-motion: reduce){.flyout.animate{-webkit-transition:none;transition:none}}.flyout-nav{display:-ms-flexbox;display:flex;-ms-flex-pack:justify;justify-content:space-between;min-height:3.5rem;-webkit-box-sizing:content-box;box-sizing:content-box}.flyout-row{display:-ms-flexbox;display:flex;gap:1.5rem}@media (max-width: 1023.98px){.flyout-row{display:grid;grid-template-columns:1fr 1fr}}@media (max-width: 599.98px){.flyout-row{grid-template-columns:1fr}}.flyout-column{-ms-flex:1;flex:1;max-width:25%}@media (max-width: 1023.98px){.flyout-column{max-width:none}}.flyout-column h3{margin-top:0}.flyout-back-button{display:-ms-flexbox;display:flex;-ms-flex-align:center;align-items:center;font-size:1rem;font-weight:400;cursor:pointer}@media (max-width: 599.98px){.flyout-back-button{padding-right:16px;padding-left:16px}}@media (min-width: 600px) and (max-width: 1023.98px){.flyout-back-button{padding-right:32px;padding-left:32px}}@media (min-width: 1024px){.flyout-back-button{padding-right:40px;padding-left:40px}}.flyout-back-button svg{width:1.5rem;height:1.5rem}@media (min-width: 1024px){.flyout-back-button{display:none}}.flyout-close-button{display:-ms-flexbox;display:flex;-ms-flex-align:center;align-items:center;margin-left:auto;padding:0 1.5rem;cursor:pointer}.flyout-close-button svg{width:1.5rem;height:1.5rem}@media (max-width: 1023.98px){.flyout-close-button{display:none}}.flyout-linklist li{border-top:1px solid #e6e6e6}.flyout-linklist:first-child>li{border-top-color:transparent}.flyout-link{display:block;padding:0.75rem 0}.flyout-title{margin:2.5rem 0 1.5rem 0}@media (min-width: 1024px){.flyout-title{display:none}}';var PostMainNavigation=function(){function t(t){registerInstance(this,t);this.dropdownToggled=createEvent(this,"dropdownToggled",7);this.flyoutToggled=createEvent(this,"flyoutToggled",7);this.resizeTimer=null;this.mouseLeaveTimer=null;this.mouseEnterTimer=null;this.activeFlyout=undefined;this.mobileMenuOpen=undefined}t.prototype.connectedCallback=function(){var t=this;this.throttledResize=throttle(300,(function(){return t.handleResize()}));window.addEventListener("resize",this.throttledResize,{passive:true});this.setWindowHeight()};t.prototype.disconnectedCallback=function(){window.removeEventListener("resize",this.throttledResize);clearAllBodyScrollLocks();if(this.mouseEnterTimer!==null)window.clearTimeout(this.mouseEnterTimer);if(this.mouseLeaveTimer!==null)window.clearTimeout(this.mouseLeaveTimer)};t.prototype.handleResize=function(){var t=this;this.host.classList.add("no-animation");if(this.resizeTimer!==null)window.clearTimeout(this.resizeTimer);this.resizeTimer=window.setTimeout((function(){t.host.classList.remove("no-animation")}),300);this.setWindowHeight()};t.prototype.setWindowHeight=function(){var t=this;if(!this.host){return}this.host.style.setProperty("--window-height","".concat(window.innerHeight,"px"));window.setTimeout((function(){t.host.style.setProperty("--window-height","".concat(window.innerHeight,"px"))}),100)};t.prototype.openFlyout=function(t){var i;var e=(i=this.host.shadowRoot)===null||i===void 0?void 0:i.getElementById(t);if(e&&this.activeFlyout!==""){this.addFlyoutAnimation(e)}this.activeFlyout=t;this.flyoutToggled.emit(t);this.setWindowHeight();if(this.mouseLeaveTimer!==null){window.clearTimeout(this.mouseLeaveTimer);this.mouseLeaveTimer=null}};t.prototype.closeFlyout=function(t){var i;if(t===undefined)return;var e=(i=this.host.shadowRoot)===null||i===void 0?void 0:i.getElementById(t);if(e){this.addFlyoutAnimation(e)}this.activeFlyout=null;this.flyoutToggled.emit()};t.prototype.addFlyoutAnimation=function(t){var i=this;if(!userPrefersReducedMotion()){t.classList.add("animate");t.addEventListener("transitionend",(function(){return i.removeFlyoutAnimation(t)}),{once:true})}};t.prototype.removeFlyoutAnimation=function(t){t.classList.remove("animate")};t.prototype.isActiveFlyout=function(t){return t===this.activeFlyout};t.prototype.handleMouseEnter=function(t){var i=this;if(this.mouseEnterTimer!==null){window.clearTimeout(this.mouseEnterTimer);this.mouseEnterTimer=null}if(this.mouseLeaveTimer&&this.activeFlyout===t.id){window.clearTimeout(this.mouseLeaveTimer);this.mouseLeaveTimer=null}if(window.innerWidth>=1024&&t.flyout.length>0&&this.activeFlyout!==t.id){this.mouseEnterTimer=window.setTimeout((function(){i.mouseEnterTimer=null;if(t.id!==undefined)i.openFlyout(t.id)}),200)}};t.prototype.handleMouseLeave=function(t){var i=this;if(this.mouseEnterTimer!==null){window.clearTimeout(this.mouseEnterTimer)}if(this.activeFlyout&&this.activeFlyout!==t.id){return}if(window.innerWidth>=1024&&t.flyout.length>0){this.mouseLeaveTimer=window.setTimeout((function(){i.closeFlyout(t.id)}),300)}};t.prototype.handleTouchEnd=function(t,i){if(!this.isActiveFlyout(i.id)&&!i.noFlyout){if(t.cancelable)t.preventDefault();if(i.id)this.openFlyout(i.id)}};t.prototype.handleKeyPress=function(t,i){if(t.key==="Enter"&&!this.isActiveFlyout(i.id)&&!i.noFlyout){t.preventDefault();if(i.id)this.openFlyout(i.id)}};t.prototype.handleClick=function(t,i){if(!this.isActiveFlyout(i.id)&&!i.noFlyout){t.preventDefault();if(i.id)this.openFlyout(i.id)}};t.prototype.setBodyScroll=function(){if(this.mobileMenuOpen){disableBodyScroll(this.flyoutElement)}else{enableBodyScroll(this.flyoutElement)}};t.prototype.toggleDropdown=function(t){return __awaiter(this,void 0,void 0,(function(){return __generator(this,(function(i){this.mobileMenuOpen=t===undefined?!this.mobileMenuOpen:t;this.dropdownToggled.emit({open:this.mobileMenuOpen,element:this.host});if(t===false){this.closeFlyout()}this.setBodyScroll();this.setWindowHeight();return[2,this.mobileMenuOpen]}))}))};t.prototype.setFocus=function(){return __awaiter(this,void 0,void 0,(function(){var t,i;return __generator(this,(function(e){i=(t=this.host.shadowRoot)===null||t===void 0?void 0:t.querySelector(".main-link");if(i){i.focus()}return[2]}))}))};t.prototype.setActiveFlyout=function(t){return __awaiter(this,void 0,void 0,(function(){return __generator(this,(function(i){this.activeFlyout=t;this.flyoutToggled.emit(this.activeFlyout);return[2]}))}))};t.prototype.render=function(){var t=this;var i;if(((i=state.localizedConfig)===null||i===void 0?void 0:i.header)===undefined)return;var e=state.localizedConfig.header;return h(Host,null,h(SvgSprite,null),h("nav",{id:"post-internet-header-main-navigation",class:{"main-navigation":true,open:this.mobileMenuOpen},ref:function(i){return t.flyoutElement=i}},h("h1",{class:"visually-hidden"},e.translations.navMainAriaLabel),h("ul",{class:"main-container container"},e.navMain.map((function(i){return h("li",{key:i.text,onMouseLeave:function(){return t.handleMouseLeave(i)},onMouseEnter:function(){return t.handleMouseEnter(i)}},h(LevelOneAction,{level:i,isOpen:t.isActiveFlyout(i.id),onTouchEnd:function(e){return t.handleTouchEnd(e,i)},onKeyDown:function(e){return t.handleKeyPress(e,i)},onClick:function(e){return t.handleClick(e,i)}}),!i.noFlyout?h("div",{id:i.id,class:{flyout:true,open:t.isActiveFlyout(i.id)}},h("div",{class:"wide-container"},h("div",{class:"flyout-nav"},h("button",{class:"nav-link flyout-back-button",onClick:function(){return t.closeFlyout(i.id)}},h(SvgIcon,{name:"pi-pointy-arrow-right",classNames:"mirrored"}),h("span",null,e.translations.backButtonText)),h("button",{class:"flyout-close-button",onClick:function(){return t.closeFlyout(i.id)}},h("span",{class:"visually-hidden"},e.translations.mobileNavToggleClose),h(SvgIcon,{name:"pi-close"}))),h("h2",{class:"flyout-title container"},h("a",{href:i.url,class:"nav-link"},i.text)),h("div",{class:"flyout-row container"},i.flyout.map((function(t){return h("div",{key:t.title,class:"flyout-column"},t.title?h("h3",null,t.title):null,h("ul",{class:"flyout-linklist"},t.linkList.map((function(t){return h("li",{key:t.url},h("a",{class:{"flyout-link":true,active:!!(t===null||t===void 0?void 0:t.isActiveOverride)},href:t.url,target:t.target},t.title))}))))}))))):null)}))),h("slot",null)))};Object.defineProperty(t.prototype,"host",{get:function(){return getElement(this)},enumerable:false,configurable:true});return t}();PostMainNavigation.style=postMainNavigationCss;export{PostMainNavigation as post_main_navigation};
//# sourceMappingURL=post-main-navigation.entry.js.map