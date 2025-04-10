import log from 'loglevel';
import { useIndexedDBQuery } from '../../../../utils/reactQueryHelpers';
import { getUserStorageController, userStores } from '../../../../storageControllers';
import {
    type RelationshipTypes,
    extractElementIdsFromRelationshipTypes,
    formatRelationshipTypes,
} from '../../../WidgetsRelationship';
import { errorCreator } from '../../../../../capture-core-utils';

const getOptionSetValuesForElement = async (elements: Array<Record<string, any>>, userStorageController: Record<string, any>) => {
    const optionSetIds = elements
        .reduce((acc: Record<string, boolean>, { optionSet }) => {
            if (optionSet) {
                acc[optionSet.id] = true;
            }
            return acc;
        }, {});

    const optionSets = await userStorageController.getAll(userStores.OPTION_SETS, {
        predicate: ({ id }: { id: string }) => optionSetIds[id],
        project: ({ id, options }: { id: string, options: Array<{ code: string, displayName: string }> }) => ({
            id,
            options: options
                .map(({ code, displayName }) => ({ code, name: displayName })),
        }),
    });

    if (!optionSets.length) {
        return elements;
    }

    return elements.map((element) => {
        if (element.optionSet) {
            const optionSet = optionSets.find(({ id }) => id === element.optionSet.id);
            if (!optionSet) {
                log.error(
                    errorCreator(`OptionSet with id ${element.optionSet.id} not found in indexedDB.`)({ element }));
                return element;
            }
            return {
                ...element,
                optionSet: {
                    ...element.optionSet,
                    options: optionSet.options,
                },
            };
        }
        return element;
    });
};

const getRelationshipTypes = async (): Promise<RelationshipTypes> => {
    const userStorageController = getUserStorageController();
    const cachedRelationshipTypes = await userStorageController.getAll(userStores.RELATIONSHIP_TYPES, {
        predicate: ({ access }: { access: { data: { read: boolean } } }) => access.data.read,
    });

    const { dataElementIds, attributeIds } = extractElementIdsFromRelationshipTypes(cachedRelationshipTypes);

    const attributes = (await userStorageController.getAll(userStores.TRACKED_ENTITY_ATTRIBUTES, {
        predicate: ({ id }: { id: string }) => attributeIds[id],
        project: ({ id, valueType, displayName, optionSet }: { id: string, valueType: string, displayName: string, optionSet: any }) =>
            ({ id, valueType, displayName, optionSet }),
    }));

    const dataElements = (await userStorageController.getAll(userStores.DATA_ELEMENTS, {
        predicate: ({ id }: { id: string }) => dataElementIds[id],
        project: ({ id, valueType, displayName, optionSet }: { id: string, valueType: string, displayName: string, optionSet: any }) =>
            ({ id, valueType, displayName, optionSet }),
    }));

    const attributesWithPossibleOptionSet = await getOptionSetValuesForElement(attributes, userStorageController);

    const dataElementsWithPossibleOptionSet = await getOptionSetValuesForElement(dataElements, userStorageController);

    return formatRelationshipTypes({
        relationshipTypes: cachedRelationshipTypes,
        attributes: attributesWithPossibleOptionSet,
        dataElements: dataElementsWithPossibleOptionSet,
    });
};

export const useTEIRelationshipsWidgetMetadata = (): {
    relationshipTypes: RelationshipTypes | undefined;
    isError: boolean;
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
