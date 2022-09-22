// @flow
import moment from 'moment';
import type { IMomentConverter } from '../rulesEngine.types';

export default function getDateUtils(converterObject: IMomentConverter) {
    const between = (unit: string, firstRulesDate: string, secondRulesDate: string) => {
        const firstDate = converterObject.rulesDateToMoment(firstRulesDate);
        const secondDate = converterObject.rulesDateToMoment(secondRulesDate);
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
        addDays: (rulesDate: string, daysToAdd: number) => {
            const dateMoment = converterObject.rulesDateToMoment(rulesDate);
            const newDateMoment = dateMoment.add(daysToAdd, 'days');
            return converterObject.momentToRulesDate(newDateMoment);
        },
    };
}
