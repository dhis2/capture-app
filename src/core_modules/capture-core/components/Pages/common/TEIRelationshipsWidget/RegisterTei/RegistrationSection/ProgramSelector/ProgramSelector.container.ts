import { connect } from 'react-redux';
import { ProgramSelectorComponent } from './ProgramSelector.component';
import { changeProgram, clearProgramFilter } from '../registrationSection.actions';
import type { Dispatch } from 'redux';

type StateProps = {
    orgUnitIds: string[] | null;
    value: string;
};

type DispatchProps = {
    onUpdateSelectedProgram: (programId: string) => void;
    onClearFilter: () => void;
};

type State = {
    newRelationshipRegisterTei: {
        orgUnit?: {
            id: string;
        } | null;
        programId: string;
    };
};

const mapStateToProps = (state: State): StateProps => ({
    orgUnitIds: state.newRelationshipRegisterTei.orgUnit ? [state.newRelationshipRegisterTei.orgUnit.id] : null,
    value: state.newRelationshipRegisterTei.programId,
});

const mapDispatchToProps = (dispatch: Dispatch): DispatchProps => ({
    onUpdateSelectedProgram: (programId: string) => {
        dispatch(changeProgram(programId));
    },
    onClearFilter: () => {
        dispatch(clearProgramFilter());
    },
});

export const ProgramSelector = connect(mapStateToProps, mapDispatchToProps)(ProgramSelectorComponent);
