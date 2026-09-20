import React, { useMemo, useCallback, useRef } from 'react';
import { FormFieldPluginComponent } from './FormFieldPlugin.component';
import type { ContainerProps } from './FormFieldPlugin.types';
import { usePluginMessages } from './hooks/usePluginMessages';
import { usePluginCallbacks } from './hooks/usePluginCallbacks';
import { usePluginValues } from './hooks/usePluginValues';
import { useFormFieldPluginContext } from './hooks/useFormFieldPluginContext';
import { formatPluginConfig } from './formatPluginConfig';

export const FormFieldPlugin = (props: ContainerProps) => {
    const {
        pluginSource,
        fieldsMetadata,
        formId,
        onUpdateFieldValue,
        customAttributes,
        pluginContext,
        viewMode = false,
    } = props;
    const metadataByPluginId = useMemo(() => Object.fromEntries(fieldsMetadata), [fieldsMetadata]);
    const configuredPluginIds = useMemo(() => Object.keys(metadataByPluginId), [metadataByPluginId]);
    const { orgUnitId, programId, stageId, enrollmentId, eventId, teiId } = useFormFieldPluginContext(pluginContext);

    // Plugin related functionality and feedback
    const { pluginValues, formValuesRedux } = usePluginValues(formId, metadataByPluginId, pluginContext);
    const { errors, warnings, formSubmitted } = usePluginMessages(formId, metadataByPluginId);
    const valuesRef = useRef(formValuesRedux);
    valuesRef.current = formValuesRedux;
    const onUpdateField = useCallback(
        (fieldMetadata, value, options) =>
            onUpdateFieldValue(fieldMetadata, value, valuesRef.current[fieldMetadata.id], options),
        [onUpdateFieldValue, valuesRef],
    );
    const { setFieldValue, setContextFieldValue } = usePluginCallbacks({
        configuredPluginIds,
        onUpdateField,
        metadataByPluginId,
        pluginContext,
    });

    // Remove ids from plugin metadata before passing to plugin
    const formattedMetadata = useMemo(() => {
        const metadata = [...fieldsMetadata.entries()];

        return metadata.reduce((acc, [pluginFieldId, pluginMetadata]) => {
            const formattedPluginMetadata = formatPluginConfig(pluginMetadata, {
                attributes: customAttributes,
                keysToOmit: ['id', 'dataElement', 'section'],
            });
            return { ...acc, [pluginFieldId]: formattedPluginMetadata };
        }, {});
    }, [customAttributes, fieldsMetadata]);

    return (
        <FormFieldPluginComponent
            orgUnitId={orgUnitId}
            programId={programId}
            stageId={stageId}
            enrollmentId={enrollmentId}
            eventId={eventId}
            teiId={teiId}
            pluginSource={pluginSource}
            fieldsMetadata={formattedMetadata}
            values={pluginValues}
            setFieldValue={setFieldValue}
            formSubmitted={formSubmitted}
            setContextFieldValue={setContextFieldValue}
            errors={errors}
            warnings={warnings}
            viewMode={viewMode}
        />
    );
};

