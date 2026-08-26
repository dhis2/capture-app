import { connect } from 'react-redux';
import type { ReduxAction } from 'capture-core-utils/types';
import { updateFieldBatch, asyncUpdateSuccessBatch } from './actions/tei.actionBatches';
import { startAsyncUpdateFieldForNewTei } from './actions/tei.actions';
import { PreTeiDataEntry } from './TrackedEntityInstanceDataEntry.component';

const mapStateToProps = () => ({});

const mapDispatchToProps = (dispatch: any) => ({
    onUpdateField: (
        innerAction: any,
    ) => {
        dispatch(updateFieldBatch(innerAction));
    },
    onStartAsyncUpdateField: (
        innerAction: any,
    ) => {
        const onAsyncUpdateSuccess = (successInnerAction: ReduxAction<any, any>) =>
            asyncUpdateSuccessBatch(successInnerAction);
        const onAsyncUpdateError = (errorInnerAction: ReduxAction<any, any>) => errorInnerAction;

        dispatch(startAsyncUpdateFieldForNewTei(innerAction, onAsyncUpdateSuccess, onAsyncUpdateError));
    },
});

export const TrackedEntityInstanceDataEntry = connect(mapStateToProps, mapDispatchToProps)(PreTeiDataEntry);
