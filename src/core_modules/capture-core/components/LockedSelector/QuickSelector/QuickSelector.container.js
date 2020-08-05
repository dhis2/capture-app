// @flow

import { connect } from 'react-redux';
import QuickSelector from './QuickSelector.component';

const mapStateToProps = (state: Object) => ({
    selectedProgramId: state.currentSelections.programId,
    selectedCategories: state.currentSelections.categoriesMeta,
    selectedOrgUnitId: state.currentSelections.orgUnitId,
    selectedOrgUnit: state.currentSelections.orgUnitId ? state.organisationUnits[state.currentSelections.orgUnitId] : null,
});


// $FlowFixMe[missing-annot] automated comment
export default connect(mapStateToProps)(QuickSelector);
