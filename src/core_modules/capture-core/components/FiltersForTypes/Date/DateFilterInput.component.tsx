import React, { Component } from 'react';
import i18n from '@dhis2/d2-i18n';
import { D2Date } from '../../FormFields/DateAndTime/D2Date/D2Date.component';
import { D2TextField } from '../../FormFields/Generic/D2TextField.component';
import { withInternalChangeHandler } from '../../FormFields/withInternalChangeHandler';
import type { DateValue } from './types/date.types';

type DateField = 'from' | 'to';
type RangeField = 'start' | 'end';
type Field = DateField | RangeField;

export type ValueObject =
    | { from?: DateValue; to?: DateValue }
    | { start?: string; end?: string };

type BaseProps = {
    field: Field;
    value?: string;
    error?: string | null;
    errorClass?: string;
    onBlur: (value: ValueObject) => void;
    textFieldRef?: (instance: unknown) => void;
    placeholder?: string;
};

type DateFieldProps = BaseProps & {
    field: DateField;
    onDateSelectedFromCalendar?: () => void;
};

type RangeFieldProps = BaseProps & {
    field: RangeField;
    dataTest?: string;
};

type Props = DateFieldProps | RangeFieldProps;

const DATE_PLACEHOLDERS: Record<DateField, string> = {
    from: i18n.t('Start date'),
    to: i18n.t('End date'),
};

const RANGE_PLACEHOLDERS: Record<RangeField, string> = {
    start: i18n.t('Days in the past'),
    end: i18n.t('Days in the future'),
};

function isDateField(field: Field): field is DateField {
    return field === 'from' || field === 'to';
}

class DateFilterInputPlain extends Component<Props> {
    getDateValueObject(dateValue: DateValue): ValueObject {
        return { [this.props.field]: dateValue } as ValueObject;
    }

    getRangeValueObject(valueStr: string): ValueObject {
        return { [this.props.field]: valueStr.trim() } as ValueObject;
    }

    handleDateBlur = (dateValue: DateValue) => {
        this.props.onBlur(this.getDateValueObject(dateValue));
    };

    handleRangeBlur = (value: string) => {
        this.props.onBlur(this.getRangeValueObject(value));
    };

    renderDateField() {
        const {
            field, error, errorClass, value, placeholder, textFieldRef,
            onBlur, ...rest
        } = this.props;
        const dateProps = this.props as DateFieldProps;
        return (
            <div>
                <D2Date
                    value={value}
                    onBlur={this.handleDateBlur}
                    placeholder={placeholder ?? DATE_PLACEHOLDERS[field]}
                    onDateSelectedFromCalendar={dateProps.onDateSelectedFromCalendar}
                    inputWidth="150px"
                    calendarWidth="330px"
                    {...(textFieldRef ? { textFieldRef } : {})}
                    {...rest}
                />
                <div className={errorClass}>
                    {error ? i18n.t('Please provide a valid date') : error}
                </div>
            </div>
        );
    }

    renderRangeField() {
        const {
            field, error, errorClass, value, placeholder, textFieldRef,
            onBlur, ...rest
        } = this.props;
        const rangeProps = this.props as RangeFieldProps;
        const rangeDataTest = rangeProps.dataTest ?? (
            field === 'start' ? 'date-range-filter-start' : 'date-range-filter-end'
        );
        return (
            <div>
                <D2TextField
                    value={value ?? ''}
                    onBlur={this.handleRangeBlur}
                    placeholder={placeholder ?? RANGE_PLACEHOLDERS[field]}
                    dataTest={rangeDataTest}
                    {...(textFieldRef ? { ref: textFieldRef } : {})}
                    {...rest}
                />
                <div className={errorClass}>{error}</div>
            </div>
        );
    }

    render() {
        const { field } = this.props;
        return isDateField(field) ? this.renderDateField() : this.renderRangeField();
    }
}

export const DateFilterInput = withInternalChangeHandler()(DateFilterInputPlain);
