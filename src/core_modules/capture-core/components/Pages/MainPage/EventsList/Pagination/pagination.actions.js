// @flow
import { actionCreator } from '../../../../../actions/actions.utils';

export const actionTypes = {
  CHANGE_PAGE: 'ChangePage',
  CHANGE_ROWS_PER_PAGE: 'ChangeRowsPerPage',
};

export const changePage = (listId: string, pageNumber: number) =>
  actionCreator(actionTypes.CHANGE_PAGE)({ listId, pageNumber });
export const changeRowsPerPage = (listId: string, rowsPerPage: number) =>
  actionCreator(actionTypes.CHANGE_ROWS_PER_PAGE)({ listId, rowsPerPage });
