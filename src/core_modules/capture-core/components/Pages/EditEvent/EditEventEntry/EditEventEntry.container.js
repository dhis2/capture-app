// @flow
import { connect } from 'react-redux';
import EditEventSelector from '../EditEventSelector/EditEventSelector.container';
import withLoadingIndicator from '../../../../HOC/withLoadingIndicator';
import withErrorMessageHandler from '../../../../HOC/withErrorMessageHandler';

const mapStateToProps = (state: ReduxState) => ({
    ready: !state.editEventPage.isLoading,
    error: state.editEventPage.loadError,
});

const mapDispatchToProps = () => ({
});

// $FlowSuppress
export default connect(
    mapStateToProps, mapDispatchToProps)(withLoadingIndicator()(withErrorMessageHandler()(EditEventSelector)));
