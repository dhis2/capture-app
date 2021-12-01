// @flow
import { useDataQuery } from '@dhis2/app-runtime';
import { useMemo } from 'react';

export const useProgramMetadata = (programId: string) => {
    const { data, error, loading } = useDataQuery(useMemo(() => ({
        programData: {
            resource: 'programs',
            id: programId,
            params: {
                fields:
                ['programStages[id,repeatable,hideDueDate,programStageDataElements[displayInReports,dataElement[id,valueType,displayName,optionSet[options[code,name]]]'],
            },
        },
    }), [programId]));

    return { error, programMetadata: !loading && data.programData };
};
