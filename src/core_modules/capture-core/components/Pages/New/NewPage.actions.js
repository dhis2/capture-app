import { actionCreator } from '../../../actions/actions.utils';

export const newPageActionTypes = {
    NEW_PAGE_WITHOUT_ORG_UNIT_SELECTED_VIEW: 'NewPageWithoutOrgUnitSelectedView',
    NEW_PAGE_DEFAULT_VIEW: 'NewPageDefaultView',
};


export const showMessageToSelectOrgUnitOnNewPage = () =>
    actionCreator(newPageActionTypes.NEW_PAGE_WITHOUT_ORG_UNIT_SELECTED_VIEW)();

export const showDefaultViewOnNewPage = () =>
    actionCreator(newPageActionTypes.NEW_PAGE_DEFAULT_VIEW)();
