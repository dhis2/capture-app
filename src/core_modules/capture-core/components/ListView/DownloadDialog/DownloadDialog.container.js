// @flow
import { connect } from 'react-redux';
import { DownloadDialog as DownloadDialogComponent } from './DownloadDialog.component';
import { makeProgramStageIdSelector } from './downloadDialog.selectors';

const mapStateToProps = () => {
    const programStageIdSelector = makeProgramStageIdSelector();

    return (state: Object, props: { listId: string }) => ({
        request: state.workingLists[props.listId] && state.workingLists[props.listId].currentRequest,
        programStageId: programStageIdSelector(state),
    });
};

// $FlowSuppress
export const DownloadDialog = connect(mapStateToProps)(DownloadDialogComponent);
