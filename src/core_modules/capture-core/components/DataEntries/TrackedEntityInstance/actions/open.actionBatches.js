// @flow
import { batchActions } from 'redux-batched-actions';
import { loadNewDataEntry } from '../../../DataEntry/actions/dataEntryLoadNew.actions';
import { openDataEntryForNewTei } from './open.actions';
import { getGeneratedUniqueValuesAsync } from '../../common/TEIAndEnrollment';
import type { RenderFoundation } from '../../../../metaData';
import type { QuerySingleResource } from '../../../../utils/api/api.types';

const itemId = 'newTei';

export const batchActionTypes = {
    NEW_TEI_DATA_ENTRY_OPEN_BATCH: 'NewTeiDataEntryOpenBatch',
};

export const openDataEntryForNewTeiBatchAsync = async ({
    foundation,
    orgUnit,
    dataEntryId,
    extraActions = [],
    generatedUniqueValuesCache = {},
    querySingleResource,
}: {
    foundation: ?RenderFoundation,
    orgUnit: Object,
    dataEntryId: string,
    extraActions?: Array<ReduxAction<any, any>>,
    generatedUniqueValuesCache?: Object,
    querySingleResource: QuerySingleResource,
}) => {
    const generatedItemContainers = await getGeneratedUniqueValuesAsync(
        foundation,
        generatedUniqueValuesCache,
        { orgUnitCode: orgUnit.code },
        querySingleResource,
    );
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
