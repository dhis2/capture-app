// @flow
import { connect } from 'react-redux';
import { ViewEventDataEntryComponent } from './ViewEventDataEntry.component';
import { withLoadingIndicator } from '../../../HOC/withLoadingIndicator';


const mapStateToProps = (state: ReduxState) => {
    const eventDetailsSection = state.viewEventPage.eventDetailsSection || {};
    const eventOccurredAt = state.events[state.viewEventPage.eventId]?.occurredAt;
    return {
        ready: !state.activePage.isDataEntryLoading && !eventDetailsSection.loading,
        eventStatus: eventOccurredAt ? 'occurredAt' : 'scheduledAt',
    };
};

const mapDispatchToProps = (): any => ({});

// $FlowSuppress
// $FlowFixMe[missing-annot] automated comment
export const ViewEventDataEntry = connect(mapStateToProps, mapDispatchToProps)(
    withLoadingIndicator()(ViewEventDataEntryComponent),
);
