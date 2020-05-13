// @flow
import { quickStoreRecursively } from '../../IOUtils';
import { getContext } from '../../context';

const convert = response =>
    response.organisationUnitGroups &&
    response.organisationUnitGroups
        .map(group => ({
            ...group,
            organisationUnits: undefined,
            organisationUnitIds: (group.organisationUnits || [])
                .map(orgUnit => orgUnit.id),
        }));
export const storeOrgUnitGroups = () => {
    const query = {
        resource: 'organisationUnitGroups',
        params: {
            fields: 'id,name,organisationUnits[id]',
        },
    };

    return quickStoreRecursively(query, getContext().storeNames.ORGANISATION_UNIT_GROUPS, { onConvert: convert, iterationSize: 100 });
};
