import { useCallback } from 'react';
import log from 'loglevel';
import i18n from '@dhis2/d2-i18n';
import { useAlert, useDataEngine } from '@dhis2/app-runtime';
import { errorCreator } from 'capture-core-utils';
import { useBulkMutationWithValidation } from '../../../../../WorkingListsCommon/BulkActionBar/hooks';

type Props = {
    selectedRows: Record<string, boolean>;
    active: boolean;
    onUpdateList: (disableClearSelection?: boolean) => void;
    removeRowsFromSelection: (rows: Array<string>) => void;
    setIsModalOpen: (open: boolean) => void;
};

export const useBulkDeleteEvents = ({
    selectedRows,
    active,
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
        }),
        [dataEngine, selectedRows],
    );

    return useBulkMutationWithValidation<any, void>({
        mutationFn,
        active,
        onSuccess: () => {
            onUpdateList();
            setIsModalOpen(false);
        },
        onPartialSuccess: (report) => {
            const failedUids = new Set(
                report.validationReport.errorReports.map(e => e.uid).filter(Boolean) as string[],
            );
            const succeededUids = Object.keys(selectedRows).filter(id => !failedUids.has(id));
            removeRowsFromSelection(succeededUids);
            onUpdateList(true);
        },
        onFatalError: (serverResponse) => {
            log.error(errorCreator('An error occurred while deleting the events')({ serverResponse }));
            showAlert({ message: i18n.t('An error occurred while deleting the events') });
        },
    });
};
