import { useMemo } from 'react';
import { useCategoryOptionsFromIndexedDB, type CategoryOption } from './useCategoryOptionsFromIndexedDB';

export type CategoryOptionEntry = { label: string; value: string; writeAccess: boolean };
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
    const categoryIds = useMemo(
        () => (enabled ? new Set(programCategories.map(c => c.id)) : null),
        [enabled, programCategories],
    );
    const queryKey = useMemo(
        () => (categoryIds ? Array.from(categoryIds).sort() : []),
        [categoryIds],
    );
    const { categoryOptions } = useCategoryOptionsFromIndexedDB(queryKey, categoryIds);

    return useMemo(() => {
        if (!enabled) return undefined;
        if (programCategories.length === 0) return [];
        if (!categoryOptions) return undefined;
        return programCategories.map(({ id, displayName }) => ({
            id,
            label: displayName,
            options: categoryOptions
                .filter(o => !!o.access?.data?.write)
                .filter(o => o.categories?.includes(id))
                .filter(o => matchesOrgUnit(o, orgUnitId))
                .map<CategoryOptionEntry>(o => ({
                    label: o.displayName,
                    value: o.id,
                    writeAccess: true,
                }))
                .sort(sortByLabel),
        }));
    }, [enabled, categoryOptions, programCategories, orgUnitId]);
};
