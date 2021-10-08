// @flow
import { useMemo } from 'react';
import { useDataQuery } from '@dhis2/app-runtime';

export const useScheduleDate = (stageId: string) => {
    const { data, error, loading } = useDataQuery(useMemo(() => ({
        programStageSchedule: {
            resource: 'programStages',
            id: stageId,
            params: {
                fields:
                ['id,nextScheduleDate,standardInterval,generatedByEnrollmentDate'],
            },
        },
    }), [stageId]));


    return { error,
        programStageSchedule: !loading && data.programStageSchedule };
};
