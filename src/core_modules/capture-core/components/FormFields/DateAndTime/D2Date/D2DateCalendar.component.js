// @flow
/* eslint-disable class-methods-use-this */
import React, { Component } from 'react';
import { withStyles, withTheme } from '@material-ui/core/styles';
import InfiniteCalendar from '@joakim_sm/react-infinite-calendar';
import { capitalizeFirstLetter } from 'capture-core-utils/string';
import '@joakim_sm/react-infinite-calendar/styles.css';
import './customStyles.css';
import { parseDate, convertDateObjectToDateFormatString } from '../../../../utils/converters/date';
import CurrentLocaleData from '../../../../utils/localeData/CurrentLocaleData';
import getTheme from './getTheme';

type Props = {
  onDateSelected: (value: any) => void,
  value?: ?string,
  minMoment?: ?Object,
  maxMoment?: ?Object,
  currentWidth: number,
  height?: ?number,
  classes: Object,
  displayOptions?: ?Object,
  theme: Object,
};

const styles = () => ({
  container: {},
});

class D2DateCalendar extends Component<Props> {
  handleChange: (e: any, dates: ?Array<Date>) => void;

  calendarLocaleData: Object;

  theme: Object;

  displayOptions: Object;

  constructor(props: Props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);

    const projectLocaleData = CurrentLocaleData.get();
    const { currentWidth } = this.props;

    this.calendarLocaleData = {
      locale: projectLocaleData.dateFnsLocale,
      headerFormat:
        currentWidth >= 400
          ? projectLocaleData.calendarFormatHeaderLong
          : projectLocaleData.calendarFormatHeaderShort,
      weekdays: projectLocaleData.weekDaysShort.map((day) => capitalizeFirstLetter(day)),
      blank: projectLocaleData.selectDatesText,
      todayLabel: {
        long: projectLocaleData.todayLabelLong,
        short: projectLocaleData.todayLabelShort,
      },
      weekStartsOn: projectLocaleData.weekStartsOn,
    };

    this.theme = getTheme(this.props.theme);

    this.displayOptions = {
      ...D2DateCalendar.displayOptions,
      ...this.props.displayOptions,
    };
  }

  shouldComponentUpdate(nextProps: Props) {
    // Selecting multiple dates, then updating the props to the infiniteCalendar makes the Component "jump" back to the first selected date
    if (nextProps.currentWidth !== this.props.currentWidth) {
      const projectLocaleData = CurrentLocaleData.get();
      if (nextProps.currentWidth < 400) {
        this.calendarLocaleData.headerFormat = projectLocaleData.calendarFormatHeaderShort;
      } else {
        this.calendarLocaleData.headerFormat = projectLocaleData.calendarFormatHeaderLong;
      }
      return true;
    }
    return false;
  }

  static displayOptions = {
    showHeader: false,
  };

  handleChange(changeDate: Date) {
    const dateFormatString = convertDateObjectToDateFormatString(changeDate);
    this.props.onDateSelected(dateFormatString);
  }

  getValue(inputValue: ?string) {
    if (!inputValue) {
      return null;
    }

    const parseData = parseDate(inputValue);
    if (!parseData.isValid) {
      return null;
    }

    // $FlowFixMe[incompatible-use] automated comment
    return parseData.momentDate.toDate();
  }

  getMinMaxProps() {
    const minMaxProps: {
      min?: Date,
      minDate?: Date,
      max?: Date,
      maxDate?: Date,
    } = {};

    const { minMoment } = this.props;
    const { maxMoment } = this.props;

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
      theme,
      displayOptions,
      ...passOnProps
    } = this.props;

    return (
      <div className={classes.container}>
        {/* $FlowFixMe */}
        <InfiniteCalendar
          {...this.getMinMaxProps()}
          selected={this.getValue(value)}
          onSelect={this.handleChange}
          locale={this.calendarLocaleData}
          width={currentWidth}
          height={height}
          autoFocus={false}
          theme={this.theme}
          displayOptions={this.displayOptions}
          {...passOnProps}
        />
      </div>
    );
  }
}

export default withTheme()(withStyles(styles)(D2DateCalendar));
