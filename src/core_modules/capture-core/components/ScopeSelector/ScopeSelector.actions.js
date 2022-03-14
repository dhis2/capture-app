// @flow
import { batchActions } from 'redux-batched-actions';
import { actionCreator } from '../../actions/actions.utils';

export const scopeSelectorActionTypes = {
    CATEGORY_OPTION_SET: 'ScopeSelector.CategoryOptionSet',
    CATEGORY_OPTION_RESET: 'ScopeSelector.CategoryOptionReset',
    ALL_CATEGORY_OPTIONS_RESET: 'ScopeSelector.AllCategoryOptionsReset',
};

export const setCategoryOptionFromScopeSelector = (categoryId: string, categoryOption: Object) => actionCreator(scopeSelectorActionTypes.CATEGORY_OPTION_SET)({ categoryId, categoryOption });
export const resetCategoryOptionFromScopeSelector = (categoryId: string) => actionCreator(scopeSelectorActionTypes.CATEGORY_OPTION_RESET)({ categoryId });
export const resetAllCategoryOptionsFromScopeSelector = () => actionCreator(scopeSelectorActionTypes.ALL_CATEGORY_OPTIONS_RESET)();

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
