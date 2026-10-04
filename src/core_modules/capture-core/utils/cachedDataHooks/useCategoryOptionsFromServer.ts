import { useMemo } from 'react';
import type { UseQueryOptions } from '@tanstack/react-query';
import { useApiMetadataQuery } from '../reactQueryHelpers';

export type ApiCategoryOption = {
    id: string;
    displayName: string;
    categories: Array<string>;
    organisationUnits: Array<string> | null;
    access: { data: { write: boolean } };
};

type ApiResponse = { categoryOptions: Array<ApiCategoryOption> };

export const useCategoryOptionsFromServer = (
    queryKey: Array<string | number>,
    categoryIds: Set<string> | null | undefined,
    queryOptions?: UseQueryOptions<any>,
): {
    categoryOptions: Array<ApiCategoryOption> | null | undefined;
    isLoading: boolean;
    isError: boolean;
} => {
    const { enabled = !!categoryIds && categoryIds.size > 0 } = queryOptions ?? {};

    const query = useMemo(() => (enabled && categoryIds ? {
        resource: 'categoryOptions',
        params: {
            fields: 'id,displayName,categories~pluck,organisationUnits~pluck,access[data[write]]',
            filter: [
                `categories.id:in:[${Array.from(categoryIds).join(',')}]`,
                'access.data.read:in:[true]',
            ],
            paging: false,
        },
    } : undefined), [enabled, categoryIds]);

    const { data, isInitialLoading, isError } = useApiMetadataQuery<ApiResponse>(
        ['categoryOptionsFromServer', ...queryKey],
        query,
        { ...queryOptions, enabled },
    );

    return {
        categoryOptions: data?.categoryOptions,
        isLoading: isInitialLoading,
        isError,
    };
};
