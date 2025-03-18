// @flow
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

type Elements = {|
    [key: string]: {
        id: string,
        displayName: string,
        valueType: $Keys<typeof dataElementTypes>,
        options?: Array<{ code: string, name: string }>,
    },
|}

type Context = {|
    relationshipType: ApiRelationshipType,
    elementType: $Values<typeof elementTypes>
|}

type ElementArray = $ReadOnlyArray<{|
    id: string,
    type: $Keys<typeof dataElementTypes>,
    displayName: string,
    options?: Array<{ code: string, name: string }>,
|}>;

export const replaceElementIdsWithElement = (
    elementIds: ?$ReadOnlyArray<string>,
    elements: Elements,
    { relationshipType, elementType }: Context): ElementArray =>
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

                // $FlowFixMe filter is unhandled
                return null;
            }

            if (!element.valueType) {
                log.error(
                    errorCreator(`cached ${elementType} is missing value type`)(
                        { elementId, element }),
                );

                // $FlowFixMe filter is unhandled
                return null;
            }

            return {
                id: elementId,
                type: element.valueType,
                displayName: element.displayName,
                options: element.options,
            };
        })
        .filter(element => element);
