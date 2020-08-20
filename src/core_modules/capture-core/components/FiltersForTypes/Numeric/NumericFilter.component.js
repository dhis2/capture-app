// @flow
import React, { Component } from 'react';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import i18n from '@dhis2/d2-i18n';
import {
    isValidNumber,
    isValidInteger,
    isValidPositiveInteger,
    isValidNegativeInteger,
    isValidZeroOrPositiveInteger,
} from 'capture-core-utils/validators/form';
import Min from './Min.component';
import Max from './Max.component';
import { dataElementTypes as elementTypes } from '../../../metaData';
import D2TextField from '../../FormFields/Generic/D2TextField.component';
import { getNumericFilterData } from './numericFilterDataGetter';
import type { UpdatableFilterContent } from '../types';

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

type Value = ?{
    min?: ?string,
    max?: ?string,
};

type Props = {
    onCommitValue: (value: ?{ min?: ?string, max?: ?string }) => void,
    onUpdate: (commitValue?: any) => void,
    value: Value,
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
// $FlowFixMe[incompatible-variance] automated comment
class NumericFilter extends Component<Props> implements UpdatableFilterContent<Value> {
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
        if (!NumericFilter.validateField(minValue, type).isValid || !NumericFilter.validateField(maxValue, type).isValid) {
            return false;
        }

        return !(minValue && maxValue && Number(minValue) > Number(maxValue));
    }

    maxD2TextFieldInstance: D2TextField;
    onGetUpdateData(updatedValues?: Value) {
        const value = typeof updatedValues !== 'undefined' ? updatedValues : this.props.value;

        if (!value) {
            return null;
        }
        return getNumericFilterData(value);
    }

    onIsValid() {
        const values = this.props.value;
        return !values || NumericFilter.isFilterValid(values.min, values.max, this.props.type);
    }

    static errorMessages = {
        MIN_GREATER_THAN_MAX: 'Minimum value cannot be greater than maximum value',
        // $FlowFixMe[prop-missing] automated comment
        [elementTypes.NUMBER]: 'Please provide a valid number',
        // $FlowFixMe[prop-missing] automated comment
        [elementTypes.INTEGER]: 'Please provide a valid integer',
        // $FlowFixMe[prop-missing] automated comment
        [elementTypes.INTEGER_POSITIVE]: 'Please provide a positive integer',
        // $FlowFixMe[prop-missing] automated comment
        [elementTypes.INTEGER_NEGATIVE]: 'Please provide a negative integer',
        // $FlowFixMe[prop-missing] automated comment
        [elementTypes.INTEGER_ZERO_OR_POSITIVE]: 'Please provide zero or a positive integer',
    };

    static validatorForTypes = {
        // $FlowFixMe[prop-missing] automated comment
        [elementTypes.NUMBER]: isValidNumber,
        // $FlowFixMe[prop-missing] automated comment
        [elementTypes.INTEGER]: isValidInteger,
        // $FlowFixMe[prop-missing] automated comment
        [elementTypes.INTEGER_POSITIVE]: isValidPositiveInteger,
        // $FlowFixMe[prop-missing] automated comment
        [elementTypes.INTEGER_NEGATIVE]: isValidNegativeInteger,
        // $FlowFixMe[prop-missing] automated comment
        [elementTypes.INTEGER_ZERO_OR_POSITIVE]: isValidZeroOrPositiveInteger,
    };

    getUpdatedValue(valuePart: {[key: string]: string}) {
        // $FlowFixMe[cannot-spread-indexer] automated comment
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
            this.props.onUpdate(values || null);
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
                        {/* $FlowFixMe[prop-missing] automated comment */}
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
                        {/* $FlowFixMe[prop-missing] automated comment */}
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
