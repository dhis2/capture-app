// @flow

import { connect } from 'react-redux';
import QuickSelector from './QuickSelector.component';
import {
    setOrgUnitId,
    storeOrgUnitObject,
    setCategoryId,
    resetCategorySelections,
    goBackToListContext,
} from './actions/QuickSelector.actions';

const mapStateToProps = (state: Object) => ({
    selectedProgramId: state.currentSelections.programId,
    selectedCategories: state.currentSelections.categoriesMeta,
    selectedOrgUnitId: state.currentSelections.orgUnitId,
    selectionComplete: state.currentSelections.complete,
    selectedOrgUnit: state.currentSelections.orgUnitId ? state.organisationUnits[state.currentSelections.orgUnitId] : null,
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
// $FlowFixMe[missing-annot] automated comment
export default connect(mapStateToProps, mapDispatchToProps)(QuickSelector);
