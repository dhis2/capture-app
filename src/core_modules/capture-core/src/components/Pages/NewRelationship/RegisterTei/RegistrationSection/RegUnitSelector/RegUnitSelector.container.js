// @flow
import { connect } from 'react-redux';
import RegUnitSelector from './RegUnitSelector.component';
import { changeOrgUnit, searchOrgUnitFailed } from '../registrationSection.actions';

const mapStateToProps = (state: ReduxState) => ({
    value: state.newRelationshipRegisterTei.orgUnit,
});

const mapDispatchToProps = (dispatch: ReduxDispatch) => ({
    onUpdateSelectedOrgUnit: (orgUnit: ?Object) => {
        dispatch(changeOrgUnit(orgUnit));
    },
    onSearchError: () => {
        dispatch(searchOrgUnitFailed());
    },
});

// $FlowSuppress
export default connect(mapStateToProps, mapDispatchToProps)(RegUnitSelector);
