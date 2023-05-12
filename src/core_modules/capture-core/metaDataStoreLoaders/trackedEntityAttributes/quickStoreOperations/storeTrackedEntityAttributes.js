// @flow
import { quickStore } from '../../IOUtils';
import { getContext } from '../../context';

export const storeTrackedEntityAttributes = (ids: Array<string>) => {
    const query = {
        resource: 'trackedEntityAttributes',
        params: {
            fields: 'id,displayName,displayShortName,displayFormName,description,valueType,optionSetValue,unique,orgunitScope,' +
            'pattern,code,attributeValues,translations[property,locale,value],optionSet[id]',
            filter: `id:in:[${ids.join(',')}]`,
            pageSize: ids.length,
        },
    };

    const convert = (response) => {
        if (!response.trackedEntityAttributes) {
            return false;
        }
        return response && response.trackedEntityAttributes.map((attribute) => {
            const { attributeValues, ...rest } = attribute;

            if (!attributeValues) {
                return rest;
            }

            return {
                ...rest,
                attributeValues: attributeValues && attributeValues.reduce((acc, attributeValue) => {
                    acc[attributeValue.attribute.id] = attributeValue.value;
                    return acc;
                }, {}),
            };
        });
    };

    return quickStore({
        query,
        storeName: getContext().storeNames.TRACKED_ENTITY_ATTRIBUTES,
        convertQueryResponse: convert,
    });
};
