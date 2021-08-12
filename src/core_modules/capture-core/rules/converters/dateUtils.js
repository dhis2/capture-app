// @flow
/* eslint-disable class-methods-use-this */
import moment from 'moment';
import { trimQuotes } from 'capture-core-utils/rulesEngine/commonUtils/trimQuotes';
import type { IDateUtils } from 'capture-core-utils/rulesEngine/rulesEngine.types';
import { getFormattedStringFromMomentUsingEuropeanGlyphs } from 'capture-core-utils/date';

const momentFormat = 'YYYY-MM-DD';

function rulesDateToMoment(rulesEngineValue: string): moment$Moment {
    return moment(rulesEngineValue, momentFormat);
}
function momentToRulesDate(momentObject: moment$Moment): string {
    return getFormattedStringFromMomentUsingEuropeanGlyphs(momentObject);
}
function between(unit: string, firstRulesDate: string, secondRulesDate: string): number {
    const firsRulesDateTrimmed = trimQuotes(firstRulesDate);
    const secondRulesDateTrimmed = trimQuotes(secondRulesDate);
    const firstDate = rulesDateToMoment(firsRulesDateTrimmed);
    const secondDate = rulesDateToMoment(secondRulesDateTrimmed);
    return secondDate.diff(firstDate, unit);
}

class DateUtils implements IDateUtils {
    getToday(): string {
        const todayMoment = moment();
        return momentToRulesDate(todayMoment);
    }
    daysBetween(firstRulesDate: string, secondRulesDate: string): number {
        return between('days', firstRulesDate, secondRulesDate);
    }
    weeksBetween(firstRulesDate: string, secondRulesDate: string): number {
        return between('weeks', firstRulesDate, secondRulesDate);
    }
    monthsBetween(firstRulesDate: string, secondRulesDate: string): number {
        return between('months', firstRulesDate, secondRulesDate);
    }
    yearsBetween(firstRulesDate: string, secondRulesDate: string): number {
        return between('years', firstRulesDate, secondRulesDate);
    }
    addDays(rulesDate: string, daysToAdd: string): string {
        const rulesDateTrimmed = trimQuotes(rulesDate);
        const daysToAddTrimmed = trimQuotes(daysToAdd);
        const dateMoment = rulesDateToMoment(rulesDateTrimmed);
        const newDateMoment = dateMoment.add(daysToAddTrimmed, 'days');
        const newRulesDate = momentToRulesDate(newDateMoment);
        return `'${newRulesDate}'`;
    }
}

export const dateUtils = new DateUtils();
