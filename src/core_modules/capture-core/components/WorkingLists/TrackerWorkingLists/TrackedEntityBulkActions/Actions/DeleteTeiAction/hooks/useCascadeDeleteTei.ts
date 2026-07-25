import { useMemo } from 'react';
import log from 'loglevel';
import i18n from '@dhis2/d2-i18n';
import { useAlert, useDataEngine } from '@dhis2/app-runtime';
import { useMutation } from '@tanstack/react-query';
import { errorCreator } from 'capture-core-utils';
import { extractValidationReport } from '../../../../../WorkingListsCommon/BulkActionBar/utils';

type Props = {
    selectedRows: Record<string, boolean>;
    setIsDeleteDialogOpen: (open: boolean) => void;
    onUpdateList: () => void;
};

export const useCascadeDeleteTei = ({
    selectedRows,
    setIsDeleteDialogOpen,
    onUpdateList,
}: Props) => {
    const dataEngine = useDataEngine();
    const { show: showAlert } = useAlert(
        ({ message }) => message,
        { critical: true },
    );

    const {
        mutate: deleteTeis,
        isPending,
        data: deleteData,
        error: deleteError,
        reset: resetDeleteTeis,
    } = useMutation<any, any>(
        () => dataEngine.mutate({
            resource: 'tracker?async=false&importStrategy=DELETE',
            type: 'create',
            data: {
                trackedEntities: Object
                    .keys(selectedRows)
                    .map(id => ({ trackedEntity: id })),
            },
        }),
        {
            onError: (serverResponse) => {
                log.error(errorCreator('An error occurred while deleting the tracked entities')({ serverResponse }));
                if (!serverResponse?.details?.validationReport?.errorReports?.length) {
                    showAlert({ message: i18n.t('An error occurred while deleting the records') });
                }
            },
            // Defensive against a future switch to atomicMode=OBJECT, where partial-failure
            // reports would arrive on `data` (HTTP 200) rather than as an HTTP error.
            onSuccess: (response: any) => {
                if (response?.validationReport?.errorReports?.length) return;
                onUpdateList();
                setIsDeleteDialogOpen(false);
            },
        },
    );

    const validationError = useMemo(
        () => extractValidationReport({ data: deleteData, error: deleteError }),
        [deleteData, deleteError],
    );

    return {
        deleteTeis,
        isLoading: isPending,
        validationError,
        resetDeleteTeis,
    };
};
