import type { UseQueryOptions } from '@tanstack/react-query';
import { USER_METADATA_STORES, getUserMetadataStorageController } from '../../storageControllers';
import { useIndexedDBQuery } from '../reactQueryHelpers';

export type CachedCategoryOption = {
    id: string;
    displayName: string;
    categories: Array<string>;
    organisationUnits: Record<string, true> | null;
    access: { data: { write: boolean; read?: boolean } };
};

export const useCategoryOptionsFromIndexedDB = (
    queryKey: Array<string | number>,
    categoryOptionIds: Set<string> | null | undefined,
    queryOptions?: UseQueryOptions<any>,
): {
    categoryOptions: Array<CachedCategoryOption> | null | undefined;
    isLoading: boolean;
    isError: boolean;
} => {
    const storageController = getUserMetadataStorageController();
    const { enabled = !!categoryOptionIds } = queryOptions ?? {};

    const { data, isInitialLoading, isError } = useIndexedDBQuery(
        ['categoryOptions', ...queryKey],
        () => storageController.getAll(
            USER_METADATA_STORES.CATEGORY_OPTIONS,
            { predicate: (option: CachedCategoryOption) => categoryOptionIds!.has(option.id) },
        ),
        { enabled },
    );

    return {
        categoryOptions: data,
        isLoading: isInitialLoading,
        isError,
    };
};
