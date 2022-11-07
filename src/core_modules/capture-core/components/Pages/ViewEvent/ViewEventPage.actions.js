// @flow
import { actionCreator } from '../../../actions/actions.utils';

export const viewEventPageActionTypes = {
    CATEGORY_OPTION_SET: 'ViewEventPage.CategoryOptionSet',
    CATEGORY_OPTION_RESET: 'ViewEventPage.CategoryOptionReset',
    ALL_CATEGORY_OPTIONS_RESET: 'ViewEventPage.AllCategoryOptionsReset',
};

export const setCategoryOption = (categoryId: string, categoryOption: Object) =>
    actionCreator(viewEventPageActionTypes.CATEGORY_OPTION_SET)({ categoryId, categoryOption });

export const resetCategoryOption = (categoryId: string) =>
    actionCreator(viewEventPageActionTypes.CATEGORY_OPTION_RESET)({ categoryId });

export const resetAllCategoryOptions = () => actionCreator(viewEventPageActionTypes.ALL_CATEGORY_OPTIONS_RESET)();
