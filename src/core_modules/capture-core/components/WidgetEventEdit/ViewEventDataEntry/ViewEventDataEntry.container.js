// @flow
import { connect } from 'react-redux';
import { ViewEventDataEntryComponent } from './ViewEventDataEntry.component';
import { withLoadingIndicator } from '../../../HOC/withLoadingIndicator';


const mapStateToProps = (state: ReduxState, props: Object) => {
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

// $FlowSuppress
// $FlowFixMe[missing-annot] automated comment
export const ViewEventDataEntry = connect(mapStateToProps, mapDispatchToProps)(
    withLoadingIndicator()(ViewEventDataEntryComponent),
);
