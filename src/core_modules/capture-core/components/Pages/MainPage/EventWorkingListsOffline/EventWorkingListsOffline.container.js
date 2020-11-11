// @flow
import { connect } from 'react-redux';
import OfflineEventsList from '../../../EventsList/OfflineEventsList/OfflineEventsList.component';

const mapStateToProps = (state: ReduxState) => ({
    events: state.events,
    eventsValues: state.eventsValues,
});

const mapDispatchToProps = () => ({});
// $FlowFixMe file deleted in next PR
export const EventWorkingListsOffline = connect(mapStateToProps, mapDispatchToProps)(OfflineEventsList);
