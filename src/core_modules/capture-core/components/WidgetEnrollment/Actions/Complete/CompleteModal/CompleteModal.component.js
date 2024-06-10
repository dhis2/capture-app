// @flow
import { Modal, ModalActions, ModalContent, ModalTitle, Button, ButtonStrip } from '@dhis2/ui';
import React from 'react';
import i18n from '@dhis2/d2-i18n';
import type { PlainProps } from './completeModal.types';

export const CompleteModalComponent = ({
    programStagesWithActiveEvents,
    programStagesWithoutAccess,
    setOpenCompleteModal,
    onCompleteEnrollment,
    onCompleteEnrollmentAndEvents,
}: PlainProps) => (
    <Modal position="middle" large dataTest="widget-enrollment-complete-modal">
        <ModalTitle>{i18n.t('Complete enrollment')}</ModalTitle>
        <ModalContent>
            <p>{i18n.t('Would you like to complete the enrollment and all active events as well?')}</p>

            {Object.keys(programStagesWithActiveEvents).length !== 0 && (
                <>
                    {i18n.t('The following events will be completed:')}
                    {Object.keys(programStagesWithActiveEvents).map((key) => {
                        const { count, name } = programStagesWithActiveEvents[key];
                        return (
                            <ul key={key}>
                                {i18n.t('{{count}} event in {{programStageName}}', {
                                    count,
                                    defaultValue: '{{count}} event in {{programStageName}}',
                                    defaultValue_plural: '{{count}} events in {{programStageName}}',
                                    programStageName: name,
                                    interpolation: { escapeValue: false },
                                })}
                            </ul>
                        );
                    })}
                </>
            )}

            {Object.keys(programStagesWithoutAccess).length !== 0 && (
                <>
                    {i18n.t('The following events will not be completed due to lack of access:')}
                    {Object.keys(programStagesWithoutAccess).map((key) => {
                        const { count, name } = programStagesWithoutAccess[key];

                        return (
                            <ul key={key}>
                                {i18n.t('{{count}} event in {{programStageName}}', {
                                    count,
                                    defaultValue: '{{count}} event in {{programStageName}}',
                                    defaultValue_plural: '{{count}} events in {{programStageName}}',
                                    programStageName: name,
                                    interpolation: { escapeValue: false },
                                })}
                            </ul>
                        );
                    })}
                </>
            )}

            <ModalActions>
                <ButtonStrip end>
                    <Button
                        onClick={() => {
                            setOpenCompleteModal(false);
                            onCompleteEnrollmentAndEvents();
                        }}
                        primary
                        dataTest="widget-enrollment-actions-complete-button"
                    >
                        {i18n.t('Yes, complete enrollment and events')}
                    </Button>
                    <Button
                        onClick={() => {
                            setOpenCompleteModal(false);
                            onCompleteEnrollment();
                        }}
                        secondary
                    >
                        {i18n.t('Complete enrollment only')}
                    </Button>
                    <Button onClick={() => setOpenCompleteModal(false)} secondary>
                        {i18n.t('No, cancel')}
                    </Button>
                </ButtonStrip>
            </ModalActions>
        </ModalContent>
    </Modal>
);
