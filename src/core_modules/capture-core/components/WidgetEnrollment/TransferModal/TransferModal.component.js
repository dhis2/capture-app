// @flow

import {
    Modal,
    ModalTitle,
    ModalContent,
    ModalActions,
    ButtonStrip,
    Button,
} from '@dhis2/ui';
import i18n from '@dhis2/d2-i18n';
import React, { useState } from 'react';
import type { TransferModalProps } from './TransferModal.types';
import { OrgUnitField } from './OrgUnitField/OrgUnitField.container';
import { useTransferValidation } from './hooks/useTransferValidation';
import { InfoBoxes } from './InfoBoxes';

export const TransferModal = ({
    enrollment,
    ownerOrgUnitId,
    setOpenTransfer,
    onUpdateOwnership,
}: TransferModalProps) => {
    const [selectedOrgUnit, setSelectedOrgUnit] = useState();
    const {
        validOrgUnit,
        orgUnitScopes,
        programAccessLevel,
    } = useTransferValidation({
        selectedOrgUnit,
        programId: enrollment.program,
        ownerOrgUnitId,
    });

    const handleSelectOrgUnit = (orgUnit) => {
        if (orgUnit.id === selectedOrgUnit?.id) return;
        setSelectedOrgUnit(orgUnit);
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
                    selected={selectedOrgUnit}
                    onSelectClick={handleSelectOrgUnit}
                />

                {/* Alert */}
                <InfoBoxes
                    ownerOrgUnitId={ownerOrgUnitId}
                    validOrgUnitId={validOrgUnit?.id}
                    programAccessLevel={programAccessLevel}
                    orgUnitScopes={orgUnitScopes}
                />
            </ModalContent>

            <ModalActions>
                <ButtonStrip end>
                    <Button
                        onClick={() => setOpenTransfer(false)}
                    >
                        {i18n.t('Cancel')}
                    </Button>
                    <Button
                        dataTest={'widget-enrollment-transfer-button'}
                        primary
                        disabled={!selectedOrgUnit || !validOrgUnit}
                        loading={selectedOrgUnit && validOrgUnit?.id !== selectedOrgUnit?.id}
                        onClick={() => {
                            if (!validOrgUnit) return;
                            onUpdateOwnership({
                                orgUnitId: validOrgUnit.id,
                                programAccessLevel,
                                orgUnitScopes,
                            });
                            setOpenTransfer(false);
                        }}
                    >
                        {i18n.t('Transfer')}
                    </Button>
                </ButtonStrip>
            </ModalActions>
        </Modal>
    );
};
