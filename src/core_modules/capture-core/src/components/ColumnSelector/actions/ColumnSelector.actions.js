// @flow
import { actionCreator } from '../../../actions/actions.utils';

export const actionTypes = {
    SET_COLUMN_VISIBLE: 'setColumnVisible',
};

export const setColumnVisible =
    (column: string) => actionCreator(actionTypes.SET_COLUMN_VISIBLE)(column);
