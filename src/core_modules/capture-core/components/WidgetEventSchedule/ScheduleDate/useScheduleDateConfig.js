// @flow
import { useMemo } from 'react';
import { useDataQuery } from '@dhis2/app-runtime';

export const useScheduleDateConfig = (stageId: string) => {
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
