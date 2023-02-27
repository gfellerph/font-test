import '../../assets/js/klp-login-widget.js';
export const initializeKLPLoginWidget = (containerId, options) => {
  if (!options) {
    return;
  }
  try {
    window.OPPklpWidget = window.klpWidgetDev(containerId, options.applicationId, options.serviceId, options.appLoginUrl, null, // would be menulinks, but they are not provided anymore from Post-Portal
    options.currentLang, options.platform, options.options, options.environment);
  }
  catch (error) {
    console.error(error);
  }
};
//# sourceMappingURL=klp-widget.controller.js.map
