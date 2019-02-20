// @flow

import { connect } from 'react-redux';
import TeiSearchResults from './TeiSearchResults.component';


const mapStateToProps = (state: ReduxState, props: Object) => {
    const currentTeiSearch = state.teiSearch[props.id] || {};
    const searchResults = currentTeiSearch.searchResults || {};
    return {
        resultsLoading: searchResults.resultsLoading,
        teis: searchResults.teis || [],
        paging: searchResults.paging,
    };
};

const mapDispatchToProps = () => ({
});

// $FlowSuppress
export default connect(mapStateToProps, mapDispatchToProps)(TeiSearchResults);
