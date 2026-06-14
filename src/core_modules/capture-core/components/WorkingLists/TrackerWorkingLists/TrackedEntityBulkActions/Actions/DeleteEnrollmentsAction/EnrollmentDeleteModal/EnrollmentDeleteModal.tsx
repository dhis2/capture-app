import React from 'react';
import { withStyles, type WithStyles } from 'capture-core-utils/styles';
import { Button, ButtonStrip, CircularLoader, Modal, ModalActions, ModalContent, ModalTitle } from '@dhis2/ui';
import i18n from '@dhis2/d2-i18n';
import { useDeleteEnrollments } from '../hooks/useDeleteEnrollments';
import { CustomCheckbox } from './CustomCheckbox';
import { useProgramLabel } from '../../../../../../../metaData';
import type { PlainProps } from './EnrollmentDeleteModal.types';

const styles: Readonly<any> = {
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

const useEnrollmentDeleteLabels = (programId?: string) => ({
    enrollments: useProgramLabel('enrollment', { plural: true, programId }) ?? i18n.t('enrollments'),
    enrollment: useProgramLabel('enrollment', { programId }) ?? i18n.t('enrollment'),
    events: useProgramLabel('event', { plural: true, programId }) ?? i18n.t('events'),
});

const EnrollmentDeleteModalPlain = ({
    selectedRows,
    programId,
    onUpdateList,
    setIsDeleteDialogOpen,
    classes,
}: PlainProps & WithStyles<typeof styles>) => {
    const { enrollments, enrollment, events } = useEnrollmentDeleteLabels(programId);
    const {
        deleteEnrollments,
        isDeletingEnrollments,
        enrollmentCounts,
        isLoadingEnrollments,
        statusToDelete,
        updateStatusToDelete,
        numberOfEnrollmentsToDelete,
        isEnrollmentsError,
    } = useDeleteEnrollments({
        selectedRows,
        programId,
        onUpdateList,
        setIsDeleteDialogOpen,
    });

    if (isEnrollmentsError) {
        return (
            <Modal
                onClose={() => setIsDeleteDialogOpen(false)}
                small
            >
                <ModalTitle>
                    {i18n.t('Delete selected {{enrollments}}', { enrollments })}
                </ModalTitle>

                <ModalContent>
                    <div className={classes.modalContent}>
                        {/* eslint-disable-next-line max-len */}
                        {i18n.t('An error occurred while loading the selected {{enrollments}}. Please try again.', { enrollments })}
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
                    </ButtonStrip>
                </ModalActions>
            </Modal>
        );
    }

    if (isLoadingEnrollments || !enrollmentCounts) {
        return (
            <Modal
                onClose={() => setIsDeleteDialogOpen(false)}
            >
                <ModalTitle>
                    {i18n.t('Delete selected {{enrollments}}', { enrollments })}
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
            dataTest={'bulk-delete-enrollments-dialog'}
        >
            <ModalTitle>
                {i18n.t('Delete selected {{enrollments}}', { enrollments })}
            </ModalTitle>

            <ModalContent>
                <div className={classes.modalContent}>
                    <div>
                        {/* eslint-disable-next-line max-len */}
                        {i18n.t('This action will permanently delete the selected {{enrollments}}, including all associated data and {{events}}.', { enrollments, events })}
                    </div>

                    <div>
                        {i18n.t('Please select which {{enrollment}} statuses you want to delete:', { enrollment })}
                    </div>

                    <div>
                        <CustomCheckbox
                            disabled={enrollmentCounts.active === 0}
                            label={i18n.t('Active {{enrollments}} ({{count}})', {
                                enrollments,
                                count: enrollmentCounts.active,
                            })}
                            id="active"
                            checked={enrollmentCounts.active === 0 ? false : statusToDelete.active}
                            onChange={updateStatusToDelete}
                            dataTest={'bulk-delete-enrollments-active-checkbox'}
                        />

                        <CustomCheckbox
                            disabled={enrollmentCounts.completed === 0}
                            label={i18n.t('Completed {{enrollments}} ({{count}})', {
                                enrollments,
                                count: enrollmentCounts.completed,
                            })}
                            id="completed"
                            checked={enrollmentCounts.completed === 0 ? false : statusToDelete.completed}
                            onChange={updateStatusToDelete}
                            dataTest={'bulk-delete-enrollments-completed-checkbox'}
                        />

                        <CustomCheckbox
                            disabled={enrollmentCounts.cancelled === 0}
                            label={i18n.t('Cancelled {{enrollments}} ({{count}})', {
                                enrollments,
                                count: enrollmentCounts.cancelled,
                            })}
                            id="cancelled"
                            onChange={updateStatusToDelete}
                            checked={enrollmentCounts.cancelled === 0 ? false : statusToDelete.cancelled}
                            dataTest={'bulk-delete-enrollments-cancelled-checkbox'}
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
                        // @ts-expect-error - keeping original functionality as before ts rewrite
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
