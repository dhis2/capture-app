import React from 'react';
import { Button } from '@dhis2/ui';
import i18n from '@dhis2/d2-i18n';
import { DataEntry } from '../../DataEntry';
import { DataEntryModalWrapper } from './DataEntryModalWrapper.component';
import type { PluginContext } from '../../D2Form/FormFieldPlugin/FormFieldPlugin.types';

type Props = {
    dataEntryId: string;
    trackedEntityName: string;
    saveAttempted: boolean;
    formFoundation: any;
    onCancel: () => void;
    onUpdateFormField: (innerAction: any) => void;
    onUpdateFormFieldAsync: (innerAction: any) => void;
    onGetValidationContext: () => Record<string, any>;
    orgUnitId: string;
    pluginContext?: PluginContext;
    accessReadOnly?: boolean;
};

export const DataEntryReadOnlyComponent = ({
    dataEntryId,
    onCancel,
    saveAttempted,
    onUpdateFormField,
    onUpdateFormFieldAsync,
    trackedEntityName,
    formFoundation,
    onGetValidationContext,
    orgUnitId,
    pluginContext,
    accessReadOnly,
}: Props) => (
    <DataEntryModalWrapper
        onClose={onCancel}
        trackedEntityName={trackedEntityName}
        accessReadOnly={accessReadOnly}
        title={i18n.t(
            '{{trackedEntityName}} profile',
            { trackedEntityName, interpolation: { escapeValue: false } },
        )}
        actions={
            <Button onClick={onCancel} secondary>
                {i18n.t('Close')}
            </Button>
        }
    >
        <DataEntry
            id={dataEntryId}
            formFoundation={formFoundation}
            saveAttempted={saveAttempted}
            onUpdateFormField={onUpdateFormField}
            onUpdateFormFieldAsync={onUpdateFormFieldAsync}
            onGetValidationContext={onGetValidationContext}
            orgUnitId={orgUnitId}
            pluginContext={pluginContext}
            viewMode
        />
    </DataEntryModalWrapper>
);
