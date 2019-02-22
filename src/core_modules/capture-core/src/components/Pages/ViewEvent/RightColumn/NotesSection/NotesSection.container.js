// @flow
import { connect } from 'react-redux';
import NotesSection from './NotesSection.component';
import { requestSaveEventNote, updateEventNoteField } from '../../Notes/viewEventNotes.actions';

const mapStateToProps = (state: ReduxState, props: Object) => ({
    notes: state.notes.viewEvent || [],
    fieldValue: state.viewEventPage.notesSection && state.viewEventPage.notesSection.fieldValue,
});


const mapDispatchToProps = (dispatch: ReduxDispatch) => ({
    onAddNote: (note: string) => {
        dispatch(requestSaveEventNote(note));
    },
    onUpdateNoteField: (value: string) => {
        dispatch(updateEventNoteField(value));
    },
});

// $FlowSuppress
export default connect(mapStateToProps, mapDispatchToProps)(NotesSection);
