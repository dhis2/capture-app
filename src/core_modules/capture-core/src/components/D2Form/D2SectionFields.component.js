// @flow
import React, { Component } from 'react';
import FormBuilderContainer from './FormBuilder.container';
import withDivider from './FieldDivider/withDivider';
import withAlternateBackgroundColors from './FieldAlternateBackgroundColors/withAlternateBackgroundColors';
import FormBuilder from '../../__TEMP__/FormBuilderExternalState.component';
import buildField from './field/buildField';

import MetaDataElement from '../../metaData/DataElement/DataElement';
import { messageStateKeys } from '../../reducers/descriptions/rulesEffects.reducerDescription';

import type { Field } from '../../__TEMP__/FormBuilderExternalState.component';

const FormBuilderContainerHOCWrapped = withDivider()(withAlternateBackgroundColors()(FormBuilderContainer));
type FormsValues = {
    [id: string]: any
};

type RulesHiddenField = boolean;
type RulesHiddenFields = {
    [id: string]: RulesHiddenField,
};

type RulesCompulsoryFields = { [id: string]: boolean };

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
    fieldsMetaData: Map<string, MetaDataElement>,
    values: FormsValues,
    rulesMessages: RulesMessages,
    rulesHiddenFields: RulesHiddenFields,
    rulesCompulsoryFields: RulesCompulsoryFields,
    onUpdateField: (value: any, uiState: Object, elementId: string, formBuilderId: string, formId: string) => void,
    onUpdateFieldAsync: (fieldId: string, fieldLabel: string, formBuilderId: string, formId: string, callback: Function) => void,
    formId: string,
    formBuilderId: string,
    formHorizontal: boolean,
    fieldOptions?: ?Object,
};

class D2SectionFields extends Component<Props> {
    static defaultProps = {
        values: {},
    };

    handleUpdateField: (elementId: string, value: any) => void;
    formBuilderInstance: ?FormBuilder;
    formFields: Array<Field>;
    rulesCompulsoryErrors: { [elementId: string]: boolean };

    constructor(props: Props) {
        super(props);
        this.handleUpdateField = this.handleUpdateField.bind(this);
        this.formFields = this.buildFormFields();
        this.rulesCompulsoryErrors = {};
    }

    buildFormFields(): Array<Field> {
        const elements = this.props.fieldsMetaData;

        // $FlowSuppress :does not recognize filter removing nulls
        return Array.from(elements.entries())
            .map(entry => entry[1])
            .map(metaDataElement => buildField(metaDataElement, { formHorizontal: this.props.formHorizontal, ...this.props.fieldOptions }))
            .filter(field => field);
    }

    rulesIsValid() {
        const rulesMessages = this.props.rulesMessages;
        const errorMessages = Object.keys(rulesMessages)
            .map(id => rulesMessages[id] &&
                (rulesMessages[id][messageStateKeys.ERROR] || rulesMessages[id][messageStateKeys.ERROR_ON_COMPLETE]))
            .filter(errorMessage => errorMessage);

        return errorMessages.length === 0 && Object.keys(this.rulesCompulsoryErrors).length === 0;
    }

    isValid() {
        const formBuilderIsValid = this.formBuilderInstance ? this.formBuilderInstance.isValid() : false;
        if (formBuilderIsValid) {
            return this.rulesIsValid();
        }
        return false;
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

    handleUpdateField(value: any, uiState: Object, elementId: string, formBuilderId: string) {
        this.props.onUpdateField(value, uiState, elementId, formBuilderId, this.props.formId);
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

    getFieldConfigWithRulesEffects(): Array<Field> {
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
            rulesHiddenFields,
            rulesMessages,
            onUpdateFieldAsync,
            fieldOptions,
            ...passOnProps } = this.props;

        this.buildRulesCompulsoryErrors();

        return (
            <FormBuilderContainerHOCWrapped
                formBuilderRef={(instance) => { this.formBuilderInstance = instance; }}
                id={formBuilderId}
                fields={this.getFieldConfigWithRulesEffects()}
                values={values}
                onUpdateField={this.handleUpdateField}
                onUpdateFieldAsync={this.handleUpdateFieldAsync}
                validateIfNoUIData
                {...passOnProps}
            />
        );
    }
}

export default D2SectionFields;
