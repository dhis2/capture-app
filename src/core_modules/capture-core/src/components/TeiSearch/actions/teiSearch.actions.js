// @flow

import { actionCreator } from '../../../actions/actions.utils';

export const actionTypes = {
    INITIALIZE_TEI_SEARCH: 'InitializeTeiSearch',
    REQUEST_SEARCH_TEI: 'RequestSearchTei',
    SEARCH_TEI_FAILED: 'SearchTeiFailed',
    SEARCH_TEI_RESULT_RETRIEVED: 'SearchTeiResultRetrieved',
};


export const initializeTeiSearch = (searchId: string) =>
    actionCreator(actionTypes.INITIALIZE_TEI_SEARCH)({ searchId });

export const requestSearchTei = (
    formId: string,
    itemId: string,
    searchId: string,
    trackedEntityTypeId: string,
    programId: ?string,
) =>
    actionCreator(actionTypes.REQUEST_SEARCH_TEI)({ formId, itemId, searchId, trackedEntityTypeId, programId });

export const searchTeiFinished = (
    formId: string,
    itemId: string,
    searchId: string,
    trackedEntityTypeId: string,
    programId: ?string,
) =>
    actionCreator(actionTypes.REQUEST_SEARCH_TEI)({ formId, itemId, searchId, trackedEntityTypeId, programId });

export const searchTeiFailed = (
    formId: string,
    itemId: string,
    searchId: string,
) =>
    actionCreator(actionTypes.SEARCH_TEI_FAILED)({ formId, itemId, searchId });

export const searchTeiResultRetrieved = (
    data: any,
    formId: string,
    itemId: string,
    searchId: string,
) =>
    actionCreator(actionTypes.SEARCH_TEI_RESULT_RETRIEVED)({ data, formId, itemId, searchId });
