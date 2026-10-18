import React, { useMemo, useCallback, useRef } from 'react';
import { FormFieldPluginComponent } from './FormFieldPlugin.component';
import type { ContainerProps, FormattedMetadataByPluginId } from './FormFieldPlugin.types';
import { usePluginMessages } from './hooks/usePluginMessages';
import { usePluginCallbacks } from './hooks/usePluginCallbacks';
import { usePluginValues } from './hooks/usePluginValues';
import { useFormFieldPluginContextIds } from './FormFieldPluginContextIds';
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
    const contextIds = useFormFieldPluginContextIds();

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

    // Capture internals, omitted before handing to the plugin:
    // - id/dataElement/section
    // - optionGroups (a Map, which would serialize as {})
    // - onValidate (the unique validator function)
    const formattedMetadata = useMemo<FormattedMetadataByPluginId>(
        () => Object.fromEntries(
            [...fieldsMetadata.entries()].map(([pluginFieldId, pluginMetadata]) => [
                pluginFieldId,
                formatPluginConfig(pluginMetadata, {
                    attributes: customAttributes,
                    keysToOmit: ['id', 'dataElement', 'section', 'optionGroups', 'onValidate'],
                }),
            ]),
        ),
        [customAttributes, fieldsMetadata],
    );

    return (
        <FormFieldPluginComponent
            {...contextIds}
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
