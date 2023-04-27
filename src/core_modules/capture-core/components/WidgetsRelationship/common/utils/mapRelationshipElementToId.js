// @flow
import log from 'loglevel';
import { errorCreator } from '../../../../../capture-core-utils';
import type { RelationshipType } from '../Types';

const elementTypes = {
    ATTRIBUTE: 'attribute',
    DATA_ELEMENT: 'dataElement',
};

type Elements = {|
    [key: string]: {
        id: string,
        displayName: string,
        valueType?: string,
    },
|}

type Context = {|
    relationshipType: RelationshipType,
    elementType: $Values<typeof elementTypes>
|}

export const mapRelationshipElementToId = (
    elementIds: ?Array<string>,
    elements: Elements,
    { relationshipType, elementType }: Context) =>
    // $FlowFixMe
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
            };
        })
        .filter(element => element);
