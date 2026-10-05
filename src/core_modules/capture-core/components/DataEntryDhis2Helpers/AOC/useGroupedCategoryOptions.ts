import { useMemo } from 'react';
import {
    useCategoryOptionsFromIndexedDB,
    type CategoryOption,
} from '../../../utils/cachedDataHooks/useCategoryOptionsFromIndexedDB';

export type CategoryOptionEntry = { label: string; value: string };
export type LoadedCategory = { id: string; label: string; options: Array<CategoryOptionEntry> };

const sortByLabel = (a: CategoryOptionEntry, b: CategoryOptionEntry) =>
    a.label.localeCompare(b.label);

const matchesOrgUnit = (option: CategoryOption, orgUnitId: string | null | undefined) => {
    if (!orgUnitId) return true;
    if (!option.organisationUnits || option.organisationUnits.length === 0) return true;
    return option.organisationUnits.includes(orgUnitId);
};

export const useGroupedCategoryOptions = (
    programCategories: ReadonlyArray<{ id: string; displayName: string }>,
    orgUnitId: string | null | undefined,
    enabled: boolean,
): Array<LoadedCategory> | undefined => {
    const { categoryIds, queryKey } = useMemo(() => {
        if (!enabled) return { categoryIds: null, queryKey: [] };
        const ids = programCategories.map(c => c.id);
        return { categoryIds: new Set(ids), queryKey: ids };
    }, [enabled, programCategories]);
    const { categoryOptions } = useCategoryOptionsFromIndexedDB(queryKey, categoryIds);

    return useMemo(() => {
        if (!enabled) return undefined;
        if (programCategories.length === 0) return [];
        if (!categoryOptions) return undefined;
        return programCategories.map(({ id, displayName }) => ({
            id,
            label: displayName,
            options: categoryOptions
                .filter(o =>
                    o.access?.data?.write &&
                    o.categories?.includes(id) &&
                    matchesOrgUnit(o, orgUnitId))
                .map<CategoryOptionEntry>(o => ({ label: o.displayName, value: o.id }))
                .sort(sortByLabel),
        }));
    }, [enabled, categoryOptions, programCategories, orgUnitId]);
};
