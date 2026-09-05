import { connect } from 'react-redux';
import { NotesSectionComponent } from './NotesSection.component';
import { requestSaveEventNote, updateEventNoteField } from '../../Notes/viewEventNotes.actions';

const mapStateToProps = (state: any) => {
    const notesSection = state.viewEventPage.notesSection || {};
    return {
        notes: state.notes.viewEvent || [],
        ready: !notesSection.isLoading,
        fieldValue: notesSection.fieldValue,
    };
};

const mapDispatchToProps = (dispatch: any) => ({
    onAddNote: (note: string) => {
        dispatch(requestSaveEventNote(note));
    },
    onUpdateNoteField: (value: string) => {
        dispatch(updateEventNoteField(value));
    },
});

export const NotesSection = connect(mapStateToProps, mapDispatchToProps)(NotesSectionComponent);
