// @flow
import { connect } from 'react-redux';
import { startLoadDataEntryEvent } from 'capture-core/components/DataEntry/actions/dataEntryLoadEdit.actions';

import EventCaptureForm from './EventCaptureForm.component';

const mapStateToProps = (state: Object) => ({

});

const mapDispatchToProps = (dispatch: ReduxDispatch) => ({
    onLoadEvent: (eventId: string) => {
        dispatch(startLoadDataEntryEvent(eventId, [{ id: 'eventDate', type: 'DATE' }], 'main'));
    }
});


export default connect(mapStateToProps, mapDispatchToProps)(EventCaptureForm);
