import { useCallback } from 'react';
import log from 'loglevel';
import i18n from '@dhis2/d2-i18n';
import { useAlert, useDataEngine } from '@dhis2/app-runtime';
import { errorCreator } from 'capture-core-utils';
import { useBulkMutationWithValidation } from '../../../../WorkingListsCommon/BulkActionBar/hooks';

type Props = {
    selectedRows: Record<string, boolean>;
    isModalOpen: boolean;
    onUpdateList: (disableClearSelection?: boolean) => void;
    removeRowsFromSelection: (rows: Array<string>) => void;
    setIsModalOpen: (open: boolean) => void;
};

export const useBulkDeleteEvents = ({
    selectedRows,
    isModalOpen,
    onUpdateList,
    removeRowsFromSelection,
    setIsModalOpen,
}: Props) => {
    const dataEngine = useDataEngine();
    const { show: showAlert } = useAlert(
        ({ message }) => message,
        { critical: true },
    );

    const mutationFn = useCallback(
        () => dataEngine.mutate({
            resource: 'tracker?async=false&importStrategy=DELETE',
            type: 'create',
            data: {
                events: Object.keys(selectedRows).map(id => ({ event: id })),
            },
        }) as Promise<any>,
        [dataEngine, selectedRows],
    );

    const {
        mutate: deleteEvents,
        isPending,
        validationError,
    } = useBulkMutationWithValidation<any, void>({
        mutationFn,
        active: isModalOpen,
        onSuccess: () => {
            onUpdateList();
            setIsModalOpen(false);
        },
        onPartialSuccess: (report) => {
            const failedUids = new Set(report.validationReport.errorReports.map(e => e.uid));
            const succeededUids = Object.keys(selectedRows).filter(id => !failedUids.has(id));
            removeRowsFromSelection(succeededUids);
            onUpdateList(true);
        },
        onValidationError: (report) => {
            log.error(errorCreator('A validation error occurred while deleting the events')({ report }));
        },
        onFatalError: (serverResponse) => {
            log.error(errorCreator('An error occurred while deleting the events')({ serverResponse }));
            showAlert({ message: i18n.t('An error occurred while deleting the events') });
        },
    });

    return {
        deleteEvents,
        isPending,
        validationError,
    };
};
