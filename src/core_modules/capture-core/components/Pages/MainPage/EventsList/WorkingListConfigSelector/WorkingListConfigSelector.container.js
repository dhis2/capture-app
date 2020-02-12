// @flow
/*
import { connect } from 'react-redux';
import { setCurrentWorkingListConfig } from '../eventsList.actions';
import WorkingListConfigSelector from './WorkingListConfigSelector.component';
import withLoadingIndicator from '../../../../../HOC/withLoadingIndicator';
import withErrorMessageHandler from '../../../../../HOC/withErrorMessageHandler';

const mapStateToProps = (state: ReduxState) => {
    const workingListConfigSelector = state.workingListConfigSelector.eventMainPage || {};
    const configId = workingListConfigSelector.currentConfigId;
    const workingListConfigs = workingListConfigSelector.workingListConfigs || [];
    const defaultWorkingListConfig = workingListConfigs.find(w => w.isDefault);
    return {
        workingListConfigs,
        defaultWorkingListConfig,
        configId,
        ready: workingListConfigSelector && !workingListConfigSelector.isLoading,
        error: workingListConfigSelector && workingListConfigSelector.loadError,
    };
};

const mapDispatchToProps = (dispatch: ReduxDispatch) => ({
    onSetWorkingListConfig: (configId: string, listId: string, data?: ?Object) => {
        dispatch(setCurrentWorkingListConfig(configId, listId, data));
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(withLoadingIndicator()(withErrorMessageHandler()(WorkingListConfigSelector)));
*/