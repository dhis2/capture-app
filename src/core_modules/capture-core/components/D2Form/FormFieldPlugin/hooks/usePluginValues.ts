import { useSelector } from 'react-redux';
import { useMemo } from 'react';
import type { MetadataByPluginId, PluginContext } from '../FormFieldPlugin.types';
import { PluginContextValueKeys } from '../FormFieldPlugin.const';

export const usePluginValues = (
    formId: string,
    metadataByPluginId: MetadataByPluginId,
    pluginContext: PluginContext = {},
) => {
    const formValuesRedux = useSelector((state: any) => state.formsValues[formId]);

    const formValues = useMemo(() => {
        if (!formValuesRedux) {
            return {};
        }
        return Object.fromEntries(
            Object.entries(metadataByPluginId).map(
                ([pluginId, { id }]) => [pluginId, formValuesRedux[id]],
            ),
        );
    }, [formValuesRedux, metadataByPluginId]);

    const contextValues = useMemo(() => Object.fromEntries(
        PluginContextValueKeys
            .filter(key => key in pluginContext)
            .map(key => [key, pluginContext[key]?.value]),
    ), [pluginContext]);

    const pluginValues = useMemo(() => ({
        ...formValues,
        ...contextValues,
    }), [formValues, contextValues]);

    return {
        pluginValues,
        formValuesRedux,
    };
};
