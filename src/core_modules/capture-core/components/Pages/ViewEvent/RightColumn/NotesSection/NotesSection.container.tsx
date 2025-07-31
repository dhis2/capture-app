import { connect } from 'react-redux';
import { NotesSectionComponent } from './NotesSection.component';

const mapStateToProps = (state: any) => ({
    notes: state.viewEventPage.loadedValues.notes,
});

const mapDispatchToProps = (dispatch: any) => ({
    onAddNote: (note: string) => {
        dispatch({ type: 'ADD_NOTE', payload: { note } });
    },
});

export const NotesSection = connect(mapStateToProps, mapDispatchToProps)(NotesSectionComponent);
