import React, { useMemo, useState } from 'react';
import i18n from '@dhis2/d2-i18n';
import { withStyles, type WithStyles } from 'capture-core-utils/styles';
import { Button, ButtonStrip, CircularLoader, Modal, ModalActions, ModalContent, ModalTitle } from '@dhis2/ui';
import { useAuthority, Authorities } from '../../../../../../utils/authority';
import { ConditionalTooltip } from '../../../../../Tooltips/ConditionalTooltip';
import { BulkActionErrorModal } from '../../../../WorkingListsCommon/BulkActionBar/BulkActionErrorModal';
import { createEnrollmentErrorHrefResolver } from '../../../../WorkingListsCommon/BulkActionBar/utils';
import { useLocationQuery } from '../../../../../../utils/routing';
import { useBulkDeleteEnrollments } from './useBulkDeleteEnrollments';
import { CustomCheckbox } from './CustomCheckbox';
import { LabelKeys, useTermLabel } from '../../../../../../customLabels';
import type { EnrollmentBulkActionProps } from '../../../../WorkingListsCommon/BulkActionBar/types';

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

const getTooltipContent = (
    programDataWriteAccess: boolean,
    bulkDataEntryIsActive: boolean,
    enrollmentsLabel: string,
) => {
    if (!programDataWriteAccess) {
        return i18n.t('You do not have access to delete {{enrollmentsLabel}}', { enrollmentsLabel });
    }
    if (bulkDataEntryIsActive) {
        return i18n.t('There is a bulk data entry with unsaved changes');
    }
    return '';
};

const DeleteEnrollmentsActionPlain = ({
    selectedRows,
    programDataWriteAccess,
    programId,
    onUpdateList,
    removeRowsFromSelection,
    bulkDataEntryIsActive,
    classes,
}: EnrollmentBulkActionProps & WithStyles<typeof styles>) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { hasAuthority } = useAuthority(Authorities.ENROLLMENT_CASCADE_DELETE);
    const { orgUnitId } = useLocationQuery();
    const { enrollmentLabel, enrollmentsLabel } = useTermLabel(
        [LabelKeys.enrollmentSingular, LabelKeys.enrollmentPlural],
    );
    const tooltipContent = getTooltipContent(programDataWriteAccess, bulkDataEntryIsActive, enrollmentsLabel);
    const disabled = !programDataWriteAccess || bulkDataEntryIsActive;

    const {
        deleteEnrollments,
        isPending,
        enrollmentCounts,
        isLoading,
        statusToDelete,
        updateStatusToDelete,
        numberOfEnrollmentsToDelete,
        isError,
        validationError,
        enrollmentIdToTeiId,
    } = useBulkDeleteEnrollments({
        selectedRows,
        programId,
        enrollmentsLabel,
        isModalOpen,
        onUpdateList,
        removeRowsFromSelection,
        setIsModalOpen,
    });

    const getRecordHref = useMemo(
        () => createEnrollmentErrorHrefResolver({
            programId,
            orgUnitId,
            enrollmentIdToTeiId,
        }),
        [programId, orgUnitId, enrollmentIdToTeiId],
    );

    if (!hasAuthority) {
        return null;
    }

    const closeModal = () => setIsModalOpen(false);

    const canShowDelete = !isError && !isLoading && !!enrollmentCounts;

    const renderContent = () => {
        if (isError) {
            return (
                <div className={classes.modalContent}>
                    {i18n.t(
                        'An error occurred while loading the selected {{enrollmentsLabel}}. Please try again.',
                        { enrollmentsLabel },
                    )}
                </div>
            );
        }

        if (isLoading || !enrollmentCounts) {
            return (
                <span className={classes.loadingContainer}>
                    <CircularLoader />
                </span>
            );
        }

        return (
            <div className={classes.modalContent}>
                <div>
                    {i18n.t(
                        'This action will permanently delete the selected {{enrollmentsLabel}}, '
                        + 'including all associated data and events.',
                        { enrollmentsLabel },
                    )}
                </div>
                <div>
                    {i18n.t(
                        'Please select which {{enrollmentLabel}} statuses you want to delete:',
                        { enrollmentLabel },
                    )}
                </div>
                <div>
                    <CustomCheckbox
                        disabled={enrollmentCounts.active === 0}
                        label={i18n.t(
                            'Active {{enrollmentsLabel}} ({{count}})',
                            { count: enrollmentCounts.active, enrollmentsLabel },
                        )}
                        id="active"
                        checked={enrollmentCounts.active === 0 ? false : statusToDelete.active}
                        onChange={updateStatusToDelete}
                        dataTest="bulk-delete-enrollments-active-checkbox"
                    />
                    <CustomCheckbox
                        disabled={enrollmentCounts.completed === 0}
                        label={i18n.t(
                            'Completed {{enrollmentsLabel}} ({{count}})',
                            { count: enrollmentCounts.completed, enrollmentsLabel },
                        )}
                        id="completed"
                        checked={enrollmentCounts.completed === 0 ? false : statusToDelete.completed}
                        onChange={updateStatusToDelete}
                        dataTest="bulk-delete-enrollments-completed-checkbox"
                    />
                    <CustomCheckbox
                        disabled={enrollmentCounts.cancelled === 0}
                        label={i18n.t(
                            'Cancelled {{enrollmentsLabel}} ({{count}})',
                            { count: enrollmentCounts.cancelled, enrollmentsLabel },
                        )}
                        id="cancelled"
                        onChange={updateStatusToDelete}
                        checked={enrollmentCounts.cancelled === 0 ? false : statusToDelete.cancelled}
                        dataTest="bulk-delete-enrollments-cancelled-checkbox"
                    />
                </div>
            </div>
        );
    };

    const renderModal = () => {
        if (validationError) {
            return (
                <BulkActionErrorModal
                    title={i18n.t('Error deleting {{enrollmentsLabel}}', { enrollmentsLabel })}
                    introText={i18n.t(
                        'There was an error while deleting the {{enrollmentsLabel}}. Please see the details below.',
                        { enrollmentsLabel },
                    )}
                    errorReports={validationError.validationReport.errorReports}
                    getRecordHref={getRecordHref}
                    onClose={closeModal}
                    dataTest="bulk-delete-enrollments-dialog"
                />
            );
        }

        return (
            <Modal
                onClose={closeModal}
                dataTest="bulk-delete-enrollments-dialog"
            >
                <ModalTitle>
                    {i18n.t('Delete selected {{enrollmentsLabel}}', { enrollmentsLabel })}
                </ModalTitle>
                <ModalContent>{renderContent()}</ModalContent>
                <ModalActions>
                    <ButtonStrip>
                        <Button secondary onClick={closeModal}>
                            {i18n.t('Cancel')}
                        </Button>
                        {canShowDelete && (
                            <Button
                                destructive
                                onClick={() => deleteEnrollments()}
                                disabled={isPending || numberOfEnrollmentsToDelete === 0}
                            >
                                {i18n.t('Delete {{count}} {{enrollmentLabel}}', {
                                    count: numberOfEnrollmentsToDelete,
                                    enrollmentLabel,
                                    enrollmentsLabel,
                                    defaultValue: 'Delete {{count}} {{enrollmentLabel}}',
                                    defaultValue_plural: 'Delete {{count}} {{enrollmentsLabel}}',
                                })}
                            </Button>
                        )}
                    </ButtonStrip>
                </ModalActions>
            </Modal>
        );
    };

    return (
        <>
            <ConditionalTooltip enabled={disabled} content={tooltipContent}>
                <Button small disabled={disabled} onClick={() => setIsModalOpen(true)}>
                    {i18n.t('Delete {{enrollmentsLabel}}', { enrollmentsLabel })}
                </Button>
            </ConditionalTooltip>

            {isModalOpen && renderModal()}
        </>
    );
};

export const DeleteEnrollmentsAction = withStyles(styles)(DeleteEnrollmentsActionPlain);
