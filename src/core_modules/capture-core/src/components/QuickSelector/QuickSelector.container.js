import { connect } from 'react-redux';
import QuickSelector from './QuickSelector.component';

const mapStateToProps = (state: Object) => ({
    selectedProgramId: state.currentSelections.programId,
    selectedOrgUnit: state.currentSelections.orgUnit,
});

// $FlowSuppress
export default connect(mapStateToProps)(QuickSelector);
