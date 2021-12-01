// @flow
import { connect } from 'react-redux';
import { PreTeiDataEntry } from './TrackedEntityInstanceDataEntry.component';
import { startAsyncUpdateFieldForNewTei } from './actions/tei.actions';
import { updateFieldBatch, asyncUpdateSuccessBatch } from './actions/tei.actionBatches';

const mapStateToProps = () => ({});

const mapDispatchToProps = (dispatch: ReduxDispatch) => ({
    onUpdateField: (
        innerAction: ReduxAction<any, any>,
    ) => {
        dispatch(updateFieldBatch(innerAction));
    },
    onStartAsyncUpdateField: (
        innerAction: ReduxAction<any, any>,
    ) => {
        const onAsyncUpdateSuccess = (successInnerAction: ReduxAction<any, any>) =>
            asyncUpdateSuccessBatch(successInnerAction);
        const onAsyncUpdateError = (errorInnerAction: ReduxAction<any, any>) => errorInnerAction;

        dispatch(startAsyncUpdateFieldForNewTei(innerAction, onAsyncUpdateSuccess, onAsyncUpdateError));
    },
});

// $FlowFixMe
export const TrackedEntityInstanceDataEntry = connect(mapStateToProps, mapDispatchToProps)(PreTeiDataEntry);

