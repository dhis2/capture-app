// @flow
import moment from 'moment';
import trimQuotes from './trimQuotes';
import type { IMomentConverter } from '../rulesEngine.types';

export default function getDateUtils(converterObject: IMomentConverter) {
    const between = (unit: string, firstRulesDate: string, secondRulesDate: string) => {
        const firsRulesDateTrimmed = trimQuotes(firstRulesDate);
        const secondRulesDateTrimmed = trimQuotes(secondRulesDate);
        const firstDate = converterObject.rulesDateToMoment(firsRulesDateTrimmed);
        const secondDate = converterObject.rulesDateToMoment(secondRulesDateTrimmed);
        return secondDate.diff(firstDate, unit);
    };

    return {
        getToday: () => {
            const todayMoment = moment();
            return converterObject.momentToRulesDate(todayMoment);
        },
        daysBetween: (firstRulesDate: string, secondRulesDate: string) => between('days', firstRulesDate, secondRulesDate),
        weeksBetween: (firstRulesDate: string, secondRulesDate: string) => between('weeks', firstRulesDate, secondRulesDate),
        monthsBetween: (firstRulesDate: string, secondRulesDate: string) => between('months', firstRulesDate, secondRulesDate),
        yearsBetween: (firstRulesDate: string, secondRulesDate: string) => between('years', firstRulesDate, secondRulesDate),
        addDays: (rulesDate: string, daysToAdd: string) => {
            const rulesDateTrimmed = trimQuotes(rulesDate);
            const daysToAddTrimmed = trimQuotes(daysToAdd);
            const dateMoment = converterObject.rulesDateToMoment(rulesDateTrimmed);
            const newDateMoment = dateMoment.add(daysToAddTrimmed, 'days');
            const newRulesDate = converterObject.momentToRulesDate(newDateMoment);
            return `'${newRulesDate}'`;
        },
    };
}
