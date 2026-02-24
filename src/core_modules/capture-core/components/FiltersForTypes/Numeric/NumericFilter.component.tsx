import React, { Component } from 'react';
import { withStyles, WithStyles } from 'capture-core-utils/styles';
import { cx } from '@emotion/css';
import i18n from '@dhis2/d2-i18n';
import {
    isValidNumber,
    isValidInteger,
    isValidPositiveInteger,
    isValidNegativeInteger,
    isValidZeroOrPositiveInteger,
} from 'capture-core-utils/validators/form';
import { MinNumericFilter } from './Min.component';
import { MaxNumericFilter } from './Max.component';
import { dataElementTypes } from '../../../metaData';
import { getNumericFilterData } from './numericFilterDataGetter';
import type { UpdatableFilterContent } from '../types';

const getStyles: any = (theme: any) => ({
    container: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    inputContainer: {
        width: theme.typography.pxToRem(100),
    },
    toLabelContainer: {
        paddingTop: theme.typography.pxToRem(6),
        paddingInline: theme.typography.pxToRem(10),
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

type Value = {
    min?: string | null,
    max?: string | null,
} | undefined;

type Props = {
    onCommitValue: (value: { min?: string | null, max?: string | null } | undefined, isBlur?: boolean) => void,
    onUpdate: (commitValue?: any) => void,
    value: Value,
    type: typeof dataElementTypes[keyof typeof dataElementTypes],
};

type State = {
    committedValue: Value;
};

class NumericFilterPlain
    extends Component<Props & WithStyles<typeof getStyles>, State>
    implements UpdatableFilterContent<Value> {
    static validateField(value: string | null | undefined, type: typeof dataElementTypes[keyof typeof dataElementTypes]) {
        if (!value) {
            return {
                isValid: true,
                error: null,
            };
        }

        const typeValidator = NumericFilterPlain.validatorForTypes[type];
        const isValid = typeValidator(value);

        return {
            isValid,
            error: isValid ? null : NumericFilterPlain.errorMessages[type],
        };
    }

    static isFilterValid(
        minValue: string | null | undefined,
        maxValue: string | null | undefined,
        type: typeof dataElementTypes[keyof typeof dataElementTypes],
    ) {
        if (!NumericFilterPlain.validateField(minValue, type).isValid ||
            !NumericFilterPlain.validateField(maxValue, type).isValid) {
            return false;
        }

        return !(minValue && maxValue && Number(minValue) > Number(maxValue));
    }

    constructor(props: Props & WithStyles<typeof getStyles>) {
        super(props);
        this.state = {
            committedValue: props.value,
        };
    }

    onGetUpdateData(updatedValues?: Value) {
        const value = typeof updatedValues !== 'undefined' ? updatedValues : this.props.value;

        if (!value || (!value.min && !value.max)) {
            return undefined;
        }
        return getNumericFilterData(value);
    }

    onIsValid() {
        const values = this.props.value;
        return !values || NumericFilterPlain.isFilterValid(values.min, values.max, this.props.type);
    }

    static errorMessages = {
        MIN_GREATER_THAN_MAX: i18n.t('Minimum value cannot be greater than maximum value'),
        [dataElementTypes.NUMBER]: i18n.t('Please provide a valid number'),
        [dataElementTypes.INTEGER]: i18n.t('Please provide a valid integer'),
        [dataElementTypes.INTEGER_POSITIVE]: i18n.t('Please provide a positive integer'),
        [dataElementTypes.INTEGER_NEGATIVE]: i18n.t('Please provide a negative integer'),
        [dataElementTypes.INTEGER_ZERO_OR_POSITIVE]: i18n.t('Please provide zero or a positive integer'),
    };

    static validatorForTypes = {
        [dataElementTypes.NUMBER]: isValidNumber,
        [dataElementTypes.INTEGER]: isValidInteger,
        [dataElementTypes.INTEGER_POSITIVE]: isValidPositiveInteger,
        [dataElementTypes.INTEGER_NEGATIVE]: isValidNegativeInteger,
        [dataElementTypes.INTEGER_ZERO_OR_POSITIVE]: isValidZeroOrPositiveInteger,
    };

    getUpdatedValue(valuePart: {[key: string]: string}) {
        const valueObject = {
            ...this.props.value,
            ...valuePart,
        };

        return Object
            .keys(valueObject)
            .filter(key => valueObject[key])
            .length > 0 ? valueObject : undefined;
    }

    handleEnterKey = (value: {[key: string]: string}) => {
        const values = this.getUpdatedValue(value);
        this.setState({ committedValue: values });
        if (values && !NumericFilterPlain.isFilterValid(values.min, values.max, this.props.type)) {
            this.props.onCommitValue(values, true);
        } else {
            this.props.onUpdate(values);
        }
    }

    handleFieldBlur = (value: {[key: string]: string}) => {
        const updated = this.getUpdatedValue(value);
        this.setState({ committedValue: updated });
        this.props.onCommitValue(updated, true);
    }

    handleMinChange = (value: string) => {
        this.props.onCommitValue(this.getUpdatedValue({ min: value }), false);
    }

    handleMaxChange = (value: string) => {
        this.props.onCommitValue(this.getUpdatedValue({ max: value }), false);
    }

    getErrors() {
        const values = this.state.committedValue;
        const minValue = values && values.min;
        const maxValue = values && values.max;
        const type = this.props.type;

        const { isValid: isMinValueValid, error: minValueError } = NumericFilterPlain.validateField(minValue, type);
        const { isValid: isMaxValueValid, error: maxValueError } = NumericFilterPlain.validateField(maxValue, type);

        let logicError = null;
        if (isMinValueValid && isMaxValueValid && minValue && maxValue && Number(minValue) > Number(maxValue)) {
            logicError = NumericFilterPlain.errorMessages.MIN_GREATER_THAN_MAX;
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
                        <MinNumericFilter
                            value={value && value.min}
                            error={minValueError}
                            errorClass={classes.error}
                            onBlur={this.handleFieldBlur}
                            onEnterKey={this.handleEnterKey}
                            onChange={this.handleMinChange}
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
                        <MaxNumericFilter
                            value={value && value.max}
                            error={maxValueError}
                            errorClass={classes.error}
                            onBlur={this.handleFieldBlur}
                            onEnterKey={this.handleEnterKey}
                            onChange={this.handleMaxChange}
                        />
                    </div>
                </div>
                <div className={cx(classes.error, classes.logicErrorContainer)}>
                    {logicError}
                </div>
            </div>
        );
    }
}

export const NumericFilter = withStyles(getStyles)(NumericFilterPlain);
