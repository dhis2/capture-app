// @flow
import { actionCreator } from 'capture-core/actions/actions.utils';

export const actionTypes = {
    UPDATE_MAIN_SELECTIONS: 'UpdateMainSelections',
    MAIN_SELECTIONS_COMPLETED: 'MainSelectionsCompleted',
    WORKING_LIST_DATA_RETRIEVED: 'WorkingListDataRetrieved',
    WORKING_LIST_DATA_RETRIEVAL_FAILED: 'WorkingListDataRetrievalFailed',
    WORKING_LIST_DATA_RETRIEVAL_CANCELED: 'WorkingListDataRetrievalCanceled',
    ORG_UNIT_DATA_RETRIVED: 'OrgUnitDataRetrived',
    UPDATE_MAIN_SELECTIONS_FROM_URL: 'UpdateMainSelectionsFromUrl',
    SET_ORG_UNIT_BASED_ON_URL: 'SetOrgUnitBasedOnUrl',
    INVALID_ORG_UNIT_FROM_URL: 'InvalidOrgUnitFromUrl',
    ERROR_RETRIEVING_ORG_UNIT_BASED_ON_URL: 'ErrorRetrievingOrgUnitBasedOnUrl',
    SET_EMPTY_ORG_UNIT_BASED_ON_URL: 'SetEmptyOrgUnitBasedOnUrl',
    INVALID_SELECTIONS_FROM_URL: 'InvalidSelectionsFromUrl',
    VALID_SELECTIONS_FROM_URL: 'ValidSelectionsFromUrl',
};

export const updateMainSelections =
    (selections: Object) => actionCreator(actionTypes.UPDATE_MAIN_SELECTIONS)(selections);

export const mainSelectionCompleted =
    () => actionCreator(actionTypes.MAIN_SELECTIONS_COMPLETED)();

export const workingListInitialDataRetrieved =
    (data: Object) => actionCreator(actionTypes.WORKING_LIST_DATA_RETRIEVED)(data);

export const workingListInitialRetrievalFailed =
    (errorMessage: string) => actionCreator(actionTypes.WORKING_LIST_DATA_RETRIEVAL_FAILED)(errorMessage);

export const workingListDataRetrievalCanceled =
    () => actionCreator(actionTypes.WORKING_LIST_DATA_RETRIEVAL_CANCELED)();

export const orgUnitDataRetrived =
    (orgUnit: Object) => actionCreator(actionTypes.ORG_UNIT_DATA_RETRIVED)(orgUnit);

// url-specific

export const updateMainSelectionsFromUrl =
    (data: Object) => actionCreator(actionTypes.UPDATE_MAIN_SELECTIONS_FROM_URL)(data);

export const setCurrentOrgUnitBasedOnUrl =
    (orgUnit: Object) => actionCreator(actionTypes.SET_ORG_UNIT_BASED_ON_URL)(orgUnit);

export const invalidOrgUnitFromUrl =
    (error: string) => actionCreator(actionTypes.INVALID_ORG_UNIT_FROM_URL)(error);

export const errorRetrievingOrgUnitBasedOnUrl =
    (error: string) => actionCreator(actionTypes.ERROR_RETRIEVING_ORG_UNIT_BASED_ON_URL)(error);

export const setEmptyOrgUnitBasedOnUrl =
    () => actionCreator(actionTypes.SET_EMPTY_ORG_UNIT_BASED_ON_URL)();

export const validSelectionsFromUrl =
    () => actionCreator(actionTypes.VALID_SELECTIONS_FROM_URL)();

export const invalidSelectionsFromUrl =
    (error: string) => actionCreator(actionTypes.INVALID_SELECTIONS_FROM_URL)(error);
