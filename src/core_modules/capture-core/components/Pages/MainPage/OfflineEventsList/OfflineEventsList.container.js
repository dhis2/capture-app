// @flow
import { connect } from 'react-redux';
import OfflineEventsList from '../../../EventsList/OfflineEventsList/OfflineEventsList.component';

const mapStateToProps = (state: ReduxState) => ({
    events: state.events,
    eventsValues: state.eventsValues,
});

// $FlowFixMe[missing-annot] automated comment
export default connect(mapStateToProps, () => ({}))(OfflineEventsList);
