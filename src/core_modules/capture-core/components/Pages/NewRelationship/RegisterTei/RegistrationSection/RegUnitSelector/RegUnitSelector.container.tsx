import { connect } from 'react-redux';
import { RegUnitSelectorComponent } from './RegUnitSelector.component';
import { changeOrgUnit, searchOrgUnitFailed } from '../registrationSection.actions';

const mapStateToProps = (state: any) => ({
    value: state.newRelationshipRegisterTei.orgUnit,
    programId: state.newRelationshipRegisterTei.programId,
});

const mapDispatchToProps = (dispatch: any) => ({
    onUpdateSelectedOrgUnit: (orgUnit: Record<string, unknown> | null | undefined, resetProgramSelection: boolean) => {
        dispatch(changeOrgUnit(orgUnit, resetProgramSelection));
    },
    onSearchError: () => {
        dispatch(searchOrgUnitFailed());
    },
});

export const RegUnitSelector = connect(mapStateToProps, mapDispatchToProps)(RegUnitSelectorComponent);
