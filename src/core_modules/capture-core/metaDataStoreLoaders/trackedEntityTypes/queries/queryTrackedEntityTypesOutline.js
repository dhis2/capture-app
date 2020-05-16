// @flow
import { query } from '../../IOUtils';

export const queryTrackedEntityTypesOutline = async () => {
    const specification = {
        resource: 'trackedEntityTypes',
        params: {
            fields: 'id, trackedEntityTypeAttributes[trackedEntityAttribute[optionSet[id,version]]]',
        },
    };

    const response = await query(specification);
    return (response && response.trackedEntityTypes) || [];
};
