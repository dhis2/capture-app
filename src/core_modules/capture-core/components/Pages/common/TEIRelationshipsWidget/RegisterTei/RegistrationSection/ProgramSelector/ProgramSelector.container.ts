import { connect } from 'react-redux';
import type { Dispatch } from 'redux';
import { changeProgram } from '../registrationSection.actions';
import { ProgramSelectorComponent } from './ProgramSelector.component';

type StateProps = {
    value: string;
};

type DispatchProps = {
    onUpdateSelectedProgram: (programId: string) => void;
};

type State = {
    newRelationshipRegisterTei: {
        programId: string;
    };
};

const mapStateToProps = (state: State): StateProps => ({
    value: state.newRelationshipRegisterTei.programId,
});

const mapDispatchToProps = (dispatch: Dispatch): DispatchProps => ({
    onUpdateSelectedProgram: (programId: string) => {
        dispatch(changeProgram(programId));
    },
});

export const ProgramSelector = connect(mapStateToProps, mapDispatchToProps)(ProgramSelectorComponent);
