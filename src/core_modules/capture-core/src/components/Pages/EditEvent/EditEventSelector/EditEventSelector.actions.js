// @flow
import { actionCreator } from '../../../../actions/actions.utils';

export const actionTypes = {
    SET_ORG_UNIT: 'setOrgUnitFromEditEventPage',
    RESET_ORG_UNIT_ID: 'resetOrgUnitIdFromEditEventPage',
    SET_PROGRAM_ID: 'setProgramIdFromEditEventPage',
    RESET_PROGRAM_ID: 'resetProgramIdFromEditEventPage',
    SET_CATEGORY_OPTION: 'setCategoryOptionFromEditEventPage',
    RESET_CATEGORY_OPTION: 'resetCategoryOptionFromEditEventPage',
    RESET_ALL_CATEGORY_OPTIONS: 'resetAllCategoryOptionsFromEditEventPage',
    OPEN_NEW_EVENT: 'openNewEventPageFromEditEventPage',
};

export const setOrgUnitFromEditEventPage =
    (id: string, orgUnit: Object) => actionCreator(actionTypes.SET_ORG_UNIT)({ id, orgUnit });

export const resetOrgUnitIdFromEditEventPage =
    () => actionCreator(actionTypes.RESET_ORG_UNIT_ID)();

export const setProgramIdFromEditEventPage =
    (id: string) => actionCreator(actionTypes.SET_PROGRAM_ID)(id);

export const resetProgramIdFromEditEventPage =
    () => actionCreator(actionTypes.RESET_PROGRAM_ID)();

export const setCategoryOptionFromEditEventPage =
    (categoryId: string, categoryOptionId: string) => actionCreator(actionTypes.SET_CATEGORY_OPTION)({ categoryId, categoryOptionId });

export const resetCategoryOptionFromEditEventPage =
    (categoryId: string) => actionCreator(actionTypes.RESET_CATEGORY_OPTION)(categoryId);

export const resetAllCategoryOptionsFromEditEventPage =
    () => actionCreator(actionTypes.RESET_ALL_CATEGORY_OPTIONS)();

export const openNewEventPageFromEditEventPage =
    (programId: string, orgUnitId: string) => actionCreator(actionTypes.OPEN_NEW_EVENT)({ programId, orgUnitId });
