/* eslint-disable complexity */
import i18n from '@dhis2/d2-i18n';
import log from 'loglevel';
import { v4 as uuid } from 'uuid';
import * as React from 'react';
import { makeCancelablePromise } from 'capture-core-utils';
import isDefined from 'd2-utilizr/lib/isDefined';
import isObject from 'd2-utilizr/lib/isObject';
import { FormField, FormPlugin } from './components';
import type {
    ErrorData,
    PostProcessErrorMessage,
    FieldConfig,
    FieldCommitOptions,
    FieldCommitOptionsExtended,
    FieldUI,
} from './formbuilder.types';
import type { PluginContext } from '../FormFieldPlugin/FormFieldPlugin.types';
import { getValidators, validateValue, validatorTypes } from '../../../utils/validation';
import type { ValidatorContainer } from '../../../utils/validation';
import type { DataElement } from '../../../metaData';
import type { QuerySingleResource } from '../../../utils/api';
import type { RuleEffects } from '../D2Form.types';

type CancelablePromise<T> = {
    promise: Promise<T>;
    cancel: () => void;
};

type RenderDividerFn = (index: number, fieldsCount: number, hidden: boolean) => React.ReactNode;
type GetContainerPropsFn = (index: number, fieldsCount: number, hidden: boolean) => any;

type FieldCommitConfig = {
    readonly fieldId: string;
    readonly validators?: Array<ValidatorContainer>;
    readonly onIsEqual?: ((newValue: any, oldValue: any) => boolean) | null;
};

type RenderFieldFn = (
    field: FieldConfig,
    index: number,
    onRenderDivider?: RenderDividerFn | null,
    onGetContainerProps?: GetContainerPropsFn | null
) => React.ReactNode;

type IsValidatingFn = (
    fieldId: string,
    formBuilderId: string,
    validatingUid: string,
    message: string | null,
    fieldUIUpdates: FieldUI | null,
) => void;

type Props = {
    id: string;
    fields: Array<FieldConfig>;
    values: { [id: string]: any };
    fieldsUI: { [id: string]: FieldUI };
    ruleEffects: RuleEffects;
    onUpdateFieldAsync: (
        fieldId: string,
        fieldLabel: string,
        formBuilderId: string,
        callback: (...args: any[]) => any
    ) => void;
    onUpdateField: (
        value: any,
        uiState: FieldUI,
        fieldId: string,
        formBuilderId: string,
        promiseForIsValidating: string
    ) => void;
    onUpdateFieldUIOnly: (uiState: FieldUI, fieldId: string, formBuilderId: string) => void;
    onFieldsValidated?: ((
        fieldsUI: { [id: string]: FieldUI },
        formBuilderId: string,
        uidsForIsValidating: Array<string>
    ) => void) | null;
    querySingleResource: QuerySingleResource;
    validationAttempted?: boolean | null;
    validateIfNoUIData?: boolean | null;
    formHorizontal: boolean | null;
    children?: ((renderFieldFn: RenderFieldFn, fields: Array<FieldConfig>) => React.ReactNode) | null;
    onRenderDivider?: RenderDividerFn | null;
    onGetContainerProps?: GetContainerPropsFn | null;
    onGetValidationContext?: (() => any | null) | null;
    onIsValidating: IsValidatingFn | null;
    expiryPeriod: any;
    pluginContext?: PluginContext;
    loadNr: number;
    onPostProcessErrorMessage?: PostProcessErrorMessage;
};

type FieldValidatingContainer = {
    cancelableValidatingPromise?: CancelablePromise<any> | null;
    validatingCompleteUid: string;
};

type FieldsValidatingPromiseContainer = { [fieldId: string]: FieldValidatingContainer | null };

export class FormBuilder extends React.Component<Props> {
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
                const fieldValidatingPromiseContainer: any = fieldsValidatingPromiseContainer[fieldId] || {};
                fieldsValidatingPromiseContainer[fieldId] = fieldValidatingPromiseContainer;

                if (!fieldValidatingPromiseContainer.validatingCompleteUid) {
                    fieldValidatingPromiseContainer.validatingCompleteUid = uuid();
                }
                fieldValidatingPromiseContainer.cancelableValidatingPromise &&
                fieldValidatingPromiseContainer.cancelableValidatingPromise.cancel();

                const handleIsValidatingInternal = (message: string | null, promise: Promise<any>) => {
                    fieldValidatingPromiseContainer.cancelableValidatingPromise = makeCancelablePromise(promise);
                    onIsValidating && onIsValidating(
                        field.id,
                        id,
                        fieldValidatingPromiseContainer.validatingCompleteUid,
                        message,
                        null,
                    );

                    return fieldValidatingPromiseContainer.cancelableValidatingPromise!.promise;
                };

                let validationData;
                try {
                    validationData = await validateValue({
                        validators: field.validators,
                        value: values[field.id],
                        validationContext,
                        postProcessAsyncValidatonInitiation: handleIsValidatingInternal,
                    });
                } catch (reason: any) {
                    if (reason && isObject(reason) && reason.isCanceled) {
                        validationData = null;
                    } else {
                        validationData = {
                            valid: false,
                            errorMessage: [i18n.t('error encountered during field validation')],
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
            .then(validationContainers =>
                validationContainers.filter(
                    validationContainer =>
                        !!validationContainer.validationData) as Array<{id: string; validationData: any}>,
            );
    }

    static hasCommitedValueChanged(
        value: any,
        oldValue: any,
        onIsEqual: ((newVal: any, oldVal: any) => boolean) | null | undefined,
    ) {
        let valueChanged = true;

        if (!isObject(value)) {
            if ((value || '') === (oldValue || '')) {
                valueChanged = false;
            }
        } else if (onIsEqual && onIsEqual(value, oldValue)) {
            valueChanged = false;
        }

        return valueChanged;
    }

    fieldInstances: Map<string, any>;
    fieldsValidatingPromiseContainer: FieldsValidatingPromiseContainer;
    commitUpdateTriggeredForFields: { [fieldId: string]: boolean };
    ruleMessages: { [fieldId: string]: any };

    constructor(props: Props) {
        super(props);
        this.fieldInstances = new Map();
        this.fieldsValidatingPromiseContainer = {};
        this.commitUpdateTriggeredForFields = {};
        this.ruleMessages = {};

        if (this.props.validateIfNoUIData) {
            this.validateAllFields(this.props);
        }
    }

    componentDidUpdate(prevProps: Readonly<Props>): void {
        if (prevProps.id !== this.props.id || prevProps.loadNr !== this.props.loadNr) {
            this.commitUpdateTriggeredForFields = {};
            if (this.props.validateIfNoUIData) {
                this.validateAllFields(this.props);
            }
        }
    }

    validateAllCancelablePromise: CancelablePromise<any> | null = null;

    getCleanUpData() {
        const remainingCompleteUids: Array<string> = Object
            .keys(this.fieldsValidatingPromiseContainer)
            .map((key) => {
                const { cancelableValidatingPromise, validatingCompleteUid }: any =
                    this.fieldsValidatingPromiseContainer[key] || {};
                cancelableValidatingPromise && cancelableValidatingPromise.cancel();
                return validatingCompleteUid;
            })
            .filter(promise => !!promise) as Array<string>;

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

        this.validateAllCancelablePromise && this.validateAllCancelablePromise
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
    getFieldProp(fieldId: string): FieldConfig | undefined {
        return this.props.fields.find(f => f.id === fieldId);
    }

    commitFieldUpdateFromDataElement(
        fieldId: string,
        value: any,
        oldValue: any,
        options?: FieldCommitOptions | null,
    ) {
        const { validators, onIsEqual }: any = this.getFieldProp(fieldId);
        this.commitFieldUpdate({ fieldId, validators, onIsEqual }, value, oldValue, options);
    }

    commitFieldUpdateFromPlugin(
        fieldMetadata: DataElement,
        value: any,
        oldValue: any,
        options?: FieldCommitOptions | null,
    ) {
        const { id: fieldId } = fieldMetadata;
        const { querySingleResource } = this.props;
        const validators = getValidators(fieldMetadata, querySingleResource);

        this.commitFieldUpdate({ fieldId, validators }, value, oldValue, { ...options, plugin: true });
    }

    async commitFieldUpdate(
        { fieldId, validators, onIsEqual }: FieldCommitConfig,
        value: any,
        oldValue: any,
        options?: FieldCommitOptionsExtended | null,
    ) {
        const {
            onUpdateFieldUIOnly,
            onUpdateField,
            onGetValidationContext,
            id,
            onIsValidating,
        } = this.props;

        const touched = options && isDefined(options.touched) ? options.touched : true;

        if (!FormBuilder.hasCommitedValueChanged(value, oldValue, onIsEqual)) {
            onUpdateFieldUIOnly({ touched }, fieldId, id);
            return;
        }

        const fieldValidatingPromiseContainer: any = this.fieldsValidatingPromiseContainer[fieldId] || {};
        this.fieldsValidatingPromiseContainer[fieldId] = fieldValidatingPromiseContainer;
        if (!fieldValidatingPromiseContainer.validatingCompleteUid) {
            fieldValidatingPromiseContainer.validatingCompleteUid = uuid();
        }
        fieldValidatingPromiseContainer.cancelableValidatingPromise &&
        fieldValidatingPromiseContainer.cancelableValidatingPromise.cancel();

        const handleIsValidatingInternal = (message: string | null, promise: Promise<any>) => {
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
            return fieldValidatingPromiseContainer.cancelableValidatingPromise!.promise;
        };

        const updateField = ({ valid, errorMessage, errorType, errorData }) => {
            onUpdateField(
                value,
                {
                    valid,
                    touched,
                    errorMessage,
                    errorType,
                    errorData,
                },
                fieldId,
                id,
                fieldValidatingPromiseContainer.validatingCompleteUid,
            );
            this.fieldsValidatingPromiseContainer[fieldId] = null;
        };

        this.commitUpdateTriggeredForFields[fieldId] = true;

        options?.plugin && (options.error || options.valid === false) ?
            updateField({
                valid: false,
                errorMessage: options.error,
                errorType: validatorTypes.TYPE_BASE,
                errorData: undefined }) :
            (await validateValue({
                validators,
                value,
                validationContext: onGetValidationContext && onGetValidationContext(),
                postProcessAsyncValidatonInitiation: handleIsValidatingInternal,
                commitOptions: options,
            })
                .then(({ valid, errorMessage, errorType, errorData }: any) => {
                    updateField({ valid, errorMessage, errorType, errorData });
                })
                .catch((reason: any) => {
                    if (!reason || !isObject(reason) || !reason.isCanceled) {
                        log.error({ reason, fieldId, value });
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
                }));
    }

    handleUpdateAsyncState = (fieldId: string, asyncStateToAdd: any) => {
        this.props.onUpdateFieldUIOnly(asyncStateToAdd, fieldId, this.props.id);
    }

    handleCommitAsync = (fieldId: string, fieldLabel: string, callback: (...args: any[]) => any) => {
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

    isValid(typesToCheck?: Array<string> | null) {
        return Object
            .keys(this.props.fieldsUI)
            .every((key) => {
                const fieldUI = this.props.fieldsUI[key];
                if (typesToCheck) {
                    const isCheckable = typesToCheck.includes(fieldUI.errorType || '');
                    if (!isCheckable) {
                        return true;
                    }
                }
                return fieldUI.valid;
            });
    }

    getInvalidFields(externalInvalidFields?: { [id: string]: boolean } | null) {
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
        }, [] as Array<{ prop: FieldConfig; instance: any; uiState: FieldUI }>);
    }

    getRuleMessages(fieldId, ruleMessage) {
        if (!ruleMessage) {
            this.ruleMessages[fieldId] = null;
            return null;
        }

        const prevRuleMessage = this.ruleMessages[fieldId];
        if (!prevRuleMessage) {
            this.ruleMessages[fieldId] = ruleMessage;
            return ruleMessage;
        }

        if (Object.keys(ruleMessage).some(key => {
            const currentMessage = ruleMessage[key];
            const prevMessage = prevRuleMessage[key];
            if (Array.isArray(currentMessage)) {
                if (!Array.isArray(prevMessage) || prevMessage.length != currentMessage.length) {
                    return false;
                }
                return currentMessage.some((value, index) => value !== prevMessage[index]);
            } else {
                return currentMessage !== prevMessage;
            }
        })) {
            this.ruleMessages[fieldId] = ruleMessage;
            return ruleMessage;
        }

        return this.ruleMessages[fieldId]
    }

    renderPlugin = (
        field: FieldConfig,
    ) => (
        <FormPlugin
            field={field}
            handleCommitField={this.commitFieldUpdateFromPlugin}
            pluginContext={this.props.pluginContext}
            formThis={this}
        />
    );

    renderField = (
        field: FieldConfig,
        index: number,
    ) => {
        const {
            fields,
            values,
            fieldsUI,
            validationAttempted,
            id,
            ruleEffects,
            onFieldsValidated,
            onUpdateField,
            onUpdateFieldAsync,
            onUpdateFieldUIOnly,
            validateIfNoUIData,
            children,
            onRenderDivider,
            onGetContainerProps,
            onIsValidating,
            onGetValidationContext,
            onPostProcessErrorMessage,
            expiryPeriod,
            pluginContext,
            loadNr,
            ...passOnProps } = this.props;

        const props = field.props || {};
        const value = values[field.id];
        const hidden = ruleEffects.hiddenFields[field.id];
        const alternatingBackgroundColor = onGetContainerProps ? onGetContainerProps(index, length, hidden) : null;

        return (
            <FormField
                field={field}
                value={value}
                formId={id}
                index={index}
                length={fields.length}
                hidden={hidden}
                rulesMessage={this.getRuleMessages(field.id, ruleEffects.messages[field.id])}
                rulesCompulsory={ruleEffects.compulsoryFields[field.id]}
                rulesCompulsoryError={ruleEffects.compulsoryErrors[field.id]}
                rulesDisabled={ruleEffects.disabledFields[field.id]}
                alternatingBackgroundColor={alternatingBackgroundColor}
                onRenderDivider={onRenderDivider}
                onUpdateFieldAsync={onUpdateFieldAsync}
                onPostProcessErrorMessage={onPostProcessErrorMessage}
                setFieldInstance={this.setFieldInstance}
                validationAttempted={validationAttempted}
                commitFieldHandler={this.commitFieldUpdateFromDataElement}
                fieldProps={props}
                formThis={this}
                {...passOnProps}
            />
        );
    }

    renderFields() {
        const { fields, children } = this.props;

        if (children) {
            return children(this.renderField, fields);
        }
        return fields.map(
            (field, index) => {
                if (field.plugin && field.props) {
                    return this.renderPlugin(field);
                }

                return this.renderField(field, index);
            },
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
