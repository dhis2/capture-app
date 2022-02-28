// @flow
import React from 'react';
import { Modal, ModalTitle, ModalContent, ModalActions, ButtonStrip, Button } from '@dhis2/ui';
import i18n from '@dhis2/d2-i18n';
import { NoticeBoxes } from './NoticeBoxes.container';
import type { PlainProps } from './dataEntry.types';
import { DataEntry } from '../../DataEntry';

export const DataEntryComponent = ({
    dataEntryId,
    itemId,
    onCancel,
    onSave,
    saveAttempted,
    onUpdateFormField,
    trackedEntityName,
    formFoundation,
    onGetValidationContext,
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
                onUpdateFormField={onUpdateFormField}
                saveAttempted={saveAttempted}
                onGetValidationContext={onGetValidationContext}
            />
            <NoticeBoxes dataEntryId={dataEntryId} itemId={itemId} saveAttempted={saveAttempted} />
        </ModalContent>
        <ModalActions>
            <ButtonStrip end>
                <Button onClick={onCancel} secondary>
                    {i18n.t('Cancel without saving')}
                </Button>
                <Button onClick={onSave} primary>
                    {i18n.t('Save changes')}
                </Button>
            </ButtonStrip>
        </ModalActions>
    </Modal>
);
