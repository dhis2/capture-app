// @flow
import { actionCreator } from '../../actions/actions.utils';

export const scopeSelectorActionTypes = {
    CATEGORY_OPTION_SET: 'ScopeSelector.CategoryOptionSet',
    CATEGORY_OPTION_RESET: 'ScopeSelector.CategoryOptionReset',
    ALL_CATEGORY_OPTIONS_RESET: 'ScopeSelector.AllCategoryOptionsReset',
};

export const setCategoryOptionFromScopeSelector = (categoryId: string, categoryOption: Object) => actionCreator(scopeSelectorActionTypes.CATEGORY_OPTION_SET)({ categoryId, categoryOption });
export const resetCategoryOptionFromScopeSelector = (categoryId: string) => actionCreator(scopeSelectorActionTypes.CATEGORY_OPTION_RESET)({ categoryId });
export const resetAllCategoryOptionsFromScopeSelector = () => actionCreator(scopeSelectorActionTypes.ALL_CATEGORY_OPTIONS_RESET)();
