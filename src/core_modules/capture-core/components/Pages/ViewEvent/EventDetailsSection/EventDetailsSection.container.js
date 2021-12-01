// @flow
import { connect } from 'react-redux';
import {
    startShowEditEventDataEntry,
} from './eventDetails.actions';
import { EventDetailsSection } from './EventDetailsSection.component';

const mapStateToProps = (state: ReduxState) => ({
    showEditEvent: state.viewEventPage.eventDetailsSection && state.viewEventPage.eventDetailsSection.showEditEvent,
});

const mapDispatchToProps = (dispatch: ReduxDispatch): any => ({
    onOpenEditEvent: () => {
        dispatch(startShowEditEventDataEntry());
    },
});

// $FlowSuppress
// $FlowFixMe[missing-annot] automated comment
export const EventDetails = connect(mapStateToProps, mapDispatchToProps)(EventDetailsSection);
