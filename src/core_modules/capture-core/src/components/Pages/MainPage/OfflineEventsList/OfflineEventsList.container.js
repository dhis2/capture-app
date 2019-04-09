// @flow
import { connect } from 'react-redux';
import OfflineEventsList from '../../../EventsList/OfflineEventsList/OfflineEventsList.component';
import { openEditEventPage } from '../EventsList/eventsList.actions';

const mapStateToProps = (state: ReduxState) => {
    const workingListConfigSelector = state.workingListConfigSelector.eventMainPage || {};
    const listId = workingListConfigSelector.currentWorkingListId;
    return {
        events: state.events,
        eventsValues: state.eventsValues,
        listId: workingListConfigSelector.currentWorkingListId,
    };
}

const mapDispatchToProps = (dispatch: ReduxDispatch) => ({
    onRowClick: (rowData: {eventId: string}) => {
        window.scrollTo(0, 0);
        dispatch(openEditEventPage(rowData.eventId));
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(OfflineEventsList);
