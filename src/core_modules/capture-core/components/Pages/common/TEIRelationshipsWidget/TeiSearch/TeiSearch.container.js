// @flow
import { type ComponentType } from 'react';
import { connect } from 'react-redux';
import { TeiSearchComponent } from './TeiSearch.component';
import {
    requestSearchTei,
    searchFormValidationFailed,
    teiNewSearch,
    teiEditSearch,
    teiSearchResultsChangePage,
    setOpenSearchGroupSection,
} from './actions/teiSearch.actions';
import type { Props, OwnProps } from './TeiSearch.types';
import { getSearchGroups } from './getSearchGroups';
import { getTrackedEntityTypeThrowIfNotFound } from '../../../../../metaData';

const mapStateToProps = (state: ReduxState, props: OwnProps) => {
    const { selectedTrackedEntityTypeId } = props;
    const currentTeiSearch = state.teiSearch[props.id] ?? {};
    const selectedProgramId = currentTeiSearch.selectedProgramId;
    const searchGroups = getSearchGroups(selectedTrackedEntityTypeId, selectedProgramId);
    const { name } = getTrackedEntityTypeThrowIfNotFound(selectedTrackedEntityTypeId);
    return {
        searchGroups,
        showResults: !!currentTeiSearch.searchResults,
        openSearchGroupSection: currentTeiSearch.openSearchGroupSection,
        trackedEntityTypeName: name.toLowerCase(),
        selectedProgramId,
    };
};

const mapDispatchToProps = (dispatch: ReduxDispatch, ownProps: OwnProps) => ({
    onSearch: (formId: string, searchGroupId: string, searchId: string) => {
        dispatch(requestSearchTei(formId, searchGroupId, searchId, ownProps.resultsPageSize));
    },
    onSearchResultsChangePage: (searchId: string, pageNumber: number) => {
        dispatch(teiSearchResultsChangePage(searchId, pageNumber, ownProps.resultsPageSize));
    },
    onSearchValidationFailed: (formId: string, searchGroupId: string, searchId: string) => {
        dispatch(searchFormValidationFailed(formId, searchGroupId, searchId));
    },
    onNewSearch: (searchId: string) => {
        dispatch(teiNewSearch(searchId));
    },
    onEditSearch: (searchId: string) => {
        dispatch(teiEditSearch(searchId));
    },
    onSetOpenSearchGroupSection: (searchId: string, searchGroupId: ?string) => {
        dispatch(setOpenSearchGroupSection(searchId, searchGroupId));
    },
});

export const TeiSearch: ComponentType<OwnProps> =
  connect<$Diff<Props, CssClasses>, OwnProps, _, _, _, _>(mapStateToProps, mapDispatchToProps)(TeiSearchComponent);
