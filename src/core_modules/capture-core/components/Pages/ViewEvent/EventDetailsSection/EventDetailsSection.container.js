// @flow
import { connect } from 'react-redux';
import EventDetailsSection from './EventDetailsSection.component';
import {
    startShowEditEventDataEntry,
} from './eventDetails.actions';

const mapStateToProps = (state: ReduxState) => ({
    showEditEvent: state.viewEventPage.eventDetailsSection && state.viewEventPage.eventDetailsSection.showEditEvent,
});

const mapDispatchToProps = (dispatch: ReduxDispatch): any => ({
    onOpenEditEvent: () => {
        dispatch(startShowEditEventDataEntry());
    },
});

// $FlowSuppress
export default connect(mapStateToProps, mapDispatchToProps)(EventDetailsSection);
