// @flow
import { useCallback } from 'react';
import { useMetadataCustomQuery } from 'capture-core-utils/reactQueryHelpers';
import { getUserStorageController, userStores } from '../../../../storageControllers';
import { programCollection } from '../../../../metaDataMemoryStores';
import { TrackerProgram } from '../../../../metaData';
import type { GetPrograms } from '../../../WidgetTrackedEntityRelationship';

export const useTEIRelationshipsWidgetMetadata = (): { getPrograms: GetPrograms } => {
    const getPrograms = useCallback((trackedEntityTypeId: string) =>
        [...programCollection.values()]
            .filter(program =>
                program instanceof TrackerProgram &&
                program.trackedEntityType.id === trackedEntityTypeId &&
                program.access.data.read,
            )
            .map(p => ({ id: p.id, name: p.name })),
    []);

    const { data: relationshipTypes, failed } =
    useMetadataCustomQuery<>(
        'relationshipTypes',
        async () => {
            const userStorageController = getUserStorageController();
            const relationshipTypes = await userStorageController.getAll(userStores.RELATIONSHIP_TYPES);

            const attributeIds = relationshipTypes
                .flatMap((relationshipType) => {
                    const { fromConstraint, toConstraint } = relationshipType;
                    const fromAttributes = fromConstraint.tracekrDataView.attributes || [];
                    const toAttributes = toConstraint.tracekrDataView.attributes || [];
                    return [fromAttributes, toAttributes];
                });

            const attributes = await Promise.all(
                attributeIds.map(attributeId =>
                    userStorageController.get(userStores.TRACKED_ENTITY_ATTRIBUTES, attributeId)),
            );

            const dataElementIds = relationshipTypes
                .flatMap((relationshipType) => {
                    const { fromConstraint, toConstraint } = relationshipType;
                    const fromDataElements = fromConstraint.tracekrDataView.dataElements || [];
                    const toDataElements = toConstraint.tracekrDataView.dataElements || [];
                    return [fromDataElements, toDataElements];
                });
            
            const dataElements = await Promise.all(
                attributeIds.map(attributeId =>
                    userStorageController.get(userStores.DATA, attributeId)),
            ); 
            


        },
    );

    return {
        relationshipTypes,
        getPrograms,
        failed,
    };
};
