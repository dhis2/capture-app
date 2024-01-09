// @flow
import { quickStore } from '../../IOUtils';
import { getContext } from '../../context';

export const storeTrackedEntityAttributes = (ids: Array<string>) => {
    const query = {
        resource: 'trackedEntityAttributes',
        params: {
            fields: 'id,displayName,displayShortName,displayFormName,description,valueType,optionSetValue,unique,orgunitScope,' +
            'pattern,code,attributeValues,inherit,translations[property,locale,value],optionSet[id]',
            filter: `id:in:[${ids.join(',')}]`,
            pageSize: ids.length,
        },
    };

    const convert = response => response.trackedEntityAttributes;

    return quickStore({
        query,
        storeName: getContext().storeNames.TRACKED_ENTITY_ATTRIBUTES,
        convertQueryResponse: convert,
    });
};
