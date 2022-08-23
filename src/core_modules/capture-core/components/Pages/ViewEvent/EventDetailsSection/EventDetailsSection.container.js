// @flow
import { connect } from 'react-redux';
import type { OrgUnit } from 'capture-core-utils/rulesEngine';
import { EventDetailsSection } from './EventDetailsSection.component';
import {
    startShowEditEventDataEntry,
} from './eventDetails.actions';

const mapStateToProps = (state: ReduxState) => ({
    showEditEvent: state.viewEventPage.eventDetailsSection && state.viewEventPage.eventDetailsSection.showEditEvent,
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
