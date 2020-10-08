// @flow
import type { ComponentType } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { SearchResultsComponent } from './SearchResults.component';
import type { OwnProps, Props, PropsFromRedux, DispatchersFromRedux } from './SearchResults.types';
import { searchViaAttributesOnScopeTrackedEntityType, searchViaAttributesOnScopeProgram } from '../SearchPage.actions';
import { getProgramFromProgramIdThrowIfNotFound, getTrackedEntityTypeThrowIfNotFound } from '../../../../metaData/helpers';
import { searchScopes } from '../SearchPage.constants';

const scopeName = (scopeId: string, scopeType: string) => {
    if (!scopeId) {
        return '';
    }
    if (scopeType === searchScopes.PROGRAM) {
        return getProgramFromProgramIdThrowIfNotFound(scopeId).name;
    }
    if (scopeType === searchScopes.TRACKED_ENTITY_TYPE) {
        return getTrackedEntityTypeThrowIfNotFound(scopeId).name;
    }

    return '';
};

const mapStateToProps = (state: ReduxState): PropsFromRedux => {
    const {
        searchResults,
        searchResultsPaginationInfo: { rowsCount, currentPage, rowsPerPage },
        currentSearchInfo: {
            searchScopeType: currentSearchScopeType,
            searchScopeId: currentSearchScopeId,
            formId: currentFormId,
            currentSearchTerms,
        },
    } = state.searchPage;

    const currentSearchScopeName = scopeName(currentSearchScopeId, currentSearchScopeType);
    return {
        rowsCount,
        currentPage,
        rowsPerPage,
        searchResults,
        currentSearchScopeType,
        currentSearchScopeId,
        currentSearchScopeName,
        currentFormId,
        currentSearchTerms,
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


export const SearchResults: ComponentType<OwnProps> =
  compose(
      connect<Props, OwnProps, _, _, _, _>(mapStateToProps, mapDispatchToProps),
  )(SearchResultsComponent);
