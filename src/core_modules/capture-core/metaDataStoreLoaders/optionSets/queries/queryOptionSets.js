// @flow
import { query } from '../../IOUtils';

export const queryOptionSets = async (ids: Array<string>) => {
    const specification = {
        resource: 'optionSets',
        params: {
            fields: 'id,displayName,code,attributeValues,version,valueType,options[id,displayName,attributeValues,code,style, translations]',
            filter: `id:in:[${ids.join(',')}]`,
            pageSize: ids.length,
        },
    };

    const response = await query(specification);
    return (response && response.optionSets) || [];
};
