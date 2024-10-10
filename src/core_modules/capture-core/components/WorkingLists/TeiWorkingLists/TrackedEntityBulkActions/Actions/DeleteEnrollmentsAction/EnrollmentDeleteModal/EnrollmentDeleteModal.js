// @flow
import React from 'react';
import { withStyles } from '@material-ui/core';
import { Button, ButtonStrip, CircularLoader, Modal, ModalActions, ModalContent, ModalTitle } from '@dhis2/ui';
import i18n from '@dhis2/d2-i18n';
import { useDeleteEnrollments } from '../hooks/useDeleteEnrollments';
import { CustomCheckbox } from './CustomCheckbox';

type Props = {
    selectedRows: { [id: string]: boolean },
    programId: string,
    onUpdateList: () => void,
    setIsDeleteDialogOpen: (open: boolean) => void,
    classes: Object,
}

const styles = {
    modalContent: {
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        fontSize: '16px',
    },
    loadingContainer: {
        display: 'flex',
        justifyContent: 'center',
    },
};

const EnrollmentDeleteModalPlain = ({
    selectedRows,
    programId,
    onUpdateList,
    setIsDeleteDialogOpen,
    classes,
}: Props) => {
    const {
        deleteEnrollments,
        isDeletingEnrollments,
        enrollmentCounts,
        isLoadingEnrollments,
        statusToDelete,
        updateStatusToDelete,
        numberOfEnrollmentsToDelete,
    } = useDeleteEnrollments({
        selectedRows,
        programId,
        onUpdateList,
        setIsDeleteDialogOpen,
    });

    if (isLoadingEnrollments || !enrollmentCounts) {
        return (
            <Modal
                onClose={() => setIsDeleteDialogOpen(false)}
            >
                <ModalTitle>
                    {i18n.t('Delete selected enrollments')}
                </ModalTitle>

                <ModalContent>
                    <span className={classes.loadingContainer}>
                        <CircularLoader />
                    </span>
                </ModalContent>

                <ModalActions>
                    <ButtonStrip>
                        <Button
                            secondary
                            onClick={() => setIsDeleteDialogOpen(false)}
                        >
                            {i18n.t('Cancel')}
                        </Button>
                    </ButtonStrip>
                </ModalActions>
            </Modal>
        );
    }

    return (
        <Modal
            onClose={() => setIsDeleteDialogOpen(false)}
        >
            <ModalTitle>
                {i18n.t('Delete selected enrollments')}
            </ModalTitle>

            <ModalContent>
                <div className={classes.modalContent}>
                    <div>
                        {i18n.t('This action will permanently delete the selected enrollments, including all associated data and events.')}
                    </div>

                    <div>
                        {i18n.t('Please select which enrollment statuses you want to delete:')}
                    </div>

                    <div>
                        <CustomCheckbox
                            disabled={enrollmentCounts.active === 0}
                            label={i18n.t('Active enrollments ({{count}})', { count: enrollmentCounts.active })}
                            id="active"
                            checked={enrollmentCounts.active === 0 ? false : statusToDelete.active}
                            onChange={updateStatusToDelete}
                        />

                        <CustomCheckbox
                            disabled={enrollmentCounts.completed === 0}
                            label={i18n.t('Completed enrollments ({{count}})', { count: enrollmentCounts.completed })}
                            id="completed"
                            checked={enrollmentCounts.completed === 0 ? false : statusToDelete.completed}
                            onChange={updateStatusToDelete}
                        />

                        <CustomCheckbox
                            disabled={enrollmentCounts.cancelled === 0}
                            label={i18n.t('Cancelled enrollments ({{count}})', { count: enrollmentCounts.cancelled })}
                            id="cancelled"
                            onChange={updateStatusToDelete}
                            checked={enrollmentCounts.cancelled === 0 ? false : statusToDelete.cancelled}
                        />
                    </div>
                </div>
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
                        onClick={deleteEnrollments}
                        disabled={isDeletingEnrollments || numberOfEnrollmentsToDelete === 0}
                    >
                        {i18n.t('Delete {{count}} enrollment', {
                            count: numberOfEnrollmentsToDelete,
                            defaultValue: 'Delete {{count}} enrollment',
                            defaultValue_plural: 'Delete {{count}} enrollments',
                        })}
                    </Button>
                </ButtonStrip>
            </ModalActions>
        </Modal>
    );
};

export const EnrollmentDeleteModal = withStyles(styles)(EnrollmentDeleteModalPlain);
