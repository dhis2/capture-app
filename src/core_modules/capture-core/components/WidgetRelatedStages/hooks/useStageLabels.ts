import i18n from '@dhis2/d2-i18n';
import { getUserMetadataStorageController, USER_METADATA_STORES } from '../../../storageControllers';
import { useIndexedDBQuery } from '../../../utils/reactQueryHelpers';

export const useStageLabels = (programId: string, programStageId?: string) => {
    const storageController = getUserMetadataStorageController();

    const { data, error, isLoading } = useIndexedDBQuery(
        ['programStageLabels', programStageId],
        () =>
            storageController.get(USER_METADATA_STORES.PROGRAMS, programId, {
                project: ({ programStages }) => {
                    const stage = programStages
                        ?.find(storeStage => storeStage.id === programStageId);
                    if (!stage) return {};
                    const { displayDueDateLabel, displayExecutionDateLabel } = stage;
                    return { displayDueDateLabel, displayExecutionDateLabel };
                },
            }),
        {
            enabled: !!programStageId,
        },
    );

    return {
        scheduledLabel: data?.displayDueDateLabel ?? i18n.t('Scheduled date'),
        occurredLabel: data?.displayExecutionDateLabel ?? i18n.t('Report date'),
        isLoading,
        error,
    };
};
