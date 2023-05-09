// @flow
import log from 'loglevel';
import { useCallback } from 'react';
import type { SetFieldValueProps, UsePluginCallbacksProps } from '../FormFieldPlugin.types';
import { errorCreator } from '../../../../../capture-core-utils';
import { PluginErrorMessages } from '../FormFieldPlugin.const';

export const usePluginCallbacks = ({
    configuredPluginIds,
    metadataByPluginId,
    onUpdateField,
    pluginContext,
}: UsePluginCallbacksProps) => {
    const setFieldValue = useCallback(({ fieldId, value, options = {} }: SetFieldValueProps) => {
        if (!fieldId) {
            log.error(errorCreator(PluginErrorMessages.SET_FIELD_VALUE_MISSING_ID)({ fieldId, value, options }));
            return;
        }

        if (!configuredPluginIds.includes(fieldId)) {
            log.error(errorCreator(PluginErrorMessages.SET_FIELD_VALUE_ID_NOT_ALLOWED)({ fieldId, value, options }));
            return;
        }

        const fieldMetadata = metadataByPluginId[fieldId];

        onUpdateField && onUpdateField(fieldMetadata, value, options);
    }, [configuredPluginIds, metadataByPluginId, onUpdateField]);

    const setContextFieldValue = useCallback(({ fieldId, value }: SetFieldValueProps) => {
        pluginContext[fieldId]?.setDataEntryFieldValue(value);
    }, [pluginContext]);

    return {
        setFieldValue,
        setContextFieldValue,
    };
};
