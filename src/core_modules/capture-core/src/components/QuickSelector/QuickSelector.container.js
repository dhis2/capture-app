// @flow

import { connect } from 'react-redux';
import QuickSelector from './QuickSelector.component';
import { setOrgUnitId, storeOrgUnitObject, setCategoryId, resetCategorySelections, goBackToListContext } from './actions/QuickSelector.actions';

const mapStateToProps = (state: Object) => ({
    selectedProgramId: state.currentSelections.programId,
    selectedCategories: state.currentSelections.categories,
    selectedOrgUnitId: state.currentSelections.orgUnitId,
    selectionComplete: state.currentSelections.complete,
    storedOrgUnits: state.organisationUnits,
});

const mapDispatchToProps = (dispatch: ReduxDispatch) => ({
    onSetOrgUnitId: (orgUnitId: string) => {
        dispatch(setOrgUnitId(orgUnitId));
    },
    onStoreOrgUnitObject: (orgUnitObject: Object) => {
        dispatch(storeOrgUnitObject(orgUnitObject));
    },
    onSetCategoryOptionId: (categoryId: string, selectedCategoryOptionId: string) => {
        dispatch(setCategoryId(categoryId, selectedCategoryOptionId));
    },
    onResetCategoryOptionSelections: () => {
        dispatch(resetCategorySelections());
    },
    onGoBackToListContext: () => {
        dispatch(goBackToListContext());
    },
});

// $FlowSuppress
export default connect(mapStateToProps, mapDispatchToProps)(QuickSelector);
