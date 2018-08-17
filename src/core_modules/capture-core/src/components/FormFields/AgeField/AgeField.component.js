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

const labelStyle = {
    color: 'rgba(0, 0, 0, 0.54)',
    fontSize: '1em',
};

function monthsDiff(d) {
    const now = new Date();
    let months = (now.getFullYear() - d.getFullYear()) * 12;
    months += now.getMonth() - d.getMonth();

    if (now.getDate() < d.getDate()) {
        months -= 1;
    }

    return months;
}

function daysDiff(d) {
    const now = new Date();

    if (d.getDate() === now.getDate()) {
        return 0;
    }

    if (now.getDate() > d.getDate()) {
        return now.getDate() - d.getDate();
    }

    if (d.getDate() > now.getDate()) {
        const lastDate = new Date(d.getFullYear(), d.getMonth() + 1, 0);
        const d2 = new Date(d.getFullYear(), d.getMonth() + 1, now.getDate());
        let diff = lastDate.getDate() - d.getDate();
        diff += d2.getDate();
        return diff;
    }

    return 0;
}

function calculatedValues(d) {
    const totalMonths = monthsDiff(d);
    const years = Math.floor(totalMonths / 12);
    const months = totalMonths % 12;
    const days = daysDiff(d);

    return {
        days,
        months,
        years,
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
          const v = calculatedValues(new Date(props.value));
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

  updateDate = () => {
      let { years, months, days } = this.state;

      years = years === '' ? 0 : years;
      months = months === '' ? 0 : months;
      days = days === '' ? 0 : days;

      years = parseInt(years, 10);
      months = parseInt(months, 10);
      days = parseInt(days, 10);

      const d = moment();
      d.subtract(years, 'years');
      d.subtract(months, 'months');
      d.subtract(days, 'days');

      this.setState({
          ...calculatedValues(d.toDate()),
          date: d.format('MM/DD/YYYY'),
      }, this.emitChange);
  }

  onYearsChange = evt => this.setState({ years: evt.target.value })
  onMonthsChange = evt => this.setState({ months: evt.target.value })
  onDaysChange = evt => this.setState({ days: evt.target.value })

  handleCalendarBlur = (date) => {
      if (!date) {
          return;
      }

      this.setState({
          date,
          ...calculatedValues(new Date(date)),
      }, this.emitChange);
  }

  render() {
      return (
          <div>
              <div style={labelStyle}>{this.props.label}</div>
              <div style={containerStyle}>
                  <div style={datePickerStyle}>
                      <D2Date
                          value={this.state.date}
                          onBlur={this.handleCalendarBlur}
                          placeholder={i18n.t('mm/dd/yyyy')}
                          width={350}
                          calendarMaxMoment={moment()}
                      />
                  </div>
                  <TextField
                      style={textFieldStyle}
                      type="text"
                      label={i18n.t('Years')}
                      value={this.state.years}
                      onBlur={this.updateDate}
                      onChange={this.onYearsChange}
                  />
                  <TextField
                      style={textFieldStyle}
                      type="text"
                      label={i18n.t('Months')}
                      value={this.state.months}
                      onBlur={this.updateDate}
                      onChange={this.onMonthsChange}
                  />
                  <TextField
                      style={textFieldStyle}
                      type="text"
                      label={i18n.t('Days')}
                      value={this.state.days}
                      onBlur={this.updateDate}
                      onChange={this.onDaysChange}
                  />
              </div>
          </div>
      );
  }
}

export default D2AgeField;
