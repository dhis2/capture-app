import React, { useState } from 'react';
import i18n from '@dhis2/d2-i18n';
import { Modal, ModalContent, ModalTitle, ModalActions, ButtonStrip, Button, NoticeBox } from '@dhis2/ui';
import { useDataMutation } from '@dhis2/app-runtime';
import { processErrorReports, type ErrorReport } from '../processErrorReports';

type TrackedEntityForToggle = {
    trackedEntity: string;
    trackedEntityType: string;
    orgUnit: string;
};

type Props = {
    trackedEntity: TrackedEntityForToggle;
    trackedEntityTypeName: string;
    trackedEntityInactive: boolean;
    setOpenModal: (open: boolean) => void;
    onStatusToggleSuccess?: () => void;
};

const trackedEntityUpdate = {
    resource: 'tracker?async=false&importStrategy=UPDATE',
    type: 'create',
    data: (trackedEntity: TrackedEntityForToggle & { inactive: boolean }) => ({
        trackedEntities: [trackedEntity],
    }),
} as const;

export const DeactivateModal = ({
    trackedEntity,
    trackedEntityTypeName,
    trackedEntityInactive,
    setOpenModal,
    onStatusToggleSuccess,
}: Props) => {
    const [errorReports, setErrorReports] = useState<Array<ErrorReport>>([]);
    const [toggleMutation, { loading }] = useDataMutation(trackedEntityUpdate, {
        onComplete: () => {
            onStatusToggleSuccess?.();
            setOpenModal(false);
        },
        onError: (e) => {
            setErrorReports(processErrorReports(e));
        },
    });

    const interp = { trackedEntityTypeName, interpolation: { escapeValue: false } };
    const title = trackedEntityInactive
        ? i18n.t('Activate {{trackedEntityTypeName}}', interp)
        : i18n.t('Deactivate {{trackedEntityTypeName}}', interp);
    const body = trackedEntityInactive
        // eslint-disable-next-line max-len
        ? i18n.t('Are you sure you want to activate this {{trackedEntityTypeName}}? This will change its status to active and write operations will be allowed.', interp)
        // eslint-disable-next-line max-len
        : i18n.t('Are you sure you want to deactivate this {{trackedEntityTypeName}}? This will change its status to inactive and only read operations will be allowed.', interp);
    const confirmLabel = trackedEntityInactive
        ? i18n.t('Yes, activate {{trackedEntityTypeName}}', interp)
        : i18n.t('Yes, deactivate {{trackedEntityTypeName}}', interp);
    const errorTitle = trackedEntityInactive
        ? i18n.t('There was a problem activating the {{trackedEntityTypeName}}', interp)
        : i18n.t('There was a problem deactivating the {{trackedEntityTypeName}}', interp);

    return (
        <Modal dataTest="widget-profile-deactivate-modal" small>
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
                        onClick={() => toggleMutation({ ...trackedEntity, inactive: !trackedEntityInactive })}
                        primary={trackedEntityInactive}
                        destructive={!trackedEntityInactive}
                        loading={loading}
                    >
                        {confirmLabel}
                    </Button>
                </ButtonStrip>
            </ModalActions>
        </Modal>
    );
};
