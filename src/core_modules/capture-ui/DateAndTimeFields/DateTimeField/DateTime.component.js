// @flow
import React, { Component } from 'react';
import i18n from '@dhis2/d2-i18n';
import { IconButton } from 'capture-ui';
import { IconCross24 } from '@dhis2/ui';
import classNames from 'classnames';
import defaultClasses from './dateTime.module.css';
import { orientations } from '../../constants/orientations.const';
import { DateTimeDate } from '../../internal/DateTimeInput/DateTimeDate.component';
import { DateTimeTime } from '../../internal/DateTimeInput/DateTimeTime.component';

type Value = {
    date?: ?string,
    time?: ?string,
};

type Props = {
    onBlur: (value: ?Value, options: Object, internalError: Object) => void,
    onChange: (value: ?Value) => void,
    value: Value,
    dateMaxWidth: string,
    dateWidth: string,
    calendarWidth?: ?number,
    orientation: $Values<typeof orientations>,
    classes: Object,
    dateLabel: string,
    timeLabel: string,
    innerMessage: Object,
    locale?: string,
    shrinkDisabled: boolean,
    disabled: boolean,
};

type State = {
    dateError: ?{
        error?: ?string,
        errorCode?: ?string
    },
};


export class DateTimeField extends Component<Props, State> {
    handleTimeChange: (timeValue: string) => void;
    handleDateChange: (dateValue: string) => void;
    handleTimeBlur: (timeValue: string) => void;
    handleDateBlur: (dateValue: string) => void;
    touchedFields: Set<string>;

    static defaultProps = {
        dateLabel: i18n.t('Date'),
        timeLabel: i18n.t('Time'),
    };

    constructor(props: Props) {
        super(props);
        this.state = {
            dateError: { error: null, errorCode: null },
        };
        this.handleTimeChange = this.handleTimeChange.bind(this);
        this.handleDateChange = this.handleDateChange.bind(this);
        this.handleTimeBlur = this.handleTimeBlur.bind(this);
        this.handleDateBlur = this.handleDateBlur.bind(this);
        this.touchedFields = new Set();
    }

    handleTimeChange(timeValue: string) {
        this.props.onChange({
            time: timeValue,
            date: this.getValue().date,
        });
    }

    handleDateChange(dateValue: string) {
        this.props.onChange({
            time: this.getValue().time,
            date: dateValue,
        });
    }

    handleTimeBlur(timeValue: string) {
        this.touchedFields.add('timeTouched');
        const currentValue = this.getValue();
        this.handleBlur({
            time: timeValue,
            date: this.props.value?.date,
        }, {
            touched: !!currentValue.date,
            error: this.state.dateError?.error,
            errorCode: this.state.dateError?.errorCode,
        });
    }

    handleDateBlur(dateValue: string, options: ?Object) {
        this.touchedFields.add('dateTouched');
        this.setState(() => ({
            dateError: { error: options?.error, errorCode: options?.errorCode },
        }), () => {
            const currentValue = this.getValue();
            this.handleBlur({
                time: currentValue.time,
                date: dateValue,
            }, {
                touched: !!currentValue.date,
                error: this.state.dateError?.error,
                errorCode: this.state.dateError?.errorCode,
            });
        });
    }

    handleBlur(value: Value, otherFieldHasValue: Object) {
        const onBlur = this.props.onBlur;
        const touched = this.touchedFields.size === 2;
        if (!value.date && !value.time) {
            onBlur(undefined, {
                touched,
            });
            return;
        }
        onBlur(value, {
            touched: touched || otherFieldHasValue.touched,
            error: otherFieldHasValue?.error,
            errorCode: otherFieldHasValue?.errorCode,
        });
    }

    handleClear = () => {
        this.props.onBlur(null);
    }

    getValue = () => this.props.value || {};

    renderClearButton = () => (
        <IconButton
            style={{ height: '40px', width: '40px', borderRadius: '0' }}
            disabled={!!this.props.disabled}
            onClick={this.handleClear}
        >
            <IconCross24 />
        </IconButton>
    );


    render() {
        const {
            value,
            dateMaxWidth,
            dateWidth,
            calendarWidth,
            classes,
            orientation,
            onBlur,
            dateLabel,
            timeLabel,
            onChange,
            innerMessage,
            ...passOnProps } = this.props;

        const isVertical = orientation === orientations.VERTICAL;
        const currentValue = this.getValue();
        const dateValue = currentValue.date;
        const timeValue = currentValue.time;
        const dateStyle = {
            width: dateWidth,
            maxWidth: dateMaxWidth,
        };
        return (
            <div
                className={defaultClasses.root}
            >
                <div
                    className={classNames(defaultClasses.fieldsContainer, { [defaultClasses.fieldsContainerVertical]: isVertical })}
                >
                    {isVertical ? this.renderClearButton() : null}
                    <div style={dateStyle}>
                        {/* $FlowFixMe[cannot-spread-inexact] automated comment */}
                        <DateTimeDate
                            value={dateValue}
                            maxWidth={dateMaxWidth}
                            width={dateWidth}
                            calendarWidth={calendarWidth}
                            onChange={this.handleDateChange}
                            onBlur={this.handleDateBlur}
                            label={dateLabel}
                            classes={classes}
                            innerMessage={innerMessage}
                            {...passOnProps}
                        />
                        <div className={classes?.innerInputError}>{innerMessage?.message?.dateError}</div>
                    </div>

                    <div>
                        {/* $FlowFixMe[cannot-spread-inexact] automated comment */}
                        <DateTimeTime
                            value={timeValue}
                            onChange={this.handleTimeChange}
                            onBlur={this.handleTimeBlur}
                            label={timeLabel}
                            classes={classes}
                            innerMessage={innerMessage}
                            {...passOnProps}
                        />
                        <div className={classes?.innerInputError}>{innerMessage?.message?.timeError}</div>
                    </div>
                    {isVertical ? null : this.renderClearButton()}
                </div>
            </div>
        );
    }
}
