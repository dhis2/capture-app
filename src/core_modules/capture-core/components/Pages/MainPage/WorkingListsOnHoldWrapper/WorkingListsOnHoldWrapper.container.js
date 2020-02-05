// @flow
import { connect } from 'react-redux';
import WorkingListsOnHoldWrapper from './WorkingListsOnHoldWrapper.component';

const mapStateToProps = (state: ReduxState) => ({
    onHold: !!state.offline.outbox && state.offline.outbox.length > 0,
});

// $FlowSuppress
export default connect(mapStateToProps)(WorkingListsOnHoldWrapper);
