// @flow
import { connect } from 'react-redux';
import EventCaptureForm from './EventCaptureForm.component';
import { startCompleteForm } from './eventCaptureForm.actions';

const mapStateToProps = (state: Object) => ({
    eventId: state.dataEntry.eventId,
});

const mapDispatchToProps = (dispatch: ReduxDispatch) => ({
    onCompleteForm: () => {
        dispatch(startCompleteForm());
    },
});


export default connect(mapStateToProps, mapDispatchToProps)(EventCaptureForm);
