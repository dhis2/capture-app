import { connect } from 'react-redux';
import { ProgramSelectorComponent } from './ProgramSelector.component';
import { changeProgram, clearProgramFilter } from '../registrationSection.actions';

const mapStateToProps = (state: any) => ({
    orgUnitIds: state.newRelationshipRegisterTei.orgUnit ? [state.newRelationshipRegisterTei.orgUnit.id] : null,
    trackedEntityTypeId: state.newRelationship.selectedRelationshipType.to.trackedEntityTypeId,
    value: state.newRelationshipRegisterTei.programId,
});

const mapDispatchToProps = (dispatch: any) => ({
    onUpdateSelectedProgram: (programId: string) => {
        dispatch(changeProgram(programId));
    },
    onClearFilter: () => {
        dispatch(clearProgramFilter());
    },
});

export const ProgramSelector = connect(mapStateToProps, mapDispatchToProps)(ProgramSelectorComponent);
