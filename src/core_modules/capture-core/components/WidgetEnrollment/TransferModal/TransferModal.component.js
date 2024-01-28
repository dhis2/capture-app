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

export const TransferModal = ({
    enrollment,
    setOpenTransfer,
    onUpdateOwnership,
}: TransferModalProps) => {
    const [selectedOrgUnit, setSelectedOrgUnit] = useState();

    const onUpdate = (updatedOrgUnitId) => {
        onUpdateOwnership(updatedOrgUnitId);
    };

    return (
        <Modal
            large
            onClose={() => setOpenTransfer(false)}
        >
            <ModalTitle>{i18n.t('Transfer Ownership')}</ModalTitle>
            <ModalContent>
                <div>
                    {i18n.t('Choose the organisation unit to which enrollment ownership should be transferred.')}
                </div>

                <OrgUnitField
                    selected={selectedOrgUnit}
                    onSelectClick={setSelectedOrgUnit}
                />

                {/* Alert */}
            </ModalContent>

            <ModalActions>
                <ButtonStrip end>
                    <Button
                        onClick={() => setOpenTransfer(false)}
                    >
                        {i18n.t('Cancel')}
                    </Button>
                    <Button
                        primary
                        disabled={!selectedOrgUnit}
                        onClick={() => {
                            if (!selectedOrgUnit) return;
                            onUpdate(selectedOrgUnit.id);
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
