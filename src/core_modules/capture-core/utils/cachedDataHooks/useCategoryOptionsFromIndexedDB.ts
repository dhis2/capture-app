import { useMemo } from 'react';
import type { UseQueryOptions } from '@tanstack/react-query';
import { USER_METADATA_STORES, getUserMetadataStorageController } from '../../storageControllers';
import { useIndexedDBQuery } from '../reactQueryHelpers';
import type { ApiCategoryOption } from './useCategoryOptionsFromServer';

type CachedCategoryOption = Omit<ApiCategoryOption, 'organisationUnits'> & {
    organisationUnits: Record<string, true> | null;
};

export const useCategoryOptionsFromIndexedDB = (
    queryKey: Array<string | number>,
    categoryIds: Set<string> | null | undefined,
    queryOptions?: UseQueryOptions<any>,
): {
    categoryOptions: Array<ApiCategoryOption> | null | undefined;
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

    const categoryOptions = useMemo<Array<ApiCategoryOption> | undefined>(() => (data
        ? data.map(option => ({
            ...option,
            organisationUnits: option.organisationUnits ? Object.keys(option.organisationUnits) : null,
        }))
        : undefined), [data]);

    return { categoryOptions, isLoading: isInitialLoading, isError };
};
