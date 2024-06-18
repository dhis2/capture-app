// @flow
import { useIndexedDBQuery } from '../../../../../utils/reactQueryHelpers';
import { getUserStorageController, userStores } from '../../../../../storageControllers';

type Props = {|
    programId: string,
    dataElementIds: Array<string>,
|}

const getDataElementsForStage = async ({
    dataElementIds,
}) => {
    const storageController = getUserStorageController();

    return storageController.getAll(userStores.DATA_ELEMENTS, {
        predicate: dataElement => dataElementIds.includes(dataElement.id),
    });
};

export const useDataElementsForStage = ({
    programId,
    dataElementIds,
}: Props) => {
    const { data, isLoading } = useIndexedDBQuery(
        ['eventProgram', programId, 'dataElements'],
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
