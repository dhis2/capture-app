// @flow
import { actionCreator } from '../../actions/actions.utils';

export const topBarActionsActionTypes = {
    SEARCH_PAGE_OPEN: 'ScopeSelector.SearchPageOpen',
};

export const openSearchPageFromScopeSelector = () => actionCreator(topBarActionsActionTypes.SEARCH_PAGE_OPEN)();
