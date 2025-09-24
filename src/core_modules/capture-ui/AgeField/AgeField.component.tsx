import React, { Component } from 'react';
import { Temporal } from '@js-temporal/polyfill';
import {
    convertFromIso8601,
    convertToIso8601,
} from '@dhis2/multi-calendar-dates';
import { isValidPositiveInteger } from 'capture-core-utils/validators/form';
import i18n from '@dhis2/d2-i18n';
import { cx } from '@emotion/css';
import { IconButton } from 'capture-ui';
import { IconCross24 } from '@dhis2/ui';
import { AgeNumberInput } from '../internal/AgeInput/AgeNumberInput.component';
import { AgeDateInput } from '../internal/AgeInput/AgeDateInput.component';
import defaultClasses from './ageField.module.css';
import { orientations } from '../constants/orientations.const';
import { withInternalChangeHandler } from '../HOC/withInternalChangeHandler';
import { stringToTemporal, temporalToString, mapDhis2CalendarToTemporal, isCalendarSupported } from '../../capture-core-utils/date';

type AgeValues = {
    date?: string | null;
    years?: string | null;
    months?: string | null;
    days?: string | null;
}

type InputMessageClasses = {
    error?: string | null;
    warning?: string | null;
    info?: string | null;
    validating?: string | null;
}

type ValidationOptions = {
    error?: string | null;
    errorCode?: string | null;
};

type Props = {
    value: AgeValues | null;
    onBlur: (value: AgeValues | null, options?: ValidationOptions | null) => void;
    onChange: (value: AgeValues | null) => void;
    onRemoveFocus: () => void;
    orientation: typeof orientations[keyof typeof orientations];
    innerMessage?: any | null;
    classes: any;
    inputMessageClasses: InputMessageClasses | null;
    inFocus?: boolean | null;
    shrinkDisabled?: boolean | null;
    dateCalendarTheme: any;
    dateCalendarWidth?: any | null;
    datePopupAnchorPosition?: string | null;
    dateCalendarLocale: any;
    dateCalendarOnConvertValueIn: (inputValue: string | null) => Date;
    dateCalendarOnConvertValueOut: (value: string) => string;
    datePlaceholder?: string | null;
    disabled?: boolean | null;
    dateFormat: string | null;
    calendarType: string | null;
    locale?: string;
};

function getCalculatedValues(dateValue: string | null, calendarType: string, dateFormat: string): AgeValues {
    if (!dateValue) {
        return {
            date: dateValue,
            years: '',
            months: '',
            days: '',
        };
    }

    if (!isCalendarSupported(mapDhis2CalendarToTemporal[calendarType])) {
        const nowIso = Temporal.Now.plainDateISO();

        const ageIso = convertToIso8601(dateValue, calendarType as any);

        const diff = nowIso.since(ageIso, {
            largestUnit: 'years',
            smallestUnit: 'days',
        });

        return {
            date: dateValue,
            years: diff.years.toString(),
            months: diff.months.toString(),
            days: diff.days.toString(),
        };
    }
    const now = Temporal.Now.plainDateISO().withCalendar(mapDhis2CalendarToTemporal[calendarType]);
    const age = stringToTemporal(dateValue, mapDhis2CalendarToTemporal[calendarType], dateFormat);

    if (calendarType === 'ethiopian') {
        if (!age) {
            return {
                date: dateValue,
                years: '',
                months: '',
                days: '',
            };
        }
        const ethiopianNow = now.with({ year: now.eraYear });
        const ethiopianAge = age.with({ year: age.eraYear });

        const diff = ethiopianNow.since(ethiopianAge, {
            largestUnit: 'years',
            smallestUnit: 'days',
        });

        return {
            date: temporalToString(ethiopianAge, dateFormat),
            years: diff.years.toString(),
            months: diff.months.toString(),
            days: diff.days.toString(),
        };
    }

    const diff = now.since(age as any, {
        largestUnit: 'years',
        smallestUnit: 'days',
    });

    return {
        date: temporalToString(age, dateFormat),
        years: diff.years.toString(),
        months: diff.months.toString(),
        days: diff.days.toString(),
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

    static getNumberOrZero(value: string | null) {
        return Number(value) || 0;
    }

    onClear = () => {
        this.props.onBlur(null);
    }

    handleNumberBlur = (values: AgeValues) => {
        const { onRemoveFocus, calendarType, dateFormat } = this.props;
        const calendar = calendarType || 'iso8601';
        const format = dateFormat || 'YYYY-MM-DD';
        onRemoveFocus && onRemoveFocus();
        if (D2AgeFieldPlain.isEmptyNumbers(values)) {
            this.props.onBlur(values.date ? { date: values.date } : null);
            return;
        }

        if (!D2AgeFieldPlain.isValidNumbers(values)) {
            this.props.onBlur({ ...values, date: '' });
            return;
        }

        if (!isCalendarSupported(mapDhis2CalendarToTemporal[calendar])) {
            const nowIso = Temporal.Now.plainDateISO();
            const calculatedDateIso = nowIso.subtract({
                years: D2AgeFieldPlain.getNumberOrZero(values.years ?? null),
                months: D2AgeFieldPlain.getNumberOrZero(values.months ?? null),
                days: D2AgeFieldPlain.getNumberOrZero(values.days ?? null),
            });

            const localCalculatedDate = convertFromIso8601(calculatedDateIso.toString(), calendar as any);
            const dateString = temporalToString(localCalculatedDate, format);
            const calculatedValues = getCalculatedValues(dateString, calendar, format);
            this.props.onBlur(calculatedValues);
            return;
        }

        const now = Temporal.Now.plainDateISO().withCalendar(mapDhis2CalendarToTemporal[calendar]);
        const calculatedDate = now.subtract({
            years: D2AgeFieldPlain.getNumberOrZero(values.years ?? null),
            months: D2AgeFieldPlain.getNumberOrZero(values.months ?? null),
            days: D2AgeFieldPlain.getNumberOrZero(values.days ?? null),
        });
        const dateString = temporalToString(calculatedDate, format);
        const calculatedValues = getCalculatedValues(dateString, calendar, format);
        this.props.onBlur(calculatedValues);
    }

    handleDateBlur = (date: string | null, options?: ValidationOptions | null) => {
        const { onRemoveFocus, calendarType, dateFormat } = this.props;
        const calendar = calendarType || 'iso8601';
        const format = dateFormat || 'YYYY-MM-DD';
        onRemoveFocus && onRemoveFocus();
        const isDateValid = options && !options.error;
        if (!date) {
            this.props.onBlur(null, options);
            return;
        }
        if (!isDateValid) {
            const calculatedValues = {
                date,
                years: '',
                months: '',
                days: '',
            };
            this.props.onBlur(calculatedValues, options);
            return;
        }
        const calculatedValues = getCalculatedValues(date, calendar, format);
        this.props.onBlur(calculatedValues, options);
    }

    renderMessage = (key: string) => {
        const { classes, innerMessage: messageContainer } = this.props;
        if (messageContainer) {
            const message = messageContainer.message && messageContainer.message[key];
            const className = (classes && classes[messageTypeClass[messageContainer.messageType as keyof typeof messageTypeClass]]) || '';
            return message && (<div className={className}>{message}</div>);
        }
        return null;
    }

    renderNumberInput = (currentValues: AgeValues, key: keyof AgeValues, label: string) => {
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
            ...passOnProps } = this.props;
        return (
            <div className={defaultClasses.ageNumberInputContainer}>
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
            dateCalendarWidth,
            datePlaceholder,
            ...passOnProps
        } = this.props;

        const dateInputContainerClass = cx(
            { [defaultClasses.ageDateInputContainerHorizontal]: !isVertical },
        );
        return (
            <div className={dateInputContainerClass}>
                <AgeDateInput
                    onBlur={this.handleDateBlur}
                    value={currentValues.date}
                    onChange={date => onChange({ ...currentValues, date })}
                    calendarWidth={dateCalendarWidth}
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
        const ageClearClass = !isVertical ? defaultClasses.ageClearHorizontal : undefined;
        return (
            <div className={containerClass}>
                {this.renderDateInput(currentValues, isVertical)}
                {this.renderNumberInput(currentValues, 'years', 'Years')}
                {this.renderNumberInput(currentValues, 'months', 'Months')}
                {this.renderNumberInput(currentValues, 'days', 'Days')}
                <div className={ageClearClass}>
                    <IconButton disabled={!!disabled} onClick={this.onClear}>
                        <IconCross24 />
                    </IconButton>

                </div>
            </div>
        );
    }
}

export const AgeField = withInternalChangeHandler()(D2AgeFieldPlain);
