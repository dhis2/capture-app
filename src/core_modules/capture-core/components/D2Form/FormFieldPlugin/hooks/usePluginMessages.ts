import { useSelector } from 'react-redux';
import { useMemo } from 'react';
import type { MetadataByPluginId } from '../FormFieldPlugin.types';

const applyRulesEffectsMessages = (
    acc: { errors: Record<string, any[]>, warnings: Record<string, any[]> },
    fieldId: string,
    idFromPlugin: string,
    rulesEffects: any,
    formSubmitted: boolean,
) => {
    if (!rulesEffects) return;
    const { error: fieldErrors, warning: fieldWarnings, errorOnComplete: fieldErrorOnComplete } =
        rulesEffects[fieldId] ?? {};
    if (fieldErrors) { acc.errors[idFromPlugin] = [...fieldErrors]; }
    if (fieldWarnings) { acc.warnings[idFromPlugin] = [...fieldWarnings]; }
    if (formSubmitted && fieldErrorOnComplete) {
        acc.errors[idFromPlugin] = [...(acc.errors[idFromPlugin] ?? []), ...fieldErrorOnComplete];
    }
};

const applyFormFieldUIMessages = (
    acc: { errors: Record<string, any[]>, warnings: Record<string, any[]> },
    fieldId: string,
    idFromPlugin: string,
    formFieldsUI: any,
) => {
    if (!formFieldsUI) return;
    const { errorMessage: fieldUIError } = formFieldsUI[fieldId] ?? {};
    if (fieldUIError) {
        acc.errors[idFromPlugin] = [...(acc.errors[idFromPlugin] ?? []), fieldUIError];
    }
};

export const usePluginMessages = (formId: string, metadataByPluginId: MetadataByPluginId) => {
    const rulesEffects = useSelector((state: any) => state.rulesEffectsMessages[formId]);
    const formFieldsUI = useSelector((state: any) => state.formsSectionsFieldsUI[formId]);
    const formSubmitted = useSelector((state: any) => state.dataEntriesUI[formId]?.saveAttempted ?? false);

    const { errors, warnings } = useMemo(() => {
        if (!metadataByPluginId) {
            return {
                errors: {},
                warnings: {},
            };
        }

        return Object.entries(metadataByPluginId)
            .reduce((acc, [idFromPlugin, dataElement]) => {
                const fieldId = dataElement.id;
                applyRulesEffectsMessages(acc, fieldId, idFromPlugin, rulesEffects, formSubmitted);
                applyFormFieldUIMessages(acc, fieldId, idFromPlugin, formFieldsUI);
                return acc;
            }, { errors: {}, warnings: {} });
    }, [formFieldsUI, metadataByPluginId, rulesEffects, formSubmitted]);

    return {
        formSubmitted,
        errors,
        warnings,
    };
};
