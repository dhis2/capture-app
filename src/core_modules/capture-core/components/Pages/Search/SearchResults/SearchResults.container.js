// @flow
import { connect } from 'react-redux';
import { SearchResultsComponent } from './SearchResults.component';
import type { OwnProps, Props, PropsFromRedux, DispatchersFromRedux } from './SearchResults.types';
import { searchViaAttributesOnScopeTrackedEntityType, searchViaAttributesOnScopeProgram } from '../SearchPage.actions';

const mapStateToProps = (state: ReduxState): PropsFromRedux => {
    const {
        searchResults,
        searchResultsPaginationInfo: { rowsCount, currentPage, rowsPerPage },
        currentSearchInfo: {
            searchScopeType: currentSearchScopeType,
            searchScopeId: currentSearchScopeId,
            formId: currentFormId,
            searchValues,
        },
    } = state.searchPage;

    return {
        rowsCount,
        currentPage,
        rowsPerPage,
        searchResults,
        currentSearchScopeType,
        currentSearchScopeId,
        currentFormId,
        searchValues,
    };
};


const mapDispatchToProps = (dispatch: ReduxDispatch): DispatchersFromRedux => ({
    searchViaAttributesOnScopeTrackedEntityType: ({ trackedEntityTypeId, formId, page }) => {
        dispatch(searchViaAttributesOnScopeTrackedEntityType({ trackedEntityTypeId, formId, page }));
    },
    searchViaAttributesOnScopeProgram: ({ programId, formId, page }) => {
        dispatch(searchViaAttributesOnScopeProgram({ programId, formId, page }));
    },
});


export const SearchResults =
  connect<Props, OwnProps, _, _, _, _>(mapStateToProps, mapDispatchToProps)(SearchResultsComponent);
