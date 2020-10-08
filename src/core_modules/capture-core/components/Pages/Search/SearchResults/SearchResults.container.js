// @flow
import type { ComponentType } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { SearchResultsComponent } from './SearchResults.component';
import type { OwnProps, Props, PropsFromRedux, DispatchersFromRedux } from './SearchResults.types';
import { searchViaAttributesOnScopeTrackedEntityType, searchViaAttributesOnScopeProgram } from '../SearchPage.actions';
import { getProgramFromProgramIdThrowIfNotFound, getTrackedEntityTypeThrowIfNotFound } from '../../../../metaData/helpers';
import { searchScopes, PAGINATION } from '../SearchPage.constants';

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
        searchResultsPaginationInfo: { currentPage, nextPageButtonDisabled },
        currentSearchInfo: {
            searchScopeType: currentSearchScopeType,
            searchScopeId: currentSearchScopeId,
            formId: currentFormId,
            currentSearchTerms,
        },
    } = state.searchPage;

    const currentSearchScopeName = scopeName(currentSearchScopeId, currentSearchScopeType);
    return {
        currentPage,
        searchResults,
        currentSearchScopeType,
        currentSearchScopeId,
        currentSearchScopeName,
        currentFormId,
        currentSearchTerms,
        nextPageButtonDisabled,
    };
};


const mapDispatchToProps = (dispatch: ReduxDispatch): DispatchersFromRedux => ({
    searchViaAttributesOnScopeTrackedEntityType: ({ trackedEntityTypeId, formId, page }) => {
        dispatch(searchViaAttributesOnScopeTrackedEntityType({ trackedEntityTypeId, formId, page, triggeredFrom: PAGINATION }));
    },
    searchViaAttributesOnScopeProgram: ({ programId, formId, page }) => {
        dispatch(searchViaAttributesOnScopeProgram({ programId, formId, page, triggeredFrom: PAGINATION }));
    },
});


export const SearchResults: ComponentType<OwnProps> =
  compose(
      connect<Props, OwnProps, _, _, _, _>(mapStateToProps, mapDispatchToProps),
  )(SearchResultsComponent);
