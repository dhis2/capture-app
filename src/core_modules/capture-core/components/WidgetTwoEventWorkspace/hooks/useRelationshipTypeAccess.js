// @flow
import { useIndexedDBQuery } from '../../../utils/reactQueryHelpers';
import { getUserMetadataStorageController, USER_METADATA_STORES } from '../../../storageControllers';

export const useRelationshipTypeAccess = (relationshipTypeId: string) => {
    const storageController = getUserMetadataStorageController();

    const { data, error, isLoading } = useIndexedDBQuery(
        ['relationshipTypeAccess', relationshipTypeId],
        () =>
            storageController.get(USER_METADATA_STORES.RELATIONSHIP_TYPES, relationshipTypeId, {
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
