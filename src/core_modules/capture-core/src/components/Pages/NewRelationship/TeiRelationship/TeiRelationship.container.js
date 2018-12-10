// @flow
import { connect } from 'react-redux';
import NewRelationship from './TeiRelationship.component';

import {
    openTeiSearch,
} from './teiRelationship.actions';


const mapStateToProps = () => ({});

const mapDispatchToProps = (dispatch: ReduxDispatch) => ({
    onOpenSearch: (trackedEntityTypeId: string, programId: ?string) => {
        dispatch(openTeiSearch(trackedEntityTypeId, programId));
    },
});

// $FlowSuppress
export default connect(mapStateToProps, mapDispatchToProps)(NewRelationship);
