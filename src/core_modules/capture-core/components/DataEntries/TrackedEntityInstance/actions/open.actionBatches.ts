import { batchActions } from 'redux-batched-actions';
import type { ReduxAction } from 'capture-core-utils/types';
import { loadNewDataEntry } from '../../../DataEntry/actions/dataEntryLoadNew.actions';
import { openDataEntryForNewTei } from './open.actions';
import { getGeneratedUniqueValuesAsync } from '../../common/TEIAndEnrollment';
import type { RenderFoundation } from '../../../../metaData';
import type { QuerySingleResource } from '../../../../utils/api/api.types';
import { clearPrepopulatedData } from '../../../Pages/New/NewPage.actions';
import { getOrgUnitValidatorContainers } from '../fieldValidators';
import { getTermLabel, LabelKeys } from '../../../../customLabels';

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
    formValues,
    querySingleResource,
}: {
    foundation: RenderFoundation | null;
    orgUnit: any;
    dataEntryId: string;
    extraActions?: Array<ReduxAction<any, any>>;
    generatedUniqueValuesCache?: any;
    formValues?: any;
    querySingleResource: QuerySingleResource;
}) => {
    const generatedItemContainers = await getGeneratedUniqueValuesAsync(
        foundation,
        generatedUniqueValuesCache,
        { orgUnitCode: orgUnit.code },
        querySingleResource,
    );

    const generatedUniqueValues = generatedItemContainers
        .reduce((accValuesByKey: any, container: any) => {
            accValuesByKey[container.id] = container.item.value;
            return accValuesByKey;
        }, {});


    const { orgUnitLabel } = getTermLabel([LabelKeys.orgUnitSingular], { programId: null });
    const dataEntryPropsToInclude = [
        {
            id: 'orgUnit',
            type: 'ORGANISATION_UNIT',
            validatorContainers: getOrgUnitValidatorContainers(orgUnitLabel),
        },
    ];

    const dataEntryActions = loadNewDataEntry(
        dataEntryId,
        itemId,
        dataEntryPropsToInclude,
        { orgUnit: { id: orgUnit.id, name: orgUnit.name, path: orgUnit.path } },
        { ...generatedUniqueValues, ...formValues },
    );

    return batchActions([
        openDataEntryForNewTei(
            dataEntryId,
            generatedItemContainers
                .reduce((accItemsByKey: any, container: any) => {
                    accItemsByKey[container.id] = container.item;
                    return accItemsByKey;
                }, {}),
        ),
        ...dataEntryActions,
        clearPrepopulatedData(),
        ...extraActions,
    ], batchActionTypes.NEW_TEI_DATA_ENTRY_OPEN_BATCH);
};
