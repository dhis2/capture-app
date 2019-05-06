// @flow
export type LocaleDataType = {
    dateFnsLocale: Object,
    weekDaysShort: Array<string>,
    weekDays: Array<string>,
    selectDatesText: string,
    selectDateText: string,
    calendarFormatHeaderLong: string,
    calendarFormatHeaderShort: string,
    todayLabelShort: string,
    todayLabelLong: string,
    weekStartsOn: number
}

export default class CurrentLocaleData {
    static currentData;

    static set(data: LocaleDataType) {
        CurrentLocaleData.currentData = data;
    }
    static get() {
        return CurrentLocaleData.currentData;
    }
}
