// @flow
import { quickStoreRecursively } from '../../IOUtils';
import { getContext } from '../../context';

export const storeOrgUnitLevels = () => {
    const query = {
        resource: 'organisationUnitLevels',
        params: {
            fields: 'id,displayName,level',
            filter: 'level:gt:1',
        },
    };

    const converter = response => response.organisationUnitLevels;

    return quickStoreRecursively(query, getContext().storeNames.ORGANISATION_UNIT_LEVELS, { onConvert: converter });
};
