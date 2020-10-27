// @flow
import type { ComponentType } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { SearchResultsComponent } from './SearchResults.component';
import type { Props, PropsFromRedux, DispatchersFromRedux } from './SearchResults.types';
import { searchViaAttributesOnScopeTrackedEntityType, searchViaAttributesOnScopeProgram } from '../SearchPage.actions';
import { getTrackedEntityTypeThrowIfNotFound, getTrackerProgramThrowIfNotFound } from '../../../../metaData/helpers';
import { searchScopes, PAGINATION } from '../SearchPage.constants';

const getCurrentScope = (scopeId: string, scopeType: $Keys<typeof searchScopes>) => {
    if (!scopeId) {
        return null;
    }
    if (scopeType === searchScopes.PROGRAM) {
        return getTrackerProgramThrowIfNotFound(scopeId);
    }
    if (scopeType === searchScopes.TRACKED_ENTITY_TYPE) {
        return getTrackedEntityTypeThrowIfNotFound(scopeId);
    }

    return null;
};

const getName = scopeEntity => (scopeEntity ? scopeEntity.name : '');
const getDataElements = scopeEntity => (scopeEntity ? [...scopeEntity.attributes.values()] : []);

const mapStateToProps = (state: ReduxState): PropsFromRedux => {
    const {
        searchResults,
        currentPage,
        currentSearchInfo: {
            searchScopeType: currentSearchScopeType,
            searchScopeId: currentSearchScopeId,
            formId: currentFormId,
            currentSearchTerms,
        },
    } = state.searchPage;

    const scopeEntity = getCurrentScope(currentSearchScopeId, currentSearchScopeType);

    const currentSearchScopeName = getName(scopeEntity);
    const currentSearchScopeDataElements = getDataElements(scopeEntity);

    const dataElements = currentSearchScopeDataElements
        .filter(({ displayInReports }) => displayInReports)
        .map(({ id, name, type }) => ({ id, name, type }));

    return {
        currentPage,
        searchResults,
        currentSearchScopeType,
        currentSearchScopeId,
        currentSearchScopeName,
        currentFormId,
        currentSearchTerms,
        dataElements,
    };
};


const mapDispatchToProps = (dispatch: ReduxDispatch): DispatchersFromRedux => ({
    searchViaAttributesOnScopeTrackedEntityType: ({ trackedEntityTypeId, formId, page, resultsPageSize }) => {
        dispatch(searchViaAttributesOnScopeTrackedEntityType({
            trackedEntityTypeId,
            formId,
            page,
            pageSize: resultsPageSize,
            triggeredFrom: PAGINATION,
        }));
    },
    searchViaAttributesOnScopeProgram: ({ programId, formId, page, resultsPageSize }) => {
        dispatch(searchViaAttributesOnScopeProgram({
            programId,
            formId,
            page,
            pageSize: resultsPageSize,
            triggeredFrom: PAGINATION,
        }));
    },
});


export const SearchResults: ComponentType<{||}> =
  compose(
      connect<Props, _, _, _, _, _>(mapStateToProps, mapDispatchToProps),
  )(SearchResultsComponent);
