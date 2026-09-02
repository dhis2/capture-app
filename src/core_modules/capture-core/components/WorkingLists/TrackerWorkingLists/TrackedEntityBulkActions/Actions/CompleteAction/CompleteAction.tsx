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
import type { PlainProps } from './CompleteAction.types';
import { useTermLabel } from '../../../../../../metaData';
import { tCustomTerm } from '../../../../../../utils/tCustomTerm';

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

const getTooltipContent = (
    programDataWriteAccess: boolean,
    bulkDataEntryIsActive: boolean,
    enrollmentsLabel: string,
) => {
    if (!programDataWriteAccess) {
        return tCustomTerm('You do not have access to bulk complete {{enrollmentsLabel}}', { enrollmentsLabel });
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
    const enrollmentLabel = useTermLabel('enrollment', { programId });
    const enrollmentsLabel = useTermLabel('enrollment', { programId, plural: true });
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
    const tooltipContent = getTooltipContent(programDataWriteAccess, bulkDataEntryIsActive, enrollmentsLabel);
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
                            tCustomTerm('Some {{enrollmentsLabel}} were completed successfully, but there was an error while completing the rest. Please see the details below.', { enrollmentsLabel }) :
                            tCustomTerm(
                                // eslint-disable-next-line max-len
                                'There was an error while completing the {{enrollmentsLabel}}. Please see the details below.',
                                { enrollmentsLabel },
                            )
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
                    {tCustomTerm(
                        'An unexpected error occurred while fetching the {{enrollmentsLabel}}. Please try again.',
                        { enrollmentsLabel },
                    )}
                </div>
            );
        }

        // If there are no active enrollments, show a message and disable the complete button
        if (enrollmentCounts.active === 0) {
            return (
                <div className={classes.container}>
                    {tCustomTerm(
                        'There are currently no active {{enrollmentsLabel}} in the selection.',
                        { enrollmentsLabel },
                    )}
                    {' '}
                    {tCustomTerm('All {{enrollmentsLabel}} are already completed or cancelled.', { enrollmentsLabel })}
                </div>
            );
        }

        return (
            <div className={classes.container}>
                {tCustomTerm('This action will complete {{count}} active {{enrollmentLabel}} in your selection.',
                    {
                        count: enrollmentCounts.active,
                        enrollmentLabel,
                        defaultValue: 'This action will complete {{count}} active {{enrollmentLabel}} in your selection.',
                        // eslint-disable-next-line max-len
                        defaultValue_plural: 'This action will complete {{count}} active {{enrollmentsLabel}} in your selection.',
                        enrollmentsLabel,
                    })
                }

                {' '}

                {enrollmentCounts.completed > 0 &&
                    tCustomTerm('{{count}} {{enrollmentLabel}} already marked as completed will not be changed.', {
                        count: enrollmentCounts.completed,
                        enrollmentLabel,
                        defaultValue: '{{count}} {{enrollmentLabel}} already marked as completed will not be changed.',
                        // eslint-disable-next-line max-len
                        defaultValue_plural: '{{count}} {{enrollmentsLabel}} already marked as completed will not be changed.',
                        enrollmentsLabel,
                    })
                }

                <Checkbox
                    label={tCustomTerm('Mark all events within {{enrollmentsLabel}} as complete', { enrollmentsLabel })}
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
                    {tCustomTerm('Complete {{enrollmentsLabel}}', { enrollmentsLabel })}
                </Button>
            </ConditionalTooltip>

            {modalIsOpen && (
                <Modal
                    onClose={() => setModalIsOpen(false)}
                    dataTest={'bulk-complete-enrollments-dialog'}
                >
                    <ModalTitle>
                        {validationError ? tCustomTerm('Error completing {{enrollmentsLabel}}', { enrollmentsLabel })
                            : tCustomTerm('Complete {{enrollmentsLabel}}', { enrollmentsLabel })}
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
                                    content={tCustomTerm('No active {{enrollmentsLabel}} to complete', { enrollmentsLabel })}
                                >
                                    <Button
                                        primary
                                        onClick={() => completeEnrollments({ completeEvents })}
                                        disabled={isLoading || enrollmentCounts?.active === 0}
                                        loading={isCompleting}
                                        dataTest={'bulk-complete-enrollments-confirm-button'}
                                    >
                                        {tCustomTerm('Complete {{count}} {{enrollmentLabel}}', {
                                            count: enrollmentCounts.active,
                                            enrollmentLabel,
                                            defaultValue: 'Complete {{count}} {{enrollmentLabel}}',
                                            defaultValue_plural: 'Complete {{count}} {{enrollmentsLabel}}',
                                            enrollmentsLabel,
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
