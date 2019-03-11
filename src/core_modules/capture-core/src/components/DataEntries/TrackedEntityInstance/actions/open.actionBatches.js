// @flow
import { batchActions } from 'redux-batched-actions';
import { loadNewDataEntry } from '../../../DataEntry/actions/dataEntryLoadNew.actions';

const itemId = 'newTei';

export const batchActionTypes = {
    NEW_TEI_DATA_ENTRY_OPEN_BATCH: 'NewTeiDataEntryOpenBatch',
};

export const openDataEntryForNewTeiBatch =
    (
        dataEntryId: string,
        extraActions: Array<ReduxAction<any, any>> = [],
    ) => {
        const dataEntryActions = loadNewDataEntry(dataEntryId, itemId);

        return batchActions([
            ...dataEntryActions,
            ...extraActions,
        ], batchActionTypes.NEW_TEI_DATA_ENTRY_OPEN_BATCH);
    };
