/* eslint-disable class-methods-use-this */
import moment from 'moment';
import type { IDateUtils } from '@dhis2/rules-engine-javascript';
import { getFormattedStringFromMomentUsingEuropeanGlyphs } from 'capture-core-utils/date';

const momentFormat = 'YYYY-MM-DD';
const momentRegex = /^\d{4}-\d{2}-\d{2}$/g;

function isDate(rulesDate: string | null) {
    momentRegex.lastIndex = 0;
    return rulesDate && momentRegex.test(rulesDate);
}

function rulesDateToMoment(rulesEngineValue: string | null): any {
    return moment(rulesEngineValue, momentFormat);
}
function momentToRulesDate(momentObject: any): string {
    return getFormattedStringFromMomentUsingEuropeanGlyphs(momentObject);
}
function between(unit: string, firstRulesDate: string | null, secondRulesDate: string | null): number {
    const firstDate = rulesDateToMoment(firstRulesDate);
    const secondDate = rulesDateToMoment(secondRulesDate);
    return secondDate.diff(firstDate, unit);
}

export const dateUtils: IDateUtils = {
    getToday: (): string => {
        const todayMoment = moment();
        return momentToRulesDate(todayMoment);
    },
    daysBetween: (firstRulesDate: string | null, secondRulesDate: string | null): number | null =>
        (isDate(firstRulesDate) && isDate(secondRulesDate) ?
            between('days', firstRulesDate, secondRulesDate) : null),
    weeksBetween: (firstRulesDate: string | null, secondRulesDate: string | null): number | null =>
        (isDate(firstRulesDate) && isDate(secondRulesDate) ?
            between('weeks', firstRulesDate, secondRulesDate) : null),
    monthsBetween: (firstRulesDate: string | null, secondRulesDate: string | null): number | null =>
        (isDate(firstRulesDate) && isDate(secondRulesDate) ?
            between('months', firstRulesDate, secondRulesDate) : null),
    yearsBetween: (firstRulesDate: string | null, secondRulesDate: string | null): number | null =>
        (isDate(firstRulesDate) && isDate(secondRulesDate) ?
            between('years', firstRulesDate, secondRulesDate) : null),
    addDays: (rulesDate: string | null, daysToAdd: number): string | null => {
        if (!isDate(rulesDate)) {
            return null;
        }
        const dateMoment = rulesDateToMoment(rulesDate);
        const newDateMoment = dateMoment.add(daysToAdd, 'days');
        return momentToRulesDate(newDateMoment);
    },
    compareDates: (firstRulesDate: string | null, secondRulesDate: string | null): number => {
        // Empty input dates will be replaced by "MAX_SAFE_INTEGER" when creating the timestamp.
        // This ensures empty input will be bigger than any actual date
        const firstDateTimestamp = firstRulesDate ? moment(firstRulesDate).valueOf() : Number.MAX_SAFE_INTEGER;
        const secondDateTimestamp = secondRulesDate ? moment(secondRulesDate).valueOf() : Number.MAX_SAFE_INTEGER;
        return firstDateTimestamp - secondDateTimestamp;
    },
};
