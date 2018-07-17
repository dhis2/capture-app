// @flow
import { connect } from 'react-redux';
import EventsListConnectivityWrapper from './EventsListConnectivityWrapper.component';

const mapStateToProps = (state: ReduxState) => ({
    isOnline: !!state.offline.online,
});

export default connect(mapStateToProps, {})(EventsListConnectivityWrapper);
