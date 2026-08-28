import React, { useState } from 'react';
import i18n from '@dhis2/d2-i18n';
import { Modal, ModalContent, ModalTitle, ModalActions, ButtonStrip, Button, NoticeBox } from '@dhis2/ui';
import { useTermLabel } from '../../../../../metaData';
import { tCustomTerm } from '../../../../../utils/tCustomTerm';
import type { Props } from './DeleteModal.types';
import { useDeleteTrackedEntity } from './hooks';
import type { ErrorReport } from '../../processErrorReports';

export const DeleteModal = ({ trackedEntityTypeName, trackedEntity, setOpenModal, onDeleteSuccess }: Props) => {
    const [errorReports, setErrorReports] = useState<Array<ErrorReport>>([]);
    const enrollmentsLabel = useTermLabel('enrollment', { plural: true });
    const handleErrors = (errors: Array<ErrorReport>) => {
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
                    {/* eslint-disable-next-line max-len */}
                    {tCustomTerm('Are you sure you want to delete this {{trackedEntityTypeName}}? This will permanently remove the {{trackedEntityTypeName}} and all its associated {{enrollmentsLabel}} and events in all programs.',
                        {
                            trackedEntityTypeName,
                            enrollmentsLabel,
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
