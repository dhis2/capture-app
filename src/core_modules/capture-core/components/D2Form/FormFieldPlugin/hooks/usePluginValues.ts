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

    // URL fallback for `orgUnit`: drop once DHIS2-19171
    // (https://dhis2.atlassian.net/browse/DHIS2-19171) adds an org-unit widget
    // to the New TEI form. Revert this block to:
    //
    //   const contextValues = useMemo(() => Object.entries(pluginContext)
    //       .reduce((acc, [key, value]) => {
    //           acc[key] = value?.value;
    //           return acc;
    //       }, {}), [pluginContext]);
    //
    // ...and drop the `url` / `useLocationQuery` import.
    const contextValues = useMemo(() => {
        const acc: Record<string, unknown> = Object.entries(pluginContext)
            .reduce((a, [key, value]) => {
                a[key] = value?.value;
                return a;
            }, {} as Record<string, unknown>);
        if (!('orgUnit' in pluginContext) && url.orgUnitId) {
            acc.orgUnit = { id: url.orgUnitId };
        }
        return acc;
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
