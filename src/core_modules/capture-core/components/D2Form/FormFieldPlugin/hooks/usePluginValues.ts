import { useSelector } from 'react-redux';
import { useMemo } from 'react';
import { useLocationQuery } from '../../../../utils/routing';
import type { MetadataByPluginId, PluginContext } from '../FormFieldPlugin.types';

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

    const url = useLocationQuery();

    const contextValues = useMemo(() => {
        const base = Object.fromEntries(
            Object.entries(pluginContext).map(([key, entry]) => [key, entry?.value]),
        );
        // remove this once DHIS2-19171 adds an org-unit widget to the New TEI form
        if (!('orgUnit' in pluginContext) && url.orgUnitId) {
            return { ...base, orgUnit: { id: url.orgUnitId } };
        }
        return base;
    }, [pluginContext, url.orgUnitId]);

    const pluginValues = useMemo(() => ({
        ...formValues,
        ...contextValues,
    }), [formValues, contextValues]);

    return {
        pluginValues,
        formValuesRedux,
    };
};
