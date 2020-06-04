// @flow
import { actionCreator } from '../../../../actions/actions.utils';

export const searchPageSelectorActonTypes = {
    SET_ORG_UNIT: 'setOrgUnitFromSearchPage',
    RESET_ORG_UNIT_ID: 'resetOrgUnitIdFromSearchPage',
    SET_PROGRAM_ID: 'setProgramIdFromSearchPage',
    RESET_PROGRAM_ID: 'resetProgramIdFromSearchPage',
    SET_CATEGORY_OPTION: 'setCategoryOptionFromSearchPage',
    RESET_CATEGORY_OPTION: 'resetCategoryOptionFromSearchPage',
    RESET_ALL_CATEGORY_OPTIONS: 'resetAllCategoryOptionsFromSearchPage',
    OPEN_NEW_EVENT: 'openNewEventPageFromSearchPage',
    UPDATE_SELECTIONS_FROM_URL: 'UPDATE_SEARCH_SELECTIONS_FROM_URL_SEARCH',
    VALID_SELECTIONS_FROM_URL: 'VALID_SELECTIONS_FROM_URL_SEARCH',
    INVALID_SELECTIONS_FROM_URL: 'INVALID_SELECTIONS_FROM_URL_SEARCH',
    SET_ORG_UNIT_BASED_ON_URL: 'SET_ORG_UNIT_BASED_ON_URL_SEARCH',
    ERROR_RETRIEVING_ORG_UNIT_BASED_ON_URL: 'ERROR_RETRIEVING_ORG_UNIT_BASED_ON_URL_SEARCH',
    SET_EMPTY_ORG_UNIT_BASED_ON_URL: 'SET_EMPTY_ORG_UNIT_BASED_ON_URL',
    NEW_EVENT_IN_DATAENTRY_OPENING_CANCEL: 'NEW_EVENT_IN_DATAENTRY_OPENING_CANCEL_SEARCH',
};

export const batchActionTypes = {
    START_AGAIN: 'startAgainFromSearchPageBatch',
    RESET_PROGRAM_AND_CATEGORY_OPTION: 'resetProgramAndCategoryOptionFromSearchPageBatch',
};

export const setOrgUnitFromSearchPage =
    (id: string, orgUnit: Object) => actionCreator(searchPageSelectorActonTypes.SET_ORG_UNIT)({ orgUnitId: id, orgUnit });

export const resetOrgUnitIdFromSearchPage =
    () => actionCreator(searchPageSelectorActonTypes.RESET_ORG_UNIT_ID)();

export const setProgramIdFromSearchPage =
    (id: string) => actionCreator(searchPageSelectorActonTypes.SET_PROGRAM_ID)({ programId: id });

export const resetProgramIdFromSearchPage =
    () => actionCreator(searchPageSelectorActonTypes.RESET_PROGRAM_ID)();

export const setCategoryOptionFromSearchPage =
    (categoryId: string, categoryOption: Object) => actionCreator(searchPageSelectorActonTypes.SET_CATEGORY_OPTION)({ categoryId, categoryOption });

export const resetCategoryOptionFromSearchPage =
    (categoryId: string) => actionCreator(searchPageSelectorActonTypes.RESET_CATEGORY_OPTION)({ categoryId });

export const resetAllCategoryOptionsFromSearchPage =
    () => actionCreator(searchPageSelectorActonTypes.RESET_ALL_CATEGORY_OPTIONS)();

export const openNewEventPageFromSearchPage =
    (programId: string, orgUnitId: string) => actionCreator(searchPageSelectorActonTypes.OPEN_NEW_EVENT)({ programId, orgUnitId });


// url specific
export const updateSearchSelectionsFromUrl =
  (data: Object) => actionCreator(searchPageSelectorActonTypes.UPDATE_SELECTIONS_FROM_URL)(data);

export const validSelectionsFromUrl =
  () => actionCreator(searchPageSelectorActonTypes.VALID_SELECTIONS_FROM_URL)();

export const invalidSelectionsFromUrl =
  (error: string) => actionCreator(searchPageSelectorActonTypes.INVALID_SELECTIONS_FROM_URL)({ error });


export const setCurrentOrgUnitBasedOnUrl =
  (orgUnit: Object) =>
      actionCreator(searchPageSelectorActonTypes.SET_ORG_UNIT_BASED_ON_URL)({ orgUnit });

export const errorRetrievingOrgUnitBasedOnUrl =
  (error: string) => actionCreator(searchPageSelectorActonTypes.ERROR_RETRIEVING_ORG_UNIT_BASED_ON_URL)({ error });

export const setEmptyOrgUnitBasedOnUrl =
  () => actionCreator(searchPageSelectorActonTypes.SET_EMPTY_ORG_UNIT_BASED_ON_URL)();

