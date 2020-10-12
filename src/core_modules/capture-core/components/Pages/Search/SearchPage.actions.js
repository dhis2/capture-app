import { createAction } from '@reduxjs/toolkit';
import { actionCreator } from '../../../actions/actions.utils';

export const searchPageActionTypes = {
    TO_MAIN_PAGE_NAVIGATE: 'NavigateToMainPage',
};

export const searchViaUniqueIdOnScopeTrackedEntityType = createAction('search/searchViaUniqueIdOnScopeTrackedEntityType');
export const searchViaUniqueIdOnScopeProgram = createAction('search/searchViaUniqueIdOnScopeProgram');
export const searchViaAttributesOnScopeTrackedEntityType = createAction('search/searchViaAttributesOnScopeTrackedEntityType');
export const searchViaAttributesOnScopeProgram = createAction('search/searchViaAttributesOnScopeProgram');

export const showInitialViewOnSearchPage = createAction('search/showInitialViewOnSearchPage');
export const showLoadingViewOnSearchPage = createAction('search/showLoadingViewOnSearchPage');
export const showSuccessResultsViewOnSearchPage = createAction('search/showSuccessResultsViewOnSearchPage');
export const showEmptyResultsViewOnSearchPage = createAction('search/showEmptyResultsViewOnSearchPage');
export const showErrorViewOnSearchPage = createAction('search/showErrorViewOnSearchPage');
export const saveCurrentSearchInfo = createAction('search/saveCurrentSearchInfo');


export const navigateToMainPage = () => actionCreator(searchPageActionTypes.TO_MAIN_PAGE_NAVIGATE)();
