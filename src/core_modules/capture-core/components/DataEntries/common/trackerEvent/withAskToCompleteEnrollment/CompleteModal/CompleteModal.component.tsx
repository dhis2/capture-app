import { Modal, ModalActions, ModalContent, ModalTitle, Button, ButtonStrip } from '@dhis2/ui';
import React from 'react';
import i18n from '@dhis2/d2-i18n';
import type { PlainProps, PlainPropsWithEvents } from './completeModal.types';
import { useTermLabel } from '../../../../../../metaData';
import { tCustomTerm } from '../../../../../../utils/tCustomTerm';

export const CompleteEnrollmentAndEventsModalComponent = ({
    programStageName,
    programStagesWithActiveEvents,
    programStagesWithoutAccess,
    onCancel,
    onCompleteEnrollmentAndEvents,
    onCompleteEnrollment,
}: PlainPropsWithEvents) => {
    const enrollmentLabel = useTermLabel('enrollment');
    const eventLabel = useTermLabel('event');
    const eventsLabel = useTermLabel('event', { plural: true });
    return (
        <Modal position="middle" large dataTest="enrollment-complete-modal">
            <ModalTitle>
                {i18n.t('{{programStageName}} completed', {
                    programStageName,
                    interpolation: { escapeValue: false },
                })}
            </ModalTitle>
            <ModalContent>
                <p>{tCustomTerm(
                    'Would you like to complete the {{enrollmentLabel}} and all active {{eventsLabel}} as well?',
                    { enrollmentLabel, eventsLabel },
                )}</p>

                {Object.keys(programStagesWithActiveEvents).length !== 0 && (
                    <>
                        {tCustomTerm('The following {{eventsLabel}} will be completed:', { eventsLabel })}
                        {Object.keys(programStagesWithActiveEvents).map((key) => {
                            const { count, name } = programStagesWithActiveEvents[key];
                            return (
                                <ul key={key}>
                                    {tCustomTerm('{{count}} {{eventLabel}} in {{programStageName}}', {
                                        count,
                                        eventLabel,
                                        eventsLabel,
                                        programStageName: name,
                                        defaultValue: '{{count}} {{eventLabel}} in {{programStageName}}',
                                        defaultValue_plural: '{{count}} {{eventsLabel}} in {{programStageName}}',
                                    })}
                                </ul>
                            );
                        })}
                    </>
                )}

                {Object.keys(programStagesWithoutAccess).length !== 0 && (
                    <>
                        {tCustomTerm(
                            'The following {{eventsLabel}} will not be completed due to lack of access:',
                            { eventsLabel },
                        )}
                        {Object.keys(programStagesWithoutAccess).map((key) => {
                            const { count, name } = programStagesWithoutAccess[key];

                            return (
                                <ul key={key}>
                                    {tCustomTerm('{{count}} {{eventLabel}} in {{programStageName}}', {
                                        count,
                                        eventLabel,
                                        eventsLabel,
                                        programStageName: name,
                                        defaultValue: '{{count}} {{eventLabel}} in {{programStageName}}',
                                        defaultValue_plural: '{{count}} {{eventsLabel}} in {{programStageName}}',
                                    })}
                                </ul>
                            );
                        })}
                    </>
                )}

                <ModalActions>
                    <ButtonStrip end>
                        <Button onClick={onCompleteEnrollmentAndEvents} primary>
                            {tCustomTerm(
                                'Yes, complete {{enrollmentLabel}} and {{eventsLabel}}',
                                { enrollmentLabel, eventsLabel },
                            )}
                        </Button>
                        <Button onClick={onCompleteEnrollment} secondary dataTest="enrollment-actions-complete-button">
                            {tCustomTerm('Complete {{enrollmentLabel}} only', { enrollmentLabel })}
                        </Button>
                        <Button onClick={onCancel} secondary>
                            {i18n.t('No, cancel')}
                        </Button>
                    </ButtonStrip>
                </ModalActions>
            </ModalContent>
        </Modal>
    );
};

export const CompleteEnrollmentModalComponent = ({ programStageName, onCancel, onCompleteEnrollment }: PlainProps) => {
    const enrollmentLabel = useTermLabel('enrollment');
    return (
        <Modal position="middle" large>
            <ModalTitle>
                {i18n.t('{{programStageName}} completed', {
                    programStageName,
                    interpolation: { escapeValue: false },
                })}
            </ModalTitle>
            <ModalContent>
                <p>{tCustomTerm('Would you like to complete the {{enrollmentLabel}}?', { enrollmentLabel })}</p>
                <ModalActions>
                    <ButtonStrip end>
                        <Button onClick={onCompleteEnrollment} primary>
                            {tCustomTerm('Complete {{enrollmentLabel}}', { enrollmentLabel })}
                        </Button>
                        <Button onClick={onCancel} secondary>
                            {i18n.t('No, cancel')}
                        </Button>
                    </ButtonStrip>
                </ModalActions>
            </ModalContent>
        </Modal>
    );
};
