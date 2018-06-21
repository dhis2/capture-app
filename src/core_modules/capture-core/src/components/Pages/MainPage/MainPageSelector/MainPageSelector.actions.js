// @flow
import { actionCreator } from '../../../../actions/actions.utils';

export const actionTypes = {
    SET_ORG_UNIT: 'setOrgUnitFromMainPage',
    RESET_ORG_UNIT_ID: 'resetOrgUnitIdFromMainPage',
    SET_PROGRAM_ID: 'setProgramIdFromMainPage',
    RESET_PROGRAM_ID: 'resetProgramIdFromMainPage',
    SET_CATEGORY_OPTION: 'setCategoryOptionFromMainPage',
    RESET_CATEGORY_OPTION: 'resetCategoryOptionFromMainPage',
    RESET_ALL_CATEGORY_OPTIONS: 'resetAllCategoryOptionsFromMainPage',
    OPEN_NEW_EVENT: 'openNewEventPageFromMainPage',
};

export const batchActionTypes = {
    START_AGAIN: 'startAgainFromMainPageBatch',
    RESET_PROGRAM_AND_CATEGORY_OPTION: 'resetProgramAndCategoryOptionFromMainPageBatch',
};

export const setOrgUnitFromMainPage =
    (id: string, orgUnit: Object) => actionCreator(actionTypes.SET_ORG_UNIT)({ id, orgUnit });

export const resetOrgUnitIdFromMainPage =
    () => actionCreator(actionTypes.RESET_ORG_UNIT_ID)();

export const setProgramIdFromMainPage =
    (id: string) => actionCreator(actionTypes.SET_PROGRAM_ID)(id);

export const resetProgramIdFromMainPage =
    () => actionCreator(actionTypes.RESET_PROGRAM_ID)();

export const setCategoryOptionFromMainPage =
    (categoryId: string, categoryOptionId: string) => actionCreator(actionTypes.SET_CATEGORY_OPTION)({ categoryId, categoryOptionId });

export const resetCategoryOptionFromMainPage =
    (categoryId: string) => actionCreator(actionTypes.RESET_CATEGORY_OPTION)(categoryId);

export const resetAllCategoryOptionsFromMainPage =
    () => actionCreator(actionTypes.RESET_ALL_CATEGORY_OPTIONS)();

export const openNewEventPageFromMainPage =
    (programId: string, orgUnitId: string) => actionCreator(actionTypes.OPEN_NEW_EVENT)({ programId, orgUnitId });