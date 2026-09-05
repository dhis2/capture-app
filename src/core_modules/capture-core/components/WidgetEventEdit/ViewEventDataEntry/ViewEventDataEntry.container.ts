import { connect } from 'react-redux';
import { ViewEventDataEntryComponent } from './ViewEventDataEntry.component';
import { withLoadingIndicator } from '../../../HOC/withLoadingIndicator';
import { withCustomLabels } from '../../../HOC/withCustomLabels';

// Example use of withCustomLabels: injects `orgUnitLabel` and `eventLabel` as
// props, resolved against the current program's custom terminology (programId
// is supplied via mapStateToProps below).
const customLabels = {
    orgUnitLabel: { key: 'orgUnit' },
    eventLabel: { key: 'event' },
} as const;

const mapStateToProps = (state: any, props: any) => {
    const eventDetailsSection = state.viewEventPage.eventDetailsSection || {};
    const eventStatus = state.viewEventPage?.loadedValues?.eventContainer?.event?.status;
    const itemId = state.dataEntries[props.dataEntryId] && state.dataEntries[props.dataEntryId].itemId;
    const programId = state.currentSelections.programId;

    return {
        ready: !state.activePage.isDataEntryLoading && !eventDetailsSection.loading,
        eventStatus,
        itemId,
        programId,
    };
};

const mapDispatchToProps = (): any => ({});

export const ViewEventDataEntry = connect(mapStateToProps, mapDispatchToProps)(
    withLoadingIndicator()(withCustomLabels(customLabels)(ViewEventDataEntryComponent)),
);
