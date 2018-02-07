// @flow
import React, { Component } from 'react';
import type { ComponentType } from 'react';
import FormBuilder from './FormBuilder.container';
//import FormBuilder from 'd2-ui/lib/forms/FormBuilder.component';
import buildField from './field/buildField';

import MetaDataElement from '../../metaData/DataElement/DataElement';

import type { FieldConfig } from './field/buildField';

type FieldConfigWithValue = {
    name: string,
    component: ComponentType<any>,
    props: Object,
    value: any
};

type FormsValues = {
    [id: string]: any
};

type Props = {
    fieldsMetaData: Map<string, MetaDataElement>,
    values: FormsValues,
    onUpdateField: (containerId: string, elementId: string, value: any) => void,
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

    handleUpdateField(elementId: string, value: any) {
        this.props.onUpdateField(this.props.formId, elementId, value);
    }

    getFieldConfigWithValue(): Array<FieldConfigWithValue> {
        return this.formFields.map(formField => ({ ...formField, value: this.props.values[formField.name] }));
    }

    render() {
        const { fieldsMetaData, values, onUpdateField, formId, formBuilderId, ...passOnProps } = this.props;

        return (
            <div>
                <FormBuilder
                    ref={(instance) => { this.formBuilderInstance = instance; }}
                    id={formBuilderId}
                    fields={this.getFieldConfigWithValue()}
                    onUpdateField={this.handleUpdateField}
                    validateOnStart
                    useCachedState
                    {...passOnProps}
                />
            </div>
        );
    }
}

export default D2SectionFields;
