import type { UseQueryOptions } from '@tanstack/react-query';
import { USER_METADATA_STORES, getUserMetadataStorageController } from '../../storageControllers';
import { useIndexedDBQuery } from '../reactQueryHelpers';

export type CategoryOption = {
    id: string;
    displayName: string;
    categories: Array<string>;
    organisationUnits: Record<string, true> | null;
    access: { data: { write: boolean } };
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

    const { data, isInitialLoading, isError } = useIndexedDBQuery<Array<CategoryOption>>(
        ['categoryOptions', ...queryKey],
        () => storageController.getAll(
            USER_METADATA_STORES.CATEGORY_OPTIONS,
            { predicate: (option: CategoryOption) =>
                option.categories?.some(id => categoryIds!.has(id)) ?? false },
        ),
        { ...queryOptions, enabled },
    );

    return { categoryOptions: data, isLoading: isInitialLoading, isError };
};
