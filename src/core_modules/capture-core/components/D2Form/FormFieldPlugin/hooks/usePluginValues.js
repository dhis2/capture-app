// @flow
import { useSelector } from 'react-redux';
import { useMemo } from 'react';
import type { MetadataByPluginId, PluginContext } from '../FormFieldPlugin.types';

export const usePluginValues = (
    formId: string,
    metadataByPluginId: MetadataByPluginId,
    pluginContext: PluginContext = {},
) => {
    const formValuesRedux = useSelector(({ formsValues }) => formsValues[formId]);

    const formValues = useMemo(() => {
        if (!formValuesRedux) {
            return {};
        }

        return Object.entries(metadataByPluginId)
            .reduce((acc, [pluginId, metadata]) => {
                // $FlowFixMe - flow does not understand that metadata is a dataElement
                const value = formValuesRedux[metadata.id];
                if (value) {
                    acc[pluginId] = value;
                }
                return acc;
            }, {});
    }, [formValuesRedux, metadataByPluginId]);

    const contextValues = useMemo(() => Object.entries(pluginContext)
        .reduce((acc, [key, value]) => {
            // $FlowFixMe
            acc[key] = value.value;
            return acc;
        }, {}), [pluginContext]);

    return {
        pluginValues: {
            ...formValues,
            ...contextValues,
        },
    };
};
