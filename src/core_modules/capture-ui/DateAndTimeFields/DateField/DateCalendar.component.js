// @flow
/* eslint-disable class-methods-use-this */
import React, { Component } from 'react';
import moment from 'moment';
import InfiniteCalendar from '@joakim_sm/react-infinite-calendar';
import '@joakim_sm/react-infinite-calendar/styles.css';
import './customStyles.css';

type Props = {
  onDateSelected: (value: any) => void,
  value?: ?string,
  minMoment?: Object,
  maxMoment?: Object,
  currentWidth: number,
  height?: ?number,
  classes: Object,
  displayOptions?: ?Object,
  calendarTheme: Object,
  onConvertValueIn: (inputValue: ?string) => Date,
  onConvertValueOut: (date: Date) => string,
};

class DateCalendar extends Component<Props> {
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

  static displayOptions = {
    showHeader: true,
    showMonthsForYears: false,
  };

  handleChange(changeDate: Date) {
    const changeDateInLocalFormat = this.props.onConvertValueOut(changeDate);
    this.props.onDateSelected(changeDateInLocalFormat);
  }

  getValue(inputValue: ?string) {
    return this.props.onConvertValueIn(inputValue);
  }

  getMinMaxProps() {
    const { minMoment = moment('1900-01-01'), maxMoment = moment('2099-12-31') } = this.props;

    const minDate = minMoment.toDate();
    const maxDate = maxMoment.toDate();

    return {
      min: minDate,
      minDate,
      max: maxDate,
      maxDate,
    };
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
        {/* $FlowFixMe */}
        <InfiniteCalendar
          {...this.getMinMaxProps()}
          selected={this.getValue(value)}
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
