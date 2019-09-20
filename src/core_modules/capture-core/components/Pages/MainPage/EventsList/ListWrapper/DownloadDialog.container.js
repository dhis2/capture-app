// @flow
import { connect } from 'react-redux';
import DownloadDialog from './DownloadDialog.component';
import { makeProgramStageIdSelector } from './downloadDialog.selectors';

const mapStateToProps = () => {
    const programStageIdSelector = makeProgramStageIdSelector();

    return (state: Object, props: { listId: string }) => ({
        request: state.workingLists[props.listId] && state.workingLists[props.listId].currentRequest,
        programStageId: programStageIdSelector(state),
    });
};

// $FlowSuppress
export default connect(mapStateToProps)(DownloadDialog);
