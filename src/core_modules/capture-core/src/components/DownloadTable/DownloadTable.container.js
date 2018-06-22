// @flow
import { connect } from 'react-redux';
import DownloadTable from './DownloadTable.component';

// TODO: Change programId to current programStageId
const mapStateToProps = (state: Object) => ({
    selectedProgramId: state.currentSelections.programId,
    selectedOrgUnitId: state.currentSelections.orgUnitId,
});

// $FlowSuppress
export default connect(mapStateToProps)(DownloadTable);
