// @flow
import { getContext } from '../../context';
import { quickStoreRecursively } from '../../IOUtils';

export const storeOrgUnitLevels = () => {
    const query = {
        resource: 'organisationUnitLevels',
        params: {
            fields: 'id,displayName,level',
            filter: 'level:gt:1',
        },
    };

    const convert = response => response && response.organisationUnitLevels;

    return quickStoreRecursively({
        query,
        storeName: getContext().storeNames.ORGANISATION_UNIT_LEVELS,
        convertQueryResponse: convert,
    });
};
