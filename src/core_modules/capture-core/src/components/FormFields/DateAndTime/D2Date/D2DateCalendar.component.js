// @flow
/* eslint-disable class-methods-use-this */
import React, { Component } from 'react';
import { withStyles, withTheme } from '@material-ui/core/styles';
import InfiniteCalendar from 'react-infinite-calendar';

import 'react-infinite-calendar/styles.css';
import './customStyles.css';

import isValidDate from '../../../../utils/validators/form/date.validator';
import moment from '../../../../utils/moment/momentResolver';
import CurrentLocaleData from '../../../../utils/localeData/CurrentLocaleData';
import capitalizeFirstLetter from '../../../../utils/string/capitalizeFirstLetter';
import getTheme from './getTheme';

// import makeMaxWidthContainer from 'abaris-ui/src/HOC/makeMaxWidthContainer';

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
    static displayOptions = {
        showHeader: false,
    };

    handleChange: (e: any, dates: ?Array<Date>) => void;
    calendarLocaleData: Object;
    theme: Object;
    displayOptions: Object;

    constructor(props: Props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);

        const projectLocaleData = CurrentLocaleData.get();
        const currentWidth = this.props.currentWidth;

        this.calendarLocaleData = {
            locale: projectLocaleData.dateFnsLocale,
            headerFormat: currentWidth >= 400 ?
                projectLocaleData.calendarFormatHeaderLong :
                projectLocaleData.calendarFormatHeaderShort,
            weekdays: projectLocaleData.weekDaysShort.map(day => capitalizeFirstLetter(day)),
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

    handleChange(changeDate: Date) {
        const changeDateInLocalFormat = moment(changeDate).format('L');
        this.props.onDateSelected(changeDateInLocalFormat);
    }

    getValue(inputValue: ?string) {
        if (!inputValue) {
            return null;
        }

        if (!isValidDate(inputValue)) {
            return null;
        }

        const momentDate = moment(inputValue, 'L');
        return momentDate.toDate();
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
            <div
                className={classes.container}
            >
                <InfiniteCalendar
                    {...this.getMinMaxProps()}
                    selected={this.getValue((value))}
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
