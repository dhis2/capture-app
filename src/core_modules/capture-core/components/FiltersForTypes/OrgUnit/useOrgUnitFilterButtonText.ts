import { useOrgUnitNameWithAncestors } from '../../../metadataRetrieval/orgUnitName';
import type { OrgUnitFilterData } from './types';

export const useOrgUnitFilterButtonText = (filter: OrgUnitFilterData | null): string | undefined => {
    const orgUnitIdToFetch = filter?.value && !filter?.name ? filter.value : null;
    const { displayName } = useOrgUnitNameWithAncestors(orgUnitIdToFetch);

    if (filter?.value == null) return undefined;
    return filter.name ?? displayName ?? filter.value;
};
