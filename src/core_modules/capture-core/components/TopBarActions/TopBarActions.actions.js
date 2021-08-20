// @flow
import { actionCreator } from '../../actions/actions.utils';

export const topBarActionsActionTypes = {
    NEW_REGISTRATION_PAGE_OPEN: 'ScopeSelector.NewRegistrationPageOpen',
    SEARCH_PAGE_OPEN: 'ScopeSelector.SearchPageOpen',
};

export const openNewRegistrationPageFromScopeSelector = () => actionCreator(topBarActionsActionTypes.NEW_REGISTRATION_PAGE_OPEN)();
export const openSearchPageFromScopeSelector = () => actionCreator(topBarActionsActionTypes.SEARCH_PAGE_OPEN)();
