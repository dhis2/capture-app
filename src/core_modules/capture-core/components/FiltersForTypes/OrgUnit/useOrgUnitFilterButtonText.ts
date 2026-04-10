import { useOrgUnitNameWithAncestors } from '../../../metadataRetrieval/orgUnitName';
import { isEmptyFilterData } from '../EmptyValue';
import type { OrgUnitFilter } from './orgUnit.types';

export const useOrgUnitFilterButtonText = (filter: OrgUnitFilter | null): string | undefined => {
    const isOrgUnitFilter = filter && !isEmptyFilterData(filter);
    const needsFetch = isOrgUnitFilter && !filter.name;
    const { displayName } = useOrgUnitNameWithAncestors(needsFetch ? filter.value : null);

    if (!filter) return undefined;
    if (isEmptyFilterData(filter)) return filter.value;
    return filter.name ?? displayName ?? filter.value;
};
