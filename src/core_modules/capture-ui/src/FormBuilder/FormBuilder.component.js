// @flow
/* eslint-disable complexity */
import * as React from 'react';
import isDefined from 'd2-utilizr/lib/isDefined';
import isObject from 'd2-utilizr/lib/isObject';
import defaultClasses from './formBuilder.mod.css';


export type ValidatorContainer = {
    validator: (value: any) => boolean,
    message: string,
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
};

type RenderDividerFn = (index: number, fieldsCount: number, field: FieldConfig) => React.Node;
type GetContainerPropsFn = (index: number, fieldsCount: number, field: FieldConfig) => Object;

type RenderFieldFn = (
    field: FieldConfig,
    index: number,
    onRenderDivider?: ?RenderDividerFn,
    onGetContainerProps?: ?GetContainerPropsFn
) => React.Node

type Props = {
    id: string,
    fields: Array<FieldConfig>,
    values: { [id: string]: any },
    fieldsUI: { [id: string]: FieldUI },
    onUpdateFieldAsync: (fieldId: string, fieldLabel: string, formBuilderId: string, callback: Function) => void,
    onUpdateField: (value: any, uiState: FieldUI, fieldId: string, formBuilderId: string) => void,
    onUpdateFieldUIOnly: (uiState: FieldUI, fieldId: string, formBuilderId: string) => void,
    onFieldsValidated: (fieldsUI: { [id: string]: FieldUI }, formBuilderId: string) => void,
    validationAttempted?: ?boolean,
    validateIfNoUIData?: ?boolean,
    formHorizontal: ?boolean,
    children?: ?(RenderFieldFn, fields: Array<FieldConfig>) => React.Node,
    onRenderDivider?: ?RenderDividerFn,
    onGetContainerProps?: ?GetContainerPropsFn,
    onGetValidationContext: () => ?Object,
};

type FieldCommitOptions = {
    touched?: boolean,
};

class FormBuilder extends React.Component<Props> {
    static async validateField(
        field: FieldConfig,
        value: any,
        validationContext: ?Object,
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

    fieldInstances: Map<string, any>;
    asyncUIState: { [id: string]: FieldUI };

    constructor(props: Props) {
        super(props);
        this.fieldInstances = new Map();
        this.asyncUIState = FormBuilder.getAsyncUIState(this.props.fieldsUI);

        if (this.props.validateIfNoUIData) {
            this.validateAllFields()
                .then((validationResult) => {
                    this.props.onFieldsValidated(validationResult, this.props.id);
                });
        }
    }

    componentWillReceiveProps(newProps: Props) {
        if (newProps.id !== this.props.id) {
            this.asyncUIState = FormBuilder.getAsyncUIState(this.props.fieldsUI);
        } else {
            this.asyncUIState =
                FormBuilder.updateAsyncUIState(this.props.fieldsUI, newProps.fieldsUI, this.asyncUIState);
        }

        if (this.props.validateIfNoUIData &&
            (newProps.id !== this.props.id || newProps.fields.length !== Object.keys(newProps.fieldsUI).length)
        ) {
            this.validateAllFields()
                .then((validationResult) => {
                    this.props.onFieldsValidated(validationResult, this.props.id);
                });
        }
    }

    validateAllFields() {
        const fields = this.props.fields;
        const values = this.props.values;

        const validationContext = this.props.onGetValidationContext();
        const validationPromises = fields
            .map(async (field) => {
                const validationData = await FormBuilder.validateField(field, values[field.id], validationContext);
                return {
                    id: field.id,
                    validationData,
                };
            });

        return Promise
            .all(validationPromises)
            .then(validationContainers => validationContainers
                .reduce((accFieldsUI, container) => {
                    accFieldsUI[container.id] = container.validationData;
                    return accFieldsUI;
                }, {}),
            );
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
        const field = this.getFieldProp(fieldId);
        const touched = options && isDefined(options.touched) ? options.touched : true;

        if (!this.hasCommitedValueChanged(field, value)) {
            this.props.onUpdateFieldUIOnly({ touched }, fieldId, this.props.id);
            return;
        }

        const { valid, errorMessage, errorType } =
            await FormBuilder.validateField(field, value, this.props.onGetValidationContext());

        this.props.onUpdateField(value, {
            valid,
            touched,
            errorMessage,
            errorType,
        }, fieldId, this.props.id);
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
            asyncProps.onUpdateAsyncUIState = (asyncState: Object) => this.handleUpdateAsyncState(field.id, asyncState);
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
