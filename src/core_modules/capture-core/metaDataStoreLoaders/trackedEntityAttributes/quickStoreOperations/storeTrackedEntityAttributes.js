// @flow
import { quickStore } from '../../IOUtils';
import { getContext } from '../../context';

export const storeTrackedEntityAttributes = (ids: Array<string>) => {
    const query = {
        resource: 'trackedEntityAttributes',
        params: {
            fields: 'id,displayName,displayShortName,description,valueType,optionSetValue,unique,orgunitScope,' +
            'pattern,translations[property,locale,value],optionSet[id]',
            filter: `id:in:[${ids.join(',')}]`,
            pageSize: ids.length,
        },
    };

    const convert = response => response && response.trackedEntityAttributes;

    return quickStore(query, getContext().storeNames.TRACKED_ENTITY_ATTRIBUTES, { onConvertQueryResponse: convert });
};
