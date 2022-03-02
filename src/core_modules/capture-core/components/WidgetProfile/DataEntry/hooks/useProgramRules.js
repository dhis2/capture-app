// @flow
import { useMemo, useState, useEffect } from 'react';
import { useDataQuery } from '@dhis2/app-runtime';

const fields =
    'id,displayName,condition,description,program[id],programStage[id],priority,' +
    'programRuleActions[id,content,displayContent,location,data,programRuleActionType,programStageSection[id],dataElement[id],' +
    'trackedEntityAttribute[id],programStage[id],optionGroup[id],option[id]]';

export const useProgramRules = (programId: string) => {
    const [page, setPage] = useState(0);
    const [programRules, setProgramRules] = useState([]);
    const { error, loading, data, called, refetch } = useDataQuery(
        useMemo(
            () => ({
                programRules: {
                    resource: 'programRules',
                    params: ({ variables }) => ({
                        filter: `program.id:eq:${programId}`,
                        fields,
                        page: variables.page,
                    }),
                },
            }),
            [programId],
        ),
        {
            lazy: true,
        },
    );
    useEffect(() => {
        const hasNextPage = !called || (!loading && data?.programRules?.pager?.nextPage);
        if (hasNextPage) {
            refetch({ variables: { page: page + 1 } });
            setPage(page + 1);
        }
        if (data && data.programRules && data.programRules.pager?.total > programRules.length) {
            setProgramRules([...programRules, ...data.programRules.programRules]);
        }
    }, [data, called, loading, refetch, setProgramRules, page, programRules]);

    return {
        error,
        loading: data?.programRules?.pager?.total !== programRules.length,
        programRules,
    };
};
