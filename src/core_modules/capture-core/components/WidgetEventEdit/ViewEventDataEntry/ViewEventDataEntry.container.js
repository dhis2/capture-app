// @flow
import { connect } from 'react-redux';
import { withLoadingIndicator } from '../../../HOC/withLoadingIndicator';
import { ViewEventDataEntryComponent } from './ViewEventDataEntry.component';


const mapStateToProps = (state: ReduxState) => {
    const eventDetailsSection = state.viewEventPage.eventDetailsSection || {};
    return {
        ready: !state.activePage.isDataEntryLoading && !eventDetailsSection.loading,
    };
};

const mapDispatchToProps = (): any => ({});

// $FlowSuppress
// $FlowFixMe[missing-annot] automated comment
export const ViewEventDataEntry = connect(mapStateToProps, mapDispatchToProps)(
    withLoadingIndicator()(ViewEventDataEntryComponent),
);
