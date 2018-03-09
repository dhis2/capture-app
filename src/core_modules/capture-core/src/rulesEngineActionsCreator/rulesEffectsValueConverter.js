// @flow
/* eslint-disable class-methods-use-this */
import type { IConvertOutputRulesEffectsValue } from '../RulesEngine/rulesEngine.types';

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
        return value;
    }
    convertDateTime(value: string): Object {
        return value;
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
}

export default new RulesValueConverter();
