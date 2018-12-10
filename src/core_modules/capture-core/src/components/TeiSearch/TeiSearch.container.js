// @flow

import { connect } from 'react-redux';
import TeiSearch from './TeiSearch.component';

import {
    requestSearchTei,
} from './actions/teiSearch.actions';


const mapStateToProps = (state: ReduxState, props: Object) => ({
    showResults: state.teiSearch[props.id] && state.teiSearch[props.id].showResults,
});

const mapDispatchToProps = (dispatch: ReduxDispatch) => ({
    onSearch: (formId: string, itemId: string, searchId: string, trackedEntityTypeId: string, programId: ?string) => {
        dispatch(requestSearchTei(formId, itemId, searchId, trackedEntityTypeId, programId));
    },
});

// $FlowSuppress
export default connect(mapStateToProps, mapDispatchToProps)(TeiSearch);
