// @flow
import { useIndexedDBQuery } from '../../../../utils/reactQueryHelpers';
import { getUserMetadataStorageController, USER_METADATA_STORES } from '../../../../storageControllers';

type Props = {|
    programId: string,
    dataElementIds: Array<string>,
    stageId?: string,
|}

const getDataElementsForStage = async ({
    dataElementIds,
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
        // $FlowFixMe
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
