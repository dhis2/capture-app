// @flow
import { actionCreator } from '../../../../actions/actions.utils';

export const actionTypes = {
    SET_ORG_UNIT_ID: 'setOrgUnitId',
    SET_PROGRAM_ID: 'setProgramId',
    SET_CATEGORY_ID: 'setCategoryId',
    RESET_CATEGORY_SELECTIONS: 'resetCategorySelections',
    GO_BACK_TO_LIST_CONTEXT: 'goBackToListContext',
    RESET_PROGRAM_ID_BASE: 'resetProgramIdBase',
    RESET_LOCATION_CHANGE: 'resetLocationChange',
};

export const setOrgUnitId =
    (orgUnitId: string) => actionCreator(actionTypes.SET_ORG_UNIT_ID)(orgUnitId);

export const setProgramId =
    (programId: string) => actionCreator(actionTypes.SET_PROGRAM_ID)(programId);

export const setCategoryId =
    (categoryId: string, selectedCategoryOptionId: string) =>
        actionCreator(actionTypes.SET_CATEGORY_ID)({ categoryId, selectedCategoryOptionId });

export const resetCategorySelections =
    () => actionCreator(actionTypes.RESET_CATEGORY_SELECTIONS)();

export const goBackToListContext =
    () => actionCreator(actionTypes.GO_BACK_TO_LIST_CONTEXT)();

export const resetProgramIdBase =
    () => actionCreator(actionTypes.RESET_PROGRAM_ID_BASE)();

export const resetLocationChange =
    () => actionCreator(actionTypes.RESET_LOCATION_CHANGE)();
