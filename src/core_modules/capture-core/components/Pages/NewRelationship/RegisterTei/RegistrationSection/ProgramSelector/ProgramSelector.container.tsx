import { connect } from 'react-redux';
import { ProgramSelectorComponent } from './ProgramSelector.component';
import { changeProgram } from '../registrationSection.actions';

const mapStateToProps = (state: any) => ({
    trackedEntityTypeId: state.newRelationship.selectedRelationshipType.to.trackedEntityTypeId,
    value: state.newRelationshipRegisterTei.programId,
});

const mapDispatchToProps = (dispatch: any) => ({
    onUpdateSelectedProgram: (programId: string) => {
        dispatch(changeProgram(programId));
    },
});

export const ProgramSelector = connect(mapStateToProps, mapDispatchToProps)(ProgramSelectorComponent);
