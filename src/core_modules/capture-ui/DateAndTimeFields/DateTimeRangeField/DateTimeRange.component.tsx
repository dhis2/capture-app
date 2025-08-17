import * as React from 'react';
import i18n from '@dhis2/d2-i18n';
import { DateTimeField } from '../DateTimeField/DateTime.component';
import { withFocusSaver } from '../../HOC/withFocusSaver';
import defaultClasses from './dateTimeRangeField.module.css';
import { InnerMessage } from '../../internal/InnerMessage/InnerMessage.component';
import type { Props, State, DateTimeValue, DateTimeRangeValue } from './DateTimeRange.types';

const RangeInputField = withFocusSaver()(DateTimeField);

const inputKeys = {
    FROM: 'from',
    TO: 'to',
};

export class DateTimeRangeField extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.touchedFields = new Set();
        this.state = {
            fromDateError: { error: null, errorCode: null },
            toDateError: { error: null, errorCode: null },
        };
    }

    getInnerMessage = (key: string) => {
        const { classes, innerMessage } = this.props;
        return (
            <InnerMessage
                classes={classes}
                innerMessage={innerMessage}
                messageKey={key}
            />
        );
    }

    getValue = () => this.props.value || {};

    getNewValue = (key: string, newValue: any) => {
        const currentValue = this.getValue();
        const value = {
            ...currentValue,
            [key]: newValue,
        };
        if (!value.from && !value.to) {
            return null;
        }
        return value;
    }

    handleFromChange = (value: DateTimeValue | null | undefined) => {
        this.props.onChange({
            from: value,
            to: this.getValue().to,
        });
    }
    handleToChange = (value: DateTimeValue | null | undefined) => {
        this.props.onChange({
            from: this.getValue().from,
            to: value,
        });
    }

    toHasValue = () => {
        const value = this.getValue();
        return !!(value.to && value.to.date && value.to.time);
    }

    fromHasValue = () => {
        const value = this.getValue();
        return !!(value.to && value.to.date && value.to.time);
    }

    handleFromBlur = (value: DateTimeValue | null | undefined, options: any | null | undefined) => {
        if (options?.touched) {
            this.touchedFields.add('fromTouched');
        }
        this.setState(() => ({
            fromDateError: { error: options?.error, errorCode: options?.errorCode },
        }), () => {
            this.handleBlur({
                from: value,
                to: this.getValue().to,
            }, {
                touched: !!this.toHasValue(),
                fromDateError: this.state.fromDateError,
                toDateError: this.state.toDateError,
            });
        });
    }

    handleToBlur = (value: DateTimeValue | null | undefined, options: any | null | undefined) => {
        if (options?.touched) {
            this.touchedFields.add('toTouched');
        }
        this.setState(() => ({
            toDateError: { error: options?.error, errorCode: options?.errorCode },
        }), () => {
            this.handleBlur({
                from: this.getValue().from,
                to: value,
            }, {
                touched: !!this.fromHasValue(),
                fromDateError: this.state.fromDateError,
                toDateError: this.state.toDateError,
            });
        });
    }

    handleBlur = (value: DateTimeRangeValue, options: any | null | undefined) => {
        const touched = this.touchedFields.size === 2;
        if (!value.from && !value.to) {
            this.props.onBlur(undefined, {
                touched,
            });
            return;
        }
        this.props.onBlur(value, {
            touched: touched || options?.touched,
            fromDateError: options?.fromDateError,
            toDateError: options?.toDateError,
        });
    }

    touchedFields: Set<string>;

    render() {
        const { onBlur, onChange, value, ...passOnProps } = this.props;
        const fromValue = value && value.from ? value.from : '';
        const toValue = value && value.to ? value.to : '';

        return (
            <div className={defaultClasses.container}>
                <div className={defaultClasses.inputContainer}>
                    <RangeInputField
                        dateLabel={i18n.t('From date')}
                        timeLabel={i18n.t('From time')}
                        value={fromValue}
                        onBlur={this.handleFromBlur}
                        onChange={this.handleFromChange}
                        {...passOnProps as any}
                    />
                    {this.getInnerMessage(inputKeys.FROM)}
                </div>
                <div className={defaultClasses.inputContainer}>
                    <RangeInputField
                        dateLabel={i18n.t('To date')}
                        timeLabel={i18n.t('To time')}
                        value={toValue}
                        onBlur={this.handleToBlur}
                        onChange={this.handleToChange}
                        {...passOnProps as any}
                    />
                    {this.getInnerMessage(inputKeys.TO)}
                </div>

            </div>
        );
    }
}
