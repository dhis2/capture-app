// @flow
import { getContext } from '../../context';
import { quickStoreRecursively } from '../../IOUtils';

export const storeRelationshipTypes = () => {
    const query = {
        resource: 'relationshipTypes',
        params: {
            fields: 'id,displayName,fromConstraint[*],toConstraint[*],access[*]',
        },
    };

    const convert = response => response && response.relationshipTypes;

    return quickStoreRecursively({
        query,
        storeName: getContext().storeNames.RELATIONSHIP_TYPES,
        convertQueryResponse: convert,
    });
};
