// @flow
import React, { Component } from 'react';
import { Validators } from '@dhis2/d2-ui-forms';
import i18n from '@dhis2/d2-i18n';
import moment from 'moment';
import classNames from 'classnames';
import ClearIcon from '@material-ui/icons/Clear';
import AgeNumberInput from '../internal/AgeInput/AgeNumberInput.component';
import AgeDateInput from '../internal/AgeInput/AgeDateInput.component';
import parseDate from '../../../utils/parsers/date.parser';
import defaultClasses from '../../d2Ui/ageField/ageField.mod.css';
import orientations from '../constants/orientations.const';
import withInternalChangeHandler from '../HOC/withInternalChangeHandler';

type AgeValues = {
    date?: ?string,
    years?: ?string,
    months?: ?string,
    days?: ?string,
}

type Props = {
    value: ?AgeValues,
    onAgeChanged: (value: ?AgeValues) => void,
    orientation: $Values<typeof orientations>,
    innerMessage?: ?any,
};

function getCalculatedValues(dateValue: ?string): AgeValues {
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
    static isEmptyNumbers(values: AgeValues) {
        return !values.years && !values.months && !values.days;
    }
    static isPositiveOrZeroNumber(value: ?any) {
        return Validators.isPositiveNumber(value) || Number(value) === 0;
    }
    static isValidNumbers(values: AgeValues) {
        return D2AgeField.isPositiveOrZeroNumber(values.years || 0) &&
            D2AgeField.isPositiveOrZeroNumber(values.months || 0) &&
            D2AgeField.isPositiveOrZeroNumber(values.days || 0);
    }

    static getNumberOrZero(value: ?string) {
        return value || 0;
    }

    onClear = () => {
        this.props.onAgeChanged(null);
    }

    handleNumberInput = (values: AgeValues) => {
        if (D2AgeField.isEmptyNumbers(values)) {
            this.props.onAgeChanged({ date: values.date });
            return;
        }

        if (!D2AgeField.isValidNumbers(values)) {
            this.props.onAgeChanged({ ...values, date: '' });
            return;
        }

        const momentDate = moment();
        momentDate.subtract(D2AgeField.getNumberOrZero(values.years), 'years');
        momentDate.subtract(D2AgeField.getNumberOrZero(values.months), 'months');
        momentDate.subtract(D2AgeField.getNumberOrZero(values.days), 'days');
        const calculatedValues = getCalculatedValues(momentDate.format('L'));
        this.props.onAgeChanged(calculatedValues);
    }

    handleDateInput = (date: ?string) => {
        const calculatedValues = getCalculatedValues(date);
        this.props.onAgeChanged(calculatedValues);
    }

    getMessages = (innerMessage: ?any) => {
        const messages = innerMessage && innerMessage.message;
        if (messages) {
            return Object.keys(messages).reduce((map, messageKey) => {
                // $FlowSuppress
                map[messageKey] = { message: messages[messageKey], className: innerMessage.className };
                return map;
            }, {});
        }
        return {};
    }

    render() {
        const { value, orientation, innerMessage } = this.props;
        const currentValues = value || {};
        const containerClass = classNames(
            defaultClasses.container,
            orientation === orientations.VERTICAL ? defaultClasses.containerVertical : '',
        );
        const numberInputClass = {
            ageInputContainer: classNames(defaultClasses.ageInputContainer, defaultClasses.ageNumberInputContainer),
        };
        const messages = this.getMessages(innerMessage);
        return (
            <div className={containerClass}>
                <AgeDateInput
                    onAgeChanged={this.handleDateInput}
                    value={currentValues.date}
                    message={messages.date}
                    orientation={orientation}
                />
                <AgeNumberInput
                    classes={numberInputClass}
                    label={i18n.t('Years')}
                    value={currentValues.years}
                    onBlur={years => this.handleNumberInput({ ...currentValues, years })}
                    message={messages.years}
                />
                <AgeNumberInput
                    classes={numberInputClass}
                    label={i18n.t('Months')}
                    value={currentValues.months}
                    onBlur={months => this.handleNumberInput({ ...currentValues, months })}
                    message={messages.months}
                />
                <AgeNumberInput
                    classes={numberInputClass}
                    label={i18n.t('Days')}
                    value={currentValues.days}
                    onBlur={days => this.handleNumberInput({ ...currentValues, days })}
                    message={messages.days}
                />
                <div className={defaultClasses.ageClear}>
                    <ClearIcon
                        onClick={this.onClear}
                    />
                </div>

            </div>
        );
    }
}

export default withInternalChangeHandler()(D2AgeField);
