import { useMemo } from 'react';
import type { UseQueryOptions } from '@tanstack/react-query';
import { USER_METADATA_STORES, getUserMetadataStorageController } from '../../storageControllers';
import { useIndexedDBQuery } from '../reactQueryHelpers';

export type CategoryOption = {
    id: string;
    displayName: string;
    categories: Array<string>;
    organisationUnits: Array<string> | null;
    access: { data: { write: boolean } };
};

type CachedCategoryOption = Omit<CategoryOption, 'organisationUnits'> & {
    organisationUnits: Record<string, true> | null;
};

export const useCategoryOptionsFromIndexedDB = (
    queryKey: Array<string | number>,
    categoryIds: Set<string> | null | undefined,
    queryOptions?: UseQueryOptions<any>,
): {
    categoryOptions: Array<CategoryOption> | null | undefined;
    isLoading: boolean;
    isError: boolean;
} => {
    const storageController = getUserMetadataStorageController();
    const { enabled = !!categoryIds && categoryIds.size > 0 } = queryOptions ?? {};

    const { data, isInitialLoading, isError } = useIndexedDBQuery<Array<CachedCategoryOption>>(
        ['categoryOptionsFromIndexedDB', ...queryKey],
        () => storageController.getAll(
            USER_METADATA_STORES.CATEGORY_OPTIONS,
            { predicate: (option: CachedCategoryOption) =>
                option.categories?.some(id => categoryIds!.has(id)) ?? false },
        ),
        { ...queryOptions, enabled },
    );

    const categoryOptions = useMemo<Array<CategoryOption> | undefined>(() => (data
        ? data.map(option => ({
            ...option,
            organisationUnits: option.organisationUnits ? Object.keys(option.organisationUnits) : null,
        }))
        : undefined), [data]);

    return { categoryOptions, isLoading: isInitialLoading, isError };
};
