// @flow
import { connect } from 'react-redux';
import NotesSection from './NotesSection.component';
import { requestSaveEventNote, updateEventNoteField } from '../../Notes/viewEventNotes.actions';

const mapStateToProps = (state: ReduxState) => {
    const notesSection = state.viewEventPage.notesSection || {};
    return {
        notes: state.notes.viewEvent || [],
        ready: !notesSection.isLoading,
        fieldValue: notesSection.fieldValue,
    };
};


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
