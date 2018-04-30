import { connect } from 'react-redux';
import DownloadTable from './DownloadTable.component';

const mapStateToProps = (state: Object) => ({
    selectedProgramId: state.currentSelections.programId,
    selectedOrgUnit: state.currentSelections.orgUnit,
});

// $FlowSuppress
export default connect(mapStateToProps)(DownloadTable);
