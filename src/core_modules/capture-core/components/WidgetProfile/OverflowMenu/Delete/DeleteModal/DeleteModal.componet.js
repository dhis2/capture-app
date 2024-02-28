// @flow
import React, { useState } from 'react';
import i18n from '@dhis2/d2-i18n';
import { Modal, ModalContent, ModalTitle, ModalActions, ButtonStrip, Button, NoticeBox } from '@dhis2/ui';
import type { Props } from './DeleteModal.types';
import { useDeleteTrackedEntity } from './useDeleteTrackedEntity';

export const DeleteModal = ({ trackedEntityTypeName, trackedEntity, setOpenModal, onDeleteSuccess }: Props) => {
    const [errorReports, setErrorReports] = useState([]);
    const handleErrors = (errors) => {
        setErrorReports(errors);
    };
    const { deleteMutation, deleteLoading } = useDeleteTrackedEntity(onDeleteSuccess, handleErrors);

    return (
        <Modal>
            <ModalTitle>
                {i18n.t('Delete {{TETName}}', {
                    TETName: trackedEntityTypeName,
                    interpolation: { escapeValue: false },
                })}
            </ModalTitle>
            <ModalContent>
                <p>
                    {i18n.t(
                        'Are you sure you want to delete this {{TETName}}? This will permanently remove the {{TETName}} and all its associated enrollments and events in all programs.',
                        {
                            TETName: trackedEntityTypeName,
                            interpolation: { escapeValue: false },
                        },
                    )}
                </p>
                {errorReports.length > 0 && (
                    <NoticeBox
                        title={i18n.t('There was a problem deleting the {{TETName}}', {
                            TETName: trackedEntityTypeName,
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
                    <Button onClick={() => deleteMutation(trackedEntity)} primary loading={deleteLoading}>
                        {i18n.t('Yes, delete {{TETName}}', {
                            TETName: trackedEntityTypeName,
                            interpolation: { escapeValue: false },
                        })}
                    </Button>
                </ButtonStrip>
            </ModalActions>
        </Modal>
    );
};
