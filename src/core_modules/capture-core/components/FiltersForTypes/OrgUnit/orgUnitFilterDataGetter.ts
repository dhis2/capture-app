import type { OrgUnitFilterData } from './types';
import type { Value } from './OrgUnit.types';

export const getOrgUnitFilterData = (value: Value): OrgUnitFilterData | null | undefined => {
    if (!value) return null;
    return { value: value.name, id: value.id };
};
