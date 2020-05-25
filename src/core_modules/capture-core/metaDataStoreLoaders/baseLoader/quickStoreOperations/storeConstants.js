// @flow
import { quickStoreRecursively } from '../../IOUtils';
import { getContext } from '../../context';

export const storeConstants = (): Promise<void> => {
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
