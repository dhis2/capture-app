// @flow
import { actionCreator } from '../../actions/actions.utils';

export const topBarActionsActionTypes = {
    NEW_REGISTRATION_PAGE_OPEN: 'ScopeSelector.NewRegistrationPageOpen',
};

export const openNewRegistrationPageFromScopeSelector = (programId?: string) =>
    actionCreator(topBarActionsActionTypes.NEW_REGISTRATION_PAGE_OPEN)({ programId });
