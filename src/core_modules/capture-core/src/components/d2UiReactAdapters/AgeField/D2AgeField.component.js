// @flow
import React, { Component } from 'react';
import i18n from '@dhis2/d2-i18n';
import moment from 'moment';
import ClearIcon from '@material-ui/icons/Clear';
import D2Date from '../DateAndTimeFields/DateField/D2Date.component';
import D2AgeNumberInput from './D2AgeNumberInput.component';
import parseDate from '../../../utils/parsers/date.parser';

type Props = {
    label?: ?string,
    value: string,
    onBlur: (value: string) => void,
};

type CalculatedValues = {
    date: ?Date,
    years: ?number,
    months: ?number,
    days: ?number,
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

function getCalculatedValues(dateValue: string) {
    const parseData = parseDate(dateValue || '');
    if (!parseData.isValid) {
        return {};
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
        date: parseData.momentDate.toDate(),
        years,
        months,
        days,
    };
}

class D2AgeField extends Component<Props> {
    updateAgeByNumberFields = (values: CalculatedValues) => {
        if (!values.date && !values.years && !values.months && !values.days) {
            return;
        }
        const momentDate = moment();
        momentDate.subtract(values.years || 0, 'years');
        momentDate.subtract(values.months || 0, 'years');
        momentDate.subtract(values.days || 0, 'years');
        this.props.onBlur(momentDate.format('L'));
    }

    updateAgeByDateField = (values: CalculatedValues) => {
        if (!values.date) return;
        this.props.onBlur(moment(values.date).format('L'));
    }

    onClear = () => {
        this.props.onBlur('');
    }

    render() {
        const calculatedValues = getCalculatedValues(this.props.value);
        return (
            <div>
                <div style={labelStyle}>{this.props.label}</div>
                <div style={containerStyle}>
                    <div style={datePickerStyle}>
                        <D2Date
                            value={calculatedValues.date}
                            onBlur={date => this.updateAgeByDateField({ ...calculatedValues, date })}
                            placeholder={i18n.t('mm/dd/yyyy')}
                            width={350}
                            calendarMaxMoment={moment()}
                        />
                    </div>
                    <D2AgeNumberInput
                        label={i18n.t('Years')}
                        value={calculatedValues.years}
                        onBlur={years => this.updateAgeByNumberFields({ ...calculatedValues, years })}
                    />
                    <D2AgeNumberInput
                        label={i18n.t('Months')}
                        value={calculatedValues.years}
                        onBlur={months => this.updateAgeByNumberFields({ ...calculatedValues, months })}
                    />
                    <D2AgeNumberInput
                        label={i18n.t('Days')}
                        value={calculatedValues.years}
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
