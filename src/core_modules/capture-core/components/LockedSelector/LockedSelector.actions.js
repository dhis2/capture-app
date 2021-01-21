// @flow
import { actionCreator } from '../../actions/actions.utils';

export const lockedSelectorActionTypes = {
    ORG_UNIT_ID_SET: 'OrgUnitSet',
    ORG_UNIT_ID_RESET: 'OrgUnitIdReset',
    PROGRAM_ID_SET: 'LockedSelector.ProgramIdSet',
    PROGRAM_ID_RESET: 'ProgramIdReset',
    CATEGORY_OPTION_SET: 'CategoryOptionSet',
    CATEGORY_OPTION_RESET: 'CategoryOptionReset',
    ALL_CATEGORY_OPTIONS_RESET: 'AllCategoryOptionsReset',

    CURRENT_SELECTIONS_UPDATE: 'LockedSelector.CurrentSelectionsUpdate',
    CURRENT_SELECTIONS_VALID: 'LockedSelector.CurrentSelectionsValid',
    CURRENT_SELECTIONS_INVALID: 'LockedSelector.CurrentSelectionsInvalid',
    EMPTY_ORG_UNIT_SET: 'LockedSelector.EmptyOrgUnitSet',

    NEW_REGISTRATION_PAGE_OPEN: 'NewRegistrationPageOpen',
    SEARCH_PAGE_OPEN: 'SearchPageOpen',

    CURRENT_PAGE_STORE: 'LockedSelector.StoreCurrentPage',
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

export const setOrgUnitFromLockedSelector = (id: string, orgUnit: Object) => actionCreator(lockedSelectorActionTypes.ORG_UNIT_ID_SET)({ id, orgUnit });
export const setProgramIdFromLockedSelector = (id: string) => actionCreator(lockedSelectorActionTypes.PROGRAM_ID_SET)(id);
export const setCategoryOptionFromLockedSelector = (categoryId: string, categoryOption: Object) => actionCreator(lockedSelectorActionTypes.CATEGORY_OPTION_SET)({ categoryId, categoryOption });

export const resetOrgUnitIdFromLockedSelector = () => actionCreator(lockedSelectorActionTypes.ORG_UNIT_ID_RESET)();
export const resetProgramIdFromLockedSelector = () => actionCreator(lockedSelectorActionTypes.PROGRAM_ID_RESET)();
export const resetCategoryOptionFromLockedSelector = (categoryId: string) => actionCreator(lockedSelectorActionTypes.CATEGORY_OPTION_RESET)({ categoryId });
export const resetAllCategoryOptionsFromLockedSelector = () => actionCreator(lockedSelectorActionTypes.ALL_CATEGORY_OPTIONS_RESET)();

export const openNewRegistrationPageFromLockedSelector = () => actionCreator(lockedSelectorActionTypes.NEW_REGISTRATION_PAGE_OPEN)();
export const openSearchPageFromLockedSelector = () => actionCreator(lockedSelectorActionTypes.SEARCH_PAGE_OPEN)();


// these actions are being triggered only when the user updates the url from the url bar.
// this way we keep our stored data in sync with the page the user is.
export const updateSelectionsFromUrl = (data: Object) => actionCreator(lockedSelectorActionTypes.CURRENT_SELECTIONS_UPDATE)(data);
export const validSelectionsFromUrl = () => actionCreator(lockedSelectorActionTypes.CURRENT_SELECTIONS_VALID)();
export const invalidSelectionsFromUrl = (error: string) => actionCreator(lockedSelectorActionTypes.CURRENT_SELECTIONS_INVALID)({ error });
export const setCurrentOrgUnitBasedOnUrl = (orgUnit: Object) => actionCreator(lockedSelectorActionTypes.FETCH_ORG_UNIT_SUCCESS)(orgUnit);
export const errorRetrievingOrgUnitBasedOnUrl = (error: string) => actionCreator(lockedSelectorActionTypes.FETCH_ORG_UNIT_ERROR)({ error });
export const setEmptyOrgUnitBasedOnUrl = () => actionCreator(lockedSelectorActionTypes.EMPTY_ORG_UNIT_SET)();

