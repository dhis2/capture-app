// @flow
import React, { useState } from 'react';
import i18n from '@dhis2/d2-i18n';
import {
    Button,
    ButtonStrip,
    Modal,
    ModalActions,
    ModalContent,
    ModalTitle,
    NoticeBox,
} from '@dhis2/ui';
import { useDataEngine } from '@dhis2/app-runtime';
import type { Props } from './UnlinkAndDeleteModal.types';

export const UnlinkAndDeleteModal = ({
    setOpenModal,
    eventId,
    setUpdateData,
}: Props) => {
    const [errorReports, setErrorReports] = useState([]);
    const [loading, setLoading] = useState(false);
    const dataEngine = useDataEngine();

    const handleDelete = async () => {
        setLoading(true);
        setErrorReports([]);
        setUpdateData(true);

        try {
            const mutation = {
                resource: '/tracker?async=false&importStrategy=DELETE',
                type: 'create',
                data: { events: [{ event: eventId }] },
            };

            await dataEngine.mutate(mutation);
            setOpenModal(false);
        } catch (error) {
            const messages = error.details?.response?.errorReports?.map(report => report.message) || [
                error.message,
            ];
            setErrorReports(messages);
        } finally {
            setLoading(false);
            setUpdateData(false);
        }
    };

    return (
        <Modal dataTest="event-unlink-and-delete-modal" position="middle">
            <ModalTitle>{i18n.t('Delete event')}</ModalTitle>
            <ModalContent>
                <p>
                    {i18n.t(
                        'Are you sure you want to unlink and delete the event? This will permanently remove the event and all related data.',
                    )}
                </p>
                {errorReports.length > 0 && (
                    <NoticeBox
                        title={i18n.t('There was a problem unlinking and deleting the event')}
                        error
                    >
                        <ul>
                            {errorReports.map((message, index) => (
                                // eslint-disable-next-line react/no-array-index-key
                                <li key={index}>{message}</li>
                            ))}
                        </ul>
                    </NoticeBox>
                )}
            </ModalContent>
            <ModalActions>
                <ButtonStrip end>
                    <Button onClick={() => setOpenModal(false)} secondary disabled={loading}>
                        {i18n.t('No, cancel')}
                    </Button>
                    <Button destructive onClick={handleDelete} disabled={loading}>
                        {i18n.t('Yes, unlink and delete event')}
                    </Button>
                </ButtonStrip>
            </ModalActions>
        </Modal>
    );
};
