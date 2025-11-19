import React, { useState } from 'react';
import log from 'loglevel';
import i18n from '@dhis2/d2-i18n';
import { Button, ButtonStrip, Modal, ModalActions, ModalContent, ModalTitle } from '@dhis2/ui';
import { useMutation } from 'react-query';
import { useAlert, useDataEngine } from '@dhis2/app-runtime';
import { errorCreator } from '../../../../../../../capture-core-utils';
import { ConditionalTooltip } from '../../../../../Tooltips/ConditionalTooltip';
import type { Props } from './DeleteAction.types';

const getTooltipContent = (stageDataWriteAccess?: boolean, bulkDataEntryIsActive?: boolean) => {
    if (!stageDataWriteAccess) {
        return i18n.t('You do not have access to delete events');
    }
    if (bulkDataEntryIsActive) {
        return i18n.t('There is a bulk data entry with unsaved changes');
    }
    return '';
};

export const DeleteAction = ({
    selectedRows,
    stageDataWriteAccess,
    bulkDataEntryIsActive,
    onUpdateList,
}: Props) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const dataEngine = useDataEngine();
    const { show: showAlert } = useAlert(
        ({ message }) => message,
        { critical: true },
    );

    const tooltipContent = getTooltipContent(stageDataWriteAccess, bulkDataEntryIsActive);
    const disabled = Boolean(!stageDataWriteAccess || !!bulkDataEntryIsActive);

    const { mutate: deleteEvents, isLoading }: { mutate: any, isLoading: boolean } = useMutation(
        () => dataEngine.mutate({
            resource: 'tracker?async=false&importStrategy=DELETE',
            type: 'create',
            data: {
                events: Object
                    .keys(selectedRows)
                    .map(id => ({ event: id })),
            },
        }),
        {
            onError: (error) => {
                log.error(errorCreator('An error occurred while deleting the events')({ error }));
                showAlert({ message: i18n.t('An error occurred while deleting the events') });
            },
            onSuccess: () => {
                onUpdateList();
                setIsModalOpen(false);
            },
        },
    );

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

            {isModalOpen && (
                <Modal
                    small
                    onClose={() => setIsModalOpen(false)}
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
                                onClick={() => setIsModalOpen(false)}
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
        </>
    );
};
