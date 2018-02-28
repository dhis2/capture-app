// @flow
/* eslint-disable class-methods-use-this */
import type { IConvertRulesValue } from '../../RulesEngine/rulesEngine.types';

class RulesValueConverter implements IConvertRulesValue {
    convertText(value: any): string {
        return value || '';
    }

    convertLongText(value: any): string {
        return value || '';
    }
    
    convertLetter(value: any): string {
        return value || '';
    }

    convertPhoneNumber(value: any): string {
        return value || '';
    }

    convertEmail(value: any): string {
        return value || '';
    }

    convertBoolean(value: any): boolean {
        return value;
    }

    convertTrueOnly(value: any): boolean {
        return (value === true);
    }

    convertDate(value: any): string {
        return value || '';
    }

    convertDateTime(value: any): string {
        return value || '';
    }

    convertTime(value: any): string {
        return value || '';
    }

    convertNumber(value: any): number {
        return value;
    }

    convertInteger(value: any): number {
        return value;
    }

    convertIntegerPositive(value: any): number {
        return value;
    }

    convertIntegerNegative(value: any): number {
        return value;
    }

    convertIntegerZeroOrPositive(value: any): number {
        return value;
    }

    convertPercentage(value: any): number {
        return value;
    }

    convertUrl(value: any): string {
        return value || '';
    }
}

export default new RulesValueConverter();
