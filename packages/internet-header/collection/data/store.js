import { createStore } from '@stencil/store';
export const { state, reset, dispose } = createStore({
  projectId: null,
  currentLanguage: null,
  localizedConfig: null,
  environment: 'prod',
  search: true,
  login: true,
  meta: true,
});
//# sourceMappingURL=store.js.map
