import { actionCreator } from '../../../actions/actions.utils';

export const newPageActionTypes = {
    NEW_PAGE_OPEN: 'NewPage.NewPageOpen',
    NEW_PAGE_WITHOUT_ORG_UNIT_SELECTED_VIEW: 'NewPage.WithoutOrgUnitSelectedView',
    NEW_PAGE_WITHOUT_PROGRAM_CATEGORY_SELECTED_VIEW: 'NewPage.WithoutProgramComboSelectedView',
    NEW_PAGE_DEFAULT_VIEW: 'NewPage.DefaultView',
    CLEAN_UP_DATA_ENTRY: 'NewPage.DataEntryCleanUp',
};

export const showMessageToSelectOrgUnitOnNewPage = () =>
    actionCreator(newPageActionTypes.NEW_PAGE_WITHOUT_ORG_UNIT_SELECTED_VIEW)();

export const showMessageToSelectProgramCategoryOnNewPage = () =>
    actionCreator(newPageActionTypes.NEW_PAGE_WITHOUT_PROGRAM_CATEGORY_SELECTED_VIEW)();

export const showDefaultViewOnNewPage = () => actionCreator(newPageActionTypes.NEW_PAGE_DEFAULT_VIEW)();

export const cleanUpDataEntry = dataEntryId => actionCreator(newPageActionTypes.CLEAN_UP_DATA_ENTRY)({ dataEntryId });

export const openNewPage = () => actionCreator(newPageActionTypes.NEW_PAGE_OPEN)();
