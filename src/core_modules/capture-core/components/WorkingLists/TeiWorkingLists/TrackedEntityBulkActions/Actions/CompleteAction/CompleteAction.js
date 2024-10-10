// @flow

import i18n from '@dhis2/d2-i18n';
import { withStyles } from '@material-ui/core';
import React, { type ComponentType, useState } from 'react';
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

type Props = {
    selectedRows: { [id: string]: any },
    programId: string,
    onUpdateList: (disableClearSelections?: boolean) => void,
    removeRowsFromSelection: (rows: Array<string>) => void,
};

const styles = {
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

const CompleteActionPlain = ({
    selectedRows,
    programId,
    onUpdateList,
    removeRowsFromSelection,
    classes,
}) => {
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [completeEvents, setCompleteEvents] = useState(true);
    const [openAccordion, setOpenAccordion] = useState(false);
    const {
        completeEnrollments,
        enrollmentCounts,
        isLoading,
        validationError,
        isCompleting,
        hasPartiallyUploadedEnrollments,
    } = useCompleteBulkEnrollments({
        selectedRows,
        programId,
        modalIsOpen,
        onUpdateList,
        removeRowsFromSelection,
    });

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
            const errors = (validationError: any)?.details?.validationReport?.errorReports;
            return (
                <div className={classes.container}>
                    <span>
                        {hasPartiallyUploadedEnrollments ?
                            i18n.t('Some enrollments were completed successfully, but there was an error while completing the rest. Please see the details below.') :
                            i18n.t('There was an error while completing the enrollments. Please see the details below.')
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

        // If there are no active enrollments, show a message and disable the complete button
        if (enrollmentCounts.active === 0) {
            return (
                <div className={classes.container}>
                    {i18n.t('There are currently no active enrollments in the selection. All enrollments are already completed or cancelled.')}
                </div>
            );
        }

        // If there are active enrollments, show a message with the number of active enrollments
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
            <Button
                small
                onClick={() => setModalIsOpen(true)}
            >
                {i18n.t('Complete enrollments')}
            </Button>

            {modalIsOpen && (
                <Modal
                    onClose={() => setModalIsOpen(false)}
                    loading={isLoading}
                >
                    <ModalTitle>
                        {validationError ? i18n.t('Error completing enrollments')
                            : i18n.t('Complete selected enrollments')}
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
                                    content={i18n.t('No active enrollments to complete')}
                                >
                                    <Button
                                        primary
                                        onClick={() => completeEnrollments({ completeEvents })}
                                        disabled={isLoading || enrollmentCounts?.active === 0}
                                        loading={isCompleting}
                                    >
                                        {i18n.t('Complete {{count}} enrollment', {
                                            count: enrollmentCounts.active,
                                            defaultValue: 'Complete {{count}} enrollment',
                                            defaultValue_plural: 'Complete {{count}} enrollments',
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

export const CompleteAction: ComponentType<$Diff<Props, CssClasses>> = withStyles(styles)(CompleteActionPlain);
