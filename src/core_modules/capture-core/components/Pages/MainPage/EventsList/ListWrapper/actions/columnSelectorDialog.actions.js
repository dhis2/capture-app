// @flow
import { actionCreator } from '../../../../../../actions/actions.utils';

export const actionTypes = {
    UPDATE_WORKINGLIST_ORDER: 'updateWorkinglistOrder',
};

export const updateWorkinglistOrder =
    (listId: string, columnOrder: Array<Object>) => actionCreator(actionTypes.UPDATE_WORKINGLIST_ORDER)({ listId, columnOrder }, { skipLogging: ['columnOrder'] });
