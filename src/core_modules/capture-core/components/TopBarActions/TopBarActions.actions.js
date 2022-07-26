// @flow
import { actionCreator } from '../../actions/actions.utils';

export const topBarActionsActionTypes = {
    SEARCH_PAGE_OPEN: 'ScopeSelector.SearchPageOpen',
};

export const openSearchPageFromScopeSelector = (programId?: string) =>
    actionCreator(topBarActionsActionTypes.SEARCH_PAGE_OPEN)({ programId });
