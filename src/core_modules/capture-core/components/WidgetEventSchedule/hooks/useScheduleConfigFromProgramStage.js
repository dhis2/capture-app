// @flow
import { useDataQuery } from '@dhis2/app-runtime';
import { useMemo } from 'react';

export const useScheduleConfigFromProgramStage = (stageId: string) => {
    const { data, error, loading } = useDataQuery(useMemo(() => ({
        programStageScheduleConfig: {
            resource: 'programStages',
            id: stageId,
            params: {
                fields:
                ['id,nextScheduleDate,standardInterval,generatedByEnrollmentDate,minDaysFromStart'],
            },
        },
    }), [stageId]));


    return { error,
        programStageScheduleConfig: !loading && data.programStageScheduleConfig };
};
