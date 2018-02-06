// @flow
import { connect } from 'react-redux';
import EventCaptureForm from './EventCaptureForm.component';

import { startLoadDataEntryEvent } from 'capture-core/components/DataEntry/actions/dataEntry.actions';

const mapStateToProps = (state: Object) => ({

});

const mapDispatchToProps = (dispatch: ReduxDispatch) => ({
    onLoadEvent: (eventId: string) => {
        dispatch(startLoadDataEntryEvent(eventId, [{ id: 'eventDate', type: 'DATE' }], 'main'));
    }
});


export default connect(mapStateToProps, mapDispatchToProps)(EventCaptureForm);
