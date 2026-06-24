import React from 'react';
import {
    Modal,
    ModalTitle,
    ModalContent,
    ModalActions,
    ButtonStrip,
    Button,
    NoticeBox,
} from '@dhis2/ui';
import i18n from '@dhis2/d2-i18n';
import { isIsoDateWithinOrgUnitRange } from 'capture-core/utils/validation/validators/form';
import { getOrgUnitLabel } from 'capture-core/utils/orgUnits/getOrgUnitLabel';
import type { TransferModalProps } from './TransferModal.types';
import { OrgUnitField } from './OrgUnitField';
import { useTransferValidation } from './hooks/useTransferValidation';
import { InfoBoxes } from './InfoBoxes';
import { useCoreOrgUnit } from '../../../metadataRetrieval/coreOrgUnit';

export const TransferModal = ({
    enrollment,
    ownerOrgUnitId,
    setOpenTransfer,
    onUpdateOwnership,
    isTransferLoading,
}: TransferModalProps) => {
    const {
        selectedOrgUnit,
        handleOrgUnitChange,
        orgUnitScopes,
        ready,
        programAccessLevel,
    } = useTransferValidation({
        programId: enrollment.program,
        ownerOrgUnitId,
    });

    // The enrollment date must fall within the destination org unit's opening/closing range
    const { orgUnit: destinationOrgUnit } = useCoreOrgUnit(selectedOrgUnit?.id ?? '');
    const enrollmentDateOutsideRange = !!selectedOrgUnit
        && !isIsoDateWithinOrgUnitRange(enrollment.enrolledAt, destinationOrgUnit);
    const orgUnitLabel = getOrgUnitLabel(enrollment.program) || i18n.t('organisation unit');

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
                    selected={selectedOrgUnit}
                    onSelectClick={handleOrgUnitChange}
                />

                <InfoBoxes
                    ownerOrgUnitId={ownerOrgUnitId}
                    validOrgUnitId={selectedOrgUnit?.id}
                    programAccessLevel={programAccessLevel}
                    orgUnitScopes={orgUnitScopes}
                />

                {enrollmentDateOutsideRange && (
                    <NoticeBox
                        error
                        title={i18n.t('Cannot transfer to this {{orgUnitLabel}}', {
                            orgUnitLabel,
                            interpolation: { escapeValue: false },
                        })}
                        dataTest={'transfer-enrollment-date-out-of-range'}
                    >
                        {i18n.t(
                            "The enrollment date is outside the selected {{orgUnitLabel}}'s opening and closing dates.",
                            { orgUnitLabel, interpolation: { escapeValue: false } },
                        )}
                    </NoticeBox>
                )}
            </ModalContent>

            <ModalActions>
                <ButtonStrip end>
                    <Button onClick={() => setOpenTransfer(false)}>
                        {i18n.t('Cancel')}
                    </Button>

                    <Button
                        dataTest={'widget-enrollment-transfer-button'}
                        primary
                        disabled={!ready || !selectedOrgUnit || enrollmentDateOutsideRange}
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
