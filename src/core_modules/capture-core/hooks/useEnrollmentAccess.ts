import { useMemo } from 'react';
import { useDataQuery } from '@dhis2/app-runtime';

type ProgramResponse = {
    access?: { data?: { read?: boolean; write?: boolean } };
    trackedEntityType?: { access?: { data?: { read?: boolean; write?: boolean } } };
    programStages?: Array<{ access?: { data?: { read?: boolean; write?: boolean } } }>;
};

type Result = {
    programWriteAccess: boolean;
    trackedEntityTypeWriteAccess: boolean;
    programStageWriteAccess: boolean;
    programStageReadAccess: boolean;
    isLoading: boolean;
    error?: any;
};

export const useEnrollmentAccess = (programId?: string): Result => {
    const { error, loading, data } = useDataQuery(
        useMemo(
            () => ({
                program: {
                    resource: `programs/${programId}`,
                    params: {
                        fields: ['access,trackedEntityType[access],programStages[access]'],
                    },
                },
            }),
            [programId],
        ),
        { lazy: !programId } as any,
    );

    const program = data?.program as ProgramResponse | undefined;

    return {
        programWriteAccess: Boolean(program?.access?.data?.write),
        trackedEntityTypeWriteAccess: Boolean(program?.trackedEntityType?.access?.data?.write),
        programStageWriteAccess: Boolean(
            program?.programStages?.some(stage => stage?.access?.data?.write),
        ),
        programStageReadAccess: Boolean(
            program?.programStages?.some(stage => stage?.access?.data?.read),
        ),
        isLoading: loading,
        error,
    };
};
