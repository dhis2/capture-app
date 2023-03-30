// @flow

import { useSelector } from 'react-redux';
import { useMemo } from 'react';
import type { MetadataByPluginId } from '../DataEntryPlugin.types';

export const usePluginFormValues = (formId: string, metadataByPluginId: MetadataByPluginId) => {
    const formValues = useSelector(({ formsValues }) => formsValues[formId]);

    const pluginValues = useMemo(() => {
        if (!formValues) {
            return {};
        }

        return Object.entries(metadataByPluginId)
            .reduce((acc, [pluginId, metadata]) => {
                // $FlowFixMe - flow does not understand that metadata is a dataElement
                const value = formValues[metadata.id];
                if (value) {
                    acc[pluginId] = value;
                }
                return acc;
            }, {});
    }, [formValues, metadataByPluginId]);

    return { pluginValues };
};
