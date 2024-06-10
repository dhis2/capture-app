// @flow
import { Modal, ModalActions, ModalContent, ModalTitle, Button, ButtonStrip } from '@dhis2/ui';
import React from 'react';
import i18n from '@dhis2/d2-i18n';
import type { PlainProps, PlainPropsWithEvents } from './completeModal.types';

export const CompleteEnrollmentAndEventsModalComponent = ({
    programStageName,
    programStagesWithActiveEvents,
    programStagesWithoutAccess,
    onCancel,
    onCompleteEnrollmentAndEvents,
    onCompleteEnrollment,
}: PlainPropsWithEvents) => (
    <Modal position="middle" large dataTest="enrollment-complete-modal">
        <ModalTitle>
            {i18n.t('{{programStageName}} completed', {
                programStageName,
                interpolation: { escapeValue: false },
            })}
        </ModalTitle>
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
                    <Button onClick={onCompleteEnrollmentAndEvents} primary>
                        {i18n.t('Yes, complete enrollment and events')}
                    </Button>
                    <Button onClick={onCompleteEnrollment} secondary dataTest="enrollment-actions-complete-button">
                        {i18n.t('Complete enrollment only')}
                    </Button>
                    <Button onClick={onCancel} secondary>
                        {i18n.t('No, cancel')}
                    </Button>
                </ButtonStrip>
            </ModalActions>
        </ModalContent>
    </Modal>
);

export const CompleteEnrollmentModalComponent = ({ programStageName, onCancel, onCompleteEnrollment }: PlainProps) => (
    <Modal position="middle" large>
        <ModalTitle>
            {i18n.t('{{programStageName}} completed', {
                programStageName,
                interpolation: { escapeValue: false },
            })}
        </ModalTitle>
        <ModalContent>
            <p>{i18n.t('Would you like to complete the enrollment?')}</p>
            <ModalActions>
                <ButtonStrip end>
                    <Button onClick={onCompleteEnrollment} primary>
                        {i18n.t('Complete enrollment')}
                    </Button>
                    <Button onClick={onCancel} secondary>
                        {i18n.t('No, cancel')}
                    </Button>
                </ButtonStrip>
            </ModalActions>
        </ModalContent>
    </Modal>
);
