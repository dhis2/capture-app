// @flow
import React, { Component } from 'react';
import i18n from '@dhis2/d2-i18n';
import moment from 'moment';
import TextField from '@material-ui/core/TextField';
import D2Date from '../DateAndTime/D2Date/D2Date.component';
import { absoluteDirections, modes } from '../DateAndTime/D2Date/d2DatePopup.const';

type Props = {
  onBlur: (value: string, event: UiEventData) => void,
};

const containerStyle = {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'nowrap',
};

const datePickerStyle = {
    marginTop: 16,
};

const textFieldStyle = {
    marginLeft: 8,
    width: 60,
};

function calculatedValues(m) {
    const days = moment().diff(m, 'days');
    const months = moment().diff(m, 'months');
    const years = moment().diff(m, 'years');

    return {
        days: days < 0 ? '' : days,
        months: months < 0 ? '' : months,
        years: years < 0 ? '' : years,
    };
}

class D2AgeField extends Component<Props> {
  static defaultProps = {
      value: '',
  };

  constructor(props: Props) {
      super(props);

      let years = '';
      let months = '';
      let days = '';
      if (props.value) {
          const v = calculatedValues(moment(props.value));
          years = v.years;
          months = v.months;
          days = v.days;
      }

      this.state = {
          date: props.value,
          years,
          months,
          days,
      };
  }

  emitChange = () => {
      this.props.onBlur(this.state.date);
  }

  updateDate = (updateOn) => {
      const { date, years, months, days } = this.state;
      const m = moment(date);

      if (updateOn === 'years') {
          m.year(moment().subtract(years, 'years').year());
      } else if (updateOn === 'months') {
          m.month(moment().subtract(months, 'months').month());
      } else if (updateOn === 'days') {
          m.date(moment().subtract(days, 'days').date());
      }

      this.setState({
          ...calculatedValues(m),
          date: m.format('MM/DD/YYYY'),
      }, this.emitChange);
  }

  onYearsChange = (evt) => {
      const years = parseInt(evt.target.value, 10);
      if (!isNaN(years) && years >= 0) {
          this.setState({ years }, () => this.updateDate('years'));
      }
  }

  onMonthsChange = (evt) => {
      const months = parseInt(evt.target.value, 10);
      if (!isNaN(months) && months >= 0) {
          this.setState({ months }, () => this.updateDate('months'));
      }
  }

  onDaysChange = (evt) => {
      const days = parseInt(evt.target.value, 10);
      if (!isNaN(days) && days >= 0) {
          this.setState({ days }, () => this.updateDate('days'));
      }
  }

  handleCalendarBlur = (date) => {
      const m = moment(date);
      this.setState({
          date,
          ...calculatedValues(m),
      }, this.emitChange);
  }

  render() {
      return (
          <div style={containerStyle}>
              <div style={datePickerStyle}>
                  <D2Date
                      value={this.state.date}
                      onBlur={this.handleCalendarBlur}
                      placeholder={i18n.t('mm/dd/yyyy')}
                      popupMode={modes.ABSOLUTE}
                      popupAbsoluteDirection={absoluteDirections.UP}
                      width={150}
                      calendarWidth={330}
                      calendarHeight={170}
                      calendarRowHeight={45}
                      calendarDisplayOptions={this.displayOptions}
                  />
              </div>
              <TextField
                  style={textFieldStyle}
                  type="text"
                  label={i18n.t('Years')}
                  value={this.state.years}
                  onChange={this.onYearsChange}
              />
              <TextField
                  style={textFieldStyle}
                  type="text"
                  label={i18n.t('Months')}
                  value={this.state.months}
                  onChange={this.onMonthsChange}
              />
              <TextField
                  style={textFieldStyle}
                  type="text"
                  label={i18n.t('Days')}
                  value={this.state.days}
                  onChange={this.onDaysChange}
              />
          </div>
      );
  }
}

export default D2AgeField;
