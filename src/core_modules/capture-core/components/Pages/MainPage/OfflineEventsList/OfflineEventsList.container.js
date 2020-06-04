// @flow
import { connect } from 'react-redux';
import OfflineEventsList from '../../../EventsList/OfflineEventsList/OfflineEventsList.component';
import { openEditEventPage } from '../../../ListView/listView.actions';

const mapStateToProps = (state: ReduxState) => ({
    events: state.events,
    eventsValues: state.eventsValues,
});

const mapDispatchToProps = (dispatch: ReduxDispatch) => ({
    onRowClick: (rowData: {eventId: string}) => {
        window.scrollTo(0, 0);
        dispatch(openEditEventPage(rowData.eventId));
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(OfflineEventsList);
