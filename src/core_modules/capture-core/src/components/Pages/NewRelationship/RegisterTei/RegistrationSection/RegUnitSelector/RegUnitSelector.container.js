// @flow
import { connect } from 'react-redux';
import RegUnitSelector from './RegUnitSelector.component';
import { changeOrgUnit, searchOrgUnitFailed } from '../registrationSection.actions';

const mapStateToProps = (state: ReduxState) => ({
    value: state.newRelationshipRegisterTei.orgUnit,
    programId: state.newRelationshipRegisterTei.programId,
});

const mapDispatchToProps = (dispatch: ReduxDispatch) => ({
    onUpdateSelectedOrgUnit: (orgUnit: ?Object, resetProgramSelection: boolean) => {
        dispatch(changeOrgUnit(orgUnit, resetProgramSelection));
    },
    onSearchError: () => {
        dispatch(searchOrgUnitFailed());
    },
});

// $FlowSuppress
export default connect(mapStateToProps, mapDispatchToProps)(RegUnitSelector);
