import { actionCreator } from '../../../actions/actions.utils';

export const searchPageActionTypes = {
  VIA_UNIQUE_ID_ON_SCOPE_PROGRAM_SEARCH: 'SearchViaUniqueIdOnScopeProgram',
  VIA_UNIQUE_ID_ON_SCOPE_TRACKED_ENTITY_TYPE_SEARCH: 'SearchViaUniqueIdOnScopeTrackedEntityType',
  VIA_ATTRIBUTES_ON_SCOPE_PROGRAM_SEARCH: 'SearchViaAttributesOnScopeProgram',
  VIA_ATTRIBUTES_ON_SCOPE_TRACKED_ENTITY_TYPE_SEARCH: 'SearchViaAttributesOnScopeTrackedEntityType',
  SEARCH_RESULTS_LOADING_VIEW: 'SearchResultsLoadingView',
  SEARCH_RESULTS_EMPTY_VIEW: 'SearchResultsEmptyView',
  SEARCH_RESULTS_SUCCESS_VIEW: 'SearchResultsSuccessView',
  SEARCH_RESULTS_ERROR_VIEW: 'SearchResultsErrorView',
  SEARCH_RESULTS_TOO_MANY_VIEW: 'SearchResultsTooManyView',
  SEARCH_RESULTS_INITIAL_VIEW: 'SearchResultsInitialView',
  TO_MAIN_PAGE_NAVIGATE: 'NavigateToMainPage',
  CURRENT_SEARCH_INFO_SAVE: 'SaveCurrentSearchInfo',
  INITIAL_PROGRAM_ID_STORE: 'StoreInitialProgramId',
  FALLBACK_SEARCH_START: 'StartFallbackSearch',
  FALLBACK_SEARCH: 'FallbackSearchTakesPlace',
  FALLBACK_SEARCH_COMPLETED: 'FallbackWillPushToSearchPageWithoutProgramSelected',
  ALL_SEARCH_RELATED_DATA_CLEAN: 'CleanSearchRelatedData',
  FALLBACK_SEARCH_RELATED_DATA_CLEAN: 'CleanFallbackSearchRelatedData',
};

export const navigateToMainPage = () =>
  actionCreator(searchPageActionTypes.TO_MAIN_PAGE_NAVIGATE)();

export const saveCurrentSearchInfo = ({
  searchScopeType,
  searchScopeId,
  formId,
  currentSearchTerms,
}) =>
  actionCreator(searchPageActionTypes.CURRENT_SEARCH_INFO_SAVE)({
    searchScopeType,
    searchScopeId,
    formId,
    currentSearchTerms,
  });

export const searchViaUniqueIdOnScopeTrackedEntityType = ({ trackedEntityTypeId, formId }) =>
  actionCreator(searchPageActionTypes.VIA_UNIQUE_ID_ON_SCOPE_TRACKED_ENTITY_TYPE_SEARCH)({
    trackedEntityTypeId,
    formId,
  });

export const searchViaUniqueIdOnScopeProgram = ({ programId, formId }) =>
  actionCreator(searchPageActionTypes.VIA_UNIQUE_ID_ON_SCOPE_PROGRAM_SEARCH)({
    programId,
    formId,
  });

export const searchViaAttributesOnScopeTrackedEntityType = ({
  trackedEntityTypeId,
  formId,
  page = 1,
  pageSize,
  triggeredFrom,
}) =>
  actionCreator(searchPageActionTypes.VIA_ATTRIBUTES_ON_SCOPE_TRACKED_ENTITY_TYPE_SEARCH)({
    trackedEntityTypeId,
    formId,
    page,
    pageSize,
    triggeredFrom,
  });

export const searchViaAttributesOnScopeProgram = ({
  programId,
  formId,
  page = 1,
  pageSize,
  triggeredFrom,
}) =>
  actionCreator(searchPageActionTypes.VIA_ATTRIBUTES_ON_SCOPE_PROGRAM_SEARCH)({
    programId,
    formId,
    page,
    pageSize,
    triggeredFrom,
  });

export const showInitialViewOnSearchPage = () =>
  actionCreator(searchPageActionTypes.SEARCH_RESULTS_INITIAL_VIEW)();

export const showErrorViewOnSearchPage = () =>
  actionCreator(searchPageActionTypes.SEARCH_RESULTS_ERROR_VIEW)();

export const showTooManyResultsViewOnSearchPage = () =>
  actionCreator(searchPageActionTypes.SEARCH_RESULTS_TOO_MANY_VIEW)();

export const showLoadingViewOnSearchPage = () =>
  actionCreator(searchPageActionTypes.SEARCH_RESULTS_LOADING_VIEW)();

export const showEmptyResultsViewOnSearchPage = () =>
  actionCreator(searchPageActionTypes.SEARCH_RESULTS_EMPTY_VIEW)();

export const showSuccessResultsViewOnSearchPage = (searchResults, currentPage) =>
  actionCreator(searchPageActionTypes.SEARCH_RESULTS_SUCCESS_VIEW)({
    searchResults,
    currentPage,
  });

export const startFallbackSearch = ({
  programId,
  formId,
  page = 1,
  pageSize,
  availableSearchOptions,
}) =>
  actionCreator(searchPageActionTypes.FALLBACK_SEARCH_START)({
    programId,
    formId,
    page,
    pageSize,
    availableSearchOptions,
  });

export const fallbackSearch = ({ fallbackFormValues, trackedEntityTypeId, pageSize, page = 1 }) =>
  actionCreator(searchPageActionTypes.FALLBACK_SEARCH)({
    fallbackFormValues,
    trackedEntityTypeId,
    pageSize,
    page,
  });

export const fallbackPushPage = ({ orgUnitId, trackedEntityTypeId, values }) =>
  actionCreator(searchPageActionTypes.FALLBACK_SEARCH_COMPLETED)({
    orgUnitId,
    trackedEntityTypeId,
    values,
  });

export const cleanSearchRelatedData = () =>
  actionCreator(searchPageActionTypes.ALL_SEARCH_RELATED_DATA_CLEAN)();

export const cleanFallbackRelatedData = () =>
  actionCreator(searchPageActionTypes.FALLBACK_SEARCH_RELATED_DATA_CLEAN)();
