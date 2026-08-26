import React, { useCallback } from 'react';
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

    const commitFieldUpdateFromPlugin = useCallback(
        (fieldMetadata: DataElement, newValue: any, oldValue: any, options?: FieldCommitOptions | null) => {
            handleCommitField.bind(formThis)(fieldMetadata, newValue, oldValue, options);
        },
        [formThis, handleCommitField],
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
            onUpdateFieldValue={commitFieldUpdateFromPlugin}
            pluginContext={pluginContext}
        />
    );
};
