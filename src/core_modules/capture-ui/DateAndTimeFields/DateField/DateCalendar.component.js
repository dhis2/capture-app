// @flow
/* eslint-disable class-methods-use-this */
import React, { Component } from 'react';
import InfiniteCalendar from '@joakim_sm/react-infinite-calendar';
import '@joakim_sm/react-infinite-calendar/styles.css';
import './customStyles.css';

type Props = {
    onDateSelected: (value: any) => void,
    value?: ?string,
    minMoment?: ?Object,
    maxMoment?: ?Object,
    currentWidth: number,
    height?: ?number,
    classes: Object,
    displayOptions?: ?Object,
    calendarTheme: Object,
    onConvertValueIn: (inputValue: ?string) => Date,
    onConvertValueOut: (date: Date) => string,
};

class DateCalendar extends Component<Props> {
    static displayOptions = {
        showHeader: true,
        showMonthsForYears: false,
    };

    handleChange: (e: any, dates: ?Array<Date>) => void;
    displayOptions: Object;

    constructor(props: Props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);

        this.displayOptions = {
            ...DateCalendar.displayOptions,
            ...this.props.displayOptions,
        };
    }

    shouldComponentUpdate() {
        return false;
    }

    handleChange(changeDate: Date) {
        const changeDateInLocalFormat = this.props.onConvertValueOut(changeDate);
        this.props.onDateSelected(changeDateInLocalFormat);
    }

    getValue(inputValue: ?string) {
        return this.props.onConvertValueIn(inputValue);
    }

    getMinMaxProps() {
        const minMaxProps: {min?: Date, minDate?: Date, max?: Date, maxDate?: Date} = {};

        const minMoment = this.props.minMoment;
        const maxMoment = this.props.maxMoment;

        if (minMoment) {
            const minDate = minMoment.toDate();
            minMaxProps.min = minDate;
            minMaxProps.minDate = minDate;
        }

        if (maxMoment) {
            const maxDate = maxMoment.toDate();
            minMaxProps.max = maxDate;
            minMaxProps.maxDate = maxDate;
        }
        return minMaxProps;
    }

    render() {
        const {
            value,
            classes,
            currentWidth,
            height,
            minMoment,
            maxMoment,
            onDateSelected,
            displayOptions,
            ...passOnProps
        } = this.props;

        return (
            <div>
                { /* $FlowFixMe */}
                <InfiniteCalendar
                    {...this.getMinMaxProps()}
                    selected={this.getValue((value))}
                    onSelect={this.handleChange}
                    width={currentWidth}
                    height={height}
                    autoFocus={false}
                    displayOptions={this.displayOptions}
                    {...passOnProps}
                />
            </div>
        );
    }
}

export default DateCalendar;
