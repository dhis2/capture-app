// @flow
import React, { Component } from 'react';
import log from 'loglevel';
import { errorCreator } from 'capture-core-utils';
import type { FormBuilder, FieldConfig } from 'capture-ui/FormBuilder/FormBuilder.component';
import { FormBuilderContainer } from './FormBuilder.container';
import { withDivider } from './FieldDivider/withDivider';
import { withAlternateBackgroundColors } from './FieldAlternateBackgroundColors/withAlternateBackgroundColors';
import { withCustomForm } from './D2CustomForm/withCustomForm';
import { buildField } from './field/buildField';
import { validationStrategies } from '../../metaData/RenderFoundation/renderFoundation.const';
import type { DataElement, CustomForm } from '../../metaData';
import { messageStateKeys } from '../../reducers/descriptions/rulesEffects.reducerDescription';
import { validatorTypes } from './field/validators/constants';

const CustomFormHOC = withCustomForm()(withDivider()(withAlternateBackgroundColors()(FormBuilderContainer)));
type FormsValues = {
    [id: string]: any
};

type RulesHiddenField = boolean;
type RulesHiddenFields = {
    [id: string]: RulesHiddenField,
};

type RulesCompulsoryFields = { [id: string]: boolean };
type RulesDisabledFields = { [id: string]: boolean };

type RulesMessage = {
    error?: ?string,
    warning?: ?string,
    errorOnComplete?: ?string,
    warningOnComplete?: ?string,
}
type RulesMessages = {
    [id: string]: ?RulesMessage,
};

type Props = {
    fieldsMetaData: Map<string, DataElement>,
    values: FormsValues,
    rulesMessages: RulesMessages,
    rulesHiddenFields: RulesHiddenFields,
    rulesCompulsoryFields: RulesCompulsoryFields,
    rulesDisabledFields: RulesDisabledFields,
    onUpdateField: (value: any, uiState: Object, elementId: string, formBuilderId: string, formId: string, updateCompletePromise: ?Promise<any>) => void,
    onUpdateFieldAsync: (fieldId: string, fieldLabel: string, formBuilderId: string, formId: string, callback: Function) => void,
    formId: string,
    formBuilderId: string,
    formHorizontal: boolean,
    fieldOptions?: ?Object,
    customForm: CustomForm,
    validationStrategy: $Values<typeof validationStrategies>,
    loadNr: number,
    viewMode?: ?boolean,
};

export class D2SectionFieldsComponent extends Component<Props> {
    static buildFormFields(props: Props): Array<FieldConfig> {
        const { fieldsMetaData, customForm, fieldOptions } = props;

        return Array.from(fieldsMetaData.entries())
            .map(entry => entry[1])
            // $FlowFixMe[incompatible-return] automated comment
            .map(metaDataElement => buildField(
                metaDataElement,
                {
                    formHorizontal: props.formHorizontal,
                    formId: props.formId,
                    viewMode: props.viewMode,
                    ...fieldOptions,
                },
                !!customForm,
            ))
            .filter(field => field);
    }

    static validateBaseOnly(formBuilderInstance: FormBuilder) {
        return formBuilderInstance.isValid([validatorTypes.TYPE_BASE]);
    }

    handleUpdateField: (elementId: string, value: any) => void;
    formBuilderInstance: ?FormBuilder;
    formFields: Array<FieldConfig>;
    rulesCompulsoryErrors: { [elementId: string]: boolean };

    static defaultProps = {
        values: {},
    };

    constructor(props: Props) {
        super(props);
        this.handleUpdateField = this.handleUpdateField.bind(this);
        this.formFields = D2SectionFieldsComponent.buildFormFields(this.props);
        this.rulesCompulsoryErrors = {};
    }

    UNSAFE_componentWillReceiveProps(newProps: Props) {
        if (newProps.fieldsMetaData !== this.props.fieldsMetaData) {
            this.formFields = D2SectionFieldsComponent.buildFormFields(newProps);
        }
    }

    rulesIsValid() {
        const rulesMessages = this.props.rulesMessages;
        const errorMessages = Object.keys(rulesMessages)
            .map(id => rulesMessages[id] &&
                (rulesMessages[id][messageStateKeys.ERROR]))
            .filter(errorMessage => errorMessage);

        return errorMessages.length === 0 && Object.keys(this.rulesCompulsoryErrors).length === 0;
    }

    validateFull(formBuilderInstance: FormBuilder) {
        const formBuilderIsValid = formBuilderInstance.isValid();
        if (!formBuilderIsValid) {
            return false;
        }

        return this.rulesIsValid();
    }

    isValid(options?: ?{ isCompleting: boolean }) {
        const formBuilderInstance = this.formBuilderInstance;
        if (!formBuilderInstance) {
            log.error(
                errorCreator(
                    'could not get formbuilder instance')(
                    {
                        method: 'isValid',
                        object: this,
                    },
                ),
            );
            return false;
        }
        return this.validateBasedOnStrategy(options, formBuilderInstance);
    }

    validateBasedOnStrategy(options?: ?{ isCompleting: boolean }, formBuilderInstance: FormBuilder) {
        const validationStrategy = this.props.validationStrategy;
        if (validationStrategy === validationStrategies.NONE) {
            return D2SectionFieldsComponent.validateBaseOnly(formBuilderInstance);
        } else if (validationStrategy === validationStrategies.ON_COMPLETE) {
            const isCompleting = options && options.isCompleting;
            if (isCompleting) {
                return this.validateFull(formBuilderInstance);
            }
            return D2SectionFieldsComponent.validateBaseOnly(formBuilderInstance);
        }
        return this.validateFull(formBuilderInstance);
    }

    getInvalidFields() {
        const messagesInvalidFields = Object.keys(this.props.rulesMessages).reduce((accInvalidFields, key) => {
            if (this.props.rulesMessages[key] &&
                    (this.props.rulesMessages[key][messageStateKeys.ERROR] ||
                        this.props.rulesMessages[key][messageStateKeys.ERROR_ON_COMPLETE])) {
                accInvalidFields[key] = true;
            }
            return accInvalidFields;
        }, {});

        const rulesCompulsoryInvalidFields =
            Object.keys(this.rulesCompulsoryErrors).reduce((accCompulsoryInvalidFields, key) => {
                accCompulsoryInvalidFields[key] = true;
                return accCompulsoryInvalidFields;
            }, {});

        const externalInvalidFields = { ...messagesInvalidFields, ...rulesCompulsoryInvalidFields };

        const invalidFields = this.formBuilderInstance ?
            this.formBuilderInstance.getInvalidFields(externalInvalidFields) : [];
        return invalidFields;
    }

    handleUpdateField(
        value: any,
        uiState: Object,
        elementId: string,
        formBuilderId: string,
        updateCompletePromise: ?Promise<any>,
    ) {
        this.props.onUpdateField(value, uiState, elementId, formBuilderId, this.props.formId, updateCompletePromise);
    }

    handleUpdateFieldAsync = (fieldId: string, fieldLabel: string, formBuilderId: string, callback: Function) => {
        this.props.onUpdateFieldAsync(fieldId, fieldLabel, formBuilderId, this.props.formId, callback);
    }

    buildRulesCompulsoryErrors() {
        const rulesCompulsory = this.props.rulesCompulsoryFields;
        const values = this.props.values;

        this.rulesCompulsoryErrors = Object.keys(rulesCompulsory)
            .reduce((accCompulsoryErrors, key) => {
                const isCompulsory = rulesCompulsory[key];
                if (isCompulsory) {
                    const value = values[key];
                    if (!value && value !== 0 && value !== false) {
                        accCompulsoryErrors[key] = 'This field is required';
                    }
                }
                return accCompulsoryErrors;
            }, {});
    }

    getFieldConfigWithRulesEffects(): Array<FieldConfig> {
        return this.formFields.map(formField => ({
            ...formField,
            props: {
                ...formField.props,
                hidden: this.props.rulesHiddenFields[formField.id],
                rulesErrorMessage:
                    this.props.rulesMessages[formField.id] &&
                    this.props.rulesMessages[formField.id][messageStateKeys.ERROR],
                rulesWarningMessage:
                    this.props.rulesMessages[formField.id] &&
                    this.props.rulesMessages[formField.id][messageStateKeys.WARNING],
                rulesErrorMessageOnComplete:
                    this.props.rulesMessages[formField.id] &&
                    this.props.rulesMessages[formField.id][messageStateKeys.ERROR_ON_COMPLETE],
                rulesWarningMessageOnComplete:
                    this.props.rulesMessages[formField.id] &&
                    this.props.rulesMessages[formField.id][messageStateKeys.WARNING_ON_COMPLETE],
                rulesCompulsory: this.props.rulesCompulsoryFields[formField.id],
                rulesCompulsoryError: this.rulesCompulsoryErrors[formField.id],
                rulesDisabled: this.props.rulesDisabledFields[formField.id],
            },
        }));
    }

    render() {
        const {
            fieldsMetaData,
            values,
            onUpdateField,
            formId,
            formBuilderId,
            rulesCompulsoryFields,
            rulesDisabledFields,
            rulesHiddenFields,
            rulesMessages,
            onUpdateFieldAsync,
            fieldOptions,
            validationStrategy,
            loadNr,
            ...passOnProps } = this.props;

        this.buildRulesCompulsoryErrors();

        return (
            // $FlowFixMe[cannot-spread-inexact] automated comment
            <CustomFormHOC
                formBuilderRef={(instance) => { this.formBuilderInstance = instance; }}
                id={formBuilderId}
                fields={this.getFieldConfigWithRulesEffects()}
                values={values}
                onUpdateField={this.handleUpdateField}
                onUpdateFieldAsync={this.handleUpdateFieldAsync}
                validateIfNoUIData
                loadNr={loadNr}
                {...passOnProps}
            />
        );
    }
}
