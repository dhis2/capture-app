// @flow
import React, { Component } from 'react';
import i18n from '@dhis2/d2-i18n';
import classNames from 'classnames';
import defaultClasses from './dateTime.mod.css';

import orientations from '../../constants/orientations.const';
import DateTimeDate from '../../internal/DateTimeInput/DateTimeDate.component';
import DateTimeTime from '../../internal/DateTimeInput/DateTimeTime.component';

type Value = {
    date?: ?string,
    time?: ?string,
};

type Props = {
    onBlur: (value: ?Value, options: Object) => void,
    onChange: (value: ?Value) => void,
    value: Value,
    dateMaxWidth: any,
    dateWidth: any,
    calendarWidth?: ?number,
    orientation: $Values<typeof orientations>,
    calendarTheme: Object,
    calendarLocale: Object,
    calendarOnConvertValueIn: Function,
    calendarOnConvertValueOut: Function,
    popupAnchorPosition?: ?any,
    classes: Object,
    dateLabel: string,
    timeLabel: string,
};

class D2DateTime extends Component<Props> {
    static defaultProps = {
        dateLabel: i18n.t('Date'),
        timeLabel: i18n.t('Time'),
        value: {},
    };

    handleTimeChange: (timeValue: string) => void;
    handleDateChange: (dateValue: string) => void;
    handleTimeBlur: (timeValue: string) => void;
    handleDateBlur: (dateValue: string) => void;
    touchedFields: Set<string>;
    inFocusLabelClasses: Object;

    constructor(props: Props) {
        super(props);
        this.handleTimeChange = this.handleTimeChange.bind(this);
        this.handleDateChange = this.handleDateChange.bind(this);
        this.handleTimeBlur = this.handleTimeBlur.bind(this);
        this.handleDateBlur = this.handleDateBlur.bind(this);
        this.touchedFields = new Set();

    }

    handleTimeChange(timeValue: string) {
        this.props.onChange({
            time: timeValue,
            date: this.props.value.date,
        });
    }

    handleDateChange(dateValue: string) {
        this.props.onChange({
            time: this.props.value.time,
            date: dateValue,
        });
    }

    handleTimeBlur(timeValue: string) {
        this.touchedFields.add('timeTouched');
        this.handleBlur({
            time: timeValue,
            date: this.props.value.date,
        }, !!this.props.value.date);
    }

    handleDateBlur(dateValue: string) {
        this.touchedFields.add('dateTouched');
        this.handleBlur({
            time: this.props.value.time,
            date: dateValue,
        }, !!this.props.value.time);
    }

    handleBlur(value: Value, otherFieldHasValue: boolean) {
        const onBlur = this.props.onBlur;
        const touched = this.touchedFields.size === 2;
        if (!value.date && !value.time) {
            onBlur(undefined, {
                touched,
            });
            return;
        }
        onBlur(value, {
            touched: touched || otherFieldHasValue,
        });
    }

    render() {
        const {
            value,
            dateMaxWidth,
            dateWidth,
            calendarWidth,
            popupAnchorPosition,
            calendarTheme,
            calendarLocale,
            calendarOnConvertValueIn,
            calendarOnConvertValueOut,
            classes,
            orientation,
            onBlur,
            dateLabel,
            timeLabel,
            onChange,
            ...passOnProps } = this.props;
        const isVertical = orientation === orientations.VERTICAL;
        const dateValue = value.date;
        const timeValue = value.time;
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
                    <div style={dateStyle}>
                        <DateTimeDate
                            value={dateValue}
                            maxWidth={dateMaxWidth}
                            width={dateWidth}
                            calendarWidth={calendarWidth}
                            onChange={this.handleDateChange}
                            onBlur={this.handleDateBlur}
                            label={dateLabel}
                            calendarTheme={calendarTheme}
                            popupAnchorPosition={popupAnchorPosition}
                            calendarLocale={calendarLocale}
                            calendarOnConvertValueIn={calendarOnConvertValueIn}
                            calendarOnConvertValueOut={calendarOnConvertValueOut}
                            classes={classes}
                            {...passOnProps}
                        />
                    </div>

                    <DateTimeTime
                        value={timeValue}
                        onChange={this.handleTimeChange}
                        onBlur={this.handleTimeBlur}
                        label={timeLabel}
                        classes={classes}
                        {...passOnProps}
                    />
                </div>
            </div>
        );
    }
}

export default D2DateTime;
