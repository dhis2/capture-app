// @flow
import React, { useState } from 'react';
import i18n from '@dhis2/d2-i18n';
import { Modal, ModalContent, ModalTitle, ModalActions, ButtonStrip, Button, NoticeBox } from '@dhis2/ui';
import type { Props } from './DeleteModal.types';
import { useDeleteTrackedEntity } from './hooks';

export const DeleteModal = ({ trackedEntityTypeName, trackedEntity, setOpenModal, onDeleteSuccess }: Props) => {
    const [errorReports, setErrorReports] = useState([]);
    const handleErrors = (errors) => {
        setErrorReports(errors);
    };
    const { deleteMutation, deleteLoading } = useDeleteTrackedEntity(onDeleteSuccess, handleErrors);

    return (
        <Modal dataTest="widget-profile-delete-modal">
            <ModalTitle>
                {i18n.t('Delete {{trackedEntityTypeName}}', {
                    trackedEntityTypeName,
                    interpolation: { escapeValue: false },
                })}
            </ModalTitle>
            <ModalContent>
                <p>
                    {i18n.t(
                        'Are you sure you want to delete this {{trackedEntityTypeName}}? This will permanently remove the {{trackedEntityTypeName}} and all its associated enrollments and events in all programs.',
                        {
                            trackedEntityTypeName,
                            interpolation: { escapeValue: false },
                        },
                    )}
                </p>
                {errorReports.length > 0 && (
                    <NoticeBox
                        title={i18n.t('There was a problem deleting the {{trackedEntityTypeName}}', {
                            trackedEntityTypeName,
                            interpolation: { escapeValue: false },
                        })}
                        error
                    >
                        <ul>
                            {errorReports.map(content => (
                                <li key={content.uid}>{content.message}</li>
                            ))}
                        </ul>
                    </NoticeBox>
                )}
            </ModalContent>
            <ModalActions>
                <ButtonStrip end>
                    <Button onClick={() => setOpenModal(false)} secondary>
                        {i18n.t('No, cancel')}
                    </Button>
                    <Button onClick={() => deleteMutation(trackedEntity)} primary loading={deleteLoading} destructive>
                        {i18n.t('Yes, delete {{trackedEntityTypeName}}', {
                            trackedEntityTypeName,
                            interpolation: { escapeValue: false },
                        })}
                    </Button>
                </ButtonStrip>
            </ModalActions>
        </Modal>
    );
};
