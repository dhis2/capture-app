// @flow
import { connect } from 'react-redux';
import { setCurrentWorkingList } from '../eventsList.actions';
import WorkingListConfigSelector from './WorkingListConfigSelector.component';
import withLoadingIndicator from '../../../../../HOC/withLoadingIndicator';
import withErrorMessageHandler from '../../../../../HOC/withErrorMessageHandler';

const mapStateToProps = (state: ReduxState) => {
    const workingListConfigSelector = state.workingListConfigSelector.eventMainPage || {};
    const selectedListId = workingListConfigSelector.currentWorkingListId;
    return {
        workingListConfigs: workingListConfigSelector.workingListConfigs || [],
        selectedListId,
        ready: workingListConfigSelector && !workingListConfigSelector.isLoading,
        error: workingListConfigSelector && workingListConfigSelector.loadError,
    };
};

const mapDispatchToProps = (dispatch: ReduxDispatch) => ({
    onSetWorkingListConfig: (id: string, data?: ?Object) => {
        dispatch(setCurrentWorkingList(id, data));
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(withLoadingIndicator()(withErrorMessageHandler()(WorkingListConfigSelector)));
