// @flow
import { actionCreator } from '../../../../actions/actions.utils';

export const actionTypes = {
    SET_ORG_UNIT: 'setOrgUnitFromNewEventPage',
    RESET_ORG_UNIT_ID: 'resetOrgUnitIdFromNewEventPage',
    SET_PROGRAM_ID: 'setProgramIdFromNewEventPage',
    RESET_PROGRAM_ID: 'resetProgramIdFromNewEventPage',
    SET_CATEGORY_OPTION: 'setCategoryOptionFromNewEventPage',
    RESET_CATEGORY_OPTION: 'resetCategoryOptionFromNewEventPage',
    RESET_ALL_CATEGORY_OPTIONS: 'resetAllCategoryOptionsFromNewEventPage',
    OPEN_NEW_EVENT_FROM_NEW_EVENT_PAGE: 'OpenNewEventFromNewEventPage',
};

export const batchActionTypes = {
    START_AGAIN: 'startAgainFromNewEventPageBatch',
    RESET_PROGRAM_AND_CATEGORY_OPTION: 'resetProgramAndCategoryOptionFromNewEventPageBatch',
};

export const setOrgUnitFromNewEventPage =
    (id: string, orgUnit: Object) => actionCreator(actionTypes.SET_ORG_UNIT)({ id, orgUnit });

export const resetOrgUnitIdFromNewEventPage =
    () => actionCreator(actionTypes.RESET_ORG_UNIT_ID)();

export const setProgramIdFromNewEventPage =
    (id: string) => actionCreator(actionTypes.SET_PROGRAM_ID)(id);

export const resetProgramIdFromNewEventPage =
    () => actionCreator(actionTypes.RESET_PROGRAM_ID)();

export const setCategoryOptionFromNewEventPage =
    (categoryId: string, categoryOption: Object) => actionCreator(actionTypes.SET_CATEGORY_OPTION)({ categoryId, categoryOption });

export const resetCategoryOptionFromNewEventPage =
    (categoryId: string) => actionCreator(actionTypes.RESET_CATEGORY_OPTION)({ categoryId });

export const resetAllCategoryOptionsFromNewEventPage =
    () => actionCreator(actionTypes.RESET_ALL_CATEGORY_OPTIONS)();

export const resetDataEntry =
    () => actionCreator(actionTypes.OPEN_NEW_EVENT_FROM_NEW_EVENT_PAGE)();
