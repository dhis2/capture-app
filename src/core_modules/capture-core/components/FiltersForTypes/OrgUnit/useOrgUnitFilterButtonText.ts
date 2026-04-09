import { useOrgUnitNameWithAncestors } from '../../../metadataRetrieval/orgUnitName';
import { isEmptyFilterData } from '../EmptyValue';
import type { OrgUnitFilter } from './orgUnit.types';

export const useOrgUnitFilterButtonText = (filter: OrgUnitFilter | null): string | undefined => {
    const orgUnit = filter && !isEmptyFilterData(filter) ? filter : null;
    const { displayName } = useOrgUnitNameWithAncestors(orgUnit && !orgUnit.name ? orgUnit.value : null);

    if (!filter) return undefined;
    if (isEmptyFilterData(filter)) return filter.value;
    if (filter.value == null) return undefined;
    return filter.name ?? displayName ?? filter.value;
};
