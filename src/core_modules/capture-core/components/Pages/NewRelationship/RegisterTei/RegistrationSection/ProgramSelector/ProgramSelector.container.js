// @flow
import { connect } from 'react-redux';
import { changeProgram, clearProgramFilter } from '../registrationSection.actions';
import { ProgramSelectorComponent } from './ProgramSelector.component';

const mapStateToProps = (state: ReduxState) => ({
    orgUnitIds: state.newRelationshipRegisterTei.orgUnit ? [state.newRelationshipRegisterTei.orgUnit.id] : null,
    trackedEntityTypeId: state.newRelationship.selectedRelationshipType.to.trackedEntityTypeId,
    value: state.newRelationshipRegisterTei.programId,
});

const mapDispatchToProps = (dispatch: ReduxDispatch) => ({
    onUpdateSelectedProgram: (programId: string) => {
        dispatch(changeProgram(programId));
    },
    onClearFilter: () => {
        dispatch(clearProgramFilter());
    },
});

// $FlowSuppress
// $FlowFixMe[missing-annot] automated comment
export const ProgramSelector = connect(mapStateToProps, mapDispatchToProps)(ProgramSelectorComponent);
