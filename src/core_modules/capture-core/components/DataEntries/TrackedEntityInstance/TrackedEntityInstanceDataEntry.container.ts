import { connect } from 'react-redux';
import type { ReduxAction } from 'capture-core-utils/types';
import { updateFieldBatch, asyncUpdateSuccessBatch } from './actions/tei.actionBatches';
import { startAsyncUpdateFieldForNewTei } from './actions/tei.actions';
import { PreTeiDataEntry } from './TrackedEntityInstanceDataEntry.component';

const mapStateToProps = (state: any, props: { id: string }) => {
    const itemId = state.dataEntries[props.id]?.itemId;
    const dataEntryKey = `${props.id}-${itemId}`;
    return {
        orgUnitFieldValue: state.dataEntriesFieldsValue[dataEntryKey]?.orgUnit,
    };
};

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
