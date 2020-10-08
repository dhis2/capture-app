// @flow
import { connect } from 'react-redux';
import TeiSearchResults from './TeiSearchResults.component';


const mapStateToProps = (state: ReduxState, props: Object) => {
    const currentTeiSearch = state.teiSearch[props.id] || {};
    const searchResults = currentTeiSearch.searchResults || {};
    const searchValues = state.formsValues[searchResults.formId];
    // eslint-disable-next-line radix
    const searchGroup = props.searchGroups[parseInt(searchResults.searchGroupId)];
    return {
        resultsLoading: searchResults.resultsLoading,
        teis: searchResults.teis || [],
        paging: searchResults.paging,
        searchValues,
        searchProgramId: currentTeiSearch.selectedProgramId,
        searchGroup,
    };
};

const mapDispatchToProps = () => ({});

// $FlowFixMe[missing-annot] automated comment
export default connect(mapStateToProps, mapDispatchToProps)(TeiSearchResults);
