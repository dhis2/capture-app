import { Modal, ModalActions, ModalContent, ModalTitle, Button, ButtonStrip } from '@dhis2/ui';
import React from 'react';
import i18n from '@dhis2/d2-i18n';
import type { PlainProps, PlainPropsWithEvents } from './completeModal.types';

export const CompleteEnrollmentAndEventsModalComponent = ({
    programStageName,
    enrollmentLabel,
    eventSingularLabel,
    eventPluralLabel,
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
            <p>
                {i18n.t('Would you like to complete the {{enrollmentLabel}} and all active {{eventPluralLabel}} as well?', {
                    enrollmentLabel,
                    eventPluralLabel,
                    interpolation: { escapeValue: false },
                })}
            </p>

            {Object.keys(programStagesWithActiveEvents).length !== 0 && (
                <>
                    {i18n.t('The following {{eventPluralLabel}} will be completed:', {
                        eventPluralLabel,
                        interpolation: { escapeValue: false },
                    })}
                    {Object.keys(programStagesWithActiveEvents).map((key) => {
                        const { count, name } = programStagesWithActiveEvents[key];
                        const eventLabel = count === 1 ? eventSingularLabel : eventPluralLabel;
                        return (
                            <ul key={key}>
                                {i18n.t('{{count}} {{eventLabel}} in {{programStageName}}', {
                                    count,
                                    eventLabel,
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
                    {i18n.t('The following {{eventPluralLabel}} will not be completed due to lack of access:', {
                        eventPluralLabel,
                        interpolation: { escapeValue: false },
                    })}
                    {Object.keys(programStagesWithoutAccess).map((key) => {
                        const { count, name } = programStagesWithoutAccess[key];
                        const eventLabel = count === 1 ? eventSingularLabel : eventPluralLabel;

                        return (
                            <ul key={key}>
                                {i18n.t('{{count}} {{eventLabel}} in {{programStageName}}', {
                                    count,
                                    eventLabel,
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
                        {i18n.t('Yes, complete {{enrollmentLabel}} and {{eventPluralLabel}}', {
                            enrollmentLabel,
                            eventPluralLabel,
                            interpolation: { escapeValue: false },
                        })}
                    </Button>
                    <Button onClick={onCompleteEnrollment} secondary dataTest="enrollment-actions-complete-button">
                        {i18n.t('Complete {{enrollmentLabel}} only', {
                            enrollmentLabel,
                            interpolation: { escapeValue: false },
                        })}
                    </Button>
                    <Button onClick={onCancel} secondary>
                        {i18n.t('No, cancel')}
                    </Button>
                </ButtonStrip>
            </ModalActions>
        </ModalContent>
    </Modal>
);

export const CompleteEnrollmentModalComponent = ({
    programStageName,
    enrollmentLabel,
    onCancel,
    onCompleteEnrollment,
}: PlainProps) => (
    <Modal position="middle" large>
        <ModalTitle>
            {i18n.t('{{programStageName}} completed', {
                programStageName,
                interpolation: { escapeValue: false },
            })}
        </ModalTitle>
        <ModalContent>
            <p>
                {i18n.t('Would you like to complete the {{enrollmentLabel}}?', {
                    enrollmentLabel,
                    interpolation: { escapeValue: false },
                })}
            </p>
            <ModalActions>
                <ButtonStrip end>
                    <Button onClick={onCompleteEnrollment} primary>
                        {i18n.t('Complete {{enrollmentLabel}}', {
                            enrollmentLabel,
                            interpolation: { escapeValue: false },
                        })}
                    </Button>
                    <Button onClick={onCancel} secondary>
                        {i18n.t('No, cancel')}
                    </Button>
                </ButtonStrip>
            </ModalActions>
        </ModalContent>
    </Modal>
);
