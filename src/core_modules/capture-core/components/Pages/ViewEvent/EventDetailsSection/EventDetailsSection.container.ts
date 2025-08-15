import { connect } from 'react-redux';
import { EventDetailsSection } from './EventDetailsSection.component';
import {
    startShowEditEventDataEntry,
} from './eventDetails.actions';

const mapStateToProps = (state: any, ownProps: any) => ({
    showEditEvent: state.viewEventPage.eventDetailsSection && state.viewEventPage.eventDetailsSection.showEditEvent,
    eventId: state.viewEventPage.eventId,
    eventData: state.viewEventPage.loadedValues || {},
    programId: state.currentSelections.programId,
    ...ownProps,
});

const mapDispatchToProps = (dispatch: any): any => ({
    onOpenEditEvent: (orgUnit: any, programCategory: any) => {
        dispatch(startShowEditEventDataEntry(orgUnit, programCategory));
    },
});

export const EventDetails = connect(mapStateToProps, mapDispatchToProps)(EventDetailsSection);
