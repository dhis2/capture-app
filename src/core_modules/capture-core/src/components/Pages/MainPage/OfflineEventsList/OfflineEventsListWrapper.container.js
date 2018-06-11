// @flow
import { connect } from 'react-redux';
import OfflineEventsListWrapper from './OfflineEventsListWrapper.component';

const mapStateToProps = (state: ReduxState) => ({
    hasData: !!(state.workingLists.main && state.workingLists.main.order && state.workingLists.main.order.length > 0),
});

export default connect(mapStateToProps)(OfflineEventsListWrapper);
