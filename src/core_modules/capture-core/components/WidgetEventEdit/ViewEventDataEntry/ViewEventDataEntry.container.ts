import { connect } from 'react-redux';
import { ViewEventDataEntryComponent } from './ViewEventDataEntry.component';
import { withLoadingIndicator } from '../../../HOC/withLoadingIndicator';
import { withCustomLabels } from '../../../HOC/withCustomLabels';

const customLabels = {
    notesLabel: { key: 'note', plural: true },
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
    withLoadingIndicator()(
        withCustomLabels(customLabels)(ViewEventDataEntryComponent),
    ),
);
