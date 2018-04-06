// @flow
import { actionCreator } from './actions.utils';

export const actionTypes = {
    UPDATE_SELECTIONS: 'UpdateSelections',
};

export const updateSelections = (selections: Object) => actionCreator(actionTypes.UPDATE_SELECTIONS)(selections);
