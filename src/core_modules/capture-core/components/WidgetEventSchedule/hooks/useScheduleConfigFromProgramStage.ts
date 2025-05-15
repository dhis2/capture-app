import { useMemo } from 'react';
import { useDataQuery } from '@dhis2/app-runtime';

type ProgramStageScheduleConfig = {
    id: string;
    nextScheduleDate?: string;
    standardInterval?: string;
    generatedByEnrollmentDate?: boolean;
    minDaysFromStart?: number;
    displayDueDateLabel?: string;
};

type QueryResult = {
    programStageScheduleConfig: ProgramStageScheduleConfig;
};

export const useScheduleConfigFromProgramStage = (stageId: string) => {
    const { data, error, loading } = useDataQuery<QueryResult>(useMemo(() => ({
        programStageScheduleConfig: {
            resource: 'programStages',
            id: stageId,
            params: {
                fields:
                ['id,nextScheduleDate,standardInterval,generatedByEnrollmentDate,minDaysFromStart,displayDueDateLabel'],
            },
        },
    }), [stageId]));


    return { error,
        programStageScheduleConfig: !loading && data?.programStageScheduleConfig };
};
