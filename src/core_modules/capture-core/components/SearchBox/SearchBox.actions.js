import { actionCreator } from '../../actions/actions.utils';

export const searchBoxActionTypes = {
    VIA_UNIQUE_ID_ON_SCOPE_PROGRAM_SEARCH: 'SearchViaUniqueIdOnScopeProgram',
    VIA_UNIQUE_ID_ON_SCOPE_TRACKED_ENTITY_TYPE_SEARCH: 'SearchViaUniqueIdOnScopeTrackedEntityType',
    VIA_ATTRIBUTES_ON_SCOPE_PROGRAM_SEARCH: 'SearchViaAttributesOnScopeProgram',
    VIA_ATTRIBUTES_ON_SCOPE_TRACKED_ENTITY_TYPE_SEARCH: 'SearchViaAttributesOnScopeTrackedEntityType',
    SEARCH_RESULTS_LOADING_VIEW: 'SearchResultsLoadingView',
    SEARCH_RESULTS_EMPTY_VIEW: 'SearchResultsEmptyView',
    SEARCH_RESULTS_SUCCESS_VIEW: 'SearchResultsSuccessView',
    ADD_SEARCH_RESULTS_SUCCESS_VIEW: 'AddSearchResultsSuccessView',
    SEARCH_RESULTS_ERROR_VIEW: 'SearchResultsErrorView',
    SEARCH_RESULTS_TOO_MANY_VIEW: 'SearchResultsTooManyView',
    SEARCH_RESULTS_INITIAL_VIEW: 'SearchResultsInitialView',
    CURRENT_SEARCH_INFO_SAVE: 'SaveCurrentSearchInfo',
    INITIAL_PROGRAM_ID_STORE: 'StoreInitialProgramId',
    FALLBACK_SEARCH_START: 'StartFallbackSearch',
    FALLBACK_SEARCH: 'FallbackSearchTakesPlace',
    FALLBACK_NOT_ENOUGH_ATTRIBUTES: 'FallbackNotEnoughAttributes',
    FALLBACK_SEARCH_COMPLETED: 'FallbackWillPushToSearchDomainWithoutProgramSelected',
    ALL_SEARCH_RELATED_DATA_CLEAN: 'CleanSearchRelatedData',
    FALLBACK_SEARCH_RELATED_DATA_CLEAN: 'CleanFallbackSearchRelatedData',
    SEARCH_UNIQUE_SEARCH_VALUE_EMPTY: 'SearchWithEmptyUniqueValue',
    NAVIGATE_TO_NEW_TRACKED_ENTITY_PAGE: 'NavigateToNewTrackedEntityPage',
};

export const saveCurrentSearchInfo = ({
    searchScopeType,
    searchScopeId,
    formId,
    currentSearchTerms,
}) => actionCreator(searchBoxActionTypes.CURRENT_SEARCH_INFO_SAVE)(
    { searchScopeType, searchScopeId, formId, currentSearchTerms });

export const searchViaUniqueIdOnScopeTrackedEntityType = ({ trackedEntityTypeId, formId }) =>
    actionCreator(searchBoxActionTypes.VIA_UNIQUE_ID_ON_SCOPE_TRACKED_ENTITY_TYPE_SEARCH)({ trackedEntityTypeId, formId });

export const searchViaUniqueIdOnScopeProgram = ({ programId, formId }) =>
    actionCreator(searchBoxActionTypes.VIA_UNIQUE_ID_ON_SCOPE_PROGRAM_SEARCH)({ programId, formId });

export const searchViaAttributesOnScopeTrackedEntityType = ({ trackedEntityTypeId, formId, page = 1, pageSize, triggeredFrom }) =>
    actionCreator(searchBoxActionTypes.VIA_ATTRIBUTES_ON_SCOPE_TRACKED_ENTITY_TYPE_SEARCH)({ trackedEntityTypeId, formId, page, pageSize, triggeredFrom });

export const searchViaAttributesOnScopeProgram = ({ programId, formId, page = 1, pageSize, triggeredFrom }) =>
    actionCreator(searchBoxActionTypes.VIA_ATTRIBUTES_ON_SCOPE_PROGRAM_SEARCH)({ programId, formId, page, pageSize, triggeredFrom });

export const showInitialViewOnSearchBox = () =>
    actionCreator(searchBoxActionTypes.SEARCH_RESULTS_INITIAL_VIEW)();

export const showErrorViewOnSearchBox = () =>
    actionCreator(searchBoxActionTypes.SEARCH_RESULTS_ERROR_VIEW)();

export const showTooManyResultsViewOnSearchBox = () =>
    actionCreator(searchBoxActionTypes.SEARCH_RESULTS_TOO_MANY_VIEW)();

export const showLoadingViewOnSearchBox = () =>
    actionCreator(searchBoxActionTypes.SEARCH_RESULTS_LOADING_VIEW)();

export const showEmptyResultsViewOnSearchBox = () =>
    actionCreator(searchBoxActionTypes.SEARCH_RESULTS_EMPTY_VIEW)();

export const showSuccessResultsViewOnSearchBox = (searchResults, currentPage) =>
    actionCreator(searchBoxActionTypes.SEARCH_RESULTS_SUCCESS_VIEW)({ searchResults, currentPage });

export const addSuccessResultsViewOnSearchBox = (otherResults, otherCurrentPage) =>
    actionCreator(searchBoxActionTypes.ADD_SEARCH_RESULTS_SUCCESS_VIEW)({ otherResults, otherCurrentPage });

export const startFallbackSearch = ({ programId, formId, page = 1, pageSize, availableSearchOptions }) =>
    actionCreator(searchBoxActionTypes.FALLBACK_SEARCH_START)({ programId, formId, page, pageSize, availableSearchOptions });

export const fallbackSearch = ({ fallbackFormValues, trackedEntityTypeId, pageSize, page = 1 }) =>
    actionCreator(searchBoxActionTypes.FALLBACK_SEARCH)({ fallbackFormValues, trackedEntityTypeId, pageSize, page });

export const fallbackPushPage = ({ orgUnitId, trackedEntityTypeId, values }) =>
    actionCreator(searchBoxActionTypes.FALLBACK_SEARCH_COMPLETED)({ orgUnitId, trackedEntityTypeId, values });

export const showFallbackNotEnoughAttributesOnSearchBox = ({ searchableFields, minAttributesRequiredToSearch }) =>
    actionCreator(searchBoxActionTypes.FALLBACK_NOT_ENOUGH_ATTRIBUTES)({ searchableFields, minAttributesRequiredToSearch });

export const cleanSearchRelatedData = () =>
    actionCreator(searchBoxActionTypes.ALL_SEARCH_RELATED_DATA_CLEAN)();

export const cleanFallbackRelatedData = () =>
    actionCreator(searchBoxActionTypes.FALLBACK_SEARCH_RELATED_DATA_CLEAN)();

export const showUniqueSearchValueEmptyModal = ({ uniqueTEAName }) =>
    actionCreator(searchBoxActionTypes.SEARCH_UNIQUE_SEARCH_VALUE_EMPTY)({ uniqueTEAName });

export const navigateToNewTrackedEntityPage = () =>
    actionCreator(searchBoxActionTypes.NAVIGATE_TO_NEW_TRACKED_ENTITY_PAGE)();
