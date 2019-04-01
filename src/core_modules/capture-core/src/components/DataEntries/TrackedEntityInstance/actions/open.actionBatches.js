// @flow
import { batchActions } from 'redux-batched-actions';
import { loadNewDataEntry } from '../../../DataEntry/actions/dataEntryLoadNew.actions';
import { openDataEntryForNewTei } from './open.actions';
import { getGeneratedUniqueValuesAsync } from '../../common/TEIAndEnrollment';
import { RenderFoundation } from '../../../../metaData';

const itemId = 'newTei';

export const batchActionTypes = {
    NEW_TEI_DATA_ENTRY_OPEN_BATCH: 'NewTeiDataEntryOpenBatch',
};

export const openDataEntryForNewTeiBatch = async (
    foundation: ?RenderFoundation,
    orgUnit: Object,
    dataEntryId: string,
    extraActions: Array<ReduxAction<any, any>> = [],
    generatedUniqueValuesCache: Object = {},
) => {
    const generatedItemContainers = await
        getGeneratedUniqueValuesAsync(foundation, generatedUniqueValuesCache, { orgUnitCode: orgUnit.code });
    debugger;
    const dataEntryActions = loadNewDataEntry(
        dataEntryId,
        itemId,
        null,
        null,
        generatedItemContainers
            .reduce((accValuesByKey, container) => {
                accValuesByKey[container.id] = container.item.value;
                return accValuesByKey;
            }, {}),
    );

    return batchActions([
        openDataEntryForNewTei(
            dataEntryId,
            generatedItemContainers
                .reduce((accItemsByKey, container) => {
                    accItemsByKey[container.id] = container.item;
                    return accItemsByKey;
                }, {}),
        ),
        ...dataEntryActions,
        ...extraActions,
    ], batchActionTypes.NEW_TEI_DATA_ENTRY_OPEN_BATCH);
};
