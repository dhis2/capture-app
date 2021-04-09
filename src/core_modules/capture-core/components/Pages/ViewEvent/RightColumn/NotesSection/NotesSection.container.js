// @flow
import { connect } from 'react-redux';
import { NotesSectionComponent } from './NotesSection.component';
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
// $FlowFixMe[missing-annot] automated comment
export const NotesSection = connect(mapStateToProps, mapDispatchToProps)(NotesSectionComponent);
