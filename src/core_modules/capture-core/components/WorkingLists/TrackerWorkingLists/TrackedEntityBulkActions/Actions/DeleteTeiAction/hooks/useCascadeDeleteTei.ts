import log from 'loglevel';
import i18n from '@dhis2/d2-i18n';
import { useAlert, useDataEngine } from '@dhis2/app-runtime';
import { useMutation } from 'react-query';
import { errorCreator } from 'capture-core-utils';

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

    const { mutate: deleteTeis, isLoading } = useMutation<any>(
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
            onError: (error) => {
                log.error(errorCreator('An error occurred while deleting the tracked entities')({ error }));
                showAlert({ message: i18n.t('An error occurred while deleting the records') });
            },
            onSuccess: () => {
                onUpdateList();
                setIsDeleteDialogOpen(false);
            },
        },
    );

    return {
        deleteTeis,
        isLoading,
    };
};
