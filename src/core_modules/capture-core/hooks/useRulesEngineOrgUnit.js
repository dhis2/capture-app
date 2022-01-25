// @flow
import type { OrgUnit } from 'capture-core-utils/rulesEngine';
import { useOrgUnitGroups } from 'capture-core/hooks/useOrgUnitGroups';
import { useOrganisationUnit } from '../dataQueries';

export function useRulesEngineOrgUnit(orgUnitId: string): ?OrgUnit {
    const { orgUnit } = useOrganisationUnit(orgUnitId, 'displayName,code');
    const groups = useOrgUnitGroups(orgUnitId);

    if (orgUnit && groups) {
        orgUnit.groups = groups;
        return orgUnit;
    }

    return undefined;
}
