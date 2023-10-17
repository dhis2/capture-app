// @flow
import { getAssociatedOrgUnitGroups } from 'capture-core/MetaDataStoreUtils/getAssociatedOrgUnitGroups';
import type { ReduxOrgUnit } from './organisationUnits.types';
import type { QuerySingleResource } from '../../utils/api/api.types';

// Builds new ReduxOrgUnit by fetching data from the api and index db
export async function fetchReduxOrgUnit(
    orgUnitId: string,
    querySingleResource: QuerySingleResource,
): Promise<ReduxOrgUnit> {
    return Promise.all([
        querySingleResource({
            resource: `organisationUnits/${orgUnitId}`,
            params: {
                fields: 'displayName,code,path',
            },
        }),
        getAssociatedOrgUnitGroups(orgUnitId),
    ]).then(([orgUnit, groups]) => ({
        id: orgUnitId,
        name: orgUnit.displayName,
        code: orgUnit.code,
        path: orgUnit.path,
        groups,
    }));
}
