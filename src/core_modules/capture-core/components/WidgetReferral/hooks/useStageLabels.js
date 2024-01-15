// @flow
import i18n from '@dhis2/d2-i18n';
import { getUserStorageController } from '../../../storageControllers';
import { userStores } from '../../../storageControllers/stores';
import { useIndexedDBQuery } from '../../../utils/reactQueryHelpers';

export const useStageLabels = (programId: string, programStageId?: string) => {
    const storageController = getUserStorageController();

    const { data, error, isLoading } = useIndexedDBQuery(
        // $FlowFixMe - react-query types are not up-to-date
        ['programStageLabels', programStageId],
        () =>
            storageController.get(userStores.PROGRAMS, programId, {
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
