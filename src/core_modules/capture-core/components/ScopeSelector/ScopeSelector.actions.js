// @flow
import { batchActions } from 'redux-batched-actions';
import { actionCreator } from '../../actions/actions.utils';

export const scopeSelectorActionTypes = {
    CATEGORY_OPTION_SET: 'ScopeSelector.CategoryOptionSet',
    CATEGORY_OPTION_RESET: 'ScopeSelector.CategoryOptionReset',
    ALL_CATEGORY_OPTIONS_RESET: 'ScopeSelector.AllCategoryOptionsReset',

    NEW_REGISTRATION_PAGE_OPEN: 'ScopeSelector.NewRegistrationPageOpen',
    SEARCH_PAGE_OPEN: 'ScopeSelector.SearchPageOpen',
};

export const setCategoryOptionFromScopeSelector = (categoryId: string, categoryOption: Object) => actionCreator(scopeSelectorActionTypes.CATEGORY_OPTION_SET)({ categoryId, categoryOption });
export const resetCategoryOptionFromScopeSelector = (categoryId: string) => actionCreator(scopeSelectorActionTypes.CATEGORY_OPTION_RESET)({ categoryId });
export const resetAllCategoryOptionsFromScopeSelector = () => actionCreator(scopeSelectorActionTypes.ALL_CATEGORY_OPTIONS_RESET)();

export const openNewRegistrationPageFromScopeSelector = () => actionCreator(scopeSelectorActionTypes.NEW_REGISTRATION_PAGE_OPEN)();
export const openSearchPageFromScopeSelector = () => actionCreator(scopeSelectorActionTypes.SEARCH_PAGE_OPEN)();

// batch related actions
export const resetProgramIdBatchAction = (actions: Array<Object>) =>
    batchActions([
        ...actions,
        resetAllCategoryOptionsFromScopeSelector(),
    ]);
export const resetOrgUnitIdBatchAction = (customActionsOnOrgUnitIdReset: Array<Object>) =>
    batchActions([
        ...customActionsOnOrgUnitIdReset,
    ]);
