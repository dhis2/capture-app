import React from 'react';
import { withStyles, type WithStyles } from 'capture-core-utils/styles';
import { Button, ButtonStrip, CircularLoader, Modal, ModalActions, ModalContent, ModalTitle } from '@dhis2/ui';
import i18n from '@dhis2/d2-i18n';
import { useDeleteEnrollments } from '../hooks/useDeleteEnrollments';
import { CustomCheckbox } from './CustomCheckbox';
import type { PlainProps } from './EnrollmentDeleteModal.types';
import { useTermLabel } from '../../../../../../../metaData';
import { customTerms } from '../../../../../../../utils/customTerms';

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

const EnrollmentDeleteModalPlain = ({
    selectedRows,
    programId,
    onUpdateList,
    setIsDeleteDialogOpen,
    classes,
}: PlainProps & WithStyles<typeof styles>) => {
    const enrollmentLabel = useTermLabel('enrollment', { programId });
    const enrollmentsLabel = useTermLabel('enrollment', { programId, plural: true });
    const eventsLabel = useTermLabel('event', { programId, plural: true });
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
                    {customTerms.i18n.t('Delete selected {{enrollmentsLabel}}', { enrollmentsLabel })}
                </ModalTitle>

                <ModalContent>
                    <div className={classes.modalContent}>
                        {customTerms.i18n.t(
                            'An error occurred while loading the selected {{enrollmentsLabel}}. Please try again.',
                            { enrollmentsLabel },
                        )}
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
                    {customTerms.i18n.t('Delete selected {{enrollmentsLabel}}', { enrollmentsLabel })}
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
                {customTerms.i18n.t('Delete selected {{enrollmentsLabel}}', { enrollmentsLabel })}
            </ModalTitle>

            <ModalContent>
                <div className={classes.modalContent}>
                    <div>
                        {/* eslint-disable-next-line max-len */}
                        {customTerms.i18n.t('This action will permanently delete the selected {{enrollmentsLabel}}, including all associated data and {{eventsLabel}}.', { enrollmentsLabel, eventsLabel })}
                    </div>

                    <div>
                        {customTerms.i18n.t(
                            'Please select which {{enrollmentLabel}} statuses you want to delete:',
                            { enrollmentLabel },
                        )}
                    </div>

                    <div>
                        <CustomCheckbox
                            disabled={enrollmentCounts.active === 0}
                            label={customTerms.i18n.t('Active {{enrollmentsLabel}} ({{count}})', { enrollmentsLabel, count: enrollmentCounts.active })} // eslint-disable-line max-len
                            id="active"
                            checked={enrollmentCounts.active === 0 ? false : statusToDelete.active}
                            onChange={updateStatusToDelete}
                            dataTest={'bulk-delete-enrollments-active-checkbox'}
                        />

                        <CustomCheckbox
                            disabled={enrollmentCounts.completed === 0}
                            label={customTerms.i18n.t('Completed {{enrollmentsLabel}} ({{count}})', { enrollmentsLabel, count: enrollmentCounts.completed })} // eslint-disable-line max-len
                            id="completed"
                            checked={enrollmentCounts.completed === 0 ? false : statusToDelete.completed}
                            onChange={updateStatusToDelete}
                            dataTest={'bulk-delete-enrollments-completed-checkbox'}
                        />

                        <CustomCheckbox
                            disabled={enrollmentCounts.cancelled === 0}
                            label={customTerms.i18n.t('Cancelled {{enrollmentsLabel}} ({{count}})', { enrollmentsLabel, count: enrollmentCounts.cancelled })} // eslint-disable-line max-len
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
                        {customTerms.i18n.t('Delete {{count}} {{enrollmentLabel}}', {
                            count: numberOfEnrollmentsToDelete,
                            enrollmentLabel,
                            defaultValue: 'Delete {{count}} {{enrollmentLabel}}',
                            defaultValue_plural: 'Delete {{count}} {{enrollmentsLabel}}',
                            enrollmentsLabel,
                        })}
                    </Button>
                </ButtonStrip>
            </ModalActions>
        </Modal>
    );
};

export const EnrollmentDeleteModal = withStyles(styles)(EnrollmentDeleteModalPlain);
