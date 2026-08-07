import React from 'react';
import i18n from '@dhis2/d2-i18n';
import { Button, ButtonStrip, Modal, ModalActions, ModalContent, ModalTitle } from '@dhis2/ui';
import { BulkActionErrorDetails } from '../BulkActionErrorDetails';
import type { ErrorReport, ErrorReportHrefResolver } from '../types';

type Props = {
    title: string;
    introText: string;
    errorReports?: ErrorReport[];
    getRecordHref?: ErrorReportHrefResolver;
    onClose: () => void;
    dataTest?: string;
};

export const BulkActionErrorModal = ({
    title,
    introText,
    errorReports,
    getRecordHref,
    onClose,
    dataTest,
}: Props) => (
    <Modal
        small
        onClose={onClose}
        dataTest={dataTest}
    >
        <ModalTitle>{title}</ModalTitle>
        <ModalContent>
            <BulkActionErrorDetails
                introText={introText}
                errorReports={errorReports}
                getRecordHref={getRecordHref}
            />
        </ModalContent>
        <ModalActions>
            <ButtonStrip>
                <Button
                    secondary
                    onClick={onClose}
                >
                    {i18n.t('Close')}
                </Button>
            </ButtonStrip>
        </ModalActions>
    </Modal>
);
