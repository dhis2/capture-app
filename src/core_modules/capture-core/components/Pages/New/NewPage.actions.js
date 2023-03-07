// @flow
import { actionCreator } from '../../../actions/actions.utils';

export const newPageActionTypes = {
    NEW_PAGE_OPEN: 'NewPage.NewPageOpen',
    NEW_PAGE_WITHOUT_ORG_UNIT_SELECTED_VIEW: 'NewPage.WithoutOrgUnitSelectedView',
    NEW_PAGE_WITHOUT_PROGRAM_CATEGORY_SELECTED_VIEW: 'NewPage.WithoutProgramComboSelectedView',
    NEW_PAGE_DEFAULT_VIEW: 'NewPage.DefaultView',
    CLEAN_UP_DATA_ENTRY: 'NewPage.DataEntryCleanUp',
    CATEGORY_OPTION_SET: 'NewPage.CategoryOptionSet',
    CATEGORY_OPTION_RESET: 'NewPage.CategoryOptionReset',
    ALL_CATEGORY_OPTIONS_RESET: 'NewPage.AllCategoryOptionsReset',
    CLEAN_UP_UID: 'NewPage.CleanUpUid',
};

export const showMessageToSelectOrgUnitOnNewPage = () =>
    actionCreator(newPageActionTypes.NEW_PAGE_WITHOUT_ORG_UNIT_SELECTED_VIEW)();

export const showMessageToSelectProgramCategoryOnNewPage = () =>
    actionCreator(newPageActionTypes.NEW_PAGE_WITHOUT_PROGRAM_CATEGORY_SELECTED_VIEW)();

export const showDefaultViewOnNewPage = () => actionCreator(newPageActionTypes.NEW_PAGE_DEFAULT_VIEW)();

export const cleanUpDataEntry = (dataEntryId: string) =>
    actionCreator(newPageActionTypes.CLEAN_UP_DATA_ENTRY)({ dataEntryId });

export const setCategoryOption = (categoryId: string, categoryOption: Object) =>
    actionCreator(newPageActionTypes.CATEGORY_OPTION_SET)({ categoryId, categoryOption });

export const resetCategoryOption = (categoryId: string) =>
    actionCreator(newPageActionTypes.CATEGORY_OPTION_RESET)({ categoryId });

export const resetAllCategoryOptions = () => actionCreator(newPageActionTypes.ALL_CATEGORY_OPTIONS_RESET)();

export const openNewPage = () => actionCreator(newPageActionTypes.NEW_PAGE_OPEN)();

export const cleanUpUid = () => actionCreator(newPageActionTypes.CLEAN_UP_UID)({ });
