// @flow
import { actionCreator } from '../../../actions/actions.utils';

export const actionTypes = {
    TEI_SEARCH_NEW_SEARCH: 'TeiSearchNewSearch',
    TEI_SEARCH_EDIT_SEARCH: 'TeiSearchEditSearch',
};


export const newSearch = (searchId: string) =>
    actionCreator(actionTypes.TEI_SEARCH_NEW_SEARCH)({ searchId });

export const editSearch = (searchId: string) =>
    actionCreator(actionTypes.TEI_SEARCH_EDIT_SEARCH)({ searchId });
