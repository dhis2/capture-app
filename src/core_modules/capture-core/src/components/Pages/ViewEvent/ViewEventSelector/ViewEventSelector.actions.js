// @flow
import { actionCreator } from '../../../../actions/actions.utils';

export const actionTypes = {
    SET_ORG_UNIT: 'setOrgUnitFromViewEventPage',
    RESET_ORG_UNIT_ID: 'resetOrgUnitIdFromViewEventPage',
    SET_PROGRAM_ID: 'setProgramIdFromViewEventPage',
    RESET_PROGRAM_ID: 'resetProgramIdFromViewEventPage',
    SET_CATEGORY_OPTION: 'setCategoryOptionFromViewEventPage',
    RESET_CATEGORY_OPTION: 'resetCategoryOptionFromViewEventPage',
    RESET_ALL_CATEGORY_OPTIONS: 'resetAllCategoryOptionsFromViewEventPage',
    OPEN_NEW_EVENT: 'openNewEventPageFromViewEventPage',
};

export const batchActionTypes = {
    START_AGAIN: 'startAgainFromViewEventPageBatch',
    RESET_PROGRAM_AND_CATEGORY_OPTION: 'resetProgramAndCategoryOptionFromViewEventPageBatch',
};

export const setOrgUnitFromViewEventPage =
    (id: string, orgUnit: Object) => actionCreator(actionTypes.SET_ORG_UNIT)({ id, orgUnit });

export const resetOrgUnitIdFromViewEventPage =
    () => actionCreator(actionTypes.RESET_ORG_UNIT_ID)();

export const setProgramIdFromViewEventPage =
    (id: string) => actionCreator(actionTypes.SET_PROGRAM_ID)(id);

export const resetProgramIdFromViewEventPage =
    () => actionCreator(actionTypes.RESET_PROGRAM_ID)();

export const setCategoryOptionFromViewEventPage =
    (categoryId: string, categoryOptionId: string) => actionCreator(actionTypes.SET_CATEGORY_OPTION)({ categoryId, categoryOptionId });

export const resetCategoryOptionFromViewEventPage =
    (categoryId: string) => actionCreator(actionTypes.RESET_CATEGORY_OPTION)(categoryId);

export const resetAllCategoryOptionsFromViewEventPage =
    () => actionCreator(actionTypes.RESET_ALL_CATEGORY_OPTIONS)();

export const openNewEventPageFromViewEventPage =
    (programId: string, orgUnitId: string) => actionCreator(actionTypes.OPEN_NEW_EVENT)({ programId, orgUnitId });
