import { useCallback } from 'react';
import log from 'loglevel';
import i18n from '@dhis2/d2-i18n';
import { useAlert, useDataEngine } from '@dhis2/app-runtime';
import { errorCreator } from 'capture-core-utils';
import { useBulkMutationWithValidation } from '../../../../../WorkingListsCommon/BulkActionBar/hooks';

type Props = {
    selectedRows: Record<string, boolean>;
    active: boolean;
    onUpdateList: () => void;
    setIsModalOpen: (open: boolean) => void;
};

export const useBulkDeleteEvents = ({
    selectedRows,
    active,
    onUpdateList,
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
        onFatalError: (serverResponse) => {
            log.error(errorCreator('An error occurred while deleting the events')({ serverResponse }));
            showAlert({ message: i18n.t('An error occurred while deleting the events') });
        },
    });
};
