// @flow
import { useMemo, useState, useEffect } from 'react';
import { useDataQuery } from '@dhis2/app-runtime';


export const useBuildCatCombo = (categoryOptions: Array<string>) => {
    const [categoryCombo, setCategoryCombo] = useState();
    const { data, error, refetch } = useDataQuery(
        useMemo(
            () => ({
                categoryOptions: {
                    resource: 'categoryOptions',
                    params: ({ variables: { categoryOptions: categories } }) => ({
                        fields: 'id,displayName,categories[id]',
                        filter: `id:in:[${categories.join(',')}]`,
                    }),
                },
            }),
            [],
        ),
        { lazy: true },
    );

    useEffect(() => {
        if (categoryOptions && !categoryCombo) {
            refetch({ variables: { categoryOptions } });
        }
    }, [categoryOptions, categoryCombo, refetch]);

    useEffect(() => {
        if (data) {
            const apiCategoryOptions = data?.categoryOptions?.categoryOptions;

            const combinedCatCombo = apiCategoryOptions.reduce((acc, { categories, ...rest }) => {
                categories.forEach(({ id }) => {
                    if (!acc[id]) { acc[id] = []; }
                    acc[id] = [...acc[id], { ...rest }];
                });
                return acc;
            }, {});
            setCategoryCombo(combinedCatCombo);
        }
    }, [data]);

    return {
        error,
        categoryCombo,
    };
};
