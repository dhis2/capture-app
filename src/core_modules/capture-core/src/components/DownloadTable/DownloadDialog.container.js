// @flow
import { connect } from 'react-redux';
import DownloadDialog from './DownloadDialog.component';

// TODO: Change programId to current programStageId
const mapStateToProps = (state: Object, props: { listId: string }) => ({
    request: state.workingLists[props.listId] && state.workingLists[props.listId].currentRequest,
});

// $FlowSuppress
export default connect(mapStateToProps)(DownloadDialog);
