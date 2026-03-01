import React, { Component } from 'react';
import { withStyles, WithStyles } from 'capture-core-utils/styles';
import { cx } from '@emotion/css';
import i18n from '@dhis2/d2-i18n';
import {
    isValidNumber,
    isValidIntegerInRange,
    isValidPercentage,
    isValidPositiveInteger,
    isValidNegativeInteger,
    isValidZeroOrPositiveInteger,
    isValidInteger,
} from 'capture-core-utils/validators/form';
import { NumericFilterInput } from './NumericFilterInput.component';
import { dataElementTypes } from '../../../metaData';
import { getNumericFilterData } from './numericFilterDataGetter';
import type { UpdatableFilterContent } from '../types';
import {
    makeCheckboxHandler,
    isEmptyValueFilter,
    EMPTY_VALUE_FILTER,
    NOT_EMPTY_VALUE_FILTER,
    EmptyValueFilterCheckboxes,
} from '../EmptyValue';

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
} | string | null | undefined;

type Props = {
    onCommitValue: (value: Value, isBlur?: boolean) => void,
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

        if (typeof value === 'string' && isEmptyValueFilter(value)) {
            return getNumericFilterData(value);
        }

        if (!value || typeof value === 'string' || (!value.min && !value.max)) {
            return undefined;
        }
        return getNumericFilterData(value);
    }

    onIsValid() {
        const value = this.props.value;
        if (typeof value === 'string' && isEmptyValueFilter(value)) {
            return true;
        }
        if (!value || typeof value === 'string') {
            return true;
        }
        return NumericFilterPlain.isFilterValid(value.min, value.max, this.props.type);
    }

    static errorMessages = {
        MIN_GREATER_THAN_MAX: i18n.t('Minimum value cannot be greater than maximum value'),
        [dataElementTypes.NUMBER]: i18n.t('Please provide a valid number'),
        [dataElementTypes.INTEGER]: i18n.t('Please provide a valid integer'),
        [dataElementTypes.PERCENTAGE]: i18n.t('Please provide an integer between 0 and 100'),
        [dataElementTypes.INTEGER_POSITIVE]: i18n.t('Please provide a positive integer'),
        [dataElementTypes.INTEGER_NEGATIVE]: i18n.t('Please provide a negative integer'),
        [dataElementTypes.INTEGER_ZERO_OR_POSITIVE]: i18n.t('Please provide zero or a positive integer'),
    };

    static validatorForTypes = {
        [dataElementTypes.NUMBER]: isValidNumber,
        [dataElementTypes.PERCENTAGE]: isValidPercentage,
        [dataElementTypes.INTEGER]: (v: string) => isValidInteger(v) && isValidIntegerInRange(v),
        [dataElementTypes.INTEGER_POSITIVE]: (v: string) => isValidIntegerInRange(v) && isValidPositiveInteger(v),
        [dataElementTypes.INTEGER_NEGATIVE]: (v: string) => isValidIntegerInRange(v) && isValidNegativeInteger(v),
        [dataElementTypes.INTEGER_ZERO_OR_POSITIVE]: (v: string) =>
            isValidIntegerInRange(v) && isValidZeroOrPositiveInteger(v),
    };

    getUpdatedValue(valuePart: {[key: string]: string}) {
        const currentValue = typeof this.props.value === 'string' ? undefined : this.props.value;
        const valueObject = {
            ...currentValue,
            ...valuePart,
        };

        return Object
            .keys(valueObject)
            .filter(key => valueObject[key])
            .length > 0 ? valueObject : undefined;
    }

    handleEmptyValueCheckboxChange = makeCheckboxHandler(EMPTY_VALUE_FILTER)((value) => {
        this.props.onCommitValue(value || null);
    });

    handleNotEmptyValueCheckboxChange = makeCheckboxHandler(NOT_EMPTY_VALUE_FILTER)((value) => {
        this.props.onCommitValue(value || null);
    });

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
        this.props.onCommitValue(this.getUpdatedValue({ from: value }), false);
    }

    handleMaxChange = (value: string) => {
        this.props.onCommitValue(this.getUpdatedValue({ to: value }), false);
    }

    getErrors() {
        const committed = this.state.committedValue;
        if (typeof committed === 'string') {
            return { minValueError: null, maxValueError: null, logicError: null };
        }

        const minValue = committed && committed.min;
        const maxValue = committed && committed.max;
        const type = this.props.type;

        const { error: minValueError, isValid: isMinValid } = NumericFilterPlain.validateField(minValue, type);
        const { error: maxValueError, isValid: isMaxValid } = NumericFilterPlain.validateField(maxValue, type);
        const logicError = isMinValid && isMaxValid && !NumericFilterPlain.isFilterValid(minValue, maxValue, type)
            ? NumericFilterPlain.errorMessages.MIN_GREATER_THAN_MAX
            : null;

        return { minValueError, maxValueError, logicError };
    }

    render() {
        const { value, classes } = this.props;
        const { minValueError, maxValueError, logicError } = this.getErrors();
        const numericValue = typeof value === 'string' ? undefined : value;

        return (
            <div>
                <EmptyValueFilterCheckboxes
                    value={typeof value === 'string' ? value : undefined}
                    onEmptyChange={this.handleEmptyValueCheckboxChange}
                    onNotEmptyChange={this.handleNotEmptyValueCheckboxChange}
                />

                <div className={classes.container}>
                    <div
                        className={classes.inputContainer}
                    >
                        <NumericFilterInput
                            field="min"
                            value={numericValue && numericValue.min}
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
                        <NumericFilterInput
                            field="max"
                            value={numericValue && numericValue.max}
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
