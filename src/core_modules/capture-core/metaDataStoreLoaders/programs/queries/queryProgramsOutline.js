// @flow
import { query } from '../../IOUtils';

export const queryProgramsOutline = async () => {
    const specification = {
        resource: 'programs',
        params: {
            fields: 'id,version,programTrackedEntityAttributes[trackedEntityAttribute[id,optionSet[id,version]]],' +
                'programStages[id,programStageDataElements[dataElement[id,optionSet[id,version]]]]',
        },
    };

    const response = await query(specification);
    return (response && response.programs) || [];
};
