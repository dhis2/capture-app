// @flow
import React, { Component } from 'react';
import { isValidPositiveInteger } from 'capture-core-utils/validators/form';
import i18n from '@dhis2/d2-i18n';
import classNames from 'classnames';
import IconButton from '@material-ui/core/IconButton';
import ClearIcon from '@material-ui/icons/Clear';
import { AgeNumberInput } from '../internal/AgeInput/AgeNumberInput.component';
import { AgeDateInput } from '../internal/AgeInput/AgeDateInput.component';
import defaultClasses from './ageField.module.css';
import { orientations } from '../constants/orientations.const';
import { withInternalChangeHandler } from '../HOC/withInternalChangeHandler';

type AgeValues = {
    date?: ?string,
    years?: ?string,
    months?: ?string,
    days?: ?string,
}

type InputMessageClasses = {
    error?: ?string,
    warning?: ?string,
    info?: ?string,
    validating?: ?string,
}

type DateParser = (value: string) => { isValid: boolean, momentDate: any };
type DateStringFromMomentFormatter = (momentValue: Object) => string;

type Props = {
    value: ?AgeValues,
    onBlur: (value: ?AgeValues) => void,
    onChange: (value: ?AgeValues) => void,
    onRemoveFocus: () => void,
    orientation: $Values<typeof orientations>,
    innerMessage?: ?any,
    classes: Object,
    inputMessageClasses: ?InputMessageClasses,
    inFocus?: ?boolean,
    shrinkDisabled?: ?boolean,
    onParseDate: DateParser,
    onGetFormattedDateStringFromMoment: DateStringFromMomentFormatter,
    moment: any,
    dateCalendarTheme: Object,
    dateCalendarWidth?: ?any,
    datePopupAnchorPosition?: ?string,
    dateCalendarLocale: Object,
    dateCalendarOnConvertValueIn: (inputValue: ?string) => Date,
    dateCalendarOnConvertValueOut: (value: string) => string,
    datePlaceholder?: ?string,
    disabled?: ?boolean,
};
function getCalculatedValues(
    dateValue: ?string,
    onParseDate: DateParser,
    onGetFormattedDateStringFromMoment: DateStringFromMomentFormatter,
    moment: any,
): AgeValues {
    const parseData = dateValue && onParseDate(dateValue);
    if (!parseData || !parseData.isValid) {
        return {
            date: dateValue,
            years: '',
            months: '',
            days: '',
        };
    }
    const now = moment();
    const age = moment(parseData.momentDate);

    const years = now.diff(age, 'years');
    age.add(years, 'years');

    const months = now.diff(age, 'months');
    age.add(months, 'months');

    const days = now.diff(age, 'days');

    return {
        date: onGetFormattedDateStringFromMoment(parseData.momentDate),
        years: years.toString(),
        months: months.toString(),
        days: days.toString(),
    };
}

const messageTypeClass = {
    error: 'innerInputError',
    info: 'innerInputInfo',
    warning: 'innerInputWarning',
    validating: 'innerInputValidating',
};

class D2AgeFieldPlain extends Component<Props> {
    static isEmptyNumbers(values: AgeValues) {
        return !values.years && !values.months && !values.days;
    }
    static isPositiveOrZeroNumber(value: any) {
        return isValidPositiveInteger(value) || Number(value) === 0;
    }
    // eslint-disable-next-line complexity
    static isValidNumbers(values: AgeValues) {
        return D2AgeFieldPlain.isPositiveOrZeroNumber(values.years || '0') &&
            D2AgeFieldPlain.isPositiveOrZeroNumber(values.months || '0') &&
            D2AgeFieldPlain.isPositiveOrZeroNumber(values.days || '0');
    }

    static getNumberOrZero(value: ?string) {
        return value || 0;
    }

    onClear = () => {
        this.props.onBlur(null);
    }

    handleNumberBlur = (values: AgeValues) => {
        const { onParseDate, onGetFormattedDateStringFromMoment, onRemoveFocus, moment } = this.props;

        onRemoveFocus && onRemoveFocus();
        if (D2AgeFieldPlain.isEmptyNumbers(values)) {
            this.props.onBlur(values.date ? { date: values.date } : null);
            return;
        }

        if (!D2AgeFieldPlain.isValidNumbers(values)) {
            this.props.onBlur({ ...values, date: '' });
            return;
        }

        const momentDate = moment(undefined, undefined, true);
        momentDate.subtract(D2AgeFieldPlain.getNumberOrZero(values.years), 'years');
        momentDate.subtract(D2AgeFieldPlain.getNumberOrZero(values.months), 'months');
        momentDate.subtract(D2AgeFieldPlain.getNumberOrZero(values.days), 'days');
        const calculatedValues = getCalculatedValues(
            onGetFormattedDateStringFromMoment(momentDate),
            onParseDate,
            onGetFormattedDateStringFromMoment,
            moment,
        );
        this.props.onBlur(calculatedValues);
    }

    handleDateBlur = (date: ?string) => {
        const { onParseDate, onGetFormattedDateStringFromMoment, onRemoveFocus, moment } = this.props;
        onRemoveFocus && onRemoveFocus();
        const calculatedValues = date ? getCalculatedValues(
            date,
            onParseDate,
            onGetFormattedDateStringFromMoment,
            moment) : null;
        this.props.onBlur(calculatedValues);
    }

    renderMessage = (key: string) => {
        const { classes, innerMessage: messageContainer } = this.props;
        if (messageContainer) {
            const message = messageContainer.message && messageContainer.message[key];
            const className = (classes && classes[messageTypeClass[messageContainer.messageType]]) || '';
            return message && (<div className={className}>{message}</div>);
        }
        return null;
    }

    renderNumberInput = (currentValues: AgeValues, key: string, label: string) => {
        const {
            innerMessage,
            onChange,
            inFocus,
            value,
            onBlur,
            dateCalendarOnConvertValueIn,
            dateCalendarOnConvertValueOut,
            dateCalendarWidth,
            datePopupAnchorPosition,
            dateCalendarTheme,
            dateCalendarLocale,
            moment,
            onParseDate,
            ...passOnProps } = this.props;
        return (
            <div className={defaultClasses.ageNumberInputContainer}>
                {/* $FlowFixMe[cannot-spread-inexact] automated comment */}
                <AgeNumberInput
                    label={i18n.t(label)}
                    value={currentValues[key]}
                    onBlur={numberValue => this.handleNumberBlur({ ...currentValues, [key]: numberValue })}
                    onChange={numberValue => onChange({ ...currentValues, [key]: numberValue })}
                    {...passOnProps}
                />
                {innerMessage && this.renderMessage(key)}
            </div>
        );
    }
    renderDateInput = (currentValues: AgeValues, isVertical: boolean) => {
        const {
            onChange,
            innerMessage,
            inFocus,
            value,
            onBlur,
            shrinkDisabled,
            dateCalendarOnConvertValueIn,
            dateCalendarOnConvertValueOut,
            dateCalendarWidth,
            datePopupAnchorPosition,
            dateCalendarTheme,
            dateCalendarLocale,
            datePlaceholder,
            moment,
            onParseDate,
            ...passOnProps
        } = this.props;
        const dateInputContainerClass = classNames(
            { [defaultClasses.ageDateInputContainerHorizontal]: !isVertical },
        );
        return (
            <div className={dateInputContainerClass}>
                {/* $FlowFixMe[cannot-spread-inexact] automated comment */}
                <AgeDateInput
                    onBlur={this.handleDateBlur}
                    value={currentValues.date}
                    onChange={date => onChange({ ...currentValues, date })}
                    calendarWidth={dateCalendarWidth}
                    popupAnchorPosition={datePopupAnchorPosition}
                    calendarTheme={dateCalendarTheme}
                    calendarLocale={dateCalendarLocale}
                    calendarOnConvertValueIn={dateCalendarOnConvertValueIn}
                    calendarOnConvertValueOut={dateCalendarOnConvertValueOut}
                    placeholder={datePlaceholder}
                    {...passOnProps}
                />
                {innerMessage && this.renderMessage('date')}
            </div>

        );
    }

    render() {
        const { value, orientation, disabled } = this.props;
        const currentValues = value || {};
        const isVertical = orientation === orientations.VERTICAL;
        const containerClass = isVertical ? defaultClasses.containerVertical : defaultClasses.containerHorizontal;
        const ageClearClass = !isVertical ? defaultClasses.ageClearHorizontal : null;
        return (
            <div className={containerClass}>
                {this.renderDateInput(currentValues, isVertical)}
                {this.renderNumberInput(currentValues, 'years', 'Years')}
                {this.renderNumberInput(currentValues, 'months', 'Months')}
                {this.renderNumberInput(currentValues, 'days', 'Days')}
                <div className={ageClearClass}>
                    <IconButton style={{ width: 42, height: 42 }} disabled={!!disabled}>
                        <ClearIcon
                            onClick={this.onClear}
                        />
                    </IconButton>

                </div>
            </div>
        );
    }
}

export const AgeField = withInternalChangeHandler()(D2AgeFieldPlain);
