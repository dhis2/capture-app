// @flow
/* eslint-disable class-methods-use-this */
import { moment } from 'capture-core-utils/moment';
import type { IConvertInputRulesValue } from 'capture-core-utils/RulesEngine/rulesEngine.types';

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

    convertAge(value: any): string {
        return this.convertDate(value);
    }
}

export default new RulesValueConverter();
