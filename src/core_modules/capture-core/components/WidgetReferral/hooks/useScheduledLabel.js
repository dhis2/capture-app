// @flow
import { useQuery } from 'react-query';
import { useMemo } from 'react';
import { useDataEngine } from '@dhis2/app-runtime';
import i18n from '@dhis2/d2-i18n';

export const useScheduledLabel = (programStageId?: string) => {
    const dataEngine = useDataEngine();
    const scheduledLabelQuery = useMemo(() => ({
        scheduledLabelQuery: {
            resource: 'programStages',
            id: programStageId,
            params: {
                fields: 'dueDateLabel',
            },
        },
    }), [programStageId]);

    const { data, error, isLoading } = useQuery(
        ['ScheduledAtLabel', programStageId],
        () => dataEngine.query(scheduledLabelQuery),
        {
            enabled: !!programStageId,
            staleTime: Infinity,
            cacheTime: Infinity,
        },
    );

    return {
        scheduledLabel: data?.scheduledLabelQuery?.dueDateLabel ?? i18n.t('Scheduled date'),
        isLoading,
        error,
    };
};
