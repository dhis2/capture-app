// @flow
import log from 'loglevel';
import { useIndexedDBQuery } from '../../../../utils/reactQueryHelpers';
import { getUserStorageController, userStores } from '../../../../storageControllers';
import type { RelationshipTypes } from '../../../WidgetsRelationship';
import {
    extractElementIdsFromRelationshipTypes,
    formatRelationshipTypes,
} from '../../../WidgetsRelationship';
import { errorCreator } from '../../../../../capture-core-utils';

// map through arrays of either dataElements or attributes and fetch optionSet values for each element if they have a optionSet
const getOptionSetValuesForElement = async (elements: Array<Object>, userStorageController: Object) => {
    // should be an object with keys of the element ids and value true
    const optionSetIds = elements
        .reduce((acc, { optionSet }) => {
            if (optionSet) {
                acc[optionSet.id] = true;
            }
            return acc;
        }, {});

    const optionSets = await userStorageController.getAll(userStores.OPTION_SETS, {
        predicate: ({ id }) => optionSetIds[id],
        project: ({ id, options }) => ({
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
        predicate: ({ access }) => access.data.read,
    });

    const { dataElementIds, attributeIds } = extractElementIdsFromRelationshipTypes(cachedRelationshipTypes);

    const attributes = (await userStorageController.getAll(userStores.TRACKED_ENTITY_ATTRIBUTES, {
        predicate: ({ id }) => attributeIds[id],
        project: ({ id, valueType, displayName, optionSet }) => ({ id, valueType, displayName, optionSet }),
    }));

    const dataElements = (await userStorageController.getAll(userStores.DATA_ELEMENTS, {
        predicate: ({ id }) => dataElementIds[id],
        project: ({ id, valueType, displayName, optionSet }) => ({ id, valueType, displayName, optionSet }),
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
