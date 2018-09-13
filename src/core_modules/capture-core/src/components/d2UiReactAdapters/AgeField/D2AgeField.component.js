// @flow
import React, { Component } from 'react';
import i18n from '@dhis2/d2-i18n';
import moment from 'moment';
import ClearIcon from '@material-ui/icons/Clear';
import D2Date from '../DateAndTimeFields/DateField/D2Date.component';
import AgeNumberInput from '../internal/AgeNumberInput/AgeNumberInput.component';
import parseDate from '../../../utils/parsers/date.parser';

type Props = {
    label?: ?string,
    value: ?string,
    onAgeChanged: (value: string) => void,
};

type CalculatedValues = {
    date: ?string,
    years: ?string,
    months: ?string,
    days: ?string,
}

const containerStyle = {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'nowrap',
};

const datePickerStyle = {
    marginTop: 16,
};

const labelStyle = {
    color: 'rgba(0, 0, 0, 0.54)',
    fontSize: '1em',
};

const clearIconStyle = {
    cursor: 'pointer',
    marginTop: 20,
    marginLeft: 10,
};

function getCalculatedValues(dateValue: ?string) {
    const parseData = parseDate(dateValue || '');
    if (!parseData.isValid) {
        return {
            date: '',
            years: '',
            months: '',
            days: '',
        };
    }
    const now = moment();
    const age = moment(parseData.momentDate);

    const years = now.diff(age, 'years');
    age.add(years, 'years');

    const months = now.diff(age, 'months');
    age.add(months, 'months');

    const days = now.diff(age, 'days');

    return {
        // $FlowSuppress
        date: parseData.momentDate.format('L'),
        years: years.toString(),
        months: months.toString(),
        days: days.toString(),
    };
}

class D2AgeField extends Component<Props> {
    updateAgeByNumberFields = (values: CalculatedValues) => {
        if (!values.date && !values.years && !values.months && !values.days) {
            return;
        }
        const momentDate = moment();
        momentDate.subtract(values.years || 0, 'years');
        momentDate.subtract(values.months || 0, 'months');
        momentDate.subtract(values.days || 0, 'days');
        this.props.onAgeChanged(momentDate.format('L'));
    }

    updateAgeByDateField = (value: string) => {
        if (!value) return;
        this.props.onAgeChanged(value);
    }

    onClear = () => {
        this.props.onAgeChanged('');
    }

    render() {
        const { value } = this.props;
        const calculatedValues = getCalculatedValues(value);
        console.log(calculatedValues.days);
        return (
            <div>
                <div style={labelStyle}>{this.props.label}</div>
                <div style={containerStyle}>
                    <div style={datePickerStyle}>
                        <D2Date
                            value={calculatedValues.date}
                            onBlur={this.updateAgeByDateField}
                            placeholder={i18n.t('mm/dd/yyyy')}
                            width={350}
                            calendarMaxMoment={moment()}
                        />
                    </div>
                    <AgeNumberInput
                        label={i18n.t('Years')}
                        value={calculatedValues.years}
                        onBlur={years => this.updateAgeByNumberFields({ ...calculatedValues, years })}
                    />
                    <AgeNumberInput
                        label={i18n.t('Months')}
                        value={calculatedValues.months}
                        onBlur={months => this.updateAgeByNumberFields({ ...calculatedValues, months })}
                    />
                    <AgeNumberInput
                        label={i18n.t('Days')}
                        value={calculatedValues.days}
                        onBlur={days => this.updateAgeByNumberFields({ ...calculatedValues, days })}
                    />
                    <ClearIcon
                        style={clearIconStyle}
                        onClick={this.onClear}
                    />
                </div>
            </div>
        );
    }
}

export default D2AgeField;
