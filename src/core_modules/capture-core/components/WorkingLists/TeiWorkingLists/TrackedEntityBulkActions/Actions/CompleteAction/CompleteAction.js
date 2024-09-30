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
    onUpdateList: () => void,
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
};

const CompleteActionPlain = ({ selectedRows, programId, onUpdateList, classes }) => {
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [completeEvents, setCompleteEvents] = useState(true);
    const [openAccordion, setOpenAccordion] = useState(false);
    const {
        enrollmentCounts,
        completeEnrollments,
        isLoading,
        error,
        isCompletingEnrollments,
    } = useCompleteBulkEnrollments({
        selectedRows,
        programId,
        modalIsOpen,
        setModalIsOpen,
        onUpdateList,
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
        if (error) {
            return (
                <div className={classes.container}>
                    <span>
                        {i18n.t('An error occurred while completing the enrollments.')}
                    </span>

                    <Widget
                        open={openAccordion}
                        onOpen={() => setOpenAccordion(true)}
                        onClose={() => setOpenAccordion(false)}
                        borderless
                        header={i18n.t('Advanced information')}
                    >
                        <span style={{ padding: '0px 20px' }}>
                            <ul>
                                {error.details.validationReport.errorReports.map((errorReport, index) => (
                                    <li key={index}>
                                        {errorReport.message}
                                    </li>
                                ))}
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
                    {' '}
                    {enrollmentCounts?.completed > 0}
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
                        {i18n.t('Complete selected enrollments')}
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

                            {!error && (
                                <ConditionalTooltip
                                    enabled={enrollmentCounts?.active === 0}
                                    content={i18n.t('No active enrollments to complete')}
                                >
                                    <Button
                                        primary
                                        onClick={() => completeEnrollments({ completeEvents })}
                                        disabled={isLoading || enrollmentCounts?.active === 0}
                                        loading={isCompletingEnrollments}
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
