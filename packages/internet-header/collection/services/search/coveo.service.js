import { state } from '../../data/store';
import { coveo } from './coveo.settings';
import { getSearchPageUrl } from './search.service';
/**
 * Get suggestions from coveo
 * https://docs.coveo.com/en/1459/build-a-search-ui/get-query-suggestions#context-object
 *
 * @param query Search term
 * @returns
 */
export const getCoveoSuggestions = async (query) => {
  var _a, _b;
  if (((_b = (_a = state.localizedConfig) === null || _a === void 0 ? void 0 : _a.header) === null || _b === void 0 ? void 0 : _b.search) === undefined)
    return [];
  const config = state.localizedConfig.header.search;
  const { token, organisation } = coveo.environment[state.environment];
  const url = `${coveo.url}?q=${query}&locale=${state.currentLanguage}&searchHub=${config.searchHubName}&pipeline=${config.searchPipelineName}&organizationId=${organisation}`;
  let coveoCompletions;
  try {
    const coveoResponse = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const coveoJSON = (await coveoResponse.json());
    coveoCompletions = coveoJSON.completions.map(completion => (Object.assign(Object.assign({}, completion), { redirectUrl: getSearchPageUrl(completion.expression) })));
  }
  catch (error) {
    console.error('Connection to coveo failed. Did you add "*.coveo.com" to your connect-src content security policy and tried turning off your adblocker?');
  }
  return coveoCompletions === undefined ? [] : coveoCompletions;
};
//# sourceMappingURL=coveo.service.js.map
