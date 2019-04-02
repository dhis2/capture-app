// @flow
/* eslint-disable complexity */
import i18n from '@dhis2/d2-i18n';
import log from 'loglevel';
import uuid from 'uuid/v4';
import { makeCancelablePromise } from 'capture-core-utils';
import type { CancelablePromise } from 'capture-core-utils/cancelablePromise/makeCancelable';
import * as React from 'react';
import isDefined from 'd2-utilizr/lib/isDefined';
import isObject from 'd2-utilizr/lib/isObject';
import defaultClasses from './formBuilder.mod.css';

export type ValidatorContainer = {
    validator: (value: any, validationContext: ?Object) => boolean,
    message: string,
    validatingMessage?: ?string,
    type?: ?string,
    async?: ?boolean,
};

export type FieldConfig = {
    id: string,
    component: React.ComponentType<any>,
    props?: ?Object,
    validators?: ?Array<ValidatorContainer>,
    commitEvent?: ?string,
    onIsEqual?: ?(newValue: any, oldValue: any) => boolean,
};

type FieldUI = {
    touched?: ?boolean,
    valid?: ?boolean,
    errorMessage?: ?string,
    errorType?: ?string,
    validatingMessage?: ?string,
};

type RenderDividerFn = (index: number, fieldsCount: number, field: FieldConfig) => React.Node;
type GetContainerPropsFn = (index: number, fieldsCount: number, field: FieldConfig) => Object;

type RenderFieldFn = (
    field: FieldConfig,
    index: number,
    onRenderDivider?: ?RenderDividerFn,
    onGetContainerProps?: ?GetContainerPropsFn
) => React.Node

type IsValidatingFn = (
    fieldId: string,
    formBuilderId: string,
    validatingUid: string,
    message: ?string,
    fieldUIUpdates: ?FieldUI,
) => void;

type Props = {
    id: string,
    fields: Array<FieldConfig>,
    values: { [id: string]: any },
    fieldsUI: { [id: string]: FieldUI },
    onUpdateFieldAsync: (fieldId: string, fieldLabel: string, formBuilderId: string, callback: Function) => void,
    onUpdateField: (value: any, uiState: FieldUI, fieldId: string, formBuilderId: string, promiseForIsValidating: string) => void,
    onUpdateFieldUIOnly: (uiState: FieldUI, fieldId: string, formBuilderId: string) => void,
    onFieldsValidated: ?(fieldsUI: { [id: string]: FieldUI }, formBuilderId: string, uidsForIsValidating: Array<string>) => void,
    validationAttempted?: ?boolean,
    validateIfNoUIData?: ?boolean,
    formHorizontal: ?boolean,
    children?: ?(RenderFieldFn, fields: Array<FieldConfig>) => React.Node,
    onRenderDivider?: ?RenderDividerFn,
    onGetContainerProps?: ?GetContainerPropsFn,
    onGetValidationContext: ?() => ?Object,
    onIsValidating: ?IsValidatingFn,
    onCleanUp?: ?(remainingUids: Array<string>) => void,
    loadNr: number,
};

type FieldCommitOptions = {
    touched?: boolean,
};

// container for handling async validations
type FieldsValidatingPromiseContainer = { [fieldId: string]: ?{ cancelableValidatingPromise?: ?CancelablePromise<any>, validatingCompleteUid: string } };

class FormBuilder extends React.Component<Props> {
    static async validateField(
        field: FieldConfig,
        value: any,
        validationContext: ?Object,
        onIsValidatingInternal: ?Function,
    ): Promise<{ valid: boolean, errorMessage?: ?string, errorType?: ?string }> {
        if (!field.validators || field.validators.length === 0) {
            return {
                valid: true,
            };
        }

        const validatorResult = await field.validators
            .reduce(async (passPromise, currentValidator) => {
                const pass = await passPromise;
                if (pass === true) {
                    let result = currentValidator.validator(value, validationContext);
                    if (result instanceof Promise) {
                        result = onIsValidatingInternal ? onIsValidatingInternal(currentValidator.validatingMessage, result) : result;
                        result = await result;
                    }

                    if (result === true || (result && result.valid)) {
                        return true;
                    }
                    return {
                        message: (result && result.errorMessage) || currentValidator.message,
                        type: currentValidator.type,
                    };
                }
                return pass;
            }, Promise.resolve(true));

        if (validatorResult !== true) {
            return {
                valid: false,
                errorMessage: validatorResult.message,
                errorType: validatorResult.type,
            };
        }

        return {
            valid: true,
        };
    }

    static getAsyncUIState(fieldsUI: { [id: string]: FieldUI }) {
        return Object.keys(fieldsUI).reduce((accAsyncUIState, fieldId) => {
            const fieldUI = fieldsUI[fieldId];
            accAsyncUIState[fieldId] = FormBuilder.getFieldAsyncUIState(fieldUI);
            return accAsyncUIState;
        }, {});
    }

    static getFieldAsyncUIState(fieldUI: FieldUI) {
        const ignoreKeys = ['valid', 'errorMessage', 'touched'];
        return Object.keys(fieldUI).reduce((accFieldAsyncUIState, propId) => {
            if (!ignoreKeys.includes(propId)) {
                accFieldAsyncUIState[propId] = fieldUI[propId];
            }
            return accFieldAsyncUIState;
        }, {});
    }

    static updateAsyncUIState(
        oldFieldsUI: { [id: string]: FieldUI },
        newFieldsUI: { [id: string]: FieldUI },
        asyncUIState: { [id: string]: Object }) {
        return Object.keys(newFieldsUI).reduce((accAsyncUIState, fieldId) => {
            const newFieldUI = newFieldsUI[fieldId];
            const oldFieldUI = oldFieldsUI[fieldId];

            if (newFieldUI !== oldFieldUI) {
                accAsyncUIState[fieldId] = FormBuilder.getFieldAsyncUIState(newFieldUI);
            }
            return accAsyncUIState;
        }, asyncUIState);
    }

    static executeValidateAllFields(
        props: Props,
        fieldsValidatingPromiseContainer: FieldsValidatingPromiseContainer,
    ) {
        const {
            id,
            fields,
            values,
            onGetValidationContext,
            onIsValidating,
        } = props;
        const validationContext = onGetValidationContext && onGetValidationContext();
        const validationPromises = fields
            .map(async (field) => {
                const fieldId = field.id;
                const fieldValidatingPromiseContainer = fieldsValidatingPromiseContainer[fieldId] || {};
                fieldsValidatingPromiseContainer[fieldId] = fieldValidatingPromiseContainer;

                if (!fieldValidatingPromiseContainer.validatingCompleteUid) {
                    fieldValidatingPromiseContainer.validatingCompleteUid = uuid();
                }
                fieldValidatingPromiseContainer.cancelableValidatingPromise &&
                fieldValidatingPromiseContainer.cancelableValidatingPromise.cancel();

                const handleIsValidatingInternal = (message: ?string, promise: Promise<any>) => {
                    fieldValidatingPromiseContainer.cancelableValidatingPromise = makeCancelablePromise(promise);
                    onIsValidating && onIsValidating(
                        field.id,
                        id,
                        fieldValidatingPromiseContainer.validatingCompleteUid,
                        message,
                    );

                    return fieldValidatingPromiseContainer.cancelableValidatingPromise.promise;
                };

                let validationData;
                try {
                    validationData = await FormBuilder.validateField(
                        field,
                        values[field.id],
                        validationContext,
                        handleIsValidatingInternal,
                    );
                } catch (reason) {
                    if (reason && isObject(reason) && reason.isCanceled) {
                        validationData = null;
                    } else {
                        validationData = {
                            valid: false,
                            errorMessage: i18n.t('error encountered during field validation'),
                            errorType: i18n.t('error'),
                        };
                        log.error({ reason, field });
                    }
                }

                return {
                    id: field.id,
                    validationData,
                };
            });

        return Promise
            .all(validationPromises)
            // $FlowFixMe
            .then((validationContainers =>
                validationContainers.filter(
                    validationContainer =>
                        !!validationContainer.validationData): Array<{id: string, validationData: Object}>),
            );
    }

    fieldInstances: Map<string, any>;
    asyncUIState: { [id: string]: FieldUI };
    fieldsValidatingPromiseContainer: FieldsValidatingPromiseContainer;
    validateAllCancelablePromise: ?CancelablePromise<any>;
    commitUpdateTriggeredForFields: { [fieldId: string]: boolean };

    constructor(props: Props) {
        super(props);
        this.fieldInstances = new Map();
        this.asyncUIState = FormBuilder.getAsyncUIState(this.props.fieldsUI);
        this.fieldsValidatingPromiseContainer = {};
        this.commitUpdateTriggeredForFields = {};

        if (this.props.validateIfNoUIData) {
            this.validateAllFields(this.props);
        }
    }

    componentWillReceiveProps(newProps: Props) {
        if (newProps.id !== this.props.id || newProps.loadNr !== this.props.loadNr) {
            this.asyncUIState = FormBuilder.getAsyncUIState(this.props.fieldsUI);
            this.commitUpdateTriggeredForFields = {};
            const onCleanUp = newProps.onCleanUp;
            onCleanUp && onCleanUp(this.getCleanUpData());
            if (this.props.validateIfNoUIData) {
                this.validateAllFields(newProps);
            }
        } else {
            this.asyncUIState =
                FormBuilder.updateAsyncUIState(this.props.fieldsUI, newProps.fieldsUI, this.asyncUIState);
        }
    }

    componentWillUnmount() {
        const onCleanUp = this.props.onCleanUp;
        onCleanUp && onCleanUp(this.getCleanUpData());
    }

    getCleanUpData() {
        const remainingCompleteUids: Array<string> = Object
            .keys(this.fieldsValidatingPromiseContainer)
            .map((key) => {
                const { cancelableValidatingPromise, validatingCompleteUid } =
                    this.fieldsValidatingPromiseContainer[key] || {};
                cancelableValidatingPromise && cancelableValidatingPromise.cancel();
                return validatingCompleteUid;
            })
            .filter(promise => !!promise);

        this.fieldsValidatingPromiseContainer = {};
        return remainingCompleteUids;
    }

    validateAllFields(
        props: Props,
    ) {
        this.validateAllCancelablePromise && this.validateAllCancelablePromise.cancel();
        this.validateAllCancelablePromise = makeCancelablePromise(
            FormBuilder.executeValidateAllFields(props, this.fieldsValidatingPromiseContainer),
        );

        this.validateAllCancelablePromise
            .promise
            .then((validationContainerArray) => {
                const validationContainers = validationContainerArray
                    .reduce((accFieldsUI, container) => {
                        accFieldsUI[container.id] = container.validationData;
                        return accFieldsUI;
                    }, {});

                const promisesAndIdForActuallyValidatedFields = validationContainerArray
                    .map(validationDataContainer => ({
                        promises: this.fieldsValidatingPromiseContainer[validationDataContainer.id],
                        id: validationDataContainer.id,
                        commitUpdateTriggeredForField: this.commitUpdateTriggeredForFields[validationDataContainer.id],
                    }))
                    .filter(c => !c.commitUpdateTriggeredForField);

                // $FlowFixMe
                props.onFieldsValidated && props.onFieldsValidated(
                    validationContainers,
                    props.id,
                    promisesAndIdForActuallyValidatedFields.map(c => c.promises.validatingCompleteUid),
                );

                promisesAndIdForActuallyValidatedFields
                    .forEach((container) => {
                        this.fieldsValidatingPromiseContainer[container.id] = null;
                    });

                this.validateAllCancelablePromise = null;
            })
            .catch((reason) => {
                if (!reason || !isObject(reason) || !reason.isCanceled) {
                    log.error({
                        reason,
                        message: 'formBuilder validate all fields failed',
                    });
                }
            });
    }

    /**
     * Retreive the field that has the specified field id
     *
     * @param fieldId
     * @returns {}
    */
    getFieldProp(fieldId: string): FieldConfig {
        // $FlowSuppress
        return this.props.fields.find(f => f.id === fieldId);
    }

    hasCommitedValueChanged(field: FieldConfig, value: any) {
        let valueChanged = true;
        const oldValue = this.props.values[field.id];

        if (!isObject(value)) {
            if ((value || '') === (oldValue || '')) {
                valueChanged = false;
            }
        } else if (field.onIsEqual && field.onIsEqual(value, oldValue)) {
            valueChanged = false;
        }

        return valueChanged;
    }

    async commitFieldUpdate(fieldId: string, value: any, options?: ?FieldCommitOptions) {
        const {
            onUpdateFieldUIOnly,
            onUpdateField,
            onGetValidationContext,
            id,
            onIsValidating,
        } = this.props;
        const field = this.getFieldProp(fieldId);
        const touched = options && isDefined(options.touched) ? options.touched : true;

        if (!this.hasCommitedValueChanged(field, value)) {
            onUpdateFieldUIOnly({ touched }, fieldId, id);
            return;
        }

        const fieldValidatingPromiseContainer = this.fieldsValidatingPromiseContainer[fieldId] || {};
        this.fieldsValidatingPromiseContainer[fieldId] = fieldValidatingPromiseContainer;
        if (!fieldValidatingPromiseContainer.validatingCompleteUid) {
            fieldValidatingPromiseContainer.validatingCompleteUid = uuid();
        }
        fieldValidatingPromiseContainer.cancelableValidatingPromise &&
        fieldValidatingPromiseContainer.cancelableValidatingPromise.cancel();

        const handleIsValidatingInternal = (message: ?string, promise: Promise<any>) => {
            fieldValidatingPromiseContainer.cancelableValidatingPromise = makeCancelablePromise(promise);
            onIsValidating && onIsValidating(
                fieldId,
                id,
                fieldValidatingPromiseContainer.validatingCompleteUid,
                message,
                {
                    touched: true,
                },
            );
            // $FlowFixMe
            return fieldValidatingPromiseContainer.cancelableValidatingPromise.promise;
        };

        this.commitUpdateTriggeredForFields[fieldId] = true;
        const updatePromise = FormBuilder.validateField(
            field,
            value,
            onGetValidationContext && onGetValidationContext(),
            handleIsValidatingInternal,
        )
            .then(({ valid, errorMessage, errorType }) => {
                onUpdateField(
                    value,
                    {
                        valid,
                        touched,
                        errorMessage,
                        errorType,
                    },
                    fieldId,
                    id,
                    fieldValidatingPromiseContainer.validatingCompleteUid,
                );
                this.fieldsValidatingPromiseContainer[fieldId] = null;
            })
            .catch((reason) => {
                if (!reason || !isObject(reason) || !reason.isCanceled) {
                    log.error({ reason, field, value });
                    onUpdateField(
                        value,
                        {
                            valid: false,
                            touched: true,
                            errorMessage: i18n.t('error encountered during field validation'),
                            errorType: i18n.t('error'),
                        },
                        fieldId,
                        id,
                        fieldValidatingPromiseContainer.validatingCompleteUid,
                    );
                    this.fieldsValidatingPromiseContainer[fieldId] = null;
                }
            });
        await updatePromise;
    }

    handleUpdateAsyncState = (fieldId: string, asyncStateToAdd: Object) => {
        this.props.onUpdateFieldUIOnly(asyncStateToAdd, fieldId, this.props.id);
    }

    handleCommitAsync = (fieldId: string, fieldLabel: string, callback: Function) => {
        this.props.onUpdateFieldAsync(fieldId, fieldLabel, this.props.id, callback);
    }

    /**
     *  Retain a reference to the form field instance
    */
    setFieldInstance(instance: any, id: string) {
        if (!instance) {
            if (this.fieldInstances.has(id)) {
                this.fieldInstances.delete(id);
            }
        } else {
            this.fieldInstances.set(id, instance);
        }
    }

    isValid(typesToCheck?: ?Array<string>) {
        return Object
            .keys(this.props.fieldsUI)
            .every((key) => {
                const fieldUI = this.props.fieldsUI[key];
                if (typesToCheck) {
                    const isCheckable = typesToCheck.includes(fieldUI.errorType);
                    if (!isCheckable) {
                        return true;
                    }
                }
                return fieldUI.valid;
            });
    }

    getInvalidFields(externalInvalidFields?: ?{ [id: string]: boolean }) {
        const propFields = this.props.fields;
        return propFields.reduce((invalidFieldsContainer, field) => {
            const fieldUI = this.props.fieldsUI[field.id];
            if (!fieldUI.valid) {
                invalidFieldsContainer.push({
                    prop: field,
                    instance: this.fieldInstances.get(field.id),
                    uiState: fieldUI,
                });
            } else if (externalInvalidFields && externalInvalidFields[field.id]) {
                invalidFieldsContainer.push({
                    prop: field,
                    instance: this.fieldInstances.get(field.id),
                    uiState: fieldUI,
                });
            }
            return invalidFieldsContainer;
        }, []);
    }

    renderField = (
        field: FieldConfig,
        index: number,
        onRenderDivider?: ?RenderDividerFn,
        onGetContainerProps?: ?GetContainerPropsFn,
    ) => {
        const {
            fields,
            values,
            fieldsUI,
            validationAttempted,
            id,
            onFieldsValidated,
            onUpdateField,
            onUpdateFieldAsync,
            onUpdateFieldUIOnly,
            validateIfNoUIData,
            children,
            onRenderDivider: extractOnRenderDivider,
            onGetContainerProps: extractOnGetContainerProps,
            onIsValidating,
            onGetValidationContext,
            onCleanUp,
            loadNr,
            ...passOnProps } = this.props;

        const props = field.props || {};
        const fieldUI = fieldsUI[field.id] || {};
        const value = values[field.id];

        const commitFieldHandler = this.commitFieldUpdate.bind(this, field.id);
        const commitEvent = field.commitEvent || 'onBlur';
        const commitPropObject = {
            [commitEvent]: commitFieldHandler,
        };

        const asyncProps = {};

        if (props.async) {
            asyncProps.onCommitAsync = (callback: Function) => this.handleCommitAsync(field.id, props.label, callback);
            asyncProps.asyncUIState = this.asyncUIState[field.id];
        }

        return (
            <div
                key={field.id}
                className={defaultClasses.fieldOuterContainer}
            >
                <div
                    {...onGetContainerProps && onGetContainerProps(index, fields.length, field)}
                >
                    <field.component
                        ref={(fieldInstance) => { this.setFieldInstance(fieldInstance, field.id); }}
                        value={value}
                        errorMessage={fieldUI.errorMessage}
                        touched={fieldUI.touched}
                        validationAttempted={validationAttempted}
                        validatingMessage={fieldUI.validatingMessage}
                        {...commitPropObject}
                        {...props}
                        {...passOnProps}
                        {...asyncProps}
                    />
                </div>

                {onRenderDivider && onRenderDivider(index, fields.length, field)}
            </div>
        );
    }

    renderFields() {
        const { fields, children, onRenderDivider, onGetContainerProps } = this.props;

        if (children) {
            return children(this.renderField, fields);
        }
        // $FlowFixMe
        return fields.map(
            (field, index) =>
                this.renderField(field, index, onRenderDivider, onGetContainerProps),
        );
    }

    render() {
        return (
            <React.Fragment>
                {this.renderFields()}
            </React.Fragment>
        );
    }
}

export default FormBuilder;
