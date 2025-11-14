import React, { useCallback, useMemo } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import defaultClasses from './formBuilder.module.css';
import type {
    FieldCommitOptions,
    FieldUI,
} from '../formbuilder.types';

const getFieldAsyncUIState = (fieldUI: FieldUI) => {
    const ignoreKeys = ['valid', 'errorMessage', 'touched'];
    return Object.keys(fieldUI).reduce((accFieldAsyncUIState, propId) => {
        if (!ignoreKeys.includes(propId)) {
            accFieldAsyncUIState[propId] = fieldUI[propId];
        }
        return accFieldAsyncUIState;
    }, {});
}

export const FormField = React.memo(({
    field,
    value,
    index,
    length,
    onGetContainerProps,
    onRenderDivider,
    onUpdateFieldAsync,
    onPostProcessErrorMessage,
    setFieldInstance,
    validationAttempted,
    commitFieldHandler,
    fieldProps,
    formThis,
    ...passOnProps
}: any) => {
    const fieldUI = useSelector(
        (state: any) => (state.formsSectionsFieldsUI[fieldProps.formId] || {})[field.id] || {},
        shallowEqual,
    );
    const errorMessage = useMemo(() => (onPostProcessErrorMessage && fieldUI.errorMessage ?
        onPostProcessErrorMessage({
            errorMessage: fieldUI.errorMessage,
            errorType: fieldUI.errorType,
            errorData: fieldUI.errorData,
            id: `${fieldProps.formId}-${field.id}`,
            fieldId: field.id,
            fieldLabel: fieldProps.label,
        }) : fieldUI.errorMessage), []);

    const commitFieldUpdate = useCallback(async (
        newValue: any,
        options?: FieldCommitOptions | null,
    ) => {
        commitFieldHandler.bind(formThis)(field.id, newValue, value, options);
    }, [value, commitFieldHandler, formThis, field.id]);

    const asyncUIState = useMemo(() => getFieldAsyncUIState(fieldUI), [fieldUI]);

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
});
