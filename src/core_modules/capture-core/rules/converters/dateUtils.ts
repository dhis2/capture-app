/* eslint-disable class-methods-use-this */
const moment = require('moment');
import type { IDateUtils } from '@dhis2/rules-engine-javascript';
import { getFormattedStringFromMomentUsingEuropeanGlyphs } from 'capture-core-utils/date';

const momentFormat = 'YYYY-MM-DD';
const momentRegex = /^\d{4}-\d{2}-\d{2}$/g;

function isDate(rulesDate: string | null | undefined) {
    momentRegex.lastIndex = 0;
    return rulesDate && momentRegex.test(rulesDate);
}

function rulesDateToMoment(rulesEngineValue: string): any {
    return moment(rulesEngineValue, momentFormat);
}
function momentToRulesDate(momentObject: any): string {
    return getFormattedStringFromMomentUsingEuropeanGlyphs(momentObject);
}
function between(unit: string, firstRulesDate: string, secondRulesDate: string): number {
    const firstDate = rulesDateToMoment(firstRulesDate);
    const secondDate = rulesDateToMoment(secondRulesDate);
    return secondDate.diff(firstDate, unit);
}

export const dateUtils: IDateUtils = {
    getToday: (): string => {
        const todayMoment = moment();
        return momentToRulesDate(todayMoment);
    },
    daysBetween: (firstRulesDate: string | null | undefined, secondRulesDate: string | null | undefined): number | null =>
        (isDate(firstRulesDate) && isDate(secondRulesDate) ? between('days', firstRulesDate as string, secondRulesDate as string) : null),
    weeksBetween: (firstRulesDate: string | null | undefined, secondRulesDate: string | null | undefined): number | null =>
        (isDate(firstRulesDate) && isDate(secondRulesDate) ? between('weeks', firstRulesDate as string, secondRulesDate as string) : null),
    monthsBetween: (firstRulesDate: string | null | undefined, secondRulesDate: string | null | undefined): number | null =>
        (isDate(firstRulesDate) && isDate(secondRulesDate) ? between('months', firstRulesDate as string, secondRulesDate as string) : null),
    yearsBetween: (firstRulesDate: string | null | undefined, secondRulesDate: string | null | undefined): number | null =>
        (isDate(firstRulesDate) && isDate(secondRulesDate) ? between('years', firstRulesDate as string, secondRulesDate as string) : null),
    addDays: (rulesDate: string | null | undefined, daysToAdd: number): string | null => {
        if (!isDate(rulesDate)) {
            return null;
        }
        const dateMoment = rulesDateToMoment(rulesDate as string);
        const newDateMoment = dateMoment.add(daysToAdd, 'days');
        return momentToRulesDate(newDateMoment);
    },
    compareDates: (firstRulesDate: string | null | undefined, secondRulesDate: string | null | undefined): number => {
        // Empty input dates will be replaced by "MAX_SAFE_INTEGER" when creating the timestamp.
        // This ensures empty input will be bigger than any actual date
        const firstDateTimestamp = firstRulesDate ? moment(firstRulesDate).valueOf() : Number.MAX_SAFE_INTEGER;
        const secondDateTimestamp = secondRulesDate ? moment(secondRulesDate).valueOf() : Number.MAX_SAFE_INTEGER;
        return firstDateTimestamp - secondDateTimestamp;
    },
};
