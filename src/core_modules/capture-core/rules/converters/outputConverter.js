// @flow
/* eslint-disable class-methods-use-this */
import log from 'loglevel';
import moment from 'moment';
import type { IConvertOutputRulesEffectsValue } from 'capture-core-utils/rulesEngine/rulesEngine.types';
import { convertMomentToDateFormatString } from '../../utils/converters/date';

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

    convertBoolean(value: boolean): string {
        return value ? 'true' : 'false';
    }

    convertTrueOnly(): string {
        return 'true';
    }

    convertDate(value: string): string {
        const momentDate = moment(value, dateMomentFormat);
        return convertMomentToDateFormatString(momentDate);
    }

    convertDateTime(value: string): ?Object {
        const momentDateTime = moment(value);
        return {
            date: convertMomentToDateFormatString(momentDateTime),
            time: momentDateTime.format('HH:mm'),
        };
    }

    convertTime(value: string): string {
        return value;
    }

    convertNumber(value: number): string {
        return value.toString();
    }

    convertUnitInterval(value: number): string {
        return value.toString();
    }

    convertPercentage(value: number): string {
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

    convertTrackerAssociate(value: string): any {
        log.warn('convertTrackerAssociate not implemented', value);
        return '';
    }

    convertUserName(value: string): any {
        log.warn('convertUserName not implemented', value);
        return '';
    }

    convertCoordinate(value: string): any {
        log.warn('convertCoordinate not implemented', value);
        return '';
    }

    convertOrganisationUnit(value: string): any {
        log.warn('convertOrganisationUnit not implemented', value);
        return '';
    }

    convertAge(value: string): Object {
        const now = moment();
        const age = moment(value, dateMomentFormat);

        const years = now.diff(age, 'years');
        age.add(years, 'years');

        const months = now.diff(age, 'months');
        age.add(months, 'months');

        const days = now.diff(age, 'days');

        return {
            date: convertMomentToDateFormatString(moment(value, dateMomentFormat)),
            years: years.toString(),
            months: months.toString(),
            days: days.toString(),
        };
    }

    convertUrl(value: string): string {
        return value;
    }

    convertFile(value: string): any {
        log.warn('convertFile not implemented', value);
        return '';
    }

    convertImage(value: string): any {
        log.warn('convertImage not implemented', value);
        return '';
    }
}

export const outputConverter = new RulesValueConverter();
