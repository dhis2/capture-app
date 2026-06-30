import React from 'react';
import { Button, ButtonStrip, Modal, ModalActions, ModalContent, ModalTitle } from '@dhis2/ui';
import i18n from '@dhis2/d2-i18n';
import type { PlainProps } from './completeModal.types';
import { useProgramLabel, useStageLabel } from '../../../../../metaData';

export const CompleteModalComponent = ({
    programStagesWithActiveEvents,
    programStagesWithoutAccess,
    setOpenCompleteModal,
    onCompleteEnrollment,
    onCompleteEnrollmentAndEvents,
}: PlainProps) => {
    const enrollment = useProgramLabel('enrollment') ?? i18n.t('enrollment');
    const event = useStageLabel('event') ?? i18n.t('event');
    const events = useStageLabel('event', { plural: true }) ?? i18n.t('events');

    return (
        <Modal position="middle" large dataTest="widget-enrollment-complete-modal">
            <ModalTitle>{i18n.t('Complete {{enrollment}}', {
                enrollment,
                interpolation: { escapeValue: false },
            })}</ModalTitle>
            <ModalContent>
                <p>{i18n.t('Would you like to complete the {{enrollment}} and all active {{events}} as well?', {
                    enrollment,
                    events,
                    interpolation: { escapeValue: false },
                })}</p>

                {Object.keys(programStagesWithActiveEvents).length !== 0 && (
                    <>
                        {i18n.t('The following {{events}} will be completed:', {
                            events,
                            interpolation: { escapeValue: false },
                        })}
                        {Object.keys(programStagesWithActiveEvents).map((key) => {
                            const { count, name } = programStagesWithActiveEvents[key];
                            return (
                                <ul key={key}>
                                    <li>
                                        {i18n.t('{{count}} {{eventLabel}} in {{programStageName}}', {
                                            count,
                                            eventLabel: count === 1 ? event : events,
                                            defaultValue: '{{count}} {{eventLabel}} in {{programStageName}}',
                                            defaultValue_plural: '{{count}} {{eventLabel}} in {{programStageName}}',
                                            programStageName: name,
                                            interpolation: { escapeValue: false },
                                        })}
                                    </li>
                                </ul>
                            );
                        })}
                    </>
                )}

                {Object.keys(programStagesWithoutAccess).length !== 0 && (
                    <>
                        {i18n.t('The following {{events}} will not be completed due to lack of access:', {
                            events,
                            interpolation: { escapeValue: false },
                        })}
                        {Object.keys(programStagesWithoutAccess).map((key) => {
                            const { count, name } = programStagesWithoutAccess[key];

                            return (
                                <ul key={key}>
                                    <li>
                                        {i18n.t('{{count}} {{eventLabel}} in {{programStageName}}', {
                                            count,
                                            eventLabel: count === 1 ? event : events,
                                            defaultValue: '{{count}} {{eventLabel}} in {{programStageName}}',
                                            defaultValue_plural: '{{count}} {{eventLabel}} in {{programStageName}}',
                                            programStageName: name,
                                            interpolation: { escapeValue: false },
                                        })}
                                    </li>
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
                            {i18n.t('Yes, complete {{enrollment}} and {{events}}', {
                                enrollment,
                                events,
                                interpolation: { escapeValue: false },
                            })}
                        </Button>
                        <Button
                            onClick={() => {
                                setOpenCompleteModal(false);
                                onCompleteEnrollment();
                            }}
                            secondary
                        >
                            {i18n.t('Complete {{enrollment}} only', {
                                enrollment,
                                interpolation: { escapeValue: false },
                            })}
                        </Button>
                        <Button onClick={() => setOpenCompleteModal(false)} secondary>
                            {i18n.t('No, cancel')}
                        </Button>
                    </ButtonStrip>
                </ModalActions>
            </ModalContent>
        </Modal>
    );
};
