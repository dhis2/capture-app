// @flow
import { batchActions } from 'redux-batched-actions';
import { actionCreator } from '../../actions/actions.utils';

export const scopeSelectorActionTypes = {
    CATEGORY_OPTION_SET: 'ScopeSelector.CategoryOptionSet',
    CATEGORY_OPTION_RESET: 'ScopeSelector.CategoryOptionReset',
    ALL_CATEGORY_OPTIONS_RESET: 'ScopeSelector.AllCategoryOptionsReset',

    FROM_URL_UPDATE: 'ScopeSelector.FromUrlUpdate',

    NEW_REGISTRATION_PAGE_OPEN: 'ScopeSelector.NewRegistrationPageOpen',
    SEARCH_PAGE_OPEN: 'ScopeSelector.SearchPageOpen',

    FETCH_ORG_UNIT: 'ScopeSelector.FetchOrgUnit',
    FETCH_ORG_UNIT_SUCCESS: 'ScopeSelector.FetchOrgUnitSuccess',
    FETCH_ORG_UNIT_ERROR: 'ScopeSelector.FetchOrgUnitError',
};

export const setCategoryOptionFromScopeSelector = (categoryId: string, categoryOption: Object) => actionCreator(scopeSelectorActionTypes.CATEGORY_OPTION_SET)({ categoryId, categoryOption });
export const resetCategoryOptionFromScopeSelector = (categoryId: string) => actionCreator(scopeSelectorActionTypes.CATEGORY_OPTION_RESET)({ categoryId });
export const resetAllCategoryOptionsFromScopeSelector = () => actionCreator(scopeSelectorActionTypes.ALL_CATEGORY_OPTIONS_RESET)();

export const openNewRegistrationPageFromScopeSelector = () => actionCreator(scopeSelectorActionTypes.NEW_REGISTRATION_PAGE_OPEN)();
export const openSearchPageFromScopeSelector = () => actionCreator(scopeSelectorActionTypes.SEARCH_PAGE_OPEN)();

// these actions are being triggered only when the user updates the url from the url bar.
// this way we keep our stored data in sync with the page the user is.
export const updateSelectionsFromUrl = (data: Object) => actionCreator(scopeSelectorActionTypes.FROM_URL_UPDATE)(data);
export const setCurrentOrgUnitBasedOnUrl = (orgUnit: Object) => actionCreator(scopeSelectorActionTypes.FETCH_ORG_UNIT_SUCCESS)(orgUnit);
export const errorRetrievingOrgUnitBasedOnUrl = (error: string) => actionCreator(scopeSelectorActionTypes.FETCH_ORG_UNIT_ERROR)({ error });

// component Lifecycle
export const fetchOrgUnit = (orgUnitId: string) => actionCreator(scopeSelectorActionTypes.FETCH_ORG_UNIT)({ orgUnitId });

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
