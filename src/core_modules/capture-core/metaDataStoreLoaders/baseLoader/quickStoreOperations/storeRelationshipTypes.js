// @flow
import { quickStoreRecursively } from '../../IOUtils';
import { getContext } from '../../context';

export const storeRelationshipTypes = () => {
    const query = {
        resource: 'relationshipTypes',
        params: {
            fields: `
            id,
            displayName,
            bidirectional,
            fromToName,
            toFromName,
            fromConstraint[
                relationshipEntity,
                trackerDataView,
                trackedEntityType[
                    id,
                    name
                ],
                program[
                    id,
                    name
                ],
                programStage[
                    id,
                    name
                ]
            ],
            toConstraint[
                relationshipEntity,
                trackerDataView,
                trackedEntityType[
                    id,
                    name
                ],
                program[
                    id,
                    name
                ],
                programStage[
                    id,
                    name
                ]
            ],
            access[*]`,
        },
    };

    const convert = response => response && response.relationshipTypes;

    return quickStoreRecursively({
        query,
        storeName: getContext().storeNames.RELATIONSHIP_TYPES,
        convertQueryResponse: convert,
    });
};
