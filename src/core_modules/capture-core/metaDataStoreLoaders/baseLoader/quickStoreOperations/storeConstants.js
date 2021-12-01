// @flow
import { getContext } from '../../context';
import { quickStoreRecursively } from '../../IOUtils';

export const storeConstants = () => {
    const query = {
        resource: 'constants',
        params: {
            fields: 'id,displayName,value',
        },
    };

    const convert = response => response && response.constants;

    return quickStoreRecursively({
        query,
        storeName: getContext().storeNames.CONSTANTS,
        convertQueryResponse: convert,
    });
};
