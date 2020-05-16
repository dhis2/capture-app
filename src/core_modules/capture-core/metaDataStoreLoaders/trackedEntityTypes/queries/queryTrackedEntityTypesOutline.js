// @flow
import { queryRecursively } from '../../IOUtils';

export const queryTrackedEntityTypesOutline = async (): Promise<Array<Object>> => {
    const specification = {
        resource: 'trackedEntityTypes',
        params: {
            fields: 'id, trackedEntityTypeAttributes[trackedEntityAttribute[optionSet[id,version]]]',
        },
    };

    return (await queryRecursively(specification, { pageSize: 1000 }))
        .flatMap(responseItem => (responseItem && responseItem.trackedEntityTypes) || []);
};
