// @flow
import { connect } from 'react-redux';
import ViewEventSelector from '../ViewEventSelector/ViewEventSelector.container';
import withLoadingIndicator from '../../../../HOC/withLoadingIndicator';
import withErrorMessageHandler from '../../../../HOC/withErrorMessageHandler';

const mapStateToProps = (state: ReduxState) => ({
    ready: !state.viewEventPage.isLoading,
    error: state.viewEventPage.loadError,
});

const mapDispatchToProps = () => ({
});

// $FlowSuppress
export default connect(
    mapStateToProps, mapDispatchToProps)(withLoadingIndicator()(withErrorMessageHandler()(ViewEventSelector)));
