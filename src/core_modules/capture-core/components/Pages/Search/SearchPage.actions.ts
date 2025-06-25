import { actionCreator } from '../../../actions/actions.utils';

export const searchPageActionTypes = {
    TO_MAIN_PAGE_NAVIGATE: 'SearchPage.NavigateToMainPage',
    SEARCH_PAGE_OPEN: 'SearchPage.SearchPageOpen',
};

export const navigateToMainPage = () => actionCreator(searchPageActionTypes.TO_MAIN_PAGE_NAVIGATE)();

export const openSearchPage = () => actionCreator(searchPageActionTypes.SEARCH_PAGE_OPEN)();
