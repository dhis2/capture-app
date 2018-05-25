// @flow

import { connect } from 'react-redux';
import QuickSelector from './QuickSelector.component';
import { setProgramId, setCategoryId } from './actions/QuickSelector.actions';

const mapStateToProps = (state: Object) => ({
    selectedProgramId: state.currentSelections.programId,
    selectedCategories: state.currentSelections.categories,
    // We currently have orgUnit (Object) and orgUnitId (string). Do we need both?
    selectedOrgUnit: state.currentSelections.orgUnit,
});

const mapDispatchToProps = (dispatch: ReduxDispatch) => ({
    onSetProgramId: (programId: string) => {
        dispatch(setProgramId(programId));
    },
    onSetCategoryOptionId: (categoryId: string, selectedCategoryOptionId: string) => {
        dispatch(setCategoryId(categoryId, selectedCategoryOptionId));
    },
});

// $FlowSuppress
export default connect(mapStateToProps, mapDispatchToProps)(QuickSelector);
