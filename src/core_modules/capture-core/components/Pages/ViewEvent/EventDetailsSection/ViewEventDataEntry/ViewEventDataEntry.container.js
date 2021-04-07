// @flow
import { connect } from 'react-redux';
import { ViewEventDataEntry as ViewEventDataEntryComponent } from './ViewEventDataEntry.component';
import { withLoadingIndicator } from '../../../../../HOC/withLoadingIndicator';


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
    withLoadingIndicator()(ViewEventDataEntryComponent)
);
