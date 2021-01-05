// @flow
/* eslint-disable class-methods-use-this */
import { parseNumber } from 'capture-core-utils/parsers';
import { moment } from 'capture-core-utils/moment';
import type { IConvertInputRulesValue } from '../rulesEngine.types';

const dateMomentFormat = 'YYYY-MM-DD';

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
        if (!value) {
            return '';
        }
        const momentObject = moment(value);
        momentObject.locale('en');
        return momentObject.format(dateMomentFormat);
    }

    convertDateTime(value: any): string {
        return value || '';
    }

    convertTime(value: any): string {
        return value || '';
    }

    convertNumber(value: number | ''): number {
        return value || 0;
    }

    convertInteger(value: number | ''): number {
        return value || 0;
    }

    convertIntegerPositive(value: number | ''): number {
        return value || 0;
    }

    convertIntegerNegative(value: number | ''): number {
        return value || 0;
    }

    convertIntegerZeroOrPositive(value: number | ''): number {
        return value || 0;
    }

    convertPercentage(value: string): number {
        if (!value) {
            return 0;
        }
        const numberValue = parseNumber(value);
        if (isNaN(numberValue)) {
            return 0;
        }

        return numberValue / 100;
    }

    convertUrl(value: any): string {
        return value || '';
    }

    convertAge(value: any): string {
        return this.convertDate(value);
    }
}

export default new RulesValueConverter();
