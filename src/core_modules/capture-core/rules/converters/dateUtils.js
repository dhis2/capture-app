// @flow
/* eslint-disable class-methods-use-this */
import moment from 'moment';
import type { IDateUtils } from 'rules-engine';
import { getFormattedStringFromMomentUsingEuropeanGlyphs } from 'capture-core-utils/date';

const momentFormat = 'YYYY-MM-DD';

function rulesDateToMoment(rulesEngineValue: string): moment$Moment {
    return moment(rulesEngineValue, momentFormat);
}
function momentToRulesDate(momentObject: moment$Moment): string {
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
    daysBetween: (firstRulesDate: string, secondRulesDate: string): number =>
        between('days', firstRulesDate, secondRulesDate),
    weeksBetween: (firstRulesDate: string, secondRulesDate: string): number =>
        between('weeks', firstRulesDate, secondRulesDate),
    monthsBetween: (firstRulesDate: string, secondRulesDate: string): number =>
        between('months', firstRulesDate, secondRulesDate),
    yearsBetween: (firstRulesDate: string, secondRulesDate: string): number =>
        between('years', firstRulesDate, secondRulesDate),
    addDays: (rulesDate: string, daysToAdd: number): string => {
        const dateMoment = rulesDateToMoment(rulesDate);
        const newDateMoment = dateMoment.add(daysToAdd, 'days');
        return momentToRulesDate(newDateMoment);
    },
    compareDates: (firstRulesDate: string, secondRulesDate: string): number => {
        const diff = dateUtils.daysBetween(secondRulesDate, firstRulesDate);
        if (diff < 0) {
            return -1;
        }
        if (diff > 0) {
            return 1;
        }
        return 0;
    },
};
