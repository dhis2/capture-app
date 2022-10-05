// @flow
import React, { Component } from 'react';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import i18n from '@dhis2/d2-i18n';
import { isValidZeroOrPositiveInteger } from 'capture-core-utils/validators/form';
import { SelectBoxes, orientations } from '../../FormFields/Options/SelectBoxes';
import { OptionSet } from '../../../metaData/OptionSet/OptionSet';
import { Option } from '../../../metaData/OptionSet/Option';

import { FromDateFilter } from './From.component';
import { ToDateFilter } from './To.component';
import { isValidDate } from '../../../utils/validators/form';
import { parseDate } from '../../../utils/converters/date';
import { dataElementTypes } from '../../../metaData';
import type { UpdatableFilterContent } from '../types';
import './calendarFilterStyles.css';
import { mainOptionKeys, mainOptionTranslatedTexts } from './options';
import { getDateFilterData } from './dateFilterDataGetter';
import { RangeFilter } from './RangeFilter.component';

const getStyles = (theme: Theme) => ({
    fromToContainer: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    inputContainer: {},
    toLabelContainer: {
        width: 30,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
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

export type Value = ?{
    from?: ?string,
    to?: ?string,
    main?: ?string,
    start?: ?string,
    end?: ?string,
};

type Props = {
    onCommitValue: (value: ?{ from?: ?string, to?: ?string }) => void,
    onUpdate: (commitValue?: any) => void,
    value: Value,
    type: $Keys<typeof dataElementTypes>,
    classes: {
        fromToContainer: string,
        inputContainer: string,
        error: string,
        logicErrorContainer: string,
        toLabelContainer: string,
    },
    onFocusUpdateButton: () => void,
};

type State = {
    submitAttempted: boolean,
};

const getAbsoluteRangeErrors = (fromValue, toValue, type, submitAttempted) => {
    let errors = {
        minValueError: null,
        maxValueError: null,
        dateLogicError: null,
    };

    if (!fromValue && !toValue) {
        errors = {
            ...errors,
            dateLogicError: submitAttempted ? i18n.t(DateFilter.errorMessages.ABSOLUTE_RANGE_WITHOUT_VALUES) : null,
        };
    } else {
        const { isValid: isMinValueValid, error: minValueError } = DateFilter.validateField(fromValue, type);
        const { isValid: isMaxValueValid, error: maxValueError } = DateFilter.validateField(toValue, type);
        const hasDateLogicError = () =>
            isMinValueValid && isMaxValueValid && fromValue && toValue && DateFilter.isFromAfterTo(fromValue, toValue);

        errors = {
            ...errors,
            minValueError,
            maxValueError,
            dateLogicError: hasDateLogicError() ? i18n.t(DateFilter.errorMessages.FROM_GREATER_THAN_TO) : null,
        };
    }

    return errors;
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
            bufferLogicError: submitAttempted ? i18n.t(DateFilter.errorMessages.RELATIVE_RANGE_WITHOUT_VALUES) : null,
        };
    }
    const { error: startValueError } = DateFilter.validateField(startValue, dataElementTypes.INTEGER_ZERO_OR_POSITIVE);
    const { error: endValueError } = DateFilter.validateField(endValue, dataElementTypes.INTEGER_ZERO_OR_POSITIVE);
    errors = {
        ...errors,
        startValueError,
        endValueError,
    };
    return errors;
};

const isAbsoluteRangeFilterValid = (fromValue, toValue) => {
    if (!fromValue && !toValue) {
        return false;
    }

    const parseResultFrom = fromValue ? parseDate(fromValue) : { isValid: true, moment: null };
    const parseResultTo = toValue ? parseDate(toValue) : { isValid: true, moment: null };

    if (!(parseResultFrom.isValid && parseResultTo.isValid)) {
        return false;
    }
    const isValidMomentDate = () =>
        parseResultFrom.momentDate &&
        parseResultTo.momentDate &&
        parseResultFrom.momentDate.isAfter(parseResultTo.momentDate);

    return !isValidMomentDate();
};

const isRelativeRangeFilterValid = (startValue, endValue) => {
    if (!startValue && !endValue) {
        return false;
    }
    if (
        !DateFilter.validateField(startValue, dataElementTypes.INTEGER_ZERO_OR_POSITIVE).isValid ||
        !DateFilter.validateField(endValue, dataElementTypes.INTEGER_ZERO_OR_POSITIVE).isValid
    ) {
        return false;
    }
    return true;
};

// $FlowFixMe[incompatible-variance] automated comment
class DateFilterPlain extends Component<Props, State> implements UpdatableFilterContent<Value> {
    static validateField(value: ?string, type: $Keys<typeof dataElementTypes>) {
        if (!value) {
            return {
                isValid: true,
                error: null,
            };
        }

        // $FlowFixMe dataElementTypes flow error
        const typeValidator = DateFilter.validatorForTypes[type];
        const isValid = typeValidator(value);

        return {
            isValid,
            // $FlowFixMe dataElementTypes flow error
            error: isValid ? null : i18n.t(DateFilter.errorMessages[type]),
        };
    }

    static isFilterValid(
        mainValue?: ?string,
        fromValue?: ?string,
        toValue?: ?string,
        startValue?: ?string,
        endValue?: ?string,
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
        const momentFrom = parseDate(valueFrom).momentDate;
        const momentTo = parseDate(valueTo).momentDate;
        // $FlowFixMe[incompatible-use] automated comment
        // $FlowFixMe[incompatible-call] automated comment
        return momentFrom.isAfter(momentTo);
    }

    toD2DateTextFieldInstance: any;
    constructor(props: Props) {
        super(props);
        this.state = { submitAttempted: false };
    }
    static errorMessages = {
        ABSOLUTE_RANGE_WITHOUT_VALUES: 'Please specify a range',
        RELATIVE_RANGE_WITHOUT_VALUES: 'Please specify the number of days',
        FROM_GREATER_THAN_TO: "The From date can't be after the To date",
        MIN_GREATER_THAN_MAX: 'Days in the past cannot be greater than days in the future',
        [dataElementTypes.DATE]: 'Please provide a valid date',
        [dataElementTypes.INTEGER_ZERO_OR_POSITIVE]: 'Please provide zero or a positive integer',
    };

    static validatorForTypes = {
        [dataElementTypes.DATE]: isValidDate,
        [dataElementTypes.INTEGER_ZERO_OR_POSITIVE]: isValidZeroOrPositiveInteger,
    };

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
        // $FlowFixMe
        return getDateFilterData(value);
    }

    onIsValid() {
        this.setState({ submitAttempted: true });
        const values = this.props.value;
        return !values || DateFilter.isFilterValid(values.main, values.from, values.to, values.start, values.end);
    }

    getUpdatedValue(valuePart: { [key: string]: string }) {
        // $FlowFixMe[cannot-spread-indexer] automated comment
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
            // $FlowFixMe[incompatible-type] automated comment
            valueObject.main = null;
        }

        return Object.keys(valueObject).filter(key => valueObject[key]).length > 0 ? valueObject : null;
    }

    handleEnterKeyInFrom = () => {
        this.toD2DateTextFieldInstance.focus();
    };

    handleDateSelectedFromCalendarInFrom = () => {
        this.toD2DateTextFieldInstance.focus();
    };

    handleEnterKeyInTo = (value: { [key: string]: string }) => {
        // validate with updated values
        const values = this.getUpdatedValue(value);
        this.setState({ submitAttempted: true });

        if (values && !DateFilter.isFilterValid(values.main, values.from, values.to, values.start, values.end)) {
            this.props.onCommitValue(values);
        } else {
            this.props.onUpdate(values || null);
        }
    };

    handleFieldBlur = (value: { [key: string]: string }) => {
        this.props.onCommitValue(this.getUpdatedValue(value));
    };

    handleMainSelect = (value: string) => {
        const valueObject = value ? { main: value } : null;
        this.props.onCommitValue(valueObject);
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
        const type = this.props.type;
        const errors = {
            minValueError: null,
            maxValueError: null,
            startValueError: null,
            endValueError: null,
            dateLogicError: null,
            bufferLogicError: null,
        };

        if (mainValue === mainOptionKeys.ABSOLUTE_RANGE) {
            return { ...errors, ...getAbsoluteRangeErrors(fromValue, toValue, type, submitAttempted) };
        }

        if (mainValue === mainOptionKeys.RELATIVE_RANGE) {
            return { ...errors, ...getRelativeRangeErrors(startValue, endValue, submitAttempted) };
        }
        return errors;
    }

    render() {
        const { value, classes, onFocusUpdateButton } = this.props;
        const { minValueError, maxValueError, startValueError, endValueError, dateLogicError, bufferLogicError } =
            this.getErrors();
        return (
            <div id="dateFilter">
                <div>
                    {/* $FlowFixMe */}
                    <SelectBoxes
                        optionSet={DateFilter.mainOptionSet}
                        orientation={orientations.VERTICAL}
                        value={value && value.main}
                        onBlur={this.handleMainSelect}
                        color="secondary"
                        nullable
                    />
                </div>
                <div className={classes.fromToContainer}>
                    <div className={classes.inputContainer}>
                        {/* $FlowSuppress: Flow not working 100% with HOCs */}
                        {/* $FlowFixMe[prop-missing] automated comment */}
                        <FromDateFilter
                            value={value && value.from}
                            error={minValueError}
                            errorClass={classes.error}
                            onBlur={this.handleFieldBlur}
                            onEnterKey={this.handleEnterKeyInFrom}
                            onDateSelectedFromCalendar={this.handleDateSelectedFromCalendarInFrom}
                        />
                    </div>
                    <div className={classes.toLabelContainer}>{i18n.t('to')}</div>
                    <div className={classes.inputContainer}>
                        {/* $FlowSuppress: Flow not working 100% with HOCs */}
                        {/* $FlowFixMe[prop-missing] automated comment */}
                        <ToDateFilter
                            value={value && value.to}
                            error={maxValueError}
                            errorClass={classes.error}
                            onBlur={this.handleFieldBlur}
                            onEnterKey={this.handleEnterKeyInTo}
                            textFieldRef={this.setToD2DateTextFieldInstance}
                            onFocusUpdateButton={onFocusUpdateButton}
                        />
                    </div>
                </div>
                <div>
                    {/* $FlowFixMe */}
                    <SelectBoxes
                        optionSet={DateFilter.optionSet}
                        orientation={orientations.VERTICAL}
                        value={value && value.main}
                        onBlur={this.handleMainSelect}
                        color="secondary"
                        nullable
                    />
                </div>
                <div>
                    <RangeFilter
                        value={{ start: value?.start, end: value?.end }}
                        startValueError={startValueError}
                        endValueError={endValueError}
                        handleFieldBlur={this.handleFieldBlur}
                        handleEnterKeyInTo={this.handleEnterKeyInTo}
                    />
                </div>
                <div className={classNames(classes.error, classes.logicErrorContainer)}>{dateLogicError}</div>
                <div className={classNames(classes.error, classes.logicErrorContainer)}>{bufferLogicError}</div>
            </div>
        );
    }
}

export const DateFilter = withStyles(getStyles)(DateFilterPlain);
