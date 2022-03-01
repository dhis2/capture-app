// @flow
import type { ComponentType } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { SearchFallbackButtonComponent } from './SearchFallbackButton.component';
import { startFallbackSearch } from '../SearchPage.actions';


const mapStateToProps = (state: ReduxState) => {
    const {
        currentPage,
        currentSearchInfo: {
            searchScopeType: currentSearchScopeType,
            searchScopeId: currentSearchScopeId,
            formId: currentFormId,
        },
    } = state.searchPage;


    return {
        currentPage,
        currentSearchScopeType,
        currentSearchScopeId,
        currentFormId,
    };
};


const mapDispatchToProps = (dispatch: ReduxDispatch, { availableSearchOptions }) => ({
    startFallbackSearch: ({ programId, formId, resultsPageSize }) => {
        dispatch(startFallbackSearch({
            programId,
            formId,
            availableSearchOptions,
            pageSize: resultsPageSize,
        }));
    },
});


export const SearchFallbackButton: ComponentType<Object> =
  compose(connect(mapStateToProps, mapDispatchToProps))(SearchFallbackButtonComponent);
