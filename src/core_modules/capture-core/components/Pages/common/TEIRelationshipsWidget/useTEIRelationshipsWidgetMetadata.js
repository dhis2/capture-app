// @flow
import { useIndexedDBQuery } from '../../../../utils/reactQueryHelpers';
import { getUserStorageController, userStores } from '../../../../storageControllers';
import type { RelationshipTypes } from '../../../WidgetsRelationship';
import {
    extractElementIdsFromRelationshipTypes,
    formatRelationshipTypes,
} from '../../../WidgetsRelationship';

const getRelationshipTypes = async (): Promise<RelationshipTypes> => {
    const userStorageController = getUserStorageController();
    const cachedRelationshipTypes = await userStorageController.getAll(userStores.RELATIONSHIP_TYPES, {
        predicate: ({ access }) => access.data.read,
    });

    const { dataElementIds, attributeIds } = extractElementIdsFromRelationshipTypes(cachedRelationshipTypes);

    const attributes = (await userStorageController.getAll(userStores.TRACKED_ENTITY_ATTRIBUTES, {
        predicate: ({ id }) => attributeIds[id],
        project: ({ id, valueType, displayName }) => ({ id, valueType, displayName }),
    }));

    const dataElements = (await userStorageController.getAll(userStores.DATA_ELEMENTS, {
        predicate: ({ id }) => dataElementIds[id],
        project: ({ id, valueType, displayName }) => ({ id, valueType, displayName }),
    }));

    return formatRelationshipTypes({
        relationshipTypes: cachedRelationshipTypes,
        attributes,
        dataElements,
    });
};

export const useTEIRelationshipsWidgetMetadata = (): {
    relationshipTypes: ?RelationshipTypes,
    isError: boolean,
} => {
    const { data: relationshipTypes, isError } =
    useIndexedDBQuery<RelationshipTypes>(
        ['cachedRelationshipTypes'],
        getRelationshipTypes,
    );

    return {
        relationshipTypes,
        isError,
    };
};
