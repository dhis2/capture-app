import { useMemo } from 'react';
import { useCoreOrgUnit } from './useCoreOrgUnit';

/**
 * Enriches an org unit (which may lack date metadata, e.g. a tree-selected value that only
 * carries id/name/path) with its openingDate/closedDate, so date fields can enforce the org
 * unit's opening/closing range. Returns a memoized object; a falsy input is returned unchanged.
 */
export function useOrgUnitWithDates<T extends { id?: string | null }>(orgUnit?: T | null) {
    const { orgUnit: coreOrgUnit } = useCoreOrgUnit(orgUnit?.id ?? '');
    return useMemo(
        () => (orgUnit
            ? { ...orgUnit, openingDate: coreOrgUnit?.openingDate, closedDate: coreOrgUnit?.closedDate }
            : orgUnit),
        [orgUnit, coreOrgUnit?.openingDate, coreOrgUnit?.closedDate],
    );
}
