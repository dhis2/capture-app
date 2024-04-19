// @flow
import React from 'react';
import { Modal, ModalTitle, ModalContent, ModalActions, ButtonStrip, Button } from '@dhis2/ui';
import i18n from '@dhis2/d2-i18n';
import { NoticeBoxes } from './NoticeBoxes.container';
import type { PlainProps } from './dataEntry.types';
import { DataEntry } from '../../DataEntry';
import { TEI_MODAL_STATE } from './dataEntry.actions';

export const DataEntryComponent = ({
    dataEntryId,
    itemId,
    onCancel,
    onSave,
    saveAttempted,
    onUpdateFormField,
    onUpdateFormFieldAsync,
    trackedEntityName,
    formFoundation,
    modalState,
    onGetValidationContext,
    errorsMessages,
    warningsMessages,
    orgUnit,
}: PlainProps) => (
    <Modal large onClose={onCancel} dataTest="modal-edit-profile">
        <ModalTitle>{i18n.t(`Edit ${trackedEntityName}`)}</ModalTitle>
        <ModalContent>
            {i18n.t(
                'Change information about this {{trackedEntityName}} here. To change information about this enrollment, use the Edit button in the in the Enrollment box on this dashboard',
                { trackedEntityName, interpolation: { escapeValue: false } },
            )}
            <DataEntry
                id={dataEntryId}
                formFoundation={formFoundation}
                saveAttempted={saveAttempted}
                onUpdateFormField={onUpdateFormField}
                onUpdateFormFieldAsync={onUpdateFormFieldAsync}
                onGetValidationContext={onGetValidationContext}
                orgUnit={orgUnit}
            />
            <NoticeBoxes
                dataEntryId={dataEntryId}
                itemId={itemId}
                saveAttempted={saveAttempted}
                errorsMessages={errorsMessages}
                warningsMessages={warningsMessages}
                hasApiError={modalState === TEI_MODAL_STATE.OPEN_ERROR}
            />
        </ModalContent>
        <ModalActions>
            <ButtonStrip end>
                <Button onClick={onCancel} secondary>
                    {i18n.t('Cancel without saving')}
                </Button>
                {modalState === TEI_MODAL_STATE.OPEN_DISABLE && (
                    <Button loading primary>
                        {i18n.t(' Loading...')}
                    </Button>
                )}

                {(modalState === TEI_MODAL_STATE.OPEN || modalState === TEI_MODAL_STATE.OPEN_ERROR) && (
                    <Button onClick={onSave} primary>
                        {i18n.t('Save changes')}
                    </Button>
                )}
            </ButtonStrip>
        </ModalActions>
    </Modal>
);
