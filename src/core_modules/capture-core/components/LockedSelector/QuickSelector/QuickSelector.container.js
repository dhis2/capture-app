// @flow

import { connect } from 'react-redux';
import QuickSelector from './QuickSelector.component';
import { clearTrackedEntityInstanceSelection } from '../../Pages/Enrollment/EnrollmentPage.actions';

const mapStateToProps = (state: Object) => ({
    selectedProgramId: state.currentSelections.programId,
    selectedCategories: state.currentSelections.categoriesMeta,
    selectedOrgUnitId: state.currentSelections.orgUnitId,
    selectedOrgUnit: state.currentSelections.orgUnitId ? state.organisationUnits[state.currentSelections.orgUnitId] : null,
    currentPage: state.app.page,
    selectedTrackedEntityTypeName: state.currentSelections.trackedEntityTypeDisplayName,
});


const mapDispatchToProps = (dispatch: ReduxDispatch) => ({
    onTrackedEntityInstanceClear: () => {
        dispatch(clearTrackedEntityInstanceSelection());
    },
});

// $FlowFixMe[missing-annot] automated comment
export default connect(mapStateToProps, mapDispatchToProps)(QuickSelector);
