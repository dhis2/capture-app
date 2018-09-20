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

type InputMessageClasses = {
    error?: ?string,
    warning?: ?string,
    info?: ?string,
    validating?: ?string,
}

type Props = {
    value: ?AgeValues,
    onAgeChanged: (value: ?AgeValues) => void,
    onChange: (value: ?AgeValues) => void,
    orientation: $Values<typeof orientations>,
    innerMessage?: ?any,
    classes: Object,
    inputMessageClasses: ?InputMessageClasses,
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

const messageTypeClass = {
    error: 'innerInputError',
    info: 'innerInputInfo',
    warning: 'innerInputWarning',
    validating: 'innerInputValidating',
};

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

    handleNumberBlur = (values: AgeValues) => {
        this.props.onRemoveFocus && this.props.onRemoveFocus();
        if (D2AgeField.isEmptyNumbers(values)) {
            this.props.onAgeChanged(values.date ? { date: values.date } : null);
            return;
        }

        if (!D2AgeField.isValidNumbers(values)) {
            this.props.onAgeChanged({ ...values, date: '' });
            return;
        }

        const momentDate = moment(undefined, undefined, true);
        momentDate.subtract(D2AgeField.getNumberOrZero(values.years), 'years');
        momentDate.subtract(D2AgeField.getNumberOrZero(values.months), 'months');
        momentDate.subtract(D2AgeField.getNumberOrZero(values.days), 'days');
        const calculatedValues = getCalculatedValues(momentDate.format('L'));
        const valid = momentDate.isValid();
        this.props.onAgeChanged(calculatedValues);
    }

    handleDateBlur = (date: ?string) => {
        this.props.onRemoveFocus && this.props.onRemoveFocus();
        const calculatedValues = date ? getCalculatedValues(date) : null;
        this.props.onAgeChanged(calculatedValues);
    }

    renderMessage = (key: string) => {
        const { classes, innerMessage: messageContainer } = this.props;
        if (messageContainer) {
            const message = messageContainer.message && messageContainer.message[key];
            const className = (classes && classes[messageTypeClass[messageContainer.messageType]]) || '';
            return message && (<div className={className}>{message}</div>);
        }
        return null;
    }

    renderNumberInput = (currentValues: AgeValues, key: string, label: string) => {
        const { innerMessage, onChange, inFocus, value, ...passOnProps } = this.props;
        return (
            <div className={defaultClasses.ageNumberInputContainer}>
                <AgeNumberInput
                    label={i18n.t(label)}
                    value={currentValues[key]}
                    onBlur={value => this.handleNumberBlur({ ...currentValues, [key]: value })}
                    onChange={value => onChange({ ...currentValues, [key]: value })}
                    {...passOnProps}
                />
                {innerMessage && this.renderMessage(key)}
            </div>
        );
    }
    renderDateInput = (currentValues: AgeValues) => {
        const { onChange, innerMessage, inFocus, value, ...passOnProps } = this.props;
        return (
            <div className={defaultClasses.ageDateInputContainer}>
                <AgeDateInput
                    onBlur={this.handleDateBlur}
                    value={currentValues.date}
                    onChange={date => onChange({ ...currentValues, date })}
                    {...passOnProps}
                />
                {innerMessage && this.renderMessage('date')}
            </div>

        );
    }

    render() {
        const { value, orientation } = this.props;
        const currentValues = value || {};
        const containerClass = classNames(
            defaultClasses.container,
            { [defaultClasses.containerVertical]: orientation === orientations.VERTICAL },
        );
        const inputsContainerClass = classNames(
            defaultClasses.inputsContainer,
            { [defaultClasses.inputsContainerVertical]: orientation === orientations.VERTICAL },
        );

        return (
            <div className={containerClass}>
                <div className={inputsContainerClass}>
                    {this.renderDateInput(currentValues)}
                    {this.renderNumberInput(currentValues, 'years', 'Years')}
                    {this.renderNumberInput(currentValues, 'months', 'Months')}
                    {this.renderNumberInput(currentValues, 'days', 'Days')}
                </div>
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
