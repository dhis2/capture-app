// @flow
import { connect } from 'react-redux';
import NotesSection from './NotesSection.component';
import { requestSaveEventNote, updateEventNoteField } from './viewEventNotes.actions';
import { getEventProgramThrowIfNotFound } from '../../../../metaData';

const mapStateToProps = (state: ReduxState, { selectedScopeId }) => {
    const notesSection = state.viewEventPage.notesSection || {};
    return {
        notes: state.notes.viewEvent || [],
        ready: !notesSection.isLoading,
        fieldValue: notesSection.fieldValue,
        programStage: getEventProgramThrowIfNotFound(selectedScopeId).stage,
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
export default connect(mapStateToProps, mapDispatchToProps)(NotesSection);
