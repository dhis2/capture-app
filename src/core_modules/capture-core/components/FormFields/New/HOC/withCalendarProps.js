// @flow
import * as React from 'react';
import { parseDate } from 'capture-core-utils/parsers';
import { moment } from 'capture-core-utils/moment';
import { capitalizeFirstLetter } from 'capture-core-utils/string';
import { systemSettingsStore } from '../../../../metaDataMemoryStores';
import getCalendarTheme from '../Fields/DateAndTimeFields/getCalendarTheme';
import CurrentLocaleData from '../../../../utils/localeData/CurrentLocaleData';

type Props = {
    theme: Object,
    calendarWidth?: ?number,
    width: number,
}

export default () => (InnerComponent: React.ComponentType<any>) =>
    class CalendarPropsHOC extends React.Component<Props> {
        static convertValueIntoCalendar(inputValue: ?string) {
            if (!inputValue) {
                return null;
            }

            const parseData = parseDate(inputValue, systemSettingsStore.get().dateFormat);
            if (!parseData.isValid) {
                return null;
            }
            // $FlowSuppress
            return parseData.momentDate.toDate();
        }

        static convertValueOutFromCalendar(changeDate: Date) {
            const dateFormat = systemSettingsStore.get().dateFormat;
            const formattedDateString = moment(changeDate).format(dateFormat);
            return formattedDateString;
        }

        calendarTheme: Object;
        calendarLocaleData: Object;
        constructor(props: Props) {
            super(props);
            this.calendarTheme = getCalendarTheme(this.props.theme);
            const projectLocaleData = CurrentLocaleData.get();
            const calculatedCalendarWidth = this.props.calendarWidth || this.props.width;
            this.calendarLocaleData = {
                locale: projectLocaleData.dateFnsLocale,
                headerFormat: calculatedCalendarWidth >= 400 ?
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
        }

        render() {
            const { theme, ...passOnProps } = this.props;
            return (
                <InnerComponent
                    calendarTheme={this.calendarTheme}
                    calendarLocale={this.calendarLocaleData}
                    calendarOnConvertValueIn={CalendarPropsHOC.convertValueIntoCalendar}
                    calendarOnConvertValueOut={CalendarPropsHOC.convertValueOutFromCalendar}
                    {...passOnProps}
                />
            );
        }
    };
