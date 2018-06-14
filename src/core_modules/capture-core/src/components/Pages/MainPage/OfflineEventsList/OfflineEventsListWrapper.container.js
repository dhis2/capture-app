// @flow
import { connect } from 'react-redux';
import OfflineEventsListWrapper from './OfflineEventsListWrapper.component';

const mapStateToProps = (state: ReduxState) => ({
    hasData: !!(state.workingListsContext.main),
});

export default connect(mapStateToProps)(OfflineEventsListWrapper);
