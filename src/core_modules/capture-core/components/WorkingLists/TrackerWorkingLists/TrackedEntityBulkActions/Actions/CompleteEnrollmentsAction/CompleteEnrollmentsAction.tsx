import i18n from '@dhis2/d2-i18n';
import { withStyles, type WithStyles } from 'capture-core-utils/styles';
import React, { useMemo, useState } from 'react';
import {
    Button,
    ButtonStrip,
    Checkbox,
    CircularLoader,
    colors,
    Modal,
    ModalActions,
    ModalContent,
    ModalTitle,
} from '@dhis2/ui';
import { ConditionalTooltip } from '../../../../../Tooltips/ConditionalTooltip';
import { useBulkCompleteEnrollments } from './hooks/useBulkCompleteEnrollments';
import { BulkActionErrorModal } from '../../../../WorkingListsCommon/BulkActionBar/BulkActionErrorModal';
import { createEnrollmentErrorHrefResolver } from '../../../../WorkingListsCommon/BulkActionBar/utils';
import { useLocationQuery } from '../../../../../../utils/routing';
import type { ProgramStage } from '../../../../../../metaData';
import type { EnrollmentBulkActionProps } from '../../../../WorkingListsCommon/BulkActionBar/types';

type Props = EnrollmentBulkActionProps & {
    stages: Map<string, ProgramStage>;
};

const styles: Readonly<any> = {
    container: {
        fontSize: '14px',
        lineHeight: '19px',
        color: colors.grey900,
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
    },
    spinner: {
        display: 'flex',
        justifyContent: 'center',
        margin: '20px 0',
    },
};

const getTooltipContent = (programDataWriteAccess: boolean, bulkDataEntryIsActive: boolean) => {
    if (!programDataWriteAccess) {
        return i18n.t('You do not have access to bulk complete enrollments');
    }
    if (bulkDataEntryIsActive) {
        return i18n.t('There is a bulk data entry with unsaved changes');
    }
    return '';
};

const CompleteEnrollmentsActionPlain = ({
    selectedRows,
    programId,
    stages,
    programDataWriteAccess,
    onUpdateList,
    removeRowsFromSelection,
    bulkDataEntryIsActive,
    classes,
}: Props & WithStyles<typeof styles>) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [completeEvents, setCompleteEvents] = useState(true);
    const { orgUnitId } = useLocationQuery();
    const {
        completeEnrollments,
        enrollmentCounts,
        enrollmentIdToTeiId,
        isLoading,
        validationError,
        isPending,
        hasPartiallyUploadedEnrollments,
        isError: errorFetchingTrackedEntities,
    } = useBulkCompleteEnrollments({
        selectedRows,
        programId,
        isModalOpen,
        stages,
        onUpdateList,
        removeRowsFromSelection,
        setIsModalOpen,
    });
    const tooltipContent = getTooltipContent(programDataWriteAccess, bulkDataEntryIsActive);
    const disabled = !programDataWriteAccess || bulkDataEntryIsActive;

    const getRecordHref = useMemo(
        () => createEnrollmentErrorHrefResolver({
            programId,
            orgUnitId,
            enrollmentIdToTeiId,
        }),
        [programId, orgUnitId, enrollmentIdToTeiId],
    );

    const closeModal = () => setIsModalOpen(false);

    const renderContent = () => {
        // If the data is still loading, show a spinner
        if (!enrollmentCounts || isLoading) {
            return (
                <div className={classes.spinner}>
                    <CircularLoader />
                </div>
            );
        }

        if (errorFetchingTrackedEntities) {
            return (
                <div className={classes.container}>
                    {i18n.t('An unexpected error occurred while fetching the enrollments. Please try again.')}
                </div>
            );
        }

        // If there are no active enrollments, show a message and disable the complete button
        if (enrollmentCounts.active === 0) {
            return (
                <div className={classes.container}>
                    {i18n.t('There are currently no active enrollments in the selection.')}
                    {' '}
                    {i18n.t('All enrollments are already completed or cancelled.')}
                </div>
            );
        }

        return (
            <div className={classes.container}>
                {i18n.t('This action will complete {{count}} active enrollment in your selection.',
                    {
                        count: enrollmentCounts.active,
                        defaultValue: 'This action will complete {{count}} active enrollment in your selection.',
                        defaultValue_plural: 'This action will complete {{count}} active enrollments in your selection.',
                    })
                }

                {' '}

                {enrollmentCounts.completed > 0 &&
                    i18n.t('{{count}} enrollment already marked as completed will not be changed.', {
                        count: enrollmentCounts.completed,
                        defaultValue: '{{count}} enrollment already marked as completed will not be changed.',
                        defaultValue_plural: '{{count}} enrollments already marked as completed will not be changed.',
                    })
                }

                <Checkbox
                    label={i18n.t('Mark all events within enrollments as complete')}
                    checked={completeEvents}
                    onChange={() => setCompleteEvents(prevState => !prevState)}
                />

            </div>
        );
    };

    return (
        <>
            <ConditionalTooltip
                enabled={disabled}
                content={tooltipContent}
            >
                <Button
                    small
                    disabled={disabled}
                    onClick={() => setIsModalOpen(true)}
                >
                    {i18n.t('Complete enrollments')}
                </Button>
            </ConditionalTooltip>

            {isModalOpen && !validationError && (
                <Modal
                    onClose={closeModal}
                    dataTest={'bulk-complete-enrollments-dialog'}
                >
                    <ModalTitle>{i18n.t('Complete enrollments')}</ModalTitle>
                    <ModalContent>
                        {renderContent()}
                    </ModalContent>

                    <ModalActions>
                        <ButtonStrip>
                            <Button
                                secondary
                                onClick={closeModal}
                            >
                                {i18n.t('Cancel')}
                            </Button>

                            <ConditionalTooltip
                                enabled={enrollmentCounts?.active === 0}
                                content={i18n.t('No active enrollments to complete')}
                            >
                                <Button
                                    primary
                                    onClick={() => completeEnrollments({ completeEvents })}
                                    disabled={isLoading || enrollmentCounts?.active === 0}
                                    loading={isPending}
                                    dataTest={'bulk-complete-enrollments-confirm-button'}
                                >
                                    {i18n.t('Complete {{count}} enrollment', {
                                        count: enrollmentCounts.active,
                                        defaultValue: 'Complete {{count}} enrollment',
                                        defaultValue_plural: 'Complete {{count}} enrollments',
                                    })}
                                </Button>
                            </ConditionalTooltip>
                        </ButtonStrip>
                    </ModalActions>
                </Modal>
            )}

            {isModalOpen && validationError && (
                <BulkActionErrorModal
                    title={i18n.t('Error completing enrollments')}
                    introText={
                        hasPartiallyUploadedEnrollments
                            ? i18n.t(
                                'Some enrollments were completed successfully, but there was an error while ' +
                                'completing the rest. Please see the details below.',
                            )
                            : i18n.t(
                                'There was an error while completing the enrollments. Please see the details below.',
                            )
                    }
                    errorReports={validationError.validationReport.errorReports}
                    getRecordHref={getRecordHref}
                    onClose={closeModal}
                    dataTest={'bulk-complete-enrollments-dialog'}
                />
            )}
        </>
    );
};

export const CompleteEnrollmentsAction = withStyles(styles)(CompleteEnrollmentsActionPlain);
