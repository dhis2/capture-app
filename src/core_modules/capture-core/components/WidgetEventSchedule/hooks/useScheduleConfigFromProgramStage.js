// @flow
import { useMemo } from 'react';
import { useDataQuery } from '@dhis2/app-runtime';

export const useScheduleConfigFromProgramStage = (stageId: string) => {
    const { data, error, loading } = useDataQuery(useMemo(() => ({
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
        programStageScheduleConfig: !loading && data.programStageScheduleConfig };
};
