// @flow

import { connect } from 'react-redux';
import TeiSearchResults from './TeiSearchResults.component';
import { newSearch, editSearch } from './teiSearchResults.actions';


const mapStateToProps = (state: ReduxState, props: Object) => ({
    resultsLoading: state.teiSearch[props.id].resultsLoading,
    results: state.teiSearch[props.id].results ? state.teiSearch[props.id].results.teis : [],
});

const mapDispatchToProps = (dispatch: ReduxDispatch) => ({
});

// $FlowSuppress
export default connect(mapStateToProps, mapDispatchToProps)(TeiSearchResults);
