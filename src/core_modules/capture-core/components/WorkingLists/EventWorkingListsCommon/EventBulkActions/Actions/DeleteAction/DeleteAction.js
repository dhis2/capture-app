// @flow

import React, { useState } from 'react';
import log from 'loglevel';
import i18n from '@dhis2/d2-i18n';
import { Button, ButtonStrip, Modal, ModalActions, ModalContent, ModalTitle } from '@dhis2/ui';
import { useMutation } from 'react-query';
import { useAlert, useDataEngine } from '@dhis2/app-runtime';
import { errorCreator } from '../../../../../../../capture-core-utils';
import { ConditionalTooltip } from '../../../../../Tooltips/ConditionalTooltip';

type Props = {
    selectedRows: { [id: string]: boolean },
    disabled?: boolean,
    onUpdateList: () => void,
}

export const DeleteAction = ({
    selectedRows,
    disabled,
    onUpdateList,
}: Props) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const dataEngine = useDataEngine();
    const { show: showAlert } = useAlert(
        ({ message }) => message,
        { critical: true },
    );

    const { mutate: deleteEvents, isLoading } = useMutation(
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
                content={i18n.t('You do not have access to delete events')}
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
                        {i18n.t('This cannot be undone. Are you sure you want to delete the selected events?')}
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
