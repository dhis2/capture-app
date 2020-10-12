// @flow
import { createReducer } from '@reduxjs/toolkit';
import {
    saveCurrentSearchInfo,
    showEmptyResultsViewOnSearchPage,
    showErrorViewOnSearchPage,
    showInitialViewOnSearchPage,
    showLoadingViewOnSearchPage,
    showSuccessResultsViewOnSearchPage,
} from '../../components/Pages/Search/SearchPage.actions';

export const searchPageStatus = {
    INITIAL: 'INITIAL',
    LOADING: 'LOADING',
    NO_RESULTS: 'NO_RESULTS',
    SHOW_RESULTS: 'SHOW_RESULTS',
    ERROR: 'ERROR',
};


export const searchPage = createReducer({
    searchStatus: searchPageStatus.INITIAL,
    searchResults: [],
    currentSearchInfo: {},
    searchResultsPaginationInfo: {
        nextPageButtonDisabled: false,
        currentPage: 0,
    },
}, (builder) => {
    builder
        .addCase(
            showInitialViewOnSearchPage,
            (state) => {
                state.searchStatus = searchPageStatus.INITIAL;
            })
        .addCase(
            showSuccessResultsViewOnSearchPage,
            (
                state,
                { payload: { searchResults, searchResultsPaginationInfo } },
            ) => {
                state.searchStatus = searchPageStatus.SHOW_RESULTS;
                state.searchResults = searchResults;
                state.searchResultsPaginationInfo = searchResultsPaginationInfo;
            })
        .addCase(
            showLoadingViewOnSearchPage,
            (state) => {
                state.searchStatus = searchPageStatus.LOADING;
            })
        .addCase(
            showEmptyResultsViewOnSearchPage,
            (state) => {
                state.searchStatus = searchPageStatus.NO_RESULTS;
            })
        .addCase(
            showErrorViewOnSearchPage,
            (state) => {
                state.searchStatus = searchPageStatus.ERROR;
            })
        .addCase(
            saveCurrentSearchInfo,
            (
                state,
                { payload: { searchScopeType, searchScopeId, formId, currentSearchTerms } },
            ) => {
                state.currentSearchInfo = { searchScopeType, searchScopeId, formId, currentSearchTerms };
            });
});

