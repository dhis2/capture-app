import type { ComponentType } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { SearchResultsComponent } from './SearchResults.component';
import type { PropsFromRedux, DispatchersFromRedux, OwnProps } from './SearchResults.types';
import {
    navigateToNewTrackedEntityPage,
    searchViaAttributesOnScopeTrackedEntityType,
    searchViaAttributesOnScopeProgram,
    startFallbackSearch,
} from '../SearchBox.actions';
import { getTrackedEntityTypeThrowIfNotFound, getTrackerProgramThrowIfNotFound } from '../../../metaData/helpers';
import { searchScopes, PAGINATION } from '../SearchBox.constants';
import { setPrepopulateDataOnNewPage } from '../../Pages/New/NewPage.actions';
import { filteredRangeForPrepopulation } from '../hooks';

const getCurrentScope = (scopeId: string, scopeType: keyof typeof searchScopes) => {
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

const getName = (scopeEntity: any) => (scopeEntity ? scopeEntity.name : '');
const getDataElements = (scopeEntity: any) => (scopeEntity ? [...scopeEntity.attributes.values()] : []);

const mapStateToProps = (state: any): PropsFromRedux => {
    const {
        searchResults,
        otherResults,
        otherCurrentPage,
        currentPage,
        currentSearchInfo: {
            searchScopeType: currentSearchScopeType,
            searchScopeId: currentSearchScopeId,
            formId: currentFormId,
            currentSearchTerms,
        },
    } = state.searchDomain;

    const scopeEntity = getCurrentScope(currentSearchScopeId, currentSearchScopeType);

    const currentSearchScopeName = getName(scopeEntity);
    const currentSearchScopeDataElements = getDataElements(scopeEntity);

    const dataElements = currentSearchScopeDataElements
        .filter(({ displayInReports }: any) => displayInReports)
        .map(({ id, name, type, optionSet }: any) => ({ id, name, type, optionSet }));
    const { orgUnitId } = state.currentSelections;

    return {
        currentPage,
        searchResults,
        otherResults,
        otherCurrentPage,
        currentSearchScopeType,
        currentSearchScopeId,
        currentSearchScopeName,
        currentFormId,
        currentSearchTerms,
        dataElements,
        orgUnitId,
    };
};

const mapDispatchToProps = (dispatch: any, { availableSearchOptions }: any): DispatchersFromRedux => ({
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
    startFallbackSearch: ({ programId, formId, resultsPageSize, page }) => {
        dispatch(startFallbackSearch({
            programId,
            formId,
            availableSearchOptions,
            pageSize: resultsPageSize,
            page,
        }));
    },
    handleCreateNew: (currentSearchTerms) => {
        const filteredSearchTerms = filteredRangeForPrepopulation(currentSearchTerms);
        dispatch(setPrepopulateDataOnNewPage(filteredSearchTerms));
        dispatch(navigateToNewTrackedEntityPage());
    },
});

export const SearchResults: ComponentType<OwnProps> =
  compose(
      connect(mapStateToProps, mapDispatchToProps),
  )(SearchResultsComponent);
