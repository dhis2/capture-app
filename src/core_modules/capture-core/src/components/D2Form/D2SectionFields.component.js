// @flow
import React, { Component } from 'react';
import type { ComponentType } from 'react';
import FormBuilderContainer from './FormBuilder.container';
import FormBuilder from '../../__TEMP__/FormBuilder.component';
//import FormBuilder from 'd2-ui/lib/forms/FormBuilder.component';
import buildField from './field/buildField';

import MetaDataElement from '../../metaData/DataElement/DataElement';

import type { FieldConfig } from './field/buildField';

type FormsValues = {
    [id: string]: any
};

type RulesHiddenField = boolean;
type RulesHiddenFields = {
    [id: string]: RulesHiddenField,
};

type RulesErrorMessage = string;
type RulesErrorMessages = {
    [id: string]: RulesErrorMessage,
};

type Props = {
    fieldsMetaData: Map<string, MetaDataElement>,
    values: FormsValues,
    rulesErrorMessages: RulesErrorMessages,
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
        const rulesErrorMessages = this.props.rulesErrorMessages;
        return Object.keys(rulesErrorMessages).length === 0;
    }

    isValid() {
        const formBuilderIsValid = this.formBuilderInstance ? this.formBuilderInstance.isValid() : false;
        if (formBuilderIsValid) {
            return this.rulesIsValid();
        }
        return false;
    }

    getInvalidFields() {
        const externalInvalidFields = Object.keys(this.props.rulesErrorMessages).reduce((accInvalidFields, key) => {
            accInvalidFields[key] = true;
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
                rulesErrorMessage: this.props.rulesErrorMessages[formField.id],
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
