import { useOrgUnitNameWithAncestors } from '../../../metadataRetrieval/orgUnitName';
import type { OrgUnitFilterData } from './types';

/** Returns label for org unit filter button. Fetches name from API when filter has id but no name. */
export const useOrgUnitFilterButtonText = (filter: OrgUnitFilterData | null): string | undefined => {
    const orgUnitIdToFetch = filter?.value && !filter?.name ? filter.value : null;
    const { displayName } = useOrgUnitNameWithAncestors(orgUnitIdToFetch);

    if (filter?.value == null) return undefined;
    return filter.name ?? displayName ?? filter.value;
};
