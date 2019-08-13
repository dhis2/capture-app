// @flow
/* eslint-disable class-methods-use-this */
import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import InfiniteCalendar, { Calendar, defaultMultipleDateInterpolation, withMultipleDates } from 'react-infinite-calendar';

import moment from 'capture-core-utils/moment/momentResolver';
import 'react-infinite-calendar/styles.css';
import CurrentLocaleData from '../../../utils/localeData/CurrentLocaleData';

// import makeMaxWidthContainer from 'abaris-ui/src/HOC/makeMaxWidthContainer';

type Props = {
    onBlur: (value: any) => void,
    value?: ?Array<string>,
    minMoment?: ?Object,
    maxMoment?: ?Object,
    currentWidth: number
};

const styles = theme => ({
    container: '5px',

});

class DateMulti extends Component<Props> {
    props: propsTypes;
    handleChange: (e: any, dates: ?Array<Date>) => void;
    calendarLocaleData: Object;

    constructor(props: propsTypes) {
        super(props);
        this.handleChange = this.handleChange.bind(this);

        const projectLocaleData = CurrentLocaleData.get();
        const currentWidth = this.props.currentWidth;

        this.calendarLocaleData = {
            locale: projectLocaleData.dateFnsLocale,
            headerFormat: currentWidth >= 400 ? projectLocaleData.calendarFormatHeaderLong : projectLocaleData.calendarFormatHeaderShort,
            weekdays: projectLocaleData.weekDays,
            blank: projectLocaleData.selectDatesText,
            todayLabel: {
                long: projectLocaleData.todayLabelLong,
                short: projectLocaleData.todayLabelShort,
            },
            weekStartsOn: projectLocaleData.weekStartsOn,
        };
    }

    shouldComponentUpdate(nextProps: propsTypes) {
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

    handleChange(changeDate: Date) {
        const previouslySelectedValues = this.props.value || [];
        const changeDateInLocalFormat = moment(changeDate).format('L');

        let newValues;
        if (previouslySelectedValues.includes(changeDateInLocalFormat)) {
            newValues = previouslySelectedValues.filter((value: string) => value !== changeDateInLocalFormat);
            if (!newValues || newValues.length === 0) {
                newValues = null;
            }
        } else {
            newValues = [...previouslySelectedValues, changeDateInLocalFormat];
        }

        this.props.onBlur(newValues);
    }

    getValue(inputValues: ?Array<string>) {
        if (!inputValues || inputValues.length === 0) {
            return [];
        }

        const outputDates = inputValues.map((input: string) => {
            const outputDate = moment(input, 'L').toDate();
            return outputDate;
        });

        return outputDates;
    }

    getMinMaxProps() {
        const minMaxProps: {min?: Date, minDate?: Date, max?: Date, maxDate?: Date} = {};

        const minMoment = this.props.minMoment;
        const maxMoment = this.props.maxMoment;

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
        const { value, classes, currentWidth } = this.props;

        return (
            <div
                className={classes.container}
            >
                <InfiniteCalendar
                    {...this.getMinMaxProps()}
                    Component={withMultipleDates(Calendar)}
                    interpolateSelection={defaultMultipleDateInterpolation}
                    selected={this.getValue((value))}
                    onSelect={this.handleChange}
                    locale={this.calendarLocaleData}
                    width={currentWidth}
                    height={400}
                />
            </div>
        );
    }
}

export default withStyles()(DateMulti);

// const DateMultiInMaxWidthContainer = makeMaxWidthContainer(400)(DateMulti);
// theme={DateMulti.calendarTheme}
// export default DateMultiInMaxWidthContainer;
