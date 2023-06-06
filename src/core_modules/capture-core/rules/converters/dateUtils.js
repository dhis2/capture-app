// @flow
/* eslint-disable class-methods-use-this */
import moment from 'moment';
import type { IDateUtils } from '@dhis2/rules-engine-javascript';
import { getFormattedStringFromMomentUsingEuropeanGlyphs } from 'capture-core-utils/date';

const momentFormat = 'YYYY-MM-DD';
const momentRegex = /^\d{4}-\d{2}-\d{2}$/g;

function isDate(rulesDate: ?string) {
    momentRegex.lastIndex = 0;
    return rulesDate && momentRegex.test(rulesDate);
}

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
    daysBetween: (firstRulesDate: ?string, secondRulesDate: ?string): ?number =>
        // $FlowExpectedError
        (isDate(firstRulesDate) && isDate(secondRulesDate) ? between('days', firstRulesDate, secondRulesDate) : null),
    weeksBetween: (firstRulesDate: ?string, secondRulesDate: ?string): ?number =>
        // $FlowExpectedError
        (isDate(firstRulesDate) && isDate(secondRulesDate) ? between('weeks', firstRulesDate, secondRulesDate) : null),
    monthsBetween: (firstRulesDate: ?string, secondRulesDate: ?string): ?number =>
        // $FlowExpectedError
        (isDate(firstRulesDate) && isDate(secondRulesDate) ? between('months', firstRulesDate, secondRulesDate) : null),
    yearsBetween: (firstRulesDate: ?string, secondRulesDate: ?string): ?number =>
        // $FlowExpectedError
        (isDate(firstRulesDate) && isDate(secondRulesDate) ? between('years', firstRulesDate, secondRulesDate) : null),
    addDays: (rulesDate: ?string, daysToAdd: number): ?string => {
        if (!isDate(rulesDate)) {
            return null;
        }
        // $FlowExpectedError
        const dateMoment = rulesDateToMoment(rulesDate);
        const newDateMoment = dateMoment.add(daysToAdd, 'days');
        return momentToRulesDate(newDateMoment);
    },
    compareDates: (firstRulesDate: ?string, secondRulesDate: ?string): number => {
        const diff = dateUtils.daysBetween(secondRulesDate, firstRulesDate);
        if (!diff) {
            return 0;
        }
        if (diff < 0) {
            return -1;
        }
        if (diff > 0) {
            return 1;
        }
        return 0;
    },
};
