// @flow
import React, { useCallback, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { DataEntryPluginComponent } from './DataEntryPlugin.component';
import type { ContainerProps } from './DataEntryPlugin.types';

export const DataEntryPlugin = (props: ContainerProps) => {
    const { pluginSource, fieldsMetadata, formId, onUpdateField } = props;
    const metadataByPluginId = useMemo(() => Object.fromEntries(fieldsMetadata), [fieldsMetadata]);

    useEffect(() => {
        document.querySelector('iframe').style.height = '500px';
    }, []);

    const formValues = useSelector(({ formsValues }) => formsValues[formId]);

    const { errors, warnings } = useSelector(({ rulesEffectsMessages }) => {
        const messages = rulesEffectsMessages[formId];

        if (!messages) {
            return { errors: {}, warnings: {} };
        }

        return Object.entries(messages)
            .reduce((acc, [id, message]) => {
                if (message.error) {
                    acc.errors[id] = message.error;
                }
                if (message.warning) {
                    acc.warnings[id] = message.warning;
                }
                return acc;
            }, { errors: {}, warnings: {} });
    });

    const setFieldValue = useCallback(({ fieldId, value, options = {} }) => {
        onUpdateField && onUpdateField(
            value,
            {
                valid: options.valid ?? true,
                touched: options.touched ?? true,
                errorMessage: options.error,
            },
            fieldId,
            `${formId}-test`,
        );
    }, [formId, onUpdateField]);

    const setFieldValues = useCallback((updatedValues: {| [id: string]: any |}) => {
        Object.entries(updatedValues).forEach(([fieldId, value]) => {
            setFieldValue({ fieldId, value });
        });
    }, [setFieldValue]);

    const setError = useCallback((fieldId, error) => {
        setFieldValue({ fieldId, value: formValues[fieldId], options: { error } });
    }, [formValues, setFieldValue]);

    const setErrors = useCallback((updatedErrors: {| [id: string]: any |}) => {
        Object.entries(updatedErrors).forEach(([fieldId, error]) => {
            setError(fieldId, error);
        });
    }, [setError]);

    const setWarning = useCallback((fieldId, warning) => {
        setFieldValue({ fieldId, value: formValues[fieldId], options: { warning } });
    }, [formValues, setFieldValue]);

    const setWarnings = useCallback((updatedWarnings: {| [id: string]: any |}) => {
        Object.entries(updatedWarnings).forEach(([fieldId, warning]) => {
            setWarning(fieldId, warning);
        });
    }, [setWarning]);

    return (
        <DataEntryPluginComponent
            pluginSource={pluginSource}
            fieldsMetadata={metadataByPluginId}
            values={formValues}
            errors={errors}
            warnings={warnings}
            setError={setError}
            setErrors={setErrors}
            setWarning={setWarning}
            setWarnings={setWarnings}
            setFieldValue={setFieldValue}
            setFieldValues={setFieldValues}
        />
    );
};
