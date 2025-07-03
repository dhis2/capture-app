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
import { getSearchGroups } from './getSearchGroups';
import { getTrackedEntityTypeThrowIfNotFound } from '../../../../../metaData';

const mapStateToProps = (state, props) => {
    const currentTeiSearch = state.teiSearch[props.id] ?? {};
    const { selectedTrackedEntityTypeId } = props;
    const searchGroups = getSearchGroups(selectedTrackedEntityTypeId, currentTeiSearch.selectedProgramId);
    const { name } = getTrackedEntityTypeThrowIfNotFound(selectedTrackedEntityTypeId);
    return {
        searchGroups,
        showResults: !!currentTeiSearch.searchResults,
        openSearchGroupSection: currentTeiSearch.openSearchGroupSection,
        trackedEntityTypeName: name.toLowerCase(),
        selectedProgramId: currentTeiSearch.selectedProgramId,
    };
};

const mapDispatchToProps = (dispatch, ownProps) => ({
    onSearch: (formId, searchGroupId, searchId) => {
        dispatch(requestSearchTei(formId, searchGroupId, searchId, ownProps.resultsPageSize));
    },
    onSearchResultsChangePage: (searchId, pageNumber) => {
        dispatch(teiSearchResultsChangePage(searchId, pageNumber, ownProps.resultsPageSize));
    },
    onSearchValidationFailed: (formId, searchGroupId, searchId) => {
        dispatch(searchFormValidationFailed(formId, searchGroupId, searchId));
    },
    onNewSearch: (searchId) => {
        dispatch(teiNewSearch(searchId));
    },
    onEditSearch: (searchId) => {
        dispatch(teiEditSearch(searchId));
    },
    onSetOpenSearchGroupSection: (searchId, searchGroupId) => {
        dispatch(setOpenSearchGroupSection(searchId, searchGroupId));
    },
});

export const TeiSearch =
  connect(mapStateToProps, mapDispatchToProps)(TeiSearchComponent);
