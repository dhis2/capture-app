// @flow
import { actionCreator } from '../../../../../../actions/actions.utils';

export const actionTypes = {
    CHANGE_PAGE: 'ChangePage',
};

export const changePage = (pageNumber: number) => actionCreator(actionTypes.CHANGE_PAGE)(pageNumber);
