// @flow
import { connect } from 'react-redux';
import ViewEventDataEntry from './ViewEventDataEntry.component';
import withLoadingIndicator from '../../../../../HOC/withLoadingIndicator';


const mapStateToProps = (state: ReduxState) => {
    const eventDetailsSection = state.viewEventPage.eventDetailsSection || {};
    return {
        ready: !eventDetailsSection.loading,
    };
};

const mapDispatchToProps = (): any => ({});

// $FlowSuppress
export default connect(mapStateToProps, mapDispatchToProps)(withLoadingIndicator()(ViewEventDataEntry));
