import React from 'react';
import { Button, ButtonStrip, Modal, ModalActions, ModalContent, ModalTitle } from '@dhis2/ui';
import i18n from '@dhis2/d2-i18n';
import type { PlainProps } from './completeModal.types';
import { useTermLabel } from '../../../../../metaData';
import { customTerms } from '../../../../../utils/customTerms';

export const CompleteModalComponent = ({
    programStagesWithActiveEvents,
    programStagesWithoutAccess,
    setOpenCompleteModal,
    onCompleteEnrollment,
    onCompleteEnrollmentAndEvents,
}: PlainProps) => {
    const enrollmentLabel = useTermLabel('enrollment');
    const eventLabel = useTermLabel('event');
    const eventsLabel = useTermLabel('event', { plural: true });
    return (
        <Modal position="middle" large dataTest="widget-enrollment-complete-modal">
            <ModalTitle>{customTerms.i18n.t('Complete {{enrollmentLabel}}', { enrollmentLabel })}</ModalTitle>
            <ModalContent>
                <p>{customTerms.i18n.t(
                    'Would you like to complete the {{enrollmentLabel}} and all active {{eventsLabel}} as well?',
                    { enrollmentLabel, eventsLabel },
                )}</p>

                {Object.keys(programStagesWithActiveEvents).length !== 0 && (
                    <>
                        {customTerms.i18n.t('The following {{eventsLabel}} will be completed:', { eventsLabel })}
                        {Object.keys(programStagesWithActiveEvents).map((key) => {
                            const { count, name } = programStagesWithActiveEvents[key];
                            return (
                                <ul key={key}>
                                    <li>
                                        {customTerms.i18n.t('{{count}} {{eventLabel}} in {{programStageName}}', {
                                            count,
                                            eventLabel,
                                            eventsLabel,
                                            programStageName: name,
                                            defaultValue: '{{count}} {{eventLabel}} in {{programStageName}}',
                                            defaultValue_plural: '{{count}} {{eventsLabel}} in {{programStageName}}',
                                        })}
                                    </li>
                                </ul>
                            );
                        })}
                    </>
                )}

                {Object.keys(programStagesWithoutAccess).length !== 0 && (
                    <>
                        {customTerms.i18n.t(
                            'The following {{eventsLabel}} will not be completed due to lack of access:',
                            { eventsLabel },
                        )}
                        {Object.keys(programStagesWithoutAccess).map((key) => {
                            const { count, name } = programStagesWithoutAccess[key];

                            return (
                                <ul key={key}>
                                    <li>
                                        {customTerms.i18n.t('{{count}} {{eventLabel}} in {{programStageName}}', {
                                            count,
                                            eventLabel,
                                            eventsLabel,
                                            programStageName: name,
                                            defaultValue: '{{count}} {{eventLabel}} in {{programStageName}}',
                                            defaultValue_plural: '{{count}} {{eventsLabel}} in {{programStageName}}',
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
                            {customTerms.i18n.t(
                                'Yes, complete {{enrollmentLabel}} and {{eventsLabel}}',
                                { enrollmentLabel, eventsLabel },
                            )}
                        </Button>
                        <Button
                            onClick={() => {
                                setOpenCompleteModal(false);
                                onCompleteEnrollment();
                            }}
                            secondary
                        >
                            {customTerms.i18n.t('Complete {{enrollmentLabel}} only', { enrollmentLabel })}
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
