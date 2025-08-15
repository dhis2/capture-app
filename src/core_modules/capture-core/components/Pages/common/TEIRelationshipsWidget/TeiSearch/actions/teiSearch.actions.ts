import { actionCreator } from '../../../../../../actions/actions.utils';

export const actionTypes = {
    INITIALIZE_TEI_SEARCH: 'InitializeTeiSearch',
    REQUEST_SEARCH_TEI: 'RequestSearchTei',
    SEARCH_VIA_UNIQUE_ID_ON_SCOPE_TRACKED_ENTITY_TYPE: 'SearchViaUniqueIdOnScopeTrackedEntityType',
    SEARCH_TEI_FAILED: 'SearchTeiFailed',
    SEARCH_TEI_RESULT_RETRIEVED: 'SearchTeiResultRetrieved',
    SET_TEI_SEARCH_PROGRAM_AND_TET: 'SetTeiSearchProgramAndTet',
    SEARCH_FORM_VALIDATION_FAILED: 'SearchFormValidationFailed',
    RESET_SEARCH_FORM_VALIDATION_FAILED: 'ResetSearchFormValidationFailed',
    SEARCH_TEI_RESULT_COUNT_RETRIEVED: 'SearchTeiResultCountRetrieved',
    SEARCH_TEI_RESULT_COUNT_FAILED: 'SearchTeiResultCountFailed',
    REQUEST_SEARCH_TEI_RESULT_COUNT: 'RequestSearchTeiResultCount',
    SEARCH_TEI_RESULT_CHANGE_PAGE: 'SearchTeiResultChangePage',
    SEARCH_TEI_RESULT_RESET_PAGE: 'SearchTeiResultResetPage',
    SEARCH_TEI_RESULT_RESET: 'SearchTeiResultReset',
    SEARCH_TEI_RESULT_RESET_ALL: 'SearchTeiResultResetAll',
    SEARCH_TEI_RESULT_RESET_PROGRAM_AND_TET: 'SearchTeiResultResetProgramAndTet',
    SEARCH_TEI_RESULT_RESET_SEARCH_GROUPS: 'SearchTeiResultResetSearchGroups',
    SEARCH_TEI_RESULT_RESET_SEARCH_GROUPS_AND_PROGRAM_AND_TET: 'SearchTeiResultResetSearchGroupsAndProgramAndTet',
    SEARCH_TEI_RESULT_RESET_SEARCH_GROUPS_AND_PROGRAM_AND_TET_AND_SEARCH_FORM: 'SearchTeiResultResetSearchGroupsAndProgramAndTetAndSearchForm',
    SEARCH_TEI_RESULT_RESET_SEARCH_FORM: 'SearchTeiResultResetSearchForm',
    SEARCH_TEI_RESULT_RESET_SEARCH_FORM_AND_SEARCH_GROUPS: 'SearchTeiResultResetSearchFormAndSearchGroups',
    SEARCH_TEI_RESULT_RESET_SEARCH_FORM_AND_SEARCH_GROUPS_AND_PROGRAM_AND_TET: 'SearchTeiResultResetSearchFormAndSearchGroupsAndProgramAndTet',
    SEARCH_TEI_RESULT_RESET_SEARCH_FORM_AND_PROGRAM_AND_TET: 'SearchTeiResultResetSearchFormAndProgramAndTet',
    SEARCH_TEI_RESULT_RESET_SEARCH_FORM_AND_PROGRAM_AND_TET_AND_SEARCH_GROUPS: 'SearchTeiResultResetSearchFormAndProgramAndTetAndSearchGroups',
    TEI_NEW_SEARCH: 'TeiNewSearch',
    TEI_EDIT_SEARCH: 'TeiEditSearch',
    TEI_SEARCH_RESULTS_CHANGE_PAGE: 'SearchTeiResultChangePage',
    TEI_SEARCH_SET_OPEN_SEARCH_GROUP_SECTION: 'TeiSearchSetOpenSearchGroupSection',
};

export const initializeTeiSearch = (searchId: string, programId?: string, trackedEntityTypeId?: string) =>
    actionCreator(actionTypes.INITIALIZE_TEI_SEARCH)({ searchId, programId, trackedEntityTypeId });

export const requestSearchTei = (
    formId: string,
    searchGroupId: string,
    searchId: string,
    resultsPageSize: number,
) =>
    actionCreator(actionTypes.REQUEST_SEARCH_TEI)({ formId, searchGroupId, searchId, resultsPageSize });

export const searchViaUniqueIdOnScopeTrackedEntityType = ({
    formId,
    searchGroupId,
    searchId,
    selectedProgramId,
    programQueryArgs,
}: {
    formId: string;
    searchGroupId: string;
    searchId: string;
    selectedProgramId?: string;
    programQueryArgs?: {
        program: string;
    };
}) =>
    actionCreator(actionTypes.SEARCH_VIA_UNIQUE_ID_ON_SCOPE_TRACKED_ENTITY_TYPE)({
        formId,
        searchGroupId,
        searchId,
        selectedProgramId,
        programQueryArgs,
    });

export const searchTeiFailed = (
    formId: string,
    searchGroupId: string,
    searchId: string,
) =>
    actionCreator(actionTypes.SEARCH_TEI_FAILED)({ formId, searchGroupId, searchId });

export const searchTeiResultRetrieved = (
    data: any,
    formId: string,
    searchGroupId: string,
    searchId: string,
) =>
    actionCreator(actionTypes.SEARCH_TEI_RESULT_RETRIEVED)({ data, formId, searchGroupId, searchId });

export const setProgramAndTrackedEntityType = (searchId: string, programId?: string, trackedEntityTypeId?: string) =>
    actionCreator(actionTypes.SET_TEI_SEARCH_PROGRAM_AND_TET)({ searchId, programId, trackedEntityTypeId });

export const searchFormValidationFailed = (
    formId: string,
    searchGroupId: string,
    searchId: string,
) =>
    actionCreator(actionTypes.SEARCH_FORM_VALIDATION_FAILED)({ formId, searchGroupId, searchId });

export const resetSearchFormValidationFailed = (
    formId: string,
    searchGroupId: string,
    searchId: string,
) =>
    actionCreator(actionTypes.RESET_SEARCH_FORM_VALIDATION_FAILED)({ formId, searchGroupId, searchId });

export const searchTeiResultCountRetrieved = (
    count: number,
    formId: string,
    searchGroupId: string,
    searchId: string,
) =>
    actionCreator(actionTypes.SEARCH_TEI_RESULT_COUNT_RETRIEVED)({ count, formId, searchGroupId, searchId });

export const searchTeiResultCountFailed = (
    formId: string,
    searchGroupId: string,
    searchId: string,
) =>
    actionCreator(actionTypes.SEARCH_TEI_RESULT_COUNT_FAILED)({ formId, searchGroupId, searchId });

export const requestSearchTeiResultCount = (
    formId: string,
    searchGroupId: string,
    searchId: string,
) =>
    actionCreator(actionTypes.REQUEST_SEARCH_TEI_RESULT_COUNT)({ formId, searchGroupId, searchId });

export const searchTeiResultChangePage = (
    formId: string,
    searchGroupId: string,
    searchId: string,
    currentPage: number,
) =>
    actionCreator(actionTypes.SEARCH_TEI_RESULT_CHANGE_PAGE)({ formId, searchGroupId, searchId, currentPage });

export const searchTeiResultResetPage = (
    formId: string,
    searchGroupId: string,
    searchId: string,
) =>
    actionCreator(actionTypes.SEARCH_TEI_RESULT_RESET_PAGE)({ formId, searchGroupId, searchId });

export const searchTeiResultReset = (
    formId: string,
    searchGroupId: string,
    searchId: string,
) =>
    actionCreator(actionTypes.SEARCH_TEI_RESULT_RESET)({ formId, searchGroupId, searchId });

export const searchTeiResultResetAll = (searchId: string) =>
    actionCreator(actionTypes.SEARCH_TEI_RESULT_RESET_ALL)({ searchId });

export const searchTeiResultResetProgramAndTet = (searchId: string) =>
    actionCreator(actionTypes.SEARCH_TEI_RESULT_RESET_PROGRAM_AND_TET)({ searchId });

export const searchTeiResultResetSearchGroups = (searchId: string) =>
    actionCreator(actionTypes.SEARCH_TEI_RESULT_RESET_SEARCH_GROUPS)({ searchId });

export const searchTeiResultResetSearchGroupsAndProgramAndTet = (searchId: string) =>
    actionCreator(actionTypes.SEARCH_TEI_RESULT_RESET_SEARCH_GROUPS_AND_PROGRAM_AND_TET)({ searchId });

export const searchTeiResultResetSearchGroupsAndProgramAndTetAndSearchForm = (searchId: string) =>
    actionCreator(actionTypes.SEARCH_TEI_RESULT_RESET_SEARCH_GROUPS_AND_PROGRAM_AND_TET_AND_SEARCH_FORM)({ searchId });

export const searchTeiResultResetSearchForm = (searchId: string) =>
    actionCreator(actionTypes.SEARCH_TEI_RESULT_RESET_SEARCH_FORM)({ searchId });

export const searchTeiResultResetSearchFormAndSearchGroups = (searchId: string) =>
    actionCreator(actionTypes.SEARCH_TEI_RESULT_RESET_SEARCH_FORM_AND_SEARCH_GROUPS)({ searchId });

export const searchTeiResultResetSearchFormAndSearchGroupsAndProgramAndTet = (searchId: string) =>
    actionCreator(actionTypes.SEARCH_TEI_RESULT_RESET_SEARCH_FORM_AND_SEARCH_GROUPS_AND_PROGRAM_AND_TET)({ searchId });

export const searchTeiResultResetSearchFormAndProgramAndTet = (searchId: string) =>
    actionCreator(actionTypes.SEARCH_TEI_RESULT_RESET_SEARCH_FORM_AND_PROGRAM_AND_TET)({ searchId });

export const searchTeiResultResetSearchFormAndProgramAndTetAndSearchGroups = (searchId: string) =>
    actionCreator(actionTypes.SEARCH_TEI_RESULT_RESET_SEARCH_FORM_AND_PROGRAM_AND_TET_AND_SEARCH_GROUPS)({ searchId });
