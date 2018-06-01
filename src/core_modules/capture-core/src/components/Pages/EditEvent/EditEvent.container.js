// @flow
import { connect } from 'react-redux';
import EditEvent from './EditEvent.component';
import withLoadHandler from './withLoadHandler';

const mapStateToProps = (state: ReduxState) => ({
    isLoading: state.editEventPage.isLoading,
    loadError: state.editEventPage.loadError,
});

// $FlowSuppress
export default connect(mapStateToProps)(withLoadHandler()(EditEvent));
