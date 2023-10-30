// @flow
import { getAssociatedOrgUnitGroups } from 'capture-core/MetaDataStoreUtils/getAssociatedOrgUnitGroups';
import type { CoreOrgUnit } from './coreOrgUnit.types';
import type { QuerySingleResource } from '../../utils/api/api.types';

// Builds new CoreOrgUnit by fetching data from the api and index db
export async function fetchCoreOrgUnit(
    orgUnitId: string,
    querySingleResource: QuerySingleResource,
): Promise<CoreOrgUnit> {
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
