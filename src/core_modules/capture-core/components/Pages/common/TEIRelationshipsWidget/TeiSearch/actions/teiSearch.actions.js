import { actionCreator } from '../../../../../../actions/actions.utils';

export const batchActionTypes = {
    BATCH_SET_TEI_SEARCH_PROGRAM_AND_TET: 'RelationshipsWidget.BatchSetTeiSearchProgramAndTet',
    RESET_SEARCH_FORMS: 'RelationshipsWidget.ResetSearchForms',
};

export const actionTypes = {
    INITIALIZE_TEI_SEARCH: 'RelationshipsWidget.InitializeTeiSearch',
    REQUEST_SEARCH_TEI: 'RelationshipsWidget.RequestSearchTei',
    SEARCH_FORM_VALIDATION_FAILED: 'RelationshipsWidget.SearchFormValidationFailed',
    SEARCH_TEI_FAILED: 'RelationshipsWidget.SearchTeiFailed',
    SEARCH_TEI_RESULT_RETRIEVED: 'RelationshipsWidget.SearchTeiResultRetrieved',
    SET_TEI_SEARCH_PROGRAM_AND_TET: 'RelationshipsWidget.SetTeiSearchProgramAndTet',
    TEI_NEW_SEARCH: 'RelationshipsWidget.TeiNewSearch',
    TEI_EDIT_SEARCH: 'RelationshipsWidget.TeiEditSearch',
    TEI_SEARCH_RESULTS_CHANGE_PAGE: 'RelationshipsWidget.TeiSearchResultsChangePage',
    TEI_SEARCH_SET_OPEN_SEARCH_GROUP_SECTION: 'RelationshipsWidget.TeiSearchSetOpenSearchGroupSection',
    SEARCH_TE_IN_TET_SCOPE: 'RelationshipsWidget.SearchTrackedEntityInTETScope',
};


export const initializeTeiSearch = (searchId, programId, trackedEntityTypeId) =>
    actionCreator(actionTypes.INITIALIZE_TEI_SEARCH)({ searchId, programId, trackedEntityTypeId });

export const requestSearchTei = (
    formId,
    searchGroupId,
    searchId,
    resultsPageSize,
) =>
    actionCreator(actionTypes.REQUEST_SEARCH_TEI)({ formId, searchGroupId, searchId, resultsPageSize });

export const searchViaUniqueIdOnScopeTrackedEntityType = ({
    formId,
    searchGroupId,
    searchId,
    selectedProgramId,
    programQueryArgs,
}) =>
    actionCreator(actionTypes.SEARCH_TE_IN_TET_SCOPE)({
        formId,
        searchGroupId,
        searchId,
        selectedProgramId,
        programQueryArgs,
    });

export const searchTeiFailed = (
    formId,
    searchGroupId,
    searchId,
) =>
    actionCreator(actionTypes.SEARCH_TEI_FAILED)({ formId, searchGroupId, searchId });

export const searchTeiResultRetrieved = (
    data,
    formId,
    searchGroupId,
    searchId,
) =>
    actionCreator(actionTypes.SEARCH_TEI_RESULT_RETRIEVED)({ data, formId, searchGroupId, searchId });

export const setProgramAndTrackedEntityType = (searchId, programId, trackedEntityTypeId) =>
    actionCreator(actionTypes.SET_TEI_SEARCH_PROGRAM_AND_TET)({ searchId, programId, trackedEntityTypeId });

export const searchFormValidationFailed = (
    formId,
    searchGroupId,
    searchId,
) =>
    actionCreator(actionTypes.SEARCH_FORM_VALIDATION_FAILED)({ formId, searchGroupId, searchId });

export const teiNewSearch = (searchId) =>
    actionCreator(actionTypes.TEI_NEW_SEARCH)({ searchId });

export const teiEditSearch = (searchId) =>
    actionCreator(actionTypes.TEI_EDIT_SEARCH)({ searchId });

export const teiSearchResultsChangePage = (searchId, pageNumber, resultsPageSize) =>
    actionCreator(actionTypes.TEI_SEARCH_RESULTS_CHANGE_PAGE)({ searchId, pageNumber, resultsPageSize });

export const setOpenSearchGroupSection = (searchId, searchGroupId) =>
    actionCreator(actionTypes.TEI_SEARCH_SET_OPEN_SEARCH_GROUP_SECTION)({ searchId, searchGroupId });
