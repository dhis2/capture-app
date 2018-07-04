// @flow
/* eslint-disable complexity */
import * as React from 'react';
import isDefined from 'd2-utilizr/lib/isDefined';
import isObject from 'd2-utilizr/lib/isObject';
import { withStyles } from '@material-ui/core/styles';

const styles = () => ({
    fieldContainer: {
        position: 'relative',
    },
});


export type ValidatorContainer = {
    validator: (value: any) => boolean,
    message: string,
};

export type Field = {
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
};

type Props = {
    id: string,
    fields: Array<Field>,
    values: { [id: string]: any },
    fieldsUI: { [id: string]: FieldUI },
    onUpdateFieldAsync: (fieldId: string, formBuilderId: string, callback: Function) => void,
    onUpdateField: (value: any, uiState: FieldUI, fieldId: string, formBuilderId: string) => void,
    onUpdateFieldUIOnly: (uiState: FieldUI, fieldId: string, formBuilderId: string) => void,
    onFieldsValidated: (fieldsUI: { [id: string]: FieldUI }, formBuilderId: string) => void,
    validationAttempted?: ?boolean,
    getContext: (contextType: string) => string,
    validateIfNoUIData?: ?boolean,
    classes: Object,
};

type FieldCommitOptions = {
    touched?: boolean,
};

class FormBuilder extends React.Component<Props> {
    static validateField(field: Field, value: any): { valid: boolean, errorMessage?: string } {
        const validatorResult = (field.validators || [])
            .reduce((pass, currentValidator) => (pass === true
                ? (currentValidator.validator(value) === true || currentValidator.message) : pass
            ), true);

        if (validatorResult !== true) {
            return {
                valid: false,
                errorMessage: validatorResult,
            };
        }

        return {
            valid: true,
        };
    }

    fieldInstances: Map<string, any>;

    constructor(props: Props) {
        super(props);
        this.fieldInstances = new Map();

        if (this.props.validateIfNoUIData) {
            this.props.onFieldsValidated(this.validateAllFields(), this.props.id);
        }
    }

    componentWillReceiveProps(newProps: Props) {
        if (this.props.validateIfNoUIData && newProps.id !== this.props.id) {
            this.props.onFieldsValidated(this.validateAllFields(), this.props.id);
        }
    }

    validateAllFields() {
        const fields = this.props.fields;
        const values = this.props.values;

        return fields.reduce((accFieldsUI, field) => {
            accFieldsUI[field.id] = FormBuilder.validateField(field, values[field.id]);
            return accFieldsUI;
        }, {});
    }

    /**
     * Retreive the field that has the specified field id
     *
     * @param fieldId
     * @returns {}
    */
    getFieldProp(fieldId: string): Field {
        // $FlowSuppress
        return this.props.fields.find(f => f.id === fieldId);
    }

    hasCommitedValueChanged(field: Field, value: any) {
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

    commitFieldUpdate(fieldId: string, value: any, options?: ?FieldCommitOptions) {
        const field = this.getFieldProp(fieldId);
        const touched = options && isDefined(options.touched) ? options.touched : true;

        if (!this.hasCommitedValueChanged(field, value)) {
            this.props.onUpdateFieldUIOnly({ touched }, fieldId, this.props.id);
            return;
        }

        const { valid, errorMessage } = FormBuilder.validateField(field, value);
        this.props.onUpdateField(value, {
            valid,
            touched,
            errorMessage,
        }, fieldId, this.props.id);
    }

    handleCommitAsync = (fieldId: string, callback: Function) => {
        this.props.onUpdateFieldAsync(fieldId, this.props.id, callback);
    }

    /**
     *  Retain a reference to the form field instance
    */
    setFieldInstance(instance, id) {
        if (!instance) {
            if (this.fieldInstances.has(id)) {
                this.fieldInstances.delete(id);
            }
        } else {
            this.fieldInstances.set(id, instance);
        }
    }

    isValid() {
        return Object.keys(this.props.fieldsUI).every(key => this.props.fieldsUI[key].valid);
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

    renderFields() {
        const {
            fields,
            values,
            fieldsUI,
            validationAttempted,
            classes,
            getContext,
            id,
            onFieldsValidated,
            onUpdateField,
            onUpdateFieldAsync,
            onUpdateFieldUIOnly,
            validateIfNoUIData,
            ...passOnProps } = this.props;

        return fields.map((field) => {
            const props = field.props || {};
            const fieldUI = fieldsUI[field.id] || {};
            const value = values[field.id];

            const commitFieldHandler = this.commitFieldUpdate.bind(this, field.id);
            const commitEvent = field.commitEvent || 'onBlur';
            const commitPropObject = {
                [commitEvent]: commitFieldHandler,
            };

            if (props.async) {
                commitPropObject.onCommitAsync = (callback: Function) => this.handleCommitAsync(field.id, callback);
            }

            return (
                <div
                    key={field.id}
                    className={classes.fieldContainer}
                >
                    <field.component
                        ref={(fieldInstance) => { this.setFieldInstance(fieldInstance, field.id); }}
                        value={value}
                        errorMessage={fieldUI.errorMessage}
                        touched={fieldUI.touched}
                        validationAttempted={validationAttempted}
                        getContext={getContext}
                        {...commitPropObject}
                        {...props}
                        {...passOnProps}
                    />
                </div>
            );
        });
    }

    render() {
        return (
            <div>
                {this.renderFields()}
            </div>
        );
    }
}

export default withStyles(styles)(FormBuilder);
