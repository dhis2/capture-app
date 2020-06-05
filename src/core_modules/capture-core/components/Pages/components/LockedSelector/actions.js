// @flow
import { actionCreator } from '../../../../actions/actions.utils';

export const lockedSelectorActionTypes = {
    SET_ORG_UNIT: 'SET_ORG_UNIT_FROM_PAGE_USING_THE_SELECTOR',
    RESET_ORG_UNIT_ID: 'RESET_ORG_UNIT_ID_FROM_PAGE_USING_THE_SELECTOR',
    SET_PROGRAM_ID: 'SET_PROGRAM_ID_FROM_PAGE_USING_THE_SELECTOR',
    RESET_PROGRAM_ID: 'RESET_PROGRAM_ID_FROM_PAGE_USING_THE_SELECTOR',
    SET_CATEGORY_OPTION: 'SET_CATEGORY_OPTION_FROM_PAGE_USING_THE_SELECTOR',
    RESET_CATEGORY_OPTION: 'RESET_CATEGORY_OPTION_FROM_PAGE_USING_THE_SELECTOR',
    RESET_ALL_CATEGORY_OPTIONS: 'RESET_ALL_CATEGORY_OPTIONS_FROM_PAGE_USING_THE_SELECTOR',

    UPDATE_SELECTIONS_FROM_URL: 'UPDATE_SELECTOR_OPTIONS_BASED_ON_URL',
    SET_ORG_UNIT_BASED_ON_URL: 'SET_ORG_UNIT_BASED_ON_URL',
    VALID_SELECTIONS_FROM_URL: 'VALID_SELECTOR_OPTIONS_BASED_ON_URL',
    INVALID_SELECTIONS_FROM_URL: 'INVALID_SELECTOR_OPTIONS_BASED_ON_URL',
    ERROR_RETRIEVING_ORG_UNIT_BASED_ON_URL: 'ERROR_RETRIEVING_ORG_UNIT_BASED_ON_URL',

    SET_EMPTY_ORG_UNIT_BASED_ON_URL: 'SET_EMPTY_ORG_UNIT_BASED_ON_URL',
    OPEN_NEW_EVENT: 'OPEN_NEW_EVENT_PAGE',
};

export const searchPageSelectorBatchActionTypes = {
    START_AGAIN: 'BATCH_START_AGAIN_FROM_PAGE_USING_THE_SELECTOR',
    RESET_PROGRAM_AND_CATEGORY_OPTION: 'BATCH_RESET_PROGRAM_AND_CATEGORY_OPTION_FROM_PAGE_USING_THE_SELECTOR',
};

export const setOrgUnitFromSearchPage = (id: string, orgUnit: Object) => actionCreator(lockedSelectorActionTypes.SET_ORG_UNIT)({ id, orgUnit });
export const setProgramIdFromSearchPage = (id: string) => actionCreator(lockedSelectorActionTypes.SET_PROGRAM_ID)(id);
export const setCategoryOptionFromSearchPage = (categoryId: string, categoryOption: Object) => actionCreator(lockedSelectorActionTypes.SET_CATEGORY_OPTION)({ categoryId, categoryOption });


export const resetOrgUnitIdFromSearchPage = () => actionCreator(lockedSelectorActionTypes.RESET_ORG_UNIT_ID)();
export const resetProgramIdFromSearchPage = () => actionCreator(lockedSelectorActionTypes.RESET_PROGRAM_ID)();
export const resetCategoryOptionFromSearchPage = (categoryId: string) => actionCreator(lockedSelectorActionTypes.RESET_CATEGORY_OPTION)({ categoryId });
export const resetAllCategoryOptionsFromSearchPage = () => actionCreator(lockedSelectorActionTypes.RESET_ALL_CATEGORY_OPTIONS)();

export const openNewEventPage = (programId: string, orgUnitId: string) => actionCreator(lockedSelectorActionTypes.OPEN_NEW_EVENT)({ programId, orgUnitId });


// url specific
export const updateSearchSelectionsFromUrl = (data: Object) => actionCreator(lockedSelectorActionTypes.UPDATE_SELECTIONS_FROM_URL)(data);
export const validSelectionsFromUrl = () => actionCreator(lockedSelectorActionTypes.VALID_SELECTIONS_FROM_URL)();
export const invalidSelectionsFromUrl = (error: string) => actionCreator(lockedSelectorActionTypes.INVALID_SELECTIONS_FROM_URL)({ error });
export const setCurrentOrgUnitBasedOnUrl = (orgUnit: Object) => actionCreator(lockedSelectorActionTypes.SET_ORG_UNIT_BASED_ON_URL)(orgUnit);
export const errorRetrievingOrgUnitBasedOnUrl = (error: string) => actionCreator(lockedSelectorActionTypes.ERROR_RETRIEVING_ORG_UNIT_BASED_ON_URL)({ error });
export const setEmptyOrgUnitBasedOnUrl = () => actionCreator(lockedSelectorActionTypes.SET_EMPTY_ORG_UNIT_BASED_ON_URL)();

