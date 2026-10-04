import { useMemo } from 'react';
import { useApiMetadataQuery } from '../reactQueryHelpers';

type CategoryOptionEntry = {
    label: string;
    value: string;
    writeAccess: boolean;
};

type LoadedCategory = {
    id: string;
    label: string;
    options: Array<CategoryOptionEntry>;
};

type ApiCategoryOption = {
    id: string;
    displayName: string;
    categories: Array<string>;
    organisationUnits: Array<string> | null;
    access: { data: { write: boolean } };
};

type ApiResponse = { categoryOptions: Array<ApiCategoryOption> };

const sortByLabel = (a: CategoryOptionEntry, b: CategoryOptionEntry) =>
    a.label.localeCompare(b.label);

const matchesOrgUnit = (option: ApiCategoryOption, orgUnitId: string | null | undefined) => {
    if (!orgUnitId) return true;
    if (!option.organisationUnits || option.organisationUnits.length === 0) return true;
    return option.organisationUnits.includes(orgUnitId);
};

export const useCategoryOptionsFromServer = (
    programCategories: Array<{ id: string; displayName: string }>,
    orgUnitId: string | null | undefined,
    { enabled = true }: { enabled?: boolean } = {},
): {
    categories: Array<LoadedCategory> | undefined;
    isLoading: boolean;
    isError: boolean;
} => {
    const categoryIds = useMemo(() => programCategories.map(c => c.id).sort(), [programCategories]);
    const shouldFetch = enabled && categoryIds.length > 0;

    const query = useMemo(() => (shouldFetch ? {
        resource: 'categoryOptions',
        params: {
            fields: 'id,displayName,categories~pluck,organisationUnits~pluck,access[data[write]]',
            filter: [
                `categories.id:in:[${categoryIds.join(',')}]`,
                'access.data.read:in:[true]',
            ],
            paging: false,
        },
    } : undefined), [shouldFetch, categoryIds]);

    const { data, isLoading, isError } = useApiMetadataQuery<ApiResponse>(
        ['categoryOptionsFromServer', ...categoryIds],
        query,
        { enabled: shouldFetch },
    );

    const categories = useMemo(() => {
        if (!shouldFetch || !data) return undefined;
        const options = data.categoryOptions ?? [];
        return programCategories.map(({ id, displayName }) => ({
            id,
            label: displayName,
            options: options
                .filter(o => o.categories?.includes(id))
                .filter(o => matchesOrgUnit(o, orgUnitId))
                .map<CategoryOptionEntry>(o => ({
                    label: o.displayName,
                    value: o.id,
                    writeAccess: !!o.access?.data?.write,
                }))
                .sort(sortByLabel),
        }));
    }, [shouldFetch, data, programCategories, orgUnitId]);

    return { categories, isLoading, isError };
};
