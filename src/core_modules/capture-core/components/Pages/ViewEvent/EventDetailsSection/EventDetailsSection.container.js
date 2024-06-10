// @flow
import { connect } from 'react-redux';
import type { OrgUnit } from '@dhis2/rules-engine-javascript';
import { EventDetailsSection } from './EventDetailsSection.component';
import {
    startShowEditEventDataEntry,
} from './eventDetails.actions';

const mapStateToProps = (state: ReduxState) => ({
    showEditEvent: state.viewEventPage.eventDetailsSection && state.viewEventPage.eventDetailsSection.showEditEvent,
    eventId: state.viewEventPage.eventId,
    programId: state.currentSelections.programId,
});

const mapDispatchToProps = (dispatch: ReduxDispatch): any => ({
    onOpenEditEvent: (orgUnit: OrgUnit) => {
        dispatch(startShowEditEventDataEntry(orgUnit));
    },
});

// $FlowSuppress
// $FlowFixMe[missing-annot] automated comment
export const EventDetails = connect(mapStateToProps, mapDispatchToProps)(EventDetailsSection);
