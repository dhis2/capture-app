// @flow
import { batchActions } from 'redux-batched-actions';
import { actionCreator } from '../../actions/actions.utils';
import { resetProgramIdBase } from './QuickSelector/actions/QuickSelector.actions';

export const lockedSelectorActionTypes = {
    ORG_UNIT_ID_SET: 'LockedSelector.OrgUnitSet',
    ORG_UNIT_ID_RESET: 'LockedSelector.OrgUnitIdReset',
    PROGRAM_ID_SET: 'LockedSelector.ProgramIdSet',
    PROGRAM_ID_RESET: 'LockedSelector.ProgramIdReset',
    CATEGORY_OPTION_SET: 'LockedSelector.CategoryOptionSet',
    CATEGORY_OPTION_RESET: 'LockedSelector.CategoryOptionReset',
    ALL_CATEGORY_OPTIONS_RESET: 'LockedSelector.AllCategoryOptionsReset',
    TEI_SELECTION_RESET: 'LockedSelector.TeiSelectionReset',
    ENROLLMENT_SELECTION_SET: 'LockedSelector.EnrollmentSelectionSet',
    ENROLLMENT_SELECTION_RESET: 'LockedSelector.EnrollmentSelectionReset',

    LOADING_START: 'LockedSelector.Loading',
    FROM_URL_UPDATE: 'LockedSelector.FromUrlUpdate',
    FROM_URL_UPDATE_COMPLETE: 'LockedSelector.FromUrlUpdateComplete',
    FROM_URL_CURRENT_SELECTIONS_VALID: 'LockedSelector.FromUrlQueriesValid',
    FROM_URL_CURRENT_SELECTIONS_INVALID: 'LockedSelector.FromUrlQueriesInvalid',
    EMPTY_ORG_UNIT_SET: 'LockedSelector.EmptyOrgUnitSet',

    NEW_REGISTRATION_PAGE_OPEN: 'LockedSelector.NewRegistrationPageOpen',
    SEARCH_PAGE_OPEN: 'LockedSelector.SearchPageOpen',

    FETCH_ORG_UNIT: 'LockedSelector.FetchOrgUnit',
    FETCH_ORG_UNIT_SUCCESS: 'LockedSelector.FetchOrgUnitSuccess',
    FETCH_ORG_UNIT_ERROR: 'LockedSelector.FetchOrgUnitError',

    PROGRAM_ID_STORE: 'LockedSelector.StoreProgramId',
};

export const lockedSelectorBatchActionTypes = {
    AGAIN_START: 'LockedSelector.BatchAgainStart',
    PROGRAM_ID_RESET_BATCH: 'LockedSelector.BatchProgramIdReset',
    ORG_UNIT_ID_RESET_BATCH: 'LockedSelector.BatchOrgUnitIdReset',
};

export const setOrgUnitFromLockedSelector = (orgUnitId: string, orgUnit: Object, pageToPush: string) => actionCreator(lockedSelectorActionTypes.ORG_UNIT_ID_SET)({ orgUnitId, orgUnit, pageToPush });
export const setProgramIdFromLockedSelector = (programId: string, pageToPush: string) => actionCreator(lockedSelectorActionTypes.PROGRAM_ID_SET)({ programId, pageToPush });
export const setCategoryOptionFromLockedSelector = (categoryId: string, categoryOption: Object) => actionCreator(lockedSelectorActionTypes.CATEGORY_OPTION_SET)({ categoryId, categoryOption });

export const resetOrgUnitIdFromLockedSelector = (pageToPush: string) => actionCreator(lockedSelectorActionTypes.ORG_UNIT_ID_RESET)({ pageToPush });
export const resetProgramIdFromLockedSelector = (pageToPush: string) => actionCreator(lockedSelectorActionTypes.PROGRAM_ID_RESET)({ pageToPush });
export const resetCategoryOptionFromLockedSelector = (categoryId: string) => actionCreator(lockedSelectorActionTypes.CATEGORY_OPTION_RESET)({ categoryId });
export const resetAllCategoryOptionsFromLockedSelector = () => actionCreator(lockedSelectorActionTypes.ALL_CATEGORY_OPTIONS_RESET)();

export const openNewRegistrationPageFromLockedSelector = () => actionCreator(lockedSelectorActionTypes.NEW_REGISTRATION_PAGE_OPEN)();
export const openSearchPageFromLockedSelector = () => actionCreator(lockedSelectorActionTypes.SEARCH_PAGE_OPEN)();


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

// enrollment related
export const resetTeiSelection = () =>
    actionCreator(lockedSelectorActionTypes.TEI_SELECTION_RESET)();

export const setEnrollmentSelection = ({ enrollmentId }: Object) =>
    actionCreator(lockedSelectorActionTypes.ENROLLMENT_SELECTION_SET)({ enrollmentId });

export const resetEnrollmentSelection = () =>
    actionCreator(lockedSelectorActionTypes.ENROLLMENT_SELECTION_RESET)();

// batch related actions
export const resetProgramIdBatchAction = (actions: Array<Object>, pageToPush: string) =>
    batchActions([
        ...actions,
        resetAllCategoryOptionsFromLockedSelector(),
        resetProgramIdFromLockedSelector(pageToPush),
    ], lockedSelectorBatchActionTypes.PROGRAM_ID_RESET_BATCH);

export const resetOrgUnitIdBatchAction = (customActionsOnOrgUnitIdReset: Array<Object>, pageToPush: string) =>
    batchActions([
        resetOrgUnitIdFromLockedSelector(pageToPush),
        ...customActionsOnOrgUnitIdReset,
    ], lockedSelectorBatchActionTypes.ORG_UNIT_ID_RESET_BATCH);

export const startAgainBatchAction = () =>
    batchActions([
        resetProgramIdFromLockedSelector(''),
        resetOrgUnitIdFromLockedSelector(''),
        resetAllCategoryOptionsFromLockedSelector(),
        resetProgramIdBase(),
    ], lockedSelectorBatchActionTypes.AGAIN_START);
