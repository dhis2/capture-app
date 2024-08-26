// @flow
import React from 'react';
import {
    Button,
    ButtonStrip,
    DataTableCell,
    DataTableRow,
    Modal,
    ModalActions,
    ModalContent,
    ModalTitle,
} from '@dhis2/ui';
import i18n from '@dhis2/d2-i18n';
import { BulkActionCountTable } from '../../../../../WorkingListsBase/BulkActionBar';
import { useDeleteEnrollments } from '../hooks/useDeleteEnrollments';

type Props = {
    selectedRows: { [id: string]: boolean },
    programId: string,
    onUpdateList: () => void,
    setIsDeleteDialogOpen: (open: boolean) => void,
}

export const EnrollmentDeleteModal = ({
    selectedRows,
    programId,
    onUpdateList,
    setIsDeleteDialogOpen,
}: Props) => {
    const {
        deleteEnrollments,
        isDeletingEnrollments,
        enrollmentCounts,
        isLoadingEnrollments,
    } = useDeleteEnrollments({
        selectedRows,
        programId,
        onUpdateList,
        setIsDeleteDialogOpen,
    });

    return (
        <Modal
            small
            onClose={() => setIsDeleteDialogOpen(false)}
        >
            <ModalTitle>
                {i18n.t('Delete enrollments')}
            </ModalTitle>

            <ModalContent>
                {i18n.t('Are you sure you want to delete all enrollments in the selected program?')}

                <BulkActionCountTable
                    total={enrollmentCounts?.total}
                    isLoading={isLoadingEnrollments}
                    totalLabel={i18n.t('Total enrollments to be deleted')}
                >
                    <DataTableRow>
                        <DataTableCell>
                            {i18n.t('Active')}
                        </DataTableCell>
                        <DataTableCell align={'center'}>
                            {enrollmentCounts?.active}
                        </DataTableCell>
                    </DataTableRow>

                    <DataTableRow>
                        <DataTableCell>
                            {i18n.t('Completed')}
                        </DataTableCell>
                        <DataTableCell align={'center'}>
                            {enrollmentCounts?.completed}
                        </DataTableCell>
                    </DataTableRow>
                </BulkActionCountTable>
            </ModalContent>

            <ModalActions>
                <ButtonStrip>
                    <Button
                        secondary
                        onClick={() => setIsDeleteDialogOpen(false)}
                    >
                        {i18n.t('Cancel')}
                    </Button>
                    <Button
                        destructive
                        loading={isDeletingEnrollments}
                        onClick={deleteEnrollments}
                    >
                        {i18n.t('Delete')}
                    </Button>
                </ButtonStrip>
            </ModalActions>
        </Modal>
    );
};
