import React, { useState } from 'react';
import i18n from '@dhis2/d2-i18n';
import { Modal, ModalContent, ModalTitle, ModalActions, ButtonStrip, Button, NoticeBox } from '@dhis2/ui';
import type { Props } from './StatusToggleModal.types';
import { useToggleTrackedEntityStatus } from './hooks';

export const StatusToggleModal = ({
    trackedEntityTypeName,
    trackedEntity,
    isInactive,
    setOpenModal,
    onStatusToggleSuccess,
}: Props) => {
    const [errorReports, setErrorReports] = useState<Array<{ message: string; uid: string }>>([]);
    const handleErrors = (errors: Array<{ message: string; uid: string }>) => {
        setErrorReports(errors);
    };

    const handleSuccess = () => {
        onStatusToggleSuccess && onStatusToggleSuccess();
        setOpenModal(false);
    };

    const { toggleMutation, toggleLoading } = useToggleTrackedEntityStatus(handleSuccess, handleErrors);

    const nextInactive = !isInactive;

    const title = isInactive
        ? i18n.t('Activate {{trackedEntityTypeName}}', {
            trackedEntityTypeName,
            interpolation: { escapeValue: false },
        })
        : i18n.t('Deactivate {{trackedEntityTypeName}}', {
            trackedEntityTypeName,
            interpolation: { escapeValue: false },
        });

    const body = isInactive
        // eslint-disable-next-line max-len
        ? i18n.t('Are you sure you want to activate this {{trackedEntityTypeName}}? This will change its status to active and write operations will be allowed.', {
            trackedEntityTypeName,
            interpolation: { escapeValue: false },
        })
        // eslint-disable-next-line max-len
        : i18n.t('Are you sure you want to deactivate this {{trackedEntityTypeName}}? This will change its status to inactive and only read operations will be allowed.', {
            trackedEntityTypeName,
            interpolation: { escapeValue: false },
        });

    const confirmLabel = isInactive
        ? i18n.t('Yes, activate {{trackedEntityTypeName}}', {
            trackedEntityTypeName,
            interpolation: { escapeValue: false },
        })
        : i18n.t('Yes, deactivate {{trackedEntityTypeName}}', {
            trackedEntityTypeName,
            interpolation: { escapeValue: false },
        });

    const errorTitle = isInactive
        ? i18n.t('There was a problem activating the {{trackedEntityTypeName}}', {
            trackedEntityTypeName,
            interpolation: { escapeValue: false },
        })
        : i18n.t('There was a problem deactivating the {{trackedEntityTypeName}}', {
            trackedEntityTypeName,
            interpolation: { escapeValue: false },
        });

    return (
        <Modal small dataTest="widget-profile-status-toggle-modal">
            <ModalTitle>{title}</ModalTitle>
            <ModalContent>
                <p>{body}</p>
                {errorReports.length > 0 && (
                    <NoticeBox title={errorTitle} error>
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
                    <Button
                        onClick={() => toggleMutation({ trackedEntity, nextInactive })}
                        primary
                        loading={toggleLoading}
                        destructive={!isInactive}
                    >
                        {confirmLabel}
                    </Button>
                </ButtonStrip>
            </ModalActions>
        </Modal>
    );
};
