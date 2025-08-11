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
import { makeSearchGroupsSelector } from './teiSearch.selectors';
import type { OwnProps } from './TeiSearch.types';

const makeMapStateToProps = () => {
    const searchGroupsSelector = makeSearchGroupsSelector();

    const mapStateToProps = (state: any, props: OwnProps) => {
        const searchGroups = searchGroupsSelector(state, props);
        const currentTeiSearch = state.teiSearch[props.id];
        return {
            searchGroups,
            showResults: !!currentTeiSearch.searchResults,
            selectedProgramId: currentTeiSearch.selectedProgramId,
            selectedTrackedEntityTypeId: currentTeiSearch.selectedTrackedEntityTypeId,
            openSearchGroupSection: currentTeiSearch.openSearchGroupSection,
        };
    };

    return mapStateToProps;
};

const mapDispatchToProps = (dispatch: any, ownProps: OwnProps) => ({
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
    onSetOpenSearchGroupSection: (searchId: string, searchGroupId?: string) => {
        dispatch(setOpenSearchGroupSection(searchId, searchGroupId));
    },
});

export const TeiSearch = connect(makeMapStateToProps, mapDispatchToProps)(TeiSearchComponent);
