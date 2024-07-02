// @flow

import { actionCreator } from '../../../actions/actions.utils';

export const batchActionTypes = {
    BATCH_SET_TEI_SEARCH_PROGRAM_AND_TET: 'BatchSetTeiSearchProgramAndTet',
    RESET_SEARCH_FORMS: 'ResetSearchForms',
};

export const actionTypes = {
    INITIALIZE_TEI_SEARCH: 'InitializeTeiSearch',
    REQUEST_SEARCH_TEI: 'RequestSearchTei',
    SEARCH_FORM_VALIDATION_FAILED: 'SearchFormValidationFailed',
    SEARCH_TEI_FAILED: 'SearchTeiFailed',
    SEARCH_TEI_RESULT_RETRIEVED: 'SearchTeiResultRetrieved',
    SET_TEI_SEARCH_PROGRAM_AND_TET: 'SetTeiSearchProgramAndTet',
    TEI_NEW_SEARCH: 'TeiNewSearch',
    TEI_EDIT_SEARCH: 'TeiEditSearch',
    TEI_SEARCH_RESULTS_CHANGE_PAGE: 'TeiSearchResultsChangePage',
    TEI_SEARCH_SET_OPEN_SEARCH_GROUP_SECTION: 'TeiSearchSetOpenSearchGroupSection',
    SEARCH_TE_IN_TET_SCOPE: 'SearchTrackedEntityInTETScope',
};


export const initializeTeiSearch = (searchId: string, programId: ?string, trackedEntityTypeId: ?string) =>
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
    formId: string,
    searchGroupId: string,
    searchId: string,
    selectedProgramId: string,
    programQueryArgs: any,
}) =>
    actionCreator(actionTypes.SEARCH_TE_IN_TET_SCOPE)({
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

export const setProgramAndTrackedEntityType = (searchId: string, programId: ?string, trackedEntityTypeId: ?string) =>
    actionCreator(actionTypes.SET_TEI_SEARCH_PROGRAM_AND_TET)({ searchId, programId, trackedEntityTypeId });

export const searchFormValidationFailed = (
    formId: string,
    searchGroupId: string,
    searchId: string,
) =>
    actionCreator(actionTypes.SEARCH_FORM_VALIDATION_FAILED)({ formId, searchGroupId, searchId });

export const teiNewSearch = (searchId: string) =>
    actionCreator(actionTypes.TEI_NEW_SEARCH)({ searchId });

export const teiEditSearch = (searchId: string) =>
    actionCreator(actionTypes.TEI_EDIT_SEARCH)({ searchId });

export const teiSearchResultsChangePage = (searchId: string, pageNumber: number, resultsPageSize: number) =>
    actionCreator(actionTypes.TEI_SEARCH_RESULTS_CHANGE_PAGE)({ searchId, pageNumber, resultsPageSize });

export const setOpenSearchGroupSection = (searchId: string, searchGroupId: ?string) =>
    actionCreator(actionTypes.TEI_SEARCH_SET_OPEN_SEARCH_GROUP_SECTION)({ searchId, searchGroupId });
