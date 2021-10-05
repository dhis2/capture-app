// @flow
import { useMemo, useEffect, useState } from 'react';
import { useDataQuery } from '@dhis2/app-runtime';

const fields = 'id,displayName,version,valueType,options[id,displayName,code,style, translations]';

export const useOptionSets = () => {
    const [page, setPage] = useState(0);
    const [optionSets, setOptionSets] = useState([]);
    const { error, loading, data, refetch, called } = useDataQuery(
        useMemo(
            () => ({
                optionSets: {
                    resource: 'optionSets',
                    params: ({ variables }) => ({
                        fields,
                        pageSize: 100,
                        page: variables.page,
                    }),
                },
            }),
            [],
        ),
        {
            lazy: true,
        },
    );

    useEffect(() => {
        const hasNextPage = !called || (!loading && data?.optionSets?.pager?.nextPage);
        if (hasNextPage) {
            refetch({ variables: { page: page + 1 } });
            setPage(page + 1);
        }
        if (data && data.optionSets && data.optionSets.pager?.total > optionSets.length) {
            setOptionSets([...optionSets, ...data.optionSets.optionSets]);
        }
    }, [data, called, loading, refetch, setOptionSets, page, optionSets]);

    return { error, optionSets, loading: data?.optionSets?.pager?.total !== optionSets.length };
};
