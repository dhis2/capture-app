// @flow
import { actionCreator } from 'capture-core/actions/actions.utils';

export const listViewActionTypes = {
    WORKING_LIST_UPDATING: 'WorkingListUpdating',
};

export const workingListUpdating = (listId: string) => actionCreator(listViewActionTypes.WORKING_LIST_UPDATING)({ listId });
