import React, { Component } from 'react';
import { Temporal } from '@js-temporal/polyfill';
import {
    IconButton,
} from 'capture-ui';
import { Button, IconCross24 } from '@dhis2/ui';
import i18n from '@dhis2/d2-i18n';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import { AgeNumberInput } from '../internal/AgeInput/AgeNumberInput.component';
import { AgeDateInput } from '../internal/AgeInput/AgeDateInput.component';
import defaultClasses from './ageField.module.css';
import { orientations } from '../constants/orientations.const';
import { withInternalChangeHandler } from '../HOC/withInternalChangeHandler';
import { stringToTemporal, temporalToString, mapDhis2CalendarToTemporal, isCalendarSupported } from '../../capture-core-utils/date';
import type { Props, State, AgeValues } from './AgeField.types';

type AgeInputType = 'date' | 'age';

const ageInputTypes = {
    DATE: 'date' as AgeInputType,
    AGE: 'age' as AgeInputType,
};

const styles: Readonly<any> = {
    ageFieldContainer: {
        display: 'flex',
        flexDirection: 'column',
    },
    ageFieldContainerHorizontal: {
        flexDirection: 'row',
        alignItems: 'flex-end',
    },
    inputContainer: {
        display: 'flex',
        flexDirection: 'column',
        marginRight: 8,
    },
    inputContainerHorizontal: {
        flexDirection: 'row',
        alignItems: 'flex-end',
    },
    buttonContainer: {
        display: 'flex',
        flexDirection: 'row',
        marginTop: 8,
    },
    buttonContainerHorizontal: {
        marginTop: 0,
        marginLeft: 8,
    },
    clearButton: {
        marginRight: 8,
    },
    toggleButton: {
        marginRight: 8,
    },
};

class D2AgeFieldPlain extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            ageInputType: ageInputTypes.DATE,
        };
    }

    onToggleAgeInputType = () => {
        this.setState(prevState => ({
            ageInputType: prevState.ageInputType === ageInputTypes.DATE ? ageInputTypes.AGE : ageInputTypes.DATE,
        }));
    }

    onClear = () => {
        this.props.onBlur(null);
    }

    onBlurDate = (value: string) => {
        if (!value) {
            this.props.onBlur(null);
            return;
        }

        const { calendarType, dateFormat } = this.props;
        const calendar = calendarType || 'gregory';
        const format = dateFormat || 'YYYY-MM-DD';

        if (!isCalendarSupported(calendar)) {
            this.props.onBlur({ date: value });
            return;
        }

        try {
            const temporal = stringToTemporal(value, format, mapDhis2CalendarToTemporal(calendar) as any);
            const today = Temporal.Now.plainDateISO();
            const duration = today.since(temporal as any);

            this.props.onBlur({
                date: value,
                years: duration.years.toString(),
                months: duration.months.toString(),
                days: duration.days.toString(),
            });
        } catch (error) {
            this.props.onBlur({ date: value });
        }
    }

    onBlurAge = (ageValues: AgeValues) => {
        if (!ageValues.years && !ageValues.months && !ageValues.days) {
            this.props.onBlur(null);
            return;
        }

        const { calendarType, dateFormat } = this.props;
        const calendar = calendarType || 'gregory';
        const format = dateFormat || 'YYYY-MM-DD';

        if (!isCalendarSupported(calendar)) {
            this.props.onBlur(ageValues);
            return;
        }

        try {
            const today = Temporal.Now.plainDateISO();
            const duration = Temporal.Duration.from({
                years: parseInt(ageValues.years || '0', 10),
                months: parseInt(ageValues.months || '0', 10),
                days: parseInt(ageValues.days || '0', 10),
            });
            const birthDate = today.subtract(duration);
            const dateString = temporalToString(birthDate, format);

            this.props.onBlur({
                ...ageValues,
                date: dateString,
            });
        } catch (error) {
            this.props.onBlur(ageValues);
        }
    }

    renderDateInput() {
        const { value, classes, disabled, innerMessage, ...passOnProps } = this.props;
        const currentValue = value || {};

        return (
            <AgeDateInput
                value={currentValue.date}
                onBlur={this.onBlurDate}
                classes={classes}
                disabled={disabled}
                innerMessage={innerMessage}
                {...passOnProps as any}
            />
        );
    }

    renderAgeInput() {
        const { value, classes, disabled, innerMessage, ...passOnProps } = this.props;
        const currentValue = value || {};

        return (
            <div className={defaultClasses.ageInputContainer}>
                <AgeNumberInput
                    value={currentValue.years}
                    onBlur={(years: string) => this.onBlurAge({ ...currentValue, years })}
                    label={i18n.t('Years')}
                    classes={classes}
                    disabled={disabled}
                    innerMessage={innerMessage}
                    messageKey="years"
                    {...passOnProps as any}
                />
                <AgeNumberInput
                    value={currentValue.months}
                    onBlur={(months: string) => this.onBlurAge({ ...currentValue, months })}
                    label={i18n.t('Months')}
                    classes={classes}
                    disabled={disabled}
                    innerMessage={innerMessage}
                    messageKey="months"
                    {...passOnProps as any}
                />
                <AgeNumberInput
                    value={currentValue.days}
                    onBlur={(days: string) => this.onBlurAge({ ...currentValue, days })}
                    label={i18n.t('Days')}
                    classes={classes}
                    disabled={disabled}
                    innerMessage={innerMessage}
                    messageKey="days"
                    {...passOnProps as any}
                />
            </div>
        );
    }

    renderClearButton() {
        const { classes, disabled } = this.props;

        return (
            <IconButton
                className={classNames(classes.clearButton, defaultClasses.clearButton)}
                disabled={disabled}
                onClick={this.onClear}
            >
                <IconCross24 />
            </IconButton>
        );
    }

    renderToggleButton() {
        const { classes, disabled } = this.props;
        const { ageInputType } = this.state;

        const buttonText = ageInputType === ageInputTypes.DATE
            ? i18n.t('Enter age')
            : i18n.t('Enter date of birth');

        return (
            <Button
                className={classNames(classes.toggleButton, defaultClasses.toggleButton)}
                disabled={disabled}
                onClick={this.onToggleAgeInputType}
                small
            >
                {buttonText}
            </Button>
        );
    }

    renderVertical() {
        const { classes } = this.props;
        const { ageInputType } = this.state;

        return (
            <div className={classNames(classes.ageFieldContainer, defaultClasses.ageFieldContainer)}>
                <div className={classNames(classes.inputContainer, defaultClasses.inputContainer)}>
                    {ageInputType === ageInputTypes.DATE ? this.renderDateInput() : this.renderAgeInput()}
                </div>
                <div className={classNames(classes.buttonContainer, defaultClasses.buttonContainer)}>
                    {this.renderClearButton()}
                    {this.renderToggleButton()}
                </div>
            </div>
        );
    }

    renderHorizontal() {
        const { classes } = this.props;
        const { ageInputType } = this.state;

        return (
            <div className={classNames(
                classes.ageFieldContainer,
                classes.ageFieldContainerHorizontal,
                defaultClasses.ageFieldContainer,
                defaultClasses.ageFieldContainerHorizontal,
            )}
            >
                <div className={classNames(
                    classes.inputContainer,
                    classes.inputContainerHorizontal,
                    defaultClasses.inputContainer,
                    defaultClasses.inputContainerHorizontal,
                )}
                >
                    {ageInputType === ageInputTypes.DATE ? this.renderDateInput() : this.renderAgeInput()}
                </div>
                <div className={classNames(
                    classes.buttonContainer,
                    classes.buttonContainerHorizontal,
                    defaultClasses.buttonContainer,
                    defaultClasses.buttonContainerHorizontal,
                )}
                >
                    {this.renderClearButton()}
                    {this.renderToggleButton()}
                </div>
            </div>
        );
    }

    render() {
        return this.props.orientation === orientations.VERTICAL ? this.renderVertical() : this.renderHorizontal();
    }
}

export const AgeField = withInternalChangeHandler()(withStyles(styles)(D2AgeFieldPlain));
