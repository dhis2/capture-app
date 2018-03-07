// @flow
/* eslint-disable class-methods-use-this */
import type { IConvertOutputRulesEffectsValue } from '../RulesEngine/rulesEngine.types';

class RulesValueConverter implements IConvertOutputRulesEffectsValue {
    convertText(value: string): ?string {
        return value || null;
    }
    convertLongText(value: string): ?string {
        return value || null;
    }
    convertLetter(value: string): ?string {
        return value || null;
    }
    convertPhoneNumber(value: string): ?string {
        return value || null;
    }
    convertEmail(value: string): ?string {
        return value || null;
    }
    convertBoolean(value: boolean): ?string {
        return (value || value === false) ? value : null;
    }
    convertTrueOnly(value: boolean): ?string {
        return (value || value === false) ? value : null;
    }
    convertDate(value: string): string {
        return value;
    }
    convertDateTime(value: string): Object {
        return value;
    }
    convertTime(value: string): string {
        return value;
    }
    convertNumber(value: number): ?string {
        return (value || value === 0) ? value.toString() : null;
    }
    convertInteger(value: number): ?string {
        return (value || value === 0) ? value.toString() : null;
    }
    convertIntegerPositive(value: number): ?string {
        return (value || value === 0) ? value.toString() : null;
    }
    convertIntegerNegative(value: number): ?string {
        return (value || value === 0) ? value.toString() : null;
    }
    convertIntegerZeroOrPositive(value: number): ?string {
        return (value || value === 0) ? value.toString() : null;
    }
    convertPercentage(value: number): ?string {
        return (value || value === 0) ? value.toString() : null;
    }
    convertUrl(value: string): ?string {
        return value ? value : null;
    }
}

export default new RulesValueConverter();
