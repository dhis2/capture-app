import React, { Component } from 'react';
import log from 'loglevel';
import { errorCreator } from 'capture-core-utils';
import type { FormBuilder } from './FormBuilder/FormBuilder.component';
import type { FieldConfig } from './FormBuilder';
import { FormBuilderContainer } from './FormBuilder/FormBuilder.container';
import { withDivider } from './FieldDivider/withDivider';
import { withAlternateBackgroundColors } from './FieldAlternateBackgroundColors/withAlternateBackgroundColors';
import { withCustomForm } from './D2CustomForm/withCustomForm';
import { buildField } from './field/buildField';
import { validationStrategies } from '../../metaData/RenderFoundation/renderFoundation.const';
import type { CustomForm, DataElement } from '../../metaData';
import { messageStateKeys } from '../../reducers/descriptions/rulesEffects.reducerDescription';
import { validatorTypes } from '../../utils/validation/constants';
import type { QuerySingleResource } from '../../utils/api/api.types';
import { FormFieldPlugin } from './FormFieldPlugin';
import { FormFieldPluginConfig } from '../../metaData/FormFieldPluginConfig';
import type { RuleEffects } from './D2Form.types';

const CustomFormHOC = withCustomForm()(withDivider()(withAlternateBackgroundColors()(FormBuilderContainer))) as any;

const styles = {
    horizontalSection: {
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'flex-start',
    },
};

type FormsValues = {
    [id: string]: any
};

type Props = {
    fieldsMetaData: Map<string, DataElement | FormFieldPluginConfig>,
    values: FormsValues,
    ruleEffects: RuleEffects,
    onUpdateField: (
        value: any,
        uiState: any,
        elementId: string,
        formBuilderId: string,
        formId: string,
        updateCompletePromise: Promise<any> | null
    ) => void,
    onUpdateFieldAsync: (
        fieldId: string,
        fieldLabel: string,
        formBuilderId: string,
        formId: string,
        callback: (...args: any[]) => any
    ) => void,
    formId: string,
    formBuilderId: string,
    formHorizontal: boolean,
    fieldOptions?: any | null,
    customForm: CustomForm,
    validationStrategy: typeof validationStrategies[keyof typeof validationStrategies],
    loadNr: number,
    viewMode?: boolean | null,
    querySingleResource: QuerySingleResource,
};

export class D2SectionFieldsComponent extends Component<Props> {
    static validateBaseOnly(formBuilderInstance: FormBuilder) {
        return formBuilderInstance.isValid([validatorTypes.TYPE_BASE]);
    }

    formFields: Array<FieldConfig>;
    formFieldCache: { [elementId: string]: FieldConfig } = {};
    rulesCompulsoryErrors: { [elementId: string]: boolean };

    static defaultProps = {
        values: {},
    };

    constructor(props: Props) {
        super(props);
        this.handleUpdateField = this.handleUpdateField.bind(this);
        this.formFields = this.buildFormFields(this.props);
        this.formFieldCache = {};
        this.rulesCompulsoryErrors = {};
    }

    UNSAFE_componentWillReceiveProps(newProps: Props) {
        if (this.formFieldCache && newProps.fieldsMetaData !== this.props.fieldsMetaData) {
            this.formFields = this.buildFormFields(newProps);
        }
    }
    formBuilderInstance: FormBuilder | null = null;

    buildFormFields(props: Props): Array<FieldConfig> {
        const { fieldsMetaData, customForm, fieldOptions, querySingleResource } = props;

        const buildFormField = (metaDataElement: DataElement | FormFieldPluginConfig) => {
            if (metaDataElement instanceof FormFieldPluginConfig) {
                return ({
                    id: metaDataElement.id,
                    component: FormFieldPlugin,
                    plugin: true,
                    props: {
                        pluginId: metaDataElement.id,
                        name: metaDataElement.name,
                        pluginSource: metaDataElement.pluginSource,
                        fieldsMetadata: metaDataElement.fields,
                        customAttributes: metaDataElement.customAttributes,
                        formId: props.formId,
                        viewMode: props.viewMode,
                    },
                });
            }

            return buildField(
                metaDataElement,
                {
                    formHorizontal: props.formHorizontal,
                    formId: props.formId,
                    viewMode: props.viewMode,
                    ...fieldOptions,
                },
                !!customForm,
                querySingleResource,
            );
        };

        return Array.from(fieldsMetaData.entries())
            .map(entry => entry[1])
            .map((metaDataElement) => {
                if (!this.formFieldCache[metaDataElement.id]) {
                    this.formFieldCache[metaDataElement.id] = buildFormField(metaDataElement);
                }
                return this.formFieldCache[metaDataElement.id];
            })
            .filter(field => field);
    }

    rulesIsValid() {
        const rulesMessages = this.props.ruleEffects.messages;
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

    isValid(options?: { isCompleting: boolean } | null) {
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

    validateBasedOnStrategy(options: { isCompleting: boolean } | null | undefined, formBuilderInstance: FormBuilder) {
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
        const rulesMessages = this.props.ruleEffects.messages;
        const messagesInvalidFields = Object.keys(rulesMessages).reduce((accInvalidFields, key) => {
            if (rulesMessages[key] &&
                (rulesMessages[key][messageStateKeys.ERROR] ||
                    rulesMessages[key][messageStateKeys.ERROR_ON_COMPLETE])) {
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
        uiState: any,
        elementId: string,
        formBuilderId: string,
        updateCompletePromise: Promise<any> | null,
    ) {
        this.props.onUpdateField(value, uiState, elementId, formBuilderId, this.props.formId, updateCompletePromise);
    }

    handleUpdateFieldAsync = (
        fieldId: string,
        fieldLabel: string,
        formBuilderId: string,
        callback: (...args: any[]) => any,
    ) => {
        this.props.onUpdateFieldAsync(fieldId, fieldLabel, formBuilderId, this.props.formId, callback);
    }

    buildRulesCompulsoryErrors() {
        const rulesCompulsory = this.props.ruleEffects.compulsoryFields;
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

    render() {
        const {
            fieldsMetaData,
            values,
            ruleEffects,
            onUpdateField,
            formId,
            onUpdateFieldAsync,
            fieldOptions,
            validationStrategy,
            loadNr,
            ...passOnProps } = this.props;

        this.buildRulesCompulsoryErrors();

        return (
            <div
                data-test="d2-section-fields"
                style={this.props.formHorizontal ? styles.horizontalSection as any : {}}
            >
                <CustomFormHOC
                    formBuilderRef={(instance) => { this.formBuilderInstance = instance; }}
                    id={formId}
                    fields={this.formFields}
                    ruleEffects={({ ...ruleEffects, compulsoryErrors: this.rulesCompulsoryErrors })}
                    onUpdateField={this.handleUpdateField}
                    onUpdateFieldAsync={this.handleUpdateFieldAsync}
                    validateIfNoUIData
                    loadNr={loadNr}
                    {...passOnProps}
                />
            </div>
        );
    }
}
