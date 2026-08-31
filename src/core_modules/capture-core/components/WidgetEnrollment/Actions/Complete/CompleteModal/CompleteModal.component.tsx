import React from 'react';
import { Button, ButtonStrip, Modal, ModalActions, ModalContent, ModalTitle } from '@dhis2/ui';
import i18n from '@dhis2/d2-i18n';
import type { PlainProps } from './completeModal.types';
import { useTermLabel } from '../../../../../metaData';
import { tCustomTerm } from '../../../../../utils/tCustomTerm';

export const CompleteModalComponent = ({
    programStagesWithActiveEvents,
    programStagesWithoutAccess,
    setOpenCompleteModal,
    onCompleteEnrollment,
    onCompleteEnrollmentAndEvents,
}: PlainProps) => {
    const enrollmentLabel = useTermLabel('enrollment');
    return (
        <Modal position="middle" large dataTest="widget-enrollment-complete-modal">
            <ModalTitle>{tCustomTerm('Complete {{enrollmentLabel}}', { enrollmentLabel })}</ModalTitle>
            <ModalContent>
                <p>{tCustomTerm(
                    'Would you like to complete the {{enrollmentLabel}} and all active events as well?',
                    { enrollmentLabel },
                )}</p>

                {Object.keys(programStagesWithActiveEvents).length !== 0 && (
                    <>
                        {i18n.t('The following events will be completed:')}
                        {Object.keys(programStagesWithActiveEvents).map((key) => {
                            const { count, name } = programStagesWithActiveEvents[key];
                            return (
                                <ul key={key}>
                                    <li>
                                        {i18n.t('{{count}} event in {{programStageName}}', {
                                            count,
                                            defaultValue: '{{count}} event in {{programStageName}}',
                                            defaultValue_plural: '{{count}} events in {{programStageName}}',
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
                        {i18n.t('The following events will not be completed due to lack of access:')}
                        {Object.keys(programStagesWithoutAccess).map((key) => {
                            const { count, name } = programStagesWithoutAccess[key];

                            return (
                                <ul key={key}>
                                    <li>
                                        {i18n.t('{{count}} event in {{programStageName}}', {
                                            count,
                                            defaultValue: '{{count}} event in {{programStageName}}',
                                            defaultValue_plural: '{{count}} events in {{programStageName}}',
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
                            {tCustomTerm('Yes, complete {{enrollmentLabel}} and events', { enrollmentLabel })}
                        </Button>
                        <Button
                            onClick={() => {
                                setOpenCompleteModal(false);
                                onCompleteEnrollment();
                            }}
                            secondary
                        >
                            {tCustomTerm('Complete {{enrollmentLabel}} only', { enrollmentLabel })}
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
