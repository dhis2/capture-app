// @flow
import { actionCreator } from '../../../actions/actions.utils';

export const mainPageActionTypes = {
    CATEGORY_OPTION_SET: 'MainPage.CategoryOptionSet',
    CATEGORY_OPTION_RESET: 'MainPage.CategoryOptionReset',
    ALL_CATEGORY_OPTIONS_RESET: 'MainPage.AllCategoryOptionsReset',
};

export const setCategoryOption = (categoryId: string, categoryOption: Object) =>
    actionCreator(mainPageActionTypes.CATEGORY_OPTION_SET)({ categoryId, categoryOption });

export const resetCategoryOption = (categoryId: string) =>
    actionCreator(mainPageActionTypes.CATEGORY_OPTION_RESET)({ categoryId });

export const resetAllCategoryOptions = () => actionCreator(mainPageActionTypes.ALL_CATEGORY_OPTIONS_RESET)();
