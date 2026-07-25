import React, { useMemo, useState } from 'react';
import log from 'loglevel';
import i18n from '@dhis2/d2-i18n';
import { Button, ButtonStrip, colors, Modal, ModalActions, ModalContent, ModalTitle } from '@dhis2/ui';
import { useMutation } from '@tanstack/react-query';
import { useAlert, useDataEngine } from '@dhis2/app-runtime';
import { errorCreator } from 'capture-core-utils';
import { withStyles, type WithStyles } from 'capture-core-utils/styles';
import { ConditionalTooltip } from '../../../../../Tooltips/ConditionalTooltip';
import { Widget } from '../../../../../Widget';
import { BulkActionErrorReports } from '../../../../WorkingListsCommon/BulkActionBar/BulkActionErrorReports';
import { useLocationQuery } from '../../../../../../utils/routing';
import type { Props } from './DeleteAction.types';

const styles: Readonly<any> = {
    container: {
        fontSize: '14px',
        lineHeight: '19px',
        color: colors.grey900,
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
    },
};

const getTooltipContent = (stageDataWriteAccess?: boolean, bulkDataEntryIsActive?: boolean) => {
    if (!stageDataWriteAccess) {
        return i18n.t('You do not have access to delete events');
    }
    if (bulkDataEntryIsActive) {
        return i18n.t('There is a bulk data entry with unsaved changes');
    }
    return '';
};

const DeleteActionPlain = ({
    selectedRows,
    stageDataWriteAccess,
    bulkDataEntryIsActive,
    onUpdateList,
    programId,
    classes,
}: Props & WithStyles<typeof styles>) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [openAccordion, setOpenAccordion] = useState(false);
    const dataEngine = useDataEngine();
    const { orgUnitId } = useLocationQuery();
    const { show: showAlert } = useAlert(
        ({ message }) => message,
        { critical: true },
    );

    const tooltipContent = getTooltipContent(stageDataWriteAccess, bulkDataEntryIsActive);
    const disabled = Boolean(!stageDataWriteAccess || !!bulkDataEntryIsActive);

    const {
        mutate: deleteEvents,
        isLoading,
        error: deleteError,
        reset: resetDeleteEvents,
    }: { mutate: any, isLoading: boolean, error: any, reset: () => void } = useMutation(
        () => dataEngine.mutate({
            resource: 'tracker?async=false&importStrategy=DELETE',
            type: 'create',
            data: {
                // TEMP SABOTAGE: replace each event with a valid-format but nonexistent UID so tracker returns per-event errorReports
                events: Object
                    .keys(selectedRows)
                    .map(() => ({ event: 'zzzzzzzzzzz' })),
            },
        }),
        {
            onError: (serverResponse: any) => {
                log.error(errorCreator('An error occurred while deleting the events')({ serverResponse }));
                if (!serverResponse?.details?.validationReport?.errorReports?.length) {
                    showAlert({ message: i18n.t('An error occurred while deleting the events') });
                }
            },
            onSuccess: () => {
                onUpdateList();
                setIsModalOpen(false);
            },
        },
    );

    const validationError = useMemo(() => (
        deleteError?.details?.validationReport?.errorReports?.length
            ? deleteError.details
            : null
    ), [deleteError]);

    const closeModal = () => {
        setIsModalOpen(false);
        resetDeleteEvents();
    };

    return (
        <>
            <ConditionalTooltip
                enabled={disabled}
                content={tooltipContent}
            >
                <Button
                    small
                    onClick={() => setIsModalOpen(true)}
                    disabled={disabled}
                >
                    {i18n.t('Delete')}
                </Button>
            </ConditionalTooltip>

            {isModalOpen && !validationError && (
                <Modal
                    small
                    onClose={closeModal}
                    dataTest={'bulk-delete-events-dialog'}
                >
                    <ModalTitle>
                        {i18n.t('Delete events')}
                    </ModalTitle>

                    <ModalContent>
                        {i18n.t('This cannot be undone.')}
                        {' '}
                        {i18n.t('Are you sure you want to delete the selected events?')}
                    </ModalContent>

                    <ModalActions>
                        <ButtonStrip>
                            <Button
                                secondary
                                onClick={closeModal}
                            >
                                {i18n.t('Cancel')}
                            </Button>
                            <Button
                                destructive
                                onClick={deleteEvents}
                                loading={isLoading}
                            >
                                {i18n.t('Delete')}
                            </Button>
                        </ButtonStrip>
                    </ModalActions>
                </Modal>
            )}

            {isModalOpen && validationError && (
                <Modal
                    small
                    onClose={closeModal}
                    dataTest={'bulk-delete-events-dialog'}
                >
                    <ModalTitle>
                        {i18n.t('Error deleting events')}
                    </ModalTitle>

                    <ModalContent>
                        <span className={classes.container}>
                            {i18n.t('There was an error while deleting the events. Please see the details below.')}

                            <Widget
                                open={openAccordion}
                                onOpen={() => setOpenAccordion(true)}
                                onClose={() => setOpenAccordion(false)}
                                borderless
                                header={i18n.t('Details (Advanced)')}
                            >
                                <BulkActionErrorReports
                                    errorReports={validationError?.validationReport?.errorReports}
                                    programId={programId}
                                    orgUnitId={orgUnitId}
                                />
                            </Widget>
                        </span>
                    </ModalContent>

                    <ModalActions>
                        <ButtonStrip>
                            <Button
                                secondary
                                onClick={closeModal}
                            >
                                {i18n.t('Close')}
                            </Button>
                        </ButtonStrip>
                    </ModalActions>
                </Modal>
            )}
        </>
    );
};

export const DeleteAction = withStyles(styles)(DeleteActionPlain);
