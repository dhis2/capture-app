// @flow
import { useIndexedDBQuery } from '../../../utils/reactQueryHelpers';
import { getUserStorageController } from '../../../storageControllers';
import { userStores } from '../../../storageControllers/stores';

export const useRelationshipTypeAccess = (relationshipTypeId: string) => {
    const storageController = getUserStorageController();

    const { data, error, isLoading } = useIndexedDBQuery(
        ['relationshipTypeAccess', relationshipTypeId],
        () =>
            storageController.get(userStores.RELATIONSHIP_TYPES, relationshipTypeId, {
                project: ({ access }) => ({
                    hasWriteAccess: access?.data?.write ?? false,
                }),
            }),
        {
            enabled: !!relationshipTypeId,
        },
    );

    return {
        relationshipTypeWriteAccess: data?.hasWriteAccess,
        isLoading,
        error,
    };
};
