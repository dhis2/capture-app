// @flow
import { actionCreator } from '../../actions/actions.utils';

export const topBarActionsActionTypes = {
    NEW_REGISTRATION_PAGE_OPEN: 'ScopeSelector.NewRegistrationPageOpen',
    SEARCH_PAGE_OPEN: 'ScopeSelector.SearchPageOpen',
};

export const openNewRegistrationPageFromScopeSelector = (programId?: string) =>
    actionCreator(topBarActionsActionTypes.NEW_REGISTRATION_PAGE_OPEN)({ programId });

export const openSearchPageFromScopeSelector = (programId?: string) =>
    actionCreator(topBarActionsActionTypes.SEARCH_PAGE_OPEN)({ programId });
