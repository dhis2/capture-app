import { useOrgUnitNameWithAncestors } from '../../../metadataRetrieval/orgUnitName';
import type { OrgUnitFilterData } from './types';

export const useOrgUnitFilterButtonText = (filter: OrgUnitFilterData | null): string | undefined => {
    const isEmptyFilter = filter != null && 'isEmpty' in filter;
    const orgUnitIdToFetch = filter && !isEmptyFilter && filter.value && !filter.name ? filter.value : null;
    const { displayName } = useOrgUnitNameWithAncestors(orgUnitIdToFetch);

    if (!filter) return undefined;
    if (isEmptyFilter) return filter.value;
    if (filter.value == null) return undefined;
    return filter.name ?? displayName ?? filter.value;
};
