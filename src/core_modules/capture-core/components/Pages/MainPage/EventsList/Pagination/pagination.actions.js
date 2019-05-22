// @flow
import { actionCreator } from '../../../../../actions/actions.utils';

export const actionTypes = {
    CHANGE_PAGE: 'ChangePage',
    CHANGE_ROWS_PER_PAGE: 'ChangeRowsPerPage',
};

export const changePage = (pageNumber: number) => actionCreator(actionTypes.CHANGE_PAGE)(pageNumber);
export const changeRowsPerPage = (rowsPerPage: number) => actionCreator(actionTypes.CHANGE_ROWS_PER_PAGE)(rowsPerPage);
