import log from 'loglevel';
import { errorCreator } from '../../../../../capture-core-utils';
import type { ApiRelationshipType } from '../Types';
import {
    dataElementTypes,
} from '../../../../metaData';

const elementTypes = {
    ATTRIBUTE: 'attribute',
    DATA_ELEMENT: 'dataElement',
};

type Elements = {
    [key: string]: {
        valueType: keyof typeof dataElementTypes;
        displayName: string;
        options?: Array<{ code: string; name: string }>;
    };
};

type Context = {
    relationshipType: ApiRelationshipType;
    elementType: typeof elementTypes[keyof typeof elementTypes];
};

type ElementArray = readonly {
    id: string;
    type: keyof typeof dataElementTypes;
    displayName: string;
    options?: Array<{ code: string; name: string }>;
}[];

export const replaceElementIdsWithElement = (
    elementIds: readonly string[] | undefined,
    elements: Elements,
    { relationshipType, elementType }: Context): ElementArray =>
    (elementIds || [])
        .map((elementId) => {
            const element = elements[elementId];

            if (!element) {
                log.error(
                    errorCreator(`${elementType} from relationshipType not found in cache`)(
                        { elementId, relationshipType },
                    ),
                );

                return null;
            }

            if (!element.valueType) {
                log.error(
                    errorCreator(`cached ${elementType} is missing value type`)(
                        { elementId, element }),
                );

                return null;
            }

            return {
                id: elementId,
                type: element.valueType,
                displayName: element.displayName,
                options: element.options,
            };
        })
        .filter((element): element is NonNullable<typeof element> => element !== null);
