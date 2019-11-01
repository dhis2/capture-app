// @flow
import { connect } from 'react-redux';
import { updateFieldBatch, asyncUpdateSuccessBatch } from './actions/tei.actionBatches';
import { startAsyncUpdateFieldForNewTei } from './actions/tei.actions';
import TrackedEntityInstance from './TrackedEntityInstance.component';

const mapStateToProps = () => ({});

const mapDispatchToProps = (dispatch: ReduxDispatch) => ({
    onUpdateField: (
        innerAction: ReduxAction<any, any>,
        extraActions: {
            filterActions: Array<ReduxAction<any, any>>,
            filterActionsToBeExecuted: Array<ReduxAction<any, any>>,
        },
    ) => {
        dispatch(updateFieldBatch(innerAction, extraActions));
    },
    onStartAsyncUpdateField: (
        innerAction: ReduxAction<any, any>,
        extraActions: {
            filterActions: Array<ReduxAction<any, any>>,
            filterActionsToBeExecuted: Array<ReduxAction<any, any>>
        },
    ) => {
        const onAsyncUpdateSuccess = (successInnerAction: ReduxAction<any, any>) =>
            asyncUpdateSuccessBatch(successInnerAction, extraActions);
        const onAsyncUpdateError = (errorInnerAction: ReduxAction<any, any>) => errorInnerAction;

        dispatch(startAsyncUpdateFieldForNewTei(innerAction, onAsyncUpdateSuccess, onAsyncUpdateError));
    },
});

// $FlowFixMe
export default connect(mapStateToProps, mapDispatchToProps)(TrackedEntityInstance);

