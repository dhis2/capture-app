// @flow
import React from 'react';
import i18n from '@dhis2/d2-i18n';
import { Modal, ModalContent, ModalTitle, ModalActions, ButtonStrip, Button } from '@dhis2/ui';
import type { Props } from './DeleteModal.types';
import { useDeleteTrackedEntity } from './useDeleteTrackedEntity';

export const DeleteModal = ({ trackedEntityTypeName, trackedEntity, setOpenModal, onDeleteSuccess }: Props) => {
    const { deleteMutation, deleteLoading } = useDeleteTrackedEntity(
        onDeleteSuccess,
        () => console.log('Error Callback'),
    );

    return (
        <Modal>
            <ModalTitle>
                {i18n.t('Delete {{TETName}}', {
                    TETName: trackedEntityTypeName,
                    interpolation: { escapeValue: false },
                })}
            </ModalTitle>
            <ModalContent>
                {i18n.t(
                    'Are you sure you want to delete this {{TETName}}? This will permanently remove the {{TETName}} and all its associated enrollments and events in all programs.',
                    {
                        TETName: trackedEntityTypeName,
                        interpolation: { escapeValue: false },
                    },
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
