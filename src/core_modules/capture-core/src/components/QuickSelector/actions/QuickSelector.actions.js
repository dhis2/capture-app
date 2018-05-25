// @flow
import { actionCreator } from '../../../actions/actions.utils';

export const actionTypes = {
    SET_PROGRAM_ID: 'setProgramId',
    SET_CATEGORY_ID: 'setCategoryId',
};

export const setProgramId =
    (programId: string) => actionCreator(actionTypes.SET_PROGRAM_ID)(programId);

export const setCategoryId =
    (categoryId: string, selectedCategoryOptionId: string) =>
        actionCreator(actionTypes.SET_CATEGORY_ID)({ categoryId, selectedCategoryOptionId });
