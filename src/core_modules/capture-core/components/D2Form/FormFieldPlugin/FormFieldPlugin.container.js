// @flow
import React, { useEffect, useMemo } from 'react';
import { FormFieldPluginComponent } from './FormFieldPlugin.component';
import type { ContainerProps } from './FormFieldPlugin.types';
import { usePluginMessages } from './hooks/usePluginMessages';
import { usePluginCallbacks } from './hooks/usePluginCallbacks';
import { usePluginValues } from './hooks/usePluginValues';

const attributesToOmit = ['dataElement', 'optionGroups'];

const removeUnderscoreFromObjectAttributes = (obj) => {
    const newObj = {};

    for (const [key, value] of Object.entries(obj)) {
        const modifiedKey = key.replace(/^_/, '');
        if (!attributesToOmit.includes(modifiedKey)) {
            if (value && typeof value === 'object') {
                if (Array.isArray(value)) {
                    newObj[modifiedKey] = value.map((nestedVal: any) =>
                        removeUnderscoreFromObjectAttributes(nestedVal),
                    ).filter(Boolean);
                } else {
                    newObj[modifiedKey] = removeUnderscoreFromObjectAttributes(value);
                }
            } else {
                newObj[modifiedKey] = value;
            }
        }
    }

    return newObj;
};

export const FormFieldPlugin = (props: ContainerProps) => {
    const { pluginSource, fieldsMetadata, formId, onUpdateField, pluginContext } = props;
    const metadataByPluginId = useMemo(() => Object.fromEntries(fieldsMetadata), [fieldsMetadata]);
    const configuredPluginIds = useMemo(() => Object.keys(metadataByPluginId), [metadataByPluginId]);

    // Plugin related functionality and feedback
    const { pluginValues } = usePluginValues(formId, metadataByPluginId, pluginContext);
    const { errors, warnings, formSubmitted } = usePluginMessages(formId, metadataByPluginId);
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

    // Removing underscore from plugin attributes
    const formattedMetadata = useMemo(() => {
        const metadata = {};

        for (const [pluginId, dataElement] of fieldsMetadata.entries()) {
            metadata[pluginId] = removeUnderscoreFromObjectAttributes(dataElement);
        }

        return metadata;
    }, [fieldsMetadata]);


    return (
        <FormFieldPluginComponent
            pluginSource={pluginSource}
            fieldsMetadata={formattedMetadata}
            values={pluginValues}
            setFieldValue={setFieldValue}
            formSubmitted={formSubmitted}
            setContextFieldValue={setContextFieldValue}
            errors={errors}
            warnings={warnings}
        />
    );
};
