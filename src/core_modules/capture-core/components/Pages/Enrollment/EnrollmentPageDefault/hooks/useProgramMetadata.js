// @flow
import { useEffect } from 'react';
import { useDataQuery } from '@dhis2/app-runtime';

const query = {
    programData: {
        resource: 'programs',
        id: ({ id }) => id,
        params: {
            fields:
            ['programStages[id,repeatable,hideDueDate,programStageDataElements[displayInReports,dataElement[id,valueType,displayName,displayFormName,optionSet[options[code,name]]]'],
        },
    },
};

export const useProgramMetadata = (programId: string) => {
    const { data, error, loading, refetch } = useDataQuery(query, {
        lazy: true,
    });

    useEffect(() => {
        if (programId) {
            refetch({ id: programId });
        }
    }, [refetch, programId]);

    return { error, programMetadata: !loading && data?.programData ? data.programData : undefined };
};
