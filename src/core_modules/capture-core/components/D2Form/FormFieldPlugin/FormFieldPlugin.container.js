// @flow
import React, { useMemo } from 'react';
import { FormFieldPluginComponent } from './FormFieldPlugin.component';
import type { ContainerProps } from './FormFieldPlugin.types';
import { usePluginMessages } from './hooks/usePluginMessages';
import { usePluginCallbacks } from './hooks/usePluginCallbacks';
import { usePluginValues } from './hooks/usePluginValues';
import { formatPluginConfig } from './formatPluginConfig';
import { useLocationQuery } from '../../../utils/routing';

export const FormFieldPlugin = (props: ContainerProps) => {
    const {
        pluginSource,
        fieldsMetadata,
        formId,
        onUpdateField,
        customAttributes,
        pluginContext,
        viewMode = false,
    } = props;
    const metadataByPluginId = useMemo(() => Object.fromEntries(fieldsMetadata), [fieldsMetadata]);
    const configuredPluginIds = useMemo(() => Object.keys(metadataByPluginId), [metadataByPluginId]);
    const { orgUnitId } = useLocationQuery();

    // Plugin related functionality and feedback
    const { pluginValues } = usePluginValues(formId, metadataByPluginId, pluginContext);
    const { errors, warnings, formSubmitted } = usePluginMessages(formId, metadataByPluginId);
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

