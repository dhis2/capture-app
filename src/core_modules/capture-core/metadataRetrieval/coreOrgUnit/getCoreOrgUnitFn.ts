import log from 'loglevel';
import { errorCreator } from 'capture-core-utils';
import { fetchCoreOrgUnit } from './fetchCoreOrgUnit';
import type { CoreOrgUnit } from './coreOrgUnit.types';
import type { QuerySingleResource } from '../../utils/api';

export const getCoreOrgUnitFn = (querySingleResource: QuerySingleResource) =>
    async (orgUnitId: string | undefined, cachedOrgUnitsCore: { [orgUnitId: string]: CoreOrgUnit }) => {
        if (!orgUnitId) {
            return { coreOrgUnit: null, cached: false };
        }
        const cachedOrgUnit = cachedOrgUnitsCore[orgUnitId];
        if (cachedOrgUnit) {
            return { coreOrgUnit: cachedOrgUnit, cached: true };
        }
        const fetchedOrgUnit = await fetchCoreOrgUnit(orgUnitId, querySingleResource)
            .catch((error) => {
                log.error(errorCreator('org unit could not be fetched')({ orgUnitId, error }));
                return null;
            });
        return { coreOrgUnit: fetchedOrgUnit, cached: false };
    };
