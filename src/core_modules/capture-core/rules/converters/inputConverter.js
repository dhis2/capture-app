// @flow
/* eslint-disable class-methods-use-this */
import log from 'loglevel';
import { moment } from 'capture-core-utils/moment';
import type { IConvertInputRulesValue } from 'capture-core-utils/rulesEngine/rulesEngine.types';

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

    convertUnitInterval(value: number | ''): number {
        return value || 0;
    }

    convertPercentage(value: number | ''): number {
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

    convertTrackerAssociate(value: any): string {
        log.warn('convertTrackerAssociate not implemented', value);
        return '';
    }

    convertUserName(value: any): string {
        log.warn('convertUserName not implemented', value);
        return '';
    }

    convertCoordinate(value: any): string {
        log.warn('convertCoordinate not implemented', value);
        return '';
    }

    convertOrganisationUnit(value: any): string {
        log.warn('convertOrganisationUnit not implemented', value);
        return '';
    }

    convertAge(value: any): string {
        return this.convertDate(value);
    }

    convertUrl(value: any): string {
        return value || '';
    }

    convertFile(value: any): string {
        log.warn('convertFile not implemented', value);
        return '';
    }

    convertImage(value: any): string {
        log.warn('convertImage not implemented', value);
        return '';
    }
}

export const inputConverter = new RulesValueConverter();
