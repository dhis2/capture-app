// @flow
import React, { useEffect, useMemo } from 'react';
import { DataEntryPluginComponent } from './DataEntryPlugin.component';
import type { ContainerProps } from './DataEntryPlugin.types';
import { usePluginMessages } from './hooks/usePluginMessages';
import { usePluginCallbacks } from './hooks/usePluginCallbacks';
import { usePluginValues } from './hooks/usePluginValues';

export const DataEntryPlugin = (props: ContainerProps) => {
    const { pluginSource, fieldsMetadata, formId, onUpdateField, pluginContext } = props;
    const metadataByPluginId = useMemo(() => Object.fromEntries(fieldsMetadata), [fieldsMetadata]);
    const configuredPluginIds = useMemo(() => Object.keys(metadataByPluginId), [metadataByPluginId]);

    // Plugin related functionality and feedback
    const { pluginValues } = usePluginValues(formId, metadataByPluginId, pluginContext);
    const { errors, warnings } = usePluginMessages(formId, metadataByPluginId);
    const { setFieldValue, setContextFieldValue } = usePluginCallbacks({
        configuredPluginIds,
        onUpdateField,
        metadataByPluginId,
        pluginContext,
    });

    // Expanding iframe height temporarily to fit content - LIBS-487
    useEffect(() => {
        const iframe = document.querySelector('iframe');
        if (iframe) iframe.style.height = '500px';
    }, []);


    // Formatted metadata is needed to remove the underscore from the keys
    const formattedMetadata = useMemo(() => Array.from(fieldsMetadata.entries())
        .reduce((acc: any, [pluginId, dataElement]) => {
            const modifiedDataElement = Object.entries(dataElement)
                .map(([attributeKey, value]) => {
                    const modifiedKey = attributeKey.replace(/^_/, '');
                    return [modifiedKey, value];
                });

            acc[pluginId] = Object.fromEntries(modifiedDataElement);
            return acc;
        }, {}), [fieldsMetadata]);

    return (
        <DataEntryPluginComponent
            pluginSource={pluginSource}
            fieldsMetadata={formattedMetadata}
            values={pluginValues}
            setFieldValue={setFieldValue}
            setContextFieldValue={setContextFieldValue}
            errors={errors}
            warnings={warnings}
        />
    );
};
