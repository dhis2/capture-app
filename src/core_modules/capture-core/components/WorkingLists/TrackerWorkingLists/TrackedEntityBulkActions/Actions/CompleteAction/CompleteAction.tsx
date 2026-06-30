import i18n from '@dhis2/d2-i18n';
import { withStyles, type WithStyles } from 'capture-core-utils/styles';
import React, { useState } from 'react';
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
import { useCompleteBulkEnrollments } from './hooks/useCompleteBulkEnrollments';
import { Widget } from '../../../../../Widget';
import { useProgramLabel } from '../../../../../../metaData';
import type { PlainProps } from './CompleteAction.types';

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
    errorContainer: {
        padding: '0px 20px',
    },
};

const getTooltipContent = (enrollments: string, programDataWriteAccess: boolean, bulkDataEntryIsActive: boolean) => {
    if (!programDataWriteAccess) {
        return i18n.t('You do not have access to bulk complete {{enrollments}}', { enrollments });
    }
    if (bulkDataEntryIsActive) {
        return i18n.t('There is a bulk data entry with unsaved changes');
    }
    return '';
};

const CompleteActionPlain = ({
    selectedRows,
    programId,
    stages,
    programDataWriteAccess,
    onUpdateList,
    removeRowsFromSelection,
    bulkDataEntryIsActive,
    classes,
}: PlainProps & WithStyles<typeof styles>) => {
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [completeEvents, setCompleteEvents] = useState(true);
    const [openAccordion, setOpenAccordion] = useState(false);
    const enrollment = useProgramLabel('enrollment', { programId }) ?? i18n.t('enrollment');
    const enrollments = useProgramLabel('enrollment', { plural: true, programId }) ?? i18n.t('enrollments');
    const enrollmentLabelByCount = (n: number) => (n === 1 ? enrollment : enrollments);
    const events = useProgramLabel('event', { plural: true, programId }) ?? i18n.t('events');
    const {
        completeEnrollments,
        enrollmentCounts,
        isLoading,
        validationError,
        isCompleting,
        hasPartiallyUploadedEnrollments,
        isError: errorFetchingTrackedEntities,
    } = useCompleteBulkEnrollments({
        selectedRows,
        programId,
        modalIsOpen,
        stages,
        onUpdateList,
        removeRowsFromSelection,
    });
    const tooltipContent = getTooltipContent(enrollments, programDataWriteAccess, bulkDataEntryIsActive);
    const disabled = !programDataWriteAccess || bulkDataEntryIsActive;

    const ModalTextContent = () => {
        // If the data is still loading, show a spinner
        if (!enrollmentCounts || isLoading) {
            return (
                <div className={classes.spinner}>
                    <CircularLoader />
                </div>
            );
        }

        // If there was an error importing the data, show an error message
        if (validationError) {
            const errors = (validationError as any)?.details?.validationReport?.errorReports;
            return (
                <div className={classes.container}>
                    <span>
                        {hasPartiallyUploadedEnrollments ?
                            // eslint-disable-next-line max-len
                            i18n.t('Some {{enrollments}} were completed successfully, but there was an error while completing the rest. Please see the details below.', { enrollments }) :
                            // eslint-disable-next-line max-len
                            i18n.t('There was an error while completing the {{enrollments}}. Please see the details below.', { enrollments })
                        }
                    </span>

                    <Widget
                        open={openAccordion}
                        onOpen={() => setOpenAccordion(true)}
                        onClose={() => setOpenAccordion(false)}
                        borderless
                        header={i18n.t('Details (Advanced)')}
                    >
                        <span className={classes.errorContainer}>
                            <ul>
                                {errors ? errors.map(errorReport => (
                                    <li key={`${errorReport.uid}-${errorReport.errorCode}`}>
                                        {errorReport?.message}
                                    </li>
                                )) : (
                                    <li>
                                        {i18n.t('An unknown error occurred.')}
                                    </li>
                                )}
                            </ul>
                        </span>
                    </Widget>
                </div>
            );
        }

        if (errorFetchingTrackedEntities) {
            return (
                <div className={classes.container}>
                    {/* eslint-disable-next-line max-len */}
                    {i18n.t('An unexpected error occurred while fetching the {{enrollments}}. Please try again.', { enrollments })}
                </div>
            );
        }

        // If there are no active enrollments, show a message and disable the complete button
        if (enrollmentCounts.active === 0) {
            return (
                <div className={classes.container}>
                    {i18n.t('There are currently no active {{enrollments}} in the selection.', { enrollments })}
                    {' '}
                    {i18n.t('All {{enrollments}} are already completed or cancelled.', { enrollments })}
                </div>
            );
        }

        return (
            <div className={classes.container}>
                {i18n.t('This action will complete {{count}} active {{enrollmentLabel}} in your selection.',
                    {
                        count: enrollmentCounts.active,
                        enrollmentLabel: enrollmentLabelByCount(enrollmentCounts.active),
                        defaultValue: 'This action will complete {{count}} active {{enrollmentLabel}} in your selection.',
                        // eslint-disable-next-line max-len
                        defaultValue_plural: 'This action will complete {{count}} active {{enrollmentLabel}} in your selection.',
                    })
                }

                {' '}

                {enrollmentCounts.completed > 0 &&
                    i18n.t('{{count}} {{enrollmentLabel}} already marked as completed will not be changed.', {
                        count: enrollmentCounts.completed,
                        enrollmentLabel: enrollmentLabelByCount(enrollmentCounts.completed),
                        defaultValue: '{{count}} {{enrollmentLabel}} already marked as completed will not be changed.',
                        // eslint-disable-next-line max-len
                        defaultValue_plural: '{{count}} {{enrollmentLabel}} already marked as completed will not be changed.',
                    })
                }

                <Checkbox
                    label={i18n.t('Mark all {{events}} within {{enrollments}} as complete', { events, enrollments })}
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
                    onClick={() => setModalIsOpen(true)}
                >
                    {i18n.t('Complete {{enrollments}}', { enrollments })}
                </Button>
            </ConditionalTooltip>

            {modalIsOpen && (
                <Modal
                    onClose={() => setModalIsOpen(false)}
                    dataTest={'bulk-complete-enrollments-dialog'}
                >
                    <ModalTitle>
                        {validationError ? i18n.t('Error completing {{enrollments}}', { enrollments })
                            : i18n.t('Complete {{enrollments}}', { enrollments })}
                    </ModalTitle>
                    <ModalContent>
                        <ModalTextContent />
                    </ModalContent>

                    <ModalActions>
                        <ButtonStrip>
                            <Button
                                secondary
                                onClick={() => setModalIsOpen(false)}
                            >
                                {i18n.t('Cancel')}
                            </Button>

                            {!validationError && (
                                <ConditionalTooltip
                                    enabled={enrollmentCounts?.active === 0}
                                    content={i18n.t('No active {{enrollments}} to complete', { enrollments })}
                                >
                                    <Button
                                        primary
                                        onClick={() => completeEnrollments({ completeEvents })}
                                        disabled={isLoading || enrollmentCounts?.active === 0}
                                        loading={isCompleting}
                                        dataTest={'bulk-complete-enrollments-confirm-button'}
                                    >
                                        {i18n.t('Complete {{count}} {{enrollmentLabel}}', {
                                            count: enrollmentCounts.active,
                                            enrollmentLabel: enrollmentLabelByCount(enrollmentCounts.active),
                                            defaultValue: 'Complete {{count}} {{enrollmentLabel}}',
                                            defaultValue_plural: 'Complete {{count}} {{enrollmentLabel}}',
                                        })}
                                    </Button>
                                </ConditionalTooltip>
                            )}
                        </ButtonStrip>
                    </ModalActions>
                </Modal>
            )}
        </>
    );
};

export const CompleteAction = withStyles(styles)(CompleteActionPlain);
