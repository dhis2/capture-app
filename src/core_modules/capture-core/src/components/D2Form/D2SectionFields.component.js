// @flow
import React, { Component } from 'react';
import type { ComponentType } from 'react';
import FormBuilderContainer from './FormBuilder.container';
import FormBuilder from '../../__TEMP__/FormBuilder.component';
import buildField from './field/buildField';

import MetaDataElement from '../../metaData/DataElement/DataElement';
import { messageStateKeys } from '../../reducers/descriptions/rulesEffects.reducerDescription';

import type { FieldConfig } from './field/buildField';

type FormsValues = {
    [id: string]: any
};

type RulesHiddenField = boolean;
type RulesHiddenFields = {
    [id: string]: RulesHiddenField,
};

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
    onUpdateField: (value: any, uiState: Object, elementId: string, formBuilderId: string, formId: string) => void,
    formId: string,
    formBuilderId: string,
};

class D2SectionFields extends Component<Props> {
    static defaultProps = {
        values: {},
    };

    handleUpdateField: (elementId: string, value: any) => void;
    formBuilderInstance: ?FormBuilder;
    formFields: Array<FieldConfig>;

    constructor(props: Props) {
        super(props);
        this.handleUpdateField = this.handleUpdateField.bind(this);
        this.formFields = this.buildFormFields();
    }

    buildFormFields(): Array<FieldConfig> {
        const elements = this.props.fieldsMetaData;
        // $FlowSuppress
        return Array.from(elements.entries())
            .map(entry => entry[1])
            .map(metaDataElement => buildField(metaDataElement))
            .filter(field => field);
    }

    rulesIsValid() {
        const rulesMessages = this.props.rulesMessages;
        const errorMessages = Object.keys(rulesMessages)
            .map(id => rulesMessages[id] && (rulesMessages[id][messageStateKeys.ERROR] || rulesMessages[id][messageStateKeys.ERROR_ON_COMPLETE]))
            .filter(errorMessage => errorMessage);

        return errorMessages.length === 0;
    }

    isValid() {
        const formBuilderIsValid = this.formBuilderInstance ? this.formBuilderInstance.isValid() : false;
        if (formBuilderIsValid) {
            return this.rulesIsValid();
        }
        return false;
    }

    getInvalidFields() {
        const externalInvalidFields = Object.keys(this.props.rulesMessages).reduce((accInvalidFields, key) => {
            if (this.props.rulesMessages[key] && (this.props.rulesMessages[key][messageStateKeys.ERROR] || this.props.rulesMessages[key][messageStateKeys.ERROR_ON_COMPLETE])) {
                accInvalidFields[key] = true;
            }
            return accInvalidFields;
        }, {});

        const invalidFields = this.formBuilderInstance ? this.formBuilderInstance.getInvalidFields(externalInvalidFields) : [];
        return invalidFields;
    }

    handleUpdateField(value: any, uiState: Object, elementId: string, formBuilderId: string) {
        this.props.onUpdateField(value, uiState, elementId, formBuilderId, this.props.formId);
    }

    getFieldConfigWithRulesEffects(): Array<FieldConfig> {
        return this.formFields.map(formField => ({
            ...formField,
            props: {
                ...formField.props,
                hidden: this.props.rulesHiddenFields[formField.id],
                rulesErrorMessage: this.props.rulesMessages[formField.id] && this.props.rulesMessages[formField.id][messageStateKeys.ERROR],
                rulesWarningMessage: this.props.rulesMessages[formField.id] && this.props.rulesMessages[formField.id][messageStateKeys.WARNING],
                rulesErrorMessageOnComplete: this.props.rulesMessages[formField.id] && this.props.rulesMessages[formField.id][messageStateKeys.ERROR_ON_COMPLETE],
                rulesWarningMessageOnComplete: this.props.rulesMessages[formField.id] && this.props.rulesMessages[formField.id][messageStateKeys.WARNING_ON_COMPLETE],
            },
        }));
    }

    render() {
        const { fieldsMetaData, values, onUpdateField, formId, formBuilderId, ...passOnProps } = this.props;

        return (
            <div>
                <FormBuilderContainer
                    innerRef={(instance) => { this.formBuilderInstance = instance; }}
                    id={formBuilderId}
                    fields={this.getFieldConfigWithRulesEffects()}
                    values={values}
                    onUpdateField={this.handleUpdateField}
                    validateIfNoUIData
                    {...passOnProps}
                />
            </div>
        );
    }
}

export default D2SectionFields;
