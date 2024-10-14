// @flow
import React from 'react';
import i18n from '@dhis2/d2-i18n';
import { Modal, ModalContent, ModalTitle, ModalActions, ButtonStrip, Button } from '@dhis2/ui';
import type { Props } from './UnlinkAndDeleteModal.types';

export const UnlinkModal = ({ trackedEntityTypeName, setOpenModal }: Props) =>
// const [errorReports, setErrorReports] = useState([]);


    (
        <Modal dataTest="event-unlink--modal">
            <ModalTitle>
                {i18n.t('Delete event', {
                    trackedEntityTypeName,
                    interpolation: { escapeValue: false },
                })}
            </ModalTitle>
            <ModalContent>
                <p>
                    {i18n.t(
                        'Are you sure you want to unlink the event?',
                    )}
                </p>
                {/* {errorReports.length > 0 && (
                    <NoticeBox
                        title={i18n.t('There was a problem unliking the event')}
                        error
                    >
                        <ul>
                            {errorReports.map(content => (
                                <li key={content.uid}>{content.message}</li>
                            ))}
                        </ul>
                    </NoticeBox>
                )} */}
            </ModalContent>
            <ModalActions>
                <ButtonStrip end>
                    <Button onClick={() => setOpenModal(false)} secondary>
                        {i18n.t('No, cancel')}
                    </Button>
                    <Button destructive>
                        {i18n.t('Yes, unlink event')}
                    </Button>
                </ButtonStrip>
            </ModalActions>
        </Modal>
    )
;
