import { useIndexedDBQuery } from '../../../../utils/reactQueryHelpers';
import { getUserMetadataStorageController, USER_METADATA_STORES } from '../../../../storageControllers';
import type { Props } from './useDataElementsForStage.types';

const getDataElementsForStage = async ({
    dataElementIds,
}: {
    dataElementIds: Array<string>;
}) => {
    const storageController = getUserMetadataStorageController();

    return storageController.getAll(USER_METADATA_STORES.DATA_ELEMENTS, {
        predicate: dataElement => dataElementIds.includes(dataElement.id),
    });
};

export const useDataElementsForStage = ({
    dataElementIds,
    programId,
    stageId,
}: Props) => {
    const { data, isLoading } = useIndexedDBQuery(
        [programId, 'dataElements', stageId, { dataElementIds }],
        () => getDataElementsForStage({
            dataElementIds,
        }),
        {
            enabled: !!dataElementIds,
        },
    );

    return {
        dataElements: data,
        isLoading,
    };
};
