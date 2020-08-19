// @flow
import { actionCreator } from '../../../../actions/actions.utils';

export const workingListsCommonActionTypes = {
    LIST_SORT: 'WorkingListsListSort',
    LIST_COLUMN_ORDER_SET: 'WorkingListsListColumnOrderSet',
};

export const sortList = (listId: string, id: string, direction: string) =>
    actionCreator(workingListsCommonActionTypes.LIST_SORT)({ listId, id, direction });

export const setListColumnOrder =
    (listId: string, columnOrder: Array<Object>) => {
        debugger;
        return actionCreator(workingListsCommonActionTypes.LIST_COLUMN_ORDER_SET)({ listId, columnOrder }, { skipLogging: ['columnOrder'] });
    };
