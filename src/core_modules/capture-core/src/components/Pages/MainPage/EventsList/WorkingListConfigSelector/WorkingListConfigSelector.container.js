// @flow
import { connect } from 'react-redux';
import { setCurrentWorkingListConfig } from '../eventsList.actions';
import WorkingListConfigSelector from './WorkingListConfigSelector.component';
import withLoadingIndicator from '../../../../../HOC/withLoadingIndicator';
import withErrorMessageHandler from '../../../../../HOC/withErrorMessageHandler';

const mapStateToProps = (state: ReduxState) => {
    const workingListConfigSelector = state.workingListConfigSelector.eventMainPage || {};
    const selectedListId = workingListConfigSelector.currentWorkingListId;
    const workingListConfigs = workingListConfigSelector.workingListConfigs || [];
    const defaultWorkingListConfig = workingListConfigs.find(w => w.isDefault);
    return {
        workingListConfigs,
        defaultWorkingListConfig,
        selectedListId,
        ready: workingListConfigSelector && !workingListConfigSelector.isLoading,
        error: workingListConfigSelector && workingListConfigSelector.loadError,
    };
};

const mapDispatchToProps = (dispatch: ReduxDispatch) => ({
    onSetWorkingListConfig: (id: string, data?: ?Object) => {
        dispatch(setCurrentWorkingListConfig(id, data));
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(withLoadingIndicator()(withErrorMessageHandler()(WorkingListConfigSelector)));
