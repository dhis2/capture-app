import { connect } from 'react-redux';
import { NewEventsList } from './RecentlyAddedEventsList.component';

const mapStateToProps = (state: any) => ({
    events: state.recentlyAddedEvents,
    eventsValues: state.recentlyAddedEventsValues,
});

const mapDispatchToProps = () => ({
    onRowClick: () => undefined,
});

export const EventsList = connect(mapStateToProps, mapDispatchToProps)(NewEventsList);
