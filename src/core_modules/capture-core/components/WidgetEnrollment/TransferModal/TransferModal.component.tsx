import React from 'react';
import {
    Modal,
    ModalTitle,
    ModalContent,
    ModalActions,
    ButtonStrip,
    Button,
} from '@dhis2/ui';
import i18n from '@dhis2/d2-i18n';
import type { TransferModalProps } from './TransferModal.types';
import { OrgUnitField } from './OrgUnitField/OrgUnitField.container';
import { useTransferValidation } from './hooks/useTransferValidation';
import { InfoBoxes } from './InfoBoxes';

type EnrollmentType = {
    program: string;
    [key: string]: any;
};

export const TransferModal = ({
    enrollment,
    ownerOrgUnitId,
    setOpenTransfer,
    onUpdateOwnership,
    isTransferLoading,
}: TransferModalProps) => {
    const enrollmentWithProgram = enrollment as EnrollmentType;
    const {
        selectedOrgUnit,
        handleOrgUnitChange,
        orgUnitScopes,
        ready,
        programAccessLevel,
    } = useTransferValidation({
        programId: enrollmentWithProgram.program,
        ownerOrgUnitId,
    });

    const handleOnUpdateOwnership = async () => {
        if (!selectedOrgUnit) return;
        await onUpdateOwnership({
            orgUnitId: selectedOrgUnit.id,
            programAccessLevel,
            orgUnitScopes,
        });
        setOpenTransfer(false);
    };

    return (
        <Modal
            large
            onClose={() => setOpenTransfer(false)}
            dataTest={'widget-enrollment-transfer-modal'}
        >
            <ModalTitle>{i18n.t('Transfer Ownership')}</ModalTitle>
            <ModalContent>
                <div>
                    {i18n.t('Choose the organisation unit to which enrollment ownership should be transferred.')}
                </div>

                <OrgUnitField
                    selected={selectedOrgUnit as any}
                    onSelectClick={handleOrgUnitChange}
                />

                {/* Alert */}
                <InfoBoxes
                    ownerOrgUnitId={ownerOrgUnitId}
                    validOrgUnitId={selectedOrgUnit?.id}
                    programAccessLevel={programAccessLevel}
                    orgUnitScopes={orgUnitScopes}
                />
            </ModalContent>

            <ModalActions>
                <ButtonStrip end>
                    <Button onClick={() => setOpenTransfer(false)}>
                        {i18n.t('Cancel')}
                    </Button>
                    <Button
                        dataTest={'widget-enrollment-transfer-button'}
                        primary
                        disabled={!ready || !selectedOrgUnit}
                        loading={isTransferLoading}
                        onClick={handleOnUpdateOwnership}
                    >
                        {i18n.t('Transfer')}
                    </Button>
                </ButtonStrip>
            </ModalActions>
        </Modal>
    );
};
