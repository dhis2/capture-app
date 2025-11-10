import React, { useCallback } from 'react';
import { useSelector } from 'react-redux';
import type { FieldCommitOptions } from '../formbuilder.types';
import type { DataElement } from '../../../../metaData';

export const FormPlugin = ({
    field,
    pluginContext,
    handleCommitField,
    formThis,
}: any) => {
    const {
        pluginId,
        pluginSource,
        fieldsMetadata,
        customAttributes,
        name,
        formId,
        viewMode,
    } = field.props;

    const formValues = useSelector((state: any) => state?.formsValues[formId]);

    const commitFieldUpdateFromPlugin = useCallback(
        (fieldMetadata: DataElement, newValue: any, options?: FieldCommitOptions | null) => {
            handleCommitField.bind(formThis)(fieldMetadata, newValue, formValues[fieldMetadata.id], options);
        },
        [formThis, handleCommitField, formValues],
    );

    return (
        <field.component
            name={name}
            pluginId={pluginId}
            customAttributes={customAttributes}
            pluginSource={pluginSource}
            fieldsMetadata={fieldsMetadata}
            formId={formId}
            viewMode={viewMode}
            onUpdateField={commitFieldUpdateFromPlugin}
            pluginContext={pluginContext}
        />
    );
};
