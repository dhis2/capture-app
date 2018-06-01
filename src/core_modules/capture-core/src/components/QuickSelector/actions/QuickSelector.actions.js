// @flow
import { actionCreator } from '../../../actions/actions.utils';

export const actionTypes = {
    SET_ORG_UNIT_ID: 'setOrgUnitId',
    STORE_ORG_UNIT_OBJECT: 'storeOrgUnitObject',
    SET_PROGRAM_ID: 'setProgramId',
    SET_CATEGORY_ID: 'setCategoryId',
};

export const setOrgUnitId =
    (orgUnitId: string) => actionCreator(actionTypes.SET_ORG_UNIT_ID)(orgUnitId);

export const storeOrgUnitObject =
    (orgUnitObject: Object) => actionCreator(actionTypes.STORE_ORG_UNIT_OBJECT)(orgUnitObject);

export const setProgramId =
    (programId: string) => actionCreator(actionTypes.SET_PROGRAM_ID)(programId);

export const setCategoryId =
    (categoryId: string, selectedCategoryOptionId: string) =>
        actionCreator(actionTypes.SET_CATEGORY_ID)({ categoryId, selectedCategoryOptionId });
