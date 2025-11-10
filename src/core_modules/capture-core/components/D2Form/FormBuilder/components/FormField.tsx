import React, { useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import defaultClasses from './formBuilder.module.css';
import type { FieldCommitOptions } from '../formbuilder.types';

export const FormField = ({
    field,
    index,
    length,
    onGetContainerProps,
    onRenderDivider,
    onUpdateFieldAsync,
    setFieldInstance,
    errorMessage,
    fieldUI,
    asyncUIState,
    validationAttempted,
    commitFieldHandler,
    fieldProps,
    formThis,
    ...passOnProps
}: any) => {
    const value = useSelector((state: any) => state?.formsValues[field.props.formId][field.id]);

    const commitFieldUpdate = useCallback(async (
        newValue: any,
        options?: FieldCommitOptions | null,
    ) => {
        commitFieldHandler.bind(formThis)(field.id, newValue, value, options);
    }, [value, commitFieldHandler, formThis, field.id]);

    const asyncProps = useMemo(() =>
        ((fieldProps.async) ? ({
            onCommitAsync: (callback: (...args: any[]) => any) =>
                onUpdateFieldAsync(field.id, fieldProps.label, fieldProps.id, callback),
            asyncUIState,
        }) : {}), [field.id, fieldProps.async, fieldProps.label, fieldProps.id, asyncUIState, onUpdateFieldAsync]);

    const commitEvent = field.commitEvent || 'onBlur';
    const commitPropObject = {
        [commitEvent]: commitFieldUpdate,
    };

    return (
        <div
            key={field.id}
            className={defaultClasses.fieldOuterContainer}
            data-test={'form-field'}
        >
            <div
                {...onGetContainerProps && onGetContainerProps(index, length, field)}
                data-test={`form-field-${field.id}`}
            >
                <field.component
                    ref={(fieldInstance) => { setFieldInstance.bind(formThis)(fieldInstance, field.id); }}
                    value={value}
                    errorMessage={errorMessage}
                    touched={fieldUI.touched}
                    validationAttempted={validationAttempted}
                    validatingMessage={fieldUI.validatingMessage}
                    {...commitPropObject}
                    {...fieldProps}
                    {...passOnProps}
                    {...asyncProps}
                />
            </div>

            {onRenderDivider && onRenderDivider(index, length, field)}
        </div>
    );
};
