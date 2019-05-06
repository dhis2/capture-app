// @flow
/* eslint-disable class-methods-use-this */
import moment from 'moment';
import type { IConvertOutputRulesEffectsValue } from '../RulesEngine/rulesEngine.types';

const dateMomentFormat = 'YYYY-MM-DD';

class RulesValueConverter implements IConvertOutputRulesEffectsValue {
    convertText(value: string): string {
        return value;
    }
    convertLongText(value: string): string {
        return value;
    }
    convertLetter(value: string): string {
        return value;
    }
    convertPhoneNumber(value: string): string {
        return value;
    }
    convertEmail(value: string): string {
        return value;
    }
    convertBoolean(value: boolean): boolean {
        return value;
    }
    convertTrueOnly(value: boolean): boolean {
        return value;
    }
    convertDate(value: string): string {
        if (!value) {
            return value;
        }
        const momentDate = moment(value, dateMomentFormat);
        return momentDate.format('L');
    }
    convertDateTime(value: string): ?Object {
        if (!value) {
            return null;
        }
        const momentDateTime = moment(value);
        return {
            date: momentDateTime.format('L'),
            time: momentDateTime.format('LT'),
        };
    }
    convertTime(value: string): string {
        return value;
    }
    convertNumber(value: number): string {
        return value.toString();
    }
    convertInteger(value: number): string {
        return value.toString();
    }
    convertIntegerPositive(value: number): string {
        return value.toString();
    }
    convertIntegerNegative(value: number): string {
        return value.toString();
    }
    convertIntegerZeroOrPositive(value: number): string {
        return value.toString();
    }
    convertPercentage(value: number): string {
        return value.toString();
    }
    convertUrl(value: string): string {
        return value;
    }
    convertAge(value: string): ?Object {
        if (!value) {
            return null;
        }
        const now = moment();
        const age = moment(value);

        const years = now.diff(age, 'years');
        age.add(years, 'years');

        const months = now.diff(age, 'months');
        age.add(months, 'months');

        const days = now.diff(age, 'days');

        return {
            // $FlowSuppress
            date: moment(value).format('L'),
            years: years.toString(),
            months: months.toString(),
            days: days.toString(),
        };
    }
}

export default new RulesValueConverter();
