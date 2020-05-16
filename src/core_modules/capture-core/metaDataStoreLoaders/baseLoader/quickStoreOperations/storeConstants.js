// @flow
import { quickStoreRecursively } from '../../IOUtils';
import { getContext } from '../../context';

export const storeConstants = () => {
    const query = {
        resource: 'constants',
        params: {
            fields: 'id,displayName,value',
        },
    };

    const convert = response => response && response.constants;

    return quickStoreRecursively(query, getContext().storeNames.CONSTANTS, { onConvert: convert });
};
