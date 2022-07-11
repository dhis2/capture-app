// @flow
import { actionCreator } from '../../actions/actions.utils';

export const lockedSelectorActionTypes = {
    LOADING_START: 'LockedSelector.Loading',
    FROM_URL_UPDATE: 'LockedSelector.FromUrlUpdate',
    FROM_URL_UPDATE_COMPLETE: 'LockedSelector.FromUrlUpdateComplete',
    FROM_URL_CURRENT_SELECTIONS_VALID: 'LockedSelector.FromUrlQueriesValid',
    FROM_URL_CURRENT_SELECTIONS_INVALID: 'LockedSelector.FromUrlQueriesInvalid',
    EMPTY_ORG_UNIT_SET: 'LockedSelector.EmptyOrgUnitSet',

    FETCH_ORG_UNIT: 'LockedSelector.FetchOrgUnit',
    FETCH_ORG_UNIT_SUCCESS: 'LockedSelector.FetchOrgUnitSuccess',
    FETCH_ORG_UNIT_ERROR: 'LockedSelector.FetchOrgUnitError',

    PROGRAM_ID_STORE: 'LockedSelector.StoreProgramId',
};

// these actions are being triggered only when the user updates the url from the url bar.
// this way we keep our stored data in sync with the page the user is.
export const updateSelectionsFromUrl = (data: Object) => actionCreator(lockedSelectorActionTypes.FROM_URL_UPDATE)(data);
export const validSelectionsFromUrl = () => actionCreator(lockedSelectorActionTypes.FROM_URL_CURRENT_SELECTIONS_VALID)();
export const invalidSelectionsFromUrl = (error: string) => actionCreator(lockedSelectorActionTypes.FROM_URL_CURRENT_SELECTIONS_INVALID)({ error });
export const setCurrentOrgUnitBasedOnUrl = (orgUnit: Object) => actionCreator(lockedSelectorActionTypes.FETCH_ORG_UNIT_SUCCESS)(orgUnit);
export const startLoading = () => actionCreator(lockedSelectorActionTypes.LOADING_START)();
export const completeUrlUpdate = () => actionCreator(lockedSelectorActionTypes.FROM_URL_UPDATE_COMPLETE)();
export const errorRetrievingOrgUnitBasedOnUrl = (error: string) => actionCreator(lockedSelectorActionTypes.FETCH_ORG_UNIT_ERROR)({ error });
export const setEmptyOrgUnitBasedOnUrl = () => actionCreator(lockedSelectorActionTypes.EMPTY_ORG_UNIT_SET)();

// component Lifecycle
export const fetchOrgUnit = (orgUnitId: string) => actionCreator(lockedSelectorActionTypes.FETCH_ORG_UNIT)({ orgUnitId });
