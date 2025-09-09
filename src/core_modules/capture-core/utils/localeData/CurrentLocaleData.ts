export type LocaleDataType = {
    dateFnsLocale: any,
    weekDaysShort: string[],
    weekDays: string[],
    selectDatesText: string,
    selectDateText: string,
    calendarFormatHeaderLong: string,
    calendarFormatHeaderShort: string,
    todayLabelShort: string,
    todayLabelLong: string,
    weekStartsOn: number
}

export class CurrentLocaleData {
    private static currentData: LocaleDataType;

    static set(data: LocaleDataType) {
        CurrentLocaleData.currentData = data;
    }
    static get() {
        return CurrentLocaleData.currentData;
    }
}
