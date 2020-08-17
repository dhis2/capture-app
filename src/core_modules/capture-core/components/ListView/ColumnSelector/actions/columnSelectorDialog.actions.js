// @flow
import { actionCreator } from '../../../../actions/actions.utils';

export const actionTypes = {
    WORKING_LIST_ORDER_UPDATE: 'WorkinglistOrderUpdate',
};

export const updateWorkingListOrder =
    (listId: string, columnOrder: Array<Object>) => actionCreator(actionTypes.WORKING_LIST_ORDER_UPDATE)({ listId, columnOrder }, { skipLogging: ['columnOrder'] });
