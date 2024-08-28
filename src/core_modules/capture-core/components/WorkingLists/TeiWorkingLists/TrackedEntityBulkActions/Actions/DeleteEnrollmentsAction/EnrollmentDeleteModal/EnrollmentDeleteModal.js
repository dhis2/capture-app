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
import { ConditionalTooltip } from '../../../../../../Tooltips/ConditionalTooltip';

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
            onClose={() => setIsDeleteDialogOpen(false)}
        >
            <ModalTitle>
                {i18n.t('Delete enrollments')}
            </ModalTitle>

            <ModalContent>
                {i18n.t('Are you sure you want to delete all enrollments in the selected program?')}

                <BulkActionCountTable
                    isLoading={isLoadingEnrollments}
                    total={enrollmentCounts?.total}
                    totalLabel={i18n.t('Total')}
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

                    <ConditionalTooltip
                        enabled={!enrollmentCounts?.active}
                        content={i18n.t('No active enrollments to delete')}
                    >
                        <Button
                            destructive
                            loading={isDeletingEnrollments}
                            onClick={() => deleteEnrollments({ activeOnly: true })}
                            disabled={!enrollmentCounts?.active}
                        >
                            {i18n.t('Delete active enrollments')}
                        </Button>
                    </ConditionalTooltip>

                    <ConditionalTooltip
                        enabled={!enrollmentCounts?.total}
                        content={i18n.t('No enrollments to delete')}
                    >
                        <Button
                            destructive
                            loading={isDeletingEnrollments}
                            onClick={() => deleteEnrollments({ activeOnly: false })}
                            disabled={!enrollmentCounts?.total}
                        >
                            {i18n.t('Delete all enrollments')}
                        </Button>
                    </ConditionalTooltip>
                </ButtonStrip>
            </ModalActions>
        </Modal>
    );
};
