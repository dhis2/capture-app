// @flow

// @flow
import { connect } from 'react-redux';
import EventCaptureForm from './EventCaptureForm.component';

const mapStateToProps = (state: Object) => ({
    eventId: state.dataEntry.eventId,
});

/*
const mapDispatchToProps = (dispatch: ReduxDispatch) => ({
   
});
*/

export default connect(mapStateToProps)(EventCaptureForm);
