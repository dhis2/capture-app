// @flow
import { actionCreator } from '../../../actions/actions.utils';

export const actionTypes = {
    UPDATE_WORKINGLIST_ORDER: 'updateWorkinglistOrder',
};

export const updateWorkinglistOrder =
    (listId: string, workinglist: Array<Object>) => actionCreator(actionTypes.UPDATE_WORKINGLIST_ORDER)({ listId, workinglist });
