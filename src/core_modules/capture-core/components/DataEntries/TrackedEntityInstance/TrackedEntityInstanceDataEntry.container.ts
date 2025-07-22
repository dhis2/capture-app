import { connect } from 'react-redux';
import { updateFieldBatch, asyncUpdateSuccessBatch } from './actions/tei.actionBatches';
import { startAsyncUpdateFieldForNewTei } from './actions/tei.actions';
import { PreTeiDataEntry } from './TrackedEntityInstanceDataEntry.component';

const mapStateToProps = () => ({});

const mapDispatchToProps = (dispatch: any) => ({
    onUpdateField: (
        field: string,
        value: any,
    ) => {
        const innerAction = { type: 'UPDATE_FIELD', payload: { field, value } };
        dispatch(updateFieldBatch(innerAction));
    },
    onStartAsyncUpdateField: (
        field: string,
        value: any,
    ) => {
        const innerAction = { type: 'UPDATE_FIELD_ASYNC', payload: { field, value } };
        const onAsyncUpdateSuccess = (successInnerAction: any) =>
            asyncUpdateSuccessBatch(successInnerAction);
        const onAsyncUpdateError = (errorInnerAction: any) => errorInnerAction;

        dispatch(startAsyncUpdateFieldForNewTei(innerAction, onAsyncUpdateSuccess, onAsyncUpdateError));
    },
});

export const TrackedEntityInstanceDataEntry = connect(mapStateToProps, mapDispatchToProps)(PreTeiDataEntry);
