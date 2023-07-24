// @flow
import i18n from '@dhis2/d2-i18n';
import { getUserStorageController } from '../../../storageControllers';
import { userStores } from '../../../storageControllers/stores';
import { useIndexedDBQuery } from '../../../utils/reactQueryHelpers';

export const useScheduledLabel = (programId: string, programStageId?: string) => {
    const storageController = getUserStorageController();

    const { data, error, isLoading } = useIndexedDBQuery(
        ['ScheduledAtLabel', programStageId],
        () =>
            storageController.get(userStores.PROGRAMS, programId, {
                project: ({ programStages }) => programStages
                    ?.find(stage => stage.id === programStageId)?.dueDateLabel,
            }),
        {
            enabled: !!programStageId,
        },
    );

    return {
        scheduledLabel: data ?? i18n.t('Scheduled date'),
        isLoading,
        error,
    };
};
