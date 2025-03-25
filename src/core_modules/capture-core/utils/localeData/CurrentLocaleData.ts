export type LocaleDataType = {
    dateFnsLocale: Record<string, unknown>;
    weekDaysShort: string[];
    weekDays: string[];
    selectDatesText: string;
    selectDateText: string;
    calendarFormatHeaderLong: string;
    calendarFormatHeaderShort: string;
    todayLabelShort: string;
    todayLabelLong: string;
    weekStartsOn: number;
};

export class CurrentLocaleData {
    private static currentData: LocaleDataType;

    static set(data: LocaleDataType): void {
        CurrentLocaleData.currentData = data;
    }

    static get(): LocaleDataType {
        return CurrentLocaleData.currentData;
    }
}
