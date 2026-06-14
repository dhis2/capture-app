import React from 'react';
import { Button } from '@dhis2/ui';
import i18n from '@dhis2/d2-i18n';
import { NoticeBoxes } from './NoticeBoxes.container';
import type { PlainProps } from './dataEntry.types';
import { DataEntry } from '../../DataEntry';
import { DataEntryModalWrapper } from './DataEntryModalWrapper.component';
import { TEI_MODAL_STATE } from './dataEntry.actions';
import { useProgramLabel } from '../../../metaData';

export const DataEntryComponent = ({
    dataEntryId,
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
    orgUnitId,
    pluginContext,
    accessReadOnly,
}: PlainProps) => {
    const enrollmentLower = useProgramLabel('enrollment') ?? i18n.t('enrollment');
    const enrollmentTitle = useProgramLabel('enrollment') ?? i18n.t('Enrollment');

    return (
        <DataEntryModalWrapper
            onClose={onCancel}
            trackedEntityName={trackedEntityName}
            accessReadOnly={accessReadOnly}
            title={i18n.t('Edit {{trackedEntityName}}', { trackedEntityName, interpolation: { escapeValue: false } })}
            actions={
                <>
                    <Button onClick={onCancel} secondary>
                        {i18n.t('Cancel without saving')}
                    </Button>
                    {modalState === TEI_MODAL_STATE.OPEN_DISABLE && (
                        <Button loading primary>
                            {i18n.t('Loading...')}
                        </Button>
                    )}
                    {(modalState === TEI_MODAL_STATE.OPEN || modalState === TEI_MODAL_STATE.OPEN_ERROR) && (
                        <Button onClick={onSave} primary>
                            {i18n.t('Save changes')}
                        </Button>
                    )}
                </>
            }
        >
            {i18n.t(
                'Change information about this {{trackedEntityName}} here.',
                { trackedEntityName, interpolation: { escapeValue: false } },
            )}
            {' '}
            {i18n.t('Information about this {{enrollment}} can be edited in the {{Enrollment}} widget.', {
                enrollment: enrollmentLower,
                Enrollment: enrollmentTitle,
                interpolation: { escapeValue: false },
            })}
            <DataEntry
                id={dataEntryId}
                formFoundation={formFoundation}
                saveAttempted={saveAttempted}
                onUpdateFormField={onUpdateFormField}
                onUpdateFormFieldAsync={onUpdateFormFieldAsync}
                onGetValidationContext={onGetValidationContext}
                orgUnitId={orgUnitId}
                pluginContext={pluginContext}
            />
            <NoticeBoxes
                errorsMessages={errorsMessages}
                warningsMessages={warningsMessages}
                hasApiError={modalState === TEI_MODAL_STATE.OPEN_ERROR}
            />
        </DataEntryModalWrapper>
    );
};
