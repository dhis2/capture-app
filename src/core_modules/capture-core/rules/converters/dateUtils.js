// @flow
import moment from 'moment';
import { trimQuotes } from 'capture-core-utils/rulesEngine/commonUtils/trimQuotes';
import type { IDateUtils } from 'capture-core-utils/rulesEngine/rulesEngine.types';
import { getFormattedStringFromMomentUsingEuropeanGlyphs } from 'capture-core-utils/date';

const momentFormat = 'YYYY-MM-DD';

class DateUtils implements IDateUtils {
    // "private"
    rulesDateToMoment(rulesEngineValue: string): moment$Moment {
        return moment(rulesEngineValue, momentFormat);
    }
    momentToRulesDate(momentObject: moment$Moment): string {
        return getFormattedStringFromMomentUsingEuropeanGlyphs(momentObject);
    }
    between(unit: string, firstRulesDate: string, secondRulesDate: string): number {
        const firsRulesDateTrimmed = trimQuotes(firstRulesDate);
        const secondRulesDateTrimmed = trimQuotes(secondRulesDate);
        const firstDate = this.rulesDateToMoment(firsRulesDateTrimmed);
        const secondDate = this.rulesDateToMoment(secondRulesDateTrimmed);
        return secondDate.diff(firstDate, unit);
    };

    // "public"
    getToday(): string {
        const todayMoment = moment();
        return this.momentToRulesDate(todayMoment);
    }
    daysBetween(firstRulesDate: string, secondRulesDate: string): string {
        return this.between('days', firstRulesDate, secondRulesDate).toString();
    }
    weeksBetween(firstRulesDate: string, secondRulesDate: string): string {
        return this.between('weeks', firstRulesDate, secondRulesDate).toString();
    }
    monthsBetween(firstRulesDate: string, secondRulesDate: string): string {
        return this.between('months', firstRulesDate, secondRulesDate).toString();
    }
    yearsBetween(firstRulesDate: string, secondRulesDate: string): string {
        return this.between('years', firstRulesDate, secondRulesDate).toString();
    }
    addDays(rulesDate: string, daysToAdd: string): string {
        const rulesDateTrimmed = trimQuotes(rulesDate);
        const daysToAddTrimmed = trimQuotes(daysToAdd);
        const dateMoment = this.rulesDateToMoment(rulesDateTrimmed);
        const newDateMoment = dateMoment.add(daysToAddTrimmed, 'days');
        const newRulesDate = this.momentToRulesDate(newDateMoment);
        return `'${newRulesDate}'`;
    }
}

export const dateUtils = new DateUtils();
