import { PostKlpLoginWidget } from './post-klp-login-widget.js';
import { PostLanguageSwitch } from './post-language-switch.js';
import { PostLogo } from './post-logo.js';
import { PostMainNavigation } from './post-main-navigation.js';
import { PostMetaNavigation } from './post-meta-navigation.js';
import { PostSearch } from './post-search.js';
import { PostSkiplinks } from './post-skiplinks.js';
import { SwisspostInternetBreadcrumbs } from './swisspost-internet-breadcrumbs.js';
import { SwisspostInternetFooter } from './swisspost-internet-footer.js';
import { SwisspostInternetHeader } from './swisspost-internet-header.js';
export { setAssetPath, setNonce, setPlatformOptions } from '@stencil/core/internal/client';

const defineCustomElements = (opts) => {
  if (typeof customElements !== 'undefined') {
    [
      PostKlpLoginWidget,
      PostLanguageSwitch,
      PostLogo,
      PostMainNavigation,
      PostMetaNavigation,
      PostSearch,
      PostSkiplinks,
      SwisspostInternetBreadcrumbs,
      SwisspostInternetFooter,
      SwisspostInternetHeader,
    ].forEach(cmp => {
      if (!customElements.get(cmp.is)) {
        customElements.define(cmp.is, cmp, opts);
      }
    });
  }
};

export { defineCustomElements };

//# sourceMappingURL=index.js.map