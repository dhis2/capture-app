// @flow
import { quickStoreRecursively } from '../../IOUtils';
import { getContext } from '../../context';

const convert = response =>
    response &&
    response.organisationUnitGroups &&
    response.organisationUnitGroups
        .map(group => ({
            ...group,
            // Adding the organisation unit ids directly to the main object instead of using the container object with id as the only property
            // The reason being that we don't want the container object to be stored in IndexedDB.
            organisationUnits: undefined,
            organisationUnitIds: (group.organisationUnits || [])
                .map(orgUnit => orgUnit.id),
        }));
export const storeOrgUnitGroups = () => {
    const query = {
        resource: 'organisationUnitGroups',
        params: {
            fields: 'id,name,code,organisationUnits[id]',
        },
    };

    return quickStoreRecursively({
        query,
        storeName: getContext().storeNames.ORGANISATION_UNIT_GROUPS,
        convertQueryResponse: convert,
    }, {
        iterationSize: 100,
    });
};
