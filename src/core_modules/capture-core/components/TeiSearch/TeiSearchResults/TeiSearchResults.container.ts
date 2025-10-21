import { connect } from 'react-redux';
import { TeiSearchResultsComponent } from './TeiSearchResults.component';
import { withLoadingIndicator } from '../../../HOC';
import type { OwnProps } from './TeiSearchResults.types';

const mapStateToProps = (state: any, props: OwnProps) => {
    const currentTeiSearch = state.teiSearch[props.id] || {};
    const searchResults = currentTeiSearch.searchResults || {};
    const searchValues = state.formsValues[searchResults.formId];
    const searchGroup = props.searchGroups[parseInt(searchResults.searchGroupId, 10)];
    return {
        resultsLoading: searchResults.resultsLoading,
        teis: searchResults.teis || [],
        currentPage: searchResults.currentPage,
        searchValues,
        selectedProgramId: currentTeiSearch.selectedProgramId,
        selectedTrackedEntityTypeId: currentTeiSearch.selectedTrackedEntityTypeId,
        searchGroup,
    };
};

const mapDispatchToProps = () => ({});

export const TeiSearchResults = connect(mapStateToProps, mapDispatchToProps)(
    withLoadingIndicator(
        () => ({ padding: '100px 0' }),
        null,
        (props: any) => (!props.resultsLoading),
    )(TeiSearchResultsComponent),
);
