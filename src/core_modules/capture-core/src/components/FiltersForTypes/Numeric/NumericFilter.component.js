// @flow
import React, { Component } from 'react';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import i18n from '@dhis2/d2-i18n';
import Min from './Min.component';
import Max from './Max.component';
import {
    isValidNumber,
    isValidInteger,
    isValidPositiveInteger,
    isValidNegativeInteger,
    isValidZeroOrPositiveInteger,
} from '../../../utils/validators/form';
import elementTypes from '../../../metaData/DataElement/elementTypes';
import type { UpdatableFilterContent } from '../filters.types';

const getStyles = (theme: Theme) => ({
    container: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    inputContainer: {
        width: theme.typography.pxToRem(100),
    },
    toLabelContainer: {
        paddingTop: theme.typography.pxToRem(6),
        paddingLeft: theme.typography.pxToRem(10),
        paddingRight: theme.typography.pxToRem(10),
        fontSize: theme.typography.body1.fontSize,
    },
    error: {
        ...theme.typography.caption,
        color: theme.palette.error.main,
    },
    logicErrorContainer: {
        paddingTop: theme.typography.pxToRem(10),
    },
});

type Props = {
    onCommitValue: (value: ?{ min?: ?string, max?: ?string }) => void,
    onUpdate: (commitValue?: any) => void,
    value: ?{ min?: ?string, max?: ?string},
    type: $Values<typeof elementTypes>,
    classes: {
        container: string,
        inputContainer: string,
        error: string,
        logicErrorContainer: string,
        toLabelContainer: string,
    },
};

// $FlowSuppress
class NumericFilter extends Component<Props> implements UpdatableFilterContent {
    static errorMessages = {
        MIN_GREATER_THAN_MAX: 'Minimum value cannot be greater than maximum value',
        [elementTypes.NUMBER]: 'Please provide a valid number',
        [elementTypes.INTEGER]: 'Please provide a valid integer',
        [elementTypes.INTEGER_POSITIVE]: 'Please provide a positive integer',
        [elementTypes.INTEGER_NEGATIVE]: 'Please provide a negative integer',
        [elementTypes.INTEGER_ZERO_OR_POSITIVE]: 'Please provide zero or a positive integer',
    };

    static validatorForTypes = {
        [elementTypes.NUMBER]: isValidNumber,
        [elementTypes.INTEGER]: isValidInteger,
        [elementTypes.INTEGER_POSITIVE]: isValidPositiveInteger,
        [elementTypes.INTEGER_NEGATIVE]: isValidNegativeInteger,
        [elementTypes.INTEGER_ZERO_OR_POSITIVE]: isValidZeroOrPositiveInteger,
    };

    static validateField(value: ?string, type: $Values<typeof elementTypes>) {
        if (!value) {
            return {
                isValid: true,
                error: null,
            };
        }

        const typeValidator = NumericFilter.validatorForTypes[type];
        const isValid = typeValidator(value);

        return {
            isValid,
            error: isValid ? null : i18n.t(NumericFilter.errorMessages[type]),
        };
    }

    static isFilterValid(minValue?: ?string, maxValue?: ?string, type: $Values<typeof elementTypes>) {
        if (!(NumericFilter.validateField(minValue, type).isValid &&
            NumericFilter.validateField(minValue, type).isValid)) {
            return false;
        }

        return !(minValue && maxValue && Number(minValue) > Number(maxValue));
    }

    static getRequestData(value: { min?: ?string, max?: ?string }) {
        const requestData = [];

        if (value.min) {
            requestData.push(`ge:${value.min}`);
        }
        if (value.max) {
            requestData.push(`le:${value.max}`);
        }

        return requestData;
    }

    static getAppliedText(value: { min?: ?string, max?: ?string }) {
        let appliedText = '';

        if (value.min && value.max) {
            if (Number(value.min) === Number(value.max)) {
                appliedText = value.min;
            } else {
                // $FlowSuppress
                appliedText = `${value.min} ${i18n.t('to')} ${value.max}`;
            }
        } else if (value.min) {
            // $FlowSuppress
            appliedText = `${i18n.t('greater than or equal to')} ${value.min}`;
        } else {
            // $FlowSuppress
            appliedText = `${i18n.t('less than or equal to')} ${value.max}`;
        }

        return appliedText;
    }

    maxD2TextFieldInstance: any;
    onGetUpdateData(updatedValues?: ?{ min?: ?string, max?: ?string }) {
        const value = updatedValues || this.props.value;

        if (!value) {
            return null;
        }

        return {
            requestData: NumericFilter.getRequestData(value),
            // $FlowSuppress
            appliedText: NumericFilter.getAppliedText(value),
        };
    }

    onIsValid() {
        const values = this.props.value;
        return !values || NumericFilter.isFilterValid(values.min, values.max, this.props.type);
    }

    getUpdatedValue(valuePart: {[key: string]: string}) {
        const valueObject = {
            ...this.props.value,
            ...valuePart,
        };

        return Object
            .keys(valueObject)
            .filter(key => valueObject[key])
            .length > 0 ? valueObject : null;
    }

    handleEnterKeyInMin = () => {
        // focus Max
        this.maxD2TextFieldInstance.focus();
    }

    handleEnterKeyInMax = (value: {[key: string]: string}) => {
        // validate with updated values
        const values = this.getUpdatedValue(value);

        if (values && !NumericFilter.isFilterValid(values.min, values.max, this.props.type)) {
            this.props.onCommitValue(values);
        } else {
            this.props.onUpdate(values);
        }
    }

    handleFieldBlur = (value: {[key: string]: string}) => {
        this.props.onCommitValue(this.getUpdatedValue(value));
    }

    setMaxD2TextFieldInstance = (instance: any) => {
        this.maxD2TextFieldInstance = instance;
    }

    getErrors() {
        const values = this.props.value;
        const minValue = values && values.min;
        const maxValue = values && values.max;
        const type = this.props.type;

        const { isValid: isMinValueValid, error: minValueError } = NumericFilter.validateField(minValue, type);
        const { isValid: isMaxValueValid, error: maxValueError } = NumericFilter.validateField(maxValue, type);

        let logicError = null;
        if (isMinValueValid && isMaxValueValid && minValue && maxValue && Number(minValue) > Number(maxValue)) {
            logicError = i18n.t(NumericFilter.errorMessages.MIN_GREATER_THAN_MAX);
        }

        return {
            minValueError,
            maxValueError,
            logicError,
        };
    }

    render() {
        const { value, classes } = this.props;
        const { minValueError, maxValueError, logicError } = this.getErrors();
        return (
            <div>
                <div className={classes.container}>
                    <div
                        className={classes.inputContainer}
                    >
                        { /* $FlowSuppress: Flow not working 100% with HOCs */ }
                        <Min
                            value={value && value.min}
                            error={minValueError}
                            errorClass={classes.error}
                            onBlur={this.handleFieldBlur}
                            onEnterKey={this.handleEnterKeyInMin}
                        />
                    </div>
                    <div
                        className={classes.toLabelContainer}
                    >
                        { i18n.t('to') }
                    </div>
                    <div
                        className={classes.inputContainer}
                    >
                        { /* $FlowSuppress: Flow not working 100% with HOCs */ }
                        <Max
                            value={value && value.max}
                            error={maxValueError}
                            errorClass={classes.error}
                            onBlur={this.handleFieldBlur}
                            onEnterKey={this.handleEnterKeyInMax}
                            textFieldRef={this.setMaxD2TextFieldInstance}
                        />
                    </div>
                </div>
                <div className={classNames(classes.error, classes.logicErrorContainer)}>
                    {logicError}
                </div>
            </div>
        );
    }
}

export default withStyles(getStyles)(NumericFilter);
