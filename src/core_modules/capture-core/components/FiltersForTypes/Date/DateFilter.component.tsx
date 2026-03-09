import React, { Component } from 'react';
import { withStyles, type WithStyles } from 'capture-core-utils/styles';
import { cx } from '@emotion/css';
import i18n from '@dhis2/d2-i18n';
import { Temporal } from '@js-temporal/polyfill';
import { isValidZeroOrPositiveInteger } from 'capture-core-utils/validators/form';
import { SelectBoxes, orientations } from '../../FormFields/Options/SelectBoxes';
import { OptionSet } from '../../../metaData/OptionSet/OptionSet';
import { Option } from '../../../metaData/OptionSet/Option';
import type { UpdatableFilterContent } from '../types';
import type { DateValue } from './types';
import { FromDateFilter } from './From.component';
import { ToDateFilter } from './To.component';
import './calendarFilterStyles.css';
import { mainOptionKeys, mainOptionTranslatedTexts } from './options';
import { getDateFilterData } from './dateFilterDataGetter';
import { RangeFilter } from './RangeFilter.component';
import { convertLocalToIsoCalendar } from '../../../utils/converters/date';

const styles: Readonly<any> = (theme: any) => ({
    fromToContainer: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    inputContainer: {},
    toLabelContainer: {
        width: 30,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'start',
        paddingTop: theme.typography.pxToRem(6),
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

export type Value = {
    from?: DateValue;
    to?: DateValue;
    main?: string;
    start?: string;
    end?: string;
} | undefined;

type OwnProps = {
    onCommitValue: (value?: Value, isBlur?: boolean) => void;
    value: Value;
    onFocusUpdateButton: () => void;
};

type Props = OwnProps & WithStyles<typeof styles>;

type State = {
    submitAttempted: boolean;
};

// eslint-disable-next-line complexity
const getAbsoluteRangeErrors = (fromValue, toValue, submitAttempted) => {
    const fromValueString = fromValue?.value;
    const toValueString = toValue?.value;
    const isFromValueValid = fromValue?.isValid;
    const isToValueValid = toValue?.isValid;

    if (!fromValueString && !toValueString) {
        return {
            dateLogicError: submitAttempted
                ? i18n.t('Please specify a range')
                : null,
        };
    }

    const hasDateLogicError =
        fromValueString &&
        toValueString &&
        isFromValueValid &&
        isToValueValid &&
        DateFilterPlain.isFromAfterTo(fromValueString, toValueString);

    return {
        dateLogicError: hasDateLogicError
            ? i18n.t("The From date can't be after the To date")
            : null,
    };
};

const getRelativeRangeErrors = (startValue, endValue, submitAttempted) => {
    let errors = {
        startValueError: null,
        endValueError: null,
        bufferLogicError: null,
    };
    if (!startValue && !endValue) {
        errors = {
            ...errors,
            bufferLogicError: submitAttempted ? i18n.t('Please specify the number of days') : null,
        };
    }
    const { error: startValueError } = DateFilterPlain.validateRelativeRangeValue(startValue);
    const { error: endValueError } = DateFilterPlain.validateRelativeRangeValue(endValue);
    errors = {
        ...errors,
        startValueError,
        endValueError,
    };
    return errors;
};

// eslint-disable-next-line complexity
const isAbsoluteRangeFilterValid = (from, to) => {
    const fromValue = from?.value;
    const toValue = to?.value;

    if (!fromValue && !toValue) {
        return false;
    }

    const isFromValueValid = from ? from.isValid : true;
    const isToValueValid = to ? to.isValid : true;

    if (!isFromValueValid || !isToValueValid) {
        return false;
    }

    if ((!fromValue && toValue) || (fromValue && !toValue)) {
        return true;
    }

    return !DateFilterPlain.isFromAfterTo(fromValue, toValue);
};

const isRelativeRangeFilterValid = (startValue, endValue) => {
    if (!startValue && !endValue) {
        return false;
    }
    if (
        !DateFilterPlain.validateRelativeRangeValue(startValue).isValid ||
        !DateFilterPlain.validateRelativeRangeValue(endValue).isValid
    ) {
        return false;
    }
    return true;
};

class DateFilterPlain extends Component<Props, State> implements UpdatableFilterContent<Value> {
    static validateRelativeRangeValue(value?: string | null) {
        if (!value) {
            return {
                isValid: true,
                error: null,
            };
        }

        const isValid = isValidZeroOrPositiveInteger(value);

        return {
            isValid,
            error: isValid ? null : i18n.t('Please provide zero or a positive integer'),
        };
    }

    static isFilterValid(
        mainValue?: string | null,
        fromValue?: DateValue | null,
        toValue?: DateValue | null,
        startValue?: string | null,
        endValue?: string | null,
    ) {
        if (mainValue === mainOptionKeys.ABSOLUTE_RANGE) {
            return isAbsoluteRangeFilterValid(fromValue, toValue);
        }

        if (mainValue === mainOptionKeys.RELATIVE_RANGE) {
            return isRelativeRangeFilterValid(startValue, endValue);
        }
        return true;
    }

    static isFromAfterTo(valueFrom: string, valueTo: string) {
        const from = convertLocalToIsoCalendar(valueFrom);
        const to = convertLocalToIsoCalendar(valueTo);
        const fromIso = Temporal.PlainDate.from(from.split('T')[0]);
        const toIso = Temporal.PlainDate.from(to.split('T')[0]);
        return Temporal.PlainDate.compare(fromIso, toIso) > 0;
    }

    toD2DateTextFieldInstance: any;

    constructor(props: Props) {
        super(props);
        this.state = { submitAttempted: false };
    }

    static mainOptionSet = new OptionSet('mainOptions', [
        new Option((_this) => {
            _this.text = mainOptionTranslatedTexts[mainOptionKeys.TODAY];
            _this.value = mainOptionKeys.TODAY;
        }),
        new Option((_this) => {
            _this.text = mainOptionTranslatedTexts[mainOptionKeys.THIS_WEEK];
            _this.value = mainOptionKeys.THIS_WEEK;
        }),
        new Option((_this) => {
            _this.text = mainOptionTranslatedTexts[mainOptionKeys.THIS_MONTH];
            _this.value = mainOptionKeys.THIS_MONTH;
        }),
        new Option((_this) => {
            _this.text = mainOptionTranslatedTexts[mainOptionKeys.THIS_YEAR];
            _this.value = mainOptionKeys.THIS_YEAR;
        }),
        new Option((_this) => {
            _this.text = mainOptionTranslatedTexts[mainOptionKeys.LAST_WEEK];
            _this.value = mainOptionKeys.LAST_WEEK;
        }),
        new Option((_this) => {
            _this.text = mainOptionTranslatedTexts[mainOptionKeys.LAST_MONTH];
            _this.value = mainOptionKeys.LAST_MONTH;
        }),
        new Option((_this) => {
            _this.text = mainOptionTranslatedTexts[mainOptionKeys.LAST_3_MONTHS];
            _this.value = mainOptionKeys.LAST_3_MONTHS;
        }),
        new Option((_this) => {
            _this.text = mainOptionTranslatedTexts[mainOptionKeys.ABSOLUTE_RANGE];
            _this.value = mainOptionKeys.ABSOLUTE_RANGE;
        }),
    ]);

    static optionSet = new OptionSet('mainOptions', [
        new Option((_this) => {
            _this.text = mainOptionTranslatedTexts[mainOptionKeys.RELATIVE_RANGE];
            _this.value = mainOptionKeys.RELATIVE_RANGE;
        }),
    ]);

    onGetUpdateData(updatedValues?: Value) {
        const value = typeof updatedValues !== 'undefined' ? updatedValues : this.props.value;

        if (!value) {
            return null;
        }
        return getDateFilterData(value as any);
    }

    onIsValid() {
        this.setState({ submitAttempted: true });
        const values = this.props.value;
        return !values || DateFilterPlain.isFilterValid(values.main, values.from, values.to, values.start, values.end);
    }

    getUpdatedValue(valuePart: any) {
        const valueObject = {
            ...this.props.value,
            ...valuePart,
        };
        const isRelativeRangeValue = () => valueObject?.start || valuePart?.start || valuePart?.end;
        const isAbsoluteRangevalue = () => valueObject?.from || valuePart?.from || valuePart?.to;

        if (isAbsoluteRangevalue()) {
            valueObject.main = mainOptionKeys.ABSOLUTE_RANGE;
            delete valueObject.start;
            delete valueObject.end;
        } else if (isRelativeRangeValue()) {
            valueObject.main = mainOptionKeys.RELATIVE_RANGE;
            delete valueObject.from;
            delete valueObject.to;
        } else if (
            valueObject.main === mainOptionKeys.ABSOLUTE_RANGE ||
            valueObject.main === mainOptionKeys.RELATIVE_RANGE
        ) {
            valueObject.main = null;
        }

        return Object.keys(valueObject).filter(key => valueObject[key]).length > 0 ? valueObject : undefined;
    }

    handleEnterKeyInFrom = () => {
        this.toD2DateTextFieldInstance && this.toD2DateTextFieldInstance.focus();
    };

    handleDateSelectedFromCalendarInFrom = () => {
        this.toD2DateTextFieldInstance && this.toD2DateTextFieldInstance.focus();
    };

    handleFieldBlur = (value: any) => {
        this.props.onCommitValue(this.getUpdatedValue(value), true);
    };

    handleMainSelect = (value: string) => {
        const valueObject = value ? { main: value } : undefined;
        this.props.onCommitValue(valueObject, true);
    };

    setToD2DateTextFieldInstance = (instance: any) => {
        this.toD2DateTextFieldInstance = instance;
    };

    getErrors() {
        const values = this.props.value;
        const submitAttempted = this.state.submitAttempted;
        const mainValue = values && values.main;
        const fromValue = values && values.from;
        const toValue = values && values.to;
        const startValue = values && values.start;
        const endValue = values && values.end;
        const errors = {
            minValueError: null,
            maxValueError: null,
            startValueError: null,
            endValueError: null,
            dateLogicError: null,
            bufferLogicError: null,
        };

        if (mainValue === mainOptionKeys.ABSOLUTE_RANGE) {
            return { ...errors, ...getAbsoluteRangeErrors(fromValue, toValue, submitAttempted) };
        }

        if (mainValue === mainOptionKeys.RELATIVE_RANGE) {
            return { ...errors, ...getRelativeRangeErrors(startValue, endValue, submitAttempted) };
        }
        return errors;
    }

    render() {
        const { value, classes, onFocusUpdateButton } = this.props;
        const fromValue = value?.from;
        const toValue = value?.to;
        const { startValueError, endValueError, dateLogicError, bufferLogicError } =
            this.getErrors();

        return (
            <div id="dateFilter">
                <div>
                    <SelectBoxes
                        optionSet={DateFilterPlain.mainOptionSet}
                        orientation={orientations.VERTICAL}
                        value={value && value.main}
                        onBlur={this.handleMainSelect}
                        nullable
                    />
                </div>
                <div className={classes.fromToContainer}>
                    <div className={classes.inputContainer}>
                        <FromDateFilter
                            value={fromValue?.value}
                            onBlur={this.handleFieldBlur}
                            onEnterKey={this.handleEnterKeyInFrom}
                            onDateSelectedFromCalendar={this.handleDateSelectedFromCalendarInFrom}
                            error={fromValue?.error}
                            errorClass={classes.error}
                        />
                    </div>
                    <div className={classes.toLabelContainer}>{i18n.t('to')}</div>
                    <div className={classes.inputContainer}>
                        <ToDateFilter
                            value={toValue?.value}
                            onBlur={this.handleFieldBlur}
                            textFieldRef={this.setToD2DateTextFieldInstance}
                            onFocusUpdateButton={onFocusUpdateButton}
                            error={toValue?.error}
                            errorClass={classes.error}
                        />
                    </div>
                </div>
                <div>
                    <SelectBoxes
                        optionSet={DateFilterPlain.optionSet}
                        orientation={orientations.VERTICAL}
                        value={value && value.main}
                        onBlur={this.handleMainSelect}
                        nullable
                    />
                </div>
                <div>
                    <RangeFilter
                        value={{ start: value?.start, end: value?.end }}
                        startValueError={startValueError}
                        endValueError={endValueError}
                        handleFieldBlur={this.handleFieldBlur}
                    />
                </div>
                <div className={cx(classes.error, classes.logicErrorContainer)}>{dateLogicError}</div>
                <div className={cx(classes.error, classes.logicErrorContainer)}>{bufferLogicError}</div>
            </div>
        );
    }
}

export const DateFilter = withStyles(styles)(DateFilterPlain);
