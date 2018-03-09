// @flow
/* eslint-disable class-methods-use-this */
import type { IConvertInputRulesValue } from '../RulesEngine/rulesEngine.types';

class RulesValueConverter implements IConvertInputRulesValue {
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

    convertBoolean(value: any): boolean | string {
        return (value || value === false) ? value : '';
    }

    convertTrueOnly(value: any): boolean | string {
        return (value || value === false) ? value : '';
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

    convertNumber(value: any): number | string {
        return (value || value === 0) ? value : '';
    }

    convertInteger(value: any): number | string {
        return (value || value === 0) ? value : '';
    }

    convertIntegerPositive(value: any): number | string {
        return (value || value === 0) ? value : '';
    }

    convertIntegerNegative(value: any): number | string {
        return (value || value === 0) ? value : '';
    }

    convertIntegerZeroOrPositive(value: any): number | string {
        return (value || value === 0) ? value : '';
    }

    convertPercentage(value: any): number | string {
        return (value || value === 0) ? value : '';
    }

    convertUrl(value: any): string {
        return value || '';
    }
}

export default new RulesValueConverter();
