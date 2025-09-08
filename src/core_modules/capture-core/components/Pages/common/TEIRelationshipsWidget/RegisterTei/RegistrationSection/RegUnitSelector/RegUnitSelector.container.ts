import { connect } from 'react-redux';
import type { Dispatch } from 'redux';
import { changeOrgUnit, searchOrgUnitFailed } from '../registrationSection.actions';
import { RegUnitSelectorComponent } from './RegUnitSelector.component';

type StateProps = {
    value: Record<string, any> | null | undefined;
    programId: string;
};

type DispatchProps = {
    onUpdateSelectedOrgUnit: (orgUnit: Record<string, any> | null | undefined, resetProgramSelection: boolean) => void;
    onSearchError: () => void;
};

type State = {
    newRelationshipRegisterTei: {
        orgUnit: Record<string, any> | null | undefined;
        programId: string;
    };
};

const mapStateToProps = (state: State): StateProps => ({
    value: state.newRelationshipRegisterTei.orgUnit,
    programId: state.newRelationshipRegisterTei.programId,
});

const mapDispatchToProps = (dispatch: Dispatch): DispatchProps => ({
    onUpdateSelectedOrgUnit: (orgUnit: Record<string, any> | null | undefined, resetProgramSelection: boolean) => {
        dispatch(changeOrgUnit(orgUnit, resetProgramSelection));
    },
    onSearchError: () => {
        dispatch(searchOrgUnitFailed());
    },
});

export const RegUnitSelector = connect(mapStateToProps, mapDispatchToProps)(RegUnitSelectorComponent);
