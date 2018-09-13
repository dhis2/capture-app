// @flow
import React, { Component } from 'react';
import i18n from '@dhis2/d2-i18n';
import moment from 'moment';
import classNames from 'classnames';
import ClearIcon from '@material-ui/icons/Clear';
import AgeNumberInput from '../internal/AgeInput/AgeNumberInput.component';
import AgeDateInput from '../internal/AgeInput/AgeDateInput.component';
import parseDate from '../../../utils/parsers/date.parser';
import defaultClasses from '../../d2Ui/ageField/ageField.mod.css';
import orientations from '../constants/orientations.const';

type Props = {
    value: ?string,
    onAgeChanged: (value: string) => void,
    orientation: $Values<typeof orientations>,
};

type CalculatedValues = {
    date: ?string,
    years: ?string,
    months: ?string,
    days: ?string,
}

function getCalculatedValues(dateValue: ?string): CalculatedValues {
    const parseData = parseDate(dateValue || '');
    if (!parseData.isValid) {
        return {
            date: dateValue,
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
    onClear = () => {
        this.props.onAgeChanged('');
    }

    updateByNumberInput = (values: CalculatedValues) => {
        if (!values.date && !values.years && !values.months && !values.days) {
            return;
        }
        const momentDate = moment();
        momentDate.subtract(values.years || 0, 'years');
        momentDate.subtract(values.months || 0, 'months');
        momentDate.subtract(values.days || 0, 'days');
        this.props.onAgeChanged(momentDate.format('L'));
    }

    render() {
        const { value, orientation } = this.props;
        const calculatedValues = getCalculatedValues(value);
        const containerClass = classNames(
            defaultClasses.container,
            orientation === orientations.VERTICAL ? defaultClasses.containerVertical : '',
        );

        return (
            <div className={containerClass}>
                <AgeDateInput
                    onAgeChanged={this.props.onAgeChanged}
                    value={calculatedValues.date}
                />
                <AgeNumberInput
                    label={i18n.t('Years')}
                    value={calculatedValues.years}
                    onBlur={years => this.updateByNumberInput({ ...calculatedValues, years })}
                />
                <AgeNumberInput
                    label={i18n.t('Months')}
                    value={calculatedValues.months}
                    onBlur={months => this.updateByNumberInput({ ...calculatedValues, months })}
                />
                <AgeNumberInput
                    label={i18n.t('Days')}
                    value={calculatedValues.days}
                    onBlur={days => this.updateByNumberInput({ ...calculatedValues, days })}
                />
                <ClearIcon
                    onClick={this.onClear}
                />
            </div>
        );
    }
}

export default D2AgeField;
