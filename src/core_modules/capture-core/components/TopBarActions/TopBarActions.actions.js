// @flow
import { actionCreator } from '../../actions/actions.utils';

export const topBarActionsActionTypes = {
    NEW_REGISTRATION_PAGE_OPEN: 'ScopeSelector.NewRegistrationPageOpen',
};

export const openNewRegistrationPageFromScopeSelector = () => actionCreator(topBarActionsActionTypes.NEW_REGISTRATION_PAGE_OPEN)();
