// @flow

import { connect } from 'react-redux';
import QuickSelector from './QuickSelector.component';
import { setOrgUnitId, storeOrgUnitObject, setProgramId, setCategoryId } from './actions/QuickSelector.actions';

const mapStateToProps = (state: Object) => ({
    selectedProgramId: state.currentSelections.programId,
    selectedCategories: state.currentSelections.categories,
    // We currently have orgUnit (Object) and orgUnitId (string). Do we need both?
    selectedOrgUnitId: state.currentSelections.orgUnitId,
    storedOrgUnits: state.organisationUnits,
});

const mapDispatchToProps = (dispatch: ReduxDispatch) => ({
    onSetOrgUnitId: (orgUnitId: string) => {
        dispatch(setOrgUnitId(orgUnitId));
    },
    onStoreOrgUnitObject: (orgUnitObject: Object) => {
        dispatch(storeOrgUnitObject(orgUnitObject));
    },
    onSetProgramId: (programId: string) => {
        dispatch(setProgramId(programId));
    },
    onSetCategoryOptionId: (categoryId: string, selectedCategoryOptionId: string) => {
        dispatch(setCategoryId(categoryId, selectedCategoryOptionId));
    },
});

// $FlowSuppress
export default connect(mapStateToProps, mapDispatchToProps)(QuickSelector);
