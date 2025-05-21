// @flow
import { actionCreator } from '../../../actions/actions.utils';

export const newPageActionTypes = {
    NEW_PAGE_OPEN: 'NewPage.NewPageOpen',
    NEW_PAGE_WITHOUT_ORG_UNIT_SELECTED_VIEW: 'NewPage.WithoutOrgUnitSelectedView',
    NEW_PAGE_WITHOUT_PROGRAM_CATEGORY_SELECTED_VIEW: 'NewPage.WithoutProgramComboSelectedView',
    NEW_PAGE_CATEGORY_OPTION_INVALID_FOR_ORG_UNIT_VIEW: 'NewPage.InvalidCategoryOptionSelectedView',
    NEW_PAGE_DEFAULT_VIEW: 'NewPage.DefaultView',
    CATEGORY_OPTION_SET: 'NewPage.CategoryOptionSet',
    CATEGORY_OPTION_RESET: 'NewPage.CategoryOptionReset',
    ALL_CATEGORY_OPTIONS_RESET: 'NewPage.AllCategoryOptionsReset',
    CLEAN_UP_UID: 'NewPage.CleanUpUid',
    SET_PREPOPULATE_DATA_ON_NEW_PAGE: 'NewPage.SetPrepopulateData',
    CLEAR_PREPOPULATED_DATA: 'NewPage.ClearPrepopulatedData',
};

export const showMessageToSelectOrgUnitOnNewPage = () =>
    actionCreator(newPageActionTypes.NEW_PAGE_WITHOUT_ORG_UNIT_SELECTED_VIEW)();

export const showMessageToSelectProgramCategoryOnNewPage = () =>
    actionCreator(newPageActionTypes.NEW_PAGE_WITHOUT_PROGRAM_CATEGORY_SELECTED_VIEW)();

export const showMessageThatCategoryOptionIsInvalidForOrgUnit = () =>
    actionCreator(newPageActionTypes.NEW_PAGE_CATEGORY_OPTION_INVALID_FOR_ORG_UNIT_VIEW)();

export const showDefaultViewOnNewPage = () => actionCreator(newPageActionTypes.NEW_PAGE_DEFAULT_VIEW)();

export const setCategoryOption = (categoryId: string, categoryOption: Object) =>
    actionCreator(newPageActionTypes.CATEGORY_OPTION_SET)({ categoryId, categoryOption });

export const resetCategoryOption = (categoryId: string) =>
    actionCreator(newPageActionTypes.CATEGORY_OPTION_RESET)({ categoryId });

export const resetAllCategoryOptions = () => actionCreator(newPageActionTypes.ALL_CATEGORY_OPTIONS_RESET)();

export const openNewPage = () => actionCreator(newPageActionTypes.NEW_PAGE_OPEN)();

export const cleanUpUid = () => actionCreator(newPageActionTypes.CLEAN_UP_UID)({});

export const setPrepopulateDataOnNewPage = (searchData: Object) =>
    actionCreator(newPageActionTypes.SET_PREPOPULATE_DATA_ON_NEW_PAGE)(searchData);

export const clearPrepopulatedData = () =>
    actionCreator(newPageActionTypes.CLEAR_PREPOPULATED_DATA)();
